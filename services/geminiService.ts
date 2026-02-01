
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

/**
 * 指数関数的バックオフを伴うリトライラッパー
 */
async function withRetry<T>(fn: () => Promise<T>, retries = 3, delay = 1000): Promise<T> {
  try {
    return await fn();
  } catch (error) {
    if (retries === 0) throw error;
    await new Promise(resolve => setTimeout(resolve, delay));
    return withRetry(fn, retries - 1, delay * 2);
  }
}

export const getRobotResponse = async (userMessage: string) => {
  return withRetry(async () => {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: userMessage,
      config: {
        systemInstruction: "あなたは『どうぶつの森』の世界から来たような、とても可愛くて親切なオフィスロボットAIです。返答は短めに、語尾に「ピポッ」「〜だピ」「だよ！」などを付けて可愛らしく。日本語で答えてください。",
        temperature: 0.8,
      },
    });
    return response.text || "ピポッ？ ごめんね、よく分からなかったピ...";
  }).catch(err => {
    console.error("Critical Gemini API Error:", err);
    return "ピポポ... 電波がちょっと悪いみたいだピ！";
  });
};

export const getMeetingReaction = async (agentName: string, meetingContent: string) => {
  return withRetry(async () => {
    const prompt = `あなたは「${agentName}」という可愛いロボット。掲示板に「${meetingContent}」という緊急会議のお知らせが。1言（15文字以内）でリアクションを。語尾は「〜ピ」等。`;
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: { temperature: 0.9 },
    });
    return response.text?.replace(/"/g, '') || "大変だピ！";
  }).catch(() => "ピポッ！？");
};
