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
import { useExam } from "@/lib/context/exam-context"
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
const data = {
  navMain: [
    {
      title: "Overview",
      url: "/dashboard/overview",
      icon: LayoutDashboard,
      isActive: true,
    },
    {
      title: "Mock Exams",
      url: "/dashboard/mock-exams",
      icon: FileText,
      items: [
        {
          title: "IELTS Mock Tests",
          url: "/dashboard/mock-exams/ielts",
        },
        {
          title: "Goethe Mock Tests",
          url: "/dashboard/mock-exams/goethe",
        },
        {
          title: "Previous Attempts",
          url: "/dashboard/mock-exams/history",
        },
      ],
    },
    {
      title: "Progress",
      url: "/dashboard/progress",
      icon: Trophy,
      items: [
        {
          title: "Performance Analytics",
          url: "/dashboard/progress/analytics",
        },
        {
          title: "Study History",
          url: "/dashboard/progress/history",
        },
        {
          title: "Achievements",
          url: "/dashboard/progress/achievements",
        },
      ],
    },
    {
      title: "Settings",
      url: "/dashboard/settings",
      icon: Settings2,
      items: [
        {
          title: "Profile",
          url: "/dashboard/settings/profile",
        },
        {
          title: "Preferences",
          url: "/dashboard/settings/preferences",
        },
        {
          title: "Notifications",
          url: "/dashboard/settings/notifications",
        },
      ],
    },
  ],
  projects: [
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
      icon: BookOpen,
    },
  ],
}

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

  // Don't render translated content until translations are loaded
  if (!isTranslationLoaded) {
    return (
      <Sidebar collapsible="icon" {...props}>
        <SidebarHeader>
          <TeamSwitcher />
          <div className="px-4 py-2">
            <LanguageSwitcher />
          </div>
          <div className="px-4 py-2 text-sm text-muted-foreground">
            Loading...
          </div>
        </SidebarHeader>
        <SidebarContent>
          {/* Loading state */}
        </SidebarContent>
        <SidebarFooter>
          <div className="flex items-center justify-between px-4 py-2">
            <NavUser user={userData} />
            <ThemeToggle />
          </div>
        </SidebarFooter>
        <SidebarRail />
      </Sidebar>
    );
  }

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher />
        <div className="px-4 py-2">
          <LanguageSwitcher />
        </div>
        <div className="px-4 py-2 text-sm text-muted-foreground">
          {t('exams.targetLanguage')}: {currentLanguage.flag} {currentLanguage.name}
        </div>
      </SidebarHeader>
      <SidebarContent>
        <NavProjects projects={data.projects.map(project => ({
          ...project,
          name: t(project.translationKey),
        }))} />
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

