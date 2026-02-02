
import React, { useState } from 'react';
import { AgentConfig, ProjectData, TaskData, PromptData, SkillData } from '../types';
import { Save, Plus, ChevronRight, Code, MessageSquareText, Target, ListTodo, Bot } from 'lucide-react';

// --- エージェント設定 ---
export const AgentFormView: React.FC<{
  agentsCount: number;
  projects: ProjectData[];
  tasks: TaskData[];
  prompts: PromptData[];
  skills: SkillData[];
  onSave: (agent: AgentConfig) => void;
}> = ({ agentsCount, projects, tasks, prompts, skills, onSave }) => {
  const [nickname, setNickname] = useState('');
  const [selectedColor, setSelectedColor] = useState('#60a5fa');
  const [selectedProjectId, setSelectedProjectId] = useState('');
  const [selectedTaskId, setSelectedTaskId] = useState('');
  const [selectedPromptId, setSelectedPromptId] = useState('');
  const [selectedSkillId, setSelectedSkillId] = useState('');

  const COLORS = ['#60a5fa', '#f472b6', '#4ade80', '#facc15', '#a78bfa'];

  const handleSave = () => {
    if (!nickname) return;
    onSave({
      id: Date.now().toString(),
      nickname,
      color: selectedColor,
      selectedProjectId: selectedProjectId || undefined,
      selectedTaskId: selectedTaskId || undefined,
      selectedPromptId: selectedPromptId || undefined,
      selectedSkillId: selectedSkillId || undefined,
    });
    setNickname(''); 
  };

  return (
    <div className="space-y-5 bg-[#fdfaf5] p-5 rounded-[2.5rem] border border-orange-50 animate-in slide-in-from-bottom-2">
      <div className="flex gap-3 justify-center mb-4">
        {COLORS.map(c => (
          <button key={c} onClick={() => setSelectedColor(c)}
            className={`w-8 h-8 rounded-full border-4 transition-all ${selectedColor === c ? 'border-gray-800 scale-110' : 'border-white shadow-sm'}`}
            style={{ backgroundColor: c }} />
        ))}
      </div>
      <div>
        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] block mb-1">ニックネーム</label>
        <input type="text" className="w-full p-4 bg-white rounded-2xl outline-none font-bold text-gray-700 shadow-sm border-2 border-transparent focus:border-blue-200"
          placeholder="ロボ名..." value={nickname} onChange={(e) => setNickname(e.target.value)} />
      </div>
      
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-[10px] font-bold text-gray-400 uppercase block mb-1">プロジェクト</label>
          <select className="w-full p-3 bg-white rounded-xl outline-none font-bold text-xs shadow-sm" value={selectedProjectId} onChange={(e) => setSelectedProjectId(e.target.value)}>
            <option value="">未設定</option>
            {projects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
          </select>
        </div>
        <div>
          <label className="text-[10px] font-bold text-gray-400 uppercase block mb-1">現在のタスク</label>
          <select className="w-full p-3 bg-white rounded-xl outline-none font-bold text-xs shadow-sm" value={selectedTaskId} onChange={(e) => setSelectedTaskId(e.target.value)}>
            <option value="">未設定</option>
            {tasks.filter(t => !selectedProjectId || t.projectId === selectedProjectId).map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
          </select>
        </div>
        <div>
          <label className="text-[10px] font-bold text-gray-400 uppercase block mb-1">性格プロンプト</label>
          <select className="w-full p-3 bg-white rounded-xl outline-none font-bold text-xs shadow-sm" value={selectedPromptId} onChange={(e) => setSelectedPromptId(e.target.value)}>
            <option value="">未設定</option>
            {prompts.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
          </select>
        </div>
        <div>
          <label className="text-[10px] font-bold text-gray-400 uppercase block mb-1">専用スキル</label>
          <select className="w-full p-3 bg-white rounded-xl outline-none font-bold text-xs shadow-sm" value={selectedSkillId} onChange={(e) => setSelectedSkillId(e.target.value)}>
            <option value="">未設定</option>
            {skills.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
          </select>
        </div>
      </div>

      <button onClick={handleSave} disabled={agentsCount >= 5 || !nickname}
        className="w-full py-4 bg-blue-400 text-white rounded-2xl font-bold flex items-center justify-center gap-2 shadow-lg hover:bg-blue-500 active:scale-95 transition-all">
        <Bot size={18} /> エージェントをデプロイ
      </button>
    </div>
  );
};

// --- プロジェクト/タスク 一覧 ---
export const ProjectListView: React.FC<{ projects: ProjectData[] }> = ({ projects }) => (
  <div className="space-y-3">
    <button className="w-full py-4 bg-cyan-50 text-cyan-500 border-2 border-dashed border-cyan-100 rounded-3xl font-bold flex items-center justify-center gap-2 hover:bg-cyan-100 transition-all"><Plus size={18}/>プロジェクト作成</button>
    {projects.map(p => (
      <div key={p.id} className="p-5 bg-white border-4 border-gray-50 rounded-3xl shadow-sm hover:border-cyan-100 transition-all">
        <div className="flex items-center gap-2 mb-1">
          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: p.color }}></div>
          <p className="font-bold text-gray-700">{p.name}</p>
        </div>
        <p className="text-[10px] text-gray-400 font-medium">{p.description}</p>
      </div>
    ))}
  </div>
);

export const TaskListView: React.FC<{ tasks: TaskData[] }> = ({ tasks }) => (
  <div className="space-y-3">
    <button className="w-full py-4 bg-blue-50 text-blue-500 border-2 border-dashed border-blue-100 rounded-3xl font-bold flex items-center justify-center gap-2 hover:bg-blue-100 transition-all"><Plus size={18}/>タスク作成</button>
    {tasks.map(t => (
      <div key={t.id} className="p-5 bg-white border-4 border-gray-50 rounded-3xl shadow-sm hover:border-blue-100 transition-all">
        <div className="flex justify-between items-start mb-1">
          <p className="font-bold text-gray-700">{t.name}</p>
          <span className="px-2 py-0.5 bg-gray-100 text-[8px] font-black uppercase rounded text-gray-400">{t.status}</span>
        </div>
        <p className="text-[10px] text-gray-400 font-medium">{t.description}</p>
      </div>
    ))}
  </div>
);

// --- プロンプト 一覧 ---
export const PromptListView: React.FC<{ prompts: PromptData[] }> = ({ prompts }) => (
  <div className="space-y-3">
    <button className="w-full py-4 bg-pink-50 text-pink-500 border-2 border-dashed border-pink-100 rounded-3xl font-bold flex items-center justify-center gap-2 hover:bg-pink-100 transition-all"><Plus size={18}/>プロンプト作成</button>
    {prompts.map(p => (
      <div key={p.id} className="p-5 bg-white border-4 border-gray-50 rounded-3xl shadow-sm hover:border-pink-100 transition-all">
        <div className="flex items-center gap-2 mb-1">
          <MessageSquareText size={14} className="text-pink-400" />
          <p className="font-bold text-gray-700">{p.name}</p>
        </div>
        <p className="text-[10px] text-gray-400 italic line-clamp-2">"{p.content}"</p>
      </div>
    ))}
  </div>
);

// --- スキル 一覧 ---
export const SkillListView: React.FC<{ skills: SkillData[] }> = ({ skills }) => (
  <div className="space-y-3">
    <button className="w-full py-4 bg-yellow-50 text-yellow-600 border-2 border-dashed border-yellow-100 rounded-3xl font-bold flex items-center justify-center gap-2 hover:bg-yellow-100 transition-all"><Plus size={18}/>スキル作成</button>
    {skills.map(s => (
      <div key={s.id} className="p-5 bg-white border-4 border-gray-50 rounded-3xl shadow-sm hover:border-yellow-200 transition-all">
        <div className="flex items-center gap-2 mb-2">
          <Code size={14} className="text-yellow-500" />
          <p className="font-bold text-gray-700">{s.name}</p>
        </div>
        <div className="bg-gray-900 p-3 rounded-xl">
          <code className="text-[9px] text-green-400 font-mono block overflow-x-auto whitespace-nowrap">{s.code}</code>
        </div>
      </div>
    ))}
  </div>
);

// --- 設定/メモ ---
export const KnowledgeView: React.FC = () => (
  <div className="p-8 text-center bg-green-50 rounded-[3rem] border-4 border-white">
    <div className="text-4xl mb-4">📗</div>
    <p className="font-bold text-green-600">メモリー機能は構築中だピ！</p>
  </div>
);

export const SettingsView: React.FC = () => (
  <div className="space-y-4">
    <div className="p-6 bg-white rounded-3xl border-4 border-gray-50 shadow-sm">
      <p className="font-bold text-gray-700 mb-4">システム設定</p>
      <div className="space-y-3">
        <div className="flex justify-between items-center text-xs font-bold text-gray-400">
          <span>サウンドエフェクト</span>
          <div className="w-10 h-5 bg-green-400 rounded-full relative"><div className="absolute right-1 top-1 w-3 h-3 bg-white rounded-full"></div></div>
        </div>
        <div className="flex justify-between items-center text-xs font-bold text-gray-400">
          <span>高画質レンダリング</span>
          <div className="w-10 h-5 bg-gray-200 rounded-full relative"><div className="absolute left-1 top-1 w-3 h-3 bg-white rounded-full"></div></div>
        </div>
      </div>
    </div>
  </div>
);
