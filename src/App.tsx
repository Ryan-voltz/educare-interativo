import { useState } from 'react';
import { Header } from './components/Header';
import { BahiaMap } from './components/BahiaMap';
import { BrasilMap } from './components/BrasilMap';
import { MetricsCard } from './components/MetricsCard';
import { MunicipalityDrawer } from './components/MunicipalityDrawer';
import { FolderModal } from './components/FolderModal';
import { VideoModal } from './components/VideoModal';
import { StateModal } from './components/StateModal';
import { ProposalModal } from './components/ProposalModal';
import type { MunicipalityCase, StateCase } from './data/educareData';
import { Sparkles, MapPin, Award, CheckCircle2 } from 'lucide-react';
import { sounds } from './utils/audio';

export function App() {
  const [viewMode, setViewMode] = useState<'bahia' | 'brasil'>('bahia');
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');

  // Selected entities
  const [selectedMunicipality, setSelectedMunicipality] = useState<MunicipalityCase | null>(null);
  const [selectedState, setSelectedState] = useState<StateCase | null>(null);

  // Modals
  const [folderMunicipality, setFolderMunicipality] = useState<MunicipalityCase | null>(null);
  const [videoMunicipality, setVideoMunicipality] = useState<MunicipalityCase | null>(null);
  const [isProposalOpen, setIsProposalOpen] = useState(false);
  const [proposalMunicipality, setProposalMunicipality] = useState<MunicipalityCase | null>(null);

  const handleOpenProposal = (municipality?: MunicipalityCase | null) => {
    sounds.playTap();
    setProposalMunicipality(municipality || selectedMunicipality);
    setIsProposalOpen(true);
  };

  return (
    <div className="min-h-screen bg-slate-100/70 flex flex-col font-sans text-slate-800">
      {/* Top Navigation */}
      <Header
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        onOpenProposal={() => handleOpenProposal(null)}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-5 sm:py-6 flex flex-col gap-5">
        {/* Top Interactive Announcement Banner */}
        <div className="bg-gradient-to-r from-blue-950 via-blue-900 to-indigo-950 text-white px-4 sm:px-6 py-3.5 rounded-3xl shadow-elevated flex flex-col sm:flex-row items-center justify-between gap-3 text-xs sm:text-sm border border-blue-800/60">
          <div className="flex items-center gap-3">
            <span className="p-2 bg-orange-500 text-white rounded-xl shadow-xs shrink-0">
              <Sparkles className="w-4 h-4" />
            </span>
            <span>
              <strong className="text-orange-400">Undime Bahia 2026:</strong> Toque nos municípios destacados para explorar livros, materiais didáticos e resultados das redes parceiras do Grupo Educare.
            </span>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => handleOpenProposal(null)}
              className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-bold backdrop-blur-md transition-all border border-white/20 active:scale-95"
            >
              Simulador para Secretários
            </button>
          </div>
        </div>

        {/* 2-Column Split: Interactive Map & Live Metrics */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column: Interactive Map (7 cols) */}
          <div className="lg:col-span-7 flex flex-col gap-2.5">
            <div className="flex items-center justify-between px-2">
              <div className="text-xs font-black text-slate-600 uppercase tracking-widest flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-blue-700" />
                <span>{viewMode === 'bahia' ? 'Território da Bahia • Malha Oficial IBGE' : 'Presença Nacional • Brasil'}</span>
              </div>
              <div className="text-xs text-slate-500 font-medium">
                {viewMode === 'bahia' ? '42 redes em destaque' : '10 estados parceiros'}
              </div>
            </div>

            {viewMode === 'bahia' ? (
              <BahiaMap
                selectedMunicipalityId={selectedMunicipality ? selectedMunicipality.id : null}
                onSelectMunicipality={(m) => setSelectedMunicipality(m)}
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

          {/* Right Column: Slide Metrics Card & Instant Search (5 cols) */}
          <div className="lg:col-span-5">
            <MetricsCard
              viewMode={viewMode}
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
              onSelectMunicipality={(m) => setSelectedMunicipality(m)}
              onSelectState={(s) => setSelectedState(s)}
              activeFilter={activeFilter}
              onFilterChange={setActiveFilter}
              onOpenProposal={() => handleOpenProposal(null)}
            />
          </div>
        </div>
      </main>

      {/* Modern Footer with Organic Educare Brand Arc */}
      <footer className="mt-auto bg-white border-t border-slate-200/90 pt-6 pb-8 relative overflow-hidden">
        {/* Iconic brand color curves matching the slide footer */}
        <div className="absolute top-0 left-0 w-64 h-2.5 bg-gradient-to-r from-blue-900 via-blue-600 to-sky-400 rounded-r-full"></div>
        <div className="absolute top-0 right-0 w-64 h-2.5 bg-gradient-to-l from-emerald-600 via-green-500 to-lime-400 rounded-l-full"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-2.5">
            <div className="w-2.5 h-2.5 rounded-full bg-blue-700"></div>
            <span className="font-extrabold text-blue-950 text-sm">Grupo Educare</span>
            <span>• Soluções Didáticas e Consultoria Pedagógica para Redes Municipais de Ensino</span>
          </div>

          <div className="flex items-center gap-3 text-slate-400 text-xs">
            <span className="font-bold text-slate-600">Undime Bahia 2026</span>
            <span>•</span>
            <span>Aplicação Interativa para Estande</span>
          </div>
        </div>
      </footer>

      {/* Executive Dossier Drawer */}
      <MunicipalityDrawer
        municipality={selectedMunicipality}
        onClose={() => setSelectedMunicipality(null)}
        onOpenFolder={(m) => setFolderMunicipality(m)}
        onOpenVideo={(m) => setVideoMunicipality(m)}
        onOpenProposal={(m) => handleOpenProposal(m)}
      />

      {/* State Modal (Brasil Mode) */}
      <StateModal
        state={selectedState}
        onClose={() => setSelectedState(null)}
        onDrillDownBahia={() => {
          setSelectedState(null);
          setViewMode('bahia');
        }}
      />

      {/* Pedagogical Folder PDF Reader Modal */}
      {folderMunicipality && (
        <FolderModal
          municipality={folderMunicipality}
          onClose={() => setFolderMunicipality(null)}
        />
      )}

      {/* Video Case Player Modal */}
      {videoMunicipality && (
        <VideoModal
          municipality={videoMunicipality}
          onClose={() => setVideoMunicipality(null)}
        />
      )}

      {/* Real-time Proposal Configurator Modal */}
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
