import { skillLevels } from "@/lib/exam/levels";
import { Card } from "@/components/ui/card";
import { ModuleSelector } from "./module-selector";
import { LevelSelector } from "./level-selector";
import { LevelDetails } from "./level-details";
import { ExamSummary } from "./exam-summary";

interface MobileConfigLayoutProps {
  selectedModule: string;
  setSelectedModule: (module: string) => void;
  selectedDifficulty: string;
  setSelectedDifficulty: (level: string) => void;
  onStart: () => void;
}

export function MobileConfigLayout({
  selectedModule,
  setSelectedModule,
  selectedDifficulty,
  setSelectedDifficulty,
  onStart,
}: MobileConfigLayoutProps) {
  const availableLevels = Object.keys(skillLevels[selectedModule] || {});
  const selectedLevelConfig = skillLevels[selectedModule]?.[selectedDifficulty];

  return (
    <div className="grid grid-rows-[auto_auto_1fr_auto] gap-3 h-[calc(100vh-6rem)] p-3">
      {/* Module Selection */}
      <Card className="p-3">
        <ModuleSelector
          selectedModule={selectedModule}
          onSelect={setSelectedModule}
        />
      </Card>

      {/* Level Selection */}
      <Card className="p-3">
        <LevelSelector
          selectedLevel={selectedDifficulty}
          availableLevels={availableLevels}
          onSelect={setSelectedDifficulty}
        />
      </Card>

      {/* Level Details */}
      <Card className="p-3 overflow-y-auto">
        {selectedLevelConfig && (
          <LevelDetails levelConfig={selectedLevelConfig} />
        )}
      </Card>

      {/* Summary and Start Button */}
      <Card className="p-3">
        {selectedLevelConfig && (
          <ExamSummary
            levelConfig={selectedLevelConfig}
            onStart={onStart}
          />
        )}
      </Card>
    </div>
  );
} 