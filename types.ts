
export enum Subject {
  MATH = 'Mathematics',
  PHYSICS = 'Physics',
  CHEMISTRY = 'Chemistry',
  BIOLOGY = 'Biology',
  APTITUDE = 'Aptitude',
  ENGLISH = 'English',
  CIVICS = 'Civics',
  GEOGRAPHY = 'Geography',
  HISTORY = 'History'
}

export interface Question {
  id: string;
  subject: Subject;
  questionText: string;
  options: string[];
  correctAnswerIndex: number;
  explanation: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
}

export interface QuizSession {
  subject: Subject;
  questions: Question[];
  currentQuestionIndex: number;
  answers: number[]; // Index of selected options
  startTime: number;
  isCompleted: boolean;
}

export interface PerformanceStats {
  subject: Subject;
  totalQuizzes: number;
  averageScore: number;
  lastScore: number;
}

export interface Worksheet {
  id: string;
  title: string;
  subject: Subject;
  topic: string;
  content: string; // Markdown content
  date: string;
}
