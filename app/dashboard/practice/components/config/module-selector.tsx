import { BookOpen, Headphones, Mic, PenTool } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

const moduleIcons = {
  reading: BookOpen,
  listening: Headphones,
  speaking: Mic,
  writing: PenTool,
};

interface ModuleSelectorProps {
  selectedModule: string;
  onSelect: (module: string) => void;
}

export function ModuleSelector({ selectedModule, onSelect }: ModuleSelectorProps) {
  return (
    <>
      <CardHeader>
        <CardTitle>Select Module</CardTitle>
        <CardDescription>Choose the skill you want to practice</CardDescription>
      </CardHeader>
      <div className="grid grid-cols-2 gap-4">
        {Object.entries(moduleIcons).map(([module, Icon]) => (
          <Button
            key={module}
            variant={selectedModule === module ? "default" : "outline"}
            className="h-20 flex flex-col items-center gap-2"
            onClick={() => onSelect(module)}
          >
            <Icon className="h-6 w-6" />
            <span className="capitalize">{module}</span>
          </Button>
        ))}
      </div>
    </>
  );
} 