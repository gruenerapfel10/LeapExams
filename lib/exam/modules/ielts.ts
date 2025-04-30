import { 
  BaseExamModule, 
  ExamTypeConfig, 
  ModuleConfig, 
  LevelConfig, 
  ExamModuleRegistry 
} from './base';

// Module types for IELTS
const IELTS_MODULES = {
  READING: 'reading',
  WRITING: 'writing',
  LISTENING: 'listening',
  SPEAKING: 'speaking'
} as const;

type IeltsModuleType = typeof IELTS_MODULES[keyof typeof IELTS_MODULES];

// Band levels for IELTS (1-9)
const IELTS_BANDS = ['1', '2', '3', '4', '5', '6', '7', '8', '9'] as const;
type IeltsBandType = typeof IELTS_BANDS[number];

// IELTS module implementation
export class IeltsExamModule extends BaseExamModule {
  private moduleConfigs: Record<IeltsModuleType, ModuleConfig>;
  private levelConfigs: Record<IeltsBandType, Record<IeltsModuleType, LevelConfig>>;
  private examTypeConfig: ExamTypeConfig;

  constructor() {
    super();

    // Define exam type
    this.examTypeConfig = {
      id: 'ielts',
      label: 'IELTS',
      languageCode: 'en',
      languageName: 'English',
      flag: '🇬🇧'
    };

    // Define modules with proper details
    this.moduleConfigs = {
      [IELTS_MODULES.READING]: {
        id: IELTS_MODULES.READING,
        label: 'Reading',
        details: {
          description: 'Test your ability to understand and analyze written English texts',
          skills: [
            {
              name: 'Reading comprehension',
              description: 'Understanding main ideas and specific details in academic texts',
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
              name: 'Academic texts',
              description: 'Texts from academic journals, textbooks, and research papers',
              examples: ['Research articles', 'Academic papers', 'Textbook extracts']
            },
            {
              name: 'Diagrams',
              description: 'Visual representations of information',
              examples: ['Flow charts', 'Process diagrams', 'Technical drawings']
            },
            {
              name: 'Charts',
              description: 'Data visualization and statistical information',
              examples: ['Bar charts', 'Line graphs', 'Pie charts']
            }
          ],
          questionTypes: [
            {
              name: 'Multiple choice',
              description: 'Select the correct answer from given options',
              examples: ['Single correct answer', 'Multiple correct answers', 'Best answer selection']
            },
            {
              name: 'True/False/Not Given',
              description: 'Determine if statements are true, false, or not mentioned in the text',
              examples: ['Factual statements', 'Inference questions', 'Opinion statements']
            },
            {
              name: 'Matching',
              description: 'Match items from two columns based on the text',
              examples: ['Headings with paragraphs', 'Questions with answers', 'Statements with speakers']
            }
          ],
          examStructure: {
            description: 'The IELTS reading exam tests your ability to understand and analyze academic texts',
            parts: [
              {
                name: 'Part 1',
                description: 'Short texts and notices',
                duration: 20,
                questions: 13,
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
                questions: 13,
                skills: ['Inference', 'Analysis', 'Evaluation'],
                format: 'True/False/Not Given and multiple choice questions',
                tips: [
                  'Read the text carefully',
                  'Make notes of key points',
                  'Check your answers before submitting'
                ]
              },
              {
                name: 'Part 3',
                description: 'Academic texts with detailed analysis',
                duration: 20,
                questions: 14,
                skills: ['Critical analysis', 'Synthesis', 'Evaluation'],
                format: 'Matching and summary completion questions',
                tips: [
                  'Understand the text structure',
                  'Identify key arguments',
                  'Pay attention to detail'
                ]
              }
            ],
            totalDuration: 60,
            totalQuestions: 40,
            passingScore: 6.0,
            difficulty: 'intermediate',
            preparationTime: '3-4 months',
            recommendedResources: [
              'Cambridge IELTS practice materials',
              'British Council resources',
              'Online reading comprehension exercises'
            ]
          }
        }
      },
      [IELTS_MODULES.WRITING]: {
        id: IELTS_MODULES.WRITING,
        label: 'Writing',
        details: {
          description: 'Test your ability to write in English',
          skills: [
            {
              name: 'Task achievement',
              description: 'Completing the task requirements',
              examples: ['Following the task instructions', 'Meeting the word count', 'Using appropriate language']
            },
            {
              name: 'Task response',
              description: 'Responding to the task',
              examples: ['Using appropriate language', 'Following the task instructions', 'Meeting the word count']
            }
          ],
          textTypes: [
            {
              name: 'Academic texts',
              description: 'Texts from academic journals, textbooks, and research papers',
              examples: ['Research articles', 'Academic papers', 'Textbook extracts']
            },
            {
              name: 'Diagrams',
              description: 'Visual representations of information',
              examples: ['Flow charts', 'Process diagrams', 'Technical drawings']
            },
            {
              name: 'Charts',
              description: 'Data visualization and statistical information',
              examples: ['Bar charts', 'Line graphs', 'Pie charts']
            }
          ],
          questionTypes: [
            {
              name: 'Multiple choice',
              description: 'Select the correct answer from given options',
              examples: ['Single correct answer', 'Multiple correct answers', 'Best answer selection']
            },
            {
              name: 'True/False/Not Given',
              description: 'Determine if statements are true, false, or not mentioned in the text',
              examples: ['Factual statements', 'Inference questions', 'Opinion statements']
            },
            {
              name: 'Matching',
              description: 'Match items from two columns based on the text',
              examples: ['Headings with paragraphs', 'Questions with answers', 'Statements with speakers']
            }
          ],
          examStructure: {
            description: 'The IELTS writing exam tests your ability to write in English',
            parts: [
              {
                name: 'Part 1',
                description: 'Task 1: Letter/Email',
                duration: 60,
                questions: 1,
                skills: ['Task achievement', 'Task response'],
                format: 'Letter/Email',
                tips: [
                  'Follow the task instructions',
                  'Use appropriate language',
                  'Meet the word count'
                ]
              },
              {
                name: 'Part 2',
                description: 'Task 2: Essay',
                duration: 60,
                questions: 1,
                skills: ['Task achievement', 'Task response'],
                format: 'Essay',
                tips: [
                  'Follow the task instructions',
                  'Use appropriate language',
                  'Meet the word count'
                ]
              }
            ],
            totalDuration: 120,
            totalQuestions: 2,
            passingScore: 6.0,
            difficulty: 'intermediate',
            preparationTime: '3-4 months',
            recommendedResources: [
              'Cambridge IELTS practice materials',
              'British Council resources',
              'Online writing practice exercises'
            ]
          }
        }
      },
      [IELTS_MODULES.LISTENING]: {
        id: IELTS_MODULES.LISTENING,
        label: 'Listening',
        details: {
          description: 'Test your ability to understand spoken English',
          skills: [
            {
              name: 'Listening comprehension',
              description: 'Understanding main ideas and specific details in spoken English',
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
              name: 'Academic texts',
              description: 'Texts from academic journals, textbooks, and research papers',
              examples: ['Research articles', 'Academic papers', 'Textbook extracts']
            },
            {
              name: 'Diagrams',
              description: 'Visual representations of information',
              examples: ['Flow charts', 'Process diagrams', 'Technical drawings']
            },
            {
              name: 'Charts',
              description: 'Data visualization and statistical information',
              examples: ['Bar charts', 'Line graphs', 'Pie charts']
            }
          ],
          questionTypes: [
            {
              name: 'Multiple choice',
              description: 'Select the correct answer from given options',
              examples: ['Single correct answer', 'Multiple correct answers', 'Best answer selection']
            },
            {
              name: 'True/False/Not Given',
              description: 'Determine if statements are true, false, or not mentioned in the text',
              examples: ['Factual statements', 'Inference questions', 'Opinion statements']
            },
            {
              name: 'Matching',
              description: 'Match items from two columns based on the text',
              examples: ['Headings with paragraphs', 'Questions with answers', 'Statements with speakers']
            }
          ],
          examStructure: {
            description: 'The IELTS listening exam tests your ability to understand spoken English',
            parts: [
              {
                name: 'Part 1',
                description: 'Short conversations',
                duration: 4,
                questions: 4,
                skills: ['Basic comprehension', 'Vocabulary recognition', 'Simple analysis'],
                format: 'Multiple choice questions',
                tips: [
                  'Listen carefully',
                  'Look for key words',
                  'Manage your time well'
                ]
              },
              {
                name: 'Part 2',
                description: 'Longer conversations',
                duration: 6,
                questions: 4,
                skills: ['Detailed comprehension', 'Analysis', 'Evaluation'],
                format: 'Multiple choice questions',
                tips: [
                  'Listen carefully',
                  'Take notes',
                  'Review your answers'
                ]
              },
              {
                name: 'Part 3',
                description: 'Academic lectures',
                duration: 10,
                questions: 4,
                skills: ['Critical analysis', 'Synthesis', 'Evaluation'],
                format: 'Multiple choice questions',
                tips: [
                  'Listen carefully',
                  'Take notes',
                  'Review your answers'
                ]
              },
              {
                name: 'Part 4',
                description: 'Academic lectures',
                duration: 10,
                questions: 4,
                skills: ['Critical analysis', 'Synthesis', 'Evaluation'],
                format: 'Multiple choice questions',
                tips: [
                  'Listen carefully',
                  'Take notes',
                  'Review your answers'
                ]
              }
            ],
            totalDuration: 30,
            totalQuestions: 16,
            passingScore: 6.0,
            difficulty: 'intermediate',
            preparationTime: '3-4 months',
            recommendedResources: [
              'Cambridge IELTS practice materials',
              'British Council resources',
              'Online listening practice exercises'
            ]
          }
        }
      },
      [IELTS_MODULES.SPEAKING]: {
        id: IELTS_MODULES.SPEAKING,
        label: 'Speaking',
        details: {
          description: 'Test your ability to speak in English',
          skills: [
            {
              name: 'Fluency',
              description: 'Speaking without many breaks and using appropriate language',
              examples: ['Speaking without many breaks', 'Using appropriate language', 'Maintaining a conversation']
            },
            {
              name: 'Lexical resource',
              description: 'Using a wide range of words and phrases',
              examples: ['Using a wide range of words', 'Using appropriate language', 'Expanding vocabulary']
            },
            {
              name: 'Grammatical range and accuracy',
              description: 'Using a range of grammatical structures and forming correct sentences',
              examples: ['Using a range of grammatical structures', 'Forming correct sentences', 'Using appropriate tenses']
            }
          ],
          textTypes: [
            {
              name: 'Academic texts',
              description: 'Texts from academic journals, textbooks, and research papers',
              examples: ['Research articles', 'Academic papers', 'Textbook extracts']
            },
            {
              name: 'Diagrams',
              description: 'Visual representations of information',
              examples: ['Flow charts', 'Process diagrams', 'Technical drawings']
            },
            {
              name: 'Charts',
              description: 'Data visualization and statistical information',
              examples: ['Bar charts', 'Line graphs', 'Pie charts']
            }
          ],
          questionTypes: [
            {
              name: 'Multiple choice',
              description: 'Select the correct answer from given options',
              examples: ['Single correct answer', 'Multiple correct answers', 'Best answer selection']
            },
            {
              name: 'True/False/Not Given',
              description: 'Determine if statements are true, false, or not mentioned in the text',
              examples: ['Factual statements', 'Inference questions', 'Opinion statements']
            },
            {
              name: 'Matching',
              description: 'Match items from two columns based on the text',
              examples: ['Headings with paragraphs', 'Questions with answers', 'Statements with speakers']
            }
          ],
          examStructure: {
            description: 'The IELTS speaking exam tests your ability to speak in English',
            parts: [
              {
                name: 'Part 1',
                description: 'Introduction and interview',
                duration: 4,
                questions: 1,
                skills: ['Basic comprehension', 'Vocabulary recognition', 'Simple analysis'],
                format: 'Interview',
                tips: [
                  'Introduce yourself',
                  'Answer the question',
                  'Maintain a conversation'
                ]
              },
              {
                name: 'Part 2',
                description: 'Cue card task',
                duration: 3,
                questions: 1,
                skills: ['Detailed comprehension', 'Analysis', 'Evaluation'],
                format: 'Cue card',
                tips: [
                  'Answer the question',
                  'Use appropriate language',
                  'Maintain a conversation'
                ]
              },
              {
                name: 'Part 3',
                description: 'Two-way discussion',
                duration: 4,
                questions: 1,
                skills: ['Detailed comprehension', 'Analysis', 'Evaluation'],
                format: 'Two-way discussion',
                tips: [
                  'Answer the question',
                  'Use appropriate language',
                  'Maintain a conversation'
                ]
              },
              {
                name: 'Part 4',
                description: 'Cue card task',
                duration: 3,
                questions: 1,
                skills: ['Detailed comprehension', 'Analysis', 'Evaluation'],
                format: 'Cue card',
                tips: [
                  'Answer the question',
                  'Use appropriate language',
                  'Maintain a conversation'
                ]
              },
              {
                name: 'Part 5',
                description: 'Two-way discussion',
                duration: 5,
                questions: 1,
                skills: ['Detailed comprehension', 'Analysis', 'Evaluation'],
                format: 'Two-way discussion',
                tips: [
                  'Answer the question',
                  'Use appropriate language',
                  'Maintain a conversation'
                ]
              }
            ],
            totalDuration: 14,
            totalQuestions: 5,
            passingScore: 6.0,
            difficulty: 'intermediate',
            preparationTime: '3-4 months',
            recommendedResources: [
              'Cambridge IELTS practice materials',
              'British Council resources',
              'Online speaking practice exercises'
            ]
          }
        }
      }
    };

    // Define levels (bands) for each module
    this.levelConfigs = this.createBandConfigs();
  }

  // Helper method to create band configurations for all modules
  private createBandConfigs(): Record<IeltsBandType, Record<IeltsModuleType, LevelConfig>> {
    const bandConfigs: Record<string, Record<IeltsModuleType, LevelConfig>> = {};
    
    // Generate configurations for each band
    IELTS_BANDS.forEach(band => {
      bandConfigs[band] = this.createBandConfigForModules(band);
    });
    
    return bandConfigs as Record<IeltsBandType, Record<IeltsModuleType, LevelConfig>>;
  }

  // Create configurations for all modules at a specific band
  private createBandConfigForModules(band: string): Record<IeltsModuleType, LevelConfig> {
    const modules = Object.values(IELTS_MODULES);
    const bandLabel = this.getBandLabel(band);
    
    // Create a record with a configuration for each module
    return modules.reduce((configs, moduleId) => {
      configs[moduleId as IeltsModuleType] = {
        id: band,
        label: bandLabel,
        details: this.createBandDetails(band, moduleId as IeltsModuleType)
      };
      return configs;
    }, {} as Record<IeltsModuleType, LevelConfig>);
  }

  // Get descriptive label for each band
  private getBandLabel(band: string): string {
    const bandDescriptions: Record<string, string> = {
      '1': 'Band 1 - Non User',
      '2': 'Band 2 - Extremely Limited User',
      '3': 'Band 3 - Limited User',
      '4': 'Band 4 - Basic User',
      '5': 'Band 5 - Modest User',
      '6': 'Band 6 - Competent User',
      '7': 'Band 7 - Good User',
      '8': 'Band 8 - Very Good User',
      '9': 'Band 9 - Expert User'
    };
    
    return bandDescriptions[band] || `Band ${band}`;
  }

  // Create specific band details for a given band and module
  private createBandDetails(band: string, moduleId: IeltsModuleType) {
    const bandNum = parseInt(band, 10);
    
    const baseDetails = {
      description: `This Band ${band} exam tests your ability to understand and use English in ${moduleId} contexts at an ${this.getBandLabel(band).toLowerCase()} level.`,
      skills: [
        {
          name: `${moduleId.charAt(0).toUpperCase() + moduleId.slice(1)} at Band ${band}`,
          description: `Understanding and processing ${moduleId} content at Band ${band} level`,
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
          name: 'Academic texts',
          description: 'Texts from academic sources',
          examples: ['Research papers', 'Academic articles', 'Textbook extracts']
        },
        {
          name: 'Diagrams',
          description: 'Visual representations of information',
          examples: ['Flow charts', 'Process diagrams', 'Technical drawings']
        },
        {
          name: 'Charts',
          description: 'Data visualization and statistical information',
          examples: ['Bar charts', 'Line graphs', 'Pie charts']
        }
      ],
      questionTypes: [
        {
          name: 'Multiple choice',
          description: 'Select the correct answer from options',
          examples: ['Single answer', 'Multiple answers', 'Best answer']
        },
        {
          name: 'True/False/Not Given',
          description: 'Determine if statements are true, false, or not mentioned',
          examples: ['Factual statements', 'Inference questions', 'Opinion statements']
        },
        {
          name: 'Matching',
          description: 'Match related items or information',
          examples: ['Headings with paragraphs', 'Questions with answers', 'Statements with speakers']
        }
      ],
      examStructure: {
        description: `The Band ${band} exam structure is designed to test your ${moduleId} skills comprehensively.`,
        parts: [
          {
            name: 'Part 1',
            description: 'Basic comprehension and understanding',
            duration: 20,
            questions: 13,
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
            duration: 20,
            questions: 13,
            skills: ['Detailed comprehension', 'Analysis', 'Evaluation'],
            format: 'True/False/Not Given and multiple choice questions',
            tips: [
              'Read carefully',
              'Take notes',
              'Review your answers'
            ]
          },
          {
            name: 'Part 3',
            description: 'Complex analysis and evaluation',
            duration: 20,
            questions: 14,
            skills: ['Critical analysis', 'Synthesis', 'Evaluation'],
            format: 'Matching and summary completion questions',
            tips: [
              'Understand the text structure',
              'Identify key arguments',
              'Pay attention to detail'
            ]
          }
        ],
        totalDuration: 60,
        totalQuestions: 40,
        passingScore: bandNum,
        difficulty: this.getDifficultyLevel(bandNum),
        preparationTime: this.getPreparationTime(bandNum),
        recommendedResources: [
          'Cambridge IELTS materials',
          'British Council resources',
          'Online practice tests'
        ]
      }
    };

    return baseDetails;
  }

  // Helper method to determine difficulty level based on band
  private getDifficultyLevel(band: number): 'beginner' | 'elementary' | 'intermediate' | 'upper-intermediate' | 'advanced' | 'proficiency' {
    if (band <= 3) return 'beginner';
    if (band <= 4) return 'elementary';
    if (band <= 5) return 'intermediate';
    if (band <= 6) return 'upper-intermediate';
    if (band <= 7) return 'advanced';
    return 'proficiency';
  }

  // Helper method to determine preparation time based on band
  private getPreparationTime(band: number): string {
    if (band <= 3) return '1-2 months';
    if (band <= 4) return '2-3 months';
    if (band <= 5) return '3-4 months';
    if (band <= 6) return '4-5 months';
    if (band <= 7) return '5-6 months';
    return '6+ months';
  }

  // Required interface implementations
  getModules() {
    return Object.values(this.moduleConfigs).map(({ id, label }) => ({ id, label }));
  }

  getLevels() {
    return IELTS_BANDS.map(band => ({
      id: band,
      label: this.getBandLabel(band)
    }));
  }

  getExamType(): ExamTypeConfig {
    return this.examTypeConfig;
  }

  getModuleConfig(moduleId: string): ModuleConfig | null {
    return this.moduleConfigs[moduleId as IeltsModuleType] || null;
  }

  getLevelConfig(levelId: string, moduleId: string): LevelConfig | null {
    if (!this.levelConfigs[levelId as IeltsBandType]) return null;
    return this.levelConfigs[levelId as IeltsBandType][moduleId as IeltsModuleType] || null;
  }
}

// Register this module
ExamModuleRegistry.register('ielts', new IeltsExamModule());