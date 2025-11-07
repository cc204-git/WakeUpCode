// Fix: Removed reference to "vite/client" which was causing a "Cannot find type definition file" error.
import { GoogleGenAI } from "@google/genai";

// Fix: Removed verifyApiKey function. As per guidelines, the API key is assumed to be valid
// from the environment variables, so client-side verification is not needed.

// Fix: Updated verifyGoalWithGemini to source the API key from environment variables,
// removing the apiKey parameter to align with security best practices and guidelines.
export const verifyGoalWithGemini = async (goal: string, imageBase64: string): Promise<boolean> => {
  // Fix: API key is now sourced from environment variables. A check is added to ensure it's set.
  // FIX: Cast `import.meta` to `any` to bypass TypeScript errors when `vite/client` types are not available.
  const apiKey = (import.meta as any).env.VITE_API_KEY;
  if (!apiKey) {
    console.error('VITE_API_KEY is not set in the environment variables.');
    // Per guidelines, UI for key entry is removed. This error is for developers.
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
    // Per guidelines, we assume the API key is valid. Errors are treated as transient.
    return false;
  }
};