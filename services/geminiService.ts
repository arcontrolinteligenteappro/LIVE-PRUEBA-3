
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateTitleForName = async (name: string): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Generate a short, professional title for a lower third for this person or entity: "${name}". 
      For example, for 'Satya Nadella', you could return 'CEO of Microsoft'. Be concise and professional.
      If it's a generic term, provide a relevant description. Example: for 'Local Weather', return '5-Day Forecast'.
      Return only the title text, without any labels or quotes.`,
    });
    
    const text = response.text;
    if (!text) {
        throw new Error('No text in response');
    }
    return text.trim();
  } catch (error) {
    console.error("Error generating title with Gemini:", error);
    return "Error generating title.";
  }
};
