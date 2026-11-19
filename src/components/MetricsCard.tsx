import React, { useMemo } from 'react';
import { BookOpen, Users, Target, Search, ChevronRight, X } from 'lucide-react';
import {
  BAHIA_MUNICIPALITIES_DATA,
  type MunicipalityCase,
  BRASIL_STATES_DATA,
  TOTAL_CONTRATOS_BRASIL,
  type StateCase,
} from '../data/educareData';
import { sounds } from '../utils/audio';

const MUNICIPALITIES = Object.values(BAHIA_MUNICIPALITIES_DATA).sort((a, b) => a.name.localeCompare(b.name, 'pt-BR'));
const STATES = Object.values(BRASIL_STATES_DATA).sort((a, b) => b.contratos - a.contratos);

const PILLARS = [
  {
    Icon: BookOpen,
    title: 'Projetos educacionais',
    text: 'Coleções didáticas, alfabetização na idade certa e kits de robótica maker.',
    tone: 'bg-blue-100 text-blue-700',
  },
  {
    Icon: Users,
    title: 'Diálogo com gestores',
    text: 'Assessoria contínua aos secretários e formação em serviço para docentes.',
    tone: 'bg-orange-100 text-orange-600',
  },
  {
    Icon: Target,
    title: 'Propostas alinhadas',
    text: 'Soluções sob medida para as metas do PME e para alavancar o IDEB.',
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

const PROJECT_BY_FILTER: Record<string, string> = {
  alfa: 'alfa-educa',
  robotica: 'robotica-maker',
  socio: 'socioemocional-viver',
  gestao: 'gestao-redes',
};

/* ---------------------------------------------------------------
   Alcance + pilares (o "slide" da Educare)
   --------------------------------------------------------------- */
interface MetricsCardProps {
  viewMode: 'bahia' | 'brasil';
  onOpenProposal: () => void;
}

export const MetricsCard: React.FC<MetricsCardProps> = ({ viewMode, onOpenProposal }) => {
  const isBahia = viewMode === 'bahia';

  return (
    <section className="shrink-0 bg-white rounded-3xl border border-slate-200 shadow-elevated overflow-hidden">
      <div className="flex items-end gap-3.5 px-5 xl:px-6 pt-4 pb-3 border-b border-slate-200">
        <span className="font-heading font-semibold text-orange-500 text-5xl 2xl:text-6xl leading-[0.85] tabular-nums">
          {isBahia ? '42' : Object.keys(BRASIL_STATES_DATA).length}
        </span>
        <span className="pb-0.5 min-w-0">
          <span className="block font-heading font-semibold text-xl xl:text-2xl text-blue-950 leading-tight">
            {isBahia ? 'municípios alcançados na Bahia' : 'estados com contratos Educare'}
          </span>
          <span className="block text-sm text-slate-600 tabular-nums">
            Cerca de {TOTAL_CONTRATOS_BRASIL.toLocaleString('pt-BR')} contratos no Brasil, a maior parte na Bahia
          </span>
        </span>
      </div>

      <ul className="grid sm:grid-cols-3 gap-3 xl:gap-4 px-5 xl:px-6 py-3.5">
        {PILLARS.map(({ Icon, title, text, tone }) => (
          <li key={title} className="flex items-center [@media(min-height:960px)]:items-start gap-2.5">
            <span className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${tone}`}>
              <Icon className="w-[18px] h-[18px]" />
            </span>
            <span className="min-w-0">
              <span className="block font-semibold text-[15px] text-slate-900 leading-tight">{title}</span>
              {/* Descrição só aparece quando há altura sobrando */}
              <span className="block lg:hidden [@media(min-height:960px)]:lg:block text-[13px] text-slate-600 mt-0.5 leading-snug">{text}</span>
            </span>
          </li>
        ))}
      </ul>

      {/* No desktop o botão "Simular proposta" já fica no topo */}
      <div className="px-5 pb-5 lg:hidden">
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
  );
};

/* ---------------------------------------------------------------
   Consulta rápida de municípios / estados
   --------------------------------------------------------------- */
interface MunicipalitySearchProps {
  viewMode: 'bahia' | 'brasil';
  searchTerm: string;
  onSearchChange: (val: string) => void;
  onSelectMunicipality: (m: MunicipalityCase) => void;
  onSelectState: (s: StateCase) => void;
  activeFilter: string;
  onFilterChange: (filter: string) => void;
}

export const MunicipalitySearch: React.FC<MunicipalitySearchProps> = ({
  viewMode,
  searchTerm,
  onSearchChange,
  onSelectMunicipality,
  onSelectState,
  activeFilter,
  onFilterChange,
}) => {
  const isBahia = viewMode === 'bahia';
  const term = searchTerm.trim().toLowerCase();

  const filteredMunicipalities = useMemo(
    () =>
      MUNICIPALITIES.filter((m) => {
        if (term && !m.name.toLowerCase().includes(term) && !m.region.toLowerCase().includes(term)) return false;
        const project = PROJECT_BY_FILTER[activeFilter];
        return !project || m.primaryProject === project;
      }),
    [term, activeFilter],
  );

  const filteredStates = useMemo(() => STATES.filter((s) => s.nome.toLowerCase().includes(term)), [term]);

  return (
    <section
      aria-labelledby="consulta-titulo"
      className="bg-white rounded-3xl border border-slate-200 shadow-elevated p-4 xl:p-5 flex flex-col gap-3 lg:flex-1 lg:min-h-0 min-w-0"
    >
      <div className="flex items-center justify-between shrink-0">
        <h2 id="consulta-titulo" className="text-lg text-blue-950">
          {isBahia ? 'Consultar municípios' : 'Consultar estados'}
        </h2>
        <span className="text-xs font-semibold text-slate-600 bg-slate-100 px-2.5 py-1 rounded-full tabular-nums">
          {isBahia ? `${filteredMunicipalities.length} cidades` : `${filteredStates.length} estados`}
        </span>
      </div>

      <div className="relative shrink-0">
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
        <div
          className="flex gap-1.5 overflow-x-auto no-scrollbar shrink-0 -mx-4 px-4 xl:-mx-5 xl:px-5 [@media(max-height:880px)]:lg:hidden"
          role="group"
          aria-label="Filtrar por projeto"
        >
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
                className={`h-8 px-3 rounded-full text-[13px] font-medium shrink-0 transition-colors ${
                  active
                    ? 'bg-blue-950 text-white'
                    : 'bg-white text-slate-700 border border-slate-200 hover:border-blue-300 hover:text-blue-950'
                }`}
              >
                {f.label}
              </button>
            );
          })}
        </div>
      )}

      {/* Lista com rolagem interna */}
      <ul className="max-h-72 lg:max-h-none lg:flex-1 lg:min-h-0 overflow-y-auto overscroll-contain -mx-2 px-1 space-y-0.5">
        {isBahia ? (
          filteredMunicipalities.length > 0 ? (
            filteredMunicipalities.map((m) => (
              <li key={m.id}>
                <button
                  onClick={() => onSelectMunicipality(m)}
                  className="w-full text-left px-3 py-2 rounded-xl hover:bg-blue-50 active:bg-blue-100 transition-colors flex items-center justify-between gap-3 group"
                >
                  <span className="flex items-center gap-3 min-w-0">
                    <span className="w-2.5 h-2.5 rounded-full bg-blue-600 ring-4 ring-blue-100 shrink-0" />
                    <span className="min-w-0">
                      <span className="block text-[15px] font-semibold text-slate-900 truncate">{m.name}</span>
                      <span className="block text-xs text-slate-500 truncate">{m.region}</span>
                    </span>
                  </span>
                  <ChevronRight className="w-4 h-4 text-slate-400 shrink-0 group-hover:text-blue-700 group-hover:translate-x-0.5 transition" />
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
                className="w-full text-left px-3 py-2 rounded-xl hover:bg-blue-50 active:bg-blue-100 transition-colors flex items-center justify-between gap-3 group"
              >
                <span className="flex items-center gap-3">
                  <span className="w-9 h-9 rounded-xl bg-blue-950 text-white text-xs font-semibold flex items-center justify-center">
                    {s.sigla}
                  </span>
                  <span>
                    <span className="block text-[15px] font-semibold text-slate-900">{s.nome}</span>
                    <span className="block text-xs text-slate-500 tabular-nums">
                      cerca de {s.contratos.toLocaleString('pt-BR')} contratos
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
  );
};
