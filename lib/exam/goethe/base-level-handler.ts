import { z } from 'zod';
import { ExamDifficulty, GoetheDifficulty } from '../types';

/**
 * Base interface for all Goethe level handlers
 */
export interface GoetheLevel {
  getLevel(): GoetheDifficulty;
  getPassageSchema(): z.ZodObject<any>;
  getQuestionsSchema(): z.ZodObject<any>;
  getPassagePrompt(difficulty: GoetheDifficulty): string;
  getQuestionsPrompt(difficulty: GoetheDifficulty, passage: string): string;
}

/**
 * Base abstract class for all Goethe level handlers
 * This provides common functionality for all CEFR levels (A1-C2)
 */
export abstract class BaseGoetheLevel implements GoetheLevel {
  protected abstract level: GoetheDifficulty;
  protected abstract textTypes: string[];
  protected abstract questionFormats: string[];
  protected abstract cognitiveDemands: string[];
  
  /**
   * Get the CEFR level this handler is for
   */
  getLevel(): GoetheDifficulty {
    return this.level;
  }
  
  /**
   * Get the passage schema for this level
   * Override in subclasses for level-specific schemas
   */
  abstract getPassageSchema(): z.ZodObject<any>;
  
  /**
   * Get the questions schema for this level
   * Override in subclasses for level-specific schemas
   */
  abstract getQuestionsSchema(): z.ZodObject<any>;
  
  /**
   * Generate a passage prompt specific to this CEFR level
   */
  getPassagePrompt(difficulty: GoetheDifficulty): string {
    return `Generate a German reading passage suitable for Goethe-Institut ${difficulty.cefr} level.
    
    Text types for this level include: ${this.textTypes.join(', ')}
    
    Consider these cognitive demands: ${this.cognitiveDemands.join(', ')}
    
    Requirements:
    - Content should be ${this.getWordCountForLevel(difficulty.cefr)} words
    - Use vocabulary and grammar appropriate for ${difficulty.cefr} level
    - Cover topics like: ${this.getTopicsForLevel(difficulty.cefr)}
    - Include 5-7 key vocabulary items with definitions
    - Structure the text with appropriate paragraphs and flow
    - The language complexity should match exactly what is expected at ${difficulty.cefr} level
    
    Return the passage with clear vocabulary notes that would help a learner at ${difficulty.cefr} level.`;
  }
  
  /**
   * Generate a questions prompt specific to this CEFR level
   */
  getQuestionsPrompt(difficulty: GoetheDifficulty, passage: string): string {
    return `Based on the following German passage, generate ${difficulty.cefr} level questions.
    
    Passage:
    ${passage}
    
    Question formats for ${difficulty.cefr} include: ${this.questionFormats.join(', ')}
    
    Requirements:
    - Generate 5 questions in German suitable for Goethe-Institut ${difficulty.cefr} level
    - For each question, include a brief context showing which part of the passage it relates to
    - Questions should test: ${this.cognitiveDemands.join(', ')}
    - The language complexity of questions should match ${difficulty.cefr} level
    - Include questions that test both direct comprehension and implicit understanding where appropriate
    - Questions should reflect authentic Goethe-Institut examination style`;
  }
  
  /**
   * Helper to get appropriate word count for a CEFR level
   */
  protected getWordCountForLevel(cefr: string): string {
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
  
  /**
   * Helper to get appropriate topics for a CEFR level
   */
  protected getTopicsForLevel(cefr: string): string {
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