import { Message } from "@/types/chat";
import clsx from "clsx";

interface Props {
  message: Message;
}

export default function MessageBubble({ message }: Props) {
  const isUser = message.role === "user";

  return (
    <div
      className={clsx(
        "max-w-[75%] px-4 py-3 rounded-xl text-sm whitespace-pre-wrap",
        isUser ? "ml-auto bg-blue-600 text-white" : "bg-zinc-800 text-zinc-200",
      )}>
      {message.content}
    </div>
  );
}
