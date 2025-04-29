import { NextRequest } from 'next/server'
import { streamReadingPassage, streamQuestions } from '@/lib/ai/reading'
import { ExamType } from '@/lib/constants'
import { ExamHandlerFactory } from '@/lib/exam/factory'

/**
 * API handler for streaming reading content generation
 * This route uses SSE (Server-Sent Events) to stream updates to the client
 */
export async function GET(req: NextRequest) {
  // Parse query parameters
  const url = new URL(req.url)
  const examTypeParam = url.searchParams.get('examType')
  const difficultyId = url.searchParams.get('difficulty') || undefined
  
  // Validate exam type
  let examType: ExamType
  try {
    examType = ExamHandlerFactory.validateExamType(examTypeParam || '')
  } catch (error) {
    return new Response(
      JSON.stringify({ 
        type: 'error', 
        error: 'Invalid exam type' 
      }),
      { 
        status: 400,
        headers: {
          'Content-Type': 'application/json'
        }
      }
    )
  }
  
  // Set up the stream as Server-Sent Events
  const encoder = new TextEncoder()
  const stream = new ReadableStream({
    async start(controller) {
      // Send event to indicate passage generation is starting
      controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type: 'passage_start' })}\n\n`))
      
      try {
        // Stream the passage
        const passageStream = streamReadingPassage(examType, difficultyId)
        let completePassage: any = null
        
        // Stream partial passage updates
        for await (const partial of passageStream.partialObjectStream) {
          completePassage = partial
          
          // Check if there's an unimplemented level error
          if (partial.type === 'unimplemented_level_error') {
            // Send event to indicate level not implemented
            controller.enqueue(encoder.encode(`data: ${JSON.stringify({ 
              type: 'error', 
              errorType: 'unimplemented_level',
              error: partial.error 
            })}\n\n`))
            
            // Close the stream and return
            controller.close()
            return
          }
          
          controller.enqueue(encoder.encode(`data: ${JSON.stringify({ 
            type: 'passage_update', 
            passage: partial 
          })}\n\n`))
        }
        
        // Get complete passage
        completePassage = await passageStream.object
        
        // Check again for unimplemented level error in the complete object
        if (completePassage.type === 'unimplemented_level_error') {
          // Send event to indicate level not implemented
          controller.enqueue(encoder.encode(`data: ${JSON.stringify({ 
            type: 'error', 
            errorType: 'unimplemented_level',
            error: completePassage.error 
          })}\n\n`))
          
          // Close the stream and return
          controller.close()
          return
        }
        
        // Send event to indicate passage is complete
        controller.enqueue(encoder.encode(`data: ${JSON.stringify({ 
          type: 'passage_complete', 
          passage: completePassage 
        })}\n\n`))
        
        // Start questions generation if we have a passage
        if (completePassage) {
          // Send event to indicate questions generation is starting
          controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type: 'questions_start' })}\n\n`))
          
          // Stream the questions
          const questionsStream = streamQuestions(
            completePassage.content,
            examType,
            difficultyId
          )
          
          let completeQuestions: any = null
          
          // Stream partial questions updates
          for await (const partial of questionsStream.partialObjectStream) {
            completeQuestions = partial
            
            // Check if there's an unimplemented level error
            if (partial.type === 'unimplemented_level_error') {
              // Send event to indicate level not implemented
              controller.enqueue(encoder.encode(`data: ${JSON.stringify({ 
                type: 'error', 
                errorType: 'unimplemented_level',
                error: partial.error 
              })}\n\n`))
              
              // Close the stream and return
              controller.close()
              return
            }
            
            controller.enqueue(encoder.encode(`data: ${JSON.stringify({ 
              type: 'questions_update', 
              questions: partial 
            })}\n\n`))
          }
          
          // Get complete questions
          completeQuestions = await questionsStream.object
          
          // Check again for unimplemented level error in the complete object
          if (completeQuestions.type === 'unimplemented_level_error') {
            // Send event to indicate level not implemented
            controller.enqueue(encoder.encode(`data: ${JSON.stringify({ 
              type: 'error', 
              errorType: 'unimplemented_level',
              error: completeQuestions.error 
            })}\n\n`))
            
            // Close the stream and return
            controller.close()
            return
          }
          
          // Send event to indicate everything is complete
          controller.enqueue(encoder.encode(`data: ${JSON.stringify({ 
            type: 'complete', 
            passage: completePassage,
            questions: completeQuestions
          })}\n\n`))
        }
        
      } catch (error) {
        console.error('Error generating content:', error)
        
        // Send error event
        controller.enqueue(encoder.encode(`data: ${JSON.stringify({ 
          type: 'error', 
          error: 'Failed to generate content' 
        })}\n\n`))
      }
      
      // Close the stream
      controller.close()
    }
  })
  
  // Return the stream as Server-Sent Events
  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive'
    }
  })
} 