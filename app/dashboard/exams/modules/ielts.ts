import { Level } from "@/lib/exam/levels";

interface IELTSLevelConfig {
  label: string;
  description: string;
  icon: string;
  color: string;
  borderColor: string;
  details: {
    skills: string[];
    textTypes: string[];
    questionTypes: string[];
    examStructure: {
      parts: {
        name: string;
        description: string;
        duration: number;
        questions: number;
      }[];
      totalDuration: number;
      totalQuestions: number;
    };
  };
}

const ieltsLevels: Record<string, IELTSLevelConfig> = {
  A1: {
    label: "A1",
    description: "Beginner level - Basic communication",
    icon: "🌱",
    color: "bg-blue-100",
    borderColor: "border-blue-500",
    details: {
      skills: [
        "Understand basic instructions",
        "Follow simple conversations",
        "Write basic personal information"
      ],
      textTypes: [
        "Simple instructions",
        "Basic forms",
        "Short messages"
      ],
      questionTypes: [
        "Multiple choice",
        "True/False",
        "Matching",
        "Short answers"
      ],
      examStructure: {
        parts: [
          {
            name: "Reading",
            description: "Understand simple texts",
            duration: 30,
            questions: 20
          },
          {
            name: "Listening",
            description: "Understand simple conversations",
            duration: 30,
            questions: 20
          },
          {
            name: "Writing",
            description: "Write simple messages",
            duration: 30,
            questions: 2
          },
          {
            name: "Speaking",
            description: "Basic conversation",
            duration: 15,
            questions: 3
          }
        ],
        totalDuration: 105,
        totalQuestions: 45
      }
    }
  },
  A2: {
    label: "A2",
    description: "Elementary level - Basic communication in familiar situations",
    icon: "🌿",
    color: "bg-blue-200",
    borderColor: "border-blue-600",
    details: {
      skills: [
        "Understand everyday expressions",
        "Communicate in simple situations",
        "Write short, simple notes"
      ],
      textTypes: [
        "Short stories",
        "Personal letters",
        "Simple instructions"
      ],
      questionTypes: [
        "Multiple choice",
        "True/False",
        "Matching",
        "Short answers",
        "Sentence completion"
      ],
      examStructure: {
        parts: [
          {
            name: "Reading",
            description: "Understand everyday texts",
            duration: 35,
            questions: 25
          },
          {
            name: "Listening",
            description: "Understand everyday conversations",
            duration: 35,
            questions: 25
          },
          {
            name: "Writing",
            description: "Write personal letters",
            duration: 35,
            questions: 2
          },
          {
            name: "Speaking",
            description: "Everyday conversation",
            duration: 20,
            questions: 3
          }
        ],
        totalDuration: 125,
        totalQuestions: 55
      }
    }
  }
  // Add B1, B2, C1, C2 configurations similarly
};

export const createIELTSLevels = (moduleId: string): Map<string, Level> => {
  const levels = new Map<string, Level>();
  
  // Get module-specific configuration
  const moduleConfig = ieltsLevels[moduleId] || ieltsLevels['default'];
  
  Object.entries(moduleConfig).forEach(([id, config]) => {
    levels.set(id, new Level(id, config.label, config.details));
  });
  
  return levels;
};

export type { IELTSLevelConfig }; 