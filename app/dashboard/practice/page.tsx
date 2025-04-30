"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { MobileConfigLayout } from "./components/config/config-mobile-layout";
import { DesktopConfigLayout } from "./components/config/config-desktop-layout";
import { useMediaQuery } from "@/app/hooks/use-media-query";

export default function PracticePage() {
  const [selectedModule, setSelectedModule] = useState("reading");
  const [selectedDifficulty, setSelectedDifficulty] = useState("A1");
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const isDesktop = useMediaQuery("(min-width: 1024px)");

  useEffect(() => {
    // Set loading to false after the first render
    setIsLoading(false);
  }, []);

  const handleStart = () => {
    router.push(`/dashboard/practice/session?skill=${selectedModule}&level=${selectedDifficulty}`);
  };

  if (isLoading) {
    return (
      <div className="h-full">
        <div className="h-full animate-pulse bg-muted/50 rounded-lg" />
      </div>
    );
  }

  return (
    <>
      {isDesktop ? (
        <DesktopConfigLayout
          selectedModule={selectedModule}
          setSelectedModule={setSelectedModule}
          selectedDifficulty={selectedDifficulty}
          setSelectedDifficulty={setSelectedDifficulty}
          onStart={handleStart}
        />
      ) : (
        <MobileConfigLayout
          selectedModule={selectedModule}
          setSelectedModule={setSelectedModule}
          selectedDifficulty={selectedDifficulty}
          setSelectedDifficulty={setSelectedDifficulty}
          onStart={handleStart}
        />
      )}
    </>
  );
} 