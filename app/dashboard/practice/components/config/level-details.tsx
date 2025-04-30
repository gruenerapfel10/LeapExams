import { Brain, BookMarked, Timer, BarChart } from "lucide-react";
import { CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Level } from "@/lib/exam/levels";

interface LevelDetailsProps {
  levelConfig: Level;
}

function DetailSection({ icon: Icon, title, items }: { icon: any; title: string; items: string[] }) {
  return (
    <div className="space-y-1.5">
      <div className="flex items-center gap-2">
        <Icon className="h-4 w-4 text-primary shrink-0" />
        <h4 className="font-semibold text-sm">{title}</h4>
      </div>
      <ul className="list-disc list-inside space-y-0.5 text-muted-foreground text-sm">
        {items.map((item, index) => (
          <li key={index}>{item}</li>
        ))}
      </ul>
    </div>
  );
}

function TimeStructure({ parts, totalTime }: { parts: { name: string; timeLimit: number }[]; totalTime: number }) {
  return (
    <div className="space-y-1.5">
      {parts.map((part, index) => (
        <div key={index} className="flex justify-between items-center text-sm">
          <span>{part.name}</span>
          <span className="font-medium">{part.timeLimit} min</span>
        </div>
      ))}
      <div className="pt-1.5 border-t flex justify-between items-center text-sm">
        <span className="font-medium">Total Time</span>
        <span className="font-medium">{totalTime} min</span>
      </div>
    </div>
  );
}

export function LevelDetails({ levelConfig }: LevelDetailsProps) {
  const { details } = levelConfig;

  return (
    <>
      <CardHeader className="p-0 pb-3">
        <CardTitle className="text-lg">Level Details</CardTitle>
        <CardDescription className="text-sm">What to expect at {levelConfig.label}</CardDescription>
      </CardHeader>
      <div className="space-y-4">
        <DetailSection icon={Brain} title="Skills You'll Develop" items={details.skills} />
        <DetailSection icon={BookMarked} title="Text Types" items={details.textTypes} />
        <div className="bg-muted/30 rounded-lg p-3">
          <div className="flex items-center gap-2 mb-2">
            <Timer className="h-4 w-4 text-primary shrink-0" />
            <h4 className="font-semibold text-sm">Time Structure</h4>
          </div>
          <TimeStructure parts={details.examStructure.parts} totalTime={details.examStructure.totalTime} />
        </div>
        <DetailSection icon={BarChart} title="Question Types" items={details.questionTypes} />
      </div>
    </>
  );
} 