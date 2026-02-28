import { NextResponse } from "next/server";
import { parseCommand } from "@/lib/commands";
import { buildPrompt } from "@/lib/prompt-builder";
import { streamAIResponse } from "@/lib/ai";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // 🔹 Validate messages
    if (!body.messages || !Array.isArray(body.messages)) {
      return NextResponse.json(
        { error: "Messages array is required" },
        { status: 400 },
      );
    }

    const temperature =
      typeof body.temperature === "number" ? body.temperature : 0.7;

    // 🔹 Limit history (token safety)
    const MAX_HISTORY = 10;
    const trimmedHistory = body.messages.slice(-MAX_HISTORY);

    const lastMessage = trimmedHistory[trimmedHistory.length - 1];

    if (
      !lastMessage ||
      lastMessage.role !== "user" ||
      typeof lastMessage.content !== "string"
    ) {
      return NextResponse.json(
        { error: "Last message must be a valid user message" },
        { status: 400 },
      );
    }

    // 🔹 Parse command
    const parsed = parseCommand(lastMessage.content);

    if (parsed.type === "write-dialogue" && parsed.args.length < 2) {
      return NextResponse.json(
        {
          error: "Usage: /write-dialogue [character] [scenario]",
        },
        { status: 400 },
      );
    }

    // 🔹 Build system prompt
    const systemPromptMessages = buildPrompt(parsed);

    // 🔹 Sanitize previous history
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

    // 🔹 Final messages sent to AI
    const finalMessages = [
      ...systemPromptMessages,
      ...previousHistory,
      {
        role: "user",
        content: lastMessage.content,
      },
    ];

    // 🔹 Call OpenAI streaming
    const stream = await streamAIResponse(finalMessages, temperature);

    const encoder = new TextEncoder();

    return new Response(
      new ReadableStream({
        async start(controller) {
          try {
            for await (const chunk of stream) {
              const content = chunk.choices?.[0]?.delta?.content || "";

              if (content) {
                controller.enqueue(encoder.encode(content));
              }
            }
          } catch (streamError) {
            controller.enqueue(
              encoder.encode("\n\n[Streaming error occurred]"),
            );
          } finally {
            controller.close();
          }
        },
      }),
      {
        headers: {
          "Content-Type": "text/plain; charset=utf-8",
          "Cache-Control": "no-cache",
          Connection: "keep-alive",
        },
      },
    );
  } catch (error: any) {
    return NextResponse.json(
      {
        error: error?.message || "Internal streaming error",
      },
      { status: 500 },
    );
  }
}
