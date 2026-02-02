
import { Position } from './index';

export type TagType = 'personality' | 'status' | 'history' | 'preference' | 'action' | 'thought' | 'project';

export interface Tag {
  id: string;
  label: string;
  type: TagType;
  metadata?: any;
}

export interface ActionRecord {
  timestamp: Date;
  contextTags: string[]; // 実行時の状態タグID
  reasoningTag: string;  // 判断理由となった思考タグID
  actionTag: string;     // 実行されたアクションタグID
  result: 'success' | 'failure';
}

export interface AgentNode {
  id: string;
  nickname: string;
  color: string;
  position: Position;
  targetPosition: Position;
  tags: Set<string>;      // 保持タグID
  actionHistory: ActionRecord[];
  thoughtHistory: string[]; // 思考ログ
  activeThought?: string;   // 現在表示中の思考
}

export interface ProjectNode {
  id: string;
  name: string;
  tags: Set<string>;
  status: 'active' | 'archived' | 'planning';
}
