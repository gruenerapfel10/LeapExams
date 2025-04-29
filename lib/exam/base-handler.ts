import { z } from 'zod';
import { ExamType, EXAM_LANGUAGES } from '../constants';
import { 
  ExamDifficulty, 
  ReadingExamHandler, 
  basePassageSchema, 
  baseQuestionsSchema 
} from './types';

/**
 * Base abstract class for all exam handlers
 * Implements common functionality and defines abstract methods that must be implemented by subclasses
 */
export abstract class BaseExamHandler implements ReadingExamHandler {
  protected abstract examType: ExamType;
  protected abstract difficultyLevels: ExamDifficulty[];
  
  // Implementation of the ExamHandler interface
  getExamType(): ExamType {
    return this.examType;
  }
  
  getDifficultyLevels(): ExamDifficulty[] {
    return this.difficultyLevels;
  }
  
  getDefaultDifficulty(): ExamDifficulty {
    return this.difficultyLevels[0];
  }
  
  getDifficultyById(id: string): ExamDifficulty | undefined {
    return this.difficultyLevels.find(d => d.id === id);
  }
  
  // Base implementation of the ReadingExamHandler interface
  getPassageSchema(): z.ZodObject<any> {
    return basePassageSchema;
  }
  
  getQuestionsSchema(): z.ZodObject<any> {
    return baseQuestionsSchema;
  }
  
  // Common base prompt logic
  protected getBasePassagePrompt(difficulty: ExamDifficulty): string {
    const language = EXAM_LANGUAGES[this.examType];
    
    return `Generate a reading passage for ${this.examType.toUpperCase()} reading practice with the following requirements:
    - The content should be at ${difficulty.name} level
    - Title should be clear and descriptive
    - Content should be appropriate length for ${difficulty.name} level
    - Use language appropriate for ${difficulty.name} level
    - IMPORTANT: The entire passage MUST be written in ${language.name} language (${language.code})
    - Include appropriate paragraphs and structure
    - Focus on a single main idea with supporting details
    - The passage should be culturally appropriate for ${language.name} speakers`;
  }
  
  protected getBaseQuestionsPrompt(difficulty: ExamDifficulty, passage: string): string {
    const language = EXAM_LANGUAGES[this.examType];
    
    return `Based on the following passage, generate multiple-choice questions in ${language.name} appropriate for ${difficulty.name} level. Each question must have exactly 4 options and one correct answer (0-3).
    
    Passage:
    ${passage}

    Requirements:
    - Generate questions appropriate for ${difficulty.name} level
    - IMPORTANT: All questions and options MUST be written ONLY in ${language.name} language (${language.code})
    - Each question must have exactly 4 options
    - The correctAnswer must be a number between 0 and 3 (index of the correct option)
    - Questions should test comprehension of the main ideas and key details
    - Options should be plausible but only one should be correct
    - Questions should be culturally appropriate for ${language.name} speakers`;
  }
  
  // Abstract methods that must be implemented by concrete subclasses
  abstract getPassagePrompt(difficulty: ExamDifficulty): string;
  abstract getQuestionsPrompt(difficulty: ExamDifficulty, passage: string): string;
  abstract getUIComponent(): any;
} 