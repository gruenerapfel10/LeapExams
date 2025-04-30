import { 
  BaseExamModule, 
  ExamTypeConfig, 
  ModuleConfig, 
  LevelConfig, 
  ExamModuleRegistry 
} from './base';

// Module types for Goethe
const GOETHE_MODULES = {
  READING: 'reading',
  WRITING: 'writing',
  LISTENING: 'listening',
  SPEAKING: 'speaking'
} as const;

type GoetheModuleType = typeof GOETHE_MODULES[keyof typeof GOETHE_MODULES];

// Level types for Goethe
const GOETHE_LEVELS = {
  A1: 'a1',
  A2: 'a2',
  B1: 'b1',
  B2: 'b2',
  C1: 'c1',
  C2: 'c2'
} as const;

type GoetheLevelType = typeof GOETHE_LEVELS[keyof typeof GOETHE_LEVELS];

// Goethe module implementation
export class GoetheExamModule extends BaseExamModule {
  private moduleConfigs: Record<GoetheModuleType, ModuleConfig>;
  private levelConfigs: Record<GoetheLevelType, Record<GoetheModuleType, LevelConfig>>;
  private examTypeConfig: ExamTypeConfig;

  constructor() {
    super();

    // Define exam type
    this.examTypeConfig = {
      id: 'goethe',
      label: 'Goethe',
      languageCode: 'de',
      languageName: 'German',
      flag: '🇩🇪'
    };

    // Define modules with proper details
    this.moduleConfigs = {
      [GOETHE_MODULES.READING]: {
        id: GOETHE_MODULES.READING,
        label: 'Reading',
        details: {
          description: 'Test your ability to understand written German texts',
          skills: [
            {
              name: 'Reading comprehension',
              description: 'Understanding main ideas and specific details in texts',
              examples: ['Identifying key information', 'Understanding context', 'Following instructions']
            },
            {
              name: 'Text analysis',
              description: 'Analyzing text structure and language features',
              examples: ['Recognizing text types', 'Understanding text organization', 'Identifying language patterns']
            }
          ],
          textTypes: [
            {
              name: 'Articles',
              description: 'Informative texts from newspapers, magazines, or websites',
              examples: ['News articles', 'Feature articles', 'Blog posts']
            },
            {
              name: 'Short stories',
              description: 'Narrative texts with a clear plot and characters',
              examples: ['Fictional stories', 'Personal narratives', 'Anecdotes']
            },
            {
              name: 'Dialogues',
              description: 'Conversations between two or more people',
              examples: ['Everyday conversations', 'Interviews', 'Discussions']
            }
          ],
          questionTypes: [
            {
              name: 'Multiple choice',
              description: 'Select the correct answer from given options',
              examples: ['Single correct answer', 'Multiple correct answers', 'Best answer selection']
            },
            {
              name: 'True/False',
              description: 'Determine if statements are true or false based on the text',
              examples: ['Factual statements', 'Inference questions', 'Opinion statements']
            },
            {
              name: 'Matching',
              description: 'Match items from two columns based on the text',
              examples: ['Headings with paragraphs', 'Questions with answers', 'Statements with speakers']
            }
          ],
          examStructure: {
            description: 'The reading exam consists of multiple parts testing different aspects of reading comprehension',
            parts: [
              {
                name: 'Part 1',
                description: 'Short texts and notices',
                duration: 20,
                questions: 10,
                skills: ['Skimming', 'Scanning', 'Detailed reading'],
                format: 'Multiple choice and matching questions',
                tips: [
                  'Read questions before the text',
                  'Look for key words',
                  'Pay attention to time management'
                ]
              },
              {
                name: 'Part 2',
                description: 'Longer texts with complex information',
                duration: 20,
                questions: 10,
                skills: ['Inference', 'Analysis', 'Evaluation'],
                format: 'True/False and multiple choice questions',
                tips: [
                  'Read the text carefully',
                  'Make notes of key points',
                  'Check your answers before submitting'
                ]
              }
            ],
            totalDuration: 40,
            totalQuestions: 20,
            passingScore: 60,
            difficulty: 'intermediate',
            preparationTime: '3-4 months',
            recommendedResources: [
              'Goethe Institute practice materials',
              'German newspapers and magazines',
              'Online reading comprehension exercises'
            ]
          }
        }
      },
      [GOETHE_MODULES.WRITING]: {
        id: GOETHE_MODULES.WRITING,
        label: 'Writing',
        details: {
          description: 'Test your ability to write in German',
          skills: [
            {
              name: 'Essay writing',
              description: 'Writing structured essays with proper grammar and vocabulary',
              examples: ['Argumentative essays', 'Descriptive essays', 'Opinion pieces']
            },
            {
              name: 'Letter writing',
              description: 'Writing formal and informal letters',
              examples: ['Formal letters', 'Informal letters', 'Emails']
            }
          ],
          textTypes: [
            {
              name: 'Formal letters',
              description: 'Professional and official correspondence',
              examples: ['Business letters', 'Application letters', 'Complaint letters']
            },
            {
              name: 'Essays',
              description: 'Structured written compositions',
              examples: ['Argumentative essays', 'Descriptive essays', 'Opinion pieces']
            },
            {
              name: 'Emails',
              description: 'Electronic correspondence',
              examples: ['Formal emails', 'Informal emails', 'Business emails']
            }
          ],
          questionTypes: [
            {
              name: 'Essay',
              description: 'Writing structured essays on given topics',
              examples: ['Argumentative essays', 'Descriptive essays', 'Opinion pieces']
            },
            {
              name: 'Letter',
              description: 'Writing formal or informal letters',
              examples: ['Formal letters', 'Informal letters', 'Application letters']
            },
            {
              name: 'Email',
              description: 'Writing emails in German',
              examples: ['Formal emails', 'Informal emails', 'Business emails']
            }
          ],
          examStructure: {
            description: 'The writing exam tests your ability to write in German',
            parts: [
              {
                name: 'Part 1',
                description: 'Formal letter writing',
                duration: 30,
                questions: 1,
                skills: ['Formal writing', 'Grammar', 'Vocabulary'],
                format: 'Formal letter',
                tips: [
                  'Use appropriate formal language',
                  'Follow the letter format',
                  'Check grammar and spelling'
                ]
              },
              {
                name: 'Part 2',
                description: 'Essay writing',
                duration: 30,
                questions: 1,
                skills: ['Essay writing', 'Argumentation', 'Structure'],
                format: 'Essay',
                tips: [
                  'Plan your essay structure',
                  'Use appropriate vocabulary',
                  'Support your arguments'
                ]
              }
            ],
            totalDuration: 60,
            totalQuestions: 2,
            passingScore: 60,
            difficulty: 'intermediate',
            preparationTime: '3-4 months',
            recommendedResources: [
              'Goethe Institute materials',
              'German writing guides',
              'Online writing practice'
            ]
          }
        }
      },
      [GOETHE_MODULES.LISTENING]: {
        id: GOETHE_MODULES.LISTENING,
        label: 'Listening',
        details: {
          description: 'Test your ability to understand spoken German',
          skills: [
            {
              name: 'Listening comprehension',
              description: 'Understanding spoken German in various contexts',
              examples: ['Understanding conversations', 'Following instructions', 'Identifying key information']
            },
            {
              name: 'Note-taking',
              description: 'Taking effective notes while listening',
              examples: ['Key points', 'Important details', 'Main ideas']
            }
          ],
          textTypes: [
            {
              name: 'Conversations',
              description: 'Everyday conversations and dialogues',
              examples: ['Casual conversations', 'Formal discussions', 'Interviews']
            },
            {
              name: 'Lectures',
              description: 'Academic and professional presentations',
              examples: ['Academic lectures', 'Professional presentations', 'Educational talks']
            },
            {
              name: 'Announcements',
              description: 'Public announcements and information',
              examples: ['Train announcements', 'Public notices', 'Information broadcasts']
            }
          ],
          questionTypes: [
            {
              name: 'Multiple choice',
              description: 'Select the correct answer from options',
              examples: ['Single answer', 'Multiple answers', 'Best answer']
            },
            {
              name: 'Fill in blanks',
              description: 'Complete sentences with missing words',
              examples: ['Word completion', 'Phrase completion', 'Sentence completion']
            },
            {
              name: 'Matching',
              description: 'Match related items or information',
              examples: ['Headings with content', 'Questions with answers', 'Statements with speakers']
            }
          ],
          examStructure: {
            description: 'The listening exam tests your ability to understand spoken German',
            parts: [
              {
                name: 'Part 1',
                description: 'Short conversations and announcements',
                duration: 15,
                questions: 10,
                skills: ['Basic comprehension', 'Note-taking', 'Information processing'],
                format: 'Multiple choice and matching questions',
                tips: [
                  'Listen carefully',
                  'Take notes',
                  'Focus on key information'
                ]
              },
              {
                name: 'Part 2',
                description: 'Longer conversations and lectures',
                duration: 15,
                questions: 10,
                skills: ['Detailed comprehension', 'Analysis', 'Note-taking'],
                format: 'Fill in blanks and multiple choice questions',
                tips: [
                  'Listen for specific details',
                  'Take organized notes',
                  'Review your answers'
                ]
              }
            ],
            totalDuration: 30,
            totalQuestions: 20,
            passingScore: 60,
            difficulty: 'intermediate',
            preparationTime: '3-4 months',
            recommendedResources: [
              'Goethe Institute materials',
              'German podcasts',
              'Online listening practice'
            ]
          }
        }
      },
      [GOETHE_MODULES.SPEAKING]: {
        id: GOETHE_MODULES.SPEAKING,
        label: 'Speaking',
        details: {
          description: 'Test your ability to speak German',
          skills: [
            {
              name: 'Oral communication',
              description: 'Speaking German fluently and accurately',
              examples: ['Conversations', 'Presentations', 'Discussions']
            },
            {
              name: 'Pronunciation',
              description: 'Speaking with correct pronunciation and intonation',
              examples: ['Word stress', 'Sentence intonation', 'Sound production']
            }
          ],
          textTypes: [
            {
              name: 'Conversations',
              description: 'Interactive speaking situations',
              examples: ['Everyday conversations', 'Formal discussions', 'Interviews']
            },
            {
              name: 'Presentations',
              description: 'Structured speaking tasks',
              examples: ['Topic presentations', 'Information sharing', 'Opinion expression']
            },
            {
              name: 'Discussions',
              description: 'Group interaction and debate',
              examples: ['Group discussions', 'Debates', 'Problem-solving tasks']
            }
          ],
          questionTypes: [
            {
              name: 'Interview',
              description: 'One-on-one speaking assessment',
              examples: ['Personal questions', 'Topic discussion', 'Opinion sharing']
            },
            {
              name: 'Presentation',
              description: 'Structured speaking task',
              examples: ['Topic presentation', 'Information sharing', 'Opinion expression']
            },
            {
              name: 'Discussion',
              description: 'Interactive speaking task',
              examples: ['Group discussion', 'Debate', 'Problem-solving']
            }
          ],
          examStructure: {
            description: 'The speaking exam tests your ability to communicate in German',
            parts: [
              {
                name: 'Part 1',
                description: 'Personal interview',
                duration: 10,
                questions: 1,
                skills: ['Personal expression', 'Fluency', 'Accuracy'],
                format: 'Interview',
                tips: [
                  'Speak clearly',
                  'Use appropriate vocabulary',
                  'Maintain conversation flow'
                ]
              },
              {
                name: 'Part 2',
                description: 'Topic presentation and discussion',
                duration: 10,
                questions: 2,
                skills: ['Presentation', 'Discussion', 'Interaction'],
                format: 'Presentation and discussion',
                tips: [
                  'Structure your presentation',
                  'Engage in discussion',
                  'Express opinions clearly'
                ]
              }
            ],
            totalDuration: 20,
            totalQuestions: 3,
            passingScore: 60,
            difficulty: 'intermediate',
            preparationTime: '3-4 months',
            recommendedResources: [
              'Goethe Institute materials',
              'Speaking practice groups',
              'Online speaking practice'
            ]
          }
        }
      }
    };

    // Define levels for each module with proper details
    this.levelConfigs = {
      [GOETHE_LEVELS.A1]: this.createLevelConfigs(GOETHE_LEVELS.A1, 'A1 - Beginner'),
      [GOETHE_LEVELS.A2]: this.createLevelConfigs(GOETHE_LEVELS.A2, 'A2 - Elementary'),
      [GOETHE_LEVELS.B1]: this.createLevelConfigs(GOETHE_LEVELS.B1, 'B1 - Intermediate'),
      [GOETHE_LEVELS.B2]: this.createLevelConfigs(GOETHE_LEVELS.B2, 'B2 - Upper Intermediate'),
      [GOETHE_LEVELS.C1]: this.createLevelConfigs(GOETHE_LEVELS.C1, 'C1 - Advanced'),
      [GOETHE_LEVELS.C2]: this.createLevelConfigs(GOETHE_LEVELS.C2, 'C2 - Proficiency')
    };
  }

  // Helper method to create level configurations
  private createLevelConfigs(levelId: GoetheLevelType, levelLabel: string): Record<GoetheModuleType, LevelConfig> {
    const modules = Object.values(GOETHE_MODULES);
    
    // Create a record with a configuration for each module
    return modules.reduce((configs, moduleId) => {
      configs[moduleId as GoetheModuleType] = {
        id: levelId,
        label: levelLabel,
        details: this.createLevelDetails(levelId, moduleId as GoetheModuleType)
      };
      return configs;
    }, {} as Record<GoetheModuleType, LevelConfig>);
  }

  // Create specific level details for a given level and module
  private createLevelDetails(levelId: GoetheLevelType, moduleId: GoetheModuleType) {
    const baseDetails = {
      description: `This ${levelId.toUpperCase()} level exam tests your ability to understand and use German in ${moduleId} contexts.`,
      skills: [
        {
          name: `${moduleId.charAt(0).toUpperCase() + moduleId.slice(1)} comprehension`,
          description: `Understanding and processing ${moduleId} content at ${levelId.toUpperCase()} level`,
          examples: [
            'Identifying main ideas',
            'Understanding specific details',
            'Following instructions'
          ]
        },
        {
          name: 'Vocabulary building',
          description: 'Expanding and using appropriate vocabulary',
          examples: [
            'Learning new words in context',
            'Using vocabulary accurately',
            'Understanding word relationships'
          ]
        },
        {
          name: 'Grammar practice',
          description: 'Using correct grammar structures',
          examples: [
            'Applying grammar rules',
            'Using appropriate tenses',
            'Forming correct sentences'
          ]
        }
      ],
      textTypes: [
        {
          name: 'Short texts',
          description: 'Brief written materials for basic understanding',
          examples: ['Notices', 'Messages', 'Simple instructions']
        },
        {
          name: 'Articles',
          description: 'Informative texts on various topics',
          examples: ['News articles', 'Blog posts', 'Magazine articles']
        },
        {
          name: 'Dialogues',
          description: 'Conversations and exchanges',
          examples: ['Everyday conversations', 'Interviews', 'Discussions']
        }
      ],
      questionTypes: [
        {
          name: 'Multiple choice',
          description: 'Select the correct answer from options',
          examples: ['Single answer', 'Multiple answers', 'Best answer']
        },
        {
          name: 'Fill in the blanks',
          description: 'Complete sentences with missing words',
          examples: ['Word completion', 'Phrase completion', 'Sentence completion']
        },
        {
          name: 'Matching',
          description: 'Match related items or information',
          examples: ['Headings with paragraphs', 'Questions with answers', 'Statements with speakers']
        }
      ],
      examStructure: {
        description: `The ${levelId.toUpperCase()} level exam structure is designed to test your ${moduleId} skills comprehensively.`,
        parts: [
          {
            name: 'Part 1',
            description: 'Basic comprehension and understanding',
            duration: 15,
            questions: 10,
            skills: ['Basic comprehension', 'Vocabulary recognition', 'Simple analysis'],
            format: 'Multiple choice and matching questions',
            tips: [
              'Read questions first',
              'Look for key words',
              'Manage your time well'
            ]
          },
          {
            name: 'Part 2',
            description: 'Advanced comprehension and analysis',
            duration: 15,
            questions: 10,
            skills: ['Detailed comprehension', 'Analysis', 'Evaluation'],
            format: 'True/False and multiple choice questions',
            tips: [
              'Read carefully',
              'Take notes',
              'Review your answers'
            ]
          }
        ],
        totalDuration: 30,
        totalQuestions: 20,
        passingScore: 60,
        difficulty: levelId.toLowerCase() as any,
        preparationTime: '2-3 months',
        recommendedResources: [
          'Goethe Institute materials',
          'Online practice tests',
          'Language learning apps'
        ]
      }
    };

    // Customize based on level
    switch (levelId) {
      case GOETHE_LEVELS.A1:
        baseDetails.examStructure.totalDuration = 20;
        baseDetails.examStructure.totalQuestions = 15;
        baseDetails.examStructure.difficulty = 'beginner';
        baseDetails.examStructure.passingScore = 50;
        baseDetails.examStructure.preparationTime = '1-2 months';
        break;
      case GOETHE_LEVELS.C2:
        baseDetails.examStructure.totalDuration = 45;
        baseDetails.examStructure.totalQuestions = 30;
        baseDetails.examStructure.difficulty = 'proficiency';
        baseDetails.examStructure.passingScore = 70;
        baseDetails.examStructure.preparationTime = '4-6 months';
        break;
      default:
        // Keep defaults for other levels
        break;
    }

    return baseDetails;
  }

  // Required interface implementations
  getModules() {
    return Object.values(this.moduleConfigs).map(({ id, label }) => ({ id, label }));
  }

  getLevels() {
    return Object.keys(this.levelConfigs).map(id => ({
      id,
      label: this.levelConfigs[id as GoetheLevelType][GOETHE_MODULES.READING].label
    }));
  }

  getExamType(): ExamTypeConfig {
    return this.examTypeConfig;
  }

  getModuleConfig(moduleId: string): ModuleConfig | null {
    return this.moduleConfigs[moduleId as GoetheModuleType] || null;
  }

  getLevelConfig(levelId: string, moduleId: string): LevelConfig | null {
    if (!this.levelConfigs[levelId as GoetheLevelType]) return null;
    return this.levelConfigs[levelId as GoetheLevelType][moduleId as GoetheModuleType] || null;
  }
}

// Register this module
const goetheModule = new GoetheExamModule();
ExamModuleRegistry.register('goethe', goetheModule);