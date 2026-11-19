import React from 'react';
import {
  X,
  MapPin,
  School,
  Users,
  GraduationCap,
  TrendingUp,
  FileText,
  Play,
  MessageCircle,
  Award,
  Sparkles,
  ChevronRight,
  CheckCircle,
} from 'lucide-react';
import { type MunicipalityCase, CATALOG_PROJECTS } from '../data/educareData';
import { sounds } from '../utils/audio';

interface MunicipalityDrawerProps {
  municipality: MunicipalityCase | null;
  onClose: () => void;
  onOpenFolder: (municipality: MunicipalityCase) => void;
  onOpenVideo: (municipality: MunicipalityCase) => void;
  onOpenProposal: (municipality: MunicipalityCase) => void;
}

export const MunicipalityDrawer: React.FC<MunicipalityDrawerProps> = ({
  municipality,
  onClose,
  onOpenFolder,
  onOpenVideo,
  onOpenProposal,
}) => {
  if (!municipality) return null;

  const primaryProject = CATALOG_PROJECTS[municipality.primaryProject] || CATALOG_PROJECTS['alfa-educa'];

  const whatsappMessage = encodeURIComponent(
    `Olá equipe Educare! Estou no estande da Undime e gostaria de agendar uma apresentação técnica sobre a atuação pedagógica em ${municipality.name} - BA.`
  );

  return (
    <div className="fixed inset-0 z-40 flex justify-end bg-slate-950/40 backdrop-blur-xs animate-backdrop">
      <div className="w-full max-w-lg bg-white shadow-modal border-l border-slate-200 flex flex-col h-full animate-drawer overflow-hidden">
        {/* Header Banner */}
        <div className="px-6 py-6 bg-gradient-to-br from-blue-950 via-blue-900 to-indigo-950 text-white relative">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold text-amber-400 uppercase tracking-widest">
                <MapPin className="w-4 h-4 text-orange-400" />
                <span>{municipality.region}</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white mt-1">
                {municipality.name}
              </h2>
              <div className="flex items-center gap-2 mt-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                  {municipality.status} ({municipality.contractDate})
                </span>
              </div>
            </div>

            <button
              onClick={() => {
                sounds.playTap();
                onClose();
              }}
              className="p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-xl transition-all"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Scrollable Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          {/* Key Metrics Grid */}
          <div className="grid grid-cols-3 gap-3">
            <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-center">
              <School className="w-5 h-5 text-blue-700 mx-auto mb-1.5" />
              <div className="text-xl font-black text-slate-900">
                {municipality.schoolsCount > 0 ? municipality.schoolsCount : '15+'}
              </div>
              <div className="text-[10px] font-bold text-slate-500 uppercase mt-0.5">Escolas</div>
            </div>

            <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-center">
              <Users className="w-5 h-5 text-emerald-600 mx-auto mb-1.5" />
              <div className="text-xl font-black text-slate-900">
                {municipality.studentsImpacted > 0
                  ? `${(municipality.studentsImpacted / 1000).toFixed(1)}k`
                  : '5k+'}
              </div>
              <div className="text-[10px] font-bold text-slate-500 uppercase mt-0.5">Alunos</div>
            </div>

            <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-center">
              <GraduationCap className="w-5 h-5 text-amber-600 mx-auto mb-1.5" />
              <div className="text-xl font-black text-slate-900">
                {municipality.teachersTrained > 0 ? municipality.teachersTrained : '200+'}
              </div>
              <div className="text-[10px] font-bold text-slate-500 uppercase mt-0.5">Educadores</div>
            </div>
          </div>

          {/* Educational Impact Highlight */}
          {municipality.metrics && (
            <div className="p-4 bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200/80 rounded-2xl flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-amber-500 text-white rounded-xl shadow-xs">
                  <TrendingUp className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-bold text-amber-900 uppercase">Resultado Comprovado</div>
                  <div className="text-sm font-black text-slate-800">
                    {municipality.metrics.literacyRate || municipality.metrics.idebGrowth || 'Avanço Estruturado'}
                  </div>
                </div>
              </div>
              <div className="text-xs font-black text-amber-800 bg-white px-2.5 py-1 rounded-lg border border-amber-200 shadow-2xs">
                {municipality.metrics.idebGrowth || '100% BNCC'}
              </div>
            </div>
          )}

          {/* Primary Pedagogical Project */}
          <div className="border border-slate-200 rounded-2xl p-5 bg-white shadow-xs space-y-3.5">
            <div className="flex items-center justify-between">
              <span className="px-3 py-1 rounded-full text-xs font-black bg-blue-100 text-blue-900">
                {primaryProject.tag}
              </span>
              <span className="text-xs font-bold text-slate-400">
                {primaryProject.segment}
              </span>
            </div>

            <h3 className="text-base font-black text-slate-900">
              {primaryProject.title}
            </h3>

            <p className="text-xs text-slate-600 leading-relaxed">
              {primaryProject.description}
            </p>

            <div className="space-y-1.5 pt-1">
              {primaryProject.highlights.slice(0, 2).map((h, i) => (
                <div key={i} className="flex items-center gap-2 text-xs text-slate-700">
                  <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{h}</span>
                </div>
              ))}
            </div>

            {/* Folder and Video Actions */}
            <div className="pt-3 border-t border-slate-100 flex flex-col sm:flex-row gap-2">
              <button
                onClick={() => {
                  sounds.playTap();
                  onOpenFolder(municipality);
                }}
                className="flex-1 flex items-center justify-center gap-2 px-3 py-2.5 bg-blue-900 hover:bg-blue-950 text-white text-xs font-bold rounded-xl active:scale-95 transition-all shadow-xs"
              >
                <FileText className="w-4 h-4 text-amber-400" />
                <span>Ver Folder Pedagógico</span>
              </button>

              <button
                onClick={() => {
                  sounds.playTap();
                  onOpenVideo(municipality);
                }}
                className="flex-1 flex items-center justify-center gap-2 px-3 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xl active:scale-95 transition-all"
              >
                <Play className="w-4 h-4 text-blue-700" />
                <span>Assistir Case em Vídeo</span>
              </button>
            </div>
          </div>

          {/* Testimonial / Manager Quote */}
          {municipality.testimonial ? (
            <div className="p-4 bg-slate-50 border border-slate-200/80 rounded-2xl relative">
              <p className="text-xs italic text-slate-700 leading-relaxed font-medium">
                "{municipality.testimonial.quote}"
              </p>
              <div className="mt-3 text-[11px] font-bold text-slate-900 flex items-center justify-between">
                <span>{municipality.testimonial.author}</span>
                <span className="text-slate-500 font-normal">{municipality.testimonial.role}</span>
              </div>
            </div>
          ) : (
            <div className="p-4 bg-sky-50/70 border border-sky-100 rounded-2xl flex items-start gap-3">
              <Award className="w-5 h-5 text-blue-700 shrink-0 mt-0.5" />
              <div className="text-xs text-slate-700">
                <span className="font-bold text-blue-950">Atendimento Técnico Integrado:</span> Formação presencial mensal de professores e assessoria contínua para as equipes da rede municipal de {municipality.name}.
              </div>
            </div>
          )}

          {/* Simulate or Request Proposal for this City */}
          <button
            onClick={() => {
              sounds.playTap();
              onOpenProposal(municipality);
            }}
            className="w-full py-3 px-4 bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs uppercase rounded-xl flex items-center justify-center gap-2 shadow-xs transition-all active:scale-95"
          >
            <Sparkles className="w-4 h-4 text-slate-950" />
            <span>Simular Proposta para {municipality.name}</span>
          </button>

          {/* Direct WhatsApp Action for Undime stand */}
          <div className="p-4 bg-gradient-to-br from-emerald-700 to-teal-800 text-white rounded-2xl shadow-md space-y-2.5">
            <div className="flex items-center gap-2">
              <MessageCircle className="w-5 h-5 text-emerald-200" />
              <div className="font-extrabold text-sm">Plantão Técnico no Estande Undime</div>
            </div>
            <p className="text-xs text-emerald-100 leading-relaxed">
              Deseja alinhar detalhes ou agendar visita de nossa consultoria pedagógica em {municipality.name}?
            </p>
            <a
              href={`https://wa.me/5571999999999?text=${whatsappMessage}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full py-2.5 bg-white text-emerald-900 hover:bg-emerald-50 rounded-xl font-black text-xs transition-all shadow-xs active:scale-95"
            >
              <span>Conversar com a Equipe no WhatsApp</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
