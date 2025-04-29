import { ExamType, EXAM_TYPES } from '../constants';
import { ReadingExamHandler } from './types';
import { IELTSExamHandler } from './ielts-handler';
import { GoetheExamHandler } from './goethe-handler';

/**
 * Factory for creating and retrieving exam handlers based on exam type
 */
export class ExamHandlerFactory {
  // Cached instances of handlers (singleton pattern)
  private static handlers: Map<ExamType, ReadingExamHandler> = new Map();
  
  /**
   * Create or retrieve a handler for the specified exam type
   */
  static getHandler(examType: ExamType): ReadingExamHandler {
    // Check if we already have a cached instance
    if (this.handlers.has(examType)) {
      return this.handlers.get(examType)!;
    }
    
    // Create a new instance based on the exam type
    let handler: ReadingExamHandler;
    
    switch (examType) {
      case EXAM_TYPES.IELTS:
        handler = new IELTSExamHandler();
        break;
      case EXAM_TYPES.GOETHE:
        handler = new GoetheExamHandler();
        break;
      default:
        throw new Error(`Unsupported exam type: ${examType}`);
    }
    
    // Cache the instance
    this.handlers.set(examType, handler);
    
    return handler;
  }
  
  /**
   * Validate and return the exam type, or throw if invalid
   */
  static validateExamType(examType: string): ExamType {
    if (Object.values(EXAM_TYPES).includes(examType as ExamType)) {
      return examType as ExamType;
    }
    throw new Error(`Invalid exam type: ${examType}`);
  }
  
  /**
   * Get all supported exam types with their metadata
   */
  static getAllExamTypes(): Array<{type: ExamType, name: string, description: string}> {
    return [
      {
        type: EXAM_TYPES.IELTS,
        name: 'IELTS',
        description: 'International English Language Testing System'
      },
      {
        type: EXAM_TYPES.GOETHE,
        name: 'Goethe-Institut',
        description: 'German language proficiency examination'
      }
    ];
  }
} 