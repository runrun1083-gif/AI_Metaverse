
import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const aiService = {
  async reasonNextState(userInput: string, agentName: string, currentTags: string[]) {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `
        エージェント: ${agentName}
        現在の状態タグ: ${currentTags.join(', ')}
        ユーザー入力: "${userInput}"
        
        以下のJSON形式で回答してください:
        {
          "reasoning": "なぜそう考えたかの理由",
          "thoughtTag": "推論された思考タグID",
          "actionTag": "決定されたアクションタグID",
          "message": "ユーザーへの返答セリフ"
        }
      `,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            reasoning: { type: Type.STRING },
            thoughtTag: { type: Type.STRING },
            actionTag: { type: Type.STRING },
            message: { type: Type.STRING }
          },
          required: ["reasoning", "thoughtTag", "actionTag", "message"]
        }
      }
    });
    return JSON.parse(response.text);
  }
};
