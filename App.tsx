
import React, { useState } from 'react';
import { Globe, Image as ImageIcon, MessageSquare, Headphones, BookOpen, User, Languages, Palette, Download, Monitor } from 'lucide-react';
import Translator from './components/Translator';
import KurdishImageGen from './components/KurdishImageGen';
import KurdishTTS from './components/KurdishTTS';
import KurdishWriter from './components/KurdishWriter';
import EnglishLearning from './components/EnglishLearning';
import AboutMe from './components/AboutMe';

enum Tab {
  TRANSLATOR = 'translator',
  IMAGE_GEN = 'image_gen',
  TTS = 'tts',
  WRITER = 'writer',
  LEARN = 'learn',
  ABOUT = 'about'
}

const uiLabels: Record<string, any> = {
  'en': { translate: 'Translate', learn: 'Learn', image: 'Image', audio: 'Audio', write: 'Write', about: 'About', hub: 'Kurdish Creator Hub', placeholder: 'Type here...', action: 'Action' },
  'ku-sorani': { translate: 'وەرگێڕان', learn: 'فێربوون', image: 'وێنە', audio: 'دەنگ', write: 'نووسین', about: 'دەربارە', hub: 'ناوەندی دروستکەرانی کورد', placeholder: 'لێرە بنووسە...', action: 'جێبەجێکردن' },
  'ku-badini': { translate: 'وەگێڕان', learn: 'فێربوون', image: 'وێنە', audio: 'دەنگ', write: 'نڤیسین', about: 'دەربارە', hub: 'ناڤەندا چێکەرێن کورد', placeholder: 'لێرە بنڤیسە...', action: 'ئەنجامدان' },
  'de': { translate: 'Übersetzen', learn: 'Lernen', image: 'Bild', audio: 'Audio', write: 'Schreiben', about: 'Über', hub: 'Kurdisches Creator-Hub', placeholder: 'Hier tippen...', action: 'Ausführen' },
  'ar': { translate: 'ترجمة', learn: 'تعلم', image: 'صور', audio: 'صوت', write: 'كتابة', about: 'حول', hub: 'مركز المبدعين الكرد', placeholder: 'اكتب هنا...', action: 'تنفيذ' },
  'tr': { translate: 'Çeviri', learn: 'Öğren', image: 'Görüntü', audio: 'Ses', write: 'Yaz', about: 'Hakkında', hub: 'Kürt İçerik Üreticileri', placeholder: 'Buraya yazın...', action: 'Uygula' },
  'fa': { translate: 'ترجمه', learn: 'یادگیری', image: 'تصویر', audio: 'صوت', write: 'نوشتن', about: 'درباره', hub: 'مرکز آفرینندگان کرد', placeholder: 'اینجا بنویسید...', action: 'اجرا' },
  'fr': { translate: 'Traduire', learn: 'Apprendre', image: 'Image', audio: 'Audio', write: 'Écrire', about: 'À propos', hub: 'Hub des Créateurs Kurdes', placeholder: 'Écrivez ici...', action: 'Exécuter' },
  'es': { translate: 'Traducir', learn: 'Aprender', image: 'Imagen', audio: 'Audio', write: 'Escribir', about: 'Sobre', hub: 'Centro de Creadores Kurdos', placeholder: 'Escribe aquí...', action: 'Ejecutar' },
  'it': { translate: 'Traduci', learn: 'Impara', image: 'Immagine', audio: 'Audio', write: 'Scrivi', about: 'Su', hub: 'Centro Creatori Curdi', placeholder: 'Scrivi qui...', action: 'Esegui' },
};

const languages = [
  { code: 'en', name: 'English' },
  { code: 'ku-sorani', name: 'Kurdish (Sorani)' },
  { code: 'ku-badini', name: 'Kurdish (Badini)' },
  { code: 'de', name: 'German' },
  { code: 'ar', name: 'Arabic' },
  { code: 'tr', name: 'Turkish' },
  { code: 'fa', name: 'Farsi' },
  { code: 'fr', name: 'French' },
  { code: 'es', name: 'Spanish' },
  { code: 'it', name: 'Italian' },
];

const themes = [
  { name: 'Black', color: 'slate-900', hover: 'black' },
  { name: 'Red', color: 'red-600', hover: 'red-700' },
  { name: 'Emerald', color: 'emerald-600', hover: 'emerald-700' },
  { name: 'Amber', color: 'amber-500', hover: 'amber-600' },
  { name: 'Indigo', color: 'indigo-600', hover: 'indigo-700' },
  { name: 'Rose', color: 'rose-600', hover: 'rose-700' },
];

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>(Tab.TRANSLATOR);
  const [uiLang, setUiLang] = useState('en');
  const [primaryTheme, setPrimaryTheme] = useState(themes[0]);

  const t = uiLabels[uiLang] || uiLabels['en'];
  const isRtl = uiLang.includes('ku') || uiLang === 'ar' || uiLang === 'fa';

  const renderContent = () => {
    const commonProps = { uiLang, labels: t, theme: primaryTheme };
    switch (activeTab) {
      case Tab.TRANSLATOR: return <Translator {...commonProps} />;
      case Tab.IMAGE_GEN: return <KurdishImageGen {...commonProps} />;
      case Tab.TTS: return <KurdishTTS {...commonProps} />;
      case Tab.WRITER: return <KurdishWriter {...commonProps} />;
      case Tab.LEARN: return <EnglishLearning {...commonProps} />;
      case Tab.ABOUT: return (
        <div className="flex flex-col h-full overflow-y-auto">
          <div className="bg-slate-900 text-white p-6 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="bg-white/10 p-3 rounded-2xl backdrop-blur-md">
                <Monitor className="text-white" size={32} />
              </div>
              <div>
                <h3 className="font-bold text-xl">Install on PC / Mobile</h3>
                <p className="text-slate-400 text-sm">Use Peshkat Hub as a standalone desktop app</p>
              </div>
            </div>
            <div className="bg-white/5 border border-white/10 px-4 py-2 rounded-xl text-xs flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
              <span>Click 'Install' in Browser Address Bar</span>
            </div>
          </div>
          <AboutMe uiLang={uiLang} theme={primaryTheme} />
        </div>
      );
      default: return <Translator {...commonProps} />;
    }
  };

  return (
    <div className={`min-h-screen bg-slate-50 flex flex-col ${isRtl ? 'rtl' : 'ltr'}`}>
      <header className="bg-white border-b border-slate-200 sticky top-0 z-20 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`bg-${primaryTheme.color} p-1 rounded-xl text-white transition-colors duration-300 shadow-md ring-2 ring-white`}>
              <img 
                src="https://img.icons8.com/color/96/kurdistan.png" 
                alt="Peshkat Logo" 
                className="w-10 h-10 object-contain rounded-lg bg-white p-0.5"
              />
            </div>
            <div className="flex flex-col">
              <h1 className="text-lg md:text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-900 via-slate-600 to-slate-400 leading-none">
                Peshkat Translation
              </h1>
              <span className="text-[9px] uppercase tracking-wider text-slate-400 font-bold">{t.hub}</span>
            </div>
          </div>

          <nav className="hidden lg:flex gap-4 xl:gap-6">
            {[
              { id: Tab.TRANSLATOR, icon: Globe, label: t.translate },
              { id: Tab.LEARN, icon: BookOpen, label: t.learn },
              { id: Tab.IMAGE_GEN, icon: ImageIcon, label: t.image },
              { id: Tab.TTS, icon: Headphones, label: t.audio },
              { id: Tab.WRITER, icon: MessageSquare, label: t.write },
              { id: Tab.ABOUT, icon: User, label: t.about }
            ].map(item => (
              <button 
                key={item.id}
                onClick={() => setActiveTab(item.id)} 
                className={`flex items-center gap-2 font-medium transition-colors ${activeTab === item.id ? `text-${primaryTheme.color}` : 'text-slate-500 hover:text-slate-800'}`}
              >
                <item.icon size={18} /> {item.label}
              </button>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 rounded-xl border border-slate-200">
              <Palette size={16} className="text-slate-500" />
              <div className="flex gap-1">
                {themes.map(theme => (
                  <button
                    key={theme.name}
                    onClick={() => setPrimaryTheme(theme)}
                    title={theme.name}
                    className={`w-4 h-4 rounded-full bg-${theme.color} border-2 ${primaryTheme.name === theme.name ? 'border-white ring-2 ring-slate-300 shadow-sm' : 'border-transparent'}`}
                  />
                ))}
              </div>
            </div>

            <div className="flex items-center gap-2 bg-slate-100 p-1.5 rounded-xl border border-slate-200">
              <Languages size={16} className="text-slate-500 ml-1" />
              <select 
                value={uiLang}
                onChange={(e) => setUiLang(e.target.value)}
                className="bg-transparent text-xs font-bold text-slate-700 outline-none cursor-pointer"
              >
                {languages.map(l => <option key={l.code} value={l.code}>{l.name}</option>)}
              </select>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-6xl mx-auto w-full p-0 md:p-8 flex flex-col">
        <div className="bg-white md:rounded-2xl shadow-xl shadow-slate-200/50 min-h-[600px] flex-1 overflow-hidden flex flex-col border border-slate-100">
          {renderContent()}
        </div>
      </main>

      <footer className="lg:hidden bg-white border-t border-slate-200 sticky bottom-0 z-20 pb-safe">
        <div className="flex justify-around items-center h-16 px-1">
          {[
            { id: Tab.TRANSLATOR, icon: Globe, label: t.translate },
            { id: Tab.LEARN, icon: BookOpen, label: t.learn },
            { id: Tab.IMAGE_GEN, icon: ImageIcon, label: t.image },
            { id: Tab.TTS, icon: Headphones, label: t.audio },
            { id: Tab.WRITER, icon: MessageSquare, label: t.write },
            { id: Tab.ABOUT, icon: User, label: t.about }
          ].map(item => (
            <button 
              key={item.id}
              onClick={() => setActiveTab(item.id)} 
              className={`flex flex-col items-center flex-1 text-[9px] ${activeTab === item.id ? `text-${primaryTheme.color}` : 'text-slate-400'}`}
            >
              <item.icon size={18} />
              <span className="mt-1">{item.label}</span>
            </button>
          ))}
        </div>
      </footer>
    </div>
  );
};

export default App;
