"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Progress } from "@/components/ui/progress"
import { MultiChoice } from "@/components/ui/multi-choice"
import { ArrowRight, Book, RefreshCw } from "lucide-react"
import ReactMarkdown from "react-markdown"
import { useTranslation } from "@/lib/i18n/hooks"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface GoetheReadingUIProps {
  passage: any;
  questions: any[];
  isPassageLoading: boolean;
  isQuestionsLoading: boolean;
  isQuestionsReady: boolean;
  onRestart: () => void;
  showQuestionsPanel?: boolean;
  showPassagePanel?: boolean;
}

export function GoetheReadingUI({
  passage,
  questions,
  isPassageLoading,
  isQuestionsLoading,
  isQuestionsReady,
  onRestart,
  showQuestionsPanel = true,
  showPassagePanel = true,
}: GoetheReadingUIProps) {
  const { t } = useTranslation()
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>(Array(questions.length).fill(-1))
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [progress, setProgress] = useState(0)
  const [showResults, setShowResults] = useState(false)
  const [activeTab, setActiveTab] = useState<string>("passage")
  
  // Handle answer selection
  const handleAnswerSelect = (questionId: number, answerIndex: number) => {
    if (!isQuestionsReady) return
    
    const newAnswers = [...selectedAnswers]
    newAnswers[questionId] = answerIndex
    setSelectedAnswers(newAnswers)
    
    // Update progress
    const answeredCount = newAnswers.filter(answer => answer !== -1).length
    setProgress((answeredCount / questions.length) * 100)
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
  
  // Main reading UI - For Goethe, we use a tabbed interface on mobile and side-by-side on desktop
  return (
    <div className="flex h-full flex-col gap-4 p-4">
      {/* Mobile view with tabs */}
      <div className="md:hidden flex-1">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col">
          <TabsList className="grid grid-cols-2">
            <TabsTrigger value="passage" disabled={!showPassagePanel}>{t('reading.passage')}</TabsTrigger>
            <TabsTrigger value="questions" disabled={!showQuestionsPanel}>{t('reading.questions')}</TabsTrigger>
          </TabsList>
          
          {showPassagePanel && (
            <TabsContent value="passage" className="flex-1 mt-2">
              <Card className="h-full flex flex-col">
                <CardHeader>
                  <CardTitle className="text-2xl">
                    {passage?.title || t('reading.generatingTitle')}
                    {isPassageLoading && (
                      <span className="ml-2 inline-block animate-pulse">...</span>
                    )}
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex-1 overflow-hidden">
                  <ScrollArea className="h-full">
                    <div className="prose prose-lg dark:prose-invert max-w-none">
                      {passage?.content ? (
                        <ReactMarkdown>{passage.content}</ReactMarkdown>
                      ) : (
                        <p className="text-muted-foreground">{t('reading.generatingContent')}</p>
                      )}
                      
                      {/* Vocabulary section specific to Goethe */}
                      {passage?.vocabulary && passage.vocabulary.length > 0 && (
                        <div className="mt-6 p-4 border border-border rounded-md">
                          <h3 className="font-bold text-lg mb-2 flex items-center">
                            <Book className="h-5 w-5 mr-2" />
                            {t('reading.vocabulary')}
                          </h3>
                          <ul className="space-y-2">
                            {passage.vocabulary.map((item: any, index: number) => (
                              <li key={index} className="flex flex-col">
                                <span className="font-semibold">{item.word}</span>
                                <span className="text-sm text-muted-foreground">{item.definition}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                      
                      {isPassageLoading && (
                        <div className="mt-2 h-4 w-24 animate-pulse rounded bg-muted"></div>
                      )}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>
            </TabsContent>
          )}
          
          {showQuestionsPanel && (
            <TabsContent value="questions" className="flex-1 mt-2">
              <Card className="h-full flex flex-col">
                <CardHeader>
                  <CardTitle className="text-2xl">
                    {isQuestionsLoading ? (
                      <>
                        {questions.length > 0 ? (
                          <>{t('reading.generatingQuestions')} ({questions.length})</>
                        ) : (
                          t('reading.generatingQuestions')
                        )}
                        <span className="ml-2 inline-block animate-pulse">...</span>
                      </>
                    ) : questions.length > 0 ? (
                      <>
                        {t('reading.question')} {currentQuestion + 1} {t('reading.of')} {questions.length}
                      </>
                    ) : (
                      t('reading.waitingForPassage')
                    )}
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex-1 flex flex-col">
                  {isQuestionsLoading && questions.length === 0 ? (
                    <div className="flex-1 space-y-4">
                      <div className="h-6 w-3/4 animate-pulse rounded bg-muted"></div>
                      <div className="space-y-2">
                        {[...Array(4)].map((_, i) => (
                          <div key={i} className="h-10 w-full animate-pulse rounded bg-muted"></div>
                        ))}
                      </div>
                    </div>
                  ) : questions.length > 0 ? (
                    <>
                      <div className="flex-1">
                        <div className="space-y-6">
                          <div className="space-y-4">
                            {/* Context is Goethe-specific */}
                            {questions[currentQuestion]?.context && (
                              <div className="p-3 bg-muted rounded-md text-sm">
                                {questions[currentQuestion].context}
                              </div>
                            )}
                            
                            <p className="text-xl font-medium">
                              {questions[currentQuestion]?.text}
                              {isQuestionsLoading && (
                                <span className="ml-2 inline-block animate-pulse">...</span>
                              )}
                            </p>
                            
                            <MultiChoice
                              options={questions[currentQuestion]?.options || []}
                              value={selectedAnswers[currentQuestion]}
                              onChange={(value) => handleAnswerSelect(currentQuestion, value)}
                              disabled={!isQuestionsReady}
                            />
                          </div>
                        </div>
                      </div>
                      <div className="mt-6 flex justify-end">
                        <Button
                          onClick={handleNextQuestion}
                          disabled={selectedAnswers[currentQuestion] === -1 || !isQuestionsReady}
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
                    </>
                  ) : (
                    <div className="flex flex-1 items-center justify-center">
                      <p className="text-muted-foreground">{t('reading.readPassageFirst')}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          )}
        </Tabs>
      </div>

      {/* Desktop view with side-by-side layout */}
      <div className="hidden md:flex flex-1 gap-4">
        {/* Passage Section */}
        {showPassagePanel && (
          <Card className="flex flex-1 flex-col">
            <CardHeader>
              <CardTitle className="text-2xl">
                {passage?.title || t('reading.generatingTitle')}
                {isPassageLoading && (
                  <span className="ml-2 inline-block animate-pulse">...</span>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent className="flex-1">
              <ScrollArea className="h-full">
                <div className="prose prose-lg dark:prose-invert max-w-none">
                  {passage?.content ? (
                    <ReactMarkdown>{passage.content}</ReactMarkdown>
                  ) : (
                    <p className="text-muted-foreground">{t('reading.generatingContent')}</p>
                  )}
                  
                  {/* Vocabulary section specific to Goethe */}
                  {passage?.vocabulary && passage.vocabulary.length > 0 && (
                    <div className="mt-6 p-4 border border-border rounded-md">
                      <h3 className="font-bold text-lg mb-2 flex items-center">
                        <Book className="h-5 w-5 mr-2" />
                        {t('reading.vocabulary')}
                      </h3>
                      <ul className="space-y-2">
                        {passage.vocabulary.map((item: any, index: number) => (
                          <li key={index} className="flex flex-col">
                            <span className="font-semibold">{item.word}</span>
                            <span className="text-sm text-muted-foreground">{item.definition}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  {isPassageLoading && (
                    <div className="mt-2 h-4 w-24 animate-pulse rounded bg-muted"></div>
                  )}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        )}

        {/* Questions Section */}
        {showQuestionsPanel && (
          <Card className="flex flex-1 flex-col">
            <CardHeader>
              <CardTitle className="text-2xl">
                {isQuestionsLoading ? (
                  <>
                    {questions.length > 0 ? (
                      <>{t('reading.generatingQuestions')} ({questions.length})</>
                    ) : (
                      t('reading.generatingQuestions')
                    )}
                    <span className="ml-2 inline-block animate-pulse">...</span>
                  </>
                ) : questions.length > 0 ? (
                  <>
                    {t('reading.question')} {currentQuestion + 1} {t('reading.of')} {questions.length}
                  </>
                ) : (
                  t('reading.waitingForPassage')
                )}
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-1 flex-col">
              {isQuestionsLoading && questions.length === 0 ? (
                <div className="flex-1 space-y-4">
                  <div className="h-6 w-3/4 animate-pulse rounded bg-muted"></div>
                  <div className="space-y-2">
                    {[...Array(4)].map((_, i) => (
                      <div key={i} className="h-10 w-full animate-pulse rounded bg-muted"></div>
                    ))}
                  </div>
                </div>
              ) : questions.length > 0 ? (
                <>
                  <div className="flex-1">
                    <div className="space-y-6">
                      <div className="space-y-4">
                        {/* Context is Goethe-specific */}
                        {questions[currentQuestion]?.context && (
                          <div className="p-3 bg-muted rounded-md text-sm">
                            {questions[currentQuestion].context}
                          </div>
                        )}
                        
                        <p className="text-xl font-medium">
                          {questions[currentQuestion]?.text}
                          {isQuestionsLoading && (
                            <span className="ml-2 inline-block animate-pulse">...</span>
                          )}
                        </p>
                        
                        <MultiChoice
                          options={questions[currentQuestion]?.options || []}
                          value={selectedAnswers[currentQuestion]}
                          onChange={(value) => handleAnswerSelect(currentQuestion, value)}
                          disabled={!isQuestionsReady}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="mt-6 flex justify-end">
                    <Button
                      onClick={handleNextQuestion}
                      disabled={selectedAnswers[currentQuestion] === -1 || !isQuestionsReady}
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
                </>
              ) : (
                <div className="flex flex-1 items-center justify-center">
                  <p className="text-muted-foreground">{t('reading.readPassageFirst')}</p>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
} 