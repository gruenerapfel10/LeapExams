"use client";

import { Button } from "@/components/ui/button";
import * as React from "react";
import { useCallback, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useConversation } from "@11labs/react";
import { cn } from "@/lib/utils";
import { TabSystem, type LayoutNode } from "@/components/TabSystem";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

async function requestMicrophonePermission() {
  try {
    await navigator.mediaDevices.getUserMedia({ audio: true });
    return true;
  } catch {
    console.error("Microphone permission denied");
    return false;
  }
}

async function getSignedUrl(): Promise<string> {
  const response = await fetch("/api/get-signed-url");
  if (!response.ok) {
    throw Error("Failed to get signed url");
  }
  const data = await response.json();
  return data.signedUrl;
}

interface Message {
  source: 'user' | 'ai';
  message: string;
}

// Transcript component
function TranscriptPanel({ messages }: { messages: Message[] }) {
  return (
    <div className="h-full p-4">
      <div className="flex flex-col gap-y-4">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={cn(
              "p-3 rounded-lg",
              msg.source === "user"
                ? "bg-primary text-primary-foreground ml-4"
                : "bg-muted mr-4"
            )}
          >
            {msg.message}
          </div>
        ))}
      </div>
    </div>
  );
}

// AI Orb component
function AIOrbPanel({ 
  status, 
  isSpeaking, 
  onStart, 
  onStop, 
  isConnected 
}: { 
  status: string;
  isSpeaking: boolean;
  onStart: () => void;
  onStop: () => void;
  isConnected: boolean;
}) {
  return (
    <div className="h-full flex flex-col items-center justify-center p-4">
      <CardHeader>
        <CardTitle className={"text-center"}>
          {status === "connected"
            ? isSpeaking
              ? `Agent is speaking`
              : "Agent is listening"
            : "Disconnected"}
        </CardTitle>
      </CardHeader>
      <div className={"flex flex-col gap-y-4 text-center items-center"}>
        <div
          className={cn(
            "orb my-16 mx-12",
            status === "connected" && isSpeaking
              ? "orb-active animate-orb"
              : status === "connected"
              ? "animate-orb-slow orb-inactive"
              : "orb-inactive"
          )}
        ></div>

        <Button
          variant={"outline"}
          className={"rounded-full"}
          size={"lg"}
          disabled={isConnected}
          onClick={onStart}
        >
          Start conversation
        </Button>
        <Button
          variant={"outline"}
          className={"rounded-full"}
          size={"lg"}
          disabled={!isConnected}
          onClick={onStop}
        >
          End conversation
        </Button>
      </div>
    </div>
  );
}

export function Conversation() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [layout, setLayout] = useState<LayoutNode | null>(null);
  
  const conversation = useConversation({
    onConnect: () => {
      console.log("connected");
    },
    onDisconnect: () => {
      console.log("disconnected");
    },
    onError: error => {
      console.log(error);
      alert("An error occurred during the conversation");
    },
    onMessage: message => {
      console.log(message);
      setMessages(prev => [...prev, message as Message]);
    },
  });

  async function startConversation() {
    const hasPermission = await requestMicrophonePermission();
    if (!hasPermission) {
      alert("No permission");
      return;
    }
    const signedUrl = await getSignedUrl();
    const conversationId = await conversation.startSession({ signedUrl });
    console.log(conversationId);
  }

  const stopConversation = useCallback(async () => {
    await conversation.endSession();
  }, [conversation]);

  const getContentForTab = useCallback((tabId: string) => {
    switch (tabId) {
      case 'transcript':
        return <TranscriptPanel messages={messages} />;
      case 'ai-orb':
        return (
          <AIOrbPanel 
            status={conversation.status}
            isSpeaking={conversation.isSpeaking}
            onStart={startConversation}
            onStop={stopConversation}
            isConnected={conversation.status === "connected"}
          />
        );
      default:
        return null;
    }
  }, [messages, conversation, startConversation, stopConversation]);

  const generateInitialLayout = useCallback((): LayoutNode => ({
    id: 'root_split',
    type: 'split',
    direction: 'horizontal',
    sizes: [70, 30],
    children: [
      {
        id: 'window_left',
        type: 'window',
        tabs: [
          { id: 'transcript', title: 'Transcript', iconType: 'fileQuestion' }
        ],
        activeTabId: 'transcript',
        isCollapsed: false,
      },
      {
        id: 'window_right',
        type: 'window',
        tabs: [
          { id: 'ai-orb', title: 'AI Assistant', iconType: 'bot' }
        ],
        activeTabId: 'ai-orb',
        isCollapsed: false,
      }
    ],
  }), []);

  // Initialize layout
  if (!layout) {
    setLayout(generateInitialLayout());
  }

  return (
    <DndProvider backend={HTML5Backend}>
      <TabSystem
        layout={layout}
        onLayoutChange={setLayout}
        getContentForTab={getContentForTab}
      />
    </DndProvider>
  );
}