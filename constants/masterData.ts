
import { Tag } from '../types/graph';

export const MASTER_TAGS: Tag[] = [
  // 性格
  { id: 'p_cheerful', label: '元気いっぱい', type: 'personality' },
  { id: 'p_smart', label: '秀才', type: 'personality' },
  { id: 'p_lazy', label: 'のんびり', type: 'personality' },
  // 状態
  { id: 's_idle', label: '待機中', type: 'status' },
  { id: 's_working', label: '作業中', type: 'status' },
  { id: 's_thinking', label: '思考中', type: 'status' },
  // アクション
  { id: 'a_walk', label: '散歩', type: 'action' },
  { id: 'a_talk', label: 'お喋り', type: 'action' },
  { id: 'a_rest', label: '休憩', type: 'action' },
];

export const MAP_CONFIG = {
  FLOOR_WIDTH: 3000,
  FLOOR_HEIGHT: 2000,
  CENTRAL_PLAZA: { x: 1500, y: 1000 },
  DEFAULT_ZOOM: 0.8,
  MIN_ZOOM: 0.3,
  MAX_ZOOM: 2.0
};
