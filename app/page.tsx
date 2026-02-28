"use client";

import { useState, useEffect } from "react";
import { Message } from "@/types/chat";
import ChatWindow from "@/components/chat/ChatWindow";
import ChatInput from "@/components/chat/ChatInput";
import { v4 as uuidv4 } from "uuid";

export default function Home() {
  const [threads, setThreads] = useState<Message[][]>([[]]);
  const [activeThread, setActiveThread] = useState(0);
  const [loading, setLoading] = useState(false);
  const [temperature, setTemperature] = useState(0.7);

  const messages = threads[activeThread] || [];

  // 🔹 Load from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("studio_threads");
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) {
        setThreads(parsed);
      }
    }
  }, []);

  // 🔹 Persist to localStorage
  useEffect(() => {
    localStorage.setItem("studio_threads", JSON.stringify(threads));
  }, [threads]);

  const sendMessage = async (content: string) => {
    if (!content.trim() || loading) return;

    setLoading(true);

    const userMessage: Message = {
      id: uuidv4(),
      role: "user",
      content,
    };

    // Add user message
    setThreads((prev) => {
      const updated = [...prev];
      updated[activeThread] = [...updated[activeThread], userMessage];
      return updated;
    });

    // Add placeholder assistant message
    const assistantId = uuidv4();

    setThreads((prev) => {
      const updated = [...prev];
      updated[activeThread] = [
        ...updated[activeThread],
        {
          id: assistantId,
          role: "assistant",
          content: "",
        },
      ];
      return updated;
    });

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [...messages, userMessage],
          temperature,
        }),
      });

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();

      if (!reader) return;

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);

        setThreads((prev) => {
          const updated = [...prev];
          const thread = [...updated[activeThread]];
          const msgIndex = thread.findIndex((m) => m.id === assistantId);
          thread[msgIndex] = {
            ...thread[msgIndex],
            content: thread[msgIndex].content + chunk,
          };
          updated[activeThread] = thread;
          return updated;
        });
      }
    } catch (error) {
      setThreads((prev) => {
        const updated = [...prev];
        updated[activeThread] = [
          ...updated[activeThread],
          {
            id: uuidv4(),
            role: "assistant",
            content: "Streaming error occurred.",
          },
        ];
        return updated;
      });
    } finally {
      setLoading(false);
    }
  };

  const createNewThread = () => {
    setThreads((prev) => [...prev, []]);
    setActiveThread(threads.length);
  };

  const exportConversation = () => {
    const blob = new Blob([JSON.stringify(messages, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "conversation.json";
    a.click();
  };

  return (
    <main className="flex h-screen overflow-hidden">
      {/* SIDEBAR */}
      <aside className="w-64 bg-zinc-900/70 backdrop-blur border-r border-zinc-800 p-4 flex flex-col">
        <h2 className="text-lg font-semibold mb-4">🎮 Studio</h2>

        <div className="text-xs text-zinc-400 uppercase mb-2">
          Conversations
        </div>

        <div className="space-y-2 text-sm mb-4">
          {threads.map((_, index) => (
            <button
              key={index}
              onClick={() => setActiveThread(index)}
              className={`w-full text-left px-3 py-2 rounded-lg transition ${
                activeThread === index
                  ? "bg-blue-600"
                  : "bg-zinc-800 hover:bg-zinc-700"
              }`}>
              Thread {index + 1}
            </button>
          ))}
        </div>

        <button
          onClick={createNewThread}
          className="bg-blue-600 hover:bg-blue-700 text-sm px-3 py-2 rounded-lg mb-6">
          + New Chat
        </button>

        <div className="text-xs text-zinc-400 uppercase mb-2">Commands</div>

        <div className="space-y-2 text-sm">
          <div className="bg-zinc-800 px-3 py-2 rounded-lg">
            /write-dialogue
          </div>
          <div className="bg-zinc-800 px-3 py-2 rounded-lg">
            /asset-description
          </div>
        </div>

        <div className="mt-auto pt-4 border-t border-zinc-800 text-xs text-zinc-500">
          Temperature: {temperature.toFixed(1)}
          <input
            type="range"
            min="0"
            max="1"
            step="0.1"
            value={temperature}
            onChange={(e) => setTemperature(Number(e.target.value))}
            className="w-full mt-2"
          />
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <div className="flex flex-col flex-1">
        {/* HEADER */}
        <header className="h-16 border-b border-zinc-800 flex items-center justify-between px-6 bg-zinc-950/70 backdrop-blur">
          <div>
            <h1 className="text-xl font-semibold">Studio Assistant</h1>
            <p className="text-xs text-zinc-400">
              AI-powered assistant for narrative & design teams
            </p>
          </div>

          <button
            onClick={exportConversation}
            className="text-xs bg-zinc-800 hover:bg-zinc-700 px-3 py-2 rounded-lg">
            Export
          </button>
        </header>

        {/* CHAT AREA */}
        <div className="flex flex-col flex-1 p-6 overflow-hidden">
          <div className="flex flex-col flex-1 bg-zinc-900/60 backdrop-blur border border-zinc-800 rounded-2xl p-6 shadow-xl overflow-hidden">
            <ChatWindow messages={messages} />
            <ChatInput onSend={sendMessage} loading={loading} />
          </div>
        </div>
      </div>
    </main>
  );
}
