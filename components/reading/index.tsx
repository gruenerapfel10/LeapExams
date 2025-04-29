import { ExamType } from "@/lib/constants"
import { DefaultReadingUI } from "./default-reading-ui"
import { IELTSReadingUI } from "./ielts-reading-ui"
import { GoetheReadingUI } from "./goethe-reading-ui"

// Export all components
export { DefaultReadingUI, IELTSReadingUI, GoetheReadingUI }

// Props interface
export interface ReadingUIProps {
  passage: any;
  questions: any[];
  isPassageLoading: boolean;
  isQuestionsLoading: boolean;
  isQuestionsReady: boolean;
  onRestart: () => void;
  showQuestionsPanel?: boolean;
  showPassagePanel?: boolean;
}

// Factory function to get the appropriate component based on exam type
export function getReadingUI(examType: ExamType) {
  switch (examType) {
    case 'ielts':
      return IELTSReadingUI;
    case 'goethe':
      return GoetheReadingUI;
    default:
      return DefaultReadingUI;
  }
} 