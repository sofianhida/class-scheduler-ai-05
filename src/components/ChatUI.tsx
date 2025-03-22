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
  content: "Hello! I'm your specialized study assistant. I can help you with: 1) Finding textbooks and study resources, 2) Optimizing your class schedule, 3) Learning effective study techniques, and 4) Managing your study time efficiently. How can I assist you today?"
};

const ChatUI: React.FC<ChatUIProps> = ({ initialMessages = [] }) => {
  // Initialize messages state with welcome message for UI display only
  const [messages, setMessages] = useState<Message[]>([
    WELCOME_MESSAGE,
    ...initialMessages,
  ]);
  const [isLoading, setIsLoading] = useState(false);
  
  // Initialize chat session with an empty history - we'll handle the actual messages separately
  const [chatSession, setChatSession] = useState(() => createChatSession([]));
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (content: string) => {
    if (isLoading) return;

    // Add user message immediately to UI
    const userMessage: Message = { role: "user", content };
    setMessages(prev => [...prev, userMessage]);
    
    // Set loading state
    setIsLoading(true);
    
    try {
      // Send to Gemini API
      const response = await chatSession.sendMessage(content);
      
      // Add AI response to UI
      if (response.done) {
        setMessages(prev => [
          ...prev, 
          { role: "model", content: response.text }
        ]);
      }
    } catch (error) {
      console.error("Error in chat:", error);
      toast.error("Something went wrong. Please try again.");
      
      // Add error message to UI
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
    // Create a new chat session
    const newSession = createChatSession([]);
    setChatSession(newSession);
    
    // Reset UI messages with welcome message
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
