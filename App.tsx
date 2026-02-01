
import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { Message, SidebarItem, Position, AgentConfig, Notice } from './types';
import Sidebar from './components/Sidebar';
import OfficeFloor from './components/OfficeFloor';
import Robot from './components/Robot';
import AgentProfileOverlay from './components/AgentProfileOverlay';
import BulletinBoardOverlay from './components/BulletinBoardOverlay';
import { getRobotResponse, getMeetingReaction } from './services/geminiService';
import { INITIAL_TASKS, INITIAL_SKILLS, MAP_CONFIG } from './constants';
import { 
  Send, Bot, RotateCcw, Paperclip, Plus, Mic, 
  ThumbsUp, ThumbsDown, ChevronDown, Bell, ZoomIn, ZoomOut, Search 
} from 'lucide-react';

const App: React.FC = () => {
  // --- 状態管理 (UI系) ---
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [selectedSidebarItem, setSelectedSidebarItem] = useState<SidebarItem | null>(null);
  const [activeAgentId, setActiveAgentId] = useState<string | null>(null);
  const [profileAgentId, setProfileAgentId] = useState<string | null>(null);
  const [isBulletinOpen, setIsBulletinOpen] = useState(false);
  const [isFading, setIsFading] = useState(false);
  const [isEmergencyMeeting, setIsEmergencyMeeting] = useState(false);

  // --- 状態管理 (データ系) ---
  const [agents, setAgents] = useState<AgentConfig[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [notices, setNotices] = useState<Notice[]>([]);
  const [inputText, setInputText] = useState('');
  const [isBotThinking, setIsBotThinking] = useState(false);
  const [meetingReactions, setMeetingReactions] = useState<Record<string, string>>({});
  
  // マップ上の座標管理
  const [agentPositions, setAgentPositions] = useState<Record<string, Position>>({});
  const [zoom, setZoom] = useState(MAP_CONFIG.DEFAULT_ZOOM);
  const [isDragging, setIsDragging] = useState(false);

  const viewportRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const dragStartRef = useRef({ x: 0, y: 0, scrollLeft: 0, scrollTop: 0 });

  // --- 算定値 ---
  const activeAgent = useMemo(() => agents.find(a => a.id === activeAgentId), [agents, activeAgentId]);
  const profileAgent = useMemo(() => agents.find(a => a.id === profileAgentId), [agents, profileAgentId]);

  // --- 座標・ズーム操作ロジック ---
  const performZoom = useCallback((newZoom: number, pivotX?: number, pivotY?: number) => {
    const v = viewportRef.current;
    if (!v) return;
    const boundedZoom = Math.min(Math.max(newZoom, MAP_CONFIG.MIN_ZOOM), MAP_CONFIG.MAX_ZOOM);
    const oldZoom = zoom;
    const px = pivotX ?? v.clientWidth / 2;
    const py = pivotY ?? v.clientHeight / 2;
    const mapX = (v.scrollLeft + px) / oldZoom;
    const mapY = (v.scrollTop + py) / oldZoom;
    setZoom(boundedZoom);
    requestAnimationFrame(() => {
      v.scrollLeft = (mapX * boundedZoom) - px;
      v.scrollTop = (mapY * boundedZoom) - py;
    });
  }, [zoom]);

  const handleWheel = (e: React.WheelEvent) => {
    if (isFading) return;
    e.preventDefault();
    const rect = viewportRef.current?.getBoundingClientRect();
    if (rect) performZoom(zoom + (e.deltaY > 0 ? -0.05 : 0.05), e.clientX - rect.left, e.clientY - rect.top);
  };

  // --- イベントハンドラ ---
  const handleSendMessage = async () => {
    if (!inputText.trim() || isBotThinking || !activeAgentId) return;
    const userMsg: Message = { id: Date.now().toString(), role: 'user', text: inputText, timestamp: new Date() };
    setMessages(prev => [...prev, userMsg]);
    setInputText('');
    setIsBotThinking(true);
    const botText = await getRobotResponse(inputText);
    setMessages(prev => [...prev, { id: (Date.now()+1).toString(), role: 'bot', text: botText, timestamp: new Date(), agentId: activeAgentId }]);
    setIsBotThinking(false);
  };

  const handleTriggerMeeting = useCallback(async (notice: Notice) => {
    if (notice.category !== '緊急会議') return;
    setIsFading(true);
    setTimeout(() => {
      setIsEmergencyMeeting(true);
      performZoom(1.2, MAP_CONFIG.CENTRAL_PLAZA.x, MAP_CONFIG.CENTRAL_PLAZA.y);
      setIsFading(false);
      
      Promise.allSettled(agents.map(a => getMeetingReaction(a.nickname, notice.content)))
        .then(results => {
          const reactions: Record<string, string> = {};
          results.forEach((res, i) => {
            if (res.status === 'fulfilled') reactions[agents[i].id] = res.value;
          });
          setMeetingReactions(reactions);
          setTimeout(() => {
            setIsFading(true);
            setTimeout(() => {
              setIsEmergencyMeeting(false);
              setMeetingReactions({});
              performZoom(MAP_CONFIG.DEFAULT_ZOOM);
              setIsFading(false);
            }, 600);
          }, 10000);
        });
    }, 600);
  }, [agents, performZoom]);

  const handlePositionUpdate = useCallback((id: string, pos: Position) => {
    setAgentPositions(prev => ({ ...prev, [id]: pos }));
  }, []);

  // --- ドラッグ制御 ---
  const handleDrag = {
    onDown: (e: React.MouseEvent) => {
      if (!viewportRef.current) return;
      setIsDragging(true);
      dragStartRef.current = { x: e.pageX - viewportRef.current.offsetLeft, y: e.pageY - viewportRef.current.offsetTop, scrollLeft: viewportRef.current.scrollLeft, scrollTop: viewportRef.current.scrollTop };
    },
    onMove: (e: React.MouseEvent) => {
      if (!isDragging || !viewportRef.current) return;
      const x = e.pageX - viewportRef.current.offsetLeft, y = e.pageY - viewportRef.current.offsetTop;
      viewportRef.current.scrollLeft = dragStartRef.current.scrollLeft - (x - dragStartRef.current.x);
      viewportRef.current.scrollTop = dragStartRef.current.scrollTop - (y - dragStartRef.current.y);
    },
    onEnd: () => setIsDragging(false)
  };

  return (
    <div className="relative w-full h-screen bg-[#f8fdfa] overflow-hidden flex flex-col">
      {/* サイドパネル用バックドロップ（開いている時のみ表示） */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[295] animate-in fade-in duration-300"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      <Sidebar 
        isOpen={isSidebarOpen} onToggle={() => setIsSidebarOpen(!isSidebarOpen)} 
        onSelectItem={setSelectedSidebarItem} selectedItem={selectedSidebarItem}
        onNewChat={() => {
          setMessages([]);
          setIsSidebarOpen(false); // チャットリセット時に閉じる
        }}
        onSaveAgent={(a) => { 
          setAgents(p => [...p, a]); 
          if(!activeAgentId) setActiveAgentId(a.id); 
          setIsSidebarOpen(false); // エージェント保存時に閉じる
        }}
        agentsCount={agents.length} tasks={INITIAL_TASKS} skills={INITIAL_SKILLS}
      />

      <div className={`fixed inset-0 bg-black z-[1000] pointer-events-none transition-opacity duration-500 ${isFading ? 'opacity-100' : 'opacity-0'}`}></div>

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
          {agents.map(a => (
            <button key={a.id} onClick={() => setActiveAgentId(a.id)}
              className={`w-10 h-10 rounded-full border-4 transition-all ${activeAgentId === a.id ? 'border-orange-400 scale-110 z-10' : 'border-white'}`}
              style={{ backgroundColor: a.color }} />
          ))}
        </div>
        <div className="text-sm font-bold text-gray-800">{activeAgent?.nickname || 'No Agent'}</div>
      </div>

      <main 
        ref={viewportRef} onWheel={handleWheel}
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
                onPositionUpdate={handlePositionUpdate} onClick={setProfileAgentId}
                floorWidth={MAP_CONFIG.FLOOR_WIDTH} floorHeight={MAP_CONFIG.FLOOR_HEIGHT}
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
          <button onClick={() => { setZoom(0.8); }} className="p-2 text-gray-400"><RotateCcw size={18} /></button>
        </div>
      </main>

      {/* チャット入力 */}
      <div className="fixed bottom-10 left-1/2 -translate-x-1/2 w-full max-w-4xl px-4 z-[400]">
        <div className="bg-white/95 backdrop-blur-xl rounded-[40px] shadow-2xl p-2 border-4 border-orange-50 flex items-center gap-2">
          <button className="w-10 h-10 text-gray-400 hover:bg-gray-100 rounded-full flex items-center justify-center"><Plus size={20} /></button>
          <input type="text" placeholder={`${activeAgent?.nickname || 'エージェント'}に話しかける...`} className="flex-1 bg-transparent py-4 px-2 outline-none font-bold"
            value={inputText} onChange={e => setInputText(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleSendMessage()} />
          <button onClick={handleSendMessage} disabled={isBotThinking} className={`w-12 h-12 rounded-full flex items-center justify-center ${inputText.trim() ? 'bg-orange-500 text-white shadow-lg' : 'bg-gray-100 text-gray-300'}`}>
            {isBotThinking ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : <Send size={20} />}
          </button>
        </div>
      </div>

      {profileAgent && <AgentProfileOverlay agent={profileAgent} tasks={INITIAL_TASKS} skills={INITIAL_SKILLS} onClose={() => setProfileAgentId(null)} onTalk={id => { setActiveAgentId(id); setProfileAgentId(null); }} />}
      {isBulletinOpen && <BulletinBoardOverlay notices={notices} onClose={() => setIsBulletinOpen(false)} onAdd={n => { setNotices(p => [n, ...p]); handleTriggerMeeting(n); }} onUpdate={n => setNotices(p => p.map(x => x.id === n.id ? n : x))} onDelete={id => setNotices(p => p.filter(x => x.id !== id))} />}
    </div>
  );
};

export default App;
