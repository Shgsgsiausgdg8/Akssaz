import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

export const generateOrEditImage = async (
  prompt: string,
  inputImageBase64?: string,
  mimeType: string = 'image/png'
): Promise<{ text?: string; imageBase64?: string }> => {
  try {
    const model = 'gemini-2.5-flash-image';
    
    const systemContext = `
    ROLE: You are "Emerald AI", a world-class creative AI artist and photo editor designed by Majed Savari (Emerald Team).
    
    IDENTITY:
    - Creator: Majed Savari (ماجد سواری)
    - Team: Emerald Team (تیم زمرد)
    - Tone: Sophisticated, Artistic, Minimal, Friendly, and "Cool".
    - Language: Persian (Farsi) primarily.
    
    CAPABILITIES:
    1. IMAGE GENERATION:
       - Create breathtaking, high-quality, cinematic, and artistic images based on user prompts.
       - Styles: Cyberpunk, Minimalist, Luxury, Photorealistic, Abstract Art.
    
    2. IMAGE EDITING:
       - If the user provides an image, enhance it with professional grading.
       - Apply "Emerald Style" (clean, sharp, slight green/teal tint in shadows if appropriate, cinematic lighting).
       - Follow specific user instructions for editing (e.g., "remove background", "make it snowy", "turn into a cartoon").
    
    3. INTERACTION:
       - Keep responses short, punchy, and stylish. 
       - Don't write long paragraphs unless asked. 
       - Use emojis sparingly but effectively (💎, ✨, 🎨).
       - Always credit the creativity to the user's idea + Emerald's execution.

    User Request: "${prompt}"
    `;

    const parts: any[] = [];

    if (inputImageBase64) {
      parts.push({
        inlineData: {
          data: inputImageBase64,
          mimeType: mimeType,
        },
      });
      parts.push({
        text: systemContext + "\n\n[INSTRUCTION: The user has provided an image. Edit it creatively based on the prompt or enhance its quality if no prompt is given.]"
      });
    } else {
       parts.push({
        text: systemContext + "\n\n[INSTRUCTION: Generate a stunning image or provide a creative text response based on the prompt.]"
      });
    }

    const response = await ai.models.generateContent({
      model: model,
      contents: {
        parts: parts,
      },
    });

    let outputText = '';
    let outputImage = undefined;

    if (response.candidates && response.candidates[0].content && response.candidates[0].content.parts) {
        for (const part of response.candidates[0].content.parts) {
            if (part.text) {
                outputText += part.text;
            }
            if (part.inlineData) {
                outputImage = part.inlineData.data;
            }
        }
    }

    return {
      text: outputText,
      imageBase64: outputImage
    };

  } catch (error: any) {
    console.error("Gemini API Error:", error);
    throw new Error(error.message || "متاسفانه ارتباط با هسته مرکزی زمرد برقرار نشد.");
  }
};