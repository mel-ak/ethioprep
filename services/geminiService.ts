
import { GoogleGenAI, Type } from "@google/genai";
import { Subject, Question } from "../types.ts";

const getAI = () => new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const generateQuestions = async (subject: Subject, count: number = 5): Promise<Question[]> => {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Generate ${count} multiple-choice questions for the Ethiopian University Entrance Exam (EHEECE) for the subject of ${subject}. Ensure they reflect the actual curriculum standards. Provide clear explanations for the solutions.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            questionText: { type: Type.STRING },
            options: { 
              type: Type.ARRAY, 
              items: { type: Type.STRING },
              minItems: 4,
              maxItems: 4
            },
            correctAnswerIndex: { type: Type.INTEGER },
            explanation: { type: Type.STRING },
            difficulty: { type: Type.STRING, enum: ['Easy', 'Medium', 'Hard'] }
          },
          required: ["questionText", "options", "correctAnswerIndex", "explanation", "difficulty"]
        }
      }
    }
  });

  try {
    const rawQuestions = JSON.parse(response.text || '[]');
    return rawQuestions.map((q: any, index: number) => ({
      ...q,
      id: `${subject}-${Date.now()}-${index}`,
      subject
    }));
  } catch (error) {
    console.error("Failed to parse AI response:", error);
    return [];
  }
};

export const generateWorksheet = async (subject: Subject, topic: string): Promise<string> => {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: "gemini-3-pro-preview",
    contents: `Create a detailed study worksheet for Ethiopian students preparing for their entrance exam. 
    Subject: ${subject}
    Topic: ${topic}
    Include:
    1. Key Formulas/Concepts Summary
    2. 3 Solved Example Problems with step-by-step logic
    3. 5 Practice Exercises (without answers immediately, but mention they should try them).
    Format the output in clean Markdown.`,
  });

  return response.text || "Failed to generate worksheet content.";
};

export const solveProblem = async (problemText: string): Promise<string> => {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: "gemini-3-pro-preview",
    contents: `You are an expert tutor for the Ethiopian University Entrance Exam. Solve this problem step-by-step and explain the underlying concepts clearly: \n\n${problemText}`,
  });

  return response.text || "Unable to solve this problem at the moment.";
};
