
import React from "react";
import { cn } from "@/lib/utils";
import { Avatar } from "@/components/ui/avatar";
import { Message } from "@/lib/gemini-ai";

interface ChatMessageProps {
  message: Message;
  isLast: boolean;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message, isLast }) => {
  const isUser = message.role === "user";
  
  return (
    <div
      className={cn(
        "group flex w-full items-start gap-2 sm:gap-4 px-4",
        isUser ? "justify-end" : "justify-start",
        isLast && "mb-4"
      )}
    >
      {!isUser && (
        <Avatar className="mt-1 h-8 w-8 bg-primary/20 text-primary-foreground shadow-sm border border-primary/20">
          <span className="text-lg">🤖</span>
        </Avatar>
      )}

      <div
        className={cn(
          "relative max-w-[80%] sm:max-w-[70%] rounded-2xl px-4 py-3 text-sm sm:text-base",
          isUser
            ? "user-message-bubble bg-primary text-primary-foreground animate-fade-up"
            : "ai-message-bubble bg-secondary text-secondary-foreground animate-fade-up",
          isLast && "animate-scale"
        )}
      >
        <div className="whitespace-pre-wrap break-words">{message.content}</div>
      </div>

      {isUser && (
        <Avatar className="mt-1 h-8 w-8 bg-primary text-primary-foreground shadow-sm">
          <span className="text-lg">👤</span>
        </Avatar>
      )}
    </div>
  );
};

export default ChatMessage;
