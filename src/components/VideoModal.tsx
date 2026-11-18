import React, { useState, useEffect } from 'react';
import { X, Play, Pause, Volume2, VolumeX, Maximize2, Sparkles } from 'lucide-react';
import { type MunicipalityCase } from '../data/educareData';

interface VideoModalProps {
  municipality: MunicipalityCase;
  onClose: () => void;
}

export const VideoModal: React.FC<VideoModalProps> = ({ municipality, onClose }) => {
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(15);

  useEffect(() => {
    let interval: any;
    if (isPlaying) {
      interval = setInterval(() => {
        setProgress((prev) => (prev >= 100 ? 0 : prev + 1));
      }, 300);
    }
    return () => clearInterval(interval);
  }, [isPlaying]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-3xl bg-slate-900 rounded-3xl shadow-2xl border border-slate-700 overflow-hidden flex flex-col">
        {/* Top bar */}
        <div className="px-6 py-4 bg-slate-900/90 border-b border-slate-800 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse"></span>
            <div>
              <div className="text-xs text-slate-400 font-medium">Demonstração em Vídeo / Case de Sucesso</div>
              <h3 className="text-base font-bold text-white">{municipality.videoTitle}</h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Video Canvas / Player Area */}
        <div className="relative aspect-video w-full bg-slate-950 flex items-center justify-center overflow-hidden group">
          <img
            src={municipality.videoThumbnail}
            alt={municipality.name}
            className="absolute inset-0 w-full h-full object-cover opacity-60 filter brightness-90 transition-transform duration-700 group-hover:scale-105"
          />

          {/* Video Overlay Graphics */}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent pointer-events-none"></div>

          {/* Center Play/Pause button */}
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="relative z-10 w-16 h-16 rounded-full bg-blue-600/90 text-white flex items-center justify-center shadow-2xl backdrop-blur-md hover:bg-blue-500 hover:scale-110 active:scale-95 transition-all"
          >
            {isPlaying ? <Pause className="w-8 h-8" /> : <Play className="w-8 h-8 ml-1" />}
          </button>

          {/* Lower caption in video */}
          <div className="absolute bottom-12 left-6 right-6 z-10 text-white pointer-events-none">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-500/90 text-slate-950 rounded-full text-xs font-black uppercase mb-1">
              <Sparkles className="w-3.5 h-3.5" />
              Depoimento de Gestores & Prática em Sala
            </div>
            <h4 className="text-lg font-bold drop-shadow-md">
              {municipality.name} — Parceria Grupo Educare & Rede Municipal de Ensino
            </h4>
          </div>

          {/* Scrub bar */}
          <div className="absolute bottom-0 left-0 right-0 z-20 bg-slate-900/95 px-4 py-2 flex items-center gap-3 border-t border-slate-800 text-xs text-slate-300">
            <button onClick={() => setIsPlaying(!isPlaying)} className="hover:text-white">
              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            </button>

            <span className="font-mono text-[11px]">0:{Math.floor(progress * 0.9).toString().padStart(2, '0')} / 1:30</span>

            <div className="flex-1 h-1.5 bg-slate-700 rounded-full overflow-hidden cursor-pointer">
              <div
                className="h-full bg-blue-500 transition-all duration-300"
                style={{ width: `${progress}%` }}
              ></div>
            </div>

            <button onClick={() => setIsMuted(!isMuted)} className="hover:text-white">
              {isMuted ? <VolumeX className="w-4 h-4 text-red-400" /> : <Volume2 className="w-4 h-4" />}
            </button>
            <button className="hover:text-white">
              <Maximize2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Bottom Details */}
        <div className="p-5 bg-slate-900 border-t border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-slate-300 text-xs">
          <div>
            <span className="font-semibold text-white">Impacto Registrado:</span> Mais de {municipality.studentsImpacted > 0 ? municipality.studentsImpacted.toLocaleString() : '10.000'} alunos contemplados e formação continuada realizada com apoio técnico do Grupo Educare.
          </div>
          <button
            onClick={() => {
              alert('Vídeo compartilhado com sucesso via link!');
            }}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-xl shrink-0 transition-all border border-slate-700"
          >
            Copiar Link do Vídeo
          </button>
        </div>
      </div>
    </div>
  );
};
