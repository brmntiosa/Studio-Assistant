export type CommandType = "write-dialogue" | "asset-description" | "chat";

export interface ParsedCommand {
  type: CommandType;
  args: string[];
  rawInput: string;
}

export function parseCommand(input: string): ParsedCommand {
  if (!input.startsWith("/")) {
    return {
      type: "chat",
      args: [],
      rawInput: input,
    };
  }

  const parts = input.trim().split(" ");
  const command = parts[0].replace("/", "");
  const args = parts.slice(1);

  switch (command) {
    case "write-dialogue":
      return {
        type: "write-dialogue",
        args,
        rawInput: input,
      };

    case "asset-description":
      return {
        type: "asset-description",
        args,
        rawInput: input,
      };

    default:
      return {
        type: "chat",
        args: [],
        rawInput: input,
      };
  }
}
