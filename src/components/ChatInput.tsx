
import React, { useState, useRef, useEffect } from "react";
import { SendIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

interface ChatInputProps {
  onSend: (message: string) => void;
  isLoading: boolean;
  placeholder?: string;
}

const ChatInput: React.FC<ChatInputProps> = ({ 
  onSend, 
  isLoading,
  placeholder = "Ask about study materials or class schedules..." 
}) => {
  const [message, setMessage] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "48px";
      const scrollHeight = textareaRef.current.scrollHeight;
      textareaRef.current.style.height = Math.min(scrollHeight, 120) + "px";
    }
  }, [message]);

  const handleSubmit = () => {
    if (message.trim() && !isLoading) {
      onSend(message.trim());
      setMessage("");
      if (textareaRef.current) {
        textareaRef.current.style.height = "48px";
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="relative mt-2 w-full bg-background">
      <div className="glass-effect absolute inset-0 opacity-20 rounded-2xl" />
      <div className="relative p-1 flex items-end rounded-2xl border border-input/50 shadow-sm bg-background/80 backdrop-blur-sm">
        <Textarea
          ref={textareaRef}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="min-h-12 resize-none border-0 p-3 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 placeholder:text-muted-foreground/70"
          disabled={isLoading}
        />
        <Button
          type="submit"
          size="icon"
          className={`mb-2 mr-2 h-9 w-9 shrink-0 rounded-full transition-all ${
            !message.trim() || isLoading ? "opacity-70" : "opacity-100 animate-fade-in"
          }`}
          disabled={!message.trim() || isLoading}
          onClick={handleSubmit}
        >
          <SendIcon className="h-4 w-4" />
          <span className="sr-only">Send</span>
        </Button>
      </div>
    </div>
  );
};

export default ChatInput;
