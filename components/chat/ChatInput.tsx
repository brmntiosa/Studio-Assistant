"use client";

import { useState } from "react";

interface Props {
  onSend: (message: string) => void;
  loading: boolean;
}

export default function ChatInput({ onSend, loading }: Props) {
  const [input, setInput] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    onSend(input);
    setInput("");
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex gap-2 border-t border-zinc-800 pt-4">
      <input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Type your message..."
        className="flex-1 bg-zinc-900 border border-zinc-700 rounded-lg px-4 py-2 text-sm focus:outline-none"
      />

      <button
        type="submit"
        disabled={loading}
        className="bg-blue-600 px-4 py-2 rounded-lg text-sm disabled:opacity-50">
        {loading ? "Thinking..." : "Send"}
      </button>
    </form>
  );
}
