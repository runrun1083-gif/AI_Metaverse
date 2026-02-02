
import React, { useState, useEffect, useRef } from 'react';
import { Position, AgentConfig } from '../types';
import { MAP_CONFIG } from '../constants';

interface RobotProps {
  agent: AgentConfig;
  isActive: boolean;
  isSpeaking: boolean;
  onClick: (id: string) => void;
  chatMessage?: string;
  meetingPoint?: Position; // 会議時に向かう場所
}

const Robot: React.FC<RobotProps> = ({ 
  agent, isActive, isSpeaking, onClick, chatMessage, meetingPoint
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [facing, setFacing] = useState<'left' | 'right'>('right');
  const [isWalking, setIsWalking] = useState(false);

  // 初期位置をランダムに
  const posRef = useRef<Position>({ 
    x: MAP_CONFIG.CENTRAL_PLAZA.x + (Math.random() - 0.5) * 800, 
    y: MAP_CONFIG.CENTRAL_PLAZA.y + (Math.random() - 0.5) * 800 
  });
  const targetRef = useRef<Position>(posRef.current);

  useEffect(() => {
    const moveInterval = setInterval(() => {
      if (meetingPoint) {
        // 会議中は指定場所の周辺に
        const driftX = (Math.random() - 0.5) * 150;
        const driftY = (Math.random() - 0.5) * 100;
        targetRef.current = { x: meetingPoint.x + driftX, y: meetingPoint.y + driftY };
      } else if (!isSpeaking) {
        // 通常時はランダムウォーク
        const nextX = Math.max(200, Math.min(MAP_CONFIG.FLOOR_WIDTH - 200, posRef.current.x + (Math.random() - 0.5) * 400));
        const nextY = Math.max(200, Math.min(MAP_CONFIG.FLOOR_HEIGHT - 200, posRef.current.y + (Math.random() - 0.5) * 400));
        targetRef.current = { x: nextX, y: nextY };
      }
      
      setFacing(targetRef.current.x < posRef.current.x ? 'left' : 'right');
      setIsWalking(true);
      setTimeout(() => setIsWalking(false), 3000);
    }, 6000 + Math.random() * 4000);

    return () => clearInterval(moveInterval);
  }, [isSpeaking, meetingPoint]);

  useEffect(() => {
    const lerp = (start: number, end: number, amt: number) => (1 - amt) * start + amt * end;
    let animationId: number;

    const update = () => {
      posRef.current.x = lerp(posRef.current.x, targetRef.current.x, 0.02);
      posRef.current.y = lerp(posRef.current.y, targetRef.current.y, 0.02);

      if (containerRef.current) {
        containerRef.current.style.setProperty('--x', `${posRef.current.x}px`);
        containerRef.current.style.setProperty('--y', `${posRef.current.y}px`);
      }
      animationId = requestAnimationFrame(update);
    };

    animationId = requestAnimationFrame(update);
    return () => cancelAnimationFrame(animationId);
  }, []);

  const displayMessage = agent.reaction || chatMessage;

  return (
    <div 
      ref={containerRef}
      className="absolute pointer-events-auto cursor-pointer z-20"
      onClick={(e) => { e.stopPropagation(); onClick(agent.id); }}
      style={{ 
        left: 0, top: 0, 
        transform: `translate(calc(var(--x) - 50%), calc(var(--y) - 50%))` 
      } as React.CSSProperties}
    >
      {/* 吹き出し */}
      {displayMessage && (
        <div className="absolute left-1/2 -top-24 -translate-x-1/2 w-max max-w-[220px] z-50 animate-in fade-in zoom-in slide-in-from-bottom-2 duration-300">
          <div className="bg-white/95 backdrop-blur-sm p-4 rounded-[2rem] border-4 border-orange-100 shadow-xl relative">
            <p className="text-gray-700 text-xs font-bold text-center leading-tight">{displayMessage}</p>
            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-white border-r-4 border-b-4 border-orange-100 rotate-45"></div>
          </div>
        </div>
      )}

      {/* 本体 */}
      <div className={`relative flex flex-col items-center transition-all duration-300 ${isWalking ? 'animate-[bounce_0.6s_infinite]' : ''}`}
           style={{ transform: `scaleX(${facing === 'left' ? -1 : 1})` }}>
        
        {isActive && (
          <div className="absolute -top-12 animate-bounce">
            <div className="w-4 h-4 bg-orange-400 rotate-45 border-2 border-white shadow-sm"></div>
          </div>
        )}

        <div className="w-16 h-3 bg-black/5 rounded-full blur-sm absolute -bottom-1"></div>

        <div className="w-16 h-16 rounded-[24px] border-4 border-white shadow-lg flex flex-col items-center justify-center overflow-hidden transition-all duration-500" 
             style={{ backgroundColor: agent.color, transform: isSpeaking ? 'scale(1.1)' : 'scale(1)' }}>
          <div className="flex gap-2 mb-1">
            <div className="w-3 h-3 bg-white rounded-full flex items-center justify-center">
              <div className={`w-1.5 h-1.5 bg-black rounded-full ${isSpeaking ? 'animate-pulse' : ''}`}></div>
            </div>
            <div className="w-3 h-3 bg-white rounded-full flex items-center justify-center">
              <div className={`w-1.5 h-1.5 bg-black rounded-full ${isSpeaking ? 'animate-pulse' : ''}`}></div>
            </div>
          </div>
          <div className={`mt-1 w-8 h-1 bg-white/30 rounded-full ${isSpeaking ? 'animate-pulse' : ''}`}></div>
        </div>
      </div>
    </div>
  );
};

export default Robot;
