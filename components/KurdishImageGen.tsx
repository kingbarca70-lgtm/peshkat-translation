
import React, { useState, useRef } from 'react';
import { GoogleGenAI } from '@google/genai';
import { Sparkles, Download, RefreshCw, Upload, X, Image as ImageIcon, ShieldCheck } from 'lucide-react';

interface Props {
  uiLang: string;
  labels: any;
  theme: { color: string; hover: string };
}

const KurdishImageGen: React.FC<Props> = ({ uiLang, labels, theme }) => {
  const [prompt, setPrompt] = useState('');
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeSelectedImage = () => {
    setSelectedImage(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const generateImage = async () => {
    if (!prompt.trim() && !selectedImage) return;
    setIsGenerating(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
      
      let contents: any;
      
      if (selectedImage) {
        // Image-to-Image / Editing mode
        const base64Data = selectedImage.split(',')[1];
        contents = {
          parts: [
            {
              inlineData: {
                mimeType: "image/png",
                data: base64Data
              }
            },
            { text: `Transform or enhance this image based on this description: ${prompt || 'Make it artistic and high quality'}. Maintain Kurdish cultural elements if relevant.` }
          ]
        };
      } else {
        // Text-to-Image mode
        contents = {
          parts: [
            { text: `Create an artistic image based on this description. If the description mentions Kurdish themes, ensure cultural accuracy. Description: ${prompt}` }
          ]
        };
      }

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: contents,
        config: {
          imageConfig: {
            aspectRatio: "1:1"
          }
        }
      });

      for (const part of response.candidates?.[0]?.content?.parts || []) {
        if (part.inlineData) {
          const base64Result = part.inlineData.data;
          setImageUrl(`data:image/png;base64,${base64Result}`);
          break;
        }
      }
    } catch (error) {
      console.error(error);
      alert('Failed to generate image. Please try a different prompt or image.');
    } finally {
      setIsGenerating(false);
    }
  };

  const isRtl = uiLang.includes('ku') || uiLang === 'ar' || uiLang === 'fa';

  return (
    <div className={`p-6 md:p-10 flex flex-col items-center ${isRtl ? 'rtl' : 'ltr'}`}>
      <div className="w-full flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <Sparkles className={`text-${theme.color}`} size={28} />
          <div>
            <h2 className="text-2xl font-bold text-slate-800 leading-none">{labels.image}</h2>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter mt-1 flex items-center gap-1">
              <ShieldCheck size={10} className="text-emerald-500" /> Professional Branding Enabled
            </p>
          </div>
        </div>
        <div className="hidden sm:block">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest bg-slate-100 px-3 py-1 rounded-full border border-slate-200">
            AI Image Transformer 2.5
          </span>
        </div>
      </div>

      <div className="max-w-4xl w-full grid lg:grid-cols-2 gap-8">
        {/* Input Controls */}
        <div className="flex flex-col gap-6">
          <div className="space-y-4">
            <label className="text-sm font-bold text-slate-500 uppercase tracking-wider block">
              Step 1: Upload Photo (Optional)
            </label>
            {!selectedImage ? (
              <button 
                onClick={() => fileInputRef.current?.click()}
                className="w-full border-2 border-dashed border-slate-200 rounded-2xl p-8 flex flex-col items-center gap-3 hover:border-slate-400 hover:bg-slate-50 transition-all group"
              >
                <div className={`p-3 bg-slate-100 rounded-xl text-slate-400 group-hover:text-${theme.color} group-hover:bg-white transition-all`}>
                  <Upload size={24} />
                </div>
                <div className="text-center">
                  <p className="font-bold text-slate-700">Click to upload image</p>
                  <p className="text-xs text-slate-400 mt-1">PNG, JPG up to 10MB</p>
                </div>
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={handleImageUpload} 
                  accept="image/*" 
                  className="hidden" 
                />
              </button>
            ) : (
              <div className="relative rounded-2xl overflow-hidden border-2 border-slate-200 aspect-video bg-black">
                <img src={selectedImage} alt="Input" className="w-full h-full object-contain" />
                <button 
                  onClick={removeSelectedImage}
                  className="absolute top-2 right-2 bg-red-500 text-white p-1.5 rounded-full hover:bg-red-600 shadow-lg transition-colors"
                >
                  <X size={16} />
                </button>
                <div className="absolute bottom-0 left-0 right-0 bg-black/60 backdrop-blur-sm p-2 flex items-center justify-center gap-2">
                  <ImageIcon size={14} className="text-white" />
                  <span className="text-[10px] text-white font-bold uppercase tracking-widest">Reference Image Loaded</span>
                </div>
              </div>
            )}
          </div>

          <div className="space-y-4">
            <label className="text-sm font-bold text-slate-500 uppercase tracking-wider block">
              Step 2: Describe Transformation
            </label>
            <div className="relative">
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                className={`w-full p-4 rounded-2xl border-2 border-slate-100 focus:border-${theme.color} outline-none text-lg resize-none bg-white text-black shadow-sm placeholder:text-slate-400 transition-all`}
                placeholder={selectedImage ? "How should we change this photo?" : labels.placeholder}
                rows={4}
              />
              <button
                onClick={generateImage}
                disabled={isGenerating || (!prompt.trim() && !selectedImage)}
                className={`mt-4 w-full bg-${theme.color} hover:bg-${theme.hover} disabled:bg-slate-200 disabled:text-slate-400 text-white py-4 rounded-2xl shadow-xl flex items-center justify-center gap-3 font-bold text-lg transition-all transform active:scale-[0.98]`}
              >
                {isGenerating ? (
                  <>
                    <RefreshCw className="animate-spin" size={24} />
                    <span>Creating Magic...</span>
                  </>
                ) : (
                  <>
                    <Sparkles size={24} />
                    <span>{selectedImage ? 'Transform Photo' : 'Generate Image'}</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Output Area */}
        <div className="flex flex-col gap-4">
          <label className="text-sm font-bold text-slate-500 uppercase tracking-wider block">
            Result
          </label>
          <div className="aspect-square w-full rounded-3xl border-2 border-dashed border-slate-200 bg-slate-50 flex items-center justify-center overflow-hidden relative group shadow-inner">
            {imageUrl ? (
              <>
                <img src={imageUrl} alt="Generated" className="w-full h-full object-cover" />
                
                {/* Branding Watermark Overlay */}
                <div className="absolute bottom-4 right-4 pointer-events-none">
                  <div className="bg-black/30 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/20 flex items-center gap-2">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.8)]"></div>
                    <span className="text-[11px] font-bold text-white tracking-wider uppercase opacity-90">
                      Peshkat Translation
                    </span>
                  </div>
                </div>

                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-4">
                  <a 
                    href={imageUrl} 
                    download="peshkat-ai-art.png"
                    className="bg-white text-slate-900 px-8 py-3 rounded-2xl font-bold flex items-center gap-2 hover:scale-105 transition-transform shadow-2xl"
                  >
                    <Download size={20} /> Download Work
                  </a>
                </div>
              </>
            ) : (
              <div className="text-center p-8">
                <div className="bg-white p-6 rounded-3xl inline-block mb-4 shadow-sm border border-slate-100">
                  <Sparkles className="text-slate-200" size={64} />
                </div>
                <p className="text-slate-400 font-bold max-w-[200px] mx-auto text-sm leading-relaxed">
                  {isGenerating 
                    ? "Our AI is analyzing your request to create something unique..." 
                    : "Your creative result will appear here after clicking generate."}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
      
      <div className="mt-12 p-6 bg-slate-50 rounded-2xl border border-slate-100 w-full max-w-4xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <h4 className="font-bold text-slate-800 flex items-center gap-2">
               <ImageIcon size={18} className={`text-${theme.color}`} />
               AI Photography Tips
            </h4>
            <p className="text-sm text-slate-500 leading-relaxed max-w-2xl">
              For best results: Use clear images with good lighting. You can ask for styles like "Kurdish traditional clothing", "3D animation", or "Mountain landscape background".
            </p>
          </div>
          <div className="shrink-0 flex items-center gap-2 px-4 py-2 bg-white rounded-xl border border-slate-200 shadow-sm">
             <ShieldCheck className="text-emerald-500" size={16} />
             <span className="text-[10px] font-bold text-slate-600 uppercase tracking-widest">Smart Watermark Active</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default KurdishImageGen;
