
import React from 'react';
import { User, ShieldCheck, Mail, Github, Globe, Languages, Zap, Instagram } from 'lucide-react';

interface AboutMeProps {
  uiLang: string;
  theme: { color: string; hover: string };
}

const AboutMe: React.FC<AboutMeProps> = ({ uiLang, theme }) => {
  return (
    <div className="p-6 md:p-12 flex flex-col items-center justify-start h-full bg-gradient-to-br from-white to-slate-50 overflow-y-auto">
      <div className="max-w-2xl w-full space-y-8">
        {/* Profile Card */}
        <div className="bg-white rounded-3xl shadow-2xl shadow-slate-200 border border-slate-100 p-8 md:p-12 relative overflow-hidden">
          <div className={`absolute -top-10 -right-10 w-40 h-40 bg-${theme.color}/10 rounded-full blur-3xl opacity-50 transition-colors`}></div>
          
          <div className="relative flex flex-col items-center text-center">
            <div className={`w-20 h-20 bg-${theme.color} rounded-2xl flex items-center justify-center text-white shadow-lg mb-6 rotate-3 transition-colors`}>
              <User size={40} />
            </div>
            
            <h2 className="text-3xl font-bold text-black mb-2">About Me</h2>
            <div className={`h-1 w-20 bg-gradient-to-r from-${theme.color} to-yellow-500 rounded-full mb-8 transition-colors`}></div>
            
            <p className="text-lg text-black leading-relaxed font-medium ltr mb-8">
              "Hello! This application was developed by <span className={`text-${theme.color} font-bold transition-colors`}>Peshkat Kucher</span>. 
              It is designed to be your personal assistant, helping you simplify your daily tasks and making it easier 
              and more efficient for you to learn the English language."
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full mb-8">
              <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                <ShieldCheck className="text-green-600" size={24} />
                <span className="text-sm font-bold text-slate-700">Verified Developer</span>
              </div>
              <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                <Globe className="text-blue-600" size={24} />
                <span className="text-sm font-bold text-slate-700">Peshkat Hub</span>
              </div>
            </div>

            <a 
              href="https://www.instagram.com/peshk4t_mahmadani?igsh=MXh0dnI2MzIxNmRqcw==" 
              target="_blank" 
              rel="noopener noreferrer"
              className="group flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 text-white rounded-2xl font-bold shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all"
            >
              <Instagram size={24} className="group-hover:rotate-12 transition-transform" />
              <span>Follow me on Instagram</span>
            </a>
          </div>
        </div>

        {/* Dynamic Interface Card */}
        <div className="bg-white rounded-3xl shadow-xl shadow-slate-100 border border-slate-100 p-8 md:p-10 relative overflow-hidden">
          <div className="flex items-center gap-4 mb-6">
            <div className={`bg-${theme.color}/10 p-3 rounded-xl text-${theme.color} transition-colors`}>
              <Zap size={28} />
            </div>
            <h3 className="text-xl font-bold text-black">Dynamic Interface</h3>
          </div>
          
          <p className="text-slate-700 leading-relaxed ltr font-medium text-base mb-6">
            "Our app now supports a fully dynamic interface. When you change the language settings, 
            all text, menus, and instructions throughout the entire application will automatically 
            switch to your selected language (including Kurdish Badini, Sorani, and English). 
            This ensures a seamless and personalized experience for every user."
          </p>

          <div className="flex items-center gap-4 py-4 border-t border-slate-50">
            <div className="bg-blue-100 p-2 rounded-lg text-blue-600">
              <Languages size={20} />
            </div>
            <div>
              <h4 className="text-sm font-bold text-black">Multi-Language Support</h4>
              <p className="text-xs text-slate-500">Kurdish (Badini/Sorani), English, German, and 7 more.</p>
            </div>
          </div>
          
          <p className="text-slate-600 text-sm ltr italic mt-4">
            "We have expanded the application's language settings to make it accessible to everyone. 
            This feature allows users from different backgrounds to use the app easily in their preferred language."
          </p>
        </div>
        
        <p className="text-center pb-8 text-slate-400 text-xs font-bold tracking-widest uppercase">
          © 2024 Peshkat Translation Hub
        </p>
      </div>
    </div>
  );
};

export default AboutMe;
