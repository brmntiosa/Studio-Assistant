import { ParsedCommand } from "./commands";

export function buildPrompt(parsed: ParsedCommand) {
  switch (parsed.type) {
    case "write-dialogue":
      return buildDialoguePrompt(parsed.args);

    case "asset-description":
      return buildAssetPrompt(parsed.args);

    default:
      return buildDefaultPrompt(parsed.rawInput);
  }
}

function buildDefaultPrompt(input: string) {
  return [
    {
      role: "system",
      content:
        "You are Studio Assistant, helping game studio teams with writing and design tasks.\nDo not use numbered lists.\nUse bullet points only.",
    },
    {
      role: "user",
      content: input,
    },
  ];
}

function buildDialoguePrompt(args: string[]) {
  const [character = "Unknown", ...scenarioParts] = args;
  const scenario = scenarioParts.join(" ");

  return [
    {
      role: "system",
      content: `
You are a senior narrative designer in a AAA game studio.

Generate a cinematic in-game dialogue scene.

The dialogue should feel intense, immersive, and suitable for a story-driven game.

Important Rules:
- The main character is "${character}".
- The scene may include one opposing character if dramatically appropriate.
- Keep the exchange tight and emotionally charged.
- Do NOT exceed 8 total dialogue lines.
- Do NOT include narration outside of the specified sections.
- Do NOT use numbered lists.
- Use bullet points only where required.

Return output strictly in clean Markdown format.

Structure:

## Scene Context
(1 short paragraph describing the emotional situation)

## Dialogue Exchange
- Character Name: "Line"
- Character Name: "Line"
- Character Name: "Line"
- Character Name: "Line"
- Character Name: "Line"

## Emotional Subtext
- Bullet point
- Bullet point
- Bullet point

Do not add extra sections.
Do not add explanations outside this format.
      `,
    },
    {
      role: "user",
      content: `
Main Character: ${character}
Scenario: ${scenario}
Tone: Dramatic confrontation
      `,
    },
  ];
}

function buildAssetPrompt(args: string[]) {
  const [type = "item", style = "fantasy", rarity = "rare"] = args;

  return [
    {
      role: "system",
      content: `
You are a professional game designer.

Generate a detailed asset description.

Return output strictly in clean Markdown format.

Structure:

## Name

## Short Lore
(2-3 sentences)

## Visual Description
(1 paragraph)

## Gameplay Effect
(1 paragraph)

## Rarity Tier

Do not add extra commentary.
Do not use numbered lists.
Use bullet points only.
      `,
    },
    {
      role: "user",
      content: `
Asset Type: ${type}
Style: ${style}
Rarity: ${rarity}
      `,
    },
  ];
}
