import React, { useState } from 'react';
import { Map, Globe, Sparkles, Maximize2, Minimize2, Volume2, VolumeX } from 'lucide-react';
import { sounds } from '../utils/audio';

interface HeaderProps {
  viewMode: 'bahia' | 'brasil';
  onViewModeChange: (mode: 'bahia' | 'brasil') => void;
  onOpenProposal: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  viewMode,
  onViewModeChange,
  onOpenProposal,
}) => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isAudioMuted, setIsAudioMuted] = useState(!sounds.enabled);

  const toggleFullscreen = () => {
    sounds.playTap();
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
      }
      setIsFullscreen(false);
    }
  };

  const toggleAudio = () => {
    sounds.enabled = !sounds.enabled;
    setIsAudioMuted(!sounds.enabled);
    if (sounds.enabled) {
      sounds.playTap();
    }
  };

  return (
    <header className="w-full bg-white/95 backdrop-blur-md border-b border-slate-200/90 sticky top-0 z-30 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-3.5">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 sm:gap-4">
          {/* Logo & Slide-style Title */}
          <div className="flex items-center gap-3.5 sm:gap-6">
            {/* Grupo Educare Stylized Logo */}
            <div
              className="flex items-center gap-2.5 group cursor-pointer"
              onClick={() => {
                sounds.playTap();
                onViewModeChange('bahia');
              }}
            >
              <div className="relative w-11 h-11 flex items-center justify-center shrink-0">
                <svg viewBox="0 0 40 40" className="w-full h-full filter drop-shadow-xs">
                  {/* Left pages: orange, green, light blue */}
                  <path d="M8 28C14 26 19 28 20 32C19 22 13 21 8 23Z" fill="#F58220" />
                  <path d="M8 22C14 20 19 22 20 26C19 16 13 15 8 17Z" fill="#8DC63F" />
                  <path d="M8 16C14 14 19 16 20 20C19 10 13 9 8 11Z" fill="#00A0E3" />
                  {/* Right pages: navy, royal blue, sky blue */}
                  <path d="M32 28C26 26 21 28 20 32C21 22 27 21 32 23Z" fill="#003566" />
                  <path d="M32 22C26 20 21 22 20 26C21 16 27 15 32 17Z" fill="#005B99" />
                  <path d="M32 16C26 14 21 16 20 20C21 10 27 9 32 11Z" fill="#0077CC" />
                </svg>
              </div>

              <div>
                <div className="text-[10px] font-black text-slate-500 tracking-[0.2em] uppercase leading-tight">
                  GRUPO
                </div>
                <div className="text-xl sm:text-2xl font-black text-blue-950 tracking-tight leading-none">
                  EDUCARE
                </div>
              </div>
            </div>

            {/* Vertical Separator */}
            <div className="hidden sm:block h-9 w-px bg-slate-200"></div>

            {/* Slide Title matching the reference banner */}
            <div>
              <h1 className="text-lg sm:text-xl md:text-2xl font-black text-blue-950 tracking-tight leading-tight">
                {viewMode === 'bahia'
                  ? 'Presença nos municípios baianos'
                  : 'Presença e expansão no território nacional'}
              </h1>
              <p className="text-xs text-slate-500 font-medium hidden sm:block">
                Soluções pedagógicas estruturadas e formação contínua para redes municipais
              </p>
            </div>
          </div>

          {/* Right Action: View Toggle & Stand Utilities */}
          <div className="flex items-center gap-2.5 sm:gap-3 self-end md:self-center">
            {/* Audio Toggle */}
            <button
              onClick={toggleAudio}
              className="p-2 text-slate-600 hover:text-blue-900 hover:bg-slate-100 rounded-xl transition-all"
              title={isAudioMuted ? 'Ativar Efeitos Sonoros' : 'Silenciar Efeitos Sonoros'}
            >
              {isAudioMuted ? <VolumeX className="w-4 h-4 text-slate-400" /> : <Volume2 className="w-4 h-4 text-blue-700" />}
            </button>

            {/* Fullscreen Toggle (Stand Mode) */}
            <button
              onClick={toggleFullscreen}
              className="p-2 text-slate-600 hover:text-blue-900 hover:bg-slate-100 rounded-xl transition-all hidden sm:block"
              title={isFullscreen ? 'Sair de Tela Cheia' : 'Modo Totem / Tela Cheia'}
            >
              {isFullscreen ? <Minimize2 className="w-4 h-4 text-blue-700" /> : <Maximize2 className="w-4 h-4 text-slate-600" />}
            </button>

            {/* Toggle Bahia x Brasil */}
            <div className="flex p-1 bg-slate-100 rounded-2xl border border-slate-200">
              <button
                onClick={() => {
                  sounds.playTap();
                  onViewModeChange('bahia');
                }}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  viewMode === 'bahia'
                    ? 'bg-blue-900 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Map className="w-3.5 h-3.5" />
                <span>Bahia</span>
              </button>
              <button
                onClick={() => {
                  sounds.playTap();
                  onViewModeChange('brasil');
                }}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  viewMode === 'brasil'
                    ? 'bg-blue-900 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Globe className="w-3.5 h-3.5" />
                <span>Nacional</span>
              </button>
            </div>

            {/* Quick Stand CTA */}
            <button
              onClick={() => {
                sounds.playTap();
                onOpenProposal();
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-orange-500 hover:bg-orange-600 text-white text-xs font-black uppercase rounded-xl shadow-xs transition-all active:scale-95"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Nova</span> Proposta
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
