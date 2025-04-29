import { NextResponse } from 'next/server'
import { streamReadingPassage, streamQuestions } from '@/lib/ai/reading'
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
    console.log(`Streaming reading content for exam type: ${examType}`)
    
    // Create a stream transformer
    const stream = new TransformStream()
    const writer = stream.writable.getWriter()
    
    // Get streaming object
    const { partialObjectStream: passageStream, object: passagePromise } = streamReadingPassage(examType)
    
    // Stream the partial objects
    ;(async () => {
      try {
        // Stream passage partials
        for await (const partial of passageStream) {
          const data = JSON.stringify({ passage: partial, type: 'passage-partial' })
          await writer.write(new TextEncoder().encode(`data: ${data}\n\n`))
        }
        
        // Get complete passage
        const passage = await passagePromise
        
        // Check if passage is an error object
        if ('error' in passage) {
          throw new Error(passage.error)
        }
        
        const passageData = JSON.stringify({ 
          passage, 
          type: 'passage-complete'
        })
        await writer.write(new TextEncoder().encode(`data: ${passageData}\n\n`))
        
        // Stream questions based on the complete passage
        const { partialObjectStream: questionsStream, object: questionsPromise } = 
          streamQuestions(passage.content, examType)
        
        // Stream questions partials
        for await (const partial of questionsStream) {
          const data = JSON.stringify({ questions: partial, type: 'questions-partial' })
          await writer.write(new TextEncoder().encode(`data: ${data}\n\n`))
        }
        
        // Get complete questions
        const questions = await questionsPromise
        const questionsData = JSON.stringify({ 
          questions, 
          type: 'questions-complete' 
        })
        await writer.write(new TextEncoder().encode(`data: ${questionsData}\n\n`))
        
        // Send final complete data
        const completeData = JSON.stringify({ 
          passage,
          questions,
          examType,
          type: 'complete'
        })
        await writer.write(new TextEncoder().encode(`data: ${completeData}\n\n`))
        await writer.close()
      } catch (error) {
        console.error('Error streaming content:', error)
        const errorData = JSON.stringify({ error: 'Failed to generate content' })
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
    console.error('Error generating content:', error)
    return NextResponse.json(
      { error: 'Failed to generate content' },
      { status: 500 }
    )
  }
} 