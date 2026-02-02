
import { Position } from './index';

/**
 * タグの種類。
 * 状態遷移、性格、プロジェクト属性、実行中のアクションなどを分類する。
 */
export type TagType = 'personality' | 'status' | 'history' | 'preference' | 'action' | 'thought' | 'project' | 'skill';

/**
 * グラフ上のエッジ（関係性）またはノードの属性を表すタグ
 */
export interface Tag {
  id: string;
  label: string;
  type: TagType;
  metadata?: any; // Obsidianのフロントマターや追加プロパティ
}

/**
 * 状態(状況)・思考(判断)・アクション(行動)の3要素を記録するトリプレット
 */
export interface ActionRecord {
  id: string;
  timestamp: Date;
  contextTags: string[]; // その時の周辺状況（タグIDの集まり）
  reasoningTag: string;  // 「なぜ」その行動を選んだかの思考タグID
  actionTag: string;     // 実行したアクションタグID
  result: 'success' | 'failure';
  observation?: string;  // 実行後の結果や感想
}

/**
 * エージェント（ロボット）をグラフ上の「ノード」として定義
 */
export interface AgentNode {
  id: string;
  nickname: string;
  color: string;
  position: Position;
  targetPosition: Position;
  
  // タグによる動的状態管理
  tags: Set<string>; 
  
  // 資産・履歴としての記録
  actionHistory: ActionRecord[]; 
  thoughtHistory: string[]; // Obsidianファイルや思考ログへの参照
  
  // 現在の状態表示用
  activeThought?: string;   
  status: 'idle' | 'working' | 'meeting' | 'thinking';

  // 紐付けデータ
  selectedProjectId?: string;
  selectedTaskId?: string;
  selectedPromptId?: string;
  selectedSkillId?: string;
}

/**
 * プロジェクトをグラフ上の「ノード」として定義
 */
export interface ProjectNode {
  id: string;
  name: string;
  description: string;
  tags: Set<string>;
  status: 'active' | 'archived' | 'planning';
  relatedAgentIds: string[];
}

/**
 * タスクをグラフ上の「ノード」として定義
 */
export interface TaskNode {
  id: string;
  projectId: string;
  name: string;
  tags: Set<string>;
  priority: 'low' | 'medium' | 'high';
  status: 'todo' | 'doing' | 'done';
}
