import { GoogleGenAI, Chat } from "@google/genai";

let ai: GoogleGenAI | null = null;
let chatSession: Chat | null = null;

const getAiInstance = () => {
  if (!ai) {
    // In a real production app, you should proxy this through a backend to hide the key.
    // For this frontend-only demo, we assume process.env.API_KEY is available.
    const apiKey = process.env.API_KEY || 'mock-key';
    ai = new GoogleGenAI({ apiKey });
  }
  return ai;
};

export const initializeChat = async (systemInstruction: string) => {
  const instance = getAiInstance();
  chatSession = instance.chats.create({
    model: 'gemini-2.5-flash',
    config: {
      systemInstruction,
    },
  });
  return chatSession;
};

export const sendMessageToBot = async (message: string) => {
  if (!chatSession) {
    await initializeChat("You are a helpful business assistant.");
  }
  
  if (!chatSession) throw new Error("Chat session not initialized");

  try {
    const result = await chatSession.sendMessageStream({ message });
    return result;
  } catch (error) {
    console.error("Error sending message to Gemini:", error);
    throw error;
  }
};