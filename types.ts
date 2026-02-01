
export interface Message {
  id: string;
  role: 'user' | 'bot';
  text: string;
  timestamp: Date;
  evaluation?: 'good' | 'bad';
  agentId?: string;
}

export type SidebarItem = 
  | 'エージェント' 
  | '新規チャット' 
  | '履歴リスト' 
  | 'プロジェクト' 
  | 'スキル' 
  | 'プロンプト' 
  | 'ナレッジ' 
  | 'タスク'
  | '設定';

export interface Position {
  x: number;
  y: number;
}

export interface AgentConfig {
  id: string;
  nickname: string;
  color: string;
  prompt: string;
  selectedPromptId: string;
  selectedSkillId: string;
  selectedTaskId: string;
}

export interface Notice {
  id: string;
  category: string;
  content: string;
  updatedAt: string;
}

export interface TaskData {
  id: string;
  name: string;
  description: string;
}

export interface ProjectData {
  name: string;
  idea: string;
  plan: string;
  milestones: { id: string; text: string; completed: boolean }[];
}

export interface SkillData {
  id: string;
  name: string;
  tags: string;
  description: string;
  program: string;
}
