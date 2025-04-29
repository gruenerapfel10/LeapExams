import { streamObject } from 'ai';
import { myProvider } from '../ai/models';
import { ExamType } from '../constants';
import { ExamDifficulty } from './types';
import { ExamHandlerFactory } from './factory';
import { UnimplementedLevelError } from './goethe-handler';

/**
 * Service class for interacting with the exam system
 * This provides a clean API for the frontend to use
 */
export class ExamService {
  /**
   * Stream a reading passage for the given exam type and difficulty
   */
  static streamReadingPassage(examType: ExamType, difficultyId: string) {
    // Get the handler for this exam type
    const handler = ExamHandlerFactory.getHandler(examType);
    
    // Get the difficulty level
    const difficulty = handler.getDifficultyById(difficultyId) || handler.getDefaultDifficulty();
    
    // Get the model
    const model = myProvider.languageModel('gpt-4o-mini');
    
    try {
      // Stream the object using the handler-specific schema and prompt
      return streamObject({
        model,
        schema: handler.getPassageSchema(),
        prompt: handler.getPassagePrompt(difficulty)
      });
    } catch (error) {
      // Check for unimplemented level errors
      if (error instanceof UnimplementedLevelError) {
        // Create a custom stream to return the error
        return {
          partialObjectStream: (async function* () {
            yield { error: error.message, type: 'unimplemented_level_error' };
          })(),
          object: Promise.resolve({ error: error.message, type: 'unimplemented_level_error' })
        };
      }
      throw error; // Re-throw other errors
    }
  }
  
  /**
   * Stream questions for a passage with the given exam type and difficulty
   */
  static streamQuestions(passage: string, examType: ExamType, difficultyId: string) {
    // Get the handler for this exam type
    const handler = ExamHandlerFactory.getHandler(examType);
    
    // Get the difficulty level
    const difficulty = handler.getDifficultyById(difficultyId) || handler.getDefaultDifficulty();
    
    // Get the model
    const model = myProvider.languageModel('gpt-4o-mini');
    
    try {
      // Stream the object using the handler-specific schema and prompt
      return streamObject({
        model,
        schema: handler.getQuestionsSchema(),
        prompt: handler.getQuestionsPrompt(difficulty, passage)
      });
    } catch (error) {
      // Check for unimplemented level errors
      if (error instanceof UnimplementedLevelError) {
        // Create a custom stream to return the error
        return {
          partialObjectStream: (async function* () {
            yield { error: error.message, type: 'unimplemented_level_error' };
          })(),
          object: Promise.resolve({ error: error.message, type: 'unimplemented_level_error' })
        };
      }
      throw error; // Re-throw other errors
    }
  }
  
  /**
   * Get a list of available exam types
   */
  static getExamTypes() {
    return ExamHandlerFactory.getAllExamTypes();
  }
  
  /**
   * Get a list of difficulty levels for the given exam type
   */
  static getDifficultyLevels(examType: ExamType): ExamDifficulty[] {
    const handler = ExamHandlerFactory.getHandler(examType);
    return handler.getDifficultyLevels();
  }
  
  /**
   * Get a specific difficulty by ID for the given exam type
   */
  static getDifficultyById(examType: ExamType, difficultyId: string): ExamDifficulty | undefined {
    const handler = ExamHandlerFactory.getHandler(examType);
    return handler.getDifficultyById(difficultyId);
  }
  
  /**
   * Get the UI component for the given exam type
   */
  static getUIComponent(examType: ExamType): any {
    const handler = ExamHandlerFactory.getHandler(examType);
    return handler.getUIComponent();
  }
  
  /**
   * Generate a complete reading passage (non-streaming)
   */
  static async generateReadingPassage(examType: ExamType, difficultyId: string) {
    const { object } = await this.streamReadingPassage(examType, difficultyId);
    return object;
  }
  
  /**
   * Generate questions for a passage (non-streaming)
   */
  static async generateQuestions(passage: string, examType: ExamType, difficultyId: string) {
    const { object } = await this.streamQuestions(passage, examType, difficultyId);
    return object;
  }
} 