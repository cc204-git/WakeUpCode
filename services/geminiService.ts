import { GoogleGenAI } from "@google/genai";

/**
 * Verifies if a given API key is valid by making a simple request to the Gemini API.
 * @param apiKey The Google Gemini API key to verify.
 * @returns A promise that resolves to true if the key is valid, false otherwise.
 */
export const verifyApiKey = async (apiKey: string): Promise<boolean> => {
  try {
    const ai = new GoogleGenAI({ apiKey });
    // Use a lightweight model and a simple prompt to check for authentication.
    await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: 'hello',
    });
    return true;
  } catch (error) {
    console.error("API Key validation failed:", error);
    return false;
  }
};


export const verifyGoalWithGemini = async (goal: string, imageBase64: string, apiKey: string): Promise<boolean> => {
  if (!apiKey) {
    console.error("API Key not provided for verification.");
    return false;
  }

  const ai = new GoogleGenAI({ apiKey });
  const mimeType = imageBase64.split(';')[0].split(':')[1];
  const pureBase64 = imageBase64.split(',')[1];

  const imagePart = {
    inlineData: {
      mimeType,
      data: pureBase64,
    },
  };

  const prompt = `Analyze the attached image. The user's goal was: '${goal}'. Does this image provide reasonable visual proof that the user has achieved this goal? Your response must be a single word: either YES or NO. Do not provide any other explanation or text.`;
  
  const textPart = {
    text: prompt
  };
  
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: { parts: [imagePart, textPart] },
    });
    
    const verificationResult = response.text.trim().toUpperCase();
    console.log("Gemini Verification Result:", verificationResult);
    return verificationResult === 'YES';
  } catch (error) {
    console.error("Error verifying with Gemini:", error);
    return false;
  }
};