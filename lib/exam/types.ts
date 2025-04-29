import { z } from 'zod';
import { ExamType } from '../constants';

// Base interface for all exam difficulty levels
export interface ExamDifficulty {
  id: string;
  name: string;
  description: string;
  level: number; // Numerical representation for comparison
}

// Specific difficulty levels for each exam type
export interface IELTSDifficulty extends ExamDifficulty {
  band: number; // IELTS uses bands from 1-9
  descriptor: string; // e.g., "Basic User", "Competent User", etc.
}

export interface GoetheDifficulty extends ExamDifficulty {
  cefr: string; // Goethe uses CEFR levels (A1, A2, B1, B2, C1, C2)
  certificate: string; // e.g., "Goethe-Zertifikat A1: Start Deutsch 1"
  isImplemented?: boolean; // Indicates whether this level has been implemented
}

// Base interface for all exam handlers
export interface ExamHandler {
  getExamType(): ExamType;
  getDifficultyLevels(): ExamDifficulty[];
  getDefaultDifficulty(): ExamDifficulty;
  getDifficultyById(id: string): ExamDifficulty | undefined;
}

// Base interface specifically for reading exam components
export interface ReadingExamHandler extends ExamHandler {
  getPassagePrompt(difficulty: ExamDifficulty): string;
  getQuestionsPrompt(difficulty: ExamDifficulty, passage: string): string;
  getPassageSchema(): z.ZodObject<any>;
  getQuestionsSchema(): z.ZodObject<any>;
  
  // UI component retrieval
  getUIComponent(): any;
}

// Base schema definitions
export const basePassageSchema = z.object({
  title: z.string(),
  content: z.string()
});

export const baseQuestionSchema = z.object({
  id: z.number(),
  text: z.string(),
  options: z.array(z.string()).length(4),
  correctAnswer: z.number().min(0).max(3)
});

export const baseQuestionsSchema = z.object({
  questions: z.array(baseQuestionSchema).min(3)
}); 