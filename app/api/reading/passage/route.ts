import { NextResponse } from 'next/server'
import { generateReadingPassage } from '@/lib/ai/reading'
import { DEFAULT_EXAM, EXAM_TYPES } from '@/lib/constants'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    let { examType = DEFAULT_EXAM } = body

    // Validate exam type
    if (!Object.values(EXAM_TYPES).includes(examType)) {
      console.warn(`Invalid exam type received: ${examType}, falling back to ${DEFAULT_EXAM}`)
      examType = DEFAULT_EXAM
    }
    
    // Log for debugging
    console.log(`Generating reading passage for exam type: ${examType}`)
    
    const passage = await generateReadingPassage(examType)
    return NextResponse.json({ ...passage, examType })
  } catch (error) {
    console.error('Error generating passage:', error)
    return NextResponse.json(
      { error: 'Failed to generate passage' },
      { status: 500 }
    )
  }
} 