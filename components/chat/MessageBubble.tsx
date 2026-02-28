import { Message } from "@/types/chat";
import clsx from "clsx";
import ReactMarkdown from "react-markdown";

interface Props {
  message: Message;
}

export default function MessageBubble({ message }: Props) {
  const isUser = message.role === "user";

  return (
    <div
      className={clsx(
        "max-w-[80%] px-4 py-3 rounded-2xl text-sm",
        isUser
          ? "ml-auto bg-blue-600 shadow-md"
          : "bg-zinc-800/80 border border-zinc-700",
      )}>
      <ReactMarkdown
        components={{
          h2: ({ children }) => (
            <h2 className="text-lg font-semibold mt-4 mb-2 text-blue-400">
              {children}
            </h2>
          ),
          p: ({ children }) => (
            <p className="mb-3 leading-relaxed">{children}</p>
          ),
          li: ({ children }) => (
            <li className="ml-4 list-disc mb-1">{children}</li>
          ),
        }}>
        {message.content}
      </ReactMarkdown>
    </div>
  );
}
