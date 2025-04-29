import { z } from 'zod';
import { GoetheDifficulty } from '../types';
import { BaseGoetheLevel } from './base-level-handler';

/**
 * Schemas specific to B2 level
 */
export const goetheB2PassageSchema = z.object({
  title: z.string(),
  content: z.string(),
  sections: z.array(z.object({
    heading: z.string().optional(),
    content: z.string()
  })).optional(),
  vocabulary: z.array(z.object({
    word: z.string(),
    definition: z.string(),
    example: z.string().optional(),
    synonyms: z.array(z.string()).optional(),
  })).optional()
});

export const goetheB2QuestionSchema = z.object({
  id: z.number(),
  text: z.string(),
  context: z.string(),
  questionType: z.enum([
    'multiple-choice', 
    'argument-analysis', 
    'detail-oriented', 
    'inference'
  ]).optional(),
  options: z.array(z.string()).length(4),
  correctAnswer: z.number().min(0).max(3),
  explanation: z.string().optional(),
  difficulty: z.enum(['easy', 'medium', 'hard']).optional()
});

export const goetheB2QuestionsSchema = z.object({
  questions: z.array(goetheB2QuestionSchema).min(5),
  topics: z.array(z.string()).optional()
});

/**
 * Handler for B2 level Goethe exams
 */
export class GoetheB2Handler extends BaseGoetheLevel {
  protected level: GoetheDifficulty = {
    id: 'b2',
    name: 'B2',
    description: 'Can interact with a degree of fluency and spontaneity that makes regular interaction with native speakers possible',
    level: 4,
    cefr: 'B2',
    certificate: 'Goethe-Zertifikat B2'
  };
  
  // Text types specific to B2 level
  protected textTypes = [
    'Complex articles',
    'Professional reports',
    'Detailed arguments',
    'Journalistic texts',
    'Opinion pieces',
    'Formal correspondence'
  ];
  
  // Question formats specific to B2 level
  protected questionFormats = [
    'Argument analysis',
    'Detail-oriented multiple choice questions',
    'Position and opinion identification',
    'Inference questions',
    'Logical deduction tasks'
  ];
  
  // Cognitive demands specific to B2 level
  protected cognitiveDemands = [
    'Critical evaluation of arguments',
    'Understanding logical connections',
    'Recognition of implied meanings',
    'Identification of author stance and perspective',
    'Analysis of argumentation structure'
  ];
  
  getPassageSchema(): z.ZodObject<any> {
    return goetheB2PassageSchema;
  }
  
  getQuestionsSchema(): z.ZodObject<any> {
    return goetheB2QuestionsSchema;
  }
  
  getPassagePrompt(difficulty: GoetheDifficulty): string {
    // Enhance base prompt with B2-specific instructions
    return `${super.getPassagePrompt(difficulty)}
    
    B2-specific guidelines:
    - Write text in multiple sections with different aspects of the topic
    - Use complex sentence structures with subordinate clauses
    - Include passive voice, subjunctive forms, and varying tenses
    - Incorporate abstract concepts and theoretical frameworks
    - Use specialized vocabulary appropriate for educated non-specialists
    - Include both opinions/arguments and factual information
    - Develop logical argumentation with supporting examples
    - Establish clear relationships between ideas using connectors
    - Text should be structured with clear introduction, body paragraphs and conclusion
    - Include some idiomatic expressions and figurative language`;
  }
  
  getQuestionsPrompt(difficulty: GoetheDifficulty, passage: string): string {
    // Enhance base prompt with B2-specific instructions
    return `${super.getQuestionsPrompt(difficulty, passage)}
    
    B2-specific guidelines:
    - Focus on testing critical thinking and analytical skills
    - Create multi-layered distractors that reflect partial comprehension errors
    - Include questions about implied meanings and author's perspective
    - Test understanding of argumentative structure and logical connections
    - Distractors should be plausible but subtly incorrect
    - Include questions that require synthesizing information from different parts of the text
    - Test understanding of idiomatic language and nuanced meanings
    - Ensure some questions focus on argumentation and evidence evaluation
    - Include at least one question that examines the overall purpose or main argument
    - Questions should increase in difficulty (start easier, end harder)`;
  }
} 