
import React, { useEffect, useState } from 'react';
import { GlobalProvider, useGlobalStore } from './stores/globalStore';
import { useViewport } from './hooks/useViewport';
import { useAgentGraph } from './hooks/useAgentGraph';
import { useTagSystem } from './hooks/useTagSystem';
import { OfficeFloor } from './components/office/OfficeFloor';
import { Robot } from './components/agent/Robot';
import { Sidebar } from './components/layout/Sidebar';
import { Send, ZoomIn, ZoomOut, RotateCcw } from 'lucide-react';
import { MAP_CONFIG } from './constants/masterData';

const Main: React.FC = () => {
  const { viewportRef, zoom, offset, isDragging, handleWheel, handleDrag, centerOn, performZoom } = useViewport();
  const { agents, activeAgentId, setActiveAgentId, isThinking, addAgent, messages } = useGlobalStore();
  const { processInput } = useTagSystem();
  const [inputText, setInputText] = useState('');

  useAgentGraph();

  useEffect(() => {
    if (agents.length === 0) {
      addAgent({
        id: 'a1',
        nickname: 'タグ・プロト',
        color: '#60a5fa',
        position: { x: 1500, y: 1000 },
        targetPosition: { x: 1600, y: 1100 },
        tags: new Set(['p_cheerful', 's_idle']),
        actionHistory: [],
        thoughtHistory: []
      });
    }
  }, [addAgent, agents.length]);

  const handleSend = () => {
    if (!inputText.trim() || !activeAgentId) return;
    processInput(activeAgentId, inputText);
    setInputText('');
  };

  const lastMessage = messages[messages.length - 1];

  return (
    <div className="relative w-full h-screen overflow-hidden flex flex-col font-rounded">
      <main 
        ref={viewportRef} onWheel={handleWheel}
        onMouseDown={handleDrag.onDown} onMouseMove={handleDrag.onMove} onMouseUp={handleDrag.onEnd}
        className={`flex-1 relative overflow-hidden bg-[#f0f7f4] ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
      >
        <div 
          className="absolute inset-0 origin-top-left transition-transform duration-75 ease-out"
          style={{ transform: `translate(${offset.x}px, ${offset.y}px) scale(${zoom})` }}
        >
          <OfficeFloor />
          {agents.map(agent => (
            <Robot 
              key={agent.id} 
              agent={agent} 
              isActive={activeAgentId === agent.id} 
              isThinking={isThinking && activeAgentId === agent.id}
              onClick={setActiveAgentId}
              displayMessage={lastMessage?.agentId === agent.id ? lastMessage.text : undefined}
            />
          ))}
        </div>
      </main>

      <Sidebar />

      <div className="fixed bottom-10 left-1/2 -translate-x-1/2 w-full max-w-2xl px-6 z-[400]">
        <div className="bg-white/90 backdrop-blur-2xl rounded-[32px] shadow-2xl p-2 border-4 border-white flex items-center gap-2">
          <input 
            type="text" 
            placeholder="命令タグを送信..."
            className="flex-1 bg-transparent py-4 px-6 outline-none font-bold text-gray-700"
            value={inputText}
            onChange={e => setInputText(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSend()}
          />
          <button onClick={handleSend} className="w-12 h-12 rounded-full bg-blue-500 text-white flex items-center justify-center hover:scale-110 active:scale-95 transition-all">
            <Send size={20} />
          </button>
        </div>
      </div>

      <div className="fixed top-6 right-6 flex flex-col gap-2 z-[280] bg-white/80 backdrop-blur p-2 rounded-2xl shadow-xl border-4 border-white">
        <button onClick={() => performZoom(0.2)} className="p-2 hover:bg-gray-100 rounded-xl text-blue-500"><ZoomIn size={20}/></button>
        <button onClick={() => performZoom(-0.2)} className="p-2 hover:bg-gray-100 rounded-xl text-blue-500"><ZoomOut size={20}/></button>
        <button onClick={() => centerOn(MAP_CONFIG.CENTRAL_PLAZA.x, MAP_CONFIG.CENTRAL_PLAZA.y, 0.8)} className="p-2 text-gray-300 hover:text-gray-600"><RotateCcw size={18}/></button>
      </div>
    </div>
  );
};

const App: React.FC = () => (
  <GlobalProvider>
    <Main />
  </GlobalProvider>
);

export default App;
