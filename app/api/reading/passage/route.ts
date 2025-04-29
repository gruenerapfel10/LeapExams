import { NextResponse } from 'next/server'
import { streamReadingPassage } from '@/lib/ai/reading'
import { DEFAULT_EXAM, EXAM_TYPES, EXAM_LANGUAGES, ExamType } from '@/lib/constants'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    let { examType = DEFAULT_EXAM } = body as { examType?: string }
    
    // Validate exam type and ensure it's properly typed
    let validExamType: ExamType
    if (Object.values(EXAM_TYPES).includes(examType as ExamType)) {
      validExamType = examType as ExamType
    } else {
      console.warn(`Invalid exam type received: ${examType}, falling back to ${DEFAULT_EXAM}`)
      validExamType = DEFAULT_EXAM
    }
    
    // Get language info for logging
    const language = EXAM_LANGUAGES[validExamType]
    
    // Comprehensive logging
    console.log(`Streaming reading passage for ${validExamType.toUpperCase()} exam in ${language.name}`)
    
    // Get streaming object
    const { partialObjectStream, object } = streamReadingPassage(validExamType)
    
    // Create a stream transformer
    const stream = new TransformStream()
    const writer = stream.writable.getWriter()
    
    // Stream the partial objects
    ;(async () => {
      try {
        for await (const partial of partialObjectStream) {
          const data = JSON.stringify({ passage: partial, type: 'partial' })
          await writer.write(new TextEncoder().encode(`data: ${data}\n\n`))
        }
        
        // Send the complete object at the end
        const completeObject = await object
        const completeData = JSON.stringify({ 
          passage: completeObject, 
          type: 'complete',
          examType: validExamType 
        })
        await writer.write(new TextEncoder().encode(`data: ${completeData}\n\n`))
        await writer.close()
      } catch (error) {
        console.error('Error streaming passage:', error)
        const errorData = JSON.stringify({ error: 'Failed to generate passage' })
        await writer.write(new TextEncoder().encode(`data: ${errorData}\n\n`))
        await writer.close()
      }
    })()
    
    return new Response(stream.readable, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    })
  } catch (error) {
    console.error('Error generating passage:', error)
    return NextResponse.json(
      { error: 'Failed to generate passage' },
      { status: 500 }
    )
  }
} 