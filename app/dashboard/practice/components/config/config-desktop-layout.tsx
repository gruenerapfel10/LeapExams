import { useState } from "react";
import { skillLevels } from "@/lib/exam/levels";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ModuleSelector } from "./module-selector";
import { LevelSelector } from "./level-selector";
import { LevelDetails } from "./level-details";
import { ExamSummary } from "./exam-summary";

interface DesktopConfigLayoutProps {
  selectedModule: string;
  setSelectedModule: (module: string) => void;
  selectedDifficulty: string;
  setSelectedDifficulty: (level: string) => void;
  onStart: () => void;
}

export function DesktopConfigLayout({
  selectedModule,
  setSelectedModule,
  selectedDifficulty,
  setSelectedDifficulty,
  onStart,
}: DesktopConfigLayoutProps) {
  const availableLevels = Object.keys(skillLevels[selectedModule] || {});
  const selectedLevelConfig = skillLevels[selectedModule]?.[selectedDifficulty];

  return (
    <div className="grid grid-cols-2 gap-4 h-[calc(100vh-8rem)]">
      {/* Left Panel */}
      <div className="flex flex-col gap-4">
        {/* Top Section - Module and Level Selection */}
        <div className="grid grid-cols-2 gap-4">
          <Card className="p-4">
            <ModuleSelector
              selectedModule={selectedModule}
              onSelect={setSelectedModule}
            />
          </Card>
          <Card className="p-4">
            <LevelSelector
              selectedLevel={selectedDifficulty}
              availableLevels={availableLevels}
              onSelect={setSelectedDifficulty}
            />
          </Card>
        </div>
        
        {/* Bottom Section - Level Details */}
        <Card className="flex-1 p-4 overflow-y-auto">
          {selectedLevelConfig && (
            <LevelDetails levelConfig={selectedLevelConfig} />
          )}
        </Card>
      </div>

      {/* Right Panel - Summary and Start Button */}
      <Card className="p-4">
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