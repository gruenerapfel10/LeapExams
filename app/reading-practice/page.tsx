"use client"

import { useState } from "react"
import { useExam } from "@/lib/context/user-preferences-context"
import { useTranslation } from "@/lib/i18n/hooks"
import { ExamType } from "@/lib/constants"
import { ExamConfigSelector } from "@/components/reading/exam-config-selector"
import ReadingPage from "@/app/dashboard/reading/page"

// Import here to avoid circular dependencies
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react" 
/**
 * Reading practice page with exam type and difficulty selection
 */
export default function ReadingPracticePage() {
  const { t } = useTranslation()
  const { examType, setDifficulty } = useExam()
  
  // State to track the current screen (config or practice)
  const [screen, setScreen] = useState<'config' | 'practice'>('config')
  
  // Handle start button click from config screen
  const handleStartPractice = (examType: ExamType, difficultyId: string) => {
    setDifficulty(difficultyId)
    setScreen('practice')
  }
  
  // Handle back button click from practice screen
  const handleBackToConfig = () => {
    setScreen('config')
  }
  
  // Render config screen or practice screen based on state
  return (
    <div className="container mx-auto py-8 h-full">
      {screen === 'config' ? (
        <div className="flex flex-col items-center justify-center h-full">
          <h1 className="text-3xl font-bold mb-8 text-center">{t('reading.practiceTitlePage')}</h1>
          <ExamConfigSelector onStart={handleStartPractice} />
        </div>
      ) : (
        <div className="h-full flex flex-col">
          <div className="flex justify-between items-center mb-4">
            <Button variant="ghost" onClick={handleBackToConfig}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              {t('reading.backToConfig')}
            </Button>
          </div>
          
          <div className="flex-1">
            <ReadingPage />
          </div>
        </div>
      )}
    </div>
  )
}