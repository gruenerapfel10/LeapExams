import { Level } from "@/lib/exam/levels";

interface GoetheLevelConfig {
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

const goetheLevels: Record<string, GoetheLevelConfig> = {
  A1: {
    label: "A1",
    description: "Beginner level - Basic communication",
    icon: "🌱",
    color: "bg-green-100",
    borderColor: "border-green-500",
    details: {
      skills: [
        "Understand and use familiar everyday expressions",
        "Introduce yourself and others",
        "Ask and answer questions about personal details"
      ],
      textTypes: [
        "Simple notices",
        "Short messages",
        "Basic forms"
      ],
      questionTypes: [
        "Multiple choice",
        "True/False",
        "Matching"
      ],
      examStructure: {
        parts: [
          {
            name: "Reading",
            description: "Understand simple texts",
            duration: 25,
            questions: 15
          },
          {
            name: "Listening",
            description: "Understand simple conversations",
            duration: 20,
            questions: 15
          },
          {
            name: "Writing",
            description: "Write simple messages",
            duration: 20,
            questions: 2
          },
          {
            name: "Speaking",
            description: "Basic conversation",
            duration: 15,
            questions: 3
          }
        ],
        totalDuration: 80,
        totalQuestions: 35
      }
    }
  },
  A2: {
    label: "A2",
    description: "Elementary level - Basic communication in familiar situations",
    icon: "🌿",
    color: "bg-green-200",
    borderColor: "border-green-600",
    details: {
      skills: [
        "Communicate in simple and routine tasks",
        "Describe in simple terms aspects of your background",
        "Handle simple social situations"
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
        "Short answers"
      ],
      examStructure: {
        parts: [
          {
            name: "Reading",
            description: "Understand everyday texts",
            duration: 30,
            questions: 20
          },
          {
            name: "Listening",
            description: "Understand everyday conversations",
            duration: 25,
            questions: 20
          },
          {
            name: "Writing",
            description: "Write personal letters",
            duration: 30,
            questions: 2
          },
          {
            name: "Speaking",
            description: "Everyday conversation",
            duration: 20,
            questions: 3
          }
        ],
        totalDuration: 105,
        totalQuestions: 45
      }
    }
  }
  // Add B1, B2, C1, C2 configurations similarly
};

export const createGoetheLevels = (moduleId: string): Map<string, Level> => {
  const levels = new Map<string, Level>();
  
  // Get module-specific configuration
  const moduleConfig = goetheLevels[moduleId] || goetheLevels['default'];
  
  Object.entries(moduleConfig).forEach(([id, config]) => {
    levels.set(id, new Level(id, config.label, config.details));
  });
  
  return levels;
};

export type { GoetheLevelConfig }; 