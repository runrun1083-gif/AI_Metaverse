
import React, { useState, useMemo, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import OfficeFloor from './components/OfficeFloor';
import Robot from './components/Robot';
import BulletinBoardOverlay from './components/BulletinBoardOverlay';
import AgentProfileOverlay from './components/AgentProfileOverlay';
import { useViewport } from './hooks/useViewport';
import { useAgentManager } from './hooks/useAgentManager';
import { MAP_CONFIG, INITIAL_PROJECTS, INITIAL_TASKS, INITIAL_PROMPTS, INITIAL_SKILLS } from './constants';
import { SidebarItem, AgentConfig, Notice } from './types';
import { Send, ZoomIn, ZoomOut, RotateCcw } from 'lucide-react';

const App: React.FC = () => {
  const { viewportRef, zoom, offset, isDragging, performZoom, handleWheel, handleDrag, centerOn } = useViewport();
  const { 
    agents, setAgents, addAgent, messages, sendMessage, 
    activeAgentId, setActiveAgentId, isBotThinking,
    notices, setNotices, triggerMeeting, clearMeetingReactions
  } = useAgentManager();

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [selectedSidebarItem, setSelectedSidebarItem] = useState<SidebarItem | null>('エージェント');
  const [inputText, setInputText] = useState('');
  
  const [isBulletinOpen, setIsBulletinOpen] = useState(false);
  const [profileAgentId, setProfileAgentId] = useState<string | null>(null);
  const [isMeetingActive, setIsMeetingActive] = useState(false);

  const activeAgent = useMemo(() => agents.find(a => a.id === activeAgentId), [agents, activeAgentId]);
  const profileAgent = useMemo(() => agents.find(a => a.id === profileAgentId), [agents, profileAgentId]);

  useEffect(() => {
    if (agents.length === 0) {
      addAgent({
        id: 'default',
        nickname: 'ロボちゃん',
        color: '#60a5fa',
        selectedProjectId: 'p1',
        selectedTaskId: 't1',
        selectedPromptId: 'pr1',
        selectedSkillId: 's1'
      });
    }
  }, [agents, addAgent]);

  const handleSelectAgent = (id: string) => {
    setActiveAgentId(id);
    centerOn(MAP_CONFIG.CENTRAL_PLAZA.x, MAP_CONFIG.CENTRAL_PLAZA.y, 1.0);
    if (window.innerWidth < 768) setIsSidebarOpen(false);
  };

  const handleSend = () => {
    if (!inputText.trim()) return;
    sendMessage(inputText);
    setInputText('');
  };

  const handleAddNotice = async (notice: Notice) => {
    setNotices(prev => [notice, ...prev]);
    if (notice.category === '緊急会議') {
      setIsMeetingActive(true);
      centerOn(MAP_CONFIG.CENTRAL_PLAZA.x, MAP_CONFIG.CENTRAL_PLAZA.y, 1.2);
      const reactions = await triggerMeeting(notice);
      if (reactions) {
        setAgents(prev => prev.map(a => ({ ...a, reaction: reactions[a.id] || "ピピ！" })));
        setTimeout(() => {
          setIsMeetingActive(false);
          setAgents(prev => prev.map(a => ({ ...a, reaction: undefined })));
          clearMeetingReactions();
        }, 15000);
      }
    }
  };

  return (
    <div className="relative w-full h-screen bg-[#f0f7f4] overflow-hidden flex flex-col font-rounded selection:bg-orange-100">
      <main ref={viewportRef} onWheel={handleWheel}
        onMouseDown={handleDrag.onDown} onMouseMove={handleDrag.onMove} onMouseUp={handleDrag.onEnd} onMouseLeave={handleDrag.onEnd}
        className={`flex-1 relative overflow-hidden ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}>
        <div className="absolute inset-0 origin-top-left transition-transform duration-75 ease-out"
          style={{ transform: `translate(${offset.x}px, ${offset.y}px) scale(${zoom})` }}>
          <OfficeFloor onBulletinClick={() => setIsBulletinOpen(true)} />
          {agents.map((a) => (
            <Robot key={a.id} agent={a} isActive={activeAgentId === a.id} 
              isSpeaking={isBotThinking && activeAgentId === a.id}
              onClick={(id) => setProfileAgentId(id)}
              chatMessage={messages[messages.length-1]?.agentId === a.id ? messages[messages.length-1].text : undefined}
              meetingPoint={isMeetingActive ? MAP_CONFIG.CENTRAL_PLAZA : undefined}
            />
          ))}
        </div>
      </main>

      <Sidebar isOpen={isSidebarOpen} onToggle={() => setIsSidebarOpen(!isSidebarOpen)} 
        onSelectItem={setSelectedSidebarItem} selectedItem={selectedSidebarItem}
        agents={agents} onSelectAgent={handleSelectAgent} activeAgentId={activeAgentId} onAddAgent={addAgent} />

      <div className="fixed bottom-10 left-1/2 -translate-x-1/2 w-full max-w-2xl px-6 z-[400]">
        <div className="bg-white/90 backdrop-blur-2xl rounded-[32px] shadow-[0_20px_50px_rgba(0,0,0,0.1)] p-2 border-4 border-white flex items-center gap-2 transition-all focus-within:shadow-[0_20px_60px_rgba(0,0,0,0.15)] focus-within:scale-[1.02]">
          <input type="text" placeholder={activeAgent ? `${activeAgent.nickname}に話しかけるピ！` : "エージェントを選んでね"}
            className="flex-1 bg-transparent py-4 px-6 outline-none font-bold text-gray-700 placeholder-gray-300"
            value={inputText} onChange={e => setInputText(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleSend()} disabled={!activeAgent} />
          <button onClick={handleSend} disabled={!inputText.trim() || isBotThinking || !activeAgent}
            className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${inputText.trim() && !isBotThinking ? 'bg-orange-400 text-white shadow-lg hover:scale-110 active:scale-95' : 'bg-gray-100 text-gray-300'}`}>
            {isBotThinking ? <div className="w-5 h-5 border-3 border-white border-t-transparent rounded-full animate-spin"></div> : <Send size={20} />}
          </button>
        </div>
      </div>

      <div className="fixed top-6 right-6 flex flex-col gap-2 z-[280] bg-white/80 backdrop-blur p-2 rounded-2xl shadow-xl border-4 border-orange-50">
        <button onClick={() => performZoom(0.2)} className="p-2 hover:bg-orange-50 rounded-xl text-orange-400 active:scale-90"><ZoomIn size={20} /></button>
        <div className="text-[10px] font-black text-center text-orange-300">{Math.round(zoom*100)}%</div>
        <button onClick={() => performZoom(-0.2)} className="p-2 hover:bg-orange-50 rounded-xl text-orange-400 active:scale-90"><ZoomOut size={20} /></button>
        <button onClick={() => centerOn(MAP_CONFIG.CENTRAL_PLAZA.x, MAP_CONFIG.CENTRAL_PLAZA.y, MAP_CONFIG.DEFAULT_ZOOM)} className="p-2 text-gray-300 hover:text-gray-600"><RotateCcw size={18} /></button>
      </div>

      {isBulletinOpen && <BulletinBoardOverlay notices={notices} onClose={() => setIsBulletinOpen(false)} onAdd={handleAddNotice} onUpdate={(n) => setNotices(prev => prev.map(old => old.id === n.id ? n : old))} onDelete={(id) => setNotices(prev => prev.filter(n => n.id !== id))} />}
      {profileAgent && <AgentProfileOverlay agent={profileAgent} projects={INITIAL_PROJECTS} tasks={INITIAL_TASKS} prompts={INITIAL_PROMPTS} skills={INITIAL_SKILLS} onClose={() => setProfileAgentId(null)} onTalk={(id) => handleSelectAgent(id)} />}
    </div>
  );
};

export default App;
