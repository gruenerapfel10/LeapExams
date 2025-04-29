import { NextResponse } from 'next/server'
import { generateReadingPassage, generateQuestions } from '@/lib/ai/reading'
import { DEFAULT_EXAM } from '@/lib/constants'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { examType = DEFAULT_EXAM } = body

    // Generate passage
    const passageData = await generateReadingPassage(examType)
    
    // Generate questions based on the passage
    const questionsData = await generateQuestions(passageData.content, examType)

    return NextResponse.json({
      passage: passageData,
      questions: questionsData.questions
    })
  } catch (error) {
    console.error('Error generating reading content:', error)
    return NextResponse.json(
      { error: 'Failed to generate reading content' },
      { status: 500 }
    )
  }
} 