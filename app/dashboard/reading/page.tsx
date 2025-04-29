"use client"

import { useEffect, useState, useRef, useCallback } from "react"
import { useExam } from "@/lib/context/user-preferences-context"
import { useTranslation } from "@/lib/i18n/hooks"
import ReadingSkeleton from "./loading-skeleton"
import { getReadingUI, ReadingUIProps } from "@/components/reading"
import { ExamType } from "@/lib/constants"
import { ExamConfigSelector } from "@/components/reading/exam-config-selector"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import { type LayoutNode } from "@/components/TabSystem"
import { v4 as uuidv4 } from 'uuid'
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import dynamic from 'next/dynamic'
import { Progress } from "@/components/ui/progress"

// Dynamically import TabSystem with SSR disabled
const TabSystem = dynamic(
  () => import('@/components/TabSystem').then(mod => mod.TabSystem),
  { ssr: false }
)

// Define initial layout structure function
const generateInitialLayout = (t: any): LayoutNode => ({
  id: 'root_split', 
  type: 'split' as const,
  direction: 'vertical' as const,
  sizes: [20, 80],
  children: [
    // Top section: Progress
    {
      id: `window-progress`,
      type: 'window' as const,
      tabs: [
        {
          id: `progress-tab`,
          title: t('reading.progressTab', { defaultValue: 'Progress' }),
          iconType: 'percent'
        }
      ],
      activeTabId: `progress-tab`,
      isCollapsed: false
    },
    // Bottom section with passage and questions side by side
    {
      id: 'content_split',
      type: 'split' as const,
      direction: 'horizontal' as const,
      sizes: [60, 40],
      children: [
        // Left pane: Reading passage
        {
          id: `window-passage`,
          type: 'window' as const,
          tabs: [
            {
              id: `passage-tab`,
              title: t('reading.passageTab'),
              iconType: 'bookOpen'
            }
          ],
          activeTabId: `passage-tab`,
          isCollapsed: false
        },
        // Right pane: Questions
        {
          id: `window-questions`,
          type: 'window' as const,
          tabs: [
            {
              id: `questions-tab`,
              title: t('reading.questionsTab'),
              iconType: 'fileQuestion'
            }
          ],
          activeTabId: `questions-tab`,
          isCollapsed: false
        }
      ]
    }
  ]
});

interface ContentState {
  passage: any | null;
  questions: any[];
  isPassageLoading: boolean;
  isQuestionsLoading: boolean;
  isQuestionsReady: boolean;
}

export default function ReadingPage() {
  const { examType, setExamType, isExamTypeLoaded, difficulty } = useExam()
  const { t } = useTranslation()
  
  // Add state to track whether configuration is complete
  const [configComplete, setConfigComplete] = useState(false)
  
  // Track the EventSource instance
  const eventSourceRef = useRef<EventSource | null>(null)
  
  // Content state
  const [content, setContent] = useState<ContentState>({
    passage: null,
    questions: [],
    isPassageLoading: false,
    isQuestionsLoading: false,
    isQuestionsReady: false
  })

  // Add state for tracking answered questions
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>([])
  const [progress, setProgress] = useState(0)

  // Update answers and progress when questions change
  useEffect(() => {
    if (content.questions.length > 0) {
      setSelectedAnswers(Array(content.questions.length).fill(-1))
      setProgress(0)
    }
  }, [content.questions])

  // Handler for answer selection
  const handleAnswerSelect = useCallback((questionId: number, answerIndex: number) => {
    if (!content.isQuestionsReady) return
    
    setSelectedAnswers(prev => {
      const newAnswers = [...prev]
      newAnswers[questionId] = answerIndex
      
      // Update progress
      const answeredCount = newAnswers.filter(answer => answer !== -1).length
      const progressValue = (answeredCount / content.questions.length) * 100
      setProgress(progressValue)
      
      return newAnswers
    })
  }, [content.isQuestionsReady, content.questions.length])

  // Error state
  const [error, setError] = useState<{message: string, type?: string} | null>(null)

  // TabSystem layout state
  const [tabLayout, setTabLayout] = useState<LayoutNode | null>(null)

  // Initialize tab layout when exam type is loaded and config is complete
  useEffect(() => {
    if (configComplete && examType && !tabLayout) {
      // Use the generateInitialLayout function to create the layout
      setTabLayout(generateInitialLayout(t));
    }
  }, [configComplete, examType, tabLayout, t])

  // Function to fetch content using EventSource
  const fetchContent = (currentExamType: ExamType) => {
    // Reset error state
    setError(null)
    
    // Clean up any existing connection
    if (eventSourceRef.current) {
      eventSourceRef.current.close()
      eventSourceRef.current = null
    }
    
    // Reset state
    setContent({
      passage: null,
      questions: [],
      isPassageLoading: true,
      isQuestionsLoading: false,
      isQuestionsReady: false
    })
    
    // Create URL with query params including difficulty if provided
    const queryParams = new URLSearchParams({ 
      examType: currentExamType 
    });
    
    if (difficulty) {
      queryParams.set('difficulty', difficulty);
    }
    
    const url = `/api/reading/content?${queryParams.toString()}`
    
    // Create EventSource connection
    const eventSource = new EventSource(url)
    eventSourceRef.current = eventSource
    
    // Handle connection open
    eventSource.onopen = () => {
      console.log('EventSource connection opened')
    }
    
    // Handle messages
    eventSource.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data)
        
        // Handle different event types
        switch (data.type) {
          case 'passage_start':
            setContent(prev => ({
              ...prev,
              isPassageLoading: true
            }))
            break
            
          case 'passage_update':
            if (data.passage) {
              // Only use the update if we don't already have a more complete version
              setContent(prev => {
                // If we already have sections but the update doesn't, preserve our current passage
                if (prev.passage?.sections && !data.passage.sections) {
                  return {
                    ...prev,
                    isPassageLoading: true
                  }
                }
                
                return {
                  ...prev,
                  passage: data.passage,
                  isPassageLoading: true
                }
              })
            }
            break
            
          case 'passage_complete':
            if (data.passage) {
              setContent(prev => ({
                ...prev,
                passage: data.passage,
                isPassageLoading: false
              }))
            }
            break
            
          case 'questions_start':
            setContent(prev => ({
              ...prev,
              isQuestionsLoading: true
            }))
            break
            
          case 'questions_update':
            if (data.questions && data.questions.questions) {
              setContent(prev => ({
                ...prev,
                questions: data.questions.questions,
                isQuestionsLoading: true
              }))
            }
            break
            
          case 'complete':
            // Only update if the new data is more complete than what we already have
            setContent(prev => {
              const newPassage = data.passage || prev.passage;
              const newQuestions = data.questions?.questions || prev.questions;
              
              return {
                ...prev,
                passage: newPassage,
                questions: newQuestions,
                isPassageLoading: false,
                isQuestionsLoading: false,
                isQuestionsReady: true
              }
            })
            
            // Close connection when complete
            eventSource.close()
            eventSourceRef.current = null
            break
            
          case 'error':
            console.error('Error from server:', data.error)
            
            // Handle specific error types
            if (data.errorType === 'unimplemented_level') {
              setError({
                message: data.error,
                type: 'unimplemented_level'
              })
              
              // Return to config screen after a short delay
              setTimeout(() => {
                setConfigComplete(false)
              }, 1500)
            }
            
            setContent(prev => ({
              ...prev,
              isPassageLoading: false,
              isQuestionsLoading: false
            }))
            
            // Close connection on error
            eventSource.close()
            eventSourceRef.current = null
            break
        }
      } catch (error) {
        console.error('Error parsing event data:', error)
      }
    }
    
    // Handle errors
    eventSource.onerror = (error) => {
      console.error('EventSource error:', error)
      setContent(prev => ({
        ...prev,
        isPassageLoading: false,
        isQuestionsLoading: false
      }))
      
      // Close connection on error
      eventSource.close()
      eventSourceRef.current = null
    }
  }

  // Handler for config completion
  const handleConfigComplete = (selectedExamType: ExamType) => {
    // Update the exam type if it was changed
    if (examType !== selectedExamType) {
      setExamType(selectedExamType);
    }
    
    // Mark config as complete to show the practice UI
    setConfigComplete(true);
    
    // Start content generation with the selected settings
    fetchContent(selectedExamType);
  }
  
  // Handle back button click
  const handleBackToConfig = () => {
    // Reset config status to show config UI again
    setConfigComplete(false);
    
    // Clean up any existing connection
    if (eventSourceRef.current) {
      eventSourceRef.current.close();
      eventSourceRef.current = null;
    }
  }

  // Handle restart
  const handleRestart = () => {
    fetchContent(examType);
  }

  // Function to get content for a specific tab ID
  const getContentForTab = useCallback((tabId: string) => {
    // Get the appropriate UI component based on exam type
    const ReadingUIComponent = getReadingUI(examType);
    
    // Check if this is a passage tab or questions tab
    if (tabId.includes('passage')) {
      // Return only the passage part of the UI
      return (
        <div className="h-full w-full p-4 overflow-auto">
          <ReadingUIComponent
            passage={content.passage}
            questions={[]}
            isPassageLoading={content.isPassageLoading}
            isQuestionsLoading={false}
            isQuestionsReady={false}
            onRestart={handleRestart}
            showQuestionsPanel={false}
            showPassagePanel={true}
          />
        </div>
      );
    } else if (tabId.includes('questions')) {
      // Return only the questions part of the UI
      return (
        <div className="h-full w-full p-4 overflow-auto">
          <ReadingUIComponent
            passage={content.passage}
            questions={content.questions}
            isPassageLoading={false}
            isQuestionsLoading={content.isQuestionsLoading}
            isQuestionsReady={content.isQuestionsReady}
            onRestart={handleRestart}
            showQuestionsPanel={true}
            showPassagePanel={false}
            selectedAnswers={selectedAnswers}
            onAnswerSelect={handleAnswerSelect}
          />
        </div>
      );
    } else if (tabId.includes('progress')) {
      // Return the progress bar UI
      const answeredCount = selectedAnswers.filter(answer => answer !== -1).length;
      const totalQuestions = content.questions.length || 1; // Avoid division by zero
      
      return (
        <div className="h-full w-full p-6 flex flex-col gap-6">
          <h2 className="text-2xl font-semibold">{t('reading.progressTab', { defaultValue: 'Progress' })}</h2>
          
          <div className="space-y-6">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">
                  {t('reading.questionsAnswered', { defaultValue: 'Questions Answered' })}
                </span>
                <span className="text-sm text-muted-foreground">
                  {answeredCount} / {totalQuestions}
                </span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 border rounded-lg">
                <h3 className="text-sm font-medium mb-2">{t('reading.readingTime', { defaultValue: 'Reading Time' })}</h3>
                <div className="text-2xl font-bold">15:00</div>
                <p className="text-xs text-muted-foreground mt-1">{t('reading.estimatedTime', { defaultValue: 'Estimated time' })}</p>
              </div>
              
              <div className="p-4 border rounded-lg">
                <h3 className="text-sm font-medium mb-2">{t('reading.difficulty', { defaultValue: 'Difficulty' })}</h3>
                <div className="text-2xl font-bold">
                  {examType === 'ielts' ? 'Academic' : 'B2'}
                </div>
                <p className="text-xs text-muted-foreground mt-1">{t('reading.level', { defaultValue: 'Level' })}</p>
              </div>
            </div>
            
            <div className="p-4 border rounded-lg">
              <h3 className="text-sm font-medium mb-2">{t('reading.status', { defaultValue: 'Status' })}</h3>
              <div className="flex items-center gap-2">
                {content.isPassageLoading ? (
                  <div className="flex items-center text-amber-500">
                    <span className="relative flex h-3 w-3 mr-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-3 w-3 bg-amber-500"></span>
                    </span>
                    {t('reading.generatingPassage', { defaultValue: 'Generating passage' })}
                  </div>
                ) : content.isQuestionsLoading ? (
                  <div className="flex items-center text-amber-500">
                    <span className="relative flex h-3 w-3 mr-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-3 w-3 bg-amber-500"></span>
                    </span>
                    {t('reading.generatingQuestions', { defaultValue: 'Generating questions' })}
                  </div>
                ) : content.isQuestionsReady ? (
                  <div className="flex items-center text-green-500">
                    <span className="relative flex h-3 w-3 mr-2">
                      <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                    </span>
                    {t('reading.ready', { defaultValue: 'Ready' })}
                  </div>
                ) : (
                  <div className="flex items-center text-muted-foreground">
                    <span className="relative flex h-3 w-3 mr-2">
                      <span className="relative inline-flex rounded-full h-3 w-3 bg-muted-foreground"></span>
                    </span>
                    {t('reading.notStarted', { defaultValue: 'Not started' })}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      );
    }
    
    // Fallback for unknown tab IDs
    return <div className="p-4">Unknown tab content</div>;
  }, [content, examType, handleRestart, t, progress, selectedAnswers]);

  // Show loading if exam type hasn't loaded yet
  if (!isExamTypeLoaded) {
    return <ReadingSkeleton />;
  }

  // Show config if not complete
  if (!configComplete) {
    return (
      <div className="container mx-auto py-8 h-full">
        <div className="flex flex-col items-center justify-center h-full">
          <h1 className="text-3xl font-bold mb-8 text-center">{t('reading.practiceTitlePage')}</h1>
          
          {/* Show error message if there is one */}
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-6 max-w-2xl">
              <strong className="font-bold">Error: </strong>
              <span className="block sm:inline">{error.message}</span>
            </div>
          )}
          
          <ExamConfigSelector onStart={handleConfigComplete} />
        </div>
      </div>
    );
  }

  // Show loading if initial content loading and tab layout not ready
  if ((content.isPassageLoading && !content.passage) || !tabLayout) {
    return <ReadingSkeleton />;
  }

  // Render the TabSystem with the configured layout
  return (
    <DndProvider backend={HTML5Backend}>
      <div className="flex flex-col h-full w-full">
        <div className="flex justify-between items-center mb-4">
          <Button variant="ghost" onClick={handleBackToConfig}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            {t('reading.backToConfig')}
          </Button>
        </div>
        <div className="flex-1 h-[calc(100%-3rem)] w-full overflow-hidden">
          <TabSystem 
            key={`tab-system-${selectedAnswers.filter(a => a !== -1).length}`}
            layout={tabLayout}
            onLayoutChange={setTabLayout}
            getContentForTab={getContentForTab}
          />
        </div>
      </div>
    </DndProvider>
  );
} 