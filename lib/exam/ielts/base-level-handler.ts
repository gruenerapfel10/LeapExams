import { z } from 'zod';
import { ExamDifficulty, IELTSDifficulty } from '../types';

/**
 * Base interface for all IELTS level handlers
 */
export interface IELTSLevel {
  getLevel(): IELTSDifficulty;
  getPassageSchema(): z.ZodObject<any>;
  getQuestionsSchema(): z.ZodObject<any>;
  getPassagePrompt(difficulty: IELTSDifficulty): string;
  getQuestionsPrompt(difficulty: IELTSDifficulty, passage: string): string;
}

/**
 * Base abstract class for all IELTS level handlers
 * This provides common functionality for all IELTS bands
 */
export abstract class BaseIELTSLevel implements IELTSLevel {
  protected abstract level: IELTSDifficulty;
  protected abstract textTypes: string[];
  protected abstract questionFormats: string[];
  protected abstract cognitiveDemands: string[];
  
  /**
   * Get the IELTS band level this handler is for
   */
  getLevel(): IELTSDifficulty {
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
   * Generate a passage prompt specific to this IELTS band level
   */
  getPassagePrompt(difficulty: IELTSDifficulty): string {
    return `Generate an IELTS Academic reading passage suitable for band ${difficulty.band} level.
    
    Text types for this band include: ${this.textTypes.join(', ')}
    
    Consider these cognitive demands: ${this.cognitiveDemands.join(', ')}
    
    Requirements:
    - Content should be 350-450 words with an academic tone
    - Use vocabulary and grammar appropriate for band ${difficulty.band} level
    - Divide the passage into 2-3 sections with optional headings
    - The content should be factual and informative
    - Include some specialized vocabulary items that would be appropriate for testing
    - Topics may include: ${this.getTopicsForBand(difficulty.band)}
    
    Return a passage with clear structure and appropriate academic language for IELTS.`;
  }
  
  /**
   * Generate a questions prompt specific to this IELTS band level
   */
  getQuestionsPrompt(difficulty: IELTSDifficulty, passage: string): string {
    return `Based on the following IELTS passage, generate band ${difficulty.band} level questions.
    
    Passage:
    ${passage}
    
    Question formats for band ${difficulty.band} include: ${this.questionFormats.join(', ')}
    
    Requirements:
    - Generate 5 questions in English suitable for IELTS band ${difficulty.band} level
    - Questions should test: ${this.cognitiveDemands.join(', ')}
    - Each question must have exactly 4 options
    - The correctAnswer must be a number between 0 and 3 (index of the correct option)
    - For each question, add a brief explanation of why the correct answer is correct
    - Questions should match the difficulty level expected for band ${difficulty.band}
    - Questions should increase in difficulty as they progress`;
  }
  
  /**
   * Helper to get appropriate topics for an IELTS band
   */
  protected getTopicsForBand(band: number): string {
    if (band < 5.0) {
      return 'education, lifestyle, technology, simple science, personal experiences';
    } else if (band < 6.5) {
      return 'environment, health, social issues, business, culture, science';
    } else if (band < 8.0) {
      return 'science, medicine, history, economics, psychology, social sciences';
    } else {
      return 'specialized academic topics, research methodologies, theoretical frameworks, complex scientific concepts';
    }
  }
} 