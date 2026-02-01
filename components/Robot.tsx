
import React, { useState, useEffect } from 'react';
import { Position } from '../types';

interface RobotProps {
  id: string;
  color: string;
  isActive: boolean;
  isSpeaking: boolean;
  onPositionChange: (id: string, pos: Position) => void;
  onClick: (id: string) => void;
  floorWidth: number;
  floorHeight: number;
  forcedTarget?: Position | null; // 追加: 強制移動先
}

const Robot: React.FC<RobotProps> = ({ id, color, isActive, isSpeaking, onPositionChange, onClick, floorWidth, floorHeight, forcedTarget }) => {
  const [pos, setPos] = useState<Position>({ 
    x: 200 + Math.random() * (floorWidth - 400), 
    y: 200 + Math.random() * (floorHeight - 400) 
  });
  const [targetPos, setTargetPos] = useState<Position>(pos);
  const [isWobbling, setIsWobbling] = useState(false);
  const [facing, setFacing] = useState<'left' | 'right'>('right');

  // forcedTargetがある場合はそれを優先、ない場合はランダム徘徊
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
    }, 4000 + Math.random() * 3000);

    return () => clearInterval(moveInterval);
  }, [isSpeaking, floorWidth, floorHeight, targetPos.x, forcedTarget, pos.x]);

  useEffect(() => {
    const lerpRate = 0.01;
    let animationId: number;

    const animate = () => {
      setPos(prev => {
        const nextX = prev.x + (targetPos.x - prev.x) * lerpRate;
        const nextY = prev.y + (targetPos.y - prev.y) * lerpRate;
        const newPos = { x: nextX, y: nextY };
        
        if (Math.abs(targetPos.x - nextX) < 0.5 && Math.abs(targetPos.y - nextY) < 0.5) {
          return prev;
        }

        onPositionChange(id, newPos);
        return newPos;
      });
      animationId = requestAnimationFrame(animate);
    };

    animationId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationId);
  }, [id, targetPos, onPositionChange]);

  useEffect(() => {
    if (isSpeaking) {
      setIsWobbling(true);
      const timer = setTimeout(() => setIsWobbling(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [isSpeaking]);

  return (
    <div 
      className="absolute transition-transform duration-100 ease-linear pointer-events-auto cursor-pointer"
      onClick={(e) => {
        e.stopPropagation();
        onClick(id);
      }}
      style={{ 
        left: `${pos.x}px`, 
        top: `${pos.y}px`,
        transform: `translate(-50%, -50%) scaleX(${facing === 'left' ? -1 : 1})`,
        zIndex: isActive ? 50 : 10,
      }}
    >
      <div className={`relative flex flex-col items-center ${isWobbling ? 'animate-bounce' : 'animate-pulse'}`}>
        {isActive && (
          <div className="absolute -top-12 animate-bounce">
            <div className="w-4 h-4 bg-orange-400 rotate-45 border-2 border-white shadow-sm"></div>
          </div>
        )}
        <div className="w-16 h-4 bg-black/10 rounded-full blur-sm absolute -bottom-2"></div>
        <div className="w-16 h-16 rounded-2xl border-4 border-white shadow-lg flex flex-col items-center justify-center overflow-hidden transition-colors duration-500" style={{ backgroundColor: color }}>
          <div className="flex gap-2 mb-1">
            <div className="w-3 h-3 bg-white rounded-full flex items-center justify-center"><div className="w-1.5 h-1.5 bg-black rounded-full"></div></div>
            <div className="w-3 h-3 bg-white rounded-full flex items-center justify-center"><div className="w-1.5 h-1.5 bg-black rounded-full"></div></div>
          </div>
          <div className="flex gap-4"><div className="w-2 h-1 bg-white/30 rounded-full"></div><div className="w-2 h-1 bg-white/30 rounded-full"></div></div>
          <div className="mt-1 w-8 h-1 bg-white/20 rounded-full"></div>
        </div>
        <div className="absolute -top-4 w-1 h-4 bg-gray-400 border-2 border-white">
          <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-3 h-3 bg-red-400 rounded-full border-2 border-white"></div>
        </div>
        <div className="absolute top-6 -left-4 w-4 h-6 border-4 border-white rounded-full transform -rotate-12 transition-colors duration-500" style={{ backgroundColor: color }}></div>
        <div className="absolute top-6 -right-4 w-4 h-6 border-4 border-white rounded-full transform rotate-12 transition-colors duration-500" style={{ backgroundColor: color }}></div>
      </div>
    </div>
  );
};

export default Robot;
