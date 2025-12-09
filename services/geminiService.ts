import { GoogleGenAI, Chat, GenerateContentResponse } from "@google/genai";

const CONSULTATION_SYSTEM_INSTRUCTION = `
You are a world-class professional hair colorist and Visagismo expert working for Beatriz Bittencourt Professional.
Your goal is to provide a personal hair color consultation based on the client's features (Visagismo).
1. Be concise, professional, and encouraging.
2. Ask the user about their current hair color, eye color, skin tone, and hair history.
3. Use Visagismo principles to recommend shades that enhance their natural features (e.g., "For your warm skin tone, I suggest a Golden Brown to add radiance").
4. Recommend specific types of products (e.g., Ammonia-free, acidic gloss, permanent coverage).
5. If they ask about shades, suggest specific tones (e.g., "7.1 Cool Blonde", "5.3 Golden Brown").
6. Keep responses short (under 100 words) to fit a mobile chat interface.
`;

let ai: GoogleGenAI | null = null;
const getAiClient = (): GoogleGenAI => {
  if (!ai) {
    const apiKey = process.env.API_KEY || '';
    if (!apiKey) {
      // This will be visible in the browser console if the key is missing.
      console.error("Gemini API Key is not configured. Please set the API_KEY environment variable.");
    }
    ai = new GoogleGenAI({ apiKey });
  }
  return ai;
};

let chatSession: Chat | null = null;

export const startChatSession = () => {
  const client = getAiClient();
  chatSession = client.chats.create({
    model: 'gemini-2.5-flash',
    config: {
      systemInstruction: CONSULTATION_SYSTEM_INSTRUCTION,
    },
  });
};

export const sendMessageToGemini = async (message: string): Promise<string> => {
  if (!chatSession) {
    startChatSession();
  }
  
  try {
    const result: GenerateContentResponse = await chatSession!.sendMessage({ message });
    return result.text || "I apologize, I couldn't generate a recommendation at this moment.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    // Check if the error is due to a missing API key and provide a user-friendly message.
    if (error instanceof Error && error.message.includes('API key')) {
      return "The consultation service is temporarily unavailable. Please ensure the API key is configured correctly."
    }
    return "Unable to connect to the professional consultation service. Please check your connection.";
  }
};