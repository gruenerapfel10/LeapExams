import { z } from 'zod';
import { EXAM_TYPES } from '../constants';
import { BaseExamHandler } from './base-handler';
import { ExamDifficulty, GoetheDifficulty } from './types';
import { GoetheLevelRegistry } from './goethe/level-registry';

// Default schemas to use if no level-specific handler is available
export const goethePassageSchema = z.object({
  title: z.string(),
  content: z.string(),
  vocabulary: z.array(z.object({
    word: z.string(),
    definition: z.string(),
    example: z.string().optional()
  })).optional()
});

export const goetheQuestionSchema = z.object({
  id: z.number(),
  text: z.string(),
  context: z.string().optional(), 
  options: z.array(z.string()).length(4),
  correctAnswer: z.number().min(0).max(3),
  explanation: z.string().optional()
});

export const goetheQuestionsSchema = z.object({
  questions: z.array(goetheQuestionSchema).min(3)
});

/**
 * Error class for unimplemented Goethe levels
 */
export class UnimplementedLevelError extends Error {
  constructor(level: string) {
    super(`The Goethe ${level} level is not yet implemented. Please select A1 or B2 level.`);
    this.name = 'UnimplementedLevelError';
  }
}

/**
 * Goethe exam handler implementing the specific logic for Goethe exams
 * Now delegates to level-specific handlers when appropriate
 */
export class GoetheExamHandler extends BaseExamHandler {
  protected examType = EXAM_TYPES.GOETHE;
  private levelRegistry = GoetheLevelRegistry.getInstance();
  
  // Goethe specific difficulty levels (CEFR levels)
  protected difficultyLevels: GoetheDifficulty[] = [
    {
      id: 'a1',
      name: 'A1',
      description: 'Can understand and use familiar everyday expressions and very basic phrases',
      level: 1,
      cefr: 'A1',
      certificate: 'Goethe-Zertifikat A1: Start Deutsch 1',
      isImplemented: true
    },
    {
      id: 'a2',
      name: 'A2',
      description: 'Can understand sentences and frequently used expressions related to areas of most immediate relevance',
      level: 2,
      cefr: 'A2',
      certificate: 'Goethe-Zertifikat A2',
      isImplemented: false
    },
    {
      id: 'b1',
      name: 'B1',
      description: 'Can deal with most situations likely to arise while travelling in an area where the language is spoken',
      level: 3,
      cefr: 'B1',
      certificate: 'Goethe-Zertifikat B1',
      isImplemented: false
    },
    {
      id: 'b2',
      name: 'B2',
      description: 'Can interact with a degree of fluency and spontaneity that makes regular interaction with native speakers possible',
      level: 4,
      cefr: 'B2',
      certificate: 'Goethe-Zertifikat B2',
      isImplemented: true
    },
    {
      id: 'c1',
      name: 'C1',
      description: 'Can express ideas fluently and spontaneously without much searching for expressions',
      level: 5,
      cefr: 'C1',
      certificate: 'Goethe-Zertifikat C1',
      isImplemented: false
    },
    {
      id: 'c2',
      name: 'C2',
      description: 'Can understand with ease virtually everything heard or read',
      level: 6,
      cefr: 'C2',
      certificate: 'Goethe-Zertifikat C2: Großes Deutsches Sprachdiplom',
      isImplemented: false
    }
  ];

  /**
   * Returns available CEFR levels that are currently implemented
   */
  getImplementedLevels(): string[] {
    return this.levelRegistry.getAllLevels();
  }

  /**
   * Checks if the requested level is implemented
   */
  isLevelImplemented(cefr: string): boolean {
    return this.getImplementedLevels().includes(cefr);
  }
  
  getPassagePrompt(difficulty: ExamDifficulty): string {
    // Cast to the right difficulty type
    const goetheDifficulty = difficulty as GoetheDifficulty;
    
    // Try to get a level-specific handler
    const levelHandler = this.levelRegistry.getHandlerForDifficulty(goetheDifficulty);
    
    if (levelHandler) {
      // Use the level-specific handler
      return levelHandler.getPassagePrompt(goetheDifficulty);
    }
    
    // Instead of falling back to generic behavior, throw an error for unimplemented levels
    throw new UnimplementedLevelError(goetheDifficulty.cefr);
  }
  
  getQuestionsPrompt(difficulty: ExamDifficulty, passage: string): string {
    // Cast to the right difficulty type
    const goetheDifficulty = difficulty as GoetheDifficulty;
    
    // Try to get a level-specific handler
    const levelHandler = this.levelRegistry.getHandlerForDifficulty(goetheDifficulty);
    
    if (levelHandler) {
      // Use the level-specific handler
      return levelHandler.getQuestionsPrompt(goetheDifficulty, passage);
    }
    
    // Instead of falling back to generic behavior, throw an error for unimplemented levels
    throw new UnimplementedLevelError(goetheDifficulty.cefr);
  }
  
  /**
   * Override getDifficultyLevels to add visual indication for implemented levels
   */
  getDifficultyLevels(): GoetheDifficulty[] {
    // Update implementation status based on registry
    const implementedCefrLevels = this.getImplementedLevels();
    
    // Return the difficulty levels with updated implementation status
    return this.difficultyLevels.map(level => ({
      ...level,
      isImplemented: implementedCefrLevels.includes(level.cefr)
    }));
  }
  
  getPassageSchema(): z.ZodObject<any> {
    return goethePassageSchema;
  }
  
  getQuestionsSchema(): z.ZodObject<any> {
    return goetheQuestionsSchema;
  }
  
  getUIComponent(): any {
    // This would return the actual UI component for Goethe
    return 'GoetheReadingUI';
  }
  
  // Helper methods specific to Goethe exams
  private getWordCountForLevel(cefr: string): string {
    switch(cefr) {
      case 'A1': return '100-150';
      case 'A2': return '150-200';
      case 'B1': return '200-300';
      case 'B2': return '300-400';
      case 'C1': return '400-500';
      case 'C2': return '500-600';
      default: return '300-400';
    }
  }
  
  private getTopicsForLevel(cefr: string): string {
    switch(cefr) {
      case 'A1': return 'personal information, daily routines, family, shopping';
      case 'A2': return 'leisure, hobbies, travel, food, accommodation';
      case 'B1': return 'work, education, media, environment, German culture';
      case 'B2': return 'current affairs, social issues, technology, cultural differences';
      case 'C1': return 'politics, economics, scientific advances, literature, philosophy';
      case 'C2': return 'complex social issues, academic topics, specialized fields, cultural nuances';
      default: return 'daily life, work, education, environment, culture in German-speaking countries';
    }
  }
} 