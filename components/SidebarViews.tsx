
import React, { useState } from 'react';
import { AgentConfig, TaskData, SkillData, SidebarItem } from '../types';
import { Save, Plus, ChevronRight, ArrowLeft, X, PenTool, Star, Pin } from 'lucide-react';

// --- エージェント設定ビュー ---
export const AgentFormView: React.FC<{
  agentsCount: number;
  tasks: TaskData[];
  skills: SkillData[];
  onSave: (agent: AgentConfig) => void;
}> = ({ agentsCount, tasks, skills, onSave }) => {
  const [nickname, setNickname] = useState('');
  const [prompt, setPrompt] = useState('');
  const [selectedColor, setSelectedColor] = useState('#60a5fa');
  const [selectedTaskId, setSelectedTaskId] = useState('');
  const [selectedSkillId, setSelectedSkillId] = useState('');

  const COLORS = [
    { name: 'ブルー', value: '#60a5fa' },
    { name: 'ピンク', value: '#f472b6' },
    { name: 'グリーン', value: '#4ade80' },
    { name: 'イエロー', value: '#facc15' },
    { name: 'パープル', value: '#a78bfa' },
  ];

  const handleSave = () => {
    if (!nickname) return;
    onSave({
      id: Date.now().toString(),
      nickname,
      prompt,
      color: selectedColor,
      selectedPromptId: '',
      selectedSkillId,
      selectedTaskId,
    });
    setNickname(''); setPrompt(''); setSelectedTaskId(''); setSelectedSkillId('');
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
      {agentsCount >= 5 && <div className="p-3 bg-red-50 text-red-500 text-xs font-bold rounded-xl border border-red-100">最大5体まで作成できます。</div>}
      <div>
        <label className="block text-xs font-bold text-gray-400 mb-2 uppercase tracking-widest">カラー選択</label>
        <div className="flex gap-3">
          {COLORS.map(c => (
            <button key={c.value} onClick={() => setSelectedColor(c.value)}
              className={`w-10 h-10 rounded-full border-4 transition-all ${selectedColor === c.value ? 'border-gray-800 scale-110' : 'border-white shadow-sm'}`}
              style={{ backgroundColor: c.value }} />
          ))}
        </div>
      </div>
      <div>
        <label className="block text-xs font-bold text-gray-400 mb-1 uppercase tracking-widest">ニックネーム</label>
        <input type="text" className="w-full p-4 bg-gray-50 rounded-2xl border-2 border-transparent focus:border-blue-200 outline-none font-bold"
          placeholder="ロボくん" value={nickname} onChange={(e) => setNickname(e.target.value)} />
      </div>
      <div>
        <label className="block text-xs font-bold text-gray-400 mb-1 uppercase tracking-widest">プロンプト</label>
        <textarea className="w-full p-4 bg-gray-50 rounded-2xl border-2 border-transparent focus:border-blue-200 outline-none h-24 resize-none font-medium text-sm"
          placeholder="性格設定などを入力..." value={prompt} onChange={(e) => setPrompt(e.target.value)} />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-[10px] font-bold text-gray-400 mb-1 uppercase tracking-widest">タスク選択</label>
          <select className="w-full p-3 bg-gray-50 rounded-xl outline-none font-bold text-sm" value={selectedTaskId} onChange={(e) => setSelectedTaskId(e.target.value)}>
            <option value="">なし</option>
            {tasks.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-[10px] font-bold text-gray-400 mb-1 uppercase tracking-widest">スキル選択</label>
          <select className="w-full p-3 bg-gray-50 rounded-xl outline-none font-bold text-sm" value={selectedSkillId} onChange={(e) => setSelectedSkillId(e.target.value)}>
            <option value="">なし</option>
            {skills.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
          </select>
        </div>
      </div>
      <button onClick={handleSave} disabled={agentsCount >= 5 || !nickname}
        className={`w-full py-4 rounded-2xl font-bold flex items-center justify-center gap-2 shadow-lg transition-all ${agentsCount >= 5 || !nickname ? 'bg-gray-200 text-gray-400' : 'bg-blue-400 text-white hover:bg-blue-500 active:scale-95'}`}>
        <Save size={18} /> エージェントを保存
      </button>
    </div>
  );
};

// --- タスク一覧ビュー ---
export const TaskListView: React.FC<{ tasks: TaskData[] }> = ({ tasks }) => (
  <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
    <button className="w-full py-4 bg-cyan-50 text-cyan-500 border-2 border-cyan-100 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-cyan-100">
      <Plus size={18} /> 新規タスク作成
    </button>
    <div className="space-y-3">
      <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest">登録済みタスク</h3>
      {tasks.length === 0 ? <div className="text-center py-10 text-gray-300 font-bold">タスクがありません</div> :
        tasks.map(t => (
          <div key={t.id} className="p-4 bg-white border-4 border-gray-50 rounded-3xl shadow-sm hover:border-cyan-100 transition-all flex justify-between items-center">
            <span className="font-bold text-gray-700">{t.name}</span>
            <ChevronRight size={16} className="text-gray-300" />
          </div>
        ))}
    </div>
  </div>
);

// --- スキル一覧ビュー ---
export const SkillListView: React.FC<{ skills: SkillData[] }> = ({ skills }) => (
  <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
    <button className="w-full py-4 bg-yellow-50 text-yellow-600 border-2 border-yellow-100 rounded-2xl font-bold flex items-center justify-center gap-2">
      <Plus size={18} /> 新規スキル作成
    </button>
    <div className="space-y-3">
      <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest">登録済みスキル</h3>
      {skills.map(s => (
        <div key={s.id} className="p-4 bg-white border-4 border-gray-50 rounded-3xl shadow-sm hover:border-yellow-100 transition-all flex justify-between items-center">
          <span className="font-bold text-gray-700">{s.name}</span>
          <div className="px-2 py-0.5 bg-yellow-100 text-yellow-600 text-[10px] rounded-full font-bold">{s.tags}</div>
        </div>
      ))}
    </div>
  </div>
);

// --- ナレッジビュー ---
export const KnowledgeView: React.FC = () => {
  const [selectedNote, setSelectedNote] = useState<any>(null);
  const memos = [
    { id: '1', title: '会社概要メモ', content: '世界をより可愛く、便利に。', updatedAt: '2024/05/20' },
    { id: '2', title: 'メンテナンス手順', content: 'カラーの状態を確認する。', updatedAt: '2024/06/15' }
  ];

  if (selectedNote) {
    return (
      <div className="animate-in fade-in slide-in-from-right-4 flex flex-col h-full">
        <div className="flex items-center justify-between mb-6">
          <button onClick={() => setSelectedNote(null)} className="flex items-center gap-2 text-gray-400 hover:text-gray-600 font-bold"><ArrowLeft size={20} /> 戻る</button>
          <button onClick={() => setSelectedNote(null)} className="p-2 bg-gray-100 text-gray-400 rounded-full"><X size={20} /></button>
        </div>
        <h3 className="text-2xl font-bold text-gray-800 mb-4">{selectedNote.title}</h3>
        <div className="p-6 bg-gray-50 rounded-3xl text-gray-600 whitespace-pre-wrap">{selectedNote.content}</div>
      </div>
    );
  }

  return (
    <div className="space-y-4 animate-in fade-in slide-in-from-right-4">
      <button className="w-full py-6 border-4 border-dashed border-gray-100 rounded-[3rem] text-gray-400 flex flex-col items-center justify-center gap-2 hover:bg-gray-50">
        <Plus size={24} /> <span className="font-bold text-sm">新規メモ作成</span>
      </button>
      {memos.map(m => (
        <div key={m.id} onClick={() => setSelectedNote(m)} className="p-6 bg-white border-4 border-gray-50 rounded-[2.5rem] shadow-sm cursor-pointer hover:border-green-100 transition-all">
          <div className="flex justify-between items-center mb-2"><h4 className="font-bold text-gray-700">{m.title}</h4><ChevronRight size={18} className="text-gray-300" /></div>
          <p className="text-sm text-gray-400 line-clamp-2">{m.content}</p>
        </div>
      ))}
    </div>
  );
};
