
import { useCallback } from 'react';
import { useGlobalStore } from '../stores/globalStore';
import { aiService } from '../services/ai/geminiService';

export const useTagSystem = () => {
  const { updateAgent, addMessage, setThinking, agents } = useGlobalStore();

  const processInput = useCallback(async (agentId: string, text: string) => {
    const agent = agents.find(a => a.id === agentId);
    if (!agent) return;

    setThinking(true);
    try {
      const result = await aiService.reasonNextState(text, agent.nickname, Array.from(agent.tags));
      
      // タグと履歴の更新
      const newTags = new Set(agent.tags);
      newTags.add(result.thoughtTag);
      newTags.add(result.actionTag);

      updateAgent(agentId, {
        activeThought: result.reasoning,
        tags: newTags
      });

      addMessage({
        id: Date.now().toString(),
        role: 'bot',
        text: result.message,
        timestamp: new Date(),
        agentId
      });
    } catch (e) {
      console.error(e);
    } finally {
      setThinking(false);
    }
  }, [agents, updateAgent, addMessage, setThinking]);

  return { processInput };
};
