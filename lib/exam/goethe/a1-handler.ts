import { z } from 'zod';
import { GoetheDifficulty } from '../types';
import { BaseGoetheLevel } from './base-level-handler';

/**
 * Schemas specific to A1 level
 */
export const goetheA1PassageSchema = z.object({
  title: z.string(),
  content: z.string(),
  vocabulary: z.array(z.object({
    word: z.string(),
    definition: z.string(),
    example: z.string().optional()
  })).optional()
});

export const goetheA1QuestionSchema = z.object({
  id: z.number(),
  text: z.string(),
  context: z.string().optional(),
  questionType: z.enum(['true-false', 'matching', 'multiple-choice']).optional(),
  options: z.array(z.string()).length(4),
  correctAnswer: z.number().min(0).max(3),
  explanation: z.string().optional()
});

export const goetheA1QuestionsSchema = z.object({
  questions: z.array(goetheA1QuestionSchema).min(3)
});

/**
 * Handler for A1 level Goethe exams
 */
export class GoetheA1Handler extends BaseGoetheLevel {
  protected level: GoetheDifficulty = {
    id: 'a1',
    name: 'A1',
    description: 'Can understand and use familiar everyday expressions and very basic phrases',
    level: 1,
    cefr: 'A1',
    certificate: 'Goethe-Zertifikat A1: Start Deutsch 1'
  };
  
  // Text types specific to A1 level
  protected textTypes = [
    'Short notes',
    'Simple advertisements',
    'Signs and notices',
    'Basic emails',
    'Short personal messages'
  ];
  
  // Question formats specific to A1 level
  protected questionFormats = [
    'True/False questions',
    'A/B matching',
    'Simple multiple-choice questions',
    'Image-to-text matching'
  ];
  
  // Cognitive demands specific to A1 level
  protected cognitiveDemands = [
    'Fact retrieval',
    'Basic comprehension',
    'Recognition of personal information',
    'Understanding of simple instructions'
  ];
  
  getPassageSchema(): z.ZodObject<any> {
    return goetheA1PassageSchema;
  }
  
  getQuestionsSchema(): z.ZodObject<any> {
    return goetheA1QuestionsSchema;
  }
  
  getPassagePrompt(difficulty: GoetheDifficulty): string {
    // Enhance base prompt with A1-specific instructions
    return `${super.getPassagePrompt(difficulty)}
    
    A1-specific guidelines:
    - Use very simple sentence structures (mainly subject-verb-object)
    - Avoid subordinate clauses and complex grammar
    - Focus on present tense and simple vocabulary
    - Include common everyday expressions and routine phrases
    - Stick to concrete topics, not abstract concepts
    - Vocabulary should be limited to the most common 500-800 German words
    - Include greetings, numbers, days of the week, or basic personal information
    - Keep sentences short (5-10 words per sentence on average)`;
  }
  
  getQuestionsPrompt(difficulty: GoetheDifficulty, passage: string): string {
    // Enhance base prompt with A1-specific instructions
    return `${super.getQuestionsPrompt(difficulty, passage)}
    
    A1-specific guidelines:
    - Questions should be very simple and direct
    - Focus on literal comprehension, not inference
    - Use true/false format or simple multiple choice with clear, distinct options
    - Options should be clearly different from each other
    - Avoid ambiguity or subtle distinctions between answers
    - Questions should focus on simple facts directly stated in the text
    - Question sentences should be simple with basic vocabulary
    - Include some visual context where appropriate (describe images that would accompany the question)`;
  }
} 