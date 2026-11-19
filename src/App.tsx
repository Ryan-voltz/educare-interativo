import { useState } from 'react';
import { Header } from './components/Header';
import { BahiaMap } from './components/BahiaMap';
import { BrasilMap } from './components/BrasilMap';
import { MetricsCard } from './components/MetricsCard';
import { WhatsAppQR } from './components/WhatsAppQR';
import { MunicipioPanel } from './components/MunicipioPanel';
import { StateModal } from './components/StateModal';
import { ProposalModal } from './components/ProposalModal';
import { BAHIA_MUNICIPALITIES_DATA, type MunicipalityCase, type StateCase } from './data/educareData';
import { sounds } from './utils/audio';

const STEPS_BAHIA = [
  { title: 'Toque no município', text: 'Os pontos azuis são as redes parceiras.' },
  { title: 'Veja os contratos', text: 'Quantos contratos fornecemos naquela rede.' },
  { title: 'Fale com a Vitória', text: 'Leia o QR code e converse pelo WhatsApp.' },
];

const STEPS_BRASIL = [
  { title: 'Toque no estado', text: 'Os estados em azul têm projetos ativos.' },
  { title: 'Veja os números', text: 'Municípios, escolas e alunos atendidos.' },
  { title: 'Abra a Bahia', text: 'Navegue até os 42 municípios baianos.' },
];

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

  const steps = viewMode === 'bahia' ? STEPS_BAHIA : STEPS_BRASIL;

  return (
    <div className="min-h-screen bg-cream flex flex-col text-slate-900">
      <Header
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        onOpenProposal={() => handleOpenProposal(null)}
      />

      {/* Faixa institucional: título da tela e como usar */}
      <section className="band-deep">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-7 sm:py-9 grid gap-6 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-5">
            <h1 className="text-3xl sm:text-4xl lg:text-[2.75rem] leading-[1.08] text-white text-balance">
              {viewMode === 'bahia'
                ? 'Presença nos municípios baianos'
                : 'Presença no território nacional'}
            </h1>
            <svg aria-hidden="true" viewBox="0 0 220 12" className="mt-2 w-48 h-3 text-orange-400" fill="none">
              <path d="M2 9C60 2 150 1 218 6" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
            </svg>
            <p className="mt-3 text-base text-blue-100 max-w-[46ch]">
              Soluções pedagógicas estruturadas e formação contínua para as redes municipais de ensino.
            </p>
          </div>

          <ol className="lg:col-span-7 grid sm:grid-cols-3 gap-2.5" aria-label="Como usar">
            {steps.map((s, i) => (
              <li
                key={s.title}
                className="flex gap-3 items-start rounded-2xl bg-white/[0.07] ring-1 ring-white/15 px-4 py-3.5"
              >
                <span className="shrink-0 w-8 h-8 rounded-full bg-amber-400 text-blue-950 font-heading font-semibold text-base flex items-center justify-center tabular-nums">
                  {i + 1}
                </span>
                <span className="min-w-0">
                  <span className="block font-semibold text-white text-[15px] leading-tight">{s.title}</span>
                  <span className="block text-[13px] text-blue-100 leading-snug mt-0.5">{s.text}</span>
                </span>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <main className="flex-1 max-w-[1400px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          <div className="lg:col-span-7 xl:col-span-8 lg:sticky lg:top-24">
            {viewMode === 'bahia' ? (
              <BahiaMap
                selectedMunicipalityId={selectedMunicipality ? selectedMunicipality.id : null}
                onSelectMunicipality={(m) => {
                  sounds.playTap();
                  setSelectedMunicipality(m);
                }}
                searchTerm={searchTerm}
              />
            ) : (
              <BrasilMap
                selectedStateSigla={selectedState ? selectedState.sigla : null}
                onSelectState={(s) => setSelectedState(s)}
                onDrillDownBahia={() => {
                  sounds.playTap();
                  setViewMode('bahia');
                }}
              />
            )}
          </div>

          <aside className="lg:col-span-5 xl:col-span-4 flex flex-col gap-6">
            <MetricsCard
              viewMode={viewMode}
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
              onSelectMunicipality={(m) => {
                sounds.playTap();
                setSelectedMunicipality(m);
              }}
              onSelectState={(s) => setSelectedState(s)}
              activeFilter={activeFilter}
              onFilterChange={setActiveFilter}
              onOpenProposal={() => handleOpenProposal(null)}
              qrSlot={<WhatsAppQR />}
            />
          </aside>
        </div>
      </main>

      <footer className="mt-auto bg-white border-t border-slate-200 relative">
        <div aria-hidden="true" className="absolute inset-x-0 top-0 h-1.5 flex">
          <span className="flex-[3] bg-blue-600" />
          <span className="flex-[2] bg-orange-500" />
          <span className="flex-1 bg-emerald-500" />
        </div>
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-slate-600">
          <div className="flex items-center gap-4">
            <img src="/brand/educare-simbolo.png" alt="" className="h-9 w-auto" draggable={false} />
            <span>
              <strong className="font-semibold text-blue-950">Grupo Educare Editora</strong>
              <span className="hidden md:inline"> · Soluções didáticas e consultoria pedagógica para redes municipais</span>
            </span>
          </div>
          <span className="text-slate-500">Undime Bahia 2026 · Aplicação do estande</span>
        </div>
      </footer>

      {selectedMunicipality && (
        <MunicipioPanel
          municipality={selectedMunicipality}
          isPartner={!!BAHIA_MUNICIPALITIES_DATA[selectedMunicipality.id]}
          onClose={() => setSelectedMunicipality(null)}
        />
      )}

      <StateModal
        state={selectedState}
        onClose={() => setSelectedState(null)}
        onDrillDownBahia={() => {
          setSelectedState(null);
          setViewMode('bahia');
        }}
      />

      {isProposalOpen && (
        <ProposalModal
          initialMunicipality={proposalMunicipality}
          onClose={() => setIsProposalOpen(false)}
        />
      )}
    </div>
  );
}

export default App;
