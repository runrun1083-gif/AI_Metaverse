
import React, { createContext, useContext, useState, useCallback } from 'react';
import { AgentNode } from '../types/graph';
import { Message, Notice } from '../types/index';

interface GlobalState {
  agents: AgentNode[];
  messages: Message[];
  notices: Notice[];
  activeAgentId: string | null;
  isThinking: boolean;
  addAgent: (agent: AgentNode) => void;
  updateAgent: (id: string, updates: Partial<AgentNode>) => void;
  setActiveAgentId: (id: string | null) => void;
  addMessage: (msg: Message) => void;
  setThinking: (val: boolean) => void;
}

const GlobalContext = createContext<GlobalState | undefined>(undefined);

export const GlobalProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [agents, setAgents] = useState<AgentNode[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [notices, setNotices] = useState<Notice[]>([]);
  const [activeAgentId, setActiveAgentId] = useState<string | null>(null);
  // Renamed from setIsThinking to setThinking to match the interface and usage
  const [isThinking, setThinking] = useState(false);

  const addAgent = useCallback((agent: AgentNode) => setAgents(prev => [...prev, agent]), []);
  const updateAgent = useCallback((id: string, updates: Partial<AgentNode>) => {
    setAgents(prev => prev.map(a => a.id === id ? { ...a, ...updates } : a));
  }, []);
  const addMessage = useCallback((msg: Message) => setMessages(prev => [...prev, msg]), []);

  return (
    <GlobalContext.Provider value={{ 
      agents, messages, notices, activeAgentId, isThinking,
      addAgent, updateAgent, setActiveAgentId, addMessage, setThinking
    }}>
      {children}
    </GlobalContext.Provider>
  );
};

export const useGlobalStore = () => {
  const ctx = useContext(GlobalContext);
  if (!ctx) throw new Error('GlobalStore must be used within Provider');
  return ctx;
};
