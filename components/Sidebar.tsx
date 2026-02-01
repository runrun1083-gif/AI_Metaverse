
import React from 'react';
import { SidebarItem, AgentConfig, TaskData, SkillData } from '../types';
import { AgentFormView, TaskListView, SkillListView, KnowledgeView } from './SidebarViews';
import { 
  Bot, MessageSquarePlus, History, Briefcase, 
  Zap, PenTool, BookOpen, Settings, ListTodo,
  ChevronRight, ChevronLeft
} from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
  onSelectItem: (item: SidebarItem) => void;
  selectedItem: SidebarItem | null;
  onNewChat: () => void;
  onSaveAgent: (agent: AgentConfig) => void;
  agentsCount: number;
  tasks: TaskData[];
  skills: SkillData[];
}

const Sidebar: React.FC<SidebarProps> = ({ 
  isOpen, onToggle, onSelectItem, selectedItem, 
  onNewChat, onSaveAgent, agentsCount, tasks, skills 
}) => {

  const menuItems: { name: SidebarItem; icon: React.ReactNode; color: string }[] = [
    { name: 'エージェント', icon: <Bot size={20} />, color: 'bg-blue-400' },
    { name: '新規チャット', icon: <MessageSquarePlus size={20} />, color: 'bg-orange-400' },
    { name: '履歴リスト', icon: <History size={20} />, color: 'bg-purple-400' },
    { name: 'プロジェクト', icon: <Briefcase size={20} />, color: 'bg-indigo-400' },
    { name: 'タスク', icon: <ListTodo size={20} />, color: 'bg-cyan-400' },
    { name: 'スキル', icon: <Zap size={20} />, color: 'bg-yellow-400' },
    { name: 'プロンプト', icon: <PenTool size={20} />, color: 'bg-pink-400' },
    { name: 'ナレッジ', icon: <BookOpen size={20} />, color: 'bg-green-400' },
    { name: '設定', icon: <Settings size={20} />, color: 'bg-gray-400' },
  ];

  const renderContent = () => {
    switch (selectedItem) {
      case 'エージェント':
        return <AgentFormView agentsCount={agentsCount} tasks={tasks} skills={skills} onSave={onSaveAgent} />;
      case 'タスク':
        return <TaskListView tasks={tasks} />;
      case 'スキル':
        return <SkillListView skills={skills} />;
      case 'ナレッジ':
        return <KnowledgeView />;
      case '履歴リスト':
      case 'プロジェクト':
      case 'プロンプト':
      case '設定':
        return <div className="text-gray-400 text-center py-10 font-bold">{selectedItem}は準備中です</div>;
      default:
        return <div className="text-gray-400 text-center py-10 font-bold">項目を選択してください</div>;
    }
  };

  return (
    <div className={`fixed top-0 left-0 h-full bg-white shadow-2xl transition-all duration-500 ease-in-out z-[300] flex ${isOpen ? 'w-[450px]' : 'w-0'}`}>
      <div className={`w-20 bg-gray-50 flex flex-col items-center py-8 gap-6 border-r border-gray-100 ${!isOpen && 'hidden'}`}>
        {menuItems.map((item) => (
          <button key={item.name} onClick={() => item.name === '新規チャット' ? onNewChat() : onSelectItem(item.name)}
            className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${selectedItem === item.name || (item.name === '新規チャット' && !selectedItem) ? `${item.color} text-white shadow-lg scale-110` : 'bg-white text-gray-400 hover:bg-gray-100 shadow-sm'}`}
            title={item.name}>
            {item.icon}
          </button>
        ))}
      </div>
      <div className={`flex-1 overflow-hidden flex flex-col ${!isOpen && 'opacity-0'}`}>
        <div className="p-8 flex justify-between items-center border-b border-gray-50">
          <h2 className="text-2xl font-bold text-gray-800 tracking-tight">{selectedItem || 'メニュー'}</h2>
          <button onClick={onToggle} className="p-2 text-gray-400 hover:text-gray-600"><ChevronLeft size={24} /></button>
        </div>
        <div className="flex-1 overflow-y-auto p-8 scrollbar-hide">{renderContent()}</div>
        <div className="p-6 bg-gray-50/50 text-[10px] text-center text-gray-300 font-bold tracking-widest uppercase">Cozy Office System v1.2</div>
      </div>
      {!isOpen && (
        <div className="absolute -right-14 top-1/2 -translate-y-1/2">
          <button onClick={onToggle} className="w-12 h-12 bg-white rounded-full shadow-2xl flex items-center justify-center text-orange-400 border-2 border-orange-100 animate-pulse"><ChevronRight size={24} /></button>
        </div>
      )}
    </div>
  );
};

export default Sidebar;
