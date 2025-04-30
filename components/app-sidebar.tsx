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
  Target,
  Brain,
  BookMarked,
  Clock,
} from "lucide-react"
import { createClient } from "@/lib/supabase/client"

import { NavMain } from "@/components/nav-main"
import { NavProjects } from "@/components/nav-projects"
import { NavUser } from "@/components/nav-user"
import { TeamSwitcher } from "@/components/team-switcher"
import { ThemeToggle } from "@/components/theme-toggle"
import { useExam } from "@/lib/context/user-preferences-context"
import { EXAM_LANGUAGES } from "@/lib/exam/config"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"
import { LanguageSwitcher } from "@/components/language-switcher"
import { useTranslation } from "@/lib/i18n/hooks"
import { ExamSwitcher } from "@/components/exam-switcher"

// Core navigation items - essential for exam preparation
const coreItems = [
  {
    name: "Dashboard",
    translationKey: "sidebar.dashboard",
    url: "/dashboard/overview",
    icon: LayoutDashboard,
    description: "Overview of your progress and next steps",
    actions: {
      view: false,
      share: false,
      delete: false
    }
  },
  {
    name: "Mock Exams",
    translationKey: "sidebar.mockExams",
    url: "/dashboard/mock-exams",
    icon: FileText,
    description: "Practice with real exam simulations",
    actions: {
      view: false,
      share: false,
      delete: false
    }
  },
  {
    name: "Progress",
    translationKey: "sidebar.progress",
    url: "/dashboard/progress",
    icon: Trophy,
    description: "Track your learning journey",
    actions: {
      view: false,
      share: false,
      delete: false
    }
  },
]

// Practice items - focused on specific skills
const practiceItems = [
  {
    name: "Reading Practice",
    translationKey: "sidebar.readingPractice",
    url: "/dashboard/practice/session?skill=reading",
    icon: BookOpen,
    description: "Improve reading comprehension",
    actions: {
      view: false,
      share: false,
      delete: false
    }
  },
  {
    name: "Listening Practice",
    translationKey: "sidebar.listeningPractice",
    url: "/dashboard/practice/session?skill=listening",
    icon: Headphones,
    description: "Enhance listening skills",
    actions: {
      view: false,
      share: false,
      delete: false
    }
  },
  {
    name: "Writing Practice",
    translationKey: "sidebar.writingPractice",
    url: "/dashboard/practice/session?skill=writing",
    icon: PenTool,
    description: "Develop writing abilities",
    actions: {
      view: false,
      share: false,
      delete: false
    }
  },
  {
    name: "Speaking Practice",
    translationKey: "sidebar.speakingPractice",
    url: "/dashboard/practice/session?skill=speaking",
    icon: Mic,
    description: "Practice speaking fluency",
    actions: {
      view: false,
      share: false,
      delete: false
    }
  },
]

// Learning resources - supporting materials and tools
const resourceItems = [
  {
    name: "Study Materials",
    translationKey: "sidebar.studyMaterials",
    url: "/dashboard/materials",
    icon: BookMarked,
    description: "Access learning resources",
    actions: {
      view: false,
      share: false,
      delete: false
    }
  },
  {
    name: "Vocabulary",
    translationKey: "sidebar.vocabulary",
    url: "/dashboard/vocabulary",
    icon: Brain,
    description: "Build your word bank",
    actions: {
      view: false,
      share: false,
      delete: false
    }
  },
  {
    name: "Grammar",
    translationKey: "sidebar.grammar",
    url: "/dashboard/grammar",
    icon: Target,
    description: "Master language rules",
    actions: {
      view: false,
      share: false,
      delete: false
    }
  },
  {
    name: "Schedule",
    translationKey: "sidebar.schedule",
    url: "/dashboard/schedule",
    icon: Clock,
    description: "Plan your study time",
    actions: {
      view: false,
      share: false,
      delete: false
    }
  },
]

// Settings and preferences
const settingsItems = [
  {
    name: "Settings",
    translationKey: "sidebar.settings",
    url: "/dashboard/settings",
    icon: Settings2,
    description: "Customize your experience",
    actions: {
      view: false,
      share: false,
      delete: false
    }
  },
]

interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
  user?: {
    id: string;
    email?: string;
    name?: string;
  };
}

export function AppSidebar({ user: propUser, ...props }: AppSidebarProps) {
  const { examType } = useExam();
  const { t, isLoaded: isTranslationLoaded } = useTranslation();
  const currentLanguage = EXAM_LANGUAGES[examType];
  const [user, setUser] = React.useState(propUser);
  const supabase = createClient();

  React.useEffect(() => {
    const getUser = async () => {
      const { data: { user: currentUser } } = await supabase.auth.getUser();
      if (currentUser) {
        setUser({
          id: currentUser.id,
          email: currentUser.email,
          name: currentUser.user_metadata?.name || currentUser.email,
        });
      }
    };

    getUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setUser({
          id: session.user.id,
          email: session.user.email,
          name: session.user.user_metadata?.name || session.user.email,
        });
      } else {
        setUser(undefined);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [supabase.auth]);

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
    <Sidebar collapsible="icon" className="pb-[50px]" {...props}>
      <SidebarHeader>
        <div className="px-2 py-2 flex flex-col gap-4">
          <div className="flex flex-col gap-2 bg-muted/50 rounded-lg">
            <ExamSwitcher />
            <LanguageSwitcher />
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <NavProjects 
          title="sidebar.core" 
          projects={coreItems.map(project => ({
            ...project,
            name: isTranslationLoaded ? t(project.translationKey) : project.name,
          }))} 
          showActions={false}
        />
        <NavProjects 
          title="sidebar.practice" 
          projects={practiceItems.map(project => ({
            ...project,
            name: isTranslationLoaded ? t(project.translationKey) : project.name,
          }))} 
          showActions={false}
        />
        <NavProjects 
          title="sidebar.resources" 
          projects={resourceItems.map(project => ({
            ...project,
            name: isTranslationLoaded ? t(project.translationKey) : project.name,
          }))} 
          showActions={false}
        />
        <NavProjects 
          title="sidebar.settings" 
          projects={settingsItems.map(project => ({
            ...project,
            name: isTranslationLoaded ? t(project.translationKey) : project.name,
          }))} 
          showActions={false}
        />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={userData} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}

