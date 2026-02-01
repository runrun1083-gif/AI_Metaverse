
import React, { useState, useEffect, useRef } from 'react';
import { Position } from '../types';
import { MAP_CONFIG } from '../constants';

interface RobotProps {
  id: string;
  color: string;
  isActive: boolean;
  isSpeaking: boolean;
  onClick: (id: string) => void;
  forcedTarget?: Position | null;
  message?: string;
}

const Robot: React.FC<RobotProps> = ({ 
  id, color, isActive, isSpeaking, 
  onClick, forcedTarget, message 
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [facing, setFacing] = useState<'left' | 'right'>('right');
  const [isWobbling, setIsWobbling] = useState(false);

  // 内部的な位置管理 (Refを使用してリアクトの再レンダリングをバイパス)
  const posRef = useRef<Position>({ 
    x: 200 + Math.random() * (MAP_CONFIG.FLOOR_WIDTH - 400), 
    y: 200 + Math.random() * (MAP_CONFIG.FLOOR_HEIGHT - 400) 
  });
  const targetRef = useRef<Position>(posRef.current);

  useEffect(() => {
    if (forcedTarget) {
      targetRef.current = forcedTarget;
      setFacing(forcedTarget.x < posRef.current.x ? 'left' : 'right');
      return;
    }
    const moveInterval = setInterval(() => {
      if (!isSpeaking) {
        const nextX = 200 + Math.random() * (MAP_CONFIG.FLOOR_WIDTH - 400);
        const nextY = 200 + Math.random() * (MAP_CONFIG.FLOOR_HEIGHT - 400);
        setFacing(nextX < posRef.current.x ? 'left' : 'right');
        targetRef.current = { x: nextX, y: nextY };
      }
    }, 4000 + Math.random() * 3000);
    return () => clearInterval(moveInterval);
  }, [isSpeaking, forcedTarget]);

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

  useEffect(() => {
    if (isSpeaking) {
      setIsWobbling(true);
      const timer = setTimeout(() => setIsWobbling(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [isSpeaking]);

  return (
    <div 
      ref={containerRef}
      className="absolute pointer-events-auto cursor-pointer z-20"
      onClick={(e) => { e.stopPropagation(); onClick(id); }}
      style={{ 
        left: 0, top: 0, 
        transform: `translate(calc(var(--x) - 50%), calc(var(--y) - 50%))` 
      } as React.CSSProperties}
    >
      {message && (
        <div className="absolute left-1/2 -top-32 -translate-x-1/2 w-max max-w-[250px] z-50 animate-in fade-in zoom-in slide-in-from-bottom-2">
          <div className="bg-white p-4 rounded-3xl border-4 border-blue-400 shadow-xl relative">
            <p className="text-gray-800 text-sm font-bold text-center leading-tight">{message}</p>
            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-white border-r-4 border-b-4 border-blue-400 rotate-45"></div>
          </div>
        </div>
      )}

      <div className={`relative flex flex-col items-center ${isWobbling ? 'animate-bounce' : 'animate-pulse'}`}
           style={{ transform: `scaleX(${facing === 'left' ? -1 : 1})` }}>
        {isActive && (
          <div className="absolute -top-12 animate-bounce">
            <div className="w-4 h-4 bg-orange-400 rotate-45 border-2 border-white shadow-sm"></div>
          </div>
        )}
        <div className="w-16 h-4 bg-black/10 rounded-full blur-sm absolute -bottom-2"></div>
        <div className="w-16 h-16 rounded-2xl border-4 border-white shadow-lg flex flex-col items-center justify-center overflow-hidden" style={{ backgroundColor: color }}>
          <div className="flex gap-2 mb-1">
            <div className="w-3 h-3 bg-white rounded-full flex items-center justify-center"><div className="w-1.5 h-1.5 bg-black rounded-full"></div></div>
            <div className="w-3 h-3 bg-white rounded-full flex items-center justify-center"><div className="w-1.5 h-1.5 bg-black rounded-full"></div></div>
          </div>
          <div className="mt-1 w-8 h-1 bg-white/20 rounded-full"></div>
        </div>
      </div>
    </div>
  );
};

export default Robot;
