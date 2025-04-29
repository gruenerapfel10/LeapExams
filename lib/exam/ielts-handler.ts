import { z } from 'zod';
import { EXAM_TYPES } from '../constants';
import { BaseExamHandler } from './base-handler';
import { ExamDifficulty, IELTSDifficulty } from './types';

// IELTS-specific passage schema
export const ieltsPassageSchema = z.object({
  title: z.string(),
  content: z.string(),
  sections: z.array(z.object({
    heading: z.string().optional(),
    content: z.string()
  })).optional(),
  vocabularyNotes: z.array(z.object({
    term: z.string(),
    definition: z.string(),
    example: z.string().optional()
  })).optional()
});

// IELTS-specific question schema
export const ieltsQuestionSchema = z.object({
  id: z.number(),
  text: z.string(),
  options: z.array(z.string()).length(4),
  correctAnswer: z.number().min(0).max(3),
  questionType: z.enum(['multiple-choice', 'true-false-notgiven', 'matching', 'completion']).optional(),
  explanation: z.string().optional()
});

export const ieltsQuestionsSchema = z.object({
  questions: z.array(ieltsQuestionSchema).min(3)
});

/**
 * IELTS exam handler implementing the specific logic for IELTS exams
 */
export class IELTSExamHandler extends BaseExamHandler {
  protected examType = EXAM_TYPES.IELTS;
  
  // IELTS specific difficulty levels (bands 1-9)
  protected difficultyLevels: IELTSDifficulty[] = [
    {
      id: 'band-4-5',
      name: 'Band 4-5',
      description: 'Limited English proficiency suitable for basic communication',
      level: 1,
      band: 4.5,
      descriptor: 'Limited User'
    },
    {
      id: 'band-5-6',
      name: 'Band 5-6',
      description: 'Modest English proficiency for partial communication in many contexts',
      level: 2,
      band: 5.5,
      descriptor: 'Modest User'
    },
    {
      id: 'band-6-7',
      name: 'Band 6-7',
      description: 'Competent English proficiency for general effective communication',
      level: 3,
      band: 6.5,
      descriptor: 'Competent User'
    },
    {
      id: 'band-7-8',
      name: 'Band 7-8',
      description: 'Good English proficiency with occasional inaccuracies',
      level: 4,
      band: 7.5,
      descriptor: 'Good User'
    },
    {
      id: 'band-8-9',
      name: 'Band 8-9',
      description: 'Very good to expert English proficiency',
      level: 5,
      band: 8.5,
      descriptor: 'Expert User'
    }
  ];
  
  getPassagePrompt(difficulty: ExamDifficulty): string {
    const ieltsLevel = difficulty as IELTSDifficulty;
    
    return `${this.getBasePassagePrompt(difficulty)}
    
    Additional IELTS-specific requirements:
    - Create a passage suitable for IELTS Academic Reading Test at Band ${ieltsLevel.band} level
    - Content should be 350-450 words with an academic tone
    - The passage should be divided into 2-3 sections with optional headings
    - Include complex sentence structures appropriate for Band ${ieltsLevel.band}
    - Use academic vocabulary typical of IELTS reading tests
    - Cover topics like science, social sciences, environment, or current affairs
    - The content should be factual and informative
    - Include some specialized vocabulary items that would be appropriate for testing
    
    Return the passage with clear sections and appropriate academic language for IELTS.`;
  }
  
  getQuestionsPrompt(difficulty: ExamDifficulty, passage: string): string {
    const ieltsLevel = difficulty as IELTSDifficulty;
    
    return `${this.getBaseQuestionsPrompt(difficulty, passage)}
    
    Additional IELTS-specific requirements:
    - Generate 5 questions suitable for IELTS Band ${ieltsLevel.band} level
    - Include a mix of question types typical for IELTS: 
      - Multiple choice questions that test deep comprehension
      - Questions that may require inference from the text
    - Each question should require careful reading of the passage
    - Some questions should test vocabulary in context
    - Questions should increase in difficulty as they progress
    - For each question, add a brief explanation of why the correct answer is correct
    - Questions should match the difficulty level expected for Band ${ieltsLevel.band}`;
  }
  
  getPassageSchema(): z.ZodObject<any> {
    return ieltsPassageSchema;
  }
  
  getQuestionsSchema(): z.ZodObject<any> {
    return ieltsQuestionsSchema;
  }
  
  getUIComponent(): any {
    // This would return the actual UI component for IELTS
    // For now returning a string name, to be implemented in the UI code
    return 'IELTSReadingUI';
  }
} 