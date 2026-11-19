import React, { useState } from 'react';
import {
  X,
  Download,
  FileText,
  ChevronLeft,
  ChevronRight,
  CheckCircle,
  BookOpen,
  Printer,
  Share2,
  ZoomIn,
  ZoomOut,
  Sparkles,
  Layers,
  Award,
} from 'lucide-react';
import { type MunicipalityCase, CATALOG_PROJECTS } from '../data/educareData';
import { sounds } from '../utils/audio';
import { VITORIA_WHATSAPP } from '../config/contato';

interface FolderModalProps {
  municipality: MunicipalityCase;
  onClose: () => void;
}

export const FolderModal: React.FC<FolderModalProps> = ({ municipality, onClose }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [activeCatalog, setActiveCatalog] = useState<'alfa' | 'maker' | 'socio'>('alfa');
  const [isZoomed, setIsZoomed] = useState(false);
  const totalPages = 4;

  const currentProject =
    activeCatalog === 'alfa'
      ? CATALOG_PROJECTS['alfa-educa']
      : activeCatalog === 'maker'
      ? CATALOG_PROJECTS['robotica-maker']
      : CATALOG_PROJECTS['socioemocional-viver'];

  const pagesContent = [
    {
      page: 1,
      badge: 'Capa & Apresentação da Coleção',
      title: `${currentProject.title} — Rede Municipal de ${municipality.name}`,
      subtitle: 'Material Didático Estruturado • Alinhado à BNCC e Compromisso Nacional Criança Alfabetizada',
      body: (
        <div className="space-y-4">
          <div className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-blue-950 via-blue-900 to-indigo-950 text-white p-6 shadow-md border border-blue-800">
            <div className="flex items-center justify-between">
              <span className="px-3 py-1 bg-orange-500 text-white rounded-full text-xs font-semibold">
                Edição Oficial 2026
              </span>
              <span className="text-xs text-blue-200 font-bold">
                {municipality.name} — BA
              </span>
            </div>

            <div className="mt-4">
              <div className="text-xs text-amber-300 font-bold">
                {currentProject.tag}
              </div>
              <h3 className="text-xl sm:text-2xl font-semibold text-white mt-1">
                {currentProject.title}
              </h3>
              <p className="text-xs text-blue-100 mt-2 leading-relaxed">
                {currentProject.description}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 mt-6 pt-4 border-t border-blue-800/80 text-xs">
              <div>
                <span className="text-blue-300 font-semibold block">Segmento:</span>
                <span className="font-bold text-white">{currentProject.segment}</span>
              </div>
              <div>
                <span className="text-blue-300 font-semibold block">Matriz Curricular:</span>
                <span className="font-bold text-emerald-300">{currentProject.bnccAlignment}</span>
              </div>
            </div>
          </div>

          <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl">
            <div className="text-xs font-bold text-slate-800 mb-2">
              Diferenciais Reconhecidos pelas Redes Municipais:
            </div>
            <div className="space-y-2">
              {currentProject.highlights.map((h, i) => (
                <div key={i} className="flex items-start gap-2.5 text-xs text-slate-700">
                  <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>{h}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      ),
    },
    {
      page: 2,
      badge: 'Amostra da Página do Estudante',
      title: 'Página Dupla Ilustrada: Leitura, Escrita e Contexto Regional',
      subtitle: 'Estrutura didática intuitiva com cantigas tradicionais e consciência fonológica',
      body: (
        <div className="space-y-4">
          {/* Simulated Open Book Double-Page Spread */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-amber-50/50 p-4 rounded-2xl border border-amber-200/80 shadow-inner">
            {/* Left Page: Story & Reading */}
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-3">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <span className="text-xs font-bold text-orange-600">Unidade 2 • Brincadeiras da Nossa Terra</span>
                <span className="text-xs font-bold text-slate-400">Pág. 24</span>
              </div>
              <h5 className="font-semibold text-slate-900 text-sm">
                Cantiga: "Peixe Vivo no Rio Paraguaçu"
              </h5>
              <div className="bg-sky-50/70 p-3 rounded-lg border border-sky-100 text-xs italic text-slate-700 leading-relaxed font-serif">
                "Como pode um peixe vivo<br/>
                Viver fora da água fria?<br/>
                Como poderei viver,<br/>
                Sem a tua companhia?"
              </div>
              <p className="text-[11px] text-slate-600">
                1. Circule no texto as palavras que rimam com <strong>Fria</strong>.<br/>
                2. Pinte as sílabas que formam o nome do rio baiano: <strong>PA - RA - GUA - ÇU</strong>.
              </p>
            </div>

            {/* Right Page: Phonics and Writing Practice */}
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-3">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <span className="text-xs font-bold text-blue-700">Fluência & Fonemas</span>
                <span className="text-xs font-bold text-slate-400">Pág. 25</span>
              </div>
              <h5 className="font-semibold text-slate-900 text-sm">
                Hora de Ler e Escrever
              </h5>
              <div className="space-y-2 text-xs">
                <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200 flex items-center justify-between">
                  <span className="font-bold text-slate-800">PEIXE</span>
                  <span className="font-mono text-[11px] text-blue-700 bg-blue-100 px-2 py-0.5 rounded">P - E - I - X - E</span>
                </div>
                <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200 flex items-center justify-between">
                  <span className="font-bold text-slate-800">VIVO</span>
                  <span className="font-mono text-[11px] text-blue-700 bg-blue-100 px-2 py-0.5 rounded">V - I - V - O</span>
                </div>
                <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200 flex items-center justify-between">
                  <span className="font-bold text-slate-800">ÁGUA</span>
                  <span className="font-mono text-[11px] text-blue-700 bg-blue-100 px-2 py-0.5 rounded">Á - G - U - A</span>
                </div>
              </div>
              <div className="p-2 bg-emerald-50 rounded-lg text-xs text-emerald-800 font-semibold border border-emerald-100">
                ★ Caixa de Letras Móveis: forme a palavra com seus colegas na sala!
              </div>
            </div>
          </div>
        </div>
      ),
    },
    {
      page: 3,
      badge: 'Manual do Professor Comentado',
      title: 'Guia Didático Passo a Passo & Códigos BNCC',
      subtitle: 'Intervenções pedagógicas direcionadas e avaliação processual contínua',
      body: (
        <div className="space-y-4">
          <div className="p-4 bg-sky-50 border border-sky-200 rounded-2xl">
            <div className="flex items-center justify-between">
              <h5 className="font-semibold text-blue-950 text-sm">Orientações para o Professor Alfabetizador</h5>
              <span className="px-2.5 py-0.5 rounded bg-blue-200/60 text-blue-950 font-bold text-xs">
                BNCC: EF01LP02, EF01LP07
              </span>
            </div>
            <p className="text-xs text-slate-700 mt-2 leading-relaxed">
              O objetivo desta sequência didática é consolidar a consciência grafofonêmica. Antes de abrir o livro, sugira que as crianças cantem a cantiga batendo palmas no ritmo das sílabas.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
              <span className="font-bold text-slate-900 block mb-1">Diagnóstico Rápido:</span>
              <p className="text-slate-600 text-[11px]">
                Observe quais alunos ainda associam a escrita de maneira silábica sem valor sonoro e aplique os desafios do jogo de rimas da caixa de alfabetização.
              </p>
            </div>
            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
              <span className="font-bold text-slate-900 block mb-1">Recuperação Paralela:</span>
              <p className="text-slate-600 text-[11px]">
                Atividades de fixação disponíveis na plataforma digital do professor para impressão imediata na secretaria da escola.
              </p>
            </div>
          </div>
        </div>
      ),
    },
    {
      page: 4,
      badge: 'Resultados e Depoimentos na Rede',
      title: 'Evolução Registrada e Formação Presencial',
      subtitle: `Impacto medido nos alunos de ${municipality.name} e municípios vizinhos`,
      body: (
        <div className="space-y-4">
          <div className="grid grid-cols-3 gap-3 text-center">
            <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200">
              <div className="text-2xl font-semibold text-blue-900">{municipality.metrics.literacyRate || '93%'}</div>
              <div className="text-xs text-slate-500 font-bold mt-1">Taxa de Fluência</div>
            </div>
            <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200">
              <div className="text-2xl font-semibold text-emerald-600">{municipality.metrics.idebGrowth || '+0.8'}</div>
              <div className="text-xs text-slate-500 font-bold mt-1">Crescimento IDEB</div>
            </div>
            <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200">
              <div className="text-2xl font-semibold text-amber-600">{municipality.schoolsCount || '15+'}</div>
              <div className="text-xs text-slate-500 font-bold mt-1">Escolas da Rede</div>
            </div>
          </div>

          <div className="p-4 band-deep rounded-2xl shadow-sm">
            <div className="text-xs font-bold text-amber-400">Compromisso Grupo Educare:</div>
            <p className="text-xs text-blue-100 mt-1 leading-relaxed">
              "Garantimos a entrega pontual dos livros antes do início do ano letivo, reposição contínua ao longo do ano e formações práticas presenciais para cada professor da rede."
            </p>
          </div>
        </div>
      ),
    },
  ];

  const shareText = encodeURIComponent(
    `Olá! Veja o folder didático da ${currentProject.title} adotado na rede de ${municipality.name} - BA pelo Grupo Educare no evento da Undime.`
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/75 backdrop-blur-md animate-backdrop">
      <div className="relative w-full max-w-3xl bg-white rounded-3xl shadow-modal border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Top Header */}
        <div className="px-6 py-4 band-deep flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-amber-500 text-slate-950 rounded-xl shadow-xs shrink-0">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs text-amber-300 font-bold">
                Visualizador de Folder Pedagógico
              </div>
              <h3 className="text-base font-semibold text-white">
                {municipality.name} • {currentProject.title}
              </h3>
            </div>
          </div>
          <button
            onClick={() => {
              sounds.playTap();
              onClose();
            }}
            className="p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-xl transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Collection Selector Tabs */}
        <div className="flex items-center gap-2 px-6 py-2.5 bg-slate-100 border-b border-slate-200 text-xs overflow-x-auto no-scrollbar">
          <span className="font-bold text-slate-500 text-xs shrink-0">Coleção:</span>
          {[
            { id: 'alfa', label: 'AlfaEduca (Alfabetização)' },
            { id: 'maker', label: 'InovaEduca (Robótica Maker)' },
            { id: 'socio', label: 'Sentir & Viver (Socioemocional)' },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => {
                sounds.playTap();
                setActiveCatalog(cat.id as any);
                setCurrentPage(1);
              }}
              className={`px-3 py-1 rounded-xl font-bold shrink-0 transition-all ${
 activeCatalog === cat.id
 ? 'bg-blue-900 text-white shadow-xs'
 : 'bg-white text-slate-600 hover:bg-slate-200 border border-slate-200'
 }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Page Switcher */}
        <div className="flex items-center justify-between px-6 py-2 bg-slate-50 border-b border-slate-200 text-xs">
          <div className="flex items-center gap-1">
            {[1, 2, 3, 4].map((p) => (
              <button
                key={p}
                onClick={() => {
                  sounds.playTap();
                  setCurrentPage(p);
                }}
                className={`px-2.5 py-1 rounded-lg font-bold transition-all ${
 currentPage === p
 ? 'bg-blue-700 text-white shadow-2xs'
 : 'text-slate-600 hover:bg-slate-200'
 }`}
              >
                Pág. {p}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                sounds.playTap();
                setCurrentPage((p) => Math.max(1, p - 1));
              }}
              disabled={currentPage === 1}
              className="p-1 rounded-lg text-slate-600 hover:bg-slate-200 disabled:opacity-30"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="font-bold text-slate-700">
              {currentPage} de {totalPages}
            </span>
            <button
              onClick={() => {
                sounds.playTap();
                setCurrentPage((p) => Math.min(totalPages, p + 1));
              }}
              disabled={currentPage === totalPages}
              className="p-1 rounded-lg text-slate-600 hover:bg-slate-200 disabled:opacity-30"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Document Content */}
        <div className="p-6 overflow-y-auto flex-1 space-y-4">
          <div className="flex items-center justify-between">
            <span className="px-3 py-1 bg-amber-100 text-amber-900 rounded-full text-xs font-semibold">
              {pagesContent[currentPage - 1].badge}
            </span>
            <span className="text-[11px] text-slate-400 font-semibold">
              Material Aprovado para Distribuição Municipal
            </span>
          </div>

          <div>
            <h4 className="text-lg font-semibold text-slate-900">
              {pagesContent[currentPage - 1].title}
            </h4>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              {pagesContent[currentPage - 1].subtitle}
            </p>
          </div>

          {pagesContent[currentPage - 1].body}
        </div>

        {/* Actions Footer */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-xs text-slate-500">
            Material 100% em conformidade com as diretrizes do FNDE e BNCC
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={() => window.print()}
              className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-3.5 py-2 text-xs font-bold text-slate-700 bg-white border border-slate-300 rounded-xl hover:bg-slate-50 active:scale-95 transition-all shadow-xs"
            >
              <Printer className="w-3.5 h-3.5" />
              Imprimir
            </button>

            <a
              href={`https://wa.me/${VITORIA_WHATSAPP}?text=${shareText}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-4 py-2 text-xs font-bold text-emerald-800 bg-emerald-100 hover:bg-emerald-200 border border-emerald-300 rounded-xl active:scale-95 transition-all shadow-xs"
            >
              <Share2 className="w-3.5 h-3.5" />
              Enviar no WhatsApp
            </a>

            <button
              onClick={() => {
                sounds.playChime();
                alert(`Download do folder completo da ${currentProject.title} (${municipality.name}) iniciado em PDF!`);
              }}
              className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-blue-900 hover:bg-blue-950 rounded-xl active:scale-95 transition-all shadow-md"
            >
              <Download className="w-3.5 h-3.5 text-amber-400" />
              Baixar Folder (.PDF)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
