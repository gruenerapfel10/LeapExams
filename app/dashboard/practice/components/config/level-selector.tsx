import { Button } from "@/components/ui/button";
import { CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { skillLevels } from "@/lib/exam/levels";

interface LevelSelectorProps {
  selectedLevel: string;
  availableLevels: string[];
  onSelect: (level: string) => void;
}

export function LevelSelector({
  selectedLevel,
  availableLevels,
  onSelect,
}: LevelSelectorProps) {
  return (
    <>
      <CardHeader>
        <CardTitle>Select Level</CardTitle>
        <CardDescription>Choose your proficiency level</CardDescription>
      </CardHeader>
      <div className="grid grid-cols-2 gap-4">
        {availableLevels.map((level) => (
          <Button
            key={level}
            variant={selectedLevel === level ? "default" : "outline"}
            className="h-20 flex flex-col items-center gap-2"
            onClick={() => onSelect(level)}
          >
            <span className="text-lg font-semibold">{level}</span>
            <span className="text-sm text-muted-foreground">
              {level === "A1" && "Beginner"}
              {level === "A2" && "Elementary"}
              {level === "B1" && "Intermediate"}
              {level === "B2" && "Upper Intermediate"}
              {level === "C1" && "Advanced"}
              {level === "C2" && "Mastery"}
            </span>
          </Button>
        ))}
      </div>
    </>
  );
} 