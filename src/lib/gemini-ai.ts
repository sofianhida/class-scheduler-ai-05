
import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from "@google/generative-ai";

// Direct API key usage for frontend demo only
// In production, use server-side implementation with proper API key handling
const API_KEY = "AIzaSyBeb1-8YHFEcB2SrJ2WghxtgDw7E7HBRFw";

const genAI = new GoogleGenerativeAI(API_KEY);

// Configuration options for the Gemini model
const generationConfig = {
  temperature: 0.8,
  topP: 0.95,
  topK: 40,
  maxOutputTokens: 8192,
  responseMimeType: "text/plain",
};

// The model to use
const MODEL_NAME = "gemini-2.0-flash";

// Context for the AI assistant
const SYSTEM_INSTRUCTION = `
You are an AI assistant for students, helping them find study materials and schedule classes.
Be friendly, concise, and helpful.

Your capabilities include:
1. Finding study materials and resources for different subjects
2. Providing tips for effective studying
3. Suggesting optimal class schedules
4. Answering academic questions
5. Offering advice on time management for students

When suggesting study materials, be specific about book titles, online resources, and other relevant materials.
When helping with scheduling, consider factors like breaks between classes, study time, and prioritizing difficult subjects.

Provide actionable, practical advice that students can implement immediately.
Be conversational but professional. Keep responses brief but informative.
`;

export interface Message {
  role: "user" | "model";
  content: string;
}

export interface ChatSession {
  sendMessage: (message: string) => Promise<{ text: string; done: boolean }>;
  getHistory: () => Message[];
}

export const createChatSession = (history: Message[] = []): ChatSession => {
  const model = genAI.getGenerativeModel({ model: MODEL_NAME });
  
  // Filter history to match Gemini's format, ensuring it's not empty and starts with a user message
  let geminiHistory = [];
  
  if (history.length > 0) {
    // If the first message in history is from the model, we need to adjust
    if (history[0].role === "model") {
      // We'll skip using the welcome message in the Gemini chat history
      // It will be handled by our frontend
      const userMessages = history.filter(msg => msg.role === "user");
      if (userMessages.length > 0) {
        geminiHistory = history
          .filter((_, index) => index > 0) // Skip the first (welcome) message
          .map(msg => ({
            role: msg.role === "user" ? "user" : "model",
            parts: [{ text: msg.content }],
          }));
      }
    } else {
      // Normal case: first message is already from user
      geminiHistory = history.map(msg => ({
        role: msg.role === "user" ? "user" : "model",
        parts: [{ text: msg.content }],
      }));
    }
  }
  
  // Start the chat with system instructions
  const chat = model.startChat({
    generationConfig,
    history: geminiHistory,
    systemInstruction: SYSTEM_INSTRUCTION,
  });
  
  // Keep local chat history
  const chatHistory: Message[] = [...history];
  
  return {
    sendMessage: async (message: string) => {
      try {
        // Add user message to history
        chatHistory.push({ role: "user", content: message });
        
        // Send message to Gemini
        const result = await chat.sendMessage(message);
        const response = result.response;
        const responseText = response.text();
        
        // Add AI response to history
        chatHistory.push({ role: "model", content: responseText });
        
        return { text: responseText, done: true };
      } catch (error) {
        console.error("Error sending message to Gemini:", error);
        return { 
          text: "I'm having trouble processing your request. Please try again later.", 
          done: true 
        };
      }
    },
    getHistory: () => chatHistory,
  };
};
