
import React, { useState } from 'react';
import { Notice } from '../types';
import { X, Plus, Trash2, Edit3, Save, MessageSquareText } from 'lucide-react';

interface BulletinBoardOverlayProps {
  notices: Notice[];
  onClose: () => void;
  onAdd: (notice: Notice) => void;
  onUpdate: (notice: Notice) => void;
  onDelete: (id: string) => void;
}

const CATEGORIES = ['憲法', '緊急会議', '提案', 'アイディア', 'タスク', '困りごと', '募集要件', '求人募集', 'その他'];

const BulletinBoardOverlay: React.FC<BulletinBoardOverlayProps> = ({ notices, onClose, onAdd, onUpdate, onDelete }) => {
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formCategory, setFormCategory] = useState(CATEGORIES[0]);
  const [formContent, setFormContent] = useState('');

  const resetForm = () => {
    setFormCategory(CATEGORIES[0]);
    setFormContent('');
    setIsAdding(false);
    setEditingId(null);
  };

  const handleSave = () => {
    if (!formContent.trim()) return;
    const now = new Date().toLocaleString('ja-JP');
    if (editingId) {
      onUpdate({ id: editingId, category: formCategory, content: formContent, updatedAt: now });
    } else {
      onAdd({ id: Date.now().toString(), category: formCategory, content: formContent, updatedAt: now });
    }
    resetForm();
  };

  const startEdit = (notice: Notice) => {
    setFormCategory(notice.category);
    setFormContent(notice.content);
    setEditingId(notice.id);
    setIsAdding(true);
  };

  return (
    <div className="fixed inset-0 z-[600] flex items-center justify-center bg-black/40 backdrop-blur-md p-4" onClick={onClose}>
      <div className="bg-[#fceec7] w-full max-w-2xl rounded-[3rem] border-8 border-amber-800 shadow-2xl overflow-hidden animate-in zoom-in duration-300 flex flex-col max-h-[90vh]" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="bg-amber-800 p-6 flex justify-between items-center text-white">
          <div className="flex items-center gap-3">
            <MessageSquareText size={28} />
            <h2 className="text-2xl font-bold tracking-tighter">セントラル掲示板</h2>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors"><X size={24} /></button>
        </div>

        <div className="flex-1 overflow-y-auto p-8 scrollbar-hide">
          {isAdding ? (
            <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-300">
              <div>
                <label className="block text-xs font-bold text-amber-900/60 mb-2 uppercase tracking-widest">カテゴリー選択</label>
                <div className="flex flex-wrap gap-2">
                  {CATEGORIES.map(cat => (
                    <button
                      key={cat}
                      onClick={() => setFormCategory(cat)}
                      className={`px-4 py-2 rounded-full text-sm font-bold border-2 transition-all ${
                        formCategory === cat ? 'bg-amber-800 text-white border-amber-800' : 'bg-white text-amber-800 border-amber-100 hover:border-amber-300 shadow-sm'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-amber-900/60 mb-2 uppercase tracking-widest">内容</label>
                <textarea
                  className="w-full p-6 bg-white rounded-3xl border-4 border-amber-100 focus:border-amber-300 outline-none h-48 resize-none font-bold text-amber-900 leading-relaxed shadow-inner"
                  placeholder="ここに掲示内容を書いてね！"
                  value={formContent}
                  onChange={(e) => setFormContent(e.target.value)}
                />
              </div>
              <div className="flex gap-4">
                <button onClick={resetForm} className="flex-1 py-4 bg-gray-200 text-gray-500 rounded-2xl font-bold hover:bg-gray-300 transition-colors">キャンセル</button>
                <button onClick={handleSave} className="flex-1 py-4 bg-orange-400 text-white rounded-2xl font-bold shadow-lg hover:bg-orange-500 transition-all flex items-center justify-center gap-2">
                  <Save size={20} /> 保存するピ！
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <button 
                onClick={() => setIsAdding(true)}
                className="w-full py-8 border-4 border-dashed border-amber-900/20 rounded-[3rem] text-amber-900/40 flex flex-col items-center justify-center gap-2 hover:bg-amber-900/5 transition-all group"
              >
                <div className="w-12 h-12 bg-amber-800/10 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform text-amber-800">
                  <Plus size={28} />
                </div>
                <span className="font-bold">新しいお知らせを貼る</span>
              </button>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {notices.map(notice => (
                  <div key={notice.id} className="bg-white p-6 rounded-[2.5rem] border-4 border-amber-100 shadow-sm hover:shadow-md transition-all relative group overflow-hidden">
                    <div className="flex justify-between items-start mb-3">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-bold text-white uppercase tracking-wider ${
                        notice.category === '緊急会議' ? 'bg-red-400' : notice.category === 'アイディア' ? 'bg-yellow-400' : 'bg-amber-700'
                      }`}>
                        {notice.category}
                      </span>
                      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => startEdit(notice)} className="p-2 bg-blue-50 text-blue-500 rounded-full hover:bg-blue-100"><Edit3 size={16} /></button>
                        <button onClick={() => onDelete(notice.id)} className="p-2 bg-red-50 text-red-500 rounded-full hover:bg-red-100"><Trash2 size={16} /></button>
                      </div>
                    </div>
                    <p className="text-amber-900 font-bold leading-relaxed line-clamp-4 whitespace-pre-wrap">{notice.content}</p>
                    <div className="mt-4 text-[10px] text-amber-900/30 font-bold text-right italic">{notice.updatedAt}</div>
                    
                    {/* Decorative tape effect */}
                    <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-12 h-4 bg-amber-900/10 -rotate-2"></div>
                  </div>
                ))}
              </div>

              {notices.length === 0 && !isAdding && (
                <div className="text-center py-20 text-amber-900/20 font-bold flex flex-col items-center gap-4">
                   <div className="w-20 h-20 bg-amber-900/5 rounded-full flex items-center justify-center">
                     <MessageSquareText size={40} />
                   </div>
                   <p>まだ掲示板は空っぽだピッ！</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BulletinBoardOverlay;
