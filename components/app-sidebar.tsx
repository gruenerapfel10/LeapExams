"use client"

import * as React from "react"
import {
  BookOpen,
  Headphones,
  PenTool,
  Mic,
  Settings2,
  LayoutDashboard,
  GraduationCap,
  FileText,
  Languages,
  Trophy,
} from "lucide-react"

import { NavMain } from "@/components/nav-main"
import { NavProjects } from "@/components/nav-projects"
import { NavUser } from "@/components/nav-user"
import { TeamSwitcher } from "@/components/team-switcher"
import { ThemeToggle } from "@/components/theme-toggle"
import { useExam } from "@/lib/context/user-preferences-context"
import { EXAM_LANGUAGES } from "@/lib/constants"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"
import { LanguageSwitcher } from "@/components/language-switcher"
import { useTranslation } from "@/lib/i18n/hooks"

// This is sample data.
const platformItems = [
  {
    name: "Platform",
    translationKey: "sidebar.platform",
    url: "/dashboard/overview",
    icon: LayoutDashboard,
  },
  {
    name: "Mock Exams",
    translationKey: "sidebar.mockExams",
    url: "/dashboard/mock-exams",
    icon: FileText,
  },
  {
    name: "Progress",
    translationKey: "sidebar.progress",
    url: "/dashboard/progress",
    icon: Trophy,
  },
  {
    name: "Settings",
    translationKey: "sidebar.settings",
    url: "/dashboard/settings",
    icon: Settings2,
  },
]

const studyItems = [
  {
    name: "Reading Practice",
    translationKey: "sidebar.readingPractice",
    url: "/dashboard/reading",
    icon: BookOpen,
  },
  {
    name: "Listening Practice",
    translationKey: "sidebar.listeningPractice",
    url: "/dashboard/listening",
    icon: Headphones,
  },
  {
    name: "Writing Practice",
    translationKey: "sidebar.writingPractice",
    url: "/dashboard/writing",
    icon: PenTool,
  },
  {
    name: "Speaking Practice",
    translationKey: "sidebar.speakingPractice",
    url: "/dashboard/speaking",
    icon: Mic,
  },
  {
    name: "Study Materials",
    translationKey: "sidebar.studyMaterials",
    url: "/dashboard/materials",
    icon: GraduationCap,
  },
]

interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
  user?: {
    id: string;
    email?: string;
    name?: string;
  };
}

export function AppSidebar({ user, ...props }: AppSidebarProps) {
  const { examType } = useExam();
  const { t, isLoaded: isTranslationLoaded } = useTranslation();
  const currentLanguage = EXAM_LANGUAGES[examType];

  const userData = user ? {
    name: user.name || user.email || 'User',
    email: user.email || '',
    avatar: "/avatars/default.jpg",
  } : {
    name: "Guest",
    email: "",
    avatar: "/avatars/default.jpg",
  };

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <div className="px-2 py-2 flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <span className="text-xs font-semibold text-muted-foreground group-data-[collapsible=icon]:hidden">
              {isTranslationLoaded ? t('exams.examType') : 'Exam Type'}
            </span>
            <TeamSwitcher />
          </div>
          <div className="flex flex-col gap-2">
            <span className="text-xs font-semibold text-muted-foreground group-data-[collapsible=icon]:hidden">
              {isTranslationLoaded ? t('exams.interfaceLanguage') : 'Interface Language'}
            </span>
            <LanguageSwitcher />
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <NavProjects 
          title="sidebar.platform" 
          projects={platformItems.map(project => ({
            ...project,
            name: isTranslationLoaded ? t(project.translationKey) : project.name,
          }))} 
        />
        <NavProjects 
          title="sidebar.study" 
          projects={studyItems.map(project => ({
            ...project,
            name: isTranslationLoaded ? t(project.translationKey) : project.name,
          }))} 
        />
      </SidebarContent>
      <SidebarFooter>
        <div className="flex items-center justify-between px-4 py-2">
          <NavUser user={userData} />
          <ThemeToggle />
        </div>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}

