import React, { useState, useRef } from 'react';
import { IconPaperclip, IconSend, IconClose } from './Icons';

interface InputAreaProps {
  onSend: (text: string, imageBase64?: string) => void;
  isLoading: boolean;
}

const InputArea: React.FC<InputAreaProps> = ({ onSend, isLoading }) => {
  const [text, setText] = useState('');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSend = () => {
    if ((!text.trim() && !selectedImage) || isLoading) return;
    onSend(text, selectedImage || undefined);
    setText('');
    setSelectedImage(null);
    if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setSelectedImage(result);
      };
      reader.readAsDataURL(file);
    }
    if (fileInputRef.current) {
        fileInputRef.current.value = '';
    }
  };

  const autoResize = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value);
    e.target.style.height = 'auto';
    e.target.style.height = `${e.target.scrollHeight}px`;
  };

  return (
    <div className="bg-[#0f172a] p-4 border-t border-gray-800">
      {/* Image Preview Container */}
      {selectedImage && (
        <div className="mb-3 flex items-start gap-3 p-3 bg-gray-800/50 rounded-xl border border-gray-700 backdrop-blur-sm animate-fade-in">
             <div className="relative w-16 h-16 rounded-lg overflow-hidden border border-emerald-500/30">
                <img src={selectedImage} alt="Selected" className="w-full h-full object-cover" />
             </div>
             <div className="flex-1 flex flex-col justify-center text-xs text-gray-400">
                <span className="text-emerald-400 font-medium">تصویر ضمیمه شد</span>
                <span className="text-[10px]">آماده پردازش توسط هوش مصنوعی</span>
             </div>
             <button 
                onClick={() => setSelectedImage(null)}
                className="p-1 hover:bg-gray-700 rounded-full text-gray-400 transition-colors"
             >
                <IconClose />
             </button>
        </div>
      )}

      <div className="flex items-end gap-3 max-w-4xl mx-auto bg-[#1e293b] p-2 rounded-3xl border border-gray-700 shadow-xl focus-within:border-emerald-500/50 transition-colors">
        <button
          onClick={() => fileInputRef.current?.click()}
          className="p-3 text-gray-400 hover:text-emerald-400 transition-colors rounded-full hover:bg-gray-700/50"
          title="افزودن عکس"
        >
          <IconPaperclip />
        </button>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="image/*"
          className="hidden"
        />

        <div className="flex-1 relative">
            <textarea
            ref={textareaRef}
            value={text}
            onChange={autoResize}
            onKeyDown={handleKeyDown}
            placeholder={selectedImage ? "دستور ویرایش یا تغییر عکس..." : "چیزی تصور کن..."}
            className="w-full max-h-32 min-h-[44px] py-3 px-2 bg-transparent border-0 focus:ring-0 resize-none text-gray-200 placeholder-gray-500 text-sm scrollbar-hide"
            rows={1}
            dir="rtl"
            />
        </div>

        <button
          onClick={handleSend}
          disabled={isLoading || (!text.trim() && !selectedImage)}
          className={`p-3 rounded-full transition-all duration-300 shadow-lg ${
            text.trim() || selectedImage
              ? 'bg-emerald-500 text-white hover:bg-emerald-400 hover:shadow-emerald-500/30'
              : 'bg-gray-700 text-gray-500 cursor-not-allowed'
          }`}
        >
          <IconSend />
        </button>
      </div>
      <div className="text-center mt-2">
         <p className="text-[10px] text-gray-600 font-mono tracking-widest">POWERED BY GEMINI • DESIGNED BY MAJED SAVARI</p>
      </div>
    </div>
  );
};

export default InputArea;