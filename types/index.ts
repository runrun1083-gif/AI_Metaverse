
export interface Message {
  id: string;
  role: 'user' | 'bot';
  text: string;
  timestamp: Date;
  agentId?: string;
}

export interface Position {
  x: number;
  y: number;
}

export type SidebarItem = 
  | 'エージェント' 
  | 'プロジェクト' 
  | 'タスク'
  | 'プロンプト' 
  | 'スキル'
  | 'メモ'
  | '設定';

export interface Notice {
  id: string;
  category: string;
  content: string;
  updatedAt: string;
}
