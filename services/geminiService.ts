import { GoogleGenAI, Type } from "@google/genai";
import { Subject, Question } from "../types.ts";

// Access the API key strictly from the environment
const API_KEY = process.env.API_KEY || 'AIzaSyAWVysiPEohH4GVdx7uN9nF7YKTpHk_Jrk';

const getAI = () => new GoogleGenAI({ apiKey: API_KEY });

/**
 * Strict instructions to avoid LaTeX and mathematical formatting symbols.
 * Focuses on pure keyboard-entry style text.
 */
const PLAIN_TEXT_MATH_PROMPT = `
CRITICAL FORMATTING RULE: 
- DO NOT use LaTeX, backslashes (\), or dollar signs ($). 
- DO NOT use bracketed math symbols like \frac or \theta.
- Use standard keyboard characters ONLY.
- Multiplication: use *
- Division: use /
- Powers: use ^ (e.g., 10^2)
- Square root: use sqrt()
- Greek letters: write them out in English (e.g., 'theta', 'pi', 'delta').
- Subscripts: use underscore (e.g., v_0).
- NEVER use markers like [math] or $$ or \( \).
`;

/**
 * Helper to retry API calls on 500/Rpc errors
 */
async function withRetry<T>(fn: () => Promise<T>, retries = 3, delay = 1000): Promise<T> {
  try {
    return await fn();
  } catch (error: any) {
    const isRpcError = error?.message?.includes('500') || error?.message?.includes('Rpc') || error?.message?.includes('Proxy');
    if (retries > 0 && isRpcError) {
      console.warn(`API error encountered, retrying... (${retries} left)`);
      await new Promise(resolve => setTimeout(resolve, delay));
      return withRetry(fn, retries - 1, delay * 2);
    }
    throw error;
  }
}

export const generateQuestions = async (subject: Subject, count: number = 5): Promise<Question[]> => {
  const ai = getAI();
  return withRetry(async () => {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Generate ${count} multiple-choice questions for the Ethiopian University Entrance Exam (EHEECE) for ${subject}. 
      ${PLAIN_TEXT_MATH_PROMPT}
      Ensure the difficulty is appropriate for Grade 12.`,
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

    const rawQuestions = JSON.parse(response.text || '[]');
    return rawQuestions.map((q: any, index: number) => ({
      ...q,
      id: `${subject}-${Date.now()}-${index}`,
      subject
    }));
  });
};

export const generateWorksheet = async (subject: Subject, topic: string): Promise<string> => {
  const ai = getAI();
  return withRetry(async () => {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Create a detailed study worksheet for Ethiopian students. 
      Subject: ${subject}
      Topic: ${topic}
      ${PLAIN_TEXT_MATH_PROMPT}
      Include:
      1. Concept Summary (plain text)
      2. 3 Examples with keyboard-only math steps
      3. 5 Practice questions.
      Format in Markdown.`,
    });
    return response.text || "Failed to generate worksheet.";
  });
};

export const solveProblem = async (problemText: string): Promise<string> => {
  const ai = getAI();
  return withRetry(async () => {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `You are an expert tutor for the Ethiopian University Entrance Exam. Solve this problem step-by-step.
      ${PLAIN_TEXT_MATH_PROMPT}
      Rules:
      - Use ONLY standard keyboard symbols.
      - No backslashes, no dollar signs, no curly braces.
      - Explain precisely how to reach the answer.
      
      Problem to solve:
      ${problemText}`,
    });
    return response.text || "Unable to solve this problem at the moment.";
  });
};