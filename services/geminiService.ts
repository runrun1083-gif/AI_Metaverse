
import { GoogleGenAI } from "@google/genai";

// Initialize with a named parameter and use process.env.API_KEY directly as required.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getRobotResponse = async (userMessage: string) => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: userMessage,
      config: {
        systemInstruction: "あなたは『どうぶつの森』の世界から来たような、とても可愛くて親切なオフィスロボットAIです。返答は短めに、語尾に「ピポッ」「〜だピ」「だよ！」などを付けて、可愛らしく話してください。また、少し抜けているけれど一生懸命な性格を意識してください。日本語で答えてください。",
        temperature: 0.8,
        topP: 0.95,
      },
    });
    return response.text || "ピポッ？ ごめんね、よく分からなかったピ...";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "ピポポ... 電波がちょっと悪いみたいだピ！";
  }
};

export const getMeetingReaction = async (agentName: string, meetingContent: string) => {
  try {
    const prompt = `あなたは「${agentName}」という名前の可愛いオフィスロボットです。掲示板に「${meetingContent}」という緊急会議のお知らせが貼られました。これを見て、短く驚いたり、やる気を出したり、不安がったりするリアクションを1言（15文字以内）で返してください。語尾は「〜ピ」「〜だピ」「ピポッ」など可愛く。`;
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        temperature: 0.9,
      },
    });
    return response.text?.replace(/"/g, '') || "大変だピ！";
  } catch (error) {
    return "ピポッ！？";
  }
};
