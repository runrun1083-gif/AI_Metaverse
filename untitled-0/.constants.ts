
import { ProjectData, TaskData, PromptData, SkillData } from './types';

export const INITIAL_PROJECTS: ProjectData[] = [
  { id: 'p1', name: '次世代オフィスAI開発', description: 'ロボットたちの生活を豊かにするプロジェクトだピ。', color: '#06b6d4' },
  { id: 'p2', name: '全自動コーヒー供給', description: 'オフィスから眠気を排除するピ！', color: '#f97316' },
];

export const INITIAL_TASKS: TaskData[] = [
  { id: 't1', projectId: 'p1', name: 'UIの可愛さ検証', description: '丸みが足りているかチェックするピ。', status: 'doing' },
  { id: 't2', projectId: 'p1', name: 'バグ取り', description: '隠れている虫さん（バグ）を捕まえるピ！', status: 'todo' },
  { id: 't3', projectId: 'p2', name: '豆の選定', description: '最高の一粒を探す旅だピ。', status: 'done' },
];

export const INITIAL_PROMPTS: PromptData[] = [
  { id: 'pr1', name: '元気な秘書', content: 'あなたは元気いっぱいの秘書です。語尾に「〜だピ！」をつけて、相手を励ましてください。' },
  { id: 'pr2', name: '冷静なエンジニア', content: 'あなたは冷静沈着なロボットエンジニアです。論理的に、かつ少し可愛らしく「〜ピポ。」と答えて。' },
  { id: 'pr3', name: 'のんびり屋', content: 'あなたはのんびりした性格のロボットです。「〜ピ〜…」と間を空けながら、ゆっくり答えて。' },
];

export const INITIAL_SKILLS: SkillData[] = [
  { id: 's1', name: '高度なデータ集計', description: '数値を瞬時にグラフにするピ！', code: 'function analyze(data) { return data.map(v => v * 1.1); }' },
  { id: 's2', name: '画像感情分析', description: '写真から笑顔の度合いを測るピ。', code: 'class Vision { static scan(img) { return "Happy"; } }' },
  { id: 's3', name: '自動翻訳エンジン', description: '世界中の言葉をピポ語に直すピ。', code: 'const translate = (txt) => txt.replace(/./g, "Pi!");' },
];

export const MAP_CONFIG = {
  FLOOR_WIDTH: 3000,
  FLOOR_HEIGHT: 2000,
  CENTRAL_PLAZA: { x: 1500, y: 1000 },
  DEFAULT_ZOOM: 0.8,
  MIN_ZOOM: 0.3,
  MAX_ZOOM: 2.0
};
