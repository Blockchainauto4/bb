import React, { useState, useRef, useEffect } from 'react';
import { sendMessageToGemini } from '../services/geminiService';
import { ChatMessage } from '../types';
import { Logo } from './Logo';

export const Consultation: React.FC = () => {
  const [started, setStarted] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'model', text: "Welcome to Beatriz Bittencourt Professional. I am your Visagismo expert. Tell me about your current hair, eye color, and skin tone so I can recommend the perfect shade." }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMsg: ChatMessage = { role: 'user', text: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    const responseText = await sendMessageToGemini(input);
    
    setMessages(prev => [...prev, { role: 'model', text: responseText }]);
    setLoading(false);
  };

  if (!started) {
    return (
      <div className="flex flex-col h-full items-center justify-center px-6 text-center animate-fade-in pb-24">
        <div className="mb-12">
            <Logo size="lg" />
        </div>
        
        <h1 className="text-3xl font-bold mb-4">
          Professional Visagismo
          <br />
          <span className="text-gray-400 font-normal text-2xl">powered by AI analysis.</span>
        </h1>
        
        <p className="text-gray-500 mb-12 max-w-md mx-auto">
          Experience a personalized diagnosis to find your perfect shade and technical routine based on your unique features.
        </p>

        <button 
          onClick={() => setStarted(true)}
          className="bg-white text-black font-bold uppercase py-4 px-12 text-sm tracking-widest hover:bg-gray-200 transition-colors w-full max-w-xs mb-4"
        >
          Start Consultation
        </button>

        <a 
          href="https://wa.me/5511992279655?text=Gostaria%20de%20agendar,%20vim%20atrav%C3%A9s%20do%20site"
          target="_blank"
          rel="noopener noreferrer"
          className="border border-gray-800 text-gray-400 font-medium uppercase py-3 px-8 text-xs tracking-widest hover:border-white hover:text-white transition-colors w-full max-w-xs flex items-center justify-center gap-2"
        >
           Book: (11) 99227-9655
        </a>

        <div className="mt-12 text-sm text-gray-600">
            Featuring iNOA and Dia color.
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[calc(100vh-80px)] pb-4 pt-4">
        <div className="px-4 mb-4 border-b border-gray-800 pb-4 flex justify-between items-center">
            <h2 className="text-lg font-bold">Visagismo Consultation</h2>
            <button onClick={() => setStarted(false)} className="text-xs uppercase text-gray-500 hover:text-white">Exit</button>
        </div>

      <div className="flex-1 overflow-y-auto px-4 space-y-4">
        {messages.map((msg, index) => (
          <div 
            key={index} 
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div 
              className={`max-w-[85%] p-4 text-sm leading-relaxed ${
                msg.role === 'user' 
                  ? 'bg-white text-black' 
                  : 'bg-[#1a1a1a] text-gray-100 border border-gray-800'
              }`}
            >
                {msg.role === 'model' && index === 0 && (
                    <div className="mb-2 text-[10px] uppercase tracking-widest text-gray-500">Virtual Expert</div>
                )}
              {msg.text}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-[#1a1a1a] border border-gray-800 p-4 flex gap-2">
              <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" />
              <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce delay-100" />
              <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce delay-200" />
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 border-t border-gray-800 bg-black">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Type your response..."
            className="flex-1 bg-[#1a1a1a] border border-gray-800 text-white p-3 text-sm focus:outline-none focus:border-white transition-colors"
          />
          <button 
            onClick={handleSend}
            disabled={!input.trim() || loading}
            className="bg-white text-black px-6 font-bold uppercase text-xs tracking-wider disabled:opacity-50 hover:bg-gray-200 transition-colors"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};