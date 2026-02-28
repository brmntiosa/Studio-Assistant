import { NextResponse } from "next/server";
import { generateAIResponse } from "@/lib/ai";
import { parseCommand } from "@/lib/commands";
import { buildPrompt } from "@/lib/prompt-builder";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    if (!body.message) {
      return NextResponse.json(
        { error: "Message is required" },
        { status: 400 },
      );
    }

    const parsed = parseCommand(body.message);
    const messages = buildPrompt(parsed);

    const reply = await generateAIResponse(messages);

    return NextResponse.json({ reply });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 },
    );
  }
}
