import { z } from 'zod';
import { IELTSDifficulty } from '../types';
import { BaseIELTSLevel } from './base-level-handler';

/**
 * Schemas specific to IELTS Band 7-8 level
 */
export const ieltsBand7_8PassageSchema = z.object({
  title: z.string(),
  content: z.string(),
  sections: z.array(z.object({
    heading: z.string().optional(),
    content: z.string()
  })),
  vocabularyNotes: z.array(z.object({
    term: z.string(),
    definition: z.string(),
    example: z.string().optional(),
    registers: z.array(z.string()).optional() // Academic, formal, technical, etc.
  })).optional()
});

export const ieltsBand7_8QuestionSchema = z.object({
  id: z.number(),
  text: z.string(),
  questionType: z.enum([
    'multiple-choice', 
    'true-false-notgiven', 
    'matching', 
    'completion',
    'summary-completion'
  ]),
  options: z.array(z.string()).length(4),
  correctAnswer: z.number().min(0).max(3),
  explanation: z.string(),
  difficultyLevel: z.enum(['moderate', 'challenging', 'very challenging']).optional()
});

export const ieltsBand7_8QuestionsSchema = z.object({
  questions: z.array(ieltsBand7_8QuestionSchema).min(5),
  recommendedTimeMinutes: z.number().optional()
});

/**
 * Handler for IELTS Band 7-8 level exams
 */
export class IELTSBand7_8Handler extends BaseIELTSLevel {
  protected level: IELTSDifficulty = {
    id: 'band-7-8',
    name: 'Band 7-8',
    description: 'Good English proficiency with occasional inaccuracies',
    level: 4,
    band: 7.5,
    descriptor: 'Good User'
  };
  
  // Text types specific to Band 7-8 level
  protected textTypes = [
    'Academic journal articles',
    'Research papers',
    'Complex argumentative essays',
    'Scientific reports',
    'Historical analyses',
    'Technical descriptions'
  ];
  
  // Question formats specific to Band 7-8 level
  protected questionFormats = [
    'Multiple choice with subtle distinctions',
    'True/False/Not Given requiring inference',
    'Matching headings with abstract concepts',
    'Summary completion requiring synthesis',
    'Sentence completion with precise wording'
  ];
  
  // Cognitive demands specific to Band 7-8 level
  protected cognitiveDemands = [
    'Critical analysis of complex arguments',
    'Understanding of implied meanings',
    'Recognition of author stance and bias',
    'Synthesis of information across paragraphs',
    'Evaluation of evidence and reasoning',
    'Distinction between fact and opinion'
  ];
  
  getPassageSchema(): z.ZodObject<any> {
    return ieltsBand7_8PassageSchema;
  }
  
  getQuestionsSchema(): z.ZodObject<any> {
    return ieltsBand7_8QuestionsSchema;
  }
  
  getPassagePrompt(difficulty: IELTSDifficulty): string {
    // Enhance base prompt with Band 7-8 specific instructions
    return `${super.getPassagePrompt(difficulty)}
    
    Band 7-8 specific guidelines:
    - Use complex sentence structures with a mix of compound and complex sentences
    - Include academic vocabulary characteristic of sophisticated academic writing
    - Use passive voice, nominalizations, and conditionals where appropriate
    - Incorporate abstract concepts and theoretical frameworks
    - Include nuanced arguments with counterpoints
    - Use specialized terminology with context that allows meaning to be inferred
    - Include subtle author perspectives without explicitly stating opinions
    - Structure text with clear introduction, body paragraphs developing arguments, and conclusion
    - Include data, examples, or evidence to support key points
    - Use appropriate cohesive devices to link ideas across paragraphs`;
  }
  
  getQuestionsPrompt(difficulty: IELTSDifficulty, passage: string): string {
    // Enhance base prompt with Band 7-8 specific instructions
    return `${super.getQuestionsPrompt(difficulty, passage)}
    
    Band 7-8 specific guidelines:
    - Design questions that test higher-order thinking skills
    - Create multiple-choice options with subtle distinctions that require precise understanding
    - For True/False/Not Given questions, include statements requiring careful inference
    - Include questions that require synthesizing information from different parts of the text
    - Test understanding of academic vocabulary in context
    - Include questions about implied meanings or author's perspective
    - Ensure distractors are plausible but subtly incorrect
    - Create questions that test understanding of logical relationships between ideas
    - Include at least one question requiring an understanding of the overall argument structure
    - Questions should progress from moderately difficult to very challenging`;
  }
} 