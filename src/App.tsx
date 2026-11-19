import { lazy, Suspense, useCallback, useState } from 'react';
import { Header } from './components/Header';
import { BahiaMap } from './components/BahiaMap';
import { MetricsCard, MunicipalitySearch } from './components/MetricsCard';
import { WhatsAppQR } from './components/WhatsAppQR';
import { MunicipioPanel } from './components/MunicipioPanel';
import { BAHIA_MUNICIPALITIES_DATA, type MunicipalityCase, type StateCase } from './data/educareData';
import { sounds } from './utils/audio';

// Carregados só quando usados: deixam a abertura do app mais leve
const BrasilMap = lazy(() => import('./components/BrasilMap').then((m) => ({ default: m.BrasilMap })));
const StateModal = lazy(() => import('./components/StateModal').then((m) => ({ default: m.StateModal })));
const ProposalModal = lazy(() => import('./components/ProposalModal').then((m) => ({ default: m.ProposalModal })));

const STEPS_BAHIA = [
  { title: 'Toque no município', text: 'Pontos azuis são redes parceiras' },
  { title: 'Veja os contratos', text: 'Quantos fornecemos naquela rede' },
  { title: 'Fale com a Vitória', text: 'Leia o QR code do WhatsApp' },
];

const STEPS_BRASIL = [
  { title: 'Toque no estado', text: 'Em azul, estados com contratos' },
  { title: 'Veja os contratos', text: 'Quantos fornecemos no estado' },
  { title: 'Abra a Bahia', text: 'Os 42 municípios baianos' },
];

const MapFallback = () => (
  <div className="w-full h-full min-h-[520px] rounded-3xl border border-slate-200 bg-white animate-pulse" />
);

export function App() {
  const [viewMode, setViewMode] = useState<'bahia' | 'brasil'>('bahia');
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');

  const [selectedMunicipality, setSelectedMunicipality] = useState<MunicipalityCase | null>(null);
  const [selectedState, setSelectedState] = useState<StateCase | null>(null);

  const [isProposalOpen, setIsProposalOpen] = useState(false);
  const [proposalMunicipality, setProposalMunicipality] = useState<MunicipalityCase | null>(null);

  const handleOpenProposal = (municipality?: MunicipalityCase | null) => {
    sounds.playTap();
    setProposalMunicipality(municipality || selectedMunicipality);
    setIsProposalOpen(true);
  };

  const selectMunicipality = useCallback((m: MunicipalityCase | null) => {
    sounds.playTap();
    setSelectedMunicipality(m);
  }, []);

  const steps = viewMode === 'bahia' ? STEPS_BAHIA : STEPS_BRASIL;

  return (
    <div className="min-h-dvh lg:h-dvh lg:overflow-hidden bg-cream flex flex-col text-slate-900">
      <Header
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        onOpenProposal={() => handleOpenProposal(null)}
      />

      {/* Faixa institucional: título da tela e como usar */}
      <section className="band-deep shrink-0">
        <div className="max-w-[1680px] mx-auto px-4 sm:px-6 lg:px-8 py-5 lg:py-3 flex flex-col lg:flex-row lg:items-center gap-4 lg:gap-8">
          <div className="lg:shrink-0">
            <h1 className="text-3xl sm:text-4xl lg:text-[2rem] xl:text-4xl leading-[1.08] text-white text-balance">
              {viewMode === 'bahia' ? 'Presença nos municípios baianos' : 'Presença no território nacional'}
            </h1>
            <svg aria-hidden="true" viewBox="0 0 220 12" className="mt-1.5 w-44 h-2.5 text-orange-400" fill="none">
              <path d="M2 9C60 2 150 1 218 6" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
            </svg>
          </div>

          <ol className="lg:ml-auto grid sm:grid-cols-3 gap-2" aria-label="Como usar">
            {steps.map((s, i) => (
              <li
                key={s.title}
                className="flex gap-2.5 items-center rounded-2xl bg-white/[0.07] ring-1 ring-white/15 px-3 py-2"
              >
                <span className="shrink-0 w-7 h-7 rounded-full bg-amber-400 text-blue-950 font-heading font-semibold flex items-center justify-center tabular-nums">
                  {i + 1}
                </span>
                <span className="min-w-0">
                  <span className="block font-semibold text-white text-sm leading-tight">{s.title}</span>
                  <span className="block text-xs text-blue-100 leading-snug mt-0.5 lg:hidden 2xl:block">{s.text}</span>
                </span>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/*
        Desktop e tablet deitado: tudo cabe em uma tela, sem rolar a página.
        Mapa à esquerda; à direita: alcance e pilares, QR code e a consulta (lista com rolagem interna).
      */}
      <main className="flex-1 lg:min-h-0 max-w-[1680px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-5 lg:py-4">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 lg:gap-4 xl:gap-5 lg:h-full">
          <div className="lg:col-span-6 xl:col-span-7 lg:min-h-0 h-[520px] sm:h-[620px] lg:h-full">
            {viewMode === 'bahia' ? (
              <BahiaMap
                selectedMunicipalityId={selectedMunicipality ? selectedMunicipality.id : null}
                onSelectMunicipality={selectMunicipality}
                searchTerm={searchTerm}
              />
            ) : (
              <Suspense fallback={<MapFallback />}>
                <BrasilMap
                  selectedStateSigla={selectedState ? selectedState.sigla : null}
                  onSelectState={(s) => setSelectedState(s)}
                  onDrillDownBahia={() => {
                    sounds.playTap();
                    setViewMode('bahia');
                  }}
                />
              </Suspense>
            )}
          </div>

          <div className="lg:col-span-6 xl:col-span-5 lg:min-h-0 flex flex-col gap-5 lg:gap-4 xl:gap-5">
            <MetricsCard viewMode={viewMode} onOpenProposal={() => handleOpenProposal(null)} />
            <WhatsAppQR />
            <div className="lg:flex-1 lg:min-h-0 flex flex-col">
              <MunicipalitySearch
                viewMode={viewMode}
                searchTerm={searchTerm}
                onSearchChange={setSearchTerm}
                onSelectMunicipality={selectMunicipality}
                onSelectState={(s) => setSelectedState(s)}
                activeFilter={activeFilter}
                onFilterChange={setActiveFilter}
              />
            </div>
          </div>
        </div>
      </main>

      {/* Rodapé só em telas pequenas (no desktop a marca já está no topo) */}
      <footer className="lg:hidden mt-auto bg-white border-t border-slate-200 relative">
        <div aria-hidden="true" className="absolute inset-x-0 top-0 h-1.5 flex">
          <span className="flex-[3] bg-blue-600" />
          <span className="flex-[2] bg-orange-500" />
          <span className="flex-1 bg-emerald-500" />
        </div>
        <div className="px-4 sm:px-6 py-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-sm text-slate-600">
          <span className="flex items-center gap-3">
            <img src="/brand/educare-simbolo.png" alt="" className="h-8 w-auto" draggable={false} />
            <strong className="font-semibold text-blue-950">Grupo Educare Editora</strong>
          </span>
          <span className="text-slate-500">Undime Bahia 2026 · Aplicação do estande</span>
        </div>
      </footer>
      <div aria-hidden="true" className="hidden lg:flex shrink-0 h-1.5">
        <span className="flex-[3] bg-blue-600" />
        <span className="flex-[2] bg-orange-500" />
        <span className="flex-1 bg-emerald-500" />
      </div>

      {selectedMunicipality && (
        <MunicipioPanel
          municipality={selectedMunicipality}
          isPartner={!!BAHIA_MUNICIPALITIES_DATA[selectedMunicipality.id]}
          onClose={() => setSelectedMunicipality(null)}
        />
      )}

      <Suspense fallback={null}>
        {selectedState && (
          <StateModal
            state={selectedState}
            onClose={() => setSelectedState(null)}
            onDrillDownBahia={() => {
              setSelectedState(null);
              setViewMode('bahia');
            }}
          />
        )}

        {isProposalOpen && (
          <ProposalModal
            initialMunicipality={proposalMunicipality}
            onClose={() => setIsProposalOpen(false)}
          />
        )}
      </Suspense>
    </div>
  );
}

export default App;
