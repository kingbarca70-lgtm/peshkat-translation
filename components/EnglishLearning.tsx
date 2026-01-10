
import React, { useState } from 'react';
import { GoogleGenAI } from '@google/genai';
import { Search, Book, ExternalLink, GraduationCap, Loader2 } from 'lucide-react';

interface Resource {
  title: string;
  uri: string;
}

interface Props {
  uiLang: string;
  labels: any;
}

const EnglishLearning: React.FC<Props> = ({ uiLang, labels }) => {
  const [query, setQuery] = useState('');
  const [answer, setAnswer] = useState('');
  const [resources, setResources] = useState<Resource[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSearch = async () => {
    if (!query.trim()) return;
    setIsLoading(true);
    setAnswer('');
    setResources([]);
    
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `Explain or translate this English topic/phrase: "${query}"`,
        config: {
          tools: [{ googleSearch: {} }],
          systemInstruction: "You are a professional English tutor. Explain concepts clearly and provide links."
        }
      });

      setAnswer(response.text || '');
      
      const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
      if (chunks) {
        const links: Resource[] = chunks
          .filter(c => c.web)
          .map(c => ({ title: c.web.title, uri: c.web.uri }));
        setResources(links);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const isRtl = uiLang.includes('ku') || uiLang === 'ar' || uiLang === 'fa';

  return (
    <div className={`p-6 md:p-10 flex flex-col h-full ${isRtl ? 'rtl' : 'ltr'}`}>
      <div className="flex items-center gap-3 mb-8">
        < GraduationCap className="text-blue-600" size={28} />
        <h2 className="text-2xl font-bold text-slate-800">{labels.learn}</h2>
      </div>

      <div className="max-w-3xl mx-auto w-full flex flex-col gap-6">
        <div className="relative group">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            className={`w-full p-4 ${isRtl ? 'pr-14' : 'pl-14'} rounded-2xl border-2 border-slate-200 focus:border-blue-500 outline-none text-lg transition-all shadow-sm text-black`}
            placeholder={labels.placeholder}
          />
          <button 
            onClick={handleSearch}
            disabled={isLoading}
            className={`absolute ${isRtl ? 'right-3' : 'left-3'} top-3 p-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:bg-slate-300 transition-all`}
          >
            {isLoading ? <Loader2 className="animate-spin" size={24} /> : <Search size={24} />}
          </button>
        </div>

        <div className="space-y-6 mt-4">
          {answer && (
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
              <div className={`flex items-center gap-2 mb-4 text-blue-600 border-b pb-2 ${isRtl ? 'flex-row-reverse' : ''}`}>
                <Book size={20} />
                <span className="font-bold">{labels.action}</span>
              </div>
              <div className={`text-black text-lg leading-relaxed whitespace-pre-wrap font-medium ${isRtl ? 'text-right' : 'text-left'}`}>
                {answer}
              </div>
            </div>
          )}

          {resources.length > 0 && (
            <div className="grid gap-3">
              <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest">{labels.learn}</h3>
              {resources.map((res, i) => (
                <a 
                  key={i} 
                  href={res.uri} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-4 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl transition-all group"
                >
                  <span className="text-blue-700 font-medium ltr">{res.title}</span>
                  <ExternalLink size={16} className="text-slate-400 group-hover:text-blue-600" />
                </a>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EnglishLearning;
