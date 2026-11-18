import { useState } from 'react';
import { Header } from './components/Header';
import { BahiaMap } from './components/BahiaMap';
import { BrasilMap } from './components/BrasilMap';
import { MetricsCard } from './components/MetricsCard';
import { MunicipalityDrawer } from './components/MunicipalityDrawer';
import { FolderModal } from './components/FolderModal';
import { VideoModal } from './components/VideoModal';
import { StateModal } from './components/StateModal';
import type { MunicipalityCase, StateCase } from './data/educareData';
import { Sparkles } from 'lucide-react';

export function App() {
  const [viewMode, setViewMode] = useState<'bahia' | 'brasil'>('bahia');
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');

  // Selection states
  const [selectedMunicipality, setSelectedMunicipality] = useState<MunicipalityCase | null>(null);
  const [selectedState, setSelectedState] = useState<StateCase | null>(null);

  // Modals
  const [folderMunicipality, setFolderMunicipality] = useState<MunicipalityCase | null>(null);
  const [videoMunicipality, setVideoMunicipality] = useState<MunicipalityCase | null>(null);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-800">
      {/* Navbar / Header */}
      <Header viewMode={viewMode} onViewModeChange={setViewMode} />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 flex flex-col gap-6">
        {/* Top Announcement Bar */}
        <div className="bg-gradient-to-r from-blue-900 via-blue-800 to-sky-800 text-white p-3.5 sm:p-4 rounded-2xl shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3 text-xs sm:text-sm">
          <div className="flex items-center gap-2.5">
            <span className="p-1.5 bg-amber-400 text-blue-950 rounded-lg">
              <Sparkles className="w-4 h-4" />
            </span>
            <span>
              <strong className="text-amber-300">Bem-vindo(a) ao Estande Educare:</strong> Explore o mapa interativo e conheça nossos materiais didáticos e projetos em cada município.
            </span>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => {
                alert('Modo Apresentação ativado para Vitória no estande Undime!');
              }}
              className="px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-semibold backdrop-blur-md transition-all border border-white/20"
            >
              Modo Demonstração
            </button>
          </div>
        </div>

        {/* Dual Column Layout: Map & Metrics */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column: Interactive Map (7 cols on desktop) */}
          <div className="lg:col-span-7 flex flex-col gap-3">
            <div className="flex items-center justify-between px-1">
              <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                {viewMode === 'bahia' ? 'Mapa Interativo da Bahia' : 'Mapa Interativo do Brasil'}
              </div>
              <div className="text-xs text-slate-400">
                {viewMode === 'bahia' ? 'Clique no município para abrir' : 'Clique no estado para explorar'}
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
                onDrillDownBahia={() => setViewMode('bahia')}
              />
            )}
          </div>

          {/* Right Column: Slide Metrics Card & Municipality List (5 cols on desktop) */}
          <div className="lg:col-span-5">
            <MetricsCard
              viewMode={viewMode}
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
              onSelectMunicipality={(m) => setSelectedMunicipality(m)}
              onSelectState={(s) => setSelectedState(s)}
              activeFilter={activeFilter}
              onFilterChange={setActiveFilter}
            />
          </div>
        </div>
      </main>

      {/* Decorative Footer curves matching the reference image */}
      <footer className="mt-auto bg-white border-t border-slate-200/80 pt-6 pb-8 relative overflow-hidden">
        {/* Colorful accent curves from the slide design */}
        <div className="absolute top-0 left-0 w-48 h-2 bg-gradient-to-r from-blue-700 to-blue-500 rounded-r-full"></div>
        <div className="absolute top-0 right-0 w-48 h-2 bg-gradient-to-l from-emerald-500 to-lime-400 rounded-l-full"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-blue-600"></div>
            <span className="font-semibold text-slate-700">Grupo Educare</span>
            <span>• Soluções Didáticas e Consultoria Pedagógica para Redes Municipais</span>
          </div>

          <div className="flex items-center gap-4 text-slate-400">
            <span>Aplicação Oficial Undime Bahia 2026</span>
            <span>•</span>
            <span className="text-slate-600 font-medium">Hospedagem Vercel</span>
          </div>
        </div>
      </footer>

      {/* Drawer for Selected Municipality */}
      <MunicipalityDrawer
        municipality={selectedMunicipality}
        onClose={() => setSelectedMunicipality(null)}
        onOpenFolder={(m) => setFolderMunicipality(m)}
        onOpenVideo={(m) => setVideoMunicipality(m)}
      />

      {/* Modal for State Detail in Brasil mode */}
      <StateModal
        state={selectedState}
        onClose={() => setSelectedState(null)}
        onDrillDownBahia={() => {
          setSelectedState(null);
          setViewMode('bahia');
        }}
      />

      {/* Modal for Pedagogical Folder PDF Viewer */}
      {folderMunicipality && (
        <FolderModal
          municipality={folderMunicipality}
          onClose={() => setFolderMunicipality(null)}
        />
      )}

      {/* Modal for Video Case Player */}
      {videoMunicipality && (
        <VideoModal
          municipality={videoMunicipality}
          onClose={() => setVideoMunicipality(null)}
        />
      )}
    </div>
  );
}

export default App;
