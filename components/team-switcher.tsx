"use client"

import * as React from "react"
import { Check, ChevronsUpDown } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { useExam } from "@/lib/context/user-preferences-context"
import { EXAM_TYPES, EXAM_LANGUAGES } from "@/lib/constants"

export function TeamSwitcher() {
  const { examType, setExamType } = useExam()
  const [open, setOpen] = React.useState(false)

  const exams = Object.entries(EXAM_TYPES).map(([key, value]) => ({
    name: key,
    value,
    logo: EXAM_LANGUAGES[value].flag,
  }))

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          aria-label="Select an exam"
          className="w-full justify-between"
        >
          <div className="flex items-center gap-2">
            <span>{EXAM_LANGUAGES[examType].flag}</span>
            <span>{examType.toUpperCase()}</span>
          </div>
          <ChevronsUpDown className="ml-auto h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder="Search exam..." />
          <CommandEmpty>No exam found.</CommandEmpty>
          <CommandGroup>
            {exams.map((exam) => (
              <CommandItem
                key={exam.value}
                onSelect={() => {
                  setExamType(exam.value)
                  setOpen(false)
                }}
                className="text-sm"
              >
                <div className="flex items-center gap-2">
                  <span>{exam.logo}</span>
                  <span>{exam.name}</span>
                </div>
                <Check
                  className={cn(
                    "ml-auto h-4 w-4",
                    examType === exam.value ? "opacity-100" : "opacity-0"
                  )}
                />
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
