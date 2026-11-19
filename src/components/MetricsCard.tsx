import React from 'react';
import { BookOpen, Users, Target, Search, ChevronRight, X } from 'lucide-react';
import {
  BAHIA_MUNICIPALITIES_DATA,
  type MunicipalityCase,
  BRASIL_STATES_DATA,
  type StateCase,
} from '../data/educareData';
import { sounds } from '../utils/audio';

interface MetricsCardProps {
  viewMode: 'bahia' | 'brasil';
  searchTerm: string;
  onSearchChange: (val: string) => void;
  onSelectMunicipality: (m: MunicipalityCase) => void;
  onSelectState: (s: StateCase) => void;
  activeFilter: string;
  onFilterChange: (filter: string) => void;
  onOpenProposal: () => void;
  qrSlot?: React.ReactNode;
}

const PILLARS = [
  {
    Icon: BookOpen,
    title: 'Projetos educacionais',
    text: 'Coleções didáticas estruturadas, alfabetização na idade certa e kits de robótica maker.',
    tone: 'bg-blue-100 text-blue-700',
  },
  {
    Icon: Users,
    title: 'Diálogo com gestores',
    text: 'Assessoria presencial contínua aos secretários e formação em serviço para os docentes.',
    tone: 'bg-orange-100 text-orange-600',
  },
  {
    Icon: Target,
    title: 'Propostas alinhadas',
    text: 'Soluções desenhadas sob medida para atender às metas do PME e alavancar o IDEB.',
    tone: 'bg-emerald-100 text-emerald-700',
  },
];

const FILTERS = [
  { id: 'all', label: 'Todos' },
  { id: 'alfa', label: 'Alfabetização' },
  { id: 'robotica', label: 'Robótica maker' },
  { id: 'socio', label: 'Socioemocional' },
  { id: 'gestao', label: 'Gestão e SAEB' },
];

export const MetricsCard: React.FC<MetricsCardProps> = ({
  viewMode,
  searchTerm,
  onSearchChange,
  onSelectMunicipality,
  onSelectState,
  activeFilter,
  onFilterChange,
  onOpenProposal,
  qrSlot,
}) => {
  const municipalitiesList = Object.values(BAHIA_MUNICIPALITIES_DATA);
  const statesList = Object.values(BRASIL_STATES_DATA);
  const term = searchTerm.toLowerCase();

  const filteredMunicipalities = municipalitiesList.filter((m) => {
    const matchesSearch = m.name.toLowerCase().includes(term) || m.region.toLowerCase().includes(term);
    if (!matchesSearch) return false;
    if (activeFilter === 'alfa') return m.primaryProject === 'alfa-educa';
    if (activeFilter === 'robotica') return m.primaryProject === 'robotica-maker';
    if (activeFilter === 'socio') return m.primaryProject === 'socioemocional-viver';
    if (activeFilter === 'gestao') return m.primaryProject === 'gestao-redes';
    return true;
  });

  const filteredStates = statesList.filter((s) => s.nome.toLowerCase().includes(term));
  const isBahia = viewMode === 'bahia';

  return (
    <>
      {/* Alcance + pilares */}
      <section className="bg-white rounded-3xl border border-slate-200 shadow-elevated overflow-hidden">
        <div className="px-6 pt-6 pb-5 flex items-end gap-4">
          <span className="font-heading font-semibold text-orange-500 text-7xl leading-[0.85] tabular-nums">
            {isBahia ? '42' : '10+'}
          </span>
          <span className="pb-1">
            <span className="block font-heading font-semibold text-2xl text-blue-950 leading-tight">
              {isBahia ? 'municípios' : 'estados'}
            </span>
            <span className="block text-sm text-slate-600">
              {isBahia ? 'alcançados na Bahia' : 'com presença do Grupo Educare'}
            </span>
          </span>
        </div>

        <dl className="grid grid-cols-3 border-y border-slate-200 bg-slate-50">
          {[
            { v: '310 mil+', l: 'alunos na Bahia' },
            { v: '1.850+', l: 'escolas públicas' },
            { v: '94%', l: 'de alfabetização' },
          ].map((s, i) => (
            <div key={s.l} className={`px-4 py-3.5 ${i > 0 ? 'border-l border-slate-200' : ''}`}>
              <dt className="sr-only">{s.l}</dt>
              <dd className="font-heading font-semibold text-xl text-blue-950 tabular-nums leading-none">{s.v}</dd>
              <dd className="text-xs text-slate-600 mt-1">{s.l}</dd>
            </div>
          ))}
        </dl>

        <ul className="px-6 py-5 space-y-4">
          {PILLARS.map(({ Icon, title, text, tone }) => (
            <li key={title} className="flex items-start gap-3.5">
              <span className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${tone}`}>
                <Icon className="w-5 h-5" />
              </span>
              <span>
                <span className="block font-semibold text-slate-900 leading-snug">{title}</span>
                <span className="block text-sm text-slate-600 mt-0.5 leading-relaxed">{text}</span>
              </span>
            </li>
          ))}
        </ul>

        <div className="px-6 pb-6">
          <button
            onClick={() => {
              sounds.playTap();
              onOpenProposal();
            }}
            className="btn-yellow w-full h-12 rounded-2xl font-semibold text-[15px]"
          >
            Simular proposta para a minha rede
          </button>
        </div>
      </section>

      {qrSlot}

      {/* Consulta rápida */}
      <section
        aria-labelledby="consulta-titulo"
        className="bg-white rounded-3xl border border-slate-200 shadow-elevated p-5 space-y-4"
      >
        <div className="flex items-center justify-between">
          <h2 id="consulta-titulo" className="text-lg text-blue-950">
            {isBahia ? 'Consultar municípios' : 'Consultar estados'}
          </h2>
          <span className="text-xs font-semibold text-slate-600 bg-slate-100 px-2.5 py-1 rounded-full tabular-nums">
            {isBahia ? `${filteredMunicipalities.length} cidades` : `${filteredStates.length} estados`}
          </span>
        </div>

        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="search"
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder={isBahia ? 'Buscar cidade ou região' : 'Buscar estado'}
            aria-label={isBahia ? 'Buscar cidade ou região' : 'Buscar estado'}
            className="w-full h-11 pl-10 pr-10 bg-slate-50 border border-slate-200 rounded-xl text-[15px] text-slate-900 placeholder:text-slate-500 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 focus:bg-white transition"
          />
          {searchTerm && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100"
              aria-label="Limpar busca"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {isBahia && (
          <div className="flex flex-wrap gap-1.5" role="group" aria-label="Filtrar por projeto">
            {FILTERS.map((f) => {
              const active = activeFilter === f.id;
              return (
                <button
                  key={f.id}
                  aria-pressed={active}
                  onClick={() => {
                    sounds.playTap();
                    onFilterChange(f.id);
                  }}
                  className={`h-8 px-3 rounded-full text-[13px] font-medium transition-colors ${
                    active
                      ? 'bg-blue-950 text-white'
                      : 'bg-white text-slate-700 border border-slate-200 hover:border-blue-300 hover:text-blue-950'
                  }`}
                >
                  {f.label}
                  {f.id === 'all' && <span className="tabular-nums"> ({municipalitiesList.length})</span>}
                </button>
              );
            })}
          </div>
        )}

        <ul className="max-h-72 overflow-y-auto -mx-1 px-1 space-y-1">
          {isBahia ? (
            filteredMunicipalities.length > 0 ? (
              filteredMunicipalities.map((m) => (
                <li key={m.id}>
                  <button
                    onClick={() => {
                      sounds.playTap();
                      onSelectMunicipality(m);
                    }}
                    className="w-full text-left px-3 py-2.5 rounded-xl hover:bg-blue-50 transition-colors flex items-center justify-between gap-3 group"
                  >
                    <span className="flex items-center gap-3 min-w-0">
                      <span className="w-2.5 h-2.5 rounded-full bg-blue-600 ring-4 ring-blue-100 shrink-0" />
                      <span className="min-w-0">
                        <span className="block text-[15px] font-semibold text-slate-900 truncate">{m.name}</span>
                        <span className="block text-xs text-slate-500 truncate">{m.region}</span>
                      </span>
                    </span>
                    <span className="flex items-center gap-1.5 shrink-0">
                      <span className="text-xs font-medium text-blue-700 tabular-nums">
                        {m.studentsImpacted > 0
                          ? `${(m.studentsImpacted / 1000).toLocaleString('pt-BR', { maximumFractionDigits: 1 })} mil alunos`
                          : 'Case'}
                      </span>
                      <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-blue-700 group-hover:translate-x-0.5 transition" />
                    </span>
                  </button>
                </li>
              ))
            ) : (
              <li className="text-center py-8 text-sm text-slate-500">
                Nenhum município encontrado para “{searchTerm}”. Tente outro nome ou limpe os filtros.
              </li>
            )
          ) : filteredStates.length > 0 ? (
            filteredStates.map((s) => (
              <li key={s.sigla}>
                <button
                  onClick={() => {
                    sounds.playTap();
                    onSelectState(s);
                  }}
                  className="w-full text-left px-3 py-2.5 rounded-xl hover:bg-blue-50 transition-colors flex items-center justify-between gap-3 group"
                >
                  <span className="flex items-center gap-3">
                    <span className="w-9 h-9 rounded-xl bg-blue-950 text-white text-xs font-semibold flex items-center justify-center">
                      {s.sigla}
                    </span>
                    <span>
                      <span className="block text-[15px] font-semibold text-slate-900">{s.nome}</span>
                      <span className="block text-xs text-slate-500 tabular-nums">
                        {s.municipiosAtendidos} municípios atendidos
                      </span>
                    </span>
                  </span>
                  <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-blue-700" />
                </button>
              </li>
            ))
          ) : (
            <li className="text-center py-8 text-sm text-slate-500">Nenhum estado encontrado.</li>
          )}
        </ul>
      </section>
    </>
  );
};
