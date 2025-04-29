import { GoetheReadingUI } from './goethe-reading-ui';
import { ExamService } from '@/lib/exam/service';
import { ExamType, EXAM_TYPES } from '@/lib/constants';

// Import all the UI components
// Add more imports as needed for other exam types
import { IELTSReadingUI } from './ielts-reading-ui';

export interface ReadingUIProps {
  passage: any;
  questions: any[];
  isPassageLoading: boolean;
  isQuestionsLoading: boolean;
  isQuestionsReady: boolean;
  onRestart: () => void;
  showQuestionsPanel?: boolean;
  showPassagePanel?: boolean;
  selectedAnswers?: number[];
  onAnswerSelect?: (questionId: number, answerIndex: number) => void;
}

/**
 * Get the appropriate Reading UI component for the given exam type
 */
export function getReadingUI(examType: ExamType) {
  // Use the ExamService to get the right component
  const componentName = ExamService.getUIComponent(examType);
  
  // Map component names to actual components
  switch (componentName) {
    case 'GoetheReadingUI':
      return GoetheReadingUI;
    case 'IELTSReadingUI':
      return IELTSReadingUI;
    default:
      // Fallback to a default UI
      console.warn(`No UI component found for exam type: ${examType}`);
      return examType === EXAM_TYPES.GOETHE ? GoetheReadingUI : IELTSReadingUI;
  }
} 