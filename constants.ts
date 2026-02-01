
import { TaskData, SkillData, Notice } from './types';

export const INITIAL_TASKS: TaskData[] = [
  { id: 't1', name: '書類の整理', description: 'オフィス内の書類を整理します。' },
  { id: 't2', name: 'コーヒーの補充', description: 'コーヒー豆をチェックします。' },
  { id: 't3', name: 'コードレビュー', description: 'AIプログラムのバグを見つけます。' },
];

export const INITIAL_SKILLS: SkillData[] = [
  { id: 's1', name: '高速計算', tags: '数学', description: '計算を瞬時に行います。', program: '' },
  { id: 's2', name: '翻訳', tags: '言語', description: '翻訳が可能です。', program: '' },
  { id: 's3', name: '画像生成', tags: '制作', description: '画像を生成します。', program: '' },
];

export const MAP_CONFIG = {
  FLOOR_WIDTH: 3000,
  FLOOR_HEIGHT: 2000,
  CENTRAL_PLAZA: { x: 1500, y: 1000 },
  DEFAULT_ZOOM: 0.8,
  MIN_ZOOM: 0.3,
  MAX_ZOOM: 2.0
};
