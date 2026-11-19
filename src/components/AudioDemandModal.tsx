import React, { useState } from 'react';
import {
  X,
  Calendar,
  FileText,
  Play,
  Pause,
  Download,
  Share2,
  ChevronLeft,
  ChevronRight,
  BookOpen,
  School,
  Users,
  GraduationCap,
  TrendingUp,
  CheckCircle,
  Sparkles,
  Volume2,
  VolumeX,
  Maximize2,
  Printer,
  MapPin,
  MessageCircle,
} from 'lucide-react';
import { type MunicipalityCase, CATALOG_PROJECTS } from '../data/educareData';
import { sounds } from '../utils/audio';

interface AudioDemandModalProps {
  municipality: MunicipalityCase | null;
  onClose: () => void;
  onOpenProposal: (municipality: MunicipalityCase) => void;
}

export const AudioDemandModal: React.FC<AudioDemandModalProps> = ({
  municipality,
  onClose,
  onOpenProposal,
}) => {
  if (!municipality) return null;

  const [activeTab, setActiveTab] = useState<'folder' | 'video' | 'metricas'>('folder');
  const [folderPage, setFolderPage] = useState(1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [videoProgress, setVideoProgress] = useState(25);

  const primaryProject = CATALOG_PROJECTS[municipality.primaryProject] || CATALOG_PROJECTS['alfa-educa'];

  const whatsappMessage = encodeURIComponent(
    `Olá equipe Educare! Estou no evento da Undime e gostaria de agendar uma apresentação dos materiais e folders pedagógicos para ${municipality.name} - BA.`
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 bg-slate-950/80 backdrop-blur-md animate-backdrop">
      <div className="relative w-full max-w-4xl bg-white rounded-3xl shadow-modal border border-slate-200 overflow-hidden flex flex-col max-h-[95vh]">
        {/* Top Header with City Name and Date of Supply */}
        <div className="px-6 py-5 bg-gradient-to-r from-blue-950 via-blue-900 to-indigo-950 text-white relative">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold text-amber-400 uppercase tracking-widest">
                <MapPin className="w-4 h-4 text-orange-400 shrink-0" />
                <span>{municipality.region} • Bahia</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white mt-0.5">
                {municipality.name}
              </h2>
            </div>

            {/* Exactly what the audio requested: Date of supply in huge prominent highlight */}
            <div className="flex items-center gap-2 self-start sm:self-auto">
              <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-2xl bg-orange-500 text-white shadow-sm font-bold text-xs">
                <Calendar className="w-4 h-4 text-white shrink-0" />
                <span>Fornecimento: {municipality.contractDate}</span>
              </div>

              <button
                onClick={() => {
                  sounds.playTap();
                  onClose();
                }}
                className="p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-xl transition-all"
                title="Fechar"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
          </div>

          {/* Interactive Navigation Tabs: Folder do Material / Vídeo / Dados */}
          <div className="flex items-center gap-2 mt-4 pt-4 border-t border-blue-800/80 overflow-x-auto no-scrollbar">
            <button
              onClick={() => {
                sounds.playTap();
                setActiveTab('folder');
              }}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 ${
                activeTab === 'folder'
                  ? 'bg-white text-blue-950 shadow-md ring-2 ring-white/40'
                  : 'bg-white/10 text-blue-200 hover:bg-white/20'
              }`}
            >
              <FileText className="w-4 h-4 text-orange-500" />
              <span>1. Folder do Material Apresentado</span>
            </button>

            <button
              onClick={() => {
                sounds.playTap();
                setActiveTab('video');
                setIsPlaying(true);
              }}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 ${
                activeTab === 'video'
                  ? 'bg-white text-blue-950 shadow-md ring-2 ring-white/40'
                  : 'bg-white/10 text-blue-200 hover:bg-white/20'
              }`}
            >
              <Play className="w-4 h-4 text-blue-600 fill-blue-600" />
              <span>2. Vídeo do Case na Escola</span>
            </button>

            <button
              onClick={() => {
                sounds.playTap();
                setActiveTab('metricas');
              }}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 ${
                activeTab === 'metricas'
                  ? 'bg-white text-blue-950 shadow-md ring-2 ring-white/40'
                  : 'bg-white/10 text-blue-200 hover:bg-white/20'
              }`}
            >
              <TrendingUp className="w-4 h-4 text-emerald-500" />
              <span>3. Dados da Rede & Impacto</span>
            </button>
          </div>
        </div>

        {/* Modal Main Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          {/* TAB 1: FOLDER DO MATERIAL PEDAGÓGICO */}
          {activeTab === 'folder' && (
            <div className="space-y-5 animate-fadeIn">
              {/* Project Title Banner */}
              <div className="p-4 bg-sky-50/80 border border-sky-200 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-blue-900 text-white flex items-center justify-center shrink-0 shadow-sm">
                    <BookOpen className="w-6 h-6 text-amber-400" />
                  </div>
                  <div>
                    <span className="text-[10px] font-black text-orange-600 uppercase tracking-widest">
                      {primaryProject.tag} • Material Fornecido
                    </span>
                    <h3 className="text-base sm:text-lg font-black text-slate-900">
                      {primaryProject.title}
                    </h3>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-start sm:self-auto">
                  <span className="text-xs font-bold text-blue-900 bg-white px-3 py-1 rounded-xl border border-blue-200 shadow-2xs">
                    BNCC Alinhada
                  </span>
                </div>
              </div>

              {/* Interactive Book Page Viewer */}
              <div className="border border-slate-200 rounded-2xl overflow-hidden bg-slate-50 shadow-inner p-4 sm:p-5">
                <div className="flex items-center justify-between border-b border-slate-200 pb-3 mb-4 text-xs font-bold text-slate-700">
                  <span className="flex items-center gap-2 text-blue-950">
                    <FileText className="w-4 h-4 text-orange-500" />
                    <span>Amostra do Material Didático Fornecido para {municipality.name}</span>
                  </span>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        sounds.playTap();
                        setFolderPage((p) => Math.max(1, p - 1));
                      }}
                      disabled={folderPage === 1}
                      className="p-1.5 rounded-lg bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 disabled:opacity-30"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <span className="text-xs font-bold px-2">
                      Página {folderPage} de 3
                    </span>
                    <button
                      onClick={() => {
                        sounds.playTap();
                        setFolderPage((p) => Math.min(3, p + 1));
                      }}
                      disabled={folderPage === 3}
                      className="p-1.5 rounded-lg bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 disabled:opacity-30"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Page 1: Apresentação da Coleção e Livro do Estudante */}
                {folderPage === 1 && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Left Book Page */}
                      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
                        <div className="flex items-center justify-between text-[11px] font-bold text-slate-400 uppercase">
                          <span>Unidade 1 • Alfabetização & Linguagem</span>
                          <span>Pág. 12</span>
                        </div>
                        <h4 className="text-sm font-black text-slate-900">
                          Cantiga e Rima: "Marinheiro Só no Recôncavo"
                        </h4>
                        <div className="p-3 bg-amber-50/70 rounded-xl border border-amber-100 text-xs italic font-serif text-slate-700 leading-relaxed">
                          "Eu não sou daqui, marinheiro só<br/>
                          Eu não tenho amor, marinheiro só<br/>
                          Eu sou da Bahia, marinheiro só<br/>
                          De São Salvador, marinheiro só!"
                        </div>
                        <p className="text-xs text-slate-600">
                          1. Marque no texto a palavra que indica o estado: <strong>BAHIA</strong>.<br/>
                          2. Separe as sílabas da capital: <strong>SAL - VA - DOR</strong>.
                        </p>
                      </div>

                      {/* Right Book Page: Atividade de Fixação */}
                      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
                        <div className="flex items-center justify-between text-[11px] font-bold text-slate-400 uppercase">
                          <span>Consciência Fonológica</span>
                          <span>Pág. 13</span>
                        </div>
                        <h4 className="text-sm font-black text-slate-900">
                          Banco de Palavras e Letras Móveis
                        </h4>
                        <div className="space-y-2 text-xs">
                          <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
                            <span className="font-extrabold text-slate-800">MARINHEIRO</span>
                            <span className="font-mono text-blue-700 font-bold bg-blue-50 px-2 py-0.5 rounded">
                              4 sílabas
                            </span>
                          </div>
                          <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
                            <span className="font-extrabold text-slate-800">BARCO</span>
                            <span className="font-mono text-blue-700 font-bold bg-blue-50 px-2 py-0.5 rounded">
                              2 sílabas
                            </span>
                          </div>
                        </div>
                        <div className="p-2.5 bg-emerald-50 text-emerald-800 text-xs font-semibold rounded-xl border border-emerald-100 flex items-center gap-2">
                          <Sparkles className="w-4 h-4 text-emerald-600 shrink-0" />
                          <span>Caixa de jogos e letras móveis inclusas para cada sala!</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Page 2: Manual do Professor com BNCC */}
                {folderPage === 2 && (
                  <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
                    <div className="flex items-center justify-between text-xs font-bold text-blue-900">
                      <span>Orientações Didáticas do Manual do Professor</span>
                      <span className="bg-blue-100 px-2.5 py-0.5 rounded-lg font-mono">
                        Códigos: EF01LP02 • EF01LP08
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      O professor regente conta com sugestões de mediação página a página, roteiros de avaliação processual e testes rápidos de fluência verbal para identificar em tempo real os alunos que necessitam de intervenção pedagógica preventiva.
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs">
                      <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                        <strong className="text-slate-900 block mb-1">Rotina de Sala de Aula:</strong>
                        <span className="text-slate-600">Roda de leitura diária (15 min) + Atividades de escrita orientada com os livros consumíveis.</span>
                      </div>
                      <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                        <strong className="text-slate-900 block mb-1">Acompanhamento da Coordenação:</strong>
                        <span className="text-slate-600">Relatórios bimestrais consolidados para a Secretaria Municipal de Educação.</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Page 3: Kit Pedagógico Completo */}
                {folderPage === 3 && (
                  <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
                    <h4 className="text-sm font-black text-slate-900">
                      Composição do Kit Entregue para a Rede de {municipality.name}
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                      <div className="p-3.5 bg-sky-50 rounded-xl border border-sky-200 text-center">
                        <BookOpen className="w-5 h-5 text-blue-700 mx-auto mb-1.5" />
                        <span className="font-extrabold text-blue-950 block">Livro do Aluno</span>
                        <span className="text-slate-600 text-[11px]">Consumível individual para cada criança</span>
                      </div>
                      <div className="p-3.5 bg-orange-50 rounded-xl border border-orange-200 text-center">
                        <GraduationCap className="w-5 h-5 text-orange-600 mx-auto mb-1.5" />
                        <span className="font-extrabold text-orange-950 block">Guia do Educador</span>
                        <span className="text-slate-600 text-[11px]">Manual comentado e banco de provas</span>
                      </div>
                      <div className="p-3.5 bg-emerald-50 rounded-xl border border-emerald-200 text-center">
                        <Sparkles className="w-5 h-5 text-emerald-700 mx-auto mb-1.5" />
                        <span className="font-extrabold text-emerald-950 block">Caixas de Jogos</span>
                        <span className="text-slate-600 text-[11px]">Alfabeto móvel e dados de rimas</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Action Buttons for Folder */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
                <div className="text-xs text-slate-500 font-medium">
                  Material didático adotado com sucesso na rede de {municipality.name}.
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <a
                    href={`https://wa.me/5571999999999?text=${whatsappMessage}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs active:scale-95 transition-all"
                  >
                    <Share2 className="w-4 h-4" />
                    <span>Compartilhar no WhatsApp</span>
                  </a>

                  <button
                    onClick={() => {
                      sounds.playChime();
                      alert(`Download do Folder Oficial de ${municipality.name} iniciado em PDF!`);
                    }}
                    className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-5 py-2.5 bg-blue-900 hover:bg-blue-950 text-white font-black text-xs rounded-xl shadow-md active:scale-95 transition-all"
                  >
                    <Download className="w-4 h-4 text-amber-400" />
                    <span>Baixar Folder em PDF</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: VÍDEO DO CASE NA ESCOLA */}
          {activeTab === 'video' && (
            <div className="space-y-4 animate-fadeIn">
              <div className="relative aspect-video w-full bg-slate-950 rounded-2xl overflow-hidden shadow-lg border border-slate-800 group">
                <img
                  src={municipality.videoThumbnail}
                  alt={municipality.name}
                  className="absolute inset-0 w-full h-full object-cover opacity-60 filter brightness-90"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent pointer-events-none"></div>

                {/* Big Center Play/Pause button */}
                <button
                  onClick={() => {
                    sounds.playTap();
                    setIsPlaying(!isPlaying);
                  }}
                  className="relative z-10 w-16 h-16 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-2xl hover:scale-110 active:scale-95 transition-all"
                >
                  {isPlaying ? <Pause className="w-8 h-8" /> : <Play className="w-8 h-8 ml-1" />}
                </button>

                {/* Video Info Overlay */}
                <div className="absolute bottom-12 left-5 right-5 z-10 text-white pointer-events-none">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-500 text-slate-950 rounded-full text-[10px] font-black uppercase mb-1">
                    <Sparkles className="w-3.5 h-3.5" />
                    {municipality.name} • Fornecido {municipality.contractDate}
                  </div>
                  <h4 className="text-base sm:text-lg font-bold drop-shadow-md">
                    {municipality.videoTitle}
                  </h4>
                </div>

                {/* Scrub Bar */}
                <div className="absolute bottom-0 left-0 right-0 z-20 bg-slate-900/95 px-4 py-2 flex items-center gap-3 text-xs text-slate-300">
                  <button onClick={() => setIsPlaying(!isPlaying)}>
                    {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                  </button>
                  <span className="font-mono text-[11px]">0:32 / 1:30</span>
                  <div className="flex-1 h-1.5 bg-slate-700 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-500 w-1/3"></div>
                  </div>
                  <button onClick={() => setIsMuted(!isMuted)}>
                    {isMuted ? <VolumeX className="w-4 h-4 text-red-400" /> : <Volume2 className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl flex items-center justify-between text-xs text-slate-700">
                <span>Vídeo com depoimentos reais de professores e crianças da rede de {municipality.name}.</span>
                <button
                  onClick={() => {
                    sounds.playChime();
                    alert(`Link do vídeo de ${municipality.name} copiado com sucesso!`);
                  }}
                  className="px-3.5 py-1.5 bg-white border border-slate-300 font-bold text-slate-800 rounded-xl hover:bg-slate-100 shadow-2xs"
                >
                  Copiar Link
                </button>
              </div>
            </div>
          )}

          {/* TAB 3: DADOS DA REDE E IMPACTO */}
          {activeTab === 'metricas' && (
            <div className="space-y-5 animate-fadeIn">
              <div className="grid grid-cols-3 gap-3">
                <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl text-center">
                  <School className="w-6 h-6 text-blue-700 mx-auto mb-1.5" />
                  <div className="text-2xl font-black text-slate-900">
                    {municipality.schoolsCount > 0 ? municipality.schoolsCount : '15+'}
                  </div>
                  <div className="text-xs font-bold text-slate-500 uppercase mt-0.5">Escolas Atendidas</div>
                </div>

                <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl text-center">
                  <Users className="w-6 h-6 text-emerald-600 mx-auto mb-1.5" />
                  <div className="text-2xl font-black text-slate-900">
                    {municipality.studentsImpacted > 0 ? `${(municipality.studentsImpacted / 1000).toFixed(1)}k` : '5k+'}
                  </div>
                  <div className="text-xs font-bold text-slate-500 uppercase mt-0.5">Alunos Beneficiados</div>
                </div>

                <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl text-center">
                  <GraduationCap className="w-6 h-6 text-amber-600 mx-auto mb-1.5" />
                  <div className="text-2xl font-black text-slate-900">
                    {municipality.teachersTrained > 0 ? municipality.teachersTrained : '200+'}
                  </div>
                  <div className="text-xs font-bold text-slate-500 uppercase mt-0.5">Professores Formados</div>
                </div>
              </div>

              {municipality.metrics && (
                <div className="p-4 bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-2xl flex items-center justify-between">
                  <div>
                    <div className="text-xs font-bold text-amber-900 uppercase">Resultado no SAEB / Alfabetização:</div>
                    <div className="text-sm font-extrabold text-slate-900 mt-0.5">
                      {municipality.metrics.literacyRate || '94% alfabetizados no 2º ano'}
                    </div>
                  </div>
                  <span className="px-3 py-1 bg-amber-500 text-white font-black text-xs rounded-xl shadow-xs">
                    {municipality.metrics.idebGrowth || '+0.8 no IDEB'}
                  </span>
                </div>
              )}

              {municipality.testimonial && (
                <div className="p-5 bg-slate-50 border border-slate-200 rounded-2xl">
                  <p className="text-xs italic text-slate-700 leading-relaxed font-medium">
                    "{municipality.testimonial.quote}"
                  </p>
                  <div className="mt-3 text-xs font-bold text-slate-900 flex items-center justify-between">
                    <span>{municipality.testimonial.author}</span>
                    <span className="text-slate-500 font-normal">{municipality.testimonial.role}</span>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Modal Bottom Stand Action */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs text-slate-600">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
            <span>Deseja levar essa solução para a sua rede municipal?</span>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={() => {
                sounds.playTap();
                onOpenProposal(municipality);
              }}
              className="flex-1 sm:flex-initial px-4 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs uppercase rounded-xl shadow-xs transition-all active:scale-95"
            >
              Simular Proposta para Minha Rede
            </button>

            <a
              href={`https://wa.me/5571999999999?text=${whatsappMessage}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs transition-all active:scale-95"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Falar no Estande</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
