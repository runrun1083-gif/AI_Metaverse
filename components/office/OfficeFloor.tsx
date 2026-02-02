
import React from 'react';
import { MAP_CONFIG } from '../../constants/masterData';

export const OfficeFloor: React.FC = () => {
  return (
    <div 
      className="relative bg-[#f0f7f4] isometric-grid shadow-inner"
      style={{ width: MAP_CONFIG.FLOOR_WIDTH, height: MAP_CONFIG.FLOOR_HEIGHT }}
    >
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none opacity-20">
         <h1 className="text-6xl font-black text-gray-300">CENTRAL PLAZA</h1>
      </div>
    </div>
  );
};
