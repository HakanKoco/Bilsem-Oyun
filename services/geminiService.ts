
import { GoogleGenAI, Type, Schema } from "@google/genai";
import { GameSession } from "../types";
import { GAME_GENERATION_PROMPT } from "../constants";

// Define the response schema using the GenAI Type enum
const gameSessionSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    theme: {
      type: Type.OBJECT,
      properties: {
        name: { type: Type.STRING },
        background: { type: Type.STRING },
        primary: { type: Type.STRING },
        musicMood: { type: Type.STRING },
      },
      required: ["background", "primary"],
    },
    levels: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          index: { type: Type.INTEGER },
          pairs: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                source: { type: Type.STRING },
                target: { type: Type.STRING },
              },
              required: ["source", "target"],
            },
          },
          question: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
          },
          options: {
            type: Type.ARRAY,
            items: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
          },
          correct: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
          },
          voiceOver: { type: Type.STRING },
        },
        required: ["index", "pairs", "question", "options", "correct", "voiceOver"],
      },
    },
    coloring: {
      type: Type.OBJECT,
      properties: {
        templateId: { 
          type: Type.STRING,
          enum: ["fish", "lion", "bird", "cat"] 
        },
      },
      required: ["templateId"],
    },
    vocabulary: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          emoji: { type: Type.STRING },
          english: { type: Type.STRING },
        },
        required: ["emoji", "english"],
      },
    },
  },
  required: ["theme", "levels", "coloring", "vocabulary"],
};

export const generateGameSession = async (): Promise<GameSession> => {
  try {
    const apiKey = process.env.API_KEY;
    if (!apiKey) {
      console.warn("No API Key found, using fallback data.");
      throw new Error("API Key missing");
    }

    const ai = new GoogleGenAI({ apiKey });
    
    // We use gemini-2.5-flash for fast, structured JSON generation
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: GAME_GENERATION_PROMPT,
      config: {
        responseMimeType: "application/json",
        responseSchema: gameSessionSchema,
        temperature: 1.0, 
      },
    });

    const text = response.text;
    if (!text) {
        throw new Error("Empty response from AI");
    }

    const sessionData = JSON.parse(text) as GameSession;
    return sessionData;

  } catch (error) {
    console.error("Failed to generate game session:", error);
    throw error;
  }
};
