import React from 'react';
import { IconGem } from './Icons';

const ChatHeader: React.FC = () => {
  return (
    <div className="glass flex items-center justify-between p-4 sticky top-0 z-10 border-b border-gray-800">
      <div className="flex items-center gap-3">
        <div className="bg-emerald-500/10 p-2 rounded-xl border border-emerald-500/20">
          <IconGem />
        </div>
        <div>
          <h1 className="font-bold text-lg text-white tracking-wide">EMERALD AI <span className="text-emerald-400 text-xs align-top">PRO</span></h1>
          <p className="text-[10px] text-gray-400 font-medium tracking-widest uppercase">تیم زمرد | هوش مصنوعی پیشرفته</p>
        </div>
      </div>
      <div className="text-right hidden sm:block">
        <p className="text-[9px] text-gray-500 uppercase tracking-widest">Created By</p>
        <p className="text-xs text-emerald-400 font-semibold font-mono">Majed Savari</p>
      </div>
    </div>
  );
};

export default ChatHeader;