
import React, { useState, useRef, useEffect } from "react";
import { createChatSession, Message } from "@/lib/gemini-ai";
import ChatMessage from "@/components/ChatMessage";
import ChatInput from "@/components/ChatInput";
import TypingIndicator from "@/components/TypingIndicator";
import { Button } from "@/components/ui/button";
import { RefreshCwIcon } from "lucide-react";
import { toast } from "sonner";

interface ChatUIProps {
  initialMessages?: Message[];
}

const WELCOME_MESSAGE: Message = {
  role: "model",
  content: "Hi there! I'm your AI study assistant. I can help you find study materials and schedule your classes. What would you like help with today?"
};

const ChatUI: React.FC<ChatUIProps> = ({ initialMessages = [] }) => {
  const [messages, setMessages] = useState<Message[]>([
    WELCOME_MESSAGE,
    ...initialMessages,
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [chatSession, setChatSession] = useState(() => createChatSession([WELCOME_MESSAGE]));
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (content: string) => {
    if (isLoading) return;

    // Add user message immediately
    const userMessage: Message = { role: "user", content };
    setMessages(prev => [...prev, userMessage]);
    
    // Set loading state
    setIsLoading(true);
    
    try {
      // Send to Gemini API
      const response = await chatSession.sendMessage(content);
      
      // Add AI response
      if (response.done) {
        setMessages(prev => [
          ...prev, 
          { role: "model", content: response.text }
        ]);
      }
    } catch (error) {
      console.error("Error in chat:", error);
      toast.error("Something went wrong. Please try again.");
      
      // Add error message
      setMessages(prev => [
        ...prev,
        { 
          role: "model", 
          content: "I'm sorry, I encountered an error. Please try again." 
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    const newSession = createChatSession([WELCOME_MESSAGE]);
    setChatSession(newSession);
    setMessages([WELCOME_MESSAGE]);
    toast.success("Chat has been reset");
  };

  return (
    <div className="flex h-full flex-col max-w-2xl mx-auto">
      <div className="flex items-center justify-between gap-2 border-b border-border/40 p-4">
        <div className="flex items-center gap-2">
          <div className="rounded-full bg-primary/10 p-1">
            <div className="h-7 w-7 rounded-full bg-primary/90 flex items-center justify-center">
              <span className="text-primary-foreground text-lg">🎓</span>
            </div>
          </div>
          <h1 className="text-lg font-semibold">Study Buddy AI</h1>
        </div>
        <Button variant="ghost" size="icon" onClick={handleReset} title="Reset chat">
          <RefreshCwIcon className="h-4 w-4" />
          <span className="sr-only">Reset chat</span>
        </Button>
      </div>
      
      <div 
        ref={messagesContainerRef}
        className="flex-1 overflow-y-auto py-4 scroll-hidden"
      >
        {messages.map((message, index) => (
          <ChatMessage
            key={index}
            message={message}
            isLast={index === messages.length - 1}
          />
        ))}
        
        {isLoading && <TypingIndicator />}
        
        <div ref={messagesEndRef} />
      </div>
      
      <div className="border-t border-border/40 p-4">
        <ChatInput 
          onSend={handleSendMessage} 
          isLoading={isLoading} 
        />
      </div>
    </div>
  );
};

export default ChatUI;
