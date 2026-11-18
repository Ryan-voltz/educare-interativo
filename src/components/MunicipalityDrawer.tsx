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
} from 'lucide-react';
import { type MunicipalityCase, CATALOG_PROJECTS } from '../data/educareData';

interface MunicipalityDrawerProps {
  municipality: MunicipalityCase | null;
  onClose: () => void;
  onOpenFolder: (municipality: MunicipalityCase) => void;
  onOpenVideo: (municipality: MunicipalityCase) => void;
}

export const MunicipalityDrawer: React.FC<MunicipalityDrawerProps> = ({
  municipality,
  onClose,
  onOpenFolder,
  onOpenVideo,
}) => {
  if (!municipality) return null;

  const primaryProject = CATALOG_PROJECTS[municipality.primaryProject] || CATALOG_PROJECTS['alfa-educa'];

  const whatsappMessage = encodeURIComponent(
    `Olá equipe Educare! Estou aqui no evento da Undime e gostaria de agendar uma apresentação das propostas pedagógicas para o município de ${municipality.name} - BA.`
  );

  return (
    <div className="fixed inset-y-0 right-0 z-40 w-full max-w-lg bg-white shadow-2xl border-l border-slate-200 flex flex-col transition-transform duration-300 ease-in-out">
      {/* Top Header */}
      <div className="px-6 py-5 bg-gradient-to-r from-blue-900 via-blue-800 to-sky-900 text-white flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-blue-200 uppercase tracking-wider">
            <MapPin className="w-4 h-4 text-amber-400" />
            <span>{municipality.region}</span>
          </div>
          <h2 className="text-2xl font-black tracking-tight text-white mt-1">
            {municipality.name}
          </h2>
          <div className="flex items-center gap-2 mt-2">
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              {municipality.status} ({municipality.contractDate})
            </span>
          </div>
        </div>

        <button
          onClick={onClose}
          className="p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-xl transition-all"
        >
          <X className="w-6 h-6" />
        </button>
      </div>

      {/* Scrollable Body */}
      <div className="p-6 overflow-y-auto flex-1 space-y-6">
        {/* KPI Grid */}
        <div className="grid grid-cols-3 gap-3">
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-2xl text-center">
            <School className="w-5 h-5 text-blue-600 mx-auto mb-1" />
            <div className="text-lg font-black text-slate-900">
              {municipality.schoolsCount > 0 ? municipality.schoolsCount : '15+'}
            </div>
            <div className="text-[11px] font-semibold text-slate-500 uppercase">Escolas</div>
          </div>

          <div className="p-3 bg-slate-50 border border-slate-200 rounded-2xl text-center">
            <Users className="w-5 h-5 text-emerald-600 mx-auto mb-1" />
            <div className="text-lg font-black text-slate-900">
              {municipality.studentsImpacted > 0
                ? municipality.studentsImpacted.toLocaleString()
                : '5.000+'}
            </div>
            <div className="text-[11px] font-semibold text-slate-500 uppercase">Alunos</div>
          </div>

          <div className="p-3 bg-slate-50 border border-slate-200 rounded-2xl text-center">
            <GraduationCap className="w-5 h-5 text-amber-600 mx-auto mb-1" />
            <div className="text-lg font-black text-slate-900">
              {municipality.teachersTrained > 0 ? municipality.teachersTrained : '200+'}
            </div>
            <div className="text-[11px] font-semibold text-slate-500 uppercase">Docentes</div>
          </div>
        </div>

        {/* Highlighted Metric Card */}
        {municipality.metrics && (
          <div className="p-4 bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200/80 rounded-2xl flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-amber-500 text-white rounded-xl shadow-md">
                <TrendingUp className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs font-bold text-amber-900 uppercase">Resultado em Destaque</div>
                <div className="text-sm font-semibold text-slate-800">
                  {municipality.metrics.literacyRate || municipality.metrics.idebGrowth || 'Satisfação e Eficiência Comprovada'}
                </div>
              </div>
            </div>
            <div className="text-xs font-black text-amber-700 bg-white px-2.5 py-1 rounded-lg border border-amber-300 shadow-sm">
              {municipality.metrics.idebGrowth || '100% BNCC'}
            </div>
          </div>
        )}

        {/* Primary Project Box */}
        <div className="border border-slate-200 rounded-2xl p-4 bg-white shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-100 text-blue-800">
              {primaryProject.tag}
            </span>
            <span className="text-xs font-medium text-slate-400">
              Segmento: {primaryProject.segment}
            </span>
          </div>

          <h4 className="text-base font-bold text-slate-900">
            {primaryProject.title}
          </h4>

          <p className="text-xs text-slate-600 leading-relaxed">
            {primaryProject.description}
          </p>

          <div className="pt-2 border-t border-slate-100 flex flex-col sm:flex-row gap-2">
            <button
              onClick={() => onOpenFolder(municipality)}
              className="flex-1 flex items-center justify-center gap-2 px-3 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl active:scale-95 transition-all shadow-md"
            >
              <FileText className="w-4 h-4" />
              <span>Ver Folder Didático</span>
            </button>

            <button
              onClick={() => onOpenVideo(municipality)}
              className="flex-1 flex items-center justify-center gap-2 px-3 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xl active:scale-95 transition-all"
            >
              <Play className="w-4 h-4 text-blue-600" />
              <span>Assistir Vídeo Case</span>
            </button>
          </div>
        </div>

        {/* Testimonial if present */}
        {municipality.testimonial ? (
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl relative">
            <div className="text-slate-400 text-2xl font-serif leading-none absolute top-3 left-3 opacity-30">
              “
            </div>
            <p className="text-xs italic text-slate-700 pl-4 relative z-10 leading-relaxed">
              "{municipality.testimonial.quote}"
            </p>
            <div className="mt-3 pl-4 text-[11px] font-bold text-slate-900 flex items-center justify-between">
              <span>{municipality.testimonial.author}</span>
              <span className="text-slate-500 font-normal">{municipality.testimonial.role}</span>
            </div>
          </div>
        ) : (
          <div className="p-4 bg-sky-50/70 border border-sky-100 rounded-2xl flex items-start gap-3">
            <Award className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
            <div className="text-xs text-slate-700">
              <span className="font-bold text-blue-900">Assessoria Especializada:</span> Formação continuada presencial de professores e apoio direto aos coordenadores da rede de {municipality.name}.
            </div>
          </div>
        )}

        {/* WhatsApp Direct Action for Undime stand */}
        <div className="p-4 bg-gradient-to-br from-emerald-600 to-teal-700 text-white rounded-2xl shadow-lg space-y-3">
          <div className="flex items-center gap-2">
            <MessageCircle className="w-5 h-5 text-emerald-200" />
            <h5 className="font-bold text-sm">Atendimento Imediato no Estande Undime</h5>
          </div>
          <p className="text-xs text-emerald-100 leading-relaxed">
            Deseja alinhar uma proposta pedagógica sob medida para {municipality.name}? Converse agora com nossa consultoria educacional presente no evento.
          </p>
          <a
            href={`https://wa.me/5571999999999?text=${whatsappMessage}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 w-full py-2.5 bg-white text-emerald-800 hover:bg-emerald-50 rounded-xl font-bold text-xs transition-all shadow-md active:scale-95"
          >
            <span>Falar com Consultor no WhatsApp</span>
          </a>
        </div>
      </div>
    </div>
  );
};
