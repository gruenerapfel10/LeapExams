"use client"

import { usePathname } from "next/navigation"
import { useExam } from "@/lib/context/user-preferences-context"
import { EXAM_LANGUAGES } from "@/lib/constants"
import { useTranslation } from "@/lib/i18n/hooks"
import { Badge } from "@/components/ui/badge"
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink } from "@/components/ui/breadcrumb"
import { Book, BookOpen, Headphones, Mic, PenTool } from "lucide-react"
import { useMemo, useEffect, useState } from "react"
import { Highlighter } from "@/components/ui/highlighter"
import { ExamService } from "@/lib/exam/service"
import { ExamDifficulty } from "@/lib/exam/types"

export function PageIndicator() {
  const pathname = usePathname()
  const { examType } = useExam()
  const { t } = useTranslation()
  
  // State to store the current difficulty (if applicable)
  const [currentDifficulty, setCurrentDifficulty] = useState<ExamDifficulty | null>(null)
  
  // Get the difficulty from URL or sessionStorage for reading page
  useEffect(() => {
    if (pathname.includes("/reading")) {
      // Try to get difficulty ID from session storage
      const difficultyId = sessionStorage.getItem('reading-difficulty-id')
      
      if (difficultyId) {
        const difficulty = ExamService.getDifficultyById(examType, difficultyId)
        if (difficulty) {
          setCurrentDifficulty(difficulty)
        }
      } else {
        setCurrentDifficulty(null)
      }
    } else {
      setCurrentDifficulty(null)
    }
  }, [pathname, examType])
  
  // Get the page info from the pathname
  const pageInfo = useMemo(() => {
    if (pathname.includes("/reading")) {
      return { 
        name: t("nav.reading"), 
        icon: <BookOpen className="h-4 w-4" />,
        href: "/dashboard/reading"
      }
    }
    if (pathname.includes("/writing")) {
      return { 
        name: t("nav.writing"), 
        icon: <PenTool className="h-4 w-4" />,
        href: "/dashboard/writing"
      }
    }
    if (pathname.includes("/listening")) {
      return { 
        name: t("nav.listening"), 
        icon: <Headphones className="h-4 w-4" />,
        href: "/dashboard/listening"
      }
    }
    if (pathname.includes("/speaking")) {
      return { 
        name: t("nav.speaking"), 
        icon: <Mic className="h-4 w-4" />,
        href: "/dashboard/speaking"
      }
    }
    return null
  }, [pathname, t])
  
  // Only show for practice pages
  if (!pageInfo) {
    return null
  }
  
  const examLang = EXAM_LANGUAGES[examType]
  
  return (
    <div className="flex items-center gap-1 animate-in fade-in slide-in-from-left-5 duration-300">
      <Breadcrumb>
        <BreadcrumbItem>
          <BreadcrumbLink href="/dashboard" className="hidden sm:inline-flex">
            {t("nav.dashboard")}
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbItem>
          <BreadcrumbLink href={pageInfo.href} className="inline-flex items-center gap-1">
            {pageInfo.icon}
            <span className="hidden sm:inline">{pageInfo.name}</span>
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbItem>
          <Highlighter value={examType} className="rounded-md">
            <Badge 
              variant="secondary" 
              className="flex gap-1 items-center transition-all duration-300 hover:bg-primary/10"
              title={`${examType.toUpperCase()} - ${examLang.name}`}
            >
              <span className="text-base">{examLang.flag}</span>
              <span className="hidden sm:inline font-medium">{examType.toUpperCase()}</span>
            </Badge>
          </Highlighter>
        </BreadcrumbItem>
        {/* Show difficulty level if available */}
        {currentDifficulty && (
          <BreadcrumbItem>
            <Badge 
              variant="outline" 
              className="flex gap-1 items-center bg-primary/5"
            >
              <span className="font-medium">{currentDifficulty.name}</span>
            </Badge>
          </BreadcrumbItem>
        )}
      </Breadcrumb>
    </div>
  )
} 