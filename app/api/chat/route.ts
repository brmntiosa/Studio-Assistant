import { NextResponse } from "next/server";
import { generateAIResponse } from "@/lib/ai";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    if (!body.message) {
      return NextResponse.json(
        { error: "Message is required" },
        { status: 400 },
      );
    }

    const messages = [
      {
        role: "system",
        content:
          "You are Studio Assistant, an AI helping game studio teams with writing and design tasks.",
      },
      {
        role: "user",
        content: body.message,
      },
    ];

    const reply = await generateAIResponse(messages);

    return NextResponse.json({ reply });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 },
    );
  }
}
