
import React from 'react';
import { SidebarItem, AgentConfig } from '../types';
import { 
  Bot, LayoutGrid, ListTodo, PenTool, Code, BookOpen, Settings,
  ChevronRight, ChevronLeft
} from 'lucide-react';
import { 
  AgentFormView, ProjectListView, TaskListView, PromptListView, 
  SkillListView, KnowledgeView, SettingsView 
} from './SidebarViews';
import { 
  INITIAL_PROJECTS, INITIAL_TASKS, INITIAL_PROMPTS, INITIAL_SKILLS 
} from '../constants';

interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
  onSelectItem: (item: SidebarItem) => void;
  selectedItem: SidebarItem | null;
  agents: AgentConfig[];
  onSelectAgent: (id: string) => void;
  onAddAgent: (agent: AgentConfig) => void;
  activeAgentId: string | null;
}

const Sidebar: React.FC<SidebarProps> = ({ 
  isOpen, onToggle, onSelectItem, selectedItem, 
  agents, onSelectAgent, onAddAgent, activeAgentId
}) => {

  const menuItems: { name: SidebarItem; icon: React.ReactNode; color: string }[] = [
    { name: 'エージェント', icon: <Bot size={20} />, color: 'bg-blue-400' },
    { name: 'プロジェクト', icon: <LayoutGrid size={20} />, color: 'bg-cyan-400' },
    { name: 'タスク', icon: <ListTodo size={20} />, color: 'bg-blue-500' },
    { name: 'プロンプト', icon: <PenTool size={20} />, color: 'bg-pink-400' },
    { name: 'スキル', icon: <Code size={20} />, color: 'bg-yellow-400' },
    { name: 'メモ', icon: <BookOpen size={20} />, color: 'bg-green-400' },
    { name: '設定', icon: <Settings size={20} />, color: 'bg-gray-400' },
  ];

  const renderContent = () => {
    switch (selectedItem) {
      case 'エージェント':
        return (
          <div className="space-y-6">
            <div className="space-y-2">
              <h3 className="text-[10px] font-bold text-gray-300 uppercase tracking-widest ml-4">Current Agents</h3>
              {agents.map(agent => (
                <button key={agent.id} onClick={() => onSelectAgent(agent.id)}
                  className={`w-full p-4 rounded-[2rem] flex items-center gap-4 transition-all border-4 ${
                    activeAgentId === agent.id ? 'bg-blue-50 border-blue-200 shadow-md scale-[1.02]' : 'bg-white border-gray-50 hover:border-blue-100'
                  }`}>
                  <div className="w-10 h-10 rounded-2xl flex items-center justify-center text-white shadow-sm" style={{ backgroundColor: agent.color }}><Bot size={20} /></div>
                  <div className="text-left flex-1 overflow-hidden">
                    <p className="font-bold text-gray-700 truncate">{agent.nickname}</p>
                    <p className="text-[9px] text-gray-400 font-bold uppercase truncate">
                      {agent.selectedTaskId ? INITIAL_TASKS.find(t=>t.id===agent.selectedTaskId)?.name : 'At rest'}
                    </p>
                  </div>
                </button>
              ))}
            </div>
            <div className="pt-6 border-t border-gray-100">
               <AgentFormView agentsCount={agents.length} projects={INITIAL_PROJECTS} tasks={INITIAL_TASKS} prompts={INITIAL_PROMPTS} skills={INITIAL_SKILLS} onSave={onAddAgent} />
            </div>
          </div>
        );
      case 'プロジェクト': return <ProjectListView projects={INITIAL_PROJECTS} />;
      case 'タスク': return <TaskListView tasks={INITIAL_TASKS} />;
      case 'プロンプト': return <PromptListView prompts={INITIAL_PROMPTS} />;
      case 'スキル': return <SkillListView skills={INITIAL_SKILLS} />;
      case 'メモ': return <KnowledgeView />;
      case '設定': return <SettingsView />;
      default: return <div className="text-gray-400 text-center py-20 font-bold italic">メニューを選んでね</div>;
    }
  };

  return (
    <div className={`fixed top-0 left-0 h-full bg-white shadow-2xl transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] z-[300] flex ${isOpen ? 'w-[520px]' : 'w-0'}`}>
      <div className={`w-20 bg-[#fdfaf5] flex flex-col items-center py-8 gap-4 border-r border-orange-50 ${!isOpen && 'hidden'}`}>
        {menuItems.map((item) => (
          <button key={item.name} onClick={() => onSelectItem(item.name)}
            className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all active:scale-90 ${
              selectedItem === item.name ? `${item.color} text-white shadow-lg scale-110` : 'bg-white text-gray-300 hover:bg-gray-100 shadow-sm'
            }`}>
            {item.icon}
          </button>
        ))}
      </div>
      <div className={`flex-1 overflow-hidden flex flex-col ${!isOpen && 'opacity-0'}`}>
        <div className="p-8 flex justify-between items-center border-b border-gray-50 bg-white/50 backdrop-blur-sm sticky top-0 z-10">
          <h2 className="text-2xl font-bold text-gray-800 tracking-tight">{selectedItem}</h2>
          <button onClick={onToggle} className="p-2 text-gray-300 hover:text-gray-600"><ChevronLeft size={24} /></button>
        </div>
        <div className="flex-1 overflow-y-auto p-8 scrollbar-hide pb-24">{renderContent()}</div>
      </div>
      {!isOpen && (
        <button onClick={onToggle} 
          className="fixed left-6 top-1/2 -translate-y-1/2 w-14 h-14 bg-white rounded-full shadow-2xl flex items-center justify-center text-orange-400 border-4 border-orange-50 hover:scale-110 active:scale-90 transition-all z-[301]">
          <ChevronRight size={24} />
        </button>
      )}
    </div>
  );
};

export default Sidebar;
