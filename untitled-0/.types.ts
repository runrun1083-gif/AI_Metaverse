
export interface Message {
  id: string;
  role: 'user' | 'bot';
  text: string;
  timestamp: Date;
  agentId?: string;
}

export type SidebarItem = 
  | 'エージェント' 
  | 'プロジェクト' 
  | 'タスク'
  | 'プロンプト' 
  | 'スキル'
  | 'メモ'
  | '設定';

export interface Position {
  x: number;
  y: number;
}

export interface AgentConfig {
  id: string;
  nickname: string;
  color: string;
  selectedProjectId?: string;
  selectedTaskId?: string;
  selectedPromptId?: string;
  selectedSkillId?: string;
  status?: 'idle' | 'working' | 'meeting';
  reaction?: string;
}

export interface Notice {
  id: string;
  category: string;
  content: string;
  updatedAt: string;
}

export interface ProjectData {
  id: string;
  name: string;
  description: string;
  color: string;
}

export interface TaskData {
  id: string;
  projectId: string;
  name: string;
  description: string;
  status: 'todo' | 'doing' | 'done';
}

export interface PromptData {
  id: string;
  name: string;
  content: string; // 実際の性格指示テキスト
}

export interface SkillData {
  id: string;
  name: string;
  description: string;
  code: string; // 実行プログラム（擬似コード）
}

export interface MemoData {
  id: string;
  title: string;
  content: string;
  updatedAt: string;
}
