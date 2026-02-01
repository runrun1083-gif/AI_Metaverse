
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import Sidebar from './components/Sidebar';
import OfficeFloor from './components/OfficeFloor';
import Robot from './components/Robot';
import AgentProfileOverlay from './components/AgentProfileOverlay';
import BulletinBoardOverlay from './components/BulletinBoardOverlay';
import { useViewport } from './hooks/useViewport';
import { useAgentManager } from './hooks/useAgentManager';
import { INITIAL_TASKS, INITIAL_SKILLS, MAP_CONFIG } from './constants';
import { 
  Send, Bot, RotateCcw, Plus, ZoomIn, ZoomOut, Bell 
} from 'lucide-react';

const App: React.FC = () => {
  // --- カスタムフックによるロジックの外部化 ---
  const { viewportRef, zoom, isDragging, performZoom, handleWheel, handleDrag, centerOn } = useViewport();
  const { 
    agents, addAgent, messages, sendMessage, 
    activeAgentId, setActiveAgentId, isBotThinking, 
    notices, setNotices, meetingReactions, setMeetingReactions, triggerMeeting 
  } = useAgentManager();

  // --- UI固有の状態 ---
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [selectedSidebarItem, setSelectedSidebarItem] = useState<any>(null);
  const [profileAgentId, setProfileAgentId] = useState<string | null>(null);
  const [isBulletinOpen, setIsBulletinOpen] = useState(false);
  const [isFading, setIsFading] = useState(false);
  const [isEmergencyMeeting, setIsEmergencyMeeting] = useState(false);
  const [inputText, setInputText] = useState('');

  const activeAgent = useMemo(() => agents.find(a => a.id === activeAgentId), [agents, activeAgentId]);
  const profileAgent = useMemo(() => agents.find(a => a.id === profileAgentId), [agents, profileAgentId]);

  // --- 緊急会議のハンドリング ---
  const handleNoticeAdd = useCallback(async (n: any) => {
    setNotices(p => [n, ...p]);
    if (n.category === '緊急会議') {
      setIsFading(true);
      setTimeout(async () => {
        setIsEmergencyMeeting(true);
        centerOn(MAP_CONFIG.CENTRAL_PLAZA.x, MAP_CONFIG.CENTRAL_PLAZA.y);
        setIsFading(false);
        
        await triggerMeeting(n);
        
        setTimeout(() => {
          setIsFading(true);
          setTimeout(() => {
            setIsEmergencyMeeting(false);
            setMeetingReactions({});
            performZoom(MAP_CONFIG.DEFAULT_ZOOM);
            setIsFading(false);
          }, 600);
        }, 10000);
      }, 600);
    }
  }, [setNotices, triggerMeeting, centerOn, performZoom, setMeetingReactions]);

  return (
    <div className="relative w-full h-screen bg-[#f8fdfa] overflow-hidden flex flex-col">
      {/* サイドパネル用バックドロップ（開閉のしやすさを向上） */}
      {isSidebarOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[295] animate-in fade-in" onClick={() => setIsSidebarOpen(false)} />
      )}

      <Sidebar 
        isOpen={isSidebarOpen} 
        onToggle={() => setIsSidebarOpen(!isSidebarOpen)} 
        onSelectItem={setSelectedSidebarItem} 
        selectedItem={selectedSidebarItem}
        onNewChat={() => { sendMessage('履歴をリセットするピ！'); setIsSidebarOpen(false); }}
        onSaveAgent={(a) => { addAgent(a); setIsSidebarOpen(false); }}
        agentsCount={agents.length} tasks={INITIAL_TASKS} skills={INITIAL_SKILLS}
      />

      <div className={`fixed inset-0 bg-black z-[1000] pointer-events-none transition-opacity duration-500 ${isFading ? 'opacity-100' : 'opacity-0'}`} />

      {isEmergencyMeeting && (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 z-[450] animate-bounce pointer-events-none">
          <div className="bg-red-500 text-white px-6 py-2 rounded-full shadow-2xl flex items-center gap-2 font-bold border-4 border-white">
            <Bell size={18} /><span>緊急会議中！</span>
          </div>
        </div>
      )}

      {/* エージェントセレクター */}
      <div className="fixed top-6 left-1/2 -translate-x-1/2 z-[350] bg-white/90 backdrop-blur-md px-6 py-3 rounded-full shadow-2xl border-4 border-orange-100 flex items-center gap-4">
        <div className="flex -space-x-3">
          {agents.length === 0 && <Bot className="text-gray-300 mx-2" />}
          {agents.map(a => (
            <button key={a.id} onClick={() => setActiveAgentId(a.id)}
              className={`w-10 h-10 rounded-full border-4 transition-all ${activeAgentId === a.id ? 'border-orange-400 scale-110 z-10' : 'border-white'}`}
              style={{ backgroundColor: a.color }} />
          ))}
        </div>
        <div className="text-sm font-bold text-gray-800">{activeAgent?.nickname || 'エージェントを選択'}</div>
      </div>

      <main 
        ref={viewportRef} 
        onWheel={(e) => handleWheel(e, isFading)}
        onMouseDown={handleDrag.onDown} onMouseMove={handleDrag.onMove} onMouseUp={handleDrag.onEnd} onMouseLeave={handleDrag.onEnd}
        className={`flex-1 overflow-auto scrollbar-hide relative bg-[#d6e9df] ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
      >
        <div className="relative origin-top-left transition-transform duration-150 ease-out" style={{ width: MAP_CONFIG.FLOOR_WIDTH * zoom, height: MAP_CONFIG.FLOOR_HEIGHT * zoom }}>
          <div className="absolute top-0 left-0 origin-top-left" style={{ width: MAP_CONFIG.FLOOR_WIDTH, height: MAP_CONFIG.FLOOR_HEIGHT, transform: `scale(${zoom})` }}>
            <OfficeFloor onBulletinClick={() => setIsBulletinOpen(true)} />
            {agents.map((a, i) => (
              <Robot 
                key={a.id} id={a.id} color={a.color} 
                isActive={activeAgentId === a.id} 
                isSpeaking={(isBotThinking && activeAgentId === a.id) || !!meetingReactions[a.id]}
                onClick={setProfileAgentId}
                forcedTarget={isEmergencyMeeting ? { x: MAP_CONFIG.CENTRAL_PLAZA.x + Math.cos(i)*200, y: MAP_CONFIG.CENTRAL_PLAZA.y + Math.sin(i)*150 } : null}
                message={meetingReactions[a.id] || (messages[messages.length-1]?.agentId === a.id ? messages[messages.length-1].text : undefined)}
              />
            ))}
          </div>
        </div>

        {/* ズームコントロール */}
        <div className="fixed top-6 right-6 flex flex-col gap-2 z-[280] bg-white/90 backdrop-blur p-2 rounded-2xl shadow-xl border-4 border-orange-50 pointer-events-auto">
          <button onClick={() => performZoom(zoom + 0.2)} className="p-2 hover:bg-orange-50 rounded-xl text-orange-500"><ZoomIn size={20} /></button>
          <div className="text-[10px] font-black text-center text-orange-400">{Math.round(zoom*100)}%</div>
          <button onClick={() => performZoom(zoom - 0.2)} className="p-2 hover:bg-orange-50 rounded-xl text-orange-500"><ZoomOut size={20} /></button>
          <button onClick={() => performZoom(MAP_CONFIG.DEFAULT_ZOOM)} className="p-2 text-gray-400"><RotateCcw size={18} /></button>
        </div>
      </main>

      {/* チャット入力 */}
      <div className="fixed bottom-10 left-1/2 -translate-x-1/2 w-full max-w-4xl px-4 z-[400]">
        <div className="bg-white/95 backdrop-blur-xl rounded-[40px] shadow-2xl p-2 border-4 border-orange-50 flex items-center gap-2">
          <button className="w-10 h-10 text-gray-400 hover:bg-gray-100 rounded-full flex items-center justify-center" onClick={() => setIsSidebarOpen(true)}><Plus size={20} /></button>
          <input type="text" placeholder={`${activeAgent?.nickname || 'エージェント'}に話しかける...`} className="flex-1 bg-transparent py-4 px-2 outline-none font-bold"
            value={inputText} onChange={e => setInputText(e.target.value)} onKeyDown={e => e.key === 'Enter' && (sendMessage(inputText), setInputText(''))} />
          <button onClick={() => (sendMessage(inputText), setInputText(''))} disabled={isBotThinking} className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${inputText.trim() ? 'bg-orange-500 text-white shadow-lg' : 'bg-gray-100 text-gray-300'}`}>
            {isBotThinking ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : <Send size={20} />}
          </button>
        </div>
      </div>

      {profileAgent && <AgentProfileOverlay agent={profileAgent} tasks={INITIAL_TASKS} skills={INITIAL_SKILLS} onClose={() => setProfileAgentId(null)} onTalk={id => { setActiveAgentId(id); setProfileAgentId(null); }} />}
      {isBulletinOpen && (
        <BulletinBoardOverlay 
          notices={notices} 
          onClose={() => setIsBulletinOpen(false)} 
          onAdd={handleNoticeAdd} 
          onUpdate={n => setNotices(p => p.map(x => x.id === n.id ? n : x))} 
          onDelete={id => setNotices(p => p.filter(x => x.id !== id))} 
        />
      )}
    </div>
  );
};

export default App;
