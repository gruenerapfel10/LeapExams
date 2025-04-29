import { generateObject } from 'ai'
import { z } from 'zod'
import { myProvider } from './models'
import { EXAM_LANGUAGES, ExamType, EXAM_TYPES } from '../constants'

const passageSchema = z.object({
  title: z.string(),
  content: z.string()
})

const questionSchema = z.object({
  id: z.number(),
  text: z.string(),
  options: z.array(z.string()).length(4),
  correctAnswer: z.number().min(0).max(3)
})

const questionsSchema = z.object({
  questions: z.array(questionSchema).length(3)
})

// Helper to validate exam type
function validateExamType(examType: ExamType): ExamType {
  if (!Object.values(EXAM_TYPES).includes(examType)) {
    console.warn(`Invalid exam type: ${examType}, falling back to default`);
    return EXAM_TYPES.IELTS;
  }
  return examType;
}

export async function generateReadingPassage(examType: ExamType) {
  // Validate exam type to prevent issues
  examType = validateExamType(examType);
  
  const model = myProvider.languageModel('gpt-4o-mini')
  const language = EXAM_LANGUAGES[examType]
  
  console.log(`Generating reading passage in ${language.name} for ${examType}`);
  
  const { object: passageData } = await generateObject({
    model,
    schema: passageSchema,
    prompt: `Generate a reading passage for ${examType.toUpperCase()} reading practice with the following requirements:
    - Title should be clear and descriptive
    - Content should be 300-400 words long
    - Cover an academic topic suitable for ${examType.toUpperCase()}
    - Use clear and formal language in ${language.name}
    - IMPORTANT: The entire passage MUST be written in ${language.name} language (${language.code})
    - Include 3-4 paragraphs
    - Focus on a single main idea with supporting details
    - Do not include markdown formatting or special characters
    - The passage should be culturally appropriate for ${language.name} speakers`
  })

  return passageData
}

export async function generateQuestions(passage: string, examType: ExamType) {
  // Validate exam type to prevent issues
  examType = validateExamType(examType);
  
  const model = myProvider.languageModel('gpt-4o-mini')
  const language = EXAM_LANGUAGES[examType]
  
  console.log(`Generating questions in ${language.name} for ${examType}`);
  
  const { object } = await generateObject({
    model,
    schema: questionsSchema,
    prompt: `Based on the following passage, generate 3 multiple-choice questions in ${language.name}. Each question must have exactly 4 options and one correct answer (0-3).
    
    Passage:
    ${passage}

    Requirements:
    - Generate exactly 3 questions in ${language.name}
    - IMPORTANT: All questions and options MUST be written ONLY in ${language.name} language (${language.code})
    - Each question must have exactly 4 options
    - The correctAnswer must be a number between 0 and 3 (index of the correct option)
    - Questions should test comprehension of the main ideas and key details
    - Options should be plausible but only one should be correct
    - Questions should be culturally appropriate for ${language.name} speakers`
  })

  return object
} 