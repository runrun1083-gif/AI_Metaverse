
import React, { useState, useEffect, useRef } from 'react';
import { Position } from '../types';

interface RobotProps {
  id: string;
  color: string;
  isActive: boolean;
  isSpeaking: boolean;
  onPositionUpdate: (id: string, pos: Position) => void;
  onClick: (id: string) => void;
  floorWidth: number;
  floorHeight: number;
  forcedTarget?: Position | null;
  message?: string; // 吹き出しをコンポーネント内にカプセル化
}

const Robot: React.FC<RobotProps> = ({ 
  id, color, isActive, isSpeaking, onPositionUpdate, 
  onClick, floorWidth, floorHeight, forcedTarget, message 
}) => {
  const [pos, setPos] = useState<Position>({ 
    x: 200 + Math.random() * (floorWidth - 400), 
    y: 200 + Math.random() * (floorHeight - 400) 
  });
  const [targetPos, setTargetPos] = useState<Position>(pos);
  const [facing, setFacing] = useState<'left' | 'right'>('right');
  const [isWobbling, setIsWobbling] = useState(false);
  
  const lastReportedPos = useRef<Position>(pos);

  useEffect(() => {
    if (forcedTarget) {
      setFacing(forcedTarget.x < pos.x ? 'left' : 'right');
      setTargetPos(forcedTarget);
      return;
    }
    const moveInterval = setInterval(() => {
      if (!isSpeaking) {
        const nextX = 200 + Math.random() * (floorWidth - 400);
        const nextY = 200 + Math.random() * (floorHeight - 400);
        setFacing(nextX < targetPos.x ? 'left' : 'right');
        setTargetPos({ x: nextX, y: nextY });
      }
    }, 5000 + Math.random() * 2000);
    return () => clearInterval(moveInterval);
  }, [isSpeaking, floorWidth, floorHeight, forcedTarget]);

  useEffect(() => {
    const lerpRate = 0.015;
    let animationId: number;

    const animate = () => {
      setPos(prev => {
        const nextX = prev.x + (targetPos.x - prev.x) * lerpRate;
        const nextY = prev.y + (targetPos.y - prev.y) * lerpRate;
        const dist = Math.sqrt(Math.pow(targetPos.x - nextX, 2) + Math.pow(targetPos.y - nextY, 2));
        
        if (dist < 1) return prev;
        
        const newPos = { x: nextX, y: nextY };
        // パフォーマンス改善: 親への報告頻度を下げる (50px以上移動した場合のみ)
        const distFromLastReport = Math.sqrt(Math.pow(newPos.x - lastReportedPos.current.x, 2) + Math.pow(newPos.y - lastReportedPos.current.y, 2));
        if (distFromLastReport > 50) {
          lastReportedPos.current = newPos;
          onPositionUpdate(id, newPos);
        }
        
        return newPos;
      });
      animationId = requestAnimationFrame(animate);
    };

    animationId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationId);
  }, [id, targetPos, onPositionUpdate]);

  useEffect(() => {
    if (isSpeaking) {
      setIsWobbling(true);
      const timer = setTimeout(() => setIsWobbling(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [isSpeaking]);

  return (
    <div 
      className="absolute pointer-events-auto cursor-pointer z-20"
      onClick={(e) => { e.stopPropagation(); onClick(id); }}
      style={{ left: `${pos.x}px`, top: `${pos.y}px`, transform: `translate(-50%, -50%)` }}
    >
      {/* 吹き出しのカプセル化 */}
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
        <div className="absolute -top-4 w-1 h-4 bg-gray-400 border-2 border-white">
          <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-3 h-3 bg-red-400 rounded-full border-2 border-white"></div>
        </div>
      </div>
    </div>
  );
};

export default Robot;
