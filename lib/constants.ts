import { generateDummyPassword } from './db/utils';

export const isProductionEnvironment = process.env.NODE_ENV === 'production';

export const isTestEnvironment = Boolean(
  process.env.PLAYWRIGHT_TEST_BASE_URL ||
    process.env.PLAYWRIGHT ||
    process.env.CI_PLAYWRIGHT,
);

export const DUMMY_PASSWORD = generateDummyPassword();

export const EXAM_TYPES = {
  IELTS: 'ielts',
  GOETHE: 'goethe',
} as const;

export type ExamType = typeof EXAM_TYPES[keyof typeof EXAM_TYPES];

export const EXAM_LANGUAGES = {
  [EXAM_TYPES.IELTS]: {
    code: 'en',
    name: 'English',
    flag: '🇬🇧',
  },
  [EXAM_TYPES.GOETHE]: {
    code: 'de',
    name: 'German',
    flag: '🇩🇪',
  },
} as const;

export const DEFAULT_EXAM = EXAM_TYPES.IELTS;
