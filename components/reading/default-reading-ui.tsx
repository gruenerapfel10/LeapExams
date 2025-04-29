"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Progress } from "@/components/ui/progress"
import { MultiChoice } from "@/components/ui/multi-choice"
import { ArrowRight, RefreshCw } from "lucide-react"
import ReactMarkdown from "react-markdown"
import { useTranslation } from "@/lib/i18n/hooks"

interface DefaultReadingUIProps {
  passage: any;
  questions: any[];
  isPassageLoading: boolean;
  isQuestionsLoading: boolean;
  isQuestionsReady: boolean;
  onRestart: () => void;
  showQuestionsPanel?: boolean;
  showPassagePanel?: boolean;
  selectedAnswers?: number[];
  onAnswerSelect?: (questionId: number, answerIndex: number) => void;
}

export function DefaultReadingUI({
  passage,
  questions,
  isPassageLoading,
  isQuestionsLoading,
  isQuestionsReady,
  onRestart,
  showQuestionsPanel = true,
  showPassagePanel = true,
  selectedAnswers: externalSelectedAnswers,
  onAnswerSelect: externalOnAnswerSelect,
}: DefaultReadingUIProps) {
  const { t } = useTranslation()
  // Local state as fallback if not provided externally
  const [localSelectedAnswers, setLocalSelectedAnswers] = useState<number[]>(Array(questions.length).fill(-1))
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [progress, setProgress] = useState(0)
  const [showResults, setShowResults] = useState(false)
  
  // Use external state if provided, otherwise use local state
  const selectedAnswers = externalSelectedAnswers || localSelectedAnswers
  
  // Handle answer selection
  const handleAnswerSelect = (questionId: number, answerIndex: number) => {
    if (!isQuestionsReady) return
    
    if (externalOnAnswerSelect) {
      // Use external handler if provided
      externalOnAnswerSelect(questionId, answerIndex)
    } else {
      // Otherwise use local state
      const newAnswers = [...localSelectedAnswers]
      newAnswers[questionId] = answerIndex
      setLocalSelectedAnswers(newAnswers)
      
      // Update progress
      const answeredCount = newAnswers.filter(answer => answer !== -1).length
      setProgress((answeredCount / questions.length) * 100)
    }
  }

  // Navigate to next question
  const handleNextQuestion = () => {
    if (!isQuestionsReady) return
    
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(prev => prev + 1)
    } else {
      setShowResults(true)
    }
  }

  // Calculate score
  const calculateScore = () => {
    return questions.reduce((score, question, index) => {
      return score + (selectedAnswers[index] === question.correctAnswer ? 1 : 0)
    }, 0)
  }
  
  // Render results view
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
              onClick={onRestart}
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
    <div className="flex h-full flex-col gap-4">
      <div className="flex flex-1 gap-4">
        {/* Passage Section */}
        {showPassagePanel && (
          <div className="flex flex-1 flex-col">
            <div className="mb-4">
              <h2 className="text-2xl font-semibold">
                {passage?.title || t('reading.generatingTitle')}
                {isPassageLoading && (
                  <span className="ml-2 inline-block animate-pulse">...</span>
                )}
              </h2>
            </div>
            <div className="flex-1">
              <ScrollArea className="h-full">
                <div className="prose prose-lg dark:prose-invert max-w-none">
                  {passage?.content ? (
                    <ReactMarkdown>{passage.content}</ReactMarkdown>
                  ) : (
                    <p className="text-muted-foreground">{t('reading.generatingContent')}</p>
                  )}
                  {isPassageLoading && (
                    <div className="mt-2 h-4 w-24 animate-pulse rounded bg-muted"></div>
                  )}
                </div>
              </ScrollArea>
            </div>
          </div>
        )}

        {/* Questions Section */}
        {showQuestionsPanel && (
          <div className="flex flex-1 flex-col">
            <div className="flex flex-row items-center justify-between mb-4">
              <h2 className="text-2xl font-semibold">
                {t('reading.questions')}
                {isQuestionsLoading && (
                  <span className="ml-2 inline-block animate-pulse">...</span>
                )}
              </h2>
              <Button
                variant="outline"
                size="icon"
                onClick={onRestart}
                title={t('reading.restartGeneration')}
              >
                <RefreshCw className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex-1 overflow-hidden">
              <ScrollArea className="h-full">
                {isQuestionsReady ? (
                  <div className="space-y-6">
                    {questions.map((question, index) => (
                      <div key={index} className="space-y-3">
                        <h3 className="font-medium text-lg">
                          {index + 1}. {question.text}
                        </h3>
                        <MultiChoice
                          options={question.options}
                          value={selectedAnswers[index]}
                          onChange={(option) => handleAnswerSelect(index, option)}
                        />
                      </div>
                    ))}
                    {questions.length > 0 && (
                      <div className="pt-8">
                        <Button className="w-full" onClick={handleNextQuestion}>
                          {t('reading.submitAnswers')}
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-muted-foreground">
                    {questions.length === 0 && isQuestionsLoading ? (
                      <div>
                        <p>{t('reading.generatingQuestions')}</p>
                        <div className="mt-4">
                          <div className="h-4 w-3/4 animate-pulse rounded bg-muted mb-4"></div>
                          <div className="h-4 w-1/2 animate-pulse rounded bg-muted"></div>
                        </div>
                      </div>
                    ) : (
                      <p>{t('reading.waitingForPassage')}</p>
                    )}
                  </div>
                )}
              </ScrollArea>
            </div>
          </div>
        )}
      </div>
    </div>
  )
} 