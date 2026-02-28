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

Generate high-quality in-game dialogue.

Return output strictly in clean Markdown format.

Structure:

## Character Mood
(1 short paragraph)

## Dialogue Lines
- Line 1
- Line 2
- Line 3
- Line 4
- Line 5

## Emotional Notes
- Bullet point
- Bullet point
- Bullet point

Do not add extra sections.
Do not explain anything outside this format.
Do not use numbered lists.
Use bullet points only.
      `,
    },
    {
      role: "user",
      content: `
Character: ${character}
Scenario: ${scenario}
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
