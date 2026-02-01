
import React from 'react';

interface OfficeFloorProps {
  onBulletinClick?: () => void;
}

const OfficeFloor: React.FC<OfficeFloorProps> = ({ onBulletinClick }) => {
  return (
    <div className="relative w-[3000px] h-[2000px] bg-[#f0f7f4] isometric-grid shadow-inner">
      {/* 部屋の装飾 - 広いエリアに分散配置 */}
      
      {/* エントランス付近 */}
      <div className="absolute top-[200px] left-[400px] flex flex-col items-center">
        <div className="w-16 h-20 bg-green-500 rounded-full border-4 border-white shadow-md"></div>
        <div className="w-12 h-10 bg-amber-800 rounded-b-lg border-x-4 border-b-4 border-white"></div>
        <div className="mt-2 font-bold text-gray-400 text-xs">エントランス・ツリー</div>
      </div>

      {/* 会議スペース */}
      <div className="absolute top-[500px] left-[1200px] w-80 h-40 bg-white/40 border-4 border-dashed border-gray-300 rounded-[60px] flex items-center justify-center">
        <div className="w-48 h-20 bg-orange-100 border-4 border-white rounded-2xl shadow-lg flex justify-around p-2">
           {[1,2,3,4].map(i => <div key={i} className="w-8 h-8 bg-blue-300 border-2 border-white rounded-full"></div>)}
        </div>
      </div>

      {/* 休憩スペース */}
      <div className="absolute top-[1200px] left-[600px] w-64 h-64 bg-green-200/30 rounded-full flex items-center justify-center">
        <div className="w-32 h-32 bg-yellow-100 border-4 border-white rounded-3xl shadow-lg flex items-center justify-center">
           <div className="w-8 h-12 bg-gray-400 border-2 border-white rounded-sm"></div>
           <div className="ml-2 w-4 h-4 bg-red-400 rounded-full animate-pulse"></div>
        </div>
        <div className="absolute -bottom-4 font-bold text-green-600/50">リラックス・ゾーン</div>
      </div>

      {/* 巨大な本棚エリア */}
      <div className="absolute top-[100px] right-[400px] w-20 h-96 bg-orange-200 border-4 border-white rounded-lg shadow-md flex flex-col justify-around p-2">
         {[...Array(12)].map((_, i) => (
           <div key={i} className={`w-full h-4 border-2 border-white rounded shadow-xs ${i % 3 === 0 ? 'bg-blue-400' : i % 3 === 1 ? 'bg-red-400' : 'bg-yellow-400'}`}></div>
         ))}
      </div>

      {/* 開発デスク群 */}
      {[...Array(5)].map((_, i) => (
        <div key={i} className="absolute" style={{ top: `${800 + i * 200}px`, left: `${1800 + i * 50}px` }}>
          <div className="w-40 h-20 bg-white border-4 border-white rounded-xl shadow-lg flex items-center p-3">
            <div className="w-12 h-10 bg-gray-200 rounded border-2 border-white"></div>
            <div className="ml-3 space-y-1 flex-1">
              <div className="w-full h-1 bg-blue-200 rounded-full"></div>
              <div className="w-2/3 h-1 bg-gray-200 rounded-full"></div>
            </div>
          </div>
        </div>
      ))}

      {/* マップ中央：大きな掲示板（セントラル・プラザ） */}
      <div 
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center cursor-pointer group pointer-events-auto"
        onClick={onBulletinClick}
      >
        {/* 掲示板本体 */}
        <div className="relative group-hover:scale-105 transition-transform duration-300">
          {/* 脚 */}
          <div className="absolute -bottom-16 left-8 w-3 h-20 bg-amber-900 rounded-full border-2 border-white"></div>
          <div className="absolute -bottom-16 right-8 w-3 h-20 bg-amber-900 rounded-full border-2 border-white"></div>
          
          {/* フレームとコルク面 */}
          <div className="w-56 h-40 bg-amber-800 border-4 border-white rounded-2xl shadow-2xl p-3 relative z-10 group-hover:shadow-[0_20px_50px_rgba(120,53,15,0.3)] transition-shadow">
            <div className="w-full h-full bg-[#fceec7] rounded-lg border-2 border-amber-900/10 shadow-inner relative overflow-hidden p-2">
               {/* 付箋たち */}
               <div className="absolute top-2 left-2 w-8 h-8 bg-yellow-300 shadow-sm rotate-3 border border-white/50"></div>
               <div className="absolute top-4 left-14 w-10 h-6 bg-blue-200 shadow-sm -rotate-6 border border-white/50"></div>
               <div className="absolute top-12 left-4 w-12 h-10 bg-pink-100 shadow-sm rotate-12 border border-white/50 flex flex-col gap-1 p-1">
                  <div className="w-full h-0.5 bg-pink-300"></div>
                  <div className="w-full h-0.5 bg-pink-300"></div>
                  <div className="w-1/2 h-0.5 bg-pink-300"></div>
               </div>
               <div className="absolute bottom-4 right-4 w-14 h-14 bg-white shadow-sm -rotate-2 border border-white/50 flex items-center justify-center">
                  <div className="w-8 h-8 rounded-full border-2 border-orange-400 animate-pulse"></div>
               </div>
               <div className="absolute top-2 right-2 w-16 h-4 bg-green-200 shadow-sm border border-white/50"></div>
               
               {/* 案内板のピン */}
               <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                  <div className="w-4 h-4 bg-orange-400 rounded-full animate-ping opacity-75"></div>
               </div>
            </div>
            
            {/* 掲示板の屋根・飾り */}
            <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-32 h-8 bg-amber-800 border-4 border-white rounded-full flex items-center justify-center shadow-lg group-hover:bg-amber-700 transition-colors">
              <span className="text-[10px] text-white font-bold tracking-tighter">NEWS & INFO</span>
            </div>
          </div>
        </div>
        
        {/* テキスト表示 */}
        <div className="mt-20 flex flex-col items-center">
          <div className="px-6 py-2 bg-white/80 backdrop-blur-md rounded-full border-2 border-orange-200 shadow-lg group-hover:bg-white transition-colors">
            <div className="font-bold text-gray-500 text-sm tracking-[0.2em] uppercase">Central Plaza</div>
          </div>
          <div className="mt-2 text-[10px] font-bold text-amber-900/40 uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">Click to manage notices</div>
        </div>
      </div>
    </div>
  );
};

export default OfficeFloor;
