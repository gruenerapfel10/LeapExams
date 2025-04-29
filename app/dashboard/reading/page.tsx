"use client"

import { useEffect, useState, useRef } from "react"
import { useExam } from "@/lib/context/exam-context"
import { Progress } from "@/components/ui/progress"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useTranslation } from "@/lib/i18n/hooks"
import ReadingSkeleton from "./loading-skeleton"
import { ArrowRight, RefreshCw } from "lucide-react"
import ReactMarkdown from "react-markdown"
import { MultiChoice } from "@/components/ui/multi-choice"

interface Question {
  id: number
  text: string
  options: string[]
  correctAnswer: number
}

export default function ReadingPage() {
  const { examType } = useExam()
  const { t } = useTranslation()
  const [passage, setPassage] = useState<{ title: string; content: string } | null>(null)
  const [questions, setQuestions] = useState<Question[]>([])
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>([])
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [progress, setProgress] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [showResults, setShowResults] = useState(false)
  const hasGenerated = useRef(false)

  const generateContent = async () => {
    setIsLoading(true)
    setShowResults(false)
    setCurrentQuestion(0)
    setSelectedAnswers([])
    setProgress(0)
    hasGenerated.current = false

    try {
      const response = await fetch('/api/reading/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ examType }),
      })

      if (!response.ok) {
        throw new Error('Failed to generate content')
      }

      const data = await response.json()
      setPassage(data.passage)
      setQuestions(data.questions)
      setSelectedAnswers(new Array(data.questions.length).fill(-1))
      hasGenerated.current = true
    } catch (error) {
      console.error("Error generating content:", error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    generateContent()
  }, [examType])

  const handleAnswerSelect = (questionId: number, answerIndex: number) => {
    const newAnswers = [...selectedAnswers]
    newAnswers[questionId] = answerIndex
    setSelectedAnswers(newAnswers)
    
    // Update progress
    const answeredCount = newAnswers.filter(answer => answer !== -1).length
    setProgress((answeredCount / questions.length) * 100)
  }

  const handleNextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(prev => prev + 1)
    } else {
      setShowResults(true)
    }
  }

  const calculateScore = () => {
    return questions.reduce((score, question, index) => {
      return score + (selectedAnswers[index] === question.correctAnswer ? 1 : 0)
    }, 0)
  }

  if (isLoading) {
    return <ReadingSkeleton />
  }

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
                {calculateScore()} / {questions.length}
              </p>
              <p className="text-lg text-muted-foreground">
                {t('reading.score')}
              </p>
            </div>
            <Button 
              className="w-full text-lg" 
              onClick={generateContent}
            >
              <RefreshCw className="mr-2 h-5 w-5" />
              {t('reading.tryAgain')}
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

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
            <CardTitle className="text-2xl">{passage?.title}</CardTitle>
          </CardHeader>
          <CardContent className="flex-1">
            <ScrollArea className="h-full">
              <div className="prose prose-lg dark:prose-invert max-w-none">
                <ReactMarkdown>{passage?.content || ''}</ReactMarkdown>
              </div>
            </ScrollArea>
          </CardContent>
        </Card>

        {/* Questions Section */}
        <Card className="flex flex-col">
          <CardHeader>
            <CardTitle className="text-2xl">
              {t('reading.question')} {currentQuestion + 1} {t('reading.of')} {questions.length}
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-1 flex-col">
            <div className="flex-1">
              <div className="space-y-6">
                <div className="space-y-4">
                  <p className="text-xl font-medium">
                    {questions[currentQuestion]?.text}
                  </p>
                  <MultiChoice
                    options={questions[currentQuestion]?.options || []}
                    value={selectedAnswers[currentQuestion]}
                    onChange={(value) => handleAnswerSelect(currentQuestion, value)}
                  />
                </div>
              </div>
            </div>
            <div className="mt-6 flex justify-end">
              <Button
                onClick={handleNextQuestion}
                disabled={selectedAnswers[currentQuestion] === -1}
                className="text-lg"
              >
                {currentQuestion === questions.length - 1 ? (
                  t('reading.finish')
                ) : (
                  <>
                    {t('reading.next')}
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 