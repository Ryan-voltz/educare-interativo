import React, { useState, useEffect } from 'react';
import {
  X,
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize2,
  Sparkles,
  Calendar,
  Users,
  Award,
  CheckCircle,
} from 'lucide-react';
import { type MunicipalityCase } from '../data/educareData';
import { sounds } from '../utils/audio';

interface VideoModalProps {
  municipality: MunicipalityCase;
  onClose: () => void;
}

const CHAPTERS = [
  { time: 0, label: 'Visão Geral da Parceria' },
  { time: 25, label: 'Atividades em Sala de Aula' },
  { time: 55, label: 'Depoimento da Equipe Pedagógica' },
  { time: 80, label: 'Avanço nas Avaliações SAEB' },
];

export const VideoModal: React.FC<VideoModalProps> = ({ municipality, onClose }) => {
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(15);

  useEffect(() => {
    let interval: any;
    if (isPlaying) {
      interval = setInterval(() => {
        setProgress((prev) => (prev >= 100 ? 0 : prev + 1));
      }, 400);
    }
    return () => clearInterval(interval);
  }, [isPlaying]);

  const handleJumpToChapter = (sec: number) => {
    sounds.playTap();
    setProgress(Math.floor((sec / 90) * 100));
    setIsPlaying(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/85 backdrop-blur-md animate-backdrop">
      <div className="relative w-full max-w-3xl bg-slate-900 rounded-3xl shadow-modal border border-slate-700 overflow-hidden flex flex-col">
        {/* Top Header */}
        <div className="px-6 py-4 bg-slate-900 border-b border-slate-800 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse"></span>
            <div>
              <div className="text-xs text-slate-400 font-bold">
                Case em Vídeo • Rede Municipal de {municipality.name}
              </div>
              <h3 className="text-base font-semibold text-white">{municipality.videoTitle}</h3>
            </div>
          </div>
          <button
            onClick={() => {
              sounds.playTap();
              onClose();
            }}
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Video Canvas Container */}
        <div className="relative aspect-video w-full bg-slate-950 flex items-center justify-center overflow-hidden group">
          <img
            src={municipality.videoThumbnail}
            alt={municipality.name}
            className="absolute inset-0 w-full h-full object-cover opacity-65 filter brightness-90 transition-transform duration-700 group-hover:scale-105"
          />

          {/* Gradients */}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent pointer-events-none"></div>

          {/* Center Play/Pause button */}
          <button
            onClick={() => {
              sounds.playTap();
              setIsPlaying(!isPlaying);
            }}
            className="relative z-10 w-16 h-16 rounded-full bg-blue-600/90 text-white flex items-center justify-center shadow-2xl backdrop-blur-md hover:bg-blue-500 hover:scale-110 active:scale-95 transition-all"
          >
            {isPlaying ? <Pause className="w-8 h-8" /> : <Play className="w-8 h-8 ml-1" />}
          </button>

          {/* On-screen Video Badges */}
          <div className="absolute top-4 left-4 z-10 flex items-center gap-2">
            <span className="px-2.5 py-1 bg-blue-900/90 text-white text-xs font-semibold rounded-lg backdrop-blur-md border border-blue-700">
              {municipality.contractDate}
            </span>
            <span className="px-2.5 py-1 bg-emerald-900/90 text-emerald-300 text-xs font-semibold rounded-lg backdrop-blur-md border border-emerald-700">
              {municipality.studentsImpacted > 0 ? `${municipality.studentsImpacted.toLocaleString()} Alunos` : 'Rede Ativa'}
            </span>
          </div>

          {/* Lower caption in video */}
          <div className="absolute bottom-14 left-6 right-6 z-10 text-white pointer-events-none">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-500 text-slate-950 rounded-full text-[11px] font-semibold mb-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              Depoimento Registrado na Rede Municipal
            </div>
            <h4 className="text-base sm:text-lg font-bold drop-shadow-md">
              {municipality.name} — Parceria Estruturada Grupo Educare
            </h4>
          </div>

          {/* Player Scrub Bar */}
          <div className="absolute bottom-0 left-0 right-0 z-20 bg-slate-900/95 px-4 py-2.5 flex items-center gap-3 border-t border-slate-800 text-xs text-slate-300">
            <button
              onClick={() => {
                sounds.playTap();
                setIsPlaying(!isPlaying);
              }}
              className="hover:text-white"
            >
              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            </button>

            <span className="font-mono text-[11px]">
              0:{Math.floor(progress * 0.9).toString().padStart(2, '0')} / 1:30
            </span>

            <div
              onClick={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                const clickX = e.clientX - rect.left;
                const newProgress = Math.max(0, Math.min(100, Math.round((clickX / rect.width) * 100)));
                setProgress(newProgress);
              }}
              className="flex-1 h-2 bg-slate-700 rounded-full overflow-hidden cursor-pointer relative"
            >
              <div
                className="h-full bg-blue-500 transition-all duration-200"
                style={{ width: `${progress}%` }}
              ></div>
            </div>

            <button
              onClick={() => {
                sounds.playTap();
                setIsMuted(!isMuted);
              }}
              className="hover:text-white"
            >
              {isMuted ? <VolumeX className="w-4 h-4 text-red-400" /> : <Volume2 className="w-4 h-4 text-slate-300" />}
            </button>
            <button className="hover:text-white">
              <Maximize2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Video Chapters Selector */}
        <div className="p-4 bg-slate-900/90 border-t border-slate-800 flex items-center gap-2 overflow-x-auto no-scrollbar">
          <span className="text-xs font-bold text-slate-400 shrink-0">Capítulos:</span>
          {CHAPTERS.map((ch, idx) => (
            <button
              key={idx}
              onClick={() => handleJumpToChapter(ch.time)}
              className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold shrink-0 transition-all active:scale-95"
            >
              {ch.label}
            </button>
          ))}
        </div>

        {/* Bottom Details */}
        <div className="p-5 bg-slate-950 border-t border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-slate-300 text-xs">
          <div className="space-y-1">
            <div className="font-bold text-white flex items-center gap-1.5">
              <Award className="w-4 h-4 text-amber-400" />
              <span>Fornecimento Contínuo & Formação Presencial em {municipality.name}</span>
            </div>
            <p className="text-slate-400 text-[11px]">
              Materiais didáticos entregues e professores acompanhados mensalmente por coordenadores pedagógicos do Grupo Educare.
            </p>
          </div>

          <button
            onClick={() => {
              sounds.playChime();
              alert(`Link do vídeo do case de ${municipality.name} copiado para a área de transferência!`);
            }}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shrink-0 transition-all shadow-xs"
          >
            Compartilhar Vídeo
          </button>
        </div>
      </div>
    </div>
  );
};
