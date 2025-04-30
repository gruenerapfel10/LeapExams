import { LucideIcon, BookOpen, Brain, Target, BookMarked, GraduationCap, Lightbulb, Headphones, Mic, PenTool } from "lucide-react"

// Base interfaces for the hierarchical structure
export interface ExamConfig {
  label: string
  description: string
  icon: LucideIcon
  color: string
  borderColor: string
  details: LevelDetails
}

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

// Type definitions for the hierarchical structure
export interface LevelConfig extends ExamConfig {
  // Additional level-specific properties can be added here
}

export interface ExamTypeConfig {
  [key: string]: LevelConfig
}

export interface ModuleConfig {
  [key: string]: {
    [examType: string]: ExamTypeConfig
  }
}

export interface Level {
  label: string
  description: string
  icon: LucideIcon
  color: string
  borderColor: string
  details: LevelDetails
}

export interface SkillLevels {
  [key: string]: Level
}

// Shared level configurations for all skills
const sharedLevels: { [key: string]: Level } = {
  A1: {
    label: "Beginner (A1)",
    description: "Basic understanding and communication",
    icon: BookOpen,
    color: "bg-blue-500/10",
    borderColor: "border-blue-500",
    details: {
      skills: [
        "Understanding basic vocabulary",
        "Recognizing simple structures",
        "Identifying key information"
      ],
      textTypes: [
        "Short notices and signs",
        "Simple personal letters",
        "Basic instructions"
      ],
      questionTypes: [
        "Multiple choice",
        "True/False",
        "Matching"
      ],
      examStructure: {
        parts: [
          { name: "Main Task", timeLimit: 20 },
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
    description: "Understanding of simple content and basic communication",
    icon: Brain,
    color: "bg-green-500/10",
    borderColor: "border-green-500",
    details: {
      skills: [
        "Understanding common expressions",
        "Processing simple content",
        "Finding specific information"
      ],
      textTypes: [
        "Short stories",
        "Simple articles",
        "Basic messages"
      ],
      questionTypes: [
        "Multiple choice",
        "Fill in the blanks",
        "Short answer questions"
      ],
      examStructure: {
        parts: [
          { name: "Main Task", timeLimit: 25 },
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
    description: "Understanding of main points in clear standard content",
    icon: Target,
    color: "bg-yellow-500/10",
    borderColor: "border-yellow-500",
    details: {
      skills: [
        "Understanding main ideas",
        "Processing longer content",
        "Inferring meaning from context"
      ],
      textTypes: [
        "Articles and reports",
        "Stories",
        "Personal correspondence"
      ],
      questionTypes: [
        "Multiple choice",
        "Matching headings",
        "Summary completion"
      ],
      examStructure: {
        parts: [
          { name: "Main Task", timeLimit: 30 },
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
    description: "Understanding of complex content and abstract topics",
    icon: BookMarked,
    color: "bg-orange-500/10",
    borderColor: "border-orange-500",
    details: {
      skills: [
        "Understanding complex content",
        "Reading between the lines",
        "Analyzing structure"
      ],
      textTypes: [
        "Complex articles",
        "Literary texts",
        "Technical documentation"
      ],
      questionTypes: [
        "Multiple choice",
        "Sentence completion",
        "Content analysis"
      ],
      examStructure: {
        parts: [
          { name: "Main Task", timeLimit: 35 },
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
    description: "Understanding of complex content and implicit meaning",
    icon: GraduationCap,
    color: "bg-red-500/10",
    borderColor: "border-red-500",
    details: {
      skills: [
        "Understanding complex content",
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
        "Content analysis",
        "Critical evaluation"
      ],
      examStructure: {
        parts: [
          { name: "Main Task", timeLimit: 40 },
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
    description: "Understanding of virtually everything with ease",
    icon: Lightbulb,
    color: "bg-purple-500/10",
    borderColor: "border-purple-500",
    details: {
      skills: [
        "Understanding any content",
        "Critical analysis",
        "Cultural context awareness"
      ],
      textTypes: [
        "Complex works",
        "Academic papers",
        "Specialized content"
      ],
      questionTypes: [
        "Multiple choice",
        "Critical analysis",
        "Cultural interpretation"
      ],
      examStructure: {
        parts: [
          { name: "Main Task", timeLimit: 45 },
          { name: "Vocabulary", timeLimit: 35 }
        ],
        totalTime: 80,
        totalQuestions: 45,
        passingScore: 85
      }
    }
  }
}

// Skill-specific configurations
const skillConfigs: { [key: string]: { icon: LucideIcon } } = {
  reading: { icon: BookOpen },
  listening: { icon: Headphones },
  speaking: { icon: Mic },
  writing: { icon: PenTool }
}

// Generate configurations for each skill type
export const skillLevels: { [key: string]: SkillLevels } = Object.keys(skillConfigs).reduce((acc, skill) => {
  acc[skill] = Object.entries(sharedLevels).reduce((skillAcc, [level, config]) => {
    skillAcc[level] = {
      ...config,
      icon: skillConfigs[skill].icon
    }
    return skillAcc
  }, {} as SkillLevels)
  return acc
}, {} as { [key: string]: SkillLevels })

// Helper function to get level configuration
export function getLevelConfig(skillType: string, examType: string, level: string): Level | null {
  // First try to get from skillLevels
  const skillLevelsForType = skillLevels[skillType.toLowerCase()]
  if (skillLevelsForType?.[level]) {
    return skillLevelsForType[level]
  }

  // Then try to get from examModules
  return examModules[skillType.toLowerCase()]?.[examType]?.[level] || null
}

// Module configurations
export const examModules: ModuleConfig = {
  reading: {
    goethe: skillLevels.reading,
    ielts: skillLevels.reading
  },
  listening: {
    goethe: skillLevels.listening,
    ielts: skillLevels.listening
  },
  writing: {
    goethe: skillLevels.writing,
    ielts: skillLevels.writing
  },
  speaking: {
    goethe: skillLevels.speaking,
    ielts: skillLevels.speaking
  }
}

// Helper functions to access configurations
export function getModuleConfig(module: keyof ModuleConfig) {
  return examModules[module]
}

export function getExamTypeConfig(module: keyof ModuleConfig, examType: string) {
  return examModules[module]?.[examType]
} 