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
import { ReadingUIProps } from "."

export function IELTSReadingUI({
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
}: ReadingUIProps) {
  const { t } = useTranslation()
  // Local state as fallback if not provided externally
  const [localSelectedAnswers, setLocalSelectedAnswers] = useState<number[]>(Array(questions.length).fill(-1))
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [progress, setProgress] = useState(0)
  const [showResults, setShowResults] = useState(false)
  const [activeTab, setActiveTab] = useState<string>("passage")
  
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
  
  // Calculate IELTS band score (from 1-9)
  const calculateIELTSBand = () => {
    if (questions.length === 0) return 0;
    
    const percentageCorrect = (calculateScore() / questions.length) * 100;
    
    // Simple band mapping (can be refined based on actual IELTS criteria)
    if (percentageCorrect >= 90) return 9.0;
    if (percentageCorrect >= 85) return 8.5;
    if (percentageCorrect >= 80) return 8.0;
    if (percentageCorrect >= 75) return 7.5;
    if (percentageCorrect >= 70) return 7.0;
    if (percentageCorrect >= 65) return 6.5;
    if (percentageCorrect >= 60) return 6.0;
    if (percentageCorrect >= 55) return 5.5;
    if (percentageCorrect >= 50) return 5.0;
    if (percentageCorrect >= 40) return 4.0;
    return 3.0; // Minimum band
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
              <p className="text-2xl font-semibold mt-2">
                Band: {calculateIELTSBand().toFixed(1)}
              </p>
              <p className="text-lg text-muted-foreground mt-1">
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
  
  // Main reading UI - For IELTS, we use a tabbed interface on mobile and side-by-side on desktop
  return (
    <div className="flex h-full flex-col gap-4 p-4">
      {/* Progress bar removed */}

      {/* Mobile view with tabs */}
      <div className="md:hidden flex-1">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col">
          <TabsList className="grid grid-cols-2">
            <TabsTrigger value="passage" disabled={!showPassagePanel}>{t('reading.passage')}</TabsTrigger>
            <TabsTrigger value="questions" disabled={!showQuestionsPanel}>{t('reading.questions')}</TabsTrigger>
          </TabsList>
          
          {showPassagePanel && (
            <TabsContent value="passage" className="flex-1 mt-2">
              <div className="h-full flex flex-col">
                <div className="mb-4">
                  <h2 className="text-2xl font-semibold">
                    {passage?.title || t('reading.generatingTitle')}
                    {isPassageLoading && (
                      <span className="ml-2 inline-block animate-pulse">...</span>
                    )}
                  </h2>
                </div>
                <div className="flex-1 overflow-hidden">
                  <ScrollArea className="h-full">
                    <div className="prose prose-lg dark:prose-invert max-w-none">
                      {/* For IELTS, render sections if available */}
                      {passage?.sections ? (
                        passage.sections.map((section: any, index: number) => (
                          <div key={index} className="mb-6">
                            {section.heading && <h3 className="text-xl font-semibold mb-3">{section.heading}</h3>}
                            <ReactMarkdown>{section.content}</ReactMarkdown>
                          </div>
                        ))
                      ) : passage?.content ? (
                        <ReactMarkdown>{passage.content}</ReactMarkdown>
                      ) : (
                        <p className="text-muted-foreground">{t('reading.generatingContent')}</p>
                      )}
                      
                      {/* Vocabulary notes section specific to IELTS */}
                      {passage?.vocabularyNotes && passage.vocabularyNotes.length > 0 && (
                        <div className="mt-6 p-4 border border-border rounded-md">
                          <h3 className="font-bold text-lg mb-2 flex items-center">
                            <Book className="h-5 w-5 mr-2" />
                            {t('reading.vocabulary')}
                          </h3>
                          <ul className="space-y-2">
                            {passage.vocabularyNotes.map((item: any, index: number) => (
                              <li key={index} className="flex flex-col">
                                <span className="font-semibold">{item.term}</span>
                                <span className="text-sm text-muted-foreground">{item.definition}</span>
                                {item.example && (
                                  <span className="text-sm italic mt-1">&ldquo;{item.example}&rdquo;</span>
                                )}
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
                </div>
              </div>
            </TabsContent>
          )}
          
          {showQuestionsPanel && (
            <TabsContent value="questions" className="flex-1 mt-2">
              <div className="h-full flex flex-col">
                <div className="mb-4">
                  <h2 className="text-2xl font-semibold">
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
                  </h2>
                </div>
                <div className="flex-1 flex flex-col">
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
                            {/* Question type indicator for IELTS */}
                            {questions[currentQuestion]?.questionType && (
                              <div className="inline-block px-3 py-1 bg-primary/10 text-primary rounded-md text-sm font-medium">
                                {questions[currentQuestion].questionType}
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
                </div>
              </div>
            </TabsContent>
          )}
        </Tabs>
      </div>

      {/* Desktop view with side-by-side display */}
      <div className="hidden md:flex flex-1 gap-4">
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
            <div className="flex-1 overflow-hidden">
              <ScrollArea className="h-full">
                <div className="prose prose-lg dark:prose-invert max-w-none">
                  {/* For IELTS, render sections if available */}
                  {passage?.sections ? (
                    passage.sections.map((section: any, index: number) => (
                      <div key={index} className="mb-6">
                        {section.heading && <h3 className="text-xl font-semibold mb-3">{section.heading}</h3>}
                        <ReactMarkdown>{section.content}</ReactMarkdown>
                      </div>
                    ))
                  ) : passage?.content ? (
                    <ReactMarkdown>{passage.content}</ReactMarkdown>
                  ) : (
                    <p className="text-muted-foreground">{t('reading.generatingContent')}</p>
                  )}
                  
                  {/* Vocabulary notes section specific to IELTS */}
                  {passage?.vocabularyNotes && passage.vocabularyNotes.length > 0 && (
                    <div className="mt-6 p-4 border border-border rounded-md">
                      <h3 className="font-bold text-lg mb-2 flex items-center">
                        <Book className="h-5 w-5 mr-2" />
                        {t('reading.vocabulary')}
                      </h3>
                      <ul className="space-y-2">
                        {passage.vocabularyNotes.map((item: any, index: number) => (
                          <li key={index} className="flex flex-col">
                            <span className="font-semibold">{item.term}</span>
                            <span className="text-sm text-muted-foreground">{item.definition}</span>
                            {item.example && (
                              <span className="text-sm italic mt-1">&ldquo;{item.example}&rdquo;</span>
                            )}
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
            </div>
          </div>
        )}

        {/* Questions Section */}
        {showQuestionsPanel && (
          <div className="flex flex-1 flex-col max-w-lg">
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