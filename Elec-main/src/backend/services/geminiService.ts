import { GoogleGenAI, ThinkingLevel } from "@google/genai";

const SYSTEM_PROMPT = `
You are ElectIQ, a friendly and knowledgeable civic education assistant.
You help users understand election processes, voting procedures, and civic rights worldwide.
Always be accurate, strictly non-partisan, and encourage civic participation.
Tailor answers to the user's country and jurisdiction when provided.
Keep answers clear, jargon-free, and engaging.
Use bullet points and structure when helpful.
Never express political opinions or favor any party, candidate, or ideology.
`;

const ai = process.env.GEMINI_API_KEY ? new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY }) : null;

export const streamChat = async function* (messages: any[], context: any = {}) {
  if (!ai) {
    yield "Gemini API key is not configured.";
    return;
  }

  let contextStr = "";
  if (context.country) contextStr += `\\nUser country: ${context.country}`;
  if (context.phase) contextStr += `\\nCurrently viewing election phase: ${context.phase}`;
  if (context.guide_step) contextStr += `\\nCurrently on voting guide step: ${context.guide_step}`;

  // Process history for Google GenAI SDK (requires "user" or "model" roles)
  const contents = messages.map(msg => ({
    role: msg.role === "user" ? "user" : "model",
    parts: [{ text: msg.content }]
  }));

  if (contextStr && contents.length > 0) {
    const last = contents[contents.length - 1];
    if (last.role === "user") {
      last.parts[0].text = `${contextStr}\\n\\n${last.parts[0].text}`;
    }
  }

  const responseStream = await ai.models.generateContentStream({
    model: "gemini-3.1-pro-preview",
    contents: contents,
    config: {
      systemInstruction: SYSTEM_PROMPT,
      temperature: 0.7,
      topP: 0.9,
      maxOutputTokens: 1024,
      thinkingConfig: { thinkingLevel: ThinkingLevel.HIGH }
    }
  });

  for await (const chunk of responseStream) {
    if (chunk.text) {
      yield chunk.text;
    }
  }
};
