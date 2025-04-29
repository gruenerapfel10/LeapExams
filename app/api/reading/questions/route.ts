import { NextResponse } from 'next/server'
import { streamQuestions } from '@/lib/ai/reading'
import { DEFAULT_EXAM, EXAM_TYPES } from '@/lib/constants'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    let { examType = DEFAULT_EXAM, passage } = body

    if (!passage) {
      return NextResponse.json(
        { error: 'Passage is required' },
        { status: 400 }
      )
    }

    // Validate exam type
    if (!Object.values(EXAM_TYPES).includes(examType)) {
      console.warn(`Invalid exam type received: ${examType}, falling back to ${DEFAULT_EXAM}`)
      examType = DEFAULT_EXAM
    }
    
    // Log for debugging
    console.log(`Streaming questions for exam type: ${examType}`)
    
    // Get streaming object
    const { partialObjectStream, object } = streamQuestions(passage, examType)
    
    // Create a stream transformer
    const stream = new TransformStream()
    const writer = stream.writable.getWriter()
    
    // Stream the partial objects
    ;(async () => {
      try {
        for await (const partial of partialObjectStream) {
          const data = JSON.stringify({ questions: partial, type: 'partial' })
          await writer.write(new TextEncoder().encode(`data: ${data}\n\n`))
        }
        
        // Send the complete object at the end
        const completeObject = await object
        const completeData = JSON.stringify({ 
          questions: completeObject, 
          type: 'complete' 
        })
        await writer.write(new TextEncoder().encode(`data: ${completeData}\n\n`))
        await writer.close()
      } catch (error) {
        console.error('Error streaming questions:', error)
        const errorData = JSON.stringify({ error: 'Failed to generate questions' })
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
    console.error('Error generating questions:', error)
    return NextResponse.json(
      { error: 'Failed to generate questions' },
      { status: 500 }
    )
  }
} 