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

    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: updatedMessages.map((m) => ({
            role: m.role,
            content: m.content,
          })),
        }),
      });

      const raw = await res.text();
      console.debug("[chat] response status:", res.status, res.statusText);
      console.debug("[chat] raw response body:", raw);

      let data: { reply?: string; error?: string } = {};
      try {
        data = raw ? JSON.parse(raw) : {};
      } catch (parseError) {
        console.error("[chat] failed to parse JSON response:", parseError);
      }

      console.debug("[chat] parsed response:", data);

      if (!res.ok) {
        throw new Error(
          data.error || `Request failed with status ${res.status}`,
        );
      }

      const assistantMessage: Message = {
        id: uuidv4(),
        role: "assistant",
        content: data.reply || "No reply from server.",
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error("[chat] sendMessage error:", error);
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
