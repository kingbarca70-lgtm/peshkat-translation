
import React, { useState, useEffect } from 'react';
import { GoogleGenAI, Modality } from '@google/genai';
import { Headphones, Play, Pause, Loader2, Volume2, Globe, ShieldCheck } from 'lucide-react';

const ttsLangs = [
  { code: 'en', name: 'English', native: 'English' },
  { code: 'ku-sorani', name: 'Kurdish (Sorani)', native: 'کوردی' },
  { code: 'ku-badini', name: 'Kurdish (Badini)', native: 'بادینی' },
  { code: 'de', name: 'German', native: 'Deutsch' },
  { code: 'ar', name: 'Arabic', native: 'العربية' },
  { code: 'tr', name: 'Turkish', native: 'Türkçe' },
  { code: 'fa', name: 'Farsi', native: 'فارسی' },
  { code: 'fr', name: 'French', native: 'Français' },
  { code: 'es', name: 'Spanish', native: 'Español' },
  { code: 'it', name: 'Italian', native: 'Italiano' },
];

interface Props {
  uiLang: string;
  labels: any;
  theme: { color: string; hover: string };
}

const KurdishTTS: React.FC<Props> = ({ uiLang, labels, theme }) => {
  const [text, setText] = useState('');
  const [selectedLang, setSelectedLang] = useState(uiLang);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  // Sync with global UI language on first load or change
  useEffect(() => {
    setSelectedLang(uiLang);
  }, [uiLang]);

  // Detection logic for Smart Audio Mode
  const isEnglishText = (input: string) => {
    // Basic regex to check if the majority of characters are Latin/English
    const englishChars = input.match(/[a-zA-Z]/g);
    const totalChars = input.replace(/\s/g, '').length;
    if (!englishChars || totalChars === 0) return false;
    return (englishChars.length / totalChars) > 0.5;
  };

  const decode = (base64: string) => {
    const binaryString = atob(base64);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes;
  };

  const decodeAudioData = async (data: Uint8Array, ctx: AudioContext, sampleRate: number, numChannels: number) => {
    const dataInt16 = new Int16Array(data.buffer);
    const frameCount = dataInt16.length / numChannels;
    const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);
    for (let channel = 0; channel < numChannels; channel++) {
      const channelData = buffer.getChannelData(channel);
      for (let i = 0; i < frameCount; i++) {
        channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
      }
    }
    return buffer;
  };

  const handleSpeak = async () => {
    if (!text.trim()) return;
    setIsGenerating(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
      
      // Smart Detection: If text is clearly English, override selectedLang to English
      const detectedAsEnglish = isEnglishText(text);
      const targetLangCode = detectedAsEnglish ? 'en' : selectedLang;
      const currentLang = ttsLangs.find(l => l.code === targetLangCode);
      const langName = currentLang?.name || 'English';
      
      const prompt = `Convert this text to audio with high-quality native pronunciation. 
      Language: ${langName}
      Tone: Natural and professional.
      Phonetic Requirement: This text MUST be spoken with a native ${langName} accent. 
      ${detectedAsEnglish ? "CRITICAL: The text is in English. Use standard English phonetics regardless of user UI settings." : ""}
      Text: "${text}"`;
      
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash-preview-tts",
        contents: [{ parts: [{ text: prompt }] }],
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: {
            voiceConfig: {
              prebuiltVoiceConfig: { voiceName: 'Kore' },
            },
          },
        },
      });

      const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
      if (base64Audio) {
        const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
        const audioBuffer = await decodeAudioData(decode(base64Audio), audioCtx, 24000, 1);
        const source = audioCtx.createBufferSource();
        source.buffer = audioBuffer;
        source.connect(audioCtx.destination);
        setIsPlaying(true);
        source.start();
        source.onended = () => {
          setIsPlaying(false);
          audioCtx.close();
        };
      }
    } catch (error) {
      console.error('TTS Error:', error);
      alert('Error generating speech. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const isRtl = uiLang.includes('ku') || uiLang === 'ar' || uiLang === 'fa';
  const textIsRtl = /[\u0600-\u06FF]/.test(text);
  const detectingEnglish = isEnglishText(text);

  return (
    <div className={`p-6 md:p-10 h-full flex flex-col ${isRtl ? 'rtl' : 'ltr'}`}>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-3">
          <div className={`bg-${theme.color} p-2 rounded-lg text-white transition-colors`}>
            <Volume2 size={24} />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-black leading-tight">{labels.audio}</h2>
            <div className="flex items-center gap-1.5 mt-1">
               <ShieldCheck size={12} className="text-emerald-500" />
               <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Smart Audio Mode Active</span>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 items-center bg-slate-100 p-1 rounded-2xl border border-slate-200">
          <Globe size={14} className="mx-2 text-slate-400" />
          <div className="flex overflow-x-auto no-scrollbar max-w-[280px] sm:max-w-none gap-1 p-1">
            {ttsLangs.map((lang) => (
              <button
                key={lang.code}
                onClick={() => setSelectedLang(lang.code)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                  selectedLang === lang.code 
                    ? `bg-white text-${theme.color} shadow-sm border border-slate-200` 
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                {lang.native}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center max-w-4xl mx-auto w-full">
        <div className="w-full mb-8 relative">
          <label className={`block text-sm font-bold text-slate-500 mb-2 uppercase tracking-widest px-2 ${isRtl ? 'text-right' : 'text-left'}`}>
            {labels.write}
          </label>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            className={`w-full p-6 rounded-3xl border-2 border-slate-100 focus:border-${theme.color} outline-none text-xl md:text-2xl resize-none bg-white shadow-sm text-black transition-all ${textIsRtl ? 'text-right font-medium' : 'text-left'}`}
            placeholder={labels.placeholder}
            rows={5}
          />
          <div className={`absolute bottom-4 ${isRtl ? 'left-4' : 'right-4'} flex items-center gap-2 px-3 py-1 bg-slate-50 rounded-lg text-[10px] font-bold text-slate-400 border border-slate-100 uppercase`}>
            {detectingEnglish ? (
              <span className="text-blue-500 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse"></span>
                Detected: English Pronunciation
              </span>
            ) : (
              `${ttsLangs.find(l => l.code === selectedLang)?.name} Accent`
            )}
          </div>
        </div>
        
        <div className="relative group">
          {isPlaying && (
            <div className={`absolute inset-0 bg-${theme.color} rounded-full animate-ping opacity-20 scale-150 transition-colors`}></div>
          )}
          <button
            onClick={handleSpeak}
            disabled={isGenerating || !text.trim()}
            className={`relative z-10 w-32 h-32 md:w-40 md:h-40 rounded-full flex flex-col items-center justify-center shadow-2xl transition-all transform active:scale-95 ${
              isPlaying 
                ? `bg-slate-50 text-${theme.color} border-4 border-slate-100` 
                : `bg-${theme.color} text-white hover:bg-${theme.hover}`
            } disabled:bg-slate-200 disabled:text-slate-400 disabled:shadow-none shadow-${theme.color}/20`}
          >
            {isGenerating ? (
              <Loader2 className="animate-spin" size={48} />
            ) : isPlaying ? (
              <Pause size={54} fill="currentColor" />
            ) : (
              <div className="flex flex-col items-center">
                <Play size={54} fill="currentColor" className="ml-2" />
              </div>
            )}
          </button>
        </div>

        <div className="mt-8 text-center">
          <p className="text-black font-bold text-lg leading-relaxed h-8">
            {isGenerating ? labels.action : isPlaying ? 'Audio Playing...' : `Speak Text`}
          </p>
          <p className="text-slate-400 text-[10px] mt-2 uppercase font-bold tracking-widest">
            Pronunciation Logic: Native Accent Protection Enabled
          </p>
        </div>
      </div>
    </div>
  );
};

export default KurdishTTS;
