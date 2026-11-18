import React from 'react';
import {
  MapPin,
  BookOpen,
  Users,
  Target,
  Search,
  ChevronRight,
} from 'lucide-react';
import {
  BAHIA_MUNICIPALITIES_DATA,
  type MunicipalityCase,
  BRASIL_STATES_DATA,
  type StateCase,
} from '../data/educareData';

interface MetricsCardProps {
  viewMode: 'bahia' | 'brasil';
  searchTerm: string;
  onSearchChange: (val: string) => void;
  onSelectMunicipality: (m: MunicipalityCase) => void;
  onSelectState: (s: StateCase) => void;
  activeFilter: string;
  onFilterChange: (filter: string) => void;
}

export const MetricsCard: React.FC<MetricsCardProps> = ({
  viewMode,
  searchTerm,
  onSearchChange,
  onSelectMunicipality,
  onSelectState,
  activeFilter,
  onFilterChange,
}) => {
  const municipalitiesList = Object.values(BAHIA_MUNICIPALITIES_DATA);
  const statesList = Object.values(BRASIL_STATES_DATA);

  // Filter municipalities
  const filteredMunicipalities = municipalitiesList.filter((m) => {
    const matchesSearch =
      m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.region.toLowerCase().includes(searchTerm.toLowerCase());

    if (!matchesSearch) return false;

    if (activeFilter === 'all') return true;
    if (activeFilter === 'alfa') return m.primaryProject === 'alfa-educa';
    if (activeFilter === 'robotica') return m.primaryProject === 'robotica-maker';
    if (activeFilter === 'socio') return m.primaryProject === 'socioemocional-viver';
    if (activeFilter === 'gestao') return m.primaryProject === 'gestao-redes';
    return true;
  });

  return (
    <div className="flex flex-col gap-5 w-full">
      {/* Faithful Replica of Slide Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-7 shadow-lg border border-slate-200/90 relative overflow-hidden transition-all duration-300 hover:shadow-xl">
        <div className="absolute top-0 right-0 w-36 h-36 bg-gradient-to-bl from-sky-100 to-transparent rounded-bl-full pointer-events-none opacity-60"></div>

        {/* Counter Header Pill */}
        <div className="flex items-center gap-4 border-2 border-sky-600/30 bg-sky-50/50 p-4 rounded-2xl">
          <div className="w-14 h-14 rounded-2xl bg-blue-700 text-white flex items-center justify-center shrink-0 shadow-md ring-4 ring-blue-100">
            <MapPin className="w-7 h-7 text-white" />
          </div>
          <div>
            <div className="text-3xl sm:text-4xl font-black text-orange-500 tracking-tight flex items-baseline gap-1">
              {viewMode === 'bahia' ? '42' : '10+'}
              <span className="text-xl sm:text-2xl font-bold text-blue-950">
                {viewMode === 'bahia' ? 'municípios' : 'estados'}
              </span>
            </div>
            <div className="text-sm font-bold text-blue-900 tracking-wide uppercase">
              {viewMode === 'bahia' ? 'alcançados na Bahia' : 'com presença nacional'}
            </div>
          </div>
        </div>

        {/* Three Pillars (From the Slide) */}
        <div className="mt-6 space-y-4">
          {/* Item 1: Projetos educacionais */}
          <div className="flex items-center gap-3.5 group">
            <div className="w-11 h-11 rounded-xl bg-sky-100 text-blue-800 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform duration-200">
              <BookOpen className="w-5 h-5 text-blue-700" />
            </div>
            <div>
              <div className="text-base font-bold text-slate-900 leading-snug">
                Projetos educacionais
              </div>
              <div className="text-xs text-slate-500 font-medium">
                Coleções didáticas, livros estruturados e laboratórios maker
              </div>
            </div>
          </div>

          {/* Item 2: Diálogo com gestores */}
          <div className="flex items-center gap-3.5 group">
            <div className="w-11 h-11 rounded-xl bg-orange-100 text-orange-700 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform duration-200">
              <Users className="w-5 h-5 text-orange-600" />
            </div>
            <div>
              <div className="text-base font-bold text-slate-900 leading-snug">
                Diálogo com gestores
              </div>
              <div className="text-xs text-slate-500 font-medium">
                Acompanhamento técnico próximo das secretarias municipais
              </div>
            </div>
          </div>

          {/* Item 3: Propostas alinhadas às necessidades */}
          <div className="flex items-center gap-3.5 group">
            <div className="w-11 h-11 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform duration-200">
              <Target className="w-5 h-5 text-emerald-700" />
            </div>
            <div>
              <div className="text-base font-bold text-slate-900 leading-snug">
                Propostas alinhadas
              </div>
              <div className="text-xs text-slate-500 font-medium">
                Soluções sob medida para o perfil e metas de cada rede
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Quick Selection Drawer for Vitória */}
      <div className="bg-white rounded-3xl p-5 shadow-md border border-slate-200/80 space-y-4">
        <div className="flex items-center justify-between">
          <div className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
            <Search className="w-4 h-4 text-blue-600" />
            <span>Consultar Cidades / Cases</span>
          </div>
          <span className="text-[11px] font-semibold text-slate-400">
            {viewMode === 'bahia' ? `${filteredMunicipalities.length} cidades` : `${statesList.length} estados`}
          </span>
        </div>

        {/* Search Input */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder={viewMode === 'bahia' ? "Buscar município baiano (ex: Salvador, Feira...)" : "Buscar estado..."}
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
          />
        </div>

        {/* Filter Badges (Only in Bahia mode) */}
        {viewMode === 'bahia' && (
          <div className="flex flex-wrap gap-1.5 text-[11px]">
            <button
              onClick={() => onFilterChange('all')}
              className={`px-2.5 py-1 rounded-lg font-bold transition-all ${
                activeFilter === 'all'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Todos ({municipalitiesList.length})
            </button>
            <button
              onClick={() => onFilterChange('alfa')}
              className={`px-2.5 py-1 rounded-lg font-bold transition-all ${
                activeFilter === 'alfa'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Alfabetização
            </button>
            <button
              onClick={() => onFilterChange('robotica')}
              className={`px-2.5 py-1 rounded-lg font-bold transition-all ${
                activeFilter === 'robotica'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Robótica Maker
            </button>
            <button
              onClick={() => onFilterChange('socio')}
              className={`px-2.5 py-1 rounded-lg font-bold transition-all ${
                activeFilter === 'socio'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Socioemocional
            </button>
          </div>
        )}

        {/* Scrollable List of Cities */}
        <div className="max-h-56 overflow-y-auto space-y-1.5 pr-1">
          {viewMode === 'bahia' ? (
            filteredMunicipalities.map((m) => (
              <button
                key={m.id}
                onClick={() => onSelectMunicipality(m)}
                className="w-full text-left p-2.5 rounded-xl border border-slate-100 hover:border-blue-200 hover:bg-sky-50/70 transition-all flex items-center justify-between group active:scale-[0.98]"
              >
                <div className="flex items-center gap-2.5">
                  <span className="w-2 h-2 rounded-full bg-blue-600 group-hover:scale-125 transition-transform"></span>
                  <div>
                    <div className="text-xs font-bold text-slate-800 group-hover:text-blue-900">
                      {m.name}
                    </div>
                    <div className="text-[10px] text-slate-400">{m.region}</div>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 text-blue-600 text-xs font-bold">
                  <span className="text-[10px] bg-sky-100 text-blue-800 px-2 py-0.5 rounded-md">
                    Ver Case
                  </span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </div>
              </button>
            ))
          ) : (
            statesList.map((s) => (
              <button
                key={s.sigla}
                onClick={() => onSelectState(s)}
                className="w-full text-left p-2.5 rounded-xl border border-slate-100 hover:border-blue-200 hover:bg-sky-50/70 transition-all flex items-center justify-between group active:scale-[0.98]"
              >
                <div className="flex items-center gap-2.5">
                  <span className="w-6 h-6 rounded-lg bg-blue-100 text-blue-900 text-xs font-black flex items-center justify-center">
                    {s.sigla}
                  </span>
                  <div>
                    <div className="text-xs font-bold text-slate-800">{s.nome}</div>
                    <div className="text-[10px] text-slate-400">
                      {s.municipiosAtendidos} municípios atendidos
                    </div>
                  </div>
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-blue-600" />
              </button>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
