import { NextResponse } from "next/server";
import { generateAIResponse } from "@/lib/ai";
import { parseCommand } from "@/lib/commands";
import { buildPrompt } from "@/lib/prompt-builder";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    if (!body.messages || !Array.isArray(body.messages)) {
      return NextResponse.json(
        { error: "Messages array is required" },
        { status: 400 },
      );
    }

    const MAX_HISTORY = 10;
    const trimmedHistory = body.messages.slice(-MAX_HISTORY);

    const lastMessage = trimmedHistory[trimmedHistory.length - 1];

    if (!lastMessage || typeof lastMessage.content !== "string") {
      return NextResponse.json(
        { error: "Invalid last message content" },
        { status: 400 },
      );
    }

    if (!lastMessage || lastMessage.role !== "user") {
      return NextResponse.json(
        { error: "Last message must be from user" },
        { status: 400 },
      );
    }

    const parsed = parseCommand(lastMessage.content);

    if (parsed.type === "write-dialogue" && parsed.args.length < 2) {
      return NextResponse.json(
        { error: "Usage: /write-dialogue [character] [scenario]" },
        { status: 400 },
      );
    }
    const systemPromptMessages = buildPrompt(parsed);
    const previousHistory = trimmedHistory
      .slice(0, -1)
      .filter(
        (msg: any) =>
          typeof msg.content === "string" && msg.content.trim() !== "",
      )
      .map((msg: any) => ({
        role: msg.role,
        content: msg.content,
      }));

    const finalMessages = [
      ...systemPromptMessages,
      ...previousHistory,
      {
        role: "user",
        content: lastMessage.content,
      },
    ];
    const reply = await generateAIResponse(finalMessages);

    return NextResponse.json({ reply });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 },
    );
  }
}
