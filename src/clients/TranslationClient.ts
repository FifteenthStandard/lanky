import { GoogleGenAI } from '@google/genai';

export default async function suggestTranslation(apiKey: string, englishText: string, renewApiKey: () => Promise<string>): Promise<{ hanzi: string, jyutping: string, pinyin: string }> {
  try {
    return await suggestTranslationInner(apiKey, englishText);
  } catch (error) {
    apiKey = await renewApiKey();
    return await suggestTranslationInner(apiKey, englishText);
  }
};

async function suggestTranslationInner(apiKey: string, englishText: string): Promise<{ hanzi: string, jyutping: string, pinyin: string }> {
  const ai = new GoogleGenAI({ apiKey });
  const prompt = `
    You are a Cantonese translation assistant for Guangzhou Cantonese.
    Translate the following English term into:
    1. Simplified Hanzi
    2. Jyutping
    3. Raw keyboard Pinyin (no tone marks/accents)

    Text: "${englishText}"
    Return strictly JSON with keys: hanzi, jyutping, pinyin.
  `;

  const response = await ai.models.generateContent({
    model: 'gemini-3.5-flash-lite',
    contents: prompt,
    config: {
      responseMimeType: 'application/json'
    }
  });

  return JSON.parse(response.text || '{}');
};
