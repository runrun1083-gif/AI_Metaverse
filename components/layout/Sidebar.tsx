
import React, { useState } from 'react';
import { useGlobalStore } from '../../stores/globalStore';
import { Bot, ChevronRight, ChevronLeft, LayoutGrid, ListTodo, Settings } from 'lucide-react';

export const Sidebar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { agents, activeAgentId, setActiveAgentId } = useGlobalStore();

  return (
    <div className={`fixed top-0 left-0 h-full bg-white shadow-2xl transition-all duration-500 z-[300] flex ${isOpen ? 'w-[400px]' : 'w-0'}`}>
      <div className={`w-20 bg-[#fdfaf5] border-r flex flex-col items-center py-8 gap-6 ${!isOpen && 'hidden'}`}>
        <button className="w-12 h-12 rounded-2xl bg-blue-400 text-white shadow-lg flex items-center justify-center"><Bot size={24}/></button>
        <button className="w-12 h-12 rounded-2xl bg-white text-gray-300 shadow-sm flex items-center justify-center"><LayoutGrid size={24}/></button>
        <button className="w-12 h-12 rounded-2xl bg-white text-gray-300 shadow-sm flex items-center justify-center"><ListTodo size={24}/></button>
        <button className="w-12 h-12 rounded-2xl bg-white text-gray-300 shadow-sm flex items-center justify-center mt-auto"><Settings size={24}/></button>
      </div>
      
      <div className={`flex-1 p-8 overflow-y-auto ${!isOpen && 'hidden'}`}>
        <div className="flex justify-between items-center mb-8">
           <h2 className="text-2xl font-black text-gray-800">AGENT NODES</h2>
           <button onClick={() => setIsOpen(false)}><ChevronLeft size={24}/></button>
        </div>
        <div className="space-y-4">
           {agents.map(a => (
             <button 
               key={a.id} 
               onClick={() => setActiveAgentId(a.id)}
               className={`w-full p-6 rounded-[2.5rem] border-4 flex items-center gap-4 transition-all ${activeAgentId === a.id ? 'bg-blue-50 border-blue-200 shadow-md scale-[1.02]' : 'bg-white border-gray-50'}`}
             >
               <div className="w-12 h-12 rounded-2xl shadow-sm flex items-center justify-center text-white" style={{ backgroundColor: a.color }}><Bot size={24}/></div>
               <div className="text-left">
                  <p className="font-bold text-gray-700">{a.nickname}</p>
                  <div className="flex gap-1 mt-1">
                    {Array.from(a.tags).slice(0, 3).map(t => (
                      <span key={t} className="text-[8px] bg-gray-100 px-1.5 py-0.5 rounded font-black text-gray-400 uppercase">{t}</span>
                    ))}
                  </div>
               </div>
             </button>
           ))}
        </div>
      </div>

      {!isOpen && (
        <button onClick={() => setIsOpen(true)} className="fixed left-6 top-1/2 -translate-y-1/2 w-14 h-14 bg-white rounded-full shadow-2xl flex items-center justify-center text-blue-500 border-4 border-white hover:scale-110 active:scale-95 transition-all z-[301]">
          <ChevronRight size={24} />
        </button>
      )}
    </div>
  );
};
