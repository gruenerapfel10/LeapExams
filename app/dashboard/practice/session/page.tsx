"use client"

import { useState, useCallback } from "react"
import { TabSystem, type LayoutNode } from "@/components/TabSystem"
import { DndProvider } from "react-dnd"
import { HTML5Backend } from "react-dnd-html5-backend"
import { useSearchParams } from "next/navigation"
import { getLevelConfig } from "@/lib/exam/levels"

type IconType = "bookOpen" | "fileQuestion" | "bot" | "percent" | "hash"

export default function SessionPage() {
  const searchParams = useSearchParams()
  const level = searchParams.get("level") || "A1"
  const examType = searchParams.get("examType") || "goethe"
  const skillType = searchParams.get("skill") || "reading"
  const [layout, setLayout] = useState<LayoutNode | null>(null)

  const levelConfig = getLevelConfig(skillType, examType, level)

  const getContentForTab = useCallback((tabId: string) => {
    if (!levelConfig) return null

    switch (tabId) {
      case 'content':
        return (
          <div className="h-full p-4">
            <div className="prose dark:prose-invert max-w-none">
              {/* Dynamic content based on skill type */}
              <p>Sample {skillType} content for {levelConfig.label}...</p>
            </div>
          </div>
        )
      case 'questions':
        return (
          <div className="h-full p-4">
            {/* Questions will go here */}
            <p>Sample questions for {levelConfig.label}...</p>
            <div className="mt-4">
              <h3 className="text-lg font-semibold mb-2">Question Types:</h3>
              <ul className="list-disc pl-4">
                {levelConfig.details.questionTypes.map((type, index) => (
                  <li key={index}>{type}</li>
                ))}
              </ul>
            </div>
          </div>
        )
      case 'results':
        return (
          <div className="h-full p-4">
            {/* Results will go here */}
            <p>Sample results for {levelConfig.label}...</p>
            <div className="mt-4">
              <h3 className="text-lg font-semibold mb-2">Exam Structure:</h3>
              <div className="space-y-2">
                <p>Total Time: {levelConfig.details.examStructure.totalTime} minutes</p>
                <p>Total Questions: {levelConfig.details.examStructure.totalQuestions}</p>
                <p>Passing Score: {levelConfig.details.examStructure.passingScore}%</p>
              </div>
            </div>
          </div>
        )
      default:
        return null
    }
  }, [levelConfig, skillType])

  const generateInitialLayout = useCallback((): LayoutNode => ({
    id: 'root_split',
    type: 'split',
    direction: 'horizontal',
    sizes: [70, 30],
    children: [
      {
        id: 'window_left',
        type: 'window',
        tabs: [
          { id: 'content', title: skillType.charAt(0).toUpperCase() + skillType.slice(1), iconType: getIconForSkill(skillType) },
        ],
        activeTabId: 'content',
        isCollapsed: false,
      },
      {
        id: 'window_right',
        type: 'window',
        tabs: [
          { id: 'questions', title: 'Questions', iconType: 'fileQuestion' },
          { id: 'results', title: 'Results', iconType: 'percent' },
        ],
        activeTabId: 'questions',
        isCollapsed: false,
      }
    ],
  }), [skillType])

  // Initialize layout
  if (!layout) {
    setLayout(generateInitialLayout())
  }

  if (!levelConfig) {
    return (
      <div className="h-[calc(100vh-4rem)] p-4 md:p-6 bg-background flex items-center justify-center">
        <p className="text-lg text-muted-foreground">Invalid level, exam type, or skill type selected</p>
      </div>
    )
  }

  return (
    <div className="h-[calc(100vh-4rem)] p-4 md:p-6 bg-background">
      <DndProvider backend={HTML5Backend}>
        <TabSystem
          layout={layout}
          onLayoutChange={setLayout}
          getContentForTab={getContentForTab}
        />
      </DndProvider>
    </div>
  )
}

// Helper function to get the appropriate icon for each skill type
function getIconForSkill(skillType: string): IconType {
  switch (skillType.toLowerCase()) {
    case 'reading':
      return 'bookOpen'
    case 'listening':
      return 'bot'
    case 'speaking':
      return 'bot'
    case 'writing':
      return 'bot'
    default:
      return 'bookOpen'
  }
} 