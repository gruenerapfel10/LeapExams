"use client"

import { useEffect, useState } from "react"
import { useExam } from "@/lib/context/user-preferences-context"
import { Progress } from "@/components/ui/progress"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useTranslation } from "@/lib/i18n/hooks"
import ReadingSkeleton from "./loading-skeleton"
import { ArrowRight, RefreshCw } from "lucide-react"
import ReactMarkdown from "react-markdown"
import { MultiChoice } from "@/components/ui/multi-choice"

interface Passage {
  title: string
  content: string
}

interface Question {
  id: number
  text: string
  options: string[]
  correctAnswer: number
}

interface ContentState {
  passage: Passage | null
  questions: Question[]
  isPassageLoading: boolean
  isQuestionsLoading: boolean
  isPassageComplete: boolean
  isQuestionsComplete: boolean
  isQuestionsReady: boolean
}

export default function ReadingPage() {
  const { examType, isExamTypeLoaded } = useExam()
  const { t } = useTranslation()
  
  // Content state
  const [content, setContent] = useState<ContentState>({
    passage: null,
    questions: [],
    isPassageLoading: false,
    isQuestionsLoading: false,
    isPassageComplete: false,
    isQuestionsComplete: false,
    isQuestionsReady: false
  })
  
  // UI state
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>([])
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [progress, setProgress] = useState(0)
  const [showResults, setShowResults] = useState(false)

  // Function to stream passage
  const streamPassage = async (signal: AbortSignal, currentExamType: string) => {
    try {
      const response = await fetch('/api/reading/passage', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ examType: currentExamType }),
        signal,
      })

      if (!response.ok) throw new Error('Failed to fetch passage')
      
      const reader = response.body?.getReader()
      if (!reader) throw new Error('No reader available')
      
      const decoder = new TextDecoder()
      let passageComplete = false
      
      while (!passageComplete) {
        const { done, value } = await reader.read()
        if (done) break
        
        const chunk = decoder.decode(value, { stream: true })
        const lines = chunk.split('\n\n')
        
        for (const line of lines) {
          if (!line.startsWith('data: ')) continue
          
          try {
            const data = JSON.parse(line.slice(6))
            
            if (!data.passage) continue
            
            // Update passage
            setContent(prev => ({
              ...prev,
              passage: data.passage,
              isPassageLoading: false,
            }))
            
            // If passage is complete, start streaming questions
            if (data.type === 'complete') {
              setContent(prev => ({ ...prev, isPassageComplete: true }))
              passageComplete = true
              
              if (data.passage.content) {
                streamQuestions(signal, currentExamType, data.passage.content)
              }
            }
          } catch (error) {
            console.error('Error parsing stream data:', error)
          }
        }
      }
    } catch (error) {
      if (error instanceof DOMException && error.name === 'AbortError') {
        console.log('Passage streaming aborted')
      } else {
        console.error('Error streaming passage:', error)
      }
      
      setContent(prev => ({ ...prev, isPassageLoading: false }))
    }
  }

  // Function to stream questions
  const streamQuestions = async (signal: AbortSignal, currentExamType: string, passageContent: string) => {
    setContent(prev => ({ 
      ...prev, 
      isQuestionsLoading: true,
      questions: [], // Reset questions when starting new stream
      isQuestionsComplete: false,
      isQuestionsReady: false
    }))
    
    try {
      const response = await fetch('/api/reading/questions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ examType: currentExamType, passage: passageContent }),
        signal,
      })

      if (!response.ok) throw new Error('Failed to fetch questions')
      
      const reader = response.body?.getReader()
      if (!reader) throw new Error('No reader available')
      
      const decoder = new TextDecoder()
      let questionsComplete = false
      let partialQuestions: Question[] = []
      
      while (!questionsComplete) {
        const { done, value } = await reader.read()
        if (done) break
        
        const chunk = decoder.decode(value, { stream: true })
        const lines = chunk.split('\n\n')
        
        for (const line of lines) {
          if (!line.startsWith('data: ')) continue
          
          try {
            const data = JSON.parse(line.slice(6))
            
            if (!data.questions) continue
            
            // Update questions when we have data
            if (data.questions.questions && Array.isArray(data.questions.questions)) {
              partialQuestions = data.questions.questions
              setContent(prev => ({ 
                ...prev, 
                questions: partialQuestions,
                isQuestionsLoading: true // Keep loading state while streaming
              }))
              setSelectedAnswers(new Array(partialQuestions.length).fill(-1))
            }
            
            // Mark as complete when done
            if (data.type === 'complete') {
              setContent(prev => ({ 
                ...prev, 
                questions: partialQuestions,
                isQuestionsLoading: false,
                isQuestionsComplete: true,
                isQuestionsReady: true // Only mark as ready when complete
              }))
              questionsComplete = true
            }
          } catch (error) {
            console.error('Error parsing questions data:', error)
          }
        }
      }
    } catch (error) {
      if (error instanceof DOMException && error.name === 'AbortError') {
        console.log('Questions streaming aborted')
      } else {
        console.error('Error streaming questions:', error)
      }
      
      setContent(prev => ({ ...prev, isQuestionsLoading: false }))
    }
  }

  // Generate content when exam type is loaded or changes
  useEffect(() => {
    // Don't generate anything until exam type is loaded
    if (!isExamTypeLoaded) return
    
    let isMounted = true
    console.log(`Reading page: Starting content generation for ${examType}`)
    
    // Reset state
    setContent({
      passage: null,
      questions: [],
      isPassageLoading: true,
      isQuestionsLoading: false,
      isPassageComplete: false,
      isQuestionsComplete: false,
      isQuestionsReady: false
    })
    setSelectedAnswers([])
    setCurrentQuestion(0)
    setProgress(0)
    setShowResults(false)
    
    // Create an abort controller for this effect instance
    const controller = new AbortController()
    
    // Start streaming passage
    streamPassage(controller.signal, examType)
    
    // Cleanup function
    return () => {
      console.log(`Reading page: Cleaning up for ${examType}`)
      isMounted = false
      controller.abort()
    }
  }, [examType, isExamTypeLoaded])

  const handleAnswerSelect = (questionId: number, answerIndex: number) => {
    // Only allow answering if questions are ready
    if (!content.isQuestionsReady) return
    
    const newAnswers = [...selectedAnswers]
    newAnswers[questionId] = answerIndex
    setSelectedAnswers(newAnswers)
    
    // Update progress
    const answeredCount = newAnswers.filter(answer => answer !== -1).length
    setProgress((answeredCount / content.questions.length) * 100)
  }

  const handleNextQuestion = () => {
    // Only allow navigation if questions are ready
    if (!content.isQuestionsReady) return
    
    if (currentQuestion < content.questions.length - 1) {
      setCurrentQuestion(prev => prev + 1)
    } else {
      setShowResults(true)
    }
  }

  const calculateScore = () => {
    return content.questions.reduce((score, question, index) => {
      return score + (selectedAnswers[index] === question.correctAnswer ? 1 : 0)
    }, 0)
  }

  // Show loading if exam type hasn't loaded yet
  if (!isExamTypeLoaded) {
    return <ReadingSkeleton />
  }

  // Show loading if initial content loading
  if (content.isPassageLoading && !content.passage) {
    return <ReadingSkeleton />
  }

  // Show results view
  if (showResults) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-4 p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-center text-2xl">{t('reading.results')}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center">
              <p className="text-4xl font-bold">
                {calculateScore()} / {content.questions.length}
              </p>
              <p className="text-lg text-muted-foreground">
                {t('reading.score')}
              </p>
            </div>
            <Button 
              className="w-full text-lg" 
              onClick={() => {
                // Reset all states to initial values
                setContent({
                  passage: null,
                  questions: [],
                  isPassageLoading: true,
                  isQuestionsLoading: false,
                  isPassageComplete: false,
                  isQuestionsComplete: false,
                  isQuestionsReady: false
                })
                setSelectedAnswers([])
                setCurrentQuestion(0)
                setProgress(0)
                setShowResults(false)
                // Force regeneration by triggering the useEffect
                const controller = new AbortController()
                streamPassage(controller.signal, examType)
              }}
            >
              <RefreshCw className="mr-2 h-5 w-5" />
              {t('reading.tryAgain')}
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Main reading UI
  return (
    <div className="flex h-full flex-col gap-4 p-4">
      <div className="flex items-center gap-4">
        <Progress value={progress} className="flex-1" />
        <span className="text-base text-muted-foreground">
          {Math.round(progress)}%
        </span>
      </div>

      <div className="grid flex-1 grid-cols-2 gap-4">
        {/* Passage Section */}
        <Card className="flex flex-col">
          <CardHeader>
            <CardTitle className="text-2xl">
              {content.passage?.title || t('reading.generatingTitle')}
              {content.isPassageLoading && !content.isPassageComplete && (
                <span className="ml-2 inline-block animate-pulse">...</span>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent className="flex-1">
            <ScrollArea className="h-full">
              <div className="prose prose-lg dark:prose-invert max-w-none">
                {content.passage?.content ? (
                  <ReactMarkdown>{content.passage.content}</ReactMarkdown>
                ) : (
                  <p className="text-muted-foreground">{t('reading.generatingContent')}</p>
                )}
                {content.isPassageLoading && !content.isPassageComplete && (
                  <div className="mt-2 h-4 w-24 animate-pulse rounded bg-muted"></div>
                )}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>

        {/* Questions Section */}
        <Card className="flex flex-col">
          <CardHeader>
            <CardTitle className="text-2xl">
              {content.isQuestionsLoading ? (
                <>
                  {content.questions.length > 0 ? (
                    // Show progress while streaming
                    <>{t('reading.generatingQuestions')} ({content.questions.length})</>
                  ) : (
                    t('reading.generatingQuestions')
                  )}
                  <span className="ml-2 inline-block animate-pulse">...</span>
                </>
              ) : content.questions.length > 0 ? (
                <>
                  {t('reading.question')} {currentQuestion + 1} {t('reading.of')} {content.questions.length}
                </>
              ) : (
                t('reading.waitingForPassage')
              )}
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-1 flex-col">
            {content.isQuestionsLoading && content.questions.length === 0 ? (
              // Show skeleton only when no questions are loaded yet
              <div className="flex-1 space-y-4">
                <div className="h-6 w-3/4 animate-pulse rounded bg-muted"></div>
                <div className="space-y-2">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="h-10 w-full animate-pulse rounded bg-muted"></div>
                  ))}
                </div>
              </div>
            ) : content.questions.length > 0 ? (
              <>
                <div className="flex-1">
                  <div className="space-y-6">
                    <div className="space-y-4">
                      <p className="text-xl font-medium">
                        {content.questions[currentQuestion]?.text}
                        {content.isQuestionsLoading && (
                          <span className="ml-2 inline-block animate-pulse">...</span>
                        )}
                      </p>
                      <MultiChoice
                        options={content.questions[currentQuestion]?.options || []}
                        value={selectedAnswers[currentQuestion]}
                        onChange={(value) => handleAnswerSelect(currentQuestion, value)}
                        disabled={!content.isQuestionsReady}
                      />
                    </div>
                  </div>
                </div>
                <div className="mt-6 flex justify-end">
                  <Button
                    onClick={handleNextQuestion}
                    disabled={selectedAnswers[currentQuestion] === -1 || !content.isQuestionsReady}
                    className="text-lg"
                  >
                    {currentQuestion === content.questions.length - 1 ? (
                      t('reading.finish')
                    ) : (
                      <>
                        {t('reading.next')}
                        <ArrowRight className="ml-2 h-5 w-5" />
                      </>
                    )}
                  </Button>
                </div>
              </>
            ) : (
              <div className="flex flex-1 items-center justify-center">
                <p className="text-muted-foreground">{t('reading.readPassageFirst')}</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 