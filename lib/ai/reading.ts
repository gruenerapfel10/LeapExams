import { ExamType } from '../constants';
import { ExamService } from '../exam/service';
import { ExamHandlerFactory } from '../exam/factory';
import { UnimplementedLevelError } from '../exam/goethe-handler';

// Helper to validate exam type
function validateExamType(examType: ExamType): ExamType {
  try {
    return ExamHandlerFactory.validateExamType(examType);
  } catch (error) {
    console.warn(`Invalid exam type: ${examType}, falling back to default`);
    return 'ielts' as ExamType;
  }
}

/**
 * Stream reading passage for the given exam type and difficulty
 * If no difficulty is provided, the default difficulty for the exam type will be used
 */
export function streamReadingPassage(examType: ExamType, difficultyId?: string) {
  // Validate exam type to prevent issues
  examType = validateExamType(examType);
  
  // Get the handler for this exam type
  const handler = ExamHandlerFactory.getHandler(examType);
  
  // Use the provided difficulty or the default
  const difficulty = difficultyId ? 
    (handler.getDifficultyById(difficultyId) || handler.getDefaultDifficulty()) : 
    handler.getDefaultDifficulty();
  
  try {
    return ExamService.streamReadingPassage(examType, difficulty.id);
  } catch (error) {
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
 * If no difficulty is provided, the default difficulty for the exam type will be used
 */
export function streamQuestions(passage: string, examType: ExamType, difficultyId?: string) {
  // Validate exam type to prevent issues
  examType = validateExamType(examType);
  
  // Get the handler for this exam type
  const handler = ExamHandlerFactory.getHandler(examType);
  
  // Use the provided difficulty or the default
  const difficulty = difficultyId ? 
    (handler.getDifficultyById(difficultyId) || handler.getDefaultDifficulty()) : 
    handler.getDefaultDifficulty();
  
  try {
    return ExamService.streamQuestions(passage, examType, difficulty.id);
  } catch (error) {
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

// Keep the original functions for compatibility
export async function generateReadingPassage(examType: ExamType, difficultyId?: string) {
  const { object } = await streamReadingPassage(examType, difficultyId);
  return object;
}

export async function generateQuestions(passage: string, examType: ExamType, difficultyId?: string) {
  const { object } = await streamQuestions(passage, examType, difficultyId);
  return object;
} 