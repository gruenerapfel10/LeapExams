import { LucideIcon, BookOpen, Brain, Target, BookMarked, GraduationCap, Lightbulb } from "lucide-react"

export interface ExamPart {
  name: string
  timeLimit: number
}

export interface ExamStructure {
  parts: ExamPart[]
  totalTime: number
  totalQuestions: number
  passingScore: number
}

export interface LevelDetails {
  skills: string[]
  textTypes: string[]
  questionTypes: string[]
  examStructure: ExamStructure
}

export interface Level {
  label: string
  description: string
  icon: LucideIcon
  color: string
  borderColor: string
  details: LevelDetails
}

export interface ReadingLevels {
  [key: string]: Level
}

export const readingLevels: ReadingLevels = {
  A1: {
    label: "Beginner (A1)",
    description: "Basic understanding of simple texts and everyday vocabulary",
    icon: BookOpen,
    color: "bg-blue-500/10",
    borderColor: "border-blue-500",
    details: {
      skills: [
        "Understanding basic vocabulary",
        "Recognizing simple sentence structures",
        "Identifying key information in short texts"
      ],
      textTypes: [
        "Short notices and signs",
        "Simple personal letters",
        "Basic instructions and directions"
      ],
      questionTypes: [
        "Multiple choice",
        "True/False",
        "Matching words to definitions"
      ],
      examStructure: {
        parts: [
          { name: "Reading Comprehension", timeLimit: 20 },
          { name: "Vocabulary", timeLimit: 10 }
        ],
        totalTime: 30,
        totalQuestions: 20,
        passingScore: 60
      }
    }
  },
  A2: {
    label: "Elementary (A2)",
    description: "Understanding of simple texts and basic communication",
    icon: Brain,
    color: "bg-green-500/10",
    borderColor: "border-green-500",
    details: {
      skills: [
        "Understanding common expressions",
        "Reading short, simple texts",
        "Finding specific information"
      ],
      textTypes: [
        "Short stories",
        "Simple articles",
        "Basic emails and messages"
      ],
      questionTypes: [
        "Multiple choice",
        "Fill in the blanks",
        "Short answer questions"
      ],
      examStructure: {
        parts: [
          { name: "Reading Comprehension", timeLimit: 25 },
          { name: "Vocabulary", timeLimit: 15 }
        ],
        totalTime: 40,
        totalQuestions: 25,
        passingScore: 65
      }
    }
  },
  B1: {
    label: "Intermediate (B1)",
    description: "Understanding of main points in clear standard texts",
    icon: Target,
    color: "bg-yellow-500/10",
    borderColor: "border-yellow-500",
    details: {
      skills: [
        "Understanding main ideas",
        "Reading longer texts",
        "Inferring meaning from context"
      ],
      textTypes: [
        "Articles and reports",
        "Short stories",
        "Personal correspondence"
      ],
      questionTypes: [
        "Multiple choice",
        "Matching headings",
        "Summary completion"
      ],
      examStructure: {
        parts: [
          { name: "Reading Comprehension", timeLimit: 30 },
          { name: "Vocabulary", timeLimit: 20 }
        ],
        totalTime: 50,
        totalQuestions: 30,
        passingScore: 70
      }
    }
  },
  B2: {
    label: "Upper Intermediate (B2)",
    description: "Understanding of complex texts and abstract topics",
    icon: BookMarked,
    color: "bg-orange-500/10",
    borderColor: "border-orange-500",
    details: {
      skills: [
        "Understanding complex texts",
        "Reading between the lines",
        "Analyzing text structure"
      ],
      textTypes: [
        "Complex articles",
        "Literary texts",
        "Technical documentation"
      ],
      questionTypes: [
        "Multiple choice",
        "Sentence completion",
        "Text analysis"
      ],
      examStructure: {
        parts: [
          { name: "Reading Comprehension", timeLimit: 35 },
          { name: "Vocabulary", timeLimit: 25 }
        ],
        totalTime: 60,
        totalQuestions: 35,
        passingScore: 75
      }
    }
  },
  C1: {
    label: "Advanced (C1)",
    description: "Understanding of complex texts and implicit meaning",
    icon: GraduationCap,
    color: "bg-red-500/10",
    borderColor: "border-red-500",
    details: {
      skills: [
        "Understanding complex texts",
        "Recognizing implicit meaning",
        "Critical analysis"
      ],
      textTypes: [
        "Academic texts",
        "Literary works",
        "Complex articles"
      ],
      questionTypes: [
        "Multiple choice",
        "Text analysis",
        "Critical evaluation"
      ],
      examStructure: {
        parts: [
          { name: "Reading Comprehension", timeLimit: 40 },
          { name: "Vocabulary", timeLimit: 30 }
        ],
        totalTime: 70,
        totalQuestions: 40,
        passingScore: 80
      }
    }
  },
  C2: {
    label: "Mastery (C2)",
    description: "Understanding of virtually everything read with ease",
    icon: Lightbulb,
    color: "bg-purple-500/10",
    borderColor: "border-purple-500",
    details: {
      skills: [
        "Understanding any text",
        "Critical analysis",
        "Cultural context awareness"
      ],
      textTypes: [
        "Complex literary works",
        "Academic papers",
        "Specialized texts"
      ],
      questionTypes: [
        "Multiple choice",
        "Critical analysis",
        "Cultural interpretation"
      ],
      examStructure: {
        parts: [
          { name: "Reading Comprehension", timeLimit: 45 },
          { name: "Vocabulary", timeLimit: 35 }
        ],
        totalTime: 80,
        totalQuestions: 45,
        passingScore: 85
      }
    }
  }
} 