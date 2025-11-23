import React, { useState, useEffect, useRef } from 'react';
import { v4 as uuidv4 } from 'uuid';
import ChatHeader from './components/ChatHeader';
import MessageBubble from './components/MessageBubble';
import InputArea from './components/InputArea';
import { ChatMessage, Sender } from './types';
import { generateOrEditImage } from './services/geminiService';

const App: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Elegant greeting for Emerald AI
    const initialMessage: ChatMessage = {
      id: 'init-1',
      sender: Sender.Bot,
      text: "سلام! خوش آمدید به **Emerald AI** 💎\n\nطراحی شده توسط **ماجد سواری** (تیم زمرد). \nمن اینجام تا تصورات شما رو به تصویر بکشم یا عکس‌هاتون رو به آثار هنری تبدیل کنم. ✨\n\nکافیه بنویسی چی تو ذهنته یا یه عکس بفرستی...",
      timestamp: new Date(),
    };
    setMessages([initialMessage]);
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = async (text: string, imageBase64DataURL?: string) => {
    const userMsgId = uuidv4();
    let rawBase64 = undefined;

    if (imageBase64DataURL) {
      rawBase64 = imageBase64DataURL.split(',')[1];
    }

    const userMessage: ChatMessage = {
      id: userMsgId,
      sender: Sender.User,
      text: text,
      image: rawBase64,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const { text: responseText, imageBase64: responseImage } = await generateOrEditImage(
        text,
        rawBase64
      );

      const botMessage: ChatMessage = {
        id: uuidv4(),
        sender: Sender.Bot,
        text: responseText || (responseImage ? "تقدیم به نگاه شما ✨💎" : "متوجه نشدم، لطفا دوباره تلاش کنید."),
        image: responseImage,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, botMessage]);

    } catch (error) {
      const errorMsg: ChatMessage = {
        id: uuidv4(),
        sender: Sender.Bot,
        text: "ارتباط با سرور قطع شد. لطفا مجدد تلاش کنید.\n" + (error instanceof Error ? error.message : ""),
        isError: true,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-[#0f172a] text-white overflow-hidden font-sans">
      <div className="w-full max-w-lg mx-auto h-full flex flex-col shadow-2xl border-x border-gray-800 relative">
        <ChatHeader />
        
        {/* Background Effects */}
        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
            <div className="absolute top-[-10%] left-[-20%] w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-[100px] opacity-30"></div>
            <div className="absolute bottom-[-10%] right-[-20%] w-[400px] h-[400px] bg-blue-500/10 rounded-full blur-[100px] opacity-20"></div>
        </div>

        <div 
          className="flex-1 overflow-y-auto p-4 z-0"
          ref={scrollRef}
        >
          {messages.map((msg) => (
            <MessageBubble key={msg.id} message={msg} />
          ))}
          
          {isLoading && (
            <div className="flex justify-start w-full animate-pulse-slow">
               <div className="bg-[#1e293b] p-4 rounded-2xl rounded-bl-none border border-gray-700 shadow-lg text-emerald-400 text-sm flex items-center gap-3">
                  <span className="text-xl animate-spin">💎</span>
                  <span className="font-light tracking-wide text-gray-300">در حال خلق اثر هنری...</span>
               </div>
            </div>
          )}
        </div>

        <InputArea onSend={handleSendMessage} isLoading={isLoading} />
      </div>
    </div>
  );
};

export default App;