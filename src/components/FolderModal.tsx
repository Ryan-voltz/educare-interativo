import React, { useState } from 'react';
import { X, Download, FileText, ChevronLeft, ChevronRight, CheckCircle, BookOpen, Printer } from 'lucide-react';
import { type MunicipalityCase, CATALOG_PROJECTS } from '../data/educareData';

interface FolderModalProps {
  municipality: MunicipalityCase;
  onClose: () => void;
}

export const FolderModal: React.FC<FolderModalProps> = ({ municipality, onClose }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = 4;
  const project = CATALOG_PROJECTS[municipality.primaryProject] || CATALOG_PROJECTS['alfa-educa'];

  const pagesContent = [
    {
      page: 1,
      title: 'Apresentação Institucional & Metodologia',
      badge: 'Capa & Apresentação',
      content: (
        <div className="space-y-4">
          <div className="p-4 bg-sky-50 rounded-2xl border border-sky-100 flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-md">
              <BookOpen className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-slate-900 text-lg">{project.title}</h4>
              <p className="text-slate-600 text-sm mt-1">{project.description}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 mt-4">
            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
              <div className="text-xs font-semibold text-slate-500 uppercase">Rede Municipal</div>
              <div className="text-base font-bold text-blue-900 mt-0.5">{municipality.name} — BA</div>
            </div>
            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
              <div className="text-xs font-semibold text-slate-500 uppercase">Alinhamento BNCC</div>
              <div className="text-xs font-medium text-emerald-700 mt-1">{project.bnccAlignment}</div>
            </div>
          </div>

          <div className="space-y-2 mt-4">
            <div className="text-xs font-bold text-slate-700 uppercase tracking-wider">Pilares da Solução Pedagógica:</div>
            {project.highlights.map((h, i) => (
              <div key={i} className="flex items-center gap-2 text-sm text-slate-700">
                <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{h}</span>
              </div>
            ))}
          </div>
        </div>
      ),
    },
    {
      page: 2,
      title: 'Estrutura Curricular & Livro do Estudante',
      badge: 'Conteúdo Programático',
      content: (
        <div className="space-y-4">
          <div className="border border-slate-200 rounded-2xl overflow-hidden shadow-sm bg-white p-4">
            <h5 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-orange-500"></span>
              Distribuição por Bimestres Letivos
            </h5>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3 text-xs">
              <div className="p-3 bg-amber-50/60 rounded-xl border border-amber-200/60">
                <span className="font-bold text-amber-900">1º Bimestre:</span>
                <p className="text-slate-600 mt-1">Consciência fonológica, rimas e aliterações no contexto regional.</p>
              </div>
              <div className="p-3 bg-sky-50/60 rounded-xl border border-sky-200/60">
                <span className="font-bold text-sky-900">2º Bimestre:</span>
                <p className="text-slate-600 mt-1">Decodificação e correspondência grafema-fonema em palavras estáveis.</p>
              </div>
              <div className="p-3 bg-emerald-50/60 rounded-xl border border-emerald-200/60">
                <span className="font-bold text-emerald-900">3º Bimestre:</span>
                <p className="text-slate-600 mt-1">Fluência leitora e compreensão de textos narrativos e poéticos.</p>
              </div>
              <div className="p-3 bg-indigo-50/60 rounded-xl border border-indigo-200/60">
                <span className="font-bold text-indigo-900">4º Bimestre:</span>
                <p className="text-slate-600 mt-1">Produção textual autônoma e avaliação somativa de proficiência.</p>
              </div>
            </div>
          </div>

          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-xs text-slate-600 flex items-center justify-between">
            <div>
              <span className="font-bold text-slate-800">Manual do Professor:</span> Orientações didáticas página a página com gabaritos comentados e sugestões de recuperação paralela.
            </div>
          </div>
        </div>
      ),
    },
    {
      page: 3,
      title: 'Instrumentos de Avaliação e Fluência Leitora',
      badge: 'Monitoramento & SAEB',
      content: (
        <div className="space-y-4">
          <div className="p-4 bg-gradient-to-r from-blue-900 to-indigo-900 text-white rounded-2xl shadow-md">
            <h5 className="font-bold text-base flex items-center gap-2">
              <span className="text-amber-400">★</span> Avaliações Diagnósticas Bimestrais
            </h5>
            <p className="text-blue-100 text-xs mt-1">
              Testes padronizados de fluência leitora (palavras/minuto e pseudopalavras) que alimentam o painel de dados da secretaria de educação.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-2 text-center">
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <div className="text-lg font-black text-blue-700">{municipality.metrics.literacyRate || '92%'}</div>
              <div className="text-[10px] text-slate-500 font-medium uppercase mt-0.5">Taxa de Alfabetização</div>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <div className="text-lg font-black text-emerald-600">{municipality.metrics.idebGrowth || '+0.8'}</div>
              <div className="text-[10px] text-slate-500 font-medium uppercase mt-0.5">Evolução IDEB</div>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <div className="text-lg font-black text-amber-600">{municipality.metrics.satisfaction}</div>
              <div className="text-[10px] text-slate-500 font-medium uppercase mt-0.5">Aprovação Docente</div>
            </div>
          </div>
        </div>
      ),
    },
    {
      page: 4,
      title: 'Plano de Formação & Assessoria Técnica Presencial',
      badge: 'Apoio à Secretaria',
      content: (
        <div className="space-y-4">
          <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl">
            <h5 className="font-bold text-emerald-900 text-sm">Cronograma de Encontros Formativos</h5>
            <p className="text-emerald-800 text-xs mt-1">
              A equipe de formadores especialistas do Grupo Educare realiza imersões mensais com os coordenadores pedagógicos e professores regentes.
            </p>
          </div>

          <div className="space-y-2 text-xs">
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
              <span className="font-semibold text-slate-700">Módulo I: Diagnóstico Inicial e Alinhamento Curricular</span>
              <span className="px-2 py-0.5 bg-blue-100 text-blue-800 rounded font-medium">8h presenciais</span>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
              <span className="font-semibold text-slate-700">Módulo II: Práticas de Fluência e Intervenção Pedagógica</span>
              <span className="px-2 py-0.5 bg-blue-100 text-blue-800 rounded font-medium">16h oficinas</span>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
              <span className="font-semibold text-slate-700">Módulo III: Análise de Dados e Preparação para o SAEB</span>
              <span className="px-2 py-0.5 bg-blue-100 text-blue-800 rounded font-medium">12h híbrido</span>
            </div>
          </div>
        </div>
      ),
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-blue-900 via-blue-800 to-indigo-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/10 rounded-xl backdrop-blur-md">
              <FileText className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <div className="text-xs text-blue-200 font-medium">Folder Pedagógico Interativo</div>
              <h3 className="text-base font-bold tracking-tight text-white">{municipality.folderTitle}</h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-xl transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Page Tab Bar */}
        <div className="flex items-center justify-between px-6 py-2.5 bg-slate-100 border-b border-slate-200 text-xs">
          <div className="flex items-center gap-1.5">
            {[1, 2, 3, 4].map((p) => (
              <button
                key={p}
                onClick={() => setCurrentPage(p)}
                className={`px-3 py-1 rounded-lg font-semibold transition-all ${
                  currentPage === p
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-slate-600 hover:bg-slate-200'
                }`}
              >
                Pág. {p}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-1 rounded-lg text-slate-600 hover:bg-slate-200 disabled:opacity-30"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="font-semibold text-slate-700">
              {currentPage} de {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="p-1 rounded-lg text-slate-600 hover:bg-slate-200 disabled:opacity-30"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Document Body */}
        <div className="p-6 overflow-y-auto flex-1">
          <div className="flex items-center justify-between mb-4">
            <span className="px-3 py-1 bg-amber-100 text-amber-800 rounded-full text-xs font-bold">
              {pagesContent[currentPage - 1].badge}
            </span>
            <span className="text-xs text-slate-400 font-medium">
              Documento Oficial Grupo Educare
            </span>
          </div>

          <h4 className="text-lg font-bold text-slate-800 mb-4">
            {pagesContent[currentPage - 1].title}
          </h4>

          {pagesContent[currentPage - 1].content}
        </div>

        {/* Footer with Actions */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <div className="text-xs text-slate-500">
            Disponível para impressão ou download em PDF de alta resolução
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => window.print()}
              className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded-xl hover:bg-slate-50 active:scale-95 transition-all shadow-sm"
            >
              <Printer className="w-3.5 h-3.5" />
              Imprimir
            </button>
            <button
              onClick={() => {
                alert(`Download do folder completo de ${municipality.name} em formato PDF iniciado!`);
              }}
              className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-blue-600 rounded-xl hover:bg-blue-700 active:scale-95 transition-all shadow-md"
            >
              <Download className="w-3.5 h-3.5" />
              Baixar Folder Completo (.PDF)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
