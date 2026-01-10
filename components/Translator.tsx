
import React, { useState } from 'react';
import { GoogleGenAI } from '@google/genai';
import { Languages, ArrowRightLeft, Copy, Check } from 'lucide-react';

const availableLangs = [
  { code: 'ku-sorani', name: 'Kurdish (Sorani)', direction: 'rtl' },
  { code: 'ku-badini', name: 'Kurdish (Badini)', direction: 'rtl' },
  { code: 'en', name: 'English', direction: 'ltr' },
  { code: 'de', name: 'German', direction: 'ltr' },
  { code: 'ar', name: 'Arabic', direction: 'rtl' },
  { code: 'tr', name: 'Turkish', direction: 'ltr' },
  { code: 'fa', name: 'Farsi', direction: 'rtl' },
  { code: 'fr', name: 'French', direction: 'ltr' },
  { code: 'es', name: 'Spanish', direction: 'ltr' },
  { code: 'it', name: 'Italian', direction: 'ltr' },
];

interface Props {
  uiLang: string;
  labels: any;
  theme: { color: string; hover: string };
}

const Translator: React.FC<Props> = ({ uiLang, labels, theme }) => {
  const [inputText, setInputText] = useState('');
  const [outputText, setOutputText] = useState('');
  const [sourceLang, setSourceLang] = useState('en');
  const [targetLang, setTargetLang] = useState('ku-sorani');
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleTranslate = async () => {
    if (!inputText.trim()) return;
    setIsLoading(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
      const src = availableLangs.find(l => l.code === sourceLang)?.name;
      const tgt = availableLangs.find(l => l.code === targetLang)?.name;

      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Translate this text from ${src} to ${tgt}: "${inputText}".`,
        config: {
          systemInstruction: "You are a professional polyglot translator. Provide only the translated text. CRITICAL: When translating into Kurdish (Badini), ALWAYS use the Arabic script (Kurdish alphabet), following the same writing convention as Sorani. Do not use Latin characters for Kurdish."
        }
      });
      setOutputText(response.text || '');
    } catch (error) {
      console.error(error);
      setOutputText('Error...');
    } finally {
      setIsLoading(false);
    }
  };

  const swapLanguages = () => {
    setSourceLang(targetLang);
    setTargetLang(sourceLang);
    setInputText(outputText);
    setOutputText('');
  };

  const copyToClipboard = () => {
    if (!outputText) return;
    navigator.clipboard.writeText(outputText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const srcDir = availableLangs.find(l => l.code === sourceLang)?.direction || 'ltr';
  const tgtDir = availableLangs.find(l => l.code === targetLang)?.direction || 'rtl';

  return (
    <div className="p-6 md:p-10 flex flex-col h-full">
      <div className="flex items-center gap-3 mb-8">
        <Languages className={`text-${theme.color}`} size={28} />
        <h2 className="text-2xl font-bold text-slate-800">{labels.translate}</h2>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-4 mb-8 ltr">
        <select 
          value={sourceLang} 
          onChange={(e) => setSourceLang(e.target.value)}
          className="p-3 border-2 border-slate-100 rounded-xl bg-white text-black font-semibold min-w-[140px]"
        >
          {availableLangs.map(l => <option key={l.code} value={l.code}>{l.name}</option>)}
        </select>

        <button onClick={swapLanguages} className={`p-3 hover:bg-slate-50 rounded-full text-${theme.color}`}>
          <ArrowRightLeft size={20} />
        </button>

        <select 
          value={targetLang} 
          onChange={(e) => setTargetLang(e.target.value)}
          className="p-3 border-2 border-slate-100 rounded-xl bg-white text-black font-semibold min-w-[140px]"
        >
          {availableLangs.map(l => <option key={l.code} value={l.code}>{l.name}</option>)}
        </select>
      </div>

      <div className="grid md:grid-cols-2 gap-6 flex-1">
        <div className="flex flex-col gap-4">
          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            className={`flex-1 p-5 rounded-2xl border-2 border-slate-100 focus:border-${theme.color} outline-none text-lg resize-none text-black ${srcDir === 'rtl' ? 'text-right' : 'text-left'}`}
            placeholder={labels.placeholder}
          />
          <button
            onClick={handleTranslate}
            disabled={isLoading || !inputText.trim()}
            className={`bg-${theme.color} text-white font-bold py-4 rounded-2xl flex items-center justify-center gap-2 text-lg hover:bg-${theme.hover} transition-colors`}
          >
            {isLoading ? <div className="animate-spin rounded-full h-6 w-6 border-2 border-white border-t-transparent" /> : labels.translate}
          </button>
        </div>

        <div className="flex flex-col gap-4 relative">
          <div className={`flex-1 p-5 rounded-2xl border-2 border-slate-100 bg-slate-50 text-lg overflow-auto text-black font-medium ${tgtDir === 'rtl' ? 'text-right' : 'text-left'}`}>
            {outputText || <span className="text-slate-400 italic">...</span>}
          </div>
          {outputText && (
            <button
              onClick={copyToClipboard}
              className="mt-2 flex items-center justify-center gap-2 bg-slate-800 text-white py-3 rounded-xl font-bold hover:bg-black transition-colors"
            >
              {copied ? <Check size={18} /> : <Copy size={18} />}
              {copied ? 'Copied!' : 'Click to copy result'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Translator;
