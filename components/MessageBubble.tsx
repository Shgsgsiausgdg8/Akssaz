import React from 'react';
import { ChatMessage, Sender } from '../types';

interface MessageBubbleProps {
  message: ChatMessage;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ message }) => {
  const isUser = message.sender === Sender.User;
  
  // Format time
  const time = message.timestamp.toLocaleTimeString('fa-IR', {
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div className={`flex w-full mb-6 ${isUser ? 'justify-start' : 'justify-end'}`}>
      <div
        className={`max-w-[85%] sm:max-w-[75%] rounded-2xl p-4 relative group transition-all duration-300 ${
          isUser
            ? 'bg-gradient-to-br from-emerald-600 to-emerald-800 text-white rounded-br-none shadow-[0_4px_15px_rgba(16,185,129,0.2)]'
            : 'bg-[#1e293b] text-gray-100 rounded-bl-none border border-gray-700 shadow-lg'
        } ${message.isError ? 'border border-red-500/50 bg-red-900/20' : ''}`}
      >
        {/* Image Content */}
        {message.image && (
          <div className="mb-3 rounded-xl overflow-hidden border border-white/10 shadow-lg">
            <img 
              src={`data:image/png;base64,${message.image}`} 
              alt="Emerald AI Content" 
              className="w-full h-auto object-cover max-h-96 cursor-pointer hover:scale-105 transition-transform duration-500"
              onClick={() => {
                  const win = window.open();
                  if (win) {
                      win.document.write(`<body style="background:#0f172a;margin:0;display:flex;justify-content:center;align-items:center;height:100vh"><img src="data:image/png;base64,${message.image}" style="max-width:100%;max-height:100%;border-radius:8px;box-shadow:0 0 50px rgba(0,0,0,0.5)"/></body>`);
                  }
              }}
            />
          </div>
        )}

        {/* Text Content */}
        {message.text && (
          <p className={`whitespace-pre-wrap text-sm leading-7 ${isUser ? 'text-white/95' : 'text-gray-300'}`} style={{ wordBreak: 'break-word' }}>
            {message.text}
          </p>
        )}

        {/* Timestamp */}
        <div className="flex justify-end items-center gap-1 mt-2 opacity-70">
          <span className="text-[10px] font-mono">
             {time}
          </span>
          {isUser && <span className="text-emerald-200 text-xs">✓✓</span>}
        </div>
      </div>
    </div>
  );
};

export default MessageBubble;