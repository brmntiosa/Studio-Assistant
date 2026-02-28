import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.AI_API_KEY,
});

export async function generateAIResponse(messages: any[]) {
  try {
    const response = await client.chat.completions.create({
      model: process.env.AI_MODEL || "gpt-4o-mini",
      messages,
      temperature: 0.7,
    });

    return response.choices[0].message.content;
  } catch (error: any) {
    console.error("AI Error:", error);

    if (error.status === 429) {
      throw new Error("Rate limit exceeded");
    }

    if (error.status === 401) {
      throw new Error("Invalid API key");
    }

    throw new Error("AI service unavailable");
  }
}
