
import React from 'react';
import { AgentConfig, TaskData, SkillData } from '../types';
import { X, Bot, ListTodo, Zap, MessageSquare } from 'lucide-react';

interface AgentProfileOverlayProps {
  agent: AgentConfig;
  tasks: TaskData[];
  skills: SkillData[];
  onClose: () => void;
  onTalk: (id: string) => void;
}

const AgentProfileOverlay: React.FC<AgentProfileOverlayProps> = ({ agent, tasks, skills, onClose, onTalk }) => {
  return (
    <div className="fixed inset-0 z-[500] flex items-center justify-center bg-black/20 backdrop-blur-sm p-4" onClick={onClose}>
      <div className="bg-white w-full max-w-md rounded-[3rem] border-8 border-orange-100 shadow-2xl overflow-hidden animate-in zoom-in duration-300" onClick={e => e.stopPropagation()}>
        <div className="h-32 relative" style={{ backgroundColor: agent.color }}>
          <button onClick={onClose} className="absolute top-4 right-4 w-10 h-10 bg-white/20 hover:bg-white/40 rounded-full flex items-center justify-center text-white"><X size={24} /></button>
          <div className="absolute -bottom-10 left-8">
            <div className="w-24 h-24 rounded-[2rem] border-8 border-white shadow-lg flex items-center justify-center" style={{ backgroundColor: agent.color }}>
              <Bot size={48} className="text-white" />
            </div>
          </div>
        </div>
        <div className="p-8 pt-12 space-y-6">
          <div>
            <div className="flex justify-between items-center mb-1">
              <h2 className="text-3xl font-bold text-gray-800">{agent.nickname}</h2>
              <span className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider ${agent.selectedTaskId ? 'bg-cyan-100 text-cyan-600' : 'bg-gray-100 text-gray-400'}`}>
                {agent.selectedTaskId ? 'タスク実行中' : 'ひま'}
              </span>
            </div>
            <p className="text-gray-400 font-bold text-sm tracking-widest uppercase">Agent Profile</p>
          </div>
          <div className="space-y-4">
            <div className="p-5 bg-gray-50 rounded-3xl border-2 border-transparent">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">プロンプト設定</p>
              <p className="text-gray-600 font-medium leading-relaxed">{agent.prompt || '未設定'}</p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="p-4 bg-cyan-50 rounded-3xl border-2 border-cyan-100">
                <div className="flex items-center gap-2 mb-1"><ListTodo size={14} className="text-cyan-500" /><span className="text-[10px] font-bold text-cyan-500 uppercase tracking-widest">現在のタスク</span></div>
                <p className="font-bold text-gray-700">{tasks.find(t => t.id === agent.selectedTaskId)?.name || 'なし'}</p>
              </div>
              <div className="p-4 bg-yellow-50 rounded-3xl border-2 border-yellow-100">
                <div className="flex items-center gap-2 mb-1"><Zap size={14} className="text-yellow-500" /><span className="text-[10px] font-bold text-yellow-500 uppercase tracking-widest">所有スキル</span></div>
                <p className="font-bold text-gray-700">{skills.find(s => s.id === agent.selectedSkillId)?.name || 'なし'}</p>
              </div>
            </div>
          </div>
          <button onClick={() => onTalk(agent.id)} className="w-full py-4 bg-blue-400 text-white rounded-2xl font-bold shadow-lg hover:bg-blue-500 transition-all flex items-center justify-center gap-2">
            <MessageSquare size={18} /> このエージェントと話す
          </button>
        </div>
      </div>
    </div>
  );
};

export default AgentProfileOverlay;
