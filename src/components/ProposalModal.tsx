import React, { useState } from 'react';
import {
  X,
  Sparkles,
  Check,
  Send,
  Building2,
  Users,
  BookOpen,
  Cpu,
  Heart,
  Award,
  Download,
  Share2,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { sounds } from '../utils/audio';
import { VITORIA_WHATSAPP } from '../config/contato';
import { type MunicipalityCase } from '../data/educareData';

interface ProposalModalProps {
  initialMunicipality: MunicipalityCase | null;
  onClose: () => void;
}

export const ProposalModal: React.FC<ProposalModalProps> = ({
  initialMunicipality,
  onClose,
}) => {
  const [cityName, setCityName] = useState(initialMunicipality?.name || 'Seu Município');
  const [gestorName, setGestorName] = useState('');
  const [gestorRole, setGestorRole] = useState('Secretário(a) de Educação');
  const [studentTier, setStudentTier] = useState<number>(3500);

  // Selected Modules
  const [selectedModules, setSelectedModules] = useState<{
    alfa: boolean;
    maker: boolean;
    socio: boolean;
    gestao: boolean;
  }>({
    alfa: true,
    maker: true,
    socio: false,
    gestao: true,
  });

  const [generated, setGenerated] = useState(false);

  const toggleModule = (key: keyof typeof selectedModules) => {
    sounds.playTap();
    setSelectedModules((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleGenerate = () => {
    sounds.playChime();
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#004B87', '#F58220', '#8DC63F', '#00A0E3'],
    });
    setGenerated(true);
  };

  const shareText = encodeURIComponent(
    `*PROPOSTA PEDAGÓGICA GRUPO EDUCARE — UNDIME 2026*\n\n` +
      `📍 *Município:* ${cityName} - BA\n` +
      `👤 *Gestor(a):* ${gestorName || 'Representante Municipal'} (${gestorRole})\n` +
      `👥 *Alunos Estimados:* ~${studentTier.toLocaleString()} alunos\n\n` +
      `📚 *Soluções Selecionadas:*\n` +
      (selectedModules.alfa ? `• Coleção AlfaEduca (Alfabetização na Idade Certa)\n` : '') +
      (selectedModules.maker ? `• Projeto InovaEduca (Robótica Maker & STEAM)\n` : '') +
      (selectedModules.socio ? `• Programa Sentir & Viver (Educação Socioemocional)\n` : '') +
      (selectedModules.gestao ? `• Assessoria Técnica e Formação Continuada para a Rede\n` : '') +
      `\nSolicito agendamento de reunião técnica para apresentação da proposta comercial e pedagógica.`
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/70 backdrop-blur-md animate-backdrop">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-modal border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="px-6 py-4 band-deep flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-orange-500 text-white flex items-center justify-center shadow-md">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs text-orange-300 font-bold">
                Simulador Exclusivo Undime 2026
              </div>
              <h3 className="text-base sm:text-lg font-bold text-white tracking-tight">
                Plano Pedagógico Personalizado para {cityName}
              </h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-xl transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {!generated ? (
            <>
              {/* City & Manager Info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Nome do Município
                  </label>
                  <input
                    type="text"
                    value={cityName}
                    onChange={(e) => setCityName(e.target.value)}
                    placeholder="Ex: Alagoinhas, Jequié..."
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-semibold text-slate-900 focus:bg-white focus:ring-2 focus:ring-blue-600 focus:outline-none transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Nome do(a) Secretário(a) / Gestor(a)
                  </label>
                  <input
                    type="text"
                    value={gestorName}
                    onChange={(e) => setGestorName(e.target.value)}
                    placeholder="Nome do responsável presente"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-semibold text-slate-900 focus:bg-white focus:ring-2 focus:ring-blue-600 focus:outline-none transition-all"
                  />
                </div>
              </div>

              {/* Student Volume Tier */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-bold text-slate-700">
                    Porte Estimado da Rede Municipal
                  </label>
                  <span className="text-xs font-semibold text-blue-900 bg-sky-100 px-2.5 py-0.5 rounded-lg">
                    {studentTier.toLocaleString()} alunos
                  </span>
                </div>
                <div className="grid grid-cols-4 gap-2 text-xs">
                  {[1200, 3500, 8000, 18000].map((tier) => (
                    <button
                      key={tier}
                      type="button"
                      onClick={() => {
                        sounds.playTap();
                        setStudentTier(tier);
                      }}
                      className={`py-2 px-1 rounded-xl font-bold border transition-all ${
 studentTier === tier
 ? 'bg-blue-900 text-white border-blue-950 shadow-sm'
 : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
 }`}
                    >
                      {tier >= 1000 ? `${tier / 1000}k alunos` : `${tier} alunos`}
                    </button>
                  ))}
                </div>
              </div>

              {/* Module Checkboxes */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-2">
                  Soluções Pedagógicas Prioritárias
                </label>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* AlfaEduca */}
                  <div
                    onClick={() => toggleModule('alfa')}
                    className={`p-3.5 rounded-2xl border-2 cursor-pointer transition-all flex items-start gap-3 ${
 selectedModules.alfa
 ? 'bg-sky-50/80 border-blue-600 shadow-sm'
 : 'bg-white border-slate-200 hover:border-slate-300'
 }`}
                  >
                    <div
                      className={`w-5 h-5 rounded-md flex items-center justify-center shrink-0 mt-0.5 ${
 selectedModules.alfa ? 'bg-blue-600 text-white' : 'border border-slate-300'
 }`}
                    >
                      {selectedModules.alfa && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                        <BookOpen className="w-3.5 h-3.5 text-blue-600" />
                        <span>Coleção AlfaEduca</span>
                      </div>
                      <p className="text-[11px] text-slate-600 mt-0.5">
                        Alfabetização na idade certa (1º e 2º anos) alinhada à BNCC e Criança Alfabetizada.
                      </p>
                    </div>
                  </div>

                  {/* Maker */}
                  <div
                    onClick={() => toggleModule('maker')}
                    className={`p-3.5 rounded-2xl border-2 cursor-pointer transition-all flex items-start gap-3 ${
 selectedModules.maker
 ? 'bg-orange-50/80 border-orange-500 shadow-sm'
 : 'bg-white border-slate-200 hover:border-slate-300'
 }`}
                  >
                    <div
                      className={`w-5 h-5 rounded-md flex items-center justify-center shrink-0 mt-0.5 ${
 selectedModules.maker ? 'bg-orange-500 text-white' : 'border border-slate-300'
 }`}
                    >
                      {selectedModules.maker && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                        <Cpu className="w-3.5 h-3.5 text-orange-600" />
                        <span>InovaEduca Maker</span>
                      </div>
                      <p className="text-[11px] text-slate-600 mt-0.5">
                        Laboratórios móveis e kits de robótica sem dependência de internet na escola.
                      </p>
                    </div>
                  </div>

                  {/* Socioemocional */}
                  <div
                    onClick={() => toggleModule('socio')}
                    className={`p-3.5 rounded-2xl border-2 cursor-pointer transition-all flex items-start gap-3 ${
 selectedModules.socio
 ? 'bg-emerald-50/80 border-emerald-600 shadow-sm'
 : 'bg-white border-slate-200 hover:border-slate-300'
 }`}
                  >
                    <div
                      className={`w-5 h-5 rounded-md flex items-center justify-center shrink-0 mt-0.5 ${
 selectedModules.socio ? 'bg-emerald-600 text-white' : 'border border-slate-300'
 }`}
                    >
                      {selectedModules.socio && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                        <Heart className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Sentir & Viver</span>
                      </div>
                      <p className="text-[11px] text-slate-600 mt-0.5">
                        Competências socioemocionais, mediação de conflitos e acolhimento das famílias.
                      </p>
                    </div>
                  </div>

                  {/* Gestão */}
                  <div
                    onClick={() => toggleModule('gestao')}
                    className={`p-3.5 rounded-2xl border-2 cursor-pointer transition-all flex items-start gap-3 ${
 selectedModules.gestao
 ? 'bg-indigo-50/80 border-indigo-600 shadow-sm'
 : 'bg-white border-slate-200 hover:border-slate-300'
 }`}
                  >
                    <div
                      className={`w-5 h-5 rounded-md flex items-center justify-center shrink-0 mt-0.5 ${
 selectedModules.gestao ? 'bg-indigo-600 text-white' : 'border border-slate-300'
 }`}
                    >
                      {selectedModules.gestao && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                        <Award className="w-3.5 h-3.5 text-indigo-600" />
                        <span>Assessoria & SAEB</span>
                      </div>
                      <p className="text-[11px] text-slate-600 mt-0.5">
                        Consultoria aos secretários e diretores com foco em alavancagem do IDEB.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </>
          ) : (
            /* Generated Proposal Dossier */
            <div className="space-y-5 animate-fadeIn">
              <div className="p-5 bg-gradient-to-br from-blue-950 to-blue-900 text-white rounded-2xl shadow-lg border border-blue-800">
                <div className="flex items-center justify-between">
                  <div className="text-xs font-bold text-orange-400">
                    Dossiê Pedagógico Personalizado
                  </div>
                  <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30">
                    Pronto para Apresentação
                  </span>
                </div>

                <h4 className="text-xl font-semibold text-white mt-2">
                  {cityName} — Rede Municipal de Educação
                </h4>
                <p className="text-xs text-blue-200 mt-1">
                  Atendimento sob medida para aproximadamente {studentTier.toLocaleString()} estudantes e seus educadores.
                </p>

                <div className="grid grid-cols-3 gap-2 mt-4 pt-4 border-t border-blue-800/80 text-center">
                  <div>
                    <div className="text-lg font-semibold text-white">
                      {Math.ceil(studentTier / 280)}
                    </div>
                    <div className="text-xs text-blue-300">Escolas Contempladas</div>
                  </div>
                  <div>
                    <div className="text-lg font-semibold text-amber-400">
                      {Math.ceil(studentTier / 22)}
                    </div>
                    <div className="text-xs text-blue-300">Professores Formados</div>
                  </div>
                  <div>
                    <div className="text-lg font-semibold text-emerald-400">100%</div>
                    <div className="text-xs text-blue-300">Alinhamento BNCC</div>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-xs text-slate-700 space-y-2">
                <div className="font-bold text-slate-900">Módulos Inclusos na Solução:</div>
                {selectedModules.alfa && (
                  <div className="flex items-center gap-2 text-slate-700">
                    <Check className="w-4 h-4 text-emerald-600" />
                    <span>Coleção AlfaEduca (Livros consumíveis do aluno + Guia do Professor)</span>
                  </div>
                )}
                {selectedModules.maker && (
                  <div className="flex items-center gap-2 text-slate-700">
                    <Check className="w-4 h-4 text-emerald-600" />
                    <span>InovaEduca Maker (Laboratórios móveis físicos e oficinas práticas)</span>
                  </div>
                )}
                {selectedModules.socio && (
                  <div className="flex items-center gap-2 text-slate-700">
                    <Check className="w-4 h-4 text-emerald-600" />
                    <span>Sentir & Viver (Material socioemocional e mediação escolar)</span>
                  </div>
                )}
                {selectedModules.gestao && (
                  <div className="flex items-center gap-2 text-slate-700">
                    <Check className="w-4 h-4 text-emerald-600" />
                    <span>Assessoria Técnica Especializada e Formação Continuada</span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between gap-3">
          {!generated ? (
            <>
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 text-xs font-bold text-slate-600 hover:bg-slate-200 rounded-xl transition-all"
              >
                Voltar ao Mapa
              </button>
              <button
                type="button"
                onClick={handleGenerate}
                className="flex items-center gap-2 px-5 py-2.5 btn-yellow font-bold text-xs rounded-xl shadow-md active:scale-95 transition-all"
              >
                <Sparkles className="w-4 h-4" />
                <span>Gerar Minuta Pedagógica</span>
              </button>
            </>
          ) : (
            <>
              <button
                type="button"
                onClick={() => setGenerated(false)}
                className="px-4 py-2.5 text-xs font-bold text-slate-600 hover:bg-slate-200 rounded-xl transition-all"
              >
                Editar Parâmetros
              </button>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="px-4 py-2.5 bg-white border border-slate-300 text-slate-700 font-bold text-xs rounded-xl hover:bg-slate-50 active:scale-95 transition-all shadow-sm"
                >
                  Imprimir
                </button>
                <a
                  href={`https://wa.me/${VITORIA_WHATSAPP}?text=${shareText}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md active:scale-95 transition-all"
                >
                  <Send className="w-4 h-4" />
                  <span>Enviar ao Consultor no WhatsApp</span>
                </a>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
