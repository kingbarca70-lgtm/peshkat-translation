
import React, { useState } from 'react';
import { GoogleGenAI } from '@google/genai';
import { MessageSquare, Send, User, Bot, Trash2 } from 'lucide-react';

interface Message {
  role: 'user' | 'bot';
  text: string;
}

interface Props {
  uiLang: string;
  labels: any;
}

const KurdishWriter: React.FC<Props> = ({ uiLang, labels }) => {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'bot', text: 'سڵاو! من یارمەتیدەری نووسینی تۆم. دەتوانیت لێرە شیعری کوردی، چیرۆک، یان هەر دەقێکی تر بنووسیت و من یارمەتیت بدەم.' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;
    
    const userMsg = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setIsLoading(true);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: userMsg,
        config: {
          systemInstruction: "You are a creative writer and language expert specializing in Kurdish (Sorani). Help users write poems, stories, essays, and improve their grammar. Always respond in Kurdish (Sorani) unless asked otherwise."
        }
      });
      
      setMessages(prev => [...prev, { role: 'bot', text: response.text || 'ببوورە، هەڵەیەک ڕوویدا.' }]);
    } catch (error) {
      console.error(error);
      setMessages(prev => [...prev, { role: 'bot', text: 'ببوورە، ناتوانم ئێستا وەڵام بدەمەوە.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full rtl">
      <div className="p-4 border-b border-slate-100 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <MessageSquare className="text-blue-600" size={24} />
          <h2 className="text-lg font-bold text-slate-800">یارمەتیدەری نووسین</h2>
        </div>
        <button 
          onClick={() => setMessages([{ role: 'bot', text: 'سڵاو! من یارمەتیدەری نووسینی تۆم. دەتوانیت لێرە شیعری کوردی، چیرۆک، یان هەر دەقێکی تر بنووسیت و من یارمەتیت بدەم.' }])}
          className="text-slate-400 hover:text-red-500 transition-colors"
        >
          <Trash2 size={20} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/50">
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-start' : 'justify-end'}`}>
            <div className={`max-w-[80%] p-4 rounded-2xl flex gap-3 ${
              msg.role === 'user' 
              ? 'bg-blue-600 text-white rounded-tr-none' 
              : 'bg-white border border-slate-200 text-black rounded-tl-none shadow-sm font-medium'
            }`}>
              <div className="shrink-0">
                {msg.role === 'user' ? <User size={20} /> : <Bot size={20} className="text-blue-600" />}
              </div>
              <p className="whitespace-pre-wrap leading-relaxed">{msg.text}</p>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-end">
            <div className="bg-white border border-slate-200 p-4 rounded-2xl rounded-tl-none flex gap-2">
              <div className="w-2 h-2 bg-slate-300 rounded-full animate-bounce" />
              <div className="w-2 h-2 bg-slate-300 rounded-full animate-bounce [animation-delay:0.2s]" />
              <div className="w-2 h-2 bg-slate-300 rounded-full animate-bounce [animation-delay:0.4s]" />
            </div>
          </div>
        )}
      </div>

      <div className="p-4 bg-white border-t border-slate-100">
        <div className="relative flex items-center">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder="لێرە پرسیارەکەت بنووسە..."
            className="w-full p-4 pl-14 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all text-black"
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            className="absolute left-2 p-2 bg-blue-600 text-white rounded-lg disabled:bg-slate-300 transition-all hover:bg-blue-700"
          >
            <Send size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default KurdishWriter;
