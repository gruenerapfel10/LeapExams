import { Button } from "@/components/ui/button";
import { CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Level } from "@/lib/exam/levels";

interface ExamSummaryProps {
  levelConfig: Level;
  onStart: () => void;
}

function SummaryItem({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="flex justify-between items-center text-sm">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium">{value}</span>
    </div>
  );
}

export function ExamSummary({ levelConfig, onStart }: ExamSummaryProps) {
  const { details } = levelConfig;

  return (
    <>
      <CardHeader className="p-0 pb-3">
        <CardTitle className="text-lg">Exercise Summary</CardTitle>
        <CardDescription className="text-sm">Review your selected settings before starting</CardDescription>
      </CardHeader>
      <div className="space-y-4">
        <div className="space-y-2">
          <SummaryItem label="Selected Level" value={levelConfig.label} />
          <SummaryItem label="Total Questions" value={details.examStructure.totalQuestions} />
          <SummaryItem label="Total Time" value={`${details.examStructure.totalTime} minutes`} />
          <SummaryItem label="Passing Score" value={`${details.examStructure.passingScore}%`} />
        </div>

        <Button className="w-full" size="lg" onClick={onStart}>
          Start Exercise
        </Button>

        <p className="text-xs text-muted-foreground text-center">
          You can pause and resume the exercise at any time
        </p>
      </div>
    </>
  );
} 