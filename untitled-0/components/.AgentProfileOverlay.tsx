
import React from 'react';
import { AgentConfig, ProjectData, TaskData, PromptData, SkillData } from '../types';
import { X, Bot, Target, ListTodo, MessageSquareText, Code, MessageSquare } from 'lucide-react';

interface AgentProfileOverlayProps {
  agent: AgentConfig;
  projects: ProjectData[];
  tasks: TaskData[];
  prompts: PromptData[];
  skills: SkillData[];
  onClose: () => void;
  onTalk: (id: string) => void;
}

const AgentProfileOverlay: React.FC<AgentProfileOverlayProps> = ({ 
  agent, projects, tasks, prompts, skills, onClose, onTalk 
}) => {
  const project = projects.find(p => p.id === agent.selectedProjectId);
  const task = tasks.find(t => t.id === agent.selectedTaskId);
  const prompt = prompts.find(p => p.id === agent.selectedPromptId);
  const skill = skills.find(s => s.id === agent.selectedSkillId);

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
            <h2 className="text-3xl font-bold text-gray-800">{agent.nickname}</h2>
            <p className="text-gray-400 font-bold text-xs tracking-widest uppercase">Agent Profile</p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="p-4 bg-cyan-50 rounded-3xl border-2 border-cyan-100">
              <div className="flex items-center gap-2 mb-1"><Target size={14} className="text-cyan-500"/><span className="text-[9px] font-bold text-cyan-500 uppercase tracking-widest">Project</span></div>
              <p className="font-bold text-gray-700 text-xs truncate">{project?.name || '未アサイン'}</p>
            </div>
            <div className="p-4 bg-blue-50 rounded-3xl border-2 border-blue-100">
              <div className="flex items-center gap-2 mb-1"><ListTodo size={14} className="text-blue-500"/><span className="text-[9px] font-bold text-blue-500 uppercase tracking-widest">Task</span></div>
              <p className="font-bold text-gray-700 text-xs truncate">{task?.name || '未アサイン'}</p>
            </div>
            <div className="p-4 bg-pink-50 rounded-3xl border-2 border-pink-100">
              <div className="flex items-center gap-2 mb-1"><MessageSquareText size={14} className="text-pink-500"/><span className="text-[9px] font-bold text-pink-500 uppercase tracking-widest">Prompt</span></div>
              <p className="font-bold text-gray-700 text-xs truncate">{prompt?.name || '未設定'}</p>
            </div>
            <div className="p-4 bg-yellow-50 rounded-3xl border-2 border-yellow-100">
              <div className="flex items-center gap-2 mb-1"><Code size={14} className="text-yellow-500"/><span className="text-[9px] font-bold text-yellow-500 uppercase tracking-widest">Skill</span></div>
              <p className="font-bold text-gray-700 text-xs truncate">{skill?.name || '未習得'}</p>
            </div>
          </div>

          {skill?.code && (
            <div className="p-4 bg-gray-900 rounded-2xl overflow-hidden">
               <p className="text-[8px] font-bold text-gray-500 uppercase tracking-widest mb-2">Skill Logic</p>
               <code className="text-[9px] text-green-400 font-mono block overflow-x-auto whitespace-nowrap">{skill.code}</code>
            </div>
          )}

          <button onClick={() => onTalk(agent.id)} className="w-full py-4 bg-blue-400 text-white rounded-2xl font-bold shadow-lg hover:bg-blue-500 transition-all flex items-center justify-center gap-2 active:scale-95">
            <MessageSquare size={18} /> このエージェントと話す
          </button>
        </div>
      </div>
    </div>
  );
};

export default AgentProfileOverlay;
