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

// Context for the AI assistant - formatted as required by Gemini
const SYSTEM_INSTRUCTION = {
  role: "system",
  parts: [{
    text: "You are an AI assistant for students, helping them find study materials and schedule classes. Be friendly, concise, and helpful. Your capabilities include finding study materials, providing tips for effective studying, suggesting optimal class schedules, answering academic questions, and offering advice on time management. When suggesting study materials, be specific about book titles, online resources, and other relevant materials. When helping with scheduling, consider factors like breaks between classes, study time, and prioritizing difficult subjects. Provide actionable, practical advice that students can implement immediately. Be conversational but professional. Keep responses brief but informative."
  }]
};

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
  
  // Keep local chat history
  const chatHistory: Message[] = [...history];
  
  // When starting a chat with Gemini, we need to make sure history is properly formatted
  // and the first message is from a user if we're providing history
  let geminiHistory = [];
  
  if (history.length > 0) {
    // Filter history to match Gemini's format
    // The API requires that the first message must be from a user
    const userMessages = history.filter(msg => msg.role === "user");
    
    if (userMessages.length > 0) {
      // Skip any initial model messages and start with the first user message
      let startProcessing = false;
      geminiHistory = history
        .filter(msg => {
          if (msg.role === "user" && !startProcessing) {
            startProcessing = true;
          }
          return startProcessing;
        })
        .map(msg => ({
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
