
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Message, SidebarItem, Position, AgentConfig, TaskData, SkillData, Notice } from './types';
import Sidebar from './components/Sidebar';
import OfficeFloor from './components/OfficeFloor';
import Robot from './components/Robot';
import AgentProfileOverlay from './components/AgentProfileOverlay';
import BulletinBoardOverlay from './components/BulletinBoardOverlay';
import { getRobotResponse, getMeetingReaction } from './services/geminiService';
import { 
  Send, Bot, RotateCcw, Search,
  Paperclip, Plus, Mic, ThumbsUp, ThumbsDown, ChevronDown, Bell,
  ZoomIn, ZoomOut
} from 'lucide-react';

const FLOOR_WIDTH = 3000;
const FLOOR_HEIGHT = 2000;
const CENTRAL_PLAZA = { x: 1500, y: 1000 };

const App: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<SidebarItem | null>(null);
  const [agents, setAgents] = useState<AgentConfig[]>([]);
  const [activeAgentId, setActiveAgentId] = useState<string | null>(null);
  const [isBotThinking, setIsBotThinking] = useState(false);
  const [agentPositions, setAgentPositions] = useState<Record<string, Position>>({});
  const [zoom, setZoom] = useState(0.8);
  const [isDragging, setIsDragging] = useState(false);
  const [profileAgentId, setProfileAgentId] = useState<string | null>(null);
  const [isBulletinOpen, setIsBulletinOpen] = useState(false);
  const [notices, setNotices] = useState<Notice[]>([]);
  
  const [isEmergencyMeeting, setIsEmergencyMeeting] = useState(false);
  const [meetingReactionMessages, setMeetingReactionMessages] = useState<Record<string, string>>({});
  const [isFading, setIsFading] = useState(false);

  const tasks: TaskData[] = [
    { id: 't1', name: '書類の整理', description: 'オフィス内の書類を整理します。' },
    { id: 't2', name: 'コーヒーの補充', description: 'コーヒー豆をチェックします。' },
    { id: 't3', name: 'コードレビュー', description: 'AIプログラム of バグを見つけます。' },
  ];

  const skills: SkillData[] = [
    { id: 's1', name: '高速計算', tags: '数学', description: '計算を瞬時に行います。', program: '' },
    { id: 's2', name: '翻訳', tags: '言語', description: '翻訳が可能です。', program: '' },
    { id: 's3', name: '画像生成', tags: '制作', description: '画像を生成します。', program: '' },
  ];

  const viewportRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const dragStartRef = useRef({ x: 0, y: 0, scrollLeft: 0, scrollTop: 0 });

  useEffect(() => {
    if (viewportRef.current) {
      viewportRef.current.scrollLeft = (FLOOR_WIDTH * zoom - viewportRef.current.clientWidth) / 2;
      viewportRef.current.scrollTop = (FLOOR_HEIGHT * zoom - viewportRef.current.clientHeight) / 2;
    }
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const activeAgent = agents.find(a => a.id === activeAgentId);
  const profileAgent = agents.find(a => a.id === profileAgentId);

  // 指定した中心点(clientX, clientY)を維持したままズームする関数
  const performZoom = useCallback((newZoom: number, pivotX?: number, pivotY?: number) => {
    const viewport = viewportRef.current;
    if (!viewport) return;

    const boundedZoom = Math.min(Math.max(newZoom, 0.3), 2.0);
    const oldZoom = zoom;

    // ピボット点（画面上の座標）を決定（指定がない場合は画面中央）
    const px = pivotX ?? viewport.clientWidth / 2;
    const py = pivotY ?? viewport.clientHeight / 2;

    // マップ上の絶対座標（ズーム前のスケール）を計算
    const mapX = (viewport.scrollLeft + px) / oldZoom;
    const mapY = (viewport.scrollTop + py) / oldZoom;

    // ズーム更新
    setZoom(boundedZoom);

    // 新しいスクロール位置を計算（絶対座標 * 新ズーム - 画面上の位置）
    // 即座に反映させるためにDOMを直接操作
    viewport.scrollLeft = (mapX * boundedZoom) - px;
    viewport.scrollTop = (mapY * boundedZoom) - py;
  }, [zoom]);

  const handleWheel = (e: React.WheelEvent) => {
    if (isFading) return;
    e.preventDefault();
    const delta = e.deltaY > 0 ? -0.05 : 0.05;
    
    // マウスカーソルの位置を取得
    const rect = viewportRef.current?.getBoundingClientRect();
    if (rect) {
      const clientX = e.clientX - rect.left;
      const clientY = e.clientY - rect.top;
      performZoom(zoom + delta, clientX, clientY);
    }
  };

  const handleSendMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputText.trim() || isBotThinking || !activeAgentId) return;

    const userMsg: Message = { id: Date.now().toString(), role: 'user', text: inputText, timestamp: new Date() };
    setMessages(prev => [...prev, userMsg]);
    setInputText('');
    setIsBotThinking(true);

    const botText = await getRobotResponse(inputText);
    const botMsg: Message = { id: (Date.now() + 1).toString(), role: 'bot', text: botText, timestamp: new Date(), agentId: activeAgentId };

    setIsBotThinking(false);
    setMessages(prev => [...prev, botMsg]);
  };

  const triggerMeetingEvent = useCallback(async (notice: Notice) => {
    if (notice.category !== '緊急会議') return;
    setIsFading(true);
    
    setTimeout(async () => {
      setIsEmergencyMeeting(true);
      
      // 中央を起点にズームアップ
      const targetZoom = 1.2;
      setZoom(targetZoom);
      
      if (viewportRef.current) {
        viewportRef.current.scrollLeft = (CENTRAL_PLAZA.x * targetZoom - viewportRef.current.clientWidth / 2);
        viewportRef.current.scrollTop = (CENTRAL_PLAZA.y * targetZoom - viewportRef.current.clientHeight / 2);
      }

      setTimeout(() => setIsFading(false), 300);

      setTimeout(async () => {
        const reactions: Record<string, string> = {};
        for (const agent of agents) {
          const reaction = await getMeetingReaction(agent.nickname, notice.content);
          reactions[agent.id] = reaction;
          setMeetingReactionMessages(prev => ({ ...prev, [agent.id]: reaction }));
        }
        
        setTimeout(() => {
          setIsFading(true);
          setTimeout(() => {
            setIsEmergencyMeeting(false);
            setMeetingReactionMessages({});
            setZoom(0.8);
            setIsFading(false);
          }, 600);
        }, 12000);
      }, 4000);
    }, 600);
  }, [agents]);

  const handleAddNotice = (notice: Notice) => {
    setNotices(prev => [notice, ...prev]);
    triggerMeetingEvent(notice);
  };
  
  const handleUpdateNotice = (updated: Notice) => {
    setNotices(prev => prev.map(n => n.id === updated.id ? updated : n));
    if (updated.category === '緊急会議') triggerMeetingEvent(updated);
  };
  
  const handleDeleteNotice = (id: string) => setNotices(prev => prev.filter(n => n.id !== id));

  const onPositionChange = useCallback((id: string, pos: Position) => {
    setAgentPositions(prev => ({ ...prev, [id]: pos }));
  }, []);

  // Fix: Added handleEvaluation function to update message evaluation state
  const handleEvaluation = (id: string, evaluation: 'good' | 'bad') => {
    setMessages(prev => prev.map(m => m.id === id ? { ...m, evaluation } : m));
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (viewportRef.current) {
      setIsDragging(true);
      dragStartRef.current = { 
        x: e.pageX - viewportRef.current.offsetLeft, 
        y: e.pageY - viewportRef.current.offsetTop, 
        scrollLeft: viewportRef.current.scrollLeft, 
        scrollTop: viewportRef.current.scrollTop 
      };
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !viewportRef.current) return;
    const x = e.pageX - viewportRef.current.offsetLeft;
    const y = e.pageY - viewportRef.current.offsetTop;
    viewportRef.current.scrollLeft = dragStartRef.current.scrollLeft - (x - dragStartRef.current.x);
    viewportRef.current.scrollTop = dragStartRef.current.scrollTop - (y - dragStartRef.current.y);
  };

  return (
    <div className="relative w-full h-screen bg-[#f8fdfa] overflow-hidden flex flex-col font-['M_PLUS_Rounded_1c']">
      <Sidebar 
        isOpen={isSidebarOpen} onToggle={() => setIsSidebarOpen(!isSidebarOpen)} 
        onSelectItem={setSelectedItem} selectedItem={selectedItem}
        onNewChat={() => { setMessages([]); setIsSidebarOpen(false); }}
        onSaveAgent={(agent) => {
          setAgents(prev => {
            const newAgents = [...prev, agent];
            if (!activeAgentId) setActiveAgentId(agent.id);
            return newAgents;
          });
          setSelectedItem(null);
          setIsSidebarOpen(false);
        }} agentsCount={agents.length}
        tasks={tasks} skills={skills}
      />

      <div className={`fixed inset-0 bg-black z-[1000] pointer-events-none transition-opacity duration-500 ${isFading ? 'opacity-100' : 'opacity-0'}`}></div>

      {isEmergencyMeeting && (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 z-[450] animate-bounce pointer-events-none">
          <div className="bg-red-500 text-white px-6 py-2 rounded-full shadow-2xl flex items-center gap-2 font-bold border-4 border-white">
            <Bell className="animate-pulse" size={18} />
            <span>緊急会議が行われています！</span>
          </div>
        </div>
      )}

      <div className="fixed top-6 left-1/2 -translate-x-1/2 z-[350] flex items-center gap-3">
        <div className="bg-white/90 backdrop-blur-md px-6 py-3 rounded-full shadow-2xl border-4 border-orange-100 flex items-center gap-4 group">
          <div className="flex -space-x-3">
            {agents.length === 0 && <div className="w-10 h-10 rounded-full bg-gray-100 border-2 border-white flex items-center justify-center text-gray-400"><Bot size={20} /></div>}
            {agents.map(agent => (
              <button key={agent.id} onClick={() => setActiveAgentId(agent.id)}
                className={`w-12 h-12 rounded-full border-4 transition-all hover:scale-110 ${activeAgentId === agent.id ? 'border-orange-400 scale-110 z-10' : 'border-white z-0'}`}
                style={{ backgroundColor: agent.color }} title={agent.nickname} />
            ))}
          </div>
          <div className="h-6 w-px bg-gray-200"></div>
          <div className="flex flex-col"><span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Talking to</span><span className="text-sm font-bold text-gray-800">{activeAgent?.nickname || 'No Agent'}</span></div>
          <ChevronDown size={18} className="text-gray-300 group-hover:text-orange-400 transition-colors" />
        </div>
      </div>

      <main 
        ref={viewportRef} 
        onMouseDown={handleMouseDown} 
        onMouseMove={handleMouseMove} 
        onMouseUp={() => setIsDragging(false)} 
        onMouseLeave={() => setIsDragging(false)}
        onWheel={handleWheel}
        className={`flex-1 overflow-auto scrollbar-hide relative bg-[#d6e9df] ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
      >
        {/* transition-all duration-700 を削除してホイール操作時のレスポンスを向上。transformのみに適用するか緊急時のみにするのがベスト */}
        <div className="relative origin-top-left transition-transform duration-300 ease-out" style={{ width: FLOOR_WIDTH * zoom, height: FLOOR_HEIGHT * zoom }}>
          <div className="absolute top-0 left-0 origin-top-left" style={{ width: FLOOR_WIDTH, height: FLOOR_HEIGHT, transform: `scale(${zoom})` }}>
            <OfficeFloor onBulletinClick={() => setIsBulletinOpen(true)} />
            
            {agents.map((agent, index) => {
              const forcedTarget = isEmergencyMeeting ? {
                x: CENTRAL_PLAZA.x + (Math.cos(index * 1.2) * 200),
                y: CENTRAL_PLAZA.y + 150 + (Math.sin(index * 1.2) * 100)
              } : null;

              return (
                <div key={agent.id} className="absolute inset-0 z-[250] pointer-events-none">
                  <Robot 
                    id={agent.id} color={agent.color} 
                    isActive={activeAgentId === agent.id} 
                    isSpeaking={(isBotThinking && activeAgentId === agent.id) || !!meetingReactionMessages[agent.id]} 
                    onPositionChange={onPositionChange} onClick={setProfileAgentId} 
                    floorWidth={FLOOR_WIDTH} floorHeight={FLOOR_HEIGHT}
                    forcedTarget={forcedTarget}
                  />

                  {meetingReactionMessages[agent.id] && (
                    <div className="absolute transition-all duration-200 pointer-events-none z-[260]" style={{ left: `${agentPositions[agent.id]?.x || 0}px`, top: `${agentPositions[agent.id]?.y || 0}px`, transform: 'translate(-50%, -150px)' }}>
                      <div className="bg-white px-4 py-2 rounded-2xl border-2 border-red-400 shadow-lg relative animate-bounce">
                        <p className="text-gray-800 text-xs font-bold text-center whitespace-nowrap">{meetingReactionMessages[agent.id]}</p>
                        <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-white border-r-2 border-b-2 border-red-400 rotate-45"></div>
                      </div>
                    </div>
                  )}

                  {!isEmergencyMeeting && messages.length > 0 && messages[messages.length - 1].role === 'bot' && messages[messages.length - 1].agentId === agent.id && (
                    <div className="absolute transition-all duration-200 pointer-events-none z-[260]" style={{ left: `${agentPositions[agent.id]?.x || 0}px`, top: `${agentPositions[agent.id]?.y || 0}px`, transform: 'translate(-50%, -150px)' }}>
                      <div className="bg-white p-6 rounded-[3rem] border-4 border-blue-400 shadow-[0_12px_0_rgba(0,0,0,0.1)] max-w-sm relative animate-in fade-in zoom-in slide-in-from-bottom-4">
                        <p className="text-gray-800 text-lg font-bold leading-relaxed text-center">{messages[messages.length - 1].text}</p>
                        <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-6 h-6 bg-white border-r-4 border-b-4 border-blue-400 rotate-45"></div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {profileAgent && <AgentProfileOverlay agent={profileAgent} tasks={tasks} skills={skills} onClose={() => setProfileAgentId(null)} onTalk={(id) => { setActiveAgentId(id); setProfileAgentId(null); }} />}
        
        {isBulletinOpen && (
          <BulletinBoardOverlay 
            notices={notices} 
            onClose={() => setIsBulletinOpen(false)} 
            onAdd={handleAddNotice} 
            onUpdate={handleUpdateNotice} 
            onDelete={handleDeleteNotice} 
          />
        )}

        <div className="fixed top-6 right-6 flex flex-col gap-2 z-[280] pointer-events-none">
          <div className="bg-white/90 backdrop-blur-md p-1.5 rounded-2xl shadow-xl border-4 border-orange-50 flex flex-col items-center gap-1 pointer-events-auto">
            <button 
              onClick={() => performZoom(zoom + 0.1)} 
              className="p-2 hover:bg-orange-50 rounded-xl text-orange-500 transition-colors"
              title="ズームイン"
            >
              <ZoomIn size={20} />
            </button>
            <div className="h-px w-8 bg-orange-100 my-1"></div>
            <div className="py-1 flex flex-col items-center">
              <Search size={14} className="text-orange-400 mb-0.5" />
              <div className="text-[10px] font-black text-orange-400">{Math.round(zoom * 100)}%</div>
            </div>
            <div className="h-px w-8 bg-orange-100 my-1"></div>
            <button 
              onClick={() => performZoom(zoom - 0.1)} 
              className="p-2 hover:bg-orange-50 rounded-xl text-orange-500 transition-colors"
              title="ズームアウト"
            >
              <ZoomOut size={20} />
            </button>
            <div className="h-px w-8 bg-orange-100 my-1"></div>
            <button 
              onClick={() => {
                setZoom(0.8);
                if (viewportRef.current) {
                   viewportRef.current.scrollLeft = (FLOOR_WIDTH * 0.8 - viewportRef.current.clientWidth) / 2;
                   viewportRef.current.scrollTop = (FLOOR_HEIGHT * 0.8 - viewportRef.current.clientHeight) / 2;
                }
              }} 
              className="p-2 hover:bg-orange-50 rounded-xl text-gray-400 hover:text-orange-400 transition-colors"
              title="リセット"
            >
              <RotateCcw size={18} />
            </button>
          </div>
        </div>

        <div className="fixed bottom-40 left-8 w-80 max-h-[50vh] overflow-y-auto z-[270] pointer-events-none scrollbar-hide flex flex-col gap-3 p-4">
           {messages.slice(-8).map(msg => (
             <div key={msg.id} className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'} animate-in slide-in-from-bottom-2 duration-300`}>
               <div className={`px-5 py-3 rounded-2xl text-sm font-bold shadow-md backdrop-blur-md max-w-full ${msg.role === 'user' ? 'bg-blue-500/90 text-white' : 'bg-white/90 text-gray-700 border border-white/50'}`}>
                 {msg.text}
                 {msg.role === 'bot' && (
                   <div className="mt-2 flex gap-2 justify-end opacity-50 hover:opacity-100 pointer-events-auto transition-opacity">
                     <button onClick={() => handleEvaluation(msg.id, 'good')} className={`p-1 rounded-md ${msg.evaluation === 'good' ? 'text-blue-500' : 'text-gray-400'}`}><ThumbsUp size={14} /></button>
                     <button onClick={() => handleEvaluation(msg.id, 'bad')} className={`p-1 rounded-md ${msg.evaluation === 'bad' ? 'text-red-500' : 'text-gray-400'}`}><ThumbsDown size={14} /></button>
                   </div>
                 )}
               </div>
             </div>
           ))}
           <div ref={messagesEndRef} />
        </div>
      </main>

      <div className="fixed bottom-10 left-1/2 -translate-x-1/2 w-full max-w-4xl px-4 z-[400]">
        {!activeAgentId ? (
          <div className="bg-white/90 backdrop-blur-xl p-8 rounded-[40px] border-4 border-orange-200 shadow-2xl flex flex-col items-center gap-4 text-center">
             <Bot size={40} className="text-orange-400 animate-bounce" /><p className="text-gray-600 font-bold">サイドメニューからエージェントを作成してください！</p>
          </div>
        ) : (
          <div className="bg-white/95 backdrop-blur-xl rounded-[40px] shadow-[0_20px_40px_rgba(0,0,0,0.15)] p-2 border-4 border-orange-50 flex items-center gap-2 group transition-all focus-within:border-orange-200">
            <div className="flex gap-1 pl-2"><button className="w-10 h-10 rounded-full flex items-center justify-center text-gray-400 hover:bg-gray-100"><Plus size={20} /></button><button className="w-10 h-10 rounded-full flex items-center justify-center text-gray-400 hover:bg-gray-100"><Paperclip size={20} /></button></div>
            <input type="text" placeholder={`${activeAgent?.nickname}に指示を入力...`} className="flex-1 bg-transparent py-4 px-2 outline-none text-gray-700 font-bold placeholder:text-gray-300"
              value={inputText} onChange={(e) => setInputText(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()} />
            <div className="flex gap-2 pr-2"><button className="w-10 h-10 rounded-full flex items-center justify-center text-gray-400 hover:bg-gray-100"><Mic size={20} /></button>
              <button onClick={() => handleSendMessage()} disabled={isBotThinking || !inputText.trim()}
                className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${inputText.trim() && !isBotThinking ? 'bg-orange-500 text-white shadow-lg' : 'bg-gray-100 text-gray-300'}`}>
                {isBotThinking ? <div className="w-6 h-6 border-4 border-white border-t-transparent rounded-full animate-spin"></div> : <Send size={22} />}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default App;
