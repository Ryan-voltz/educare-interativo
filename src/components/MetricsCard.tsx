import React from 'react';
import {
  MapPin,
  BookOpen,
  Users,
  Target,
  Search,
  ChevronRight,
  Sparkles,
  School,
  GraduationCap,
  TrendingUp,
  X,
} from 'lucide-react';
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
}

export const MetricsCard: React.FC<MetricsCardProps> = ({
  viewMode,
  searchTerm,
  onSearchChange,
  onSelectMunicipality,
  onSelectState,
  activeFilter,
  onFilterChange,
  onOpenProposal,
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
      {/* Primary Slide Showcase Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-7 shadow-elevated border border-slate-200/90 relative overflow-hidden transition-all duration-300">
        {/* Subtle decorative geometry in top right */}
        <div className="absolute top-0 right-0 w-44 h-44 bg-gradient-to-bl from-sky-100/60 via-blue-50/30 to-transparent rounded-bl-full pointer-events-none"></div>

        {/* Counter Hero Pill matching the exact graphic */}
        <div className="flex items-center gap-4 border-2 border-blue-900/20 bg-gradient-to-r from-sky-50/70 via-blue-50/40 to-white p-4 sm:p-5 rounded-2xl shadow-xs">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-700 to-blue-900 text-white flex items-center justify-center shrink-0 shadow-md ring-4 ring-blue-100">
            <MapPin className="w-8 h-8 text-white fill-white/20" />
          </div>
          <div>
            <div className="text-4xl sm:text-5xl font-black text-orange-500 tracking-tight leading-none flex items-baseline gap-2">
              {viewMode === 'bahia' ? '42' : '10+'}
              <span className="text-2xl sm:text-3xl font-extrabold text-blue-950">
                {viewMode === 'bahia' ? 'municípios' : 'estados'}
              </span>
            </div>
            <div className="text-xs sm:text-sm font-black text-blue-900 tracking-wider uppercase mt-1">
              {viewMode === 'bahia' ? 'alcançados na Bahia' : 'com presença nacional'}
            </div>
          </div>
        </div>

        {/* The 3 Educational Pillars */}
        <div className="mt-6 space-y-4">
          {/* Pillar 1 */}
          <div className="flex items-start gap-3.5 group p-2 rounded-xl hover:bg-slate-50 transition-colors">
            <div className="w-11 h-11 rounded-xl bg-blue-100 text-blue-800 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform duration-200 shadow-xs">
              <BookOpen className="w-5 h-5 text-blue-700" />
            </div>
            <div>
              <div className="text-base font-extrabold text-slate-900 leading-snug">
                Projetos educacionais
              </div>
              <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">
                Coleções didáticas estruturadas, alfabetização na idade certa e kits de robótica maker.
              </p>
            </div>
          </div>

          {/* Pillar 2 */}
          <div className="flex items-start gap-3.5 group p-2 rounded-xl hover:bg-slate-50 transition-colors">
            <div className="w-11 h-11 rounded-xl bg-orange-100 text-orange-700 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform duration-200 shadow-xs">
              <Users className="w-5 h-5 text-orange-600" />
            </div>
            <div>
              <div className="text-base font-extrabold text-slate-900 leading-snug">
                Diálogo com gestores
              </div>
              <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">
                Assessoria presencial contínua aos secretários e formação em serviço para os docentes.
              </p>
            </div>
          </div>

          {/* Pillar 3 */}
          <div className="flex items-start gap-3.5 group p-2 rounded-xl hover:bg-slate-50 transition-colors">
            <div className="w-11 h-11 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform duration-200 shadow-xs">
              <Target className="w-5 h-5 text-emerald-700" />
            </div>
            <div>
              <div className="text-base font-extrabold text-slate-900 leading-snug">
                Propostas alinhadas
              </div>
              <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">
                Soluções desenhadas sob medida para atender as metas do PME e alavancar o IDEB.
              </p>
            </div>
          </div>
        </div>

        {/* Live Stand CTA for Secretários & Prefeitos */}
        <div className="mt-6 pt-5 border-t border-slate-100">
          <button
            onClick={() => {
              sounds.playTap();
              onOpenProposal();
            }}
            className="w-full py-3.5 px-4 bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-black text-xs uppercase tracking-wider rounded-2xl shadow-md hover:shadow-lg active:scale-95 transition-all flex items-center justify-center gap-2"
          >
            <Sparkles className="w-4 h-4 text-white" />
            <span>Simular Proposta para Minha Rede</span>
          </button>
        </div>
      </div>

      {/* Aggregate Impact Ticker */}
      <div className="grid grid-cols-3 gap-2.5 bg-slate-900 text-white p-4 rounded-3xl shadow-elevated">
        <div className="text-center p-1">
          <div className="text-lg sm:text-xl font-black text-amber-400">310k+</div>
          <div className="text-[10px] text-slate-400 uppercase font-semibold">Alunos na Bahia</div>
        </div>
        <div className="text-center p-1 border-x border-slate-800">
          <div className="text-lg sm:text-xl font-black text-sky-400">1.850+</div>
          <div className="text-[10px] text-slate-400 uppercase font-semibold">Escolas Públicas</div>
        </div>
        <div className="text-center p-1">
          <div className="text-lg sm:text-xl font-black text-emerald-400">94%</div>
          <div className="text-[10px] text-slate-400 uppercase font-semibold">Alfabetização</div>
        </div>
      </div>

      {/* Instant Search and List for Vitória */}
      <div className="bg-white rounded-3xl p-5 shadow-elevated border border-slate-200/90 space-y-3.5">
        <div className="flex items-center justify-between">
          <div className="text-xs font-black text-blue-950 uppercase tracking-wider flex items-center gap-1.5">
            <Search className="w-4 h-4 text-blue-700" />
            <span>Consultar Municípios</span>
          </div>
          <span className="text-[11px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
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
            placeholder={
              viewMode === 'bahia'
                ? 'Buscar cidade (ex: Salvador, Barreiras, Conquista...)'
                : 'Buscar estado...'
            }
            className="w-full pl-10 pr-9 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white transition-all"
          />
          {searchTerm && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Filter Badges in Bahia View */}
        {viewMode === 'bahia' && (
          <div className="flex flex-wrap gap-1.5 text-[11px]">
            {[
              { id: 'all', label: `Todos (${municipalitiesList.length})` },
              { id: 'alfa', label: 'Alfabetização' },
              { id: 'robotica', label: 'Robótica Maker' },
              { id: 'socio', label: 'Socioemocional' },
              { id: 'gestao', label: 'Gestão/SAEB' },
            ].map((f) => (
              <button
                key={f.id}
                onClick={() => {
                  sounds.playTap();
                  onFilterChange(f.id);
                }}
                className={`px-2.5 py-1 rounded-lg font-bold transition-all active:scale-95 ${
                  activeFilter === f.id
                    ? 'bg-blue-900 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        )}

        {/* City/State Scrollable List */}
        <div className="max-h-60 overflow-y-auto space-y-1.5 pr-1">
          {viewMode === 'bahia' ? (
            filteredMunicipalities.length > 0 ? (
              filteredMunicipalities.map((m) => (
                <button
                  key={m.id}
                  onClick={() => {
                    sounds.playTap();
                    onSelectMunicipality(m);
                  }}
                  className="w-full text-left p-3 rounded-2xl border border-slate-100 hover:border-blue-300 hover:bg-sky-50/80 transition-all flex items-center justify-between group active:scale-[0.98]"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-2.5 h-2.5 rounded-full bg-blue-600 group-hover:scale-125 transition-transform"></span>
                    <div>
                      <div className="text-xs font-extrabold text-slate-900 group-hover:text-blue-950">
                        {m.name}
                      </div>
                      <div className="text-[10px] text-slate-500">{m.region}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold bg-blue-50 text-blue-700 px-2 py-0.5 rounded-md border border-blue-100">
                      {m.studentsImpacted > 0 ? `${(m.studentsImpacted / 1000).toFixed(1)}k alunos` : 'Case'}
                    </span>
                    <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-blue-700 group-hover:translate-x-0.5 transition-all" />
                  </div>
                </button>
              ))
            ) : (
              <div className="text-center py-6 text-slate-400 text-xs">
                Nenhum município encontrado com "{searchTerm}".
              </div>
            )
          ) : (
            statesList.map((s) => (
              <button
                key={s.sigla}
                onClick={() => {
                  sounds.playTap();
                  onSelectState(s);
                }}
                className="w-full text-left p-3 rounded-2xl border border-slate-100 hover:border-blue-300 hover:bg-sky-50/80 transition-all flex items-center justify-between group active:scale-[0.98]"
              >
                <div className="flex items-center gap-3">
                  <span className="w-7 h-7 rounded-xl bg-blue-900 text-white text-xs font-black flex items-center justify-center">
                    {s.sigla}
                  </span>
                  <div>
                    <div className="text-xs font-bold text-slate-900">{s.nome}</div>
                    <div className="text-[10px] text-slate-500">
                      {s.municipiosAtendidos} municípios atendidos
                    </div>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-blue-700" />
              </button>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
