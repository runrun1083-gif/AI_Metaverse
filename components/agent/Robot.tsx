
import React from 'react';
import { AgentNode } from '../../types/graph';
import { ThoughtBubble } from './ThoughtBubble';

interface RobotProps {
  agent: AgentNode;
  isActive: boolean;
  isThinking: boolean;
  onClick: (id: string) => void;
  displayMessage?: string;
}

export const Robot: React.FC<RobotProps> = ({ agent, isActive, isThinking, onClick, displayMessage }) => {
  const isWalking = Math.hypot(agent.targetPosition.x - agent.position.x, agent.targetPosition.y - agent.position.y) > 10;
  
  return (
    <div 
      className="absolute pointer-events-auto cursor-pointer z-20"
      onClick={() => onClick(agent.id)}
      style={{ transform: `translate(${agent.position.x}px, ${agent.position.y}px)` }}
    >
      <ThoughtBubble text={agent.activeThought || ''} visible={isThinking || !!agent.activeThought} />
      
      {displayMessage && !isThinking && (
        <div className="absolute bottom-full mb-4 left-1/2 -translate-x-1/2 bg-white px-4 py-2 rounded-full border-2 border-orange-100 shadow-lg whitespace-nowrap">
           <p className="text-xs font-bold text-gray-700">{displayMessage}</p>
        </div>
      )}

      <div className={`relative flex flex-col items-center transition-all ${isWalking ? 'animate-bounce' : ''}`}>
        {isActive && <div className="absolute -top-10 w-4 h-4 bg-orange-400 rotate-45 border-2 border-white animate-pulse" />}
        <div className="w-16 h-3 bg-black/5 rounded-full blur-sm absolute -bottom-1" />
        <div className="w-16 h-16 rounded-3xl border-4 border-white shadow-lg flex items-center justify-center" style={{ backgroundColor: agent.color }}>
          <div className="flex gap-2">
            <div className="w-2 h-2 bg-white rounded-full" />
            <div className="w-2 h-2 bg-white rounded-full" />
          </div>
        </div>
      </div>
    </div>
  );
};
