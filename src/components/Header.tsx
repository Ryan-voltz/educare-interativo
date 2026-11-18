import React from 'react';
import { Map, Globe, Sparkles } from 'lucide-react';

interface HeaderProps {
  viewMode: 'bahia' | 'brasil';
  onViewModeChange: (mode: 'bahia' | 'brasil') => void;
}

export const Header: React.FC<HeaderProps> = ({ viewMode, onViewModeChange }) => {
  return (
    <header className="w-full bg-white/95 backdrop-blur-md border-b border-slate-200 sticky top-0 z-30 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 sm:py-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          {/* Logo & Slide-style Title */}
          <div className="flex items-center gap-4 sm:gap-6">
            {/* Grupo Educare Stylized Logo */}
            <div className="flex items-center gap-2.5 group cursor-pointer" onClick={() => onViewModeChange('bahia')}>
              {/* Multi-colored book icon like the real logo */}
              <div className="relative w-10 h-10 flex items-center justify-center">
                <svg viewBox="0 0 40 40" className="w-full h-full">
                  {/* Left pages orange/green */}
                  <path d="M8 28C14 26 19 28 20 32C19 22 13 21 8 23Z" fill="#F58220" />
                  <path d="M8 22C14 20 19 22 20 26C19 16 13 15 8 17Z" fill="#8DC63F" />
                  <path d="M8 16C14 14 19 16 20 20C19 10 13 9 8 11Z" fill="#00A0E3" />
                  {/* Right pages blue */}
                  <path d="M32 28C26 26 21 28 20 32C21 22 27 21 32 23Z" fill="#004B87" />
                  <path d="M32 22C26 20 21 22 20 26C21 16 27 15 32 17Z" fill="#0066B2" />
                  <path d="M32 16C26 14 21 16 20 20C21 10 27 9 32 11Z" fill="#0080D2" />
                </svg>
              </div>

              <div>
                <div className="text-[10px] font-bold text-slate-500 tracking-widest uppercase">
                  GRUPO
                </div>
                <div className="text-xl font-black text-blue-900 tracking-tight leading-none">
                  EDUCARE
                </div>
              </div>
            </div>

            {/* Vertical Separator */}
            <div className="hidden sm:block h-8 w-px bg-slate-200"></div>

            {/* Slide Title matching the reference banner */}
            <div>
              <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-blue-950 tracking-tight">
                {viewMode === 'bahia'
                  ? 'Presença nos municípios baianos'
                  : 'Presença e expansão no território nacional'}
              </h1>
              <p className="text-xs text-slate-500 hidden sm:block">
                Soluções pedagógicas estruturadas e formação contínua para redes públicas
              </p>
            </div>
          </div>

          {/* Right Action: View Toggle & Undime Badge */}
          <div className="flex items-center gap-3 self-end md:self-center">
            {/* Event Badge */}
            <div className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 bg-orange-50 border border-orange-200/80 rounded-xl text-xs font-bold text-orange-800">
              <Sparkles className="w-3.5 h-3.5 text-orange-600" />
              <span>Undime Bahia 2026</span>
            </div>

            {/* Toggle Bahia x Brasil */}
            <div className="flex p-1 bg-slate-100 rounded-2xl border border-slate-200/80">
              <button
                onClick={() => onViewModeChange('bahia')}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  viewMode === 'bahia'
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Map className="w-3.5 h-3.5" />
                <span>Bahia</span>
              </button>
              <button
                onClick={() => onViewModeChange('brasil')}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  viewMode === 'brasil'
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Globe className="w-3.5 h-3.5" />
                <span>Nacional</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
