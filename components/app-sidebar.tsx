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
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"

// This is sample data.
const data = {
  teams: [
    {
      name: "IELTS",
      logo: Languages,
      plan: "Premium",
    },
    {
      name: "Goethe",
      logo: Languages,
      plan: "Premium",
    },
  ],
  navMain: [
    {
      title: "Overview",
      url: "/dashboard",
      icon: LayoutDashboard,
      isActive: true,
    },
    {
      title: "IELTS Training",
      url: "/dashboard/ielts",
      icon: GraduationCap,
      items: [
        {
          title: "Reading",
          url: "/dashboard/ielts/reading",
        },
        {
          title: "Listening",
          url: "/dashboard/ielts/listening",
        },
        {
          title: "Writing",
          url: "/dashboard/ielts/writing",
        },
        {
          title: "Speaking",
          url: "/dashboard/ielts/speaking",
        },
      ],
    },
    {
      title: "Goethe Training",
      url: "/dashboard/goethe",
      icon: GraduationCap,
      items: [
        {
          title: "Reading",
          url: "/dashboard/goethe/reading",
        },
        {
          title: "Listening",
          url: "/dashboard/goethe/listening",
        },
        {
          title: "Writing",
          url: "/dashboard/goethe/writing",
        },
        {
          title: "Speaking",
          url: "/dashboard/goethe/speaking",
        },
      ],
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
      name: "Recent IELTS Tests",
      url: "/dashboard/ielts/recent",
      icon: FileText,
    },
    {
      name: "Recent Goethe Tests",
      url: "/dashboard/goethe/recent",
      icon: FileText,
    },
    {
      name: "Study Materials",
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
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavProjects projects={data.projects} />
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

