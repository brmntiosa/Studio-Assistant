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
        "You are Studio Assistant, helping game studio teams with writing and design tasks.",
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

Output format:
- Character Mood:
- Dialogue Lines (5 lines):
- Emotional Notes:
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
You are a game designer creating detailed asset descriptions.

Output format:
- Name:
- Short Lore:
- Visual Description:
- Gameplay Effect:
- Rarity Tier:
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
