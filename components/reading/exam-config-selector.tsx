"use client"

import { useState, useEffect } from "react"
import { useExam } from "@/lib/context/user-preferences-context"
import { useTranslation } from "@/lib/i18n/hooks"
import { ExamService } from "@/lib/exam/service"
import { ExamType } from "@/lib/constants"
import { ExamDifficulty, GoetheDifficulty } from "@/lib/exam/types"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowRight, GraduationCap, AlertCircle } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface ExamConfigSelectorProps {
  onStart: (examType: ExamType, difficultyId: string) => void
}

export function ExamConfigSelector({ onStart }: ExamConfigSelectorProps) {
  const { examType } = useExam()
  const { t } = useTranslation()
  
  // State for difficulty levels
  const [difficultyLevels, setDifficultyLevels] = useState<ExamDifficulty[]>([])
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>("")
  
  // Load difficulty levels for the current exam type
  useEffect(() => {
    const levels = ExamService.getDifficultyLevels(examType)
    setDifficultyLevels(levels)
    
    // Set default difficulty to the first implemented level if none selected
    if (!selectedDifficulty && levels.length > 0) {
      // Find the first implemented level or fallback to the first level
      const firstImplemented = levels.find(level => 
        (level as GoetheDifficulty).isImplemented !== false
      )
      
      setSelectedDifficulty(firstImplemented?.id || levels[0].id)
    }
  }, [examType, selectedDifficulty])
  
  // Handle difficulty selection
  const handleDifficultySelect = (id: string, isImplemented: boolean = true) => {
    // Only allow selection of implemented levels
    if (isImplemented) {
      setSelectedDifficulty(id)
    }
  }
  
  // Check if a difficulty is implemented
  const isImplemented = (difficulty: ExamDifficulty): boolean => {
    // For Goethe, check the isImplemented flag
    if ('isImplemented' in difficulty) {
      return difficulty.isImplemented !== false
    }
    // For other exam types, assume all levels are implemented
    return true
  }
  
  // Handle start button click
  const handleStart = () => {
    // Get default difficulty if none selected
    const difficultyId = selectedDifficulty || difficultyLevels[0]?.id || ""
    
    // Call the onStart callback with the current exam type
    onStart(examType, difficultyId)
  }
  
  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl flex items-center">
          <GraduationCap className="mr-2 h-6 w-6" />
          {t('reading.configTitle')}
        </CardTitle>
        <CardDescription>
          {t('reading.selectDifficultyDescription')}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Difficulty Selection */}
        <div className="space-y-3">
          <h3 className="text-lg font-medium">{t('reading.selectDifficulty')}</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {difficultyLevels.map((difficulty) => {
              const implemented = isImplemented(difficulty)
              
              return (
                <TooltipProvider key={difficulty.id}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="relative">
                        <Button
                          variant={selectedDifficulty === difficulty.id ? "default" : "outline"}
                          className={`h-auto py-4 flex flex-col items-center justify-center gap-1 w-full ${!implemented ? 'opacity-60 cursor-not-allowed' : ''}`}
                          onClick={() => handleDifficultySelect(difficulty.id, implemented)}
                          disabled={!implemented}
                        >
                          <span className="text-lg font-medium">
                            {difficulty.name}
                            {!implemented && (
                              <AlertCircle className="inline ml-1.5 h-4 w-4 text-amber-500" />
                            )}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {difficulty.description.length > 40 
                              ? `${difficulty.description.substring(0, 40)}...` 
                              : difficulty.description}
                          </span>
                        </Button>
                      </div>
                    </TooltipTrigger>
                    {!implemented && (
                      <TooltipContent>
                        <p>This level is not yet implemented.</p>
                      </TooltipContent>
                    )}
                  </Tooltip>
                </TooltipProvider>
              );
            })}
          </div>
        </div>
        
        {/* Start Button */}
        <div className="pt-4 flex justify-end">
          <Button 
            size="lg" 
            onClick={handleStart}
            disabled={!selectedDifficulty}
            className="px-6"
          >
            {t('reading.startPractice')}
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
} 