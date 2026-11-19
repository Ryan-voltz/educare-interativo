import React, { useState } from 'react';
import { Map, Globe, Maximize2, Minimize2, Volume2, VolumeX, FileSignature } from 'lucide-react';
import { sounds } from '../utils/audio';

interface HeaderProps {
  viewMode: 'bahia' | 'brasil';
  onViewModeChange: (mode: 'bahia' | 'brasil') => void;
  onOpenProposal: () => void;
}

export const Header: React.FC<HeaderProps> = ({ viewMode, onViewModeChange, onOpenProposal }) => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isAudioMuted, setIsAudioMuted] = useState(!sounds.enabled);

  const toggleFullscreen = () => {
    sounds.playTap();
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen?.().catch(() => {});
      setIsFullscreen(false);
    }
  };

  const toggleAudio = () => {
    sounds.enabled = !sounds.enabled;
    setIsAudioMuted(!sounds.enabled);
    if (sounds.enabled) sounds.playTap();
  };

  const tabs: { id: 'bahia' | 'brasil'; label: string; Icon: typeof Map }[] = [
    { id: 'bahia', label: 'Bahia', Icon: Map },
    { id: 'brasil', label: 'Brasil', Icon: Globe },
  ];

  return (
    <header className="w-full bg-white border-b border-slate-200 sticky top-0 z-30">
      <div className="max-w-[1680px] mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-20 lg:h-16 2xl:h-20 flex items-center justify-between gap-2 sm:gap-4">
        <button
          type="button"
          onClick={() => {
            sounds.playTap();
            onViewModeChange('bahia');
          }}
          className="shrink-0 rounded-xl"
          aria-label="Grupo Educare Editora, voltar ao mapa da Bahia"
        >
          <img
            src="/brand/logo-grupo-educare.png"
            alt="Grupo Educare Editora"
            className="h-11 sm:h-[60px] lg:h-12 2xl:h-[60px] w-auto"
            draggable={false}
          />
        </button>

        <div className="flex items-center gap-2 sm:gap-3">
          <div
            role="tablist"
            aria-label="Escolha o mapa"
            className="flex p-1 bg-slate-100 rounded-2xl"
          >
            {tabs.map(({ id, label, Icon }) => {
              const active = viewMode === id;
              return (
                <button
                  key={id}
                  role="tab"
                  aria-selected={active}
                  onClick={() => {
                    sounds.playTap();
                    onViewModeChange(id);
                  }}
                  className={`flex items-center gap-1.5 sm:gap-2 px-3 sm:px-5 h-10 rounded-xl text-sm font-semibold transition-colors ${
                    active
                      ? 'bg-blue-950 text-white shadow-sm'
                      : 'text-slate-600 hover:text-blue-950'
                  }`}
                >
                  <Icon className="w-4 h-4 hidden min-[400px]:block" />
                  {label}
                </button>
              );
            })}
          </div>

          <div className="hidden sm:flex items-center">
            <button
              onClick={toggleAudio}
              className="w-10 h-10 flex items-center justify-center text-slate-500 hover:text-blue-950 hover:bg-slate-100 rounded-xl transition-colors"
              title={isAudioMuted ? 'Ativar sons de toque' : 'Silenciar sons de toque'}
              aria-label={isAudioMuted ? 'Ativar sons de toque' : 'Silenciar sons de toque'}
            >
              {isAudioMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
            </button>
            <button
              onClick={toggleFullscreen}
              className="w-10 h-10 flex items-center justify-center text-slate-500 hover:text-blue-950 hover:bg-slate-100 rounded-xl transition-colors"
              title={isFullscreen ? 'Sair da tela cheia' : 'Modo totem (tela cheia)'}
              aria-label={isFullscreen ? 'Sair da tela cheia' : 'Modo totem (tela cheia)'}
            >
              {isFullscreen ? <Minimize2 className="w-5 h-5" /> : <Maximize2 className="w-5 h-5" />}
            </button>
          </div>

          <button
            onClick={() => {
              sounds.playTap();
              onOpenProposal();
            }}
            className="btn-yellow flex items-center justify-center gap-2 h-11 w-11 sm:w-auto sm:px-5 rounded-2xl text-sm font-semibold"
            aria-label="Simular proposta"
          >
            <FileSignature className="w-4 h-4" />
            <span className="hidden sm:inline">Simular proposta</span>
          </button>
        </div>
      </div>
    </header>
  );
};
