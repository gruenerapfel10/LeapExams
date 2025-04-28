"use client";

import { useState } from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { AIPanel } from "@/components/ai-panel";
import { SiteHeader } from "@/components/site-header";
import { Button } from "@/components/ui/button";
import { Bot } from "lucide-react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isAIPanelOpen, setIsAIPanelOpen] = useState(false);

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <AppSidebar />
        <div className="flex-1 flex flex-col w-full">
          <SiteHeader>
            <Button
              variant="ghost"
              size="icon"
              className="ml-auto"
              onClick={() => setIsAIPanelOpen(!isAIPanelOpen)}
            >
              <Bot className="h-5 w-5" />
              <span className="sr-only">Toggle AI Assistant</span>
            </Button>
          </SiteHeader>
          <main className="flex-1 p-6 md:p-8 lg:p-10 w-full">
            <div className="mx-auto w-full">
              {children}
            </div>
          </main>
        </div>
        <AIPanel open={isAIPanelOpen} onOpenChange={setIsAIPanelOpen} />
      </div>
    </SidebarProvider>
  );
} 