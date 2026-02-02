
import React from 'react';

export const ThoughtBubble: React.FC<{ text: string; visible: boolean }> = ({ text, visible }) => {
  if (!visible || !text) return null;
  return (
    <div className="absolute bottom-full mb-8 left-1/2 -translate-x-1/2 w-64 animate-in fade-in zoom-in slide-in-from-bottom-4">
      <div className="bg-white/90 backdrop-blur p-4 rounded-3xl border-4 border-blue-100 shadow-xl relative">
        <div className="text-[10px] font-black text-blue-300 uppercase tracking-widest mb-1">Thought Process</div>
        <p className="text-[11px] font-bold text-gray-600 leading-tight italic">{text}</p>
        <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-white border-r-4 border-b-4 border-blue-100 rotate-45"></div>
      </div>
    </div>
  );
};
