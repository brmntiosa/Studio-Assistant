"use client";

import { useState } from "react";
import { Message } from "@/types/chat";
import ChatWindow from "@/components/chat/ChatWindow";
import ChatInput from "@/components/chat/ChatInput";
import { v4 as uuidv4 } from "uuid";

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);

  const sendMessage = async (content: string) => {
    const userMessage: Message = {
      id: uuidv4(),
      role: "user",
      content,
    };

    setMessages((prev) => [...prev, userMessage]);
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: content }),
      });

      const data = await res.json();

      const assistantMessage: Message = {
        id: uuidv4(),
        role: "assistant",
        content: data.reply || data.error || "Something went wrong",
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          id: uuidv4(),
          role: "assistant",
          content: "Error connecting to server.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen bg-zinc-950 text-white">
      <div className="flex flex-col w-full max-w-4xl mx-auto p-6">
        <header className="mb-6">
          <h1 className="text-3xl font-bold">🎮 Studio Assistant</h1>
          <p className="text-zinc-400 mt-2">
            AI-powered internal assistant for narrative & design teams
          </p>
        </header>

        <div className="flex flex-col flex-1 border border-zinc-800 rounded-xl p-4">
          <ChatWindow messages={messages} />
          <ChatInput onSend={sendMessage} loading={loading} />
        </div>
      </div>
    </main>
  );
}
