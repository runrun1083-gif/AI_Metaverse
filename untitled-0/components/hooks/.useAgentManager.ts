
import { useState, useCallback } from 'react';
import { AgentConfig, Message, Notice } from '../types';
import { getRobotResponse, getMeetingReaction } from '../services/geminiService';

export const useAgentManager = () => {
  const [agents, setAgents] = useState<AgentConfig[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [activeAgentId, setActiveAgentId] = useState<string | null>(null);
  const [isBotThinking, setIsBotThinking] = useState(false);
  const [notices, setNotices] = useState<Notice[]>([]);
  const [meetingReactions, setMeetingReactions] = useState<Record<string, string>>({});

  const addAgent = useCallback((agent: AgentConfig) => {
    setAgents(prev => [...prev, agent]);
    if (!activeAgentId) setActiveAgentId(agent.id);
  }, [activeAgentId]);

  const sendMessage = useCallback(async (text: string) => {
    if (!text.trim() || !activeAgentId || isBotThinking) return;
    
    const userMsg: Message = { id: Date.now().toString(), role: 'user', text, timestamp: new Date() };
    setMessages(prev => [...prev, userMsg]);
    setIsBotThinking(true);

    const botText = await getRobotResponse(text);
    setMessages(prev => [...prev, {
      id: (Date.now() + 1).toString(),
      role: 'bot',
      text: botText,
      timestamp: new Date(),
      agentId: activeAgentId
    }]);
    setIsBotThinking(false);
  }, [activeAgentId, isBotThinking]);

  const triggerMeeting = useCallback(async (notice: Notice) => {
    if (notice.category !== '緊急会議') return null;

    const results = await Promise.allSettled(
      agents.map(a => getMeetingReaction(a.nickname, notice.content))
    );
    
    const reactions: Record<string, string> = {};
    results.forEach((res, i) => {
      if (res.status === 'fulfilled') reactions[agents[i].id] = res.value;
    });
    setMeetingReactions(reactions);
    return reactions;
  }, [agents]);

  // FIX: Added clearMeetingReactions function
  const clearMeetingReactions = useCallback(() => {
    setMeetingReactions({});
  }, []);

  return {
    agents, 
    // FIX: Added setAgents to return values
    setAgents,
    addAgent, 
    messages, sendMessage, setMessages,
    activeAgentId, setActiveAgentId,
    isBotThinking,
    notices, setNotices,
    meetingReactions, setMeetingReactions, triggerMeeting,
    // FIX: Added clearMeetingReactions to return values
    clearMeetingReactions
  };
};
