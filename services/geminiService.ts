import { GoogleGenAI, Type } from "@google/genai";
import { AnalysisResult, DietaryFilterType } from "../types";

// Initialize the Gemini API client
// Uses process.env.API_KEY as per guidelines
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const analyzeFridgeAndSuggestRecipes = async (
  imageBase64: string,
  dietaryFilter: DietaryFilterType
): Promise<AnalysisResult> => {
  try {
    const mimeType = "image/jpeg"; // Assuming JPEG from camera/upload for simplicity

    const prompt = `
      Analyze this image of a refrigerator or food items. 
      1. Identify the visible ingredients.
      2. Suggest 5 diverse, delicious recipes that use these ingredients.
      3. If the user has selected a dietary restriction (${dietaryFilter}), strictly adhere to it.
      4. For each recipe, list what ingredients are in the fridge and what essential ingredients are missing (so the user can add them to a shopping list).
      5. Provide step-by-step cooking instructions.
      
      Return the response in strict JSON format.
    `;

    const response = await ai.models.generateContent({
      model: "gemini-3-pro-preview", // Using the requested model for high capability
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: mimeType,
              data: imageBase64,
            },
          },
          {
            text: prompt,
          },
        ],
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            identifiedIngredients: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "List of ingredients detected in the image",
            },
            recipes: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING },
                  title: { type: Type.STRING },
                  description: { type: Type.STRING },
                  difficulty: { type: Type.STRING, enum: ["Easy", "Medium", "Hard"] },
                  prepTime: { type: Type.STRING },
                  calories: { type: Type.INTEGER },
                  ingredients: { 
                    type: Type.ARRAY, 
                    items: { type: Type.STRING },
                    description: "Ingredients available in the fridge"
                  },
                  missingIngredients: { 
                    type: Type.ARRAY, 
                    items: { type: Type.STRING },
                    description: "Essential ingredients not seen in the fridge"
                  },
                  steps: { 
                    type: Type.ARRAY, 
                    items: { type: Type.STRING },
                    description: "Step by step cooking instructions"
                  },
                  tags: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING },
                    description: "Tags like 'Breakfast', 'Healthy', 'Spicy'"
                  }
                },
                required: ["id", "title", "description", "difficulty", "prepTime", "calories", "ingredients", "missingIngredients", "steps", "tags"],
              },
            },
          },
          required: ["identifiedIngredients", "recipes"],
        },
      },
    });

    const jsonText = response.text;
    if (!jsonText) {
      throw new Error("No response text from Gemini");
    }

    return JSON.parse(jsonText) as AnalysisResult;

  } catch (error) {
    console.error("Error analyzing fridge:", error);
    throw error;
  }
};