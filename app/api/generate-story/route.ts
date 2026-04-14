import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_API_KEY || "");

export async function POST(req: Request) {
  try {
    const apiKey = process.env.GOOGLE_GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "Missing GOOGLE_GEMINI_API_KEY in environment" }, { status: 500 });
    }

    const { loc, job, event } = await req.json();

    const prompt = `Create a 1-2 paragraph humor-filled story set in GTA VI's state of Leonida.
    Location: ${loc || 'Vice City'}
    Character Background: ${job || 'Hustler'}
    Inciting Incident: ${event || 'Deal Gone South'}
    
    The tone must be Rockstar Games aesthetic: satirical, gritty, over-the-top, and hilarious.
    Use Leonida-specific markers (neon, humidity, Gators, social media obsession).
    The story should feel like a random encounter or a mission intro from a GTA game.
    Keep it to exactly one or two short, punchy paragraphs.`;

    const modelIds = ['gemini-2.0-flash-lite', 'gemini-2.5-flash', 'gemini-2.0-flash'];
    let lastError = null;

    for (let attempts = 0; attempts < 2; attempts++) {
      for (const modelId of modelIds) {
        try {
          console.log(`[Attempt ${attempts + 1}] Trying story with model: ${modelId}`);
          const currentModel = genAI.getGenerativeModel({ model: modelId });
          const result = await currentModel.generateContent(prompt);
          const response = await result.response;
          const text = response.text();
          
          if (text) {
            console.log(`Successfully generated story with ${modelId}`);
            return NextResponse.json({ story: text });
          }
        } catch (err: any) {
          console.warn(`Model ${modelId} failed: ${err.message}`);
          lastError = err;
          // If 503 or 429, wait a brief second before hitting the next model to avoid spamming the network
          if (err.message?.includes('503') || err.message?.includes('429')) {
             await new Promise(resolve => setTimeout(resolve, 1000));
          }
        }
      }
    }

    throw lastError || new Error("All models failed to respond");

  } catch (error: any) {
    console.error("Gemini API Error:", error);
    return NextResponse.json({ 
      error: "Failed to generate story after multiple attempts", 
      details: error.message || String(error) 
    }, { status: 500 });
  }
}
