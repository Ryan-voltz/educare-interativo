import React, { useMemo, useState, useRef } from 'react';
import * as d3Geo from 'd3-geo';
import bahiaGeoJson from '../data/bahia-geo.json';
import { BAHIA_MUNICIPALITIES_DATA, type MunicipalityCase } from '../data/educareData';
import { sounds } from '../utils/audio';
import {
  ZoomIn,
  ZoomOut,
  RotateCcw,
  MapPin,
  Sparkles,
  CheckCircle2,
  Compass,
  Layers,
  ArrowUpRight,
} from 'lucide-react';

interface BahiaMapProps {
  selectedMunicipalityId: string | null;
  onSelectMunicipality: (municipality: MunicipalityCase | null) => void;
  searchTerm: string;
}

const REGIONAL_PRESETS: { name: string; filter: string; center?: [number, number]; zoom?: number }[] = [
  { name: 'Toda a Bahia', filter: 'all', zoom: 1, center: [0, 0] },
  { name: 'Metropolitana (RMS)', filter: 'Metropolitana', zoom: 1.8, center: [-140, -40] },
  { name: 'Portal do Sertão', filter: 'Portal do Sertão', zoom: 1.6, center: [-70, -20] },
  { name: 'Sul e Extremo Sul', filter: 'Sul', zoom: 1.6, center: [-50, -180] },
  { name: 'Oeste Baiano', filter: 'Oeste', zoom: 1.5, center: [130, 20] },
  { name: 'São Francisco', filter: 'Vale do São Francisco', zoom: 1.6, center: [-30, 150] },
  { name: 'Sudoeste', filter: 'Sudoeste', zoom: 1.6, center: [10, -120] },
  { name: 'Recôncavo', filter: 'Recôncavo', zoom: 1.7, center: [-80, -30] },
];

export const BahiaMap: React.FC<BahiaMapProps> = ({
  selectedMunicipalityId,
  onSelectMunicipality,
  searchTerm,
}) => {
  const [hoveredMunicipality, setHoveredMunicipality] = useState<{
    id: string;
    name: string;
    isFeatured: boolean;
    region: string;
    projectTitle?: string;
    students?: number;
    x: number;
    y: number;
  } | null>(null);

  const [zoomLevel, setZoomLevel] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [activeRegion, setActiveRegion] = useState('all');
  const [isDragging, setIsDragging] = useState(false);
  const dragStartRef = useRef<{ x: number; y: number } | null>(null);

  const width = 850;
  const height = 740;

  const { pathGenerator } = useMemo(() => {
    const proj = d3Geo.geoMercator();
    proj.fitExtent([[35, 35], [width - 35, height - 35]], bahiaGeoJson as any);
    const pathGen = d3Geo.geoPath().projection(proj);
    return { pathGenerator: pathGen };
  }, [width, height]);

  const features = useMemo(() => {
    return (bahiaGeoJson as any).features || [];
  }, []);

  const handleZoom = (factor: number) => {
    sounds.playTap();
    setZoomLevel((prev) => Math.min(Math.max(prev * factor, 0.8), 5));
  };

  const handleResetZoom = () => {
    sounds.playTap();
    setZoomLevel(1);
    setPan({ x: 0, y: 0 });
    setActiveRegion('all');
  };

  const handleSelectRegion = (preset: typeof REGIONAL_PRESETS[0]) => {
    sounds.playTap();
    setActiveRegion(preset.filter);
    if (preset.zoom && preset.center) {
      setZoomLevel(preset.zoom);
      setPan({ x: preset.center[0], y: preset.center[1] });
    } else {
      setZoomLevel(1);
      setPan({ x: 0, y: 0 });
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    dragStartRef.current = { x: e.clientX - pan.x, y: e.clientY - pan.y };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging && dragStartRef.current) {
      setPan({
        x: e.clientX - dragStartRef.current.x,
        y: e.clientY - dragStartRef.current.y,
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      setIsDragging(true);
      dragStartRef.current = {
        x: e.touches[0].clientX - pan.x,
        y: e.touches[0].clientY - pan.y,
      };
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (isDragging && dragStartRef.current && e.touches.length === 1) {
      setPan({
        x: e.touches[0].clientX - dragStartRef.current.x,
        y: e.touches[0].clientY - dragStartRef.current.y,
      });
    }
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  return (
    <div className="relative w-full h-[650px] lg:h-[750px] bg-gradient-to-br from-slate-50 via-white to-sky-50/70 rounded-3xl border border-slate-200/90 shadow-elevated overflow-hidden select-none flex flex-col">
      {/* Ocean Subtle Texture Effect on the Right */}
      <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-gradient-to-l from-sky-100/40 via-sky-50/20 to-transparent pointer-events-none"></div>
      <div className="absolute right-6 top-1/2 -translate-y-1/2 rotate-90 text-[10px] font-black tracking-[0.3em] uppercase text-sky-700/20 pointer-events-none select-none">
        Oceano Atlântico
      </div>

      {/* Top Regional Chips Bar */}
      <div className="relative z-20 px-4 pt-4 pb-2 flex items-center gap-1.5 overflow-x-auto no-scrollbar mask-edge">
        {REGIONAL_PRESETS.map((preset) => (
          <button
            key={preset.name}
            onClick={() => handleSelectRegion(preset)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold shrink-0 transition-all active:scale-95 flex items-center gap-1 ${
              activeRegion === preset.filter
                ? 'bg-blue-900 text-white shadow-md ring-2 ring-blue-950/20'
                : 'bg-white/90 text-slate-700 border border-slate-200/80 hover:bg-slate-100'
            }`}
          >
            <span>{preset.name}</span>
          </button>
        ))}
      </div>

      {/* Map Action Controls (Zoom/Pan/Reset) */}
      <div className="absolute top-16 left-4 z-20 flex flex-col gap-1.5 bg-white/95 backdrop-blur-md p-1.5 rounded-2xl shadow-md border border-slate-200">
        <button
          onClick={() => handleZoom(1.3)}
          className="p-2.5 text-slate-700 hover:text-blue-900 hover:bg-sky-50 rounded-xl transition-all active:scale-90"
          title="Aumentar Zoom"
        >
          <ZoomIn className="w-4 h-4" />
        </button>
        <button
          onClick={() => handleZoom(0.75)}
          className="p-2.5 text-slate-700 hover:text-blue-900 hover:bg-sky-50 rounded-xl transition-all active:scale-90"
          title="Diminuir Zoom"
        >
          <ZoomOut className="w-4 h-4" />
        </button>
        <button
          onClick={handleResetZoom}
          className="p-2.5 text-slate-700 hover:text-blue-900 hover:bg-sky-50 rounded-xl transition-all active:scale-90"
          title="Restaurar Visão Geral"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>

      {/* Compass Badge */}
      <div className="absolute bottom-16 right-4 z-20 hidden md:flex items-center gap-2 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-200 text-slate-500 text-xs shadow-xs pointer-events-none">
        <Compass className="w-4 h-4 text-blue-700" />
        <span className="font-bold text-[11px] tracking-wider uppercase">Bahia • Brasil</span>
      </div>

      {/* Legend & Hint Pill */}
      <div className="absolute bottom-4 left-4 z-20 flex items-center gap-3 bg-slate-900/90 text-white backdrop-blur-md px-4 py-2 rounded-2xl text-xs font-semibold shadow-lg">
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-blue-600 ring-2 ring-white/50"></span>
          <span>Redes Atendidas (42)</span>
        </div>
        <div className="w-px h-3 bg-slate-700"></div>
        <div className="flex items-center gap-1.5 text-orange-400">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Toque na cidade para abrir o dossiê</span>
        </div>
      </div>

      {/* Interactive SVG Canvas */}
      <div className="flex-1 w-full h-full relative cursor-grab active:cursor-grabbing">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full h-full"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <defs>
            {/* Soft shadow filter for active municipalities */}
            <filter id="cityGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="#004B87" floodOpacity="0.4" />
            </filter>
            <filter id="selectedGlow" x="-40%" y="-40%" width="180%" height="180%">
              <feDropShadow dx="0" dy="4" stdDeviation="6" floodColor="#F58220" floodOpacity="0.6" />
            </filter>
          </defs>

          <g
            transform={`translate(${pan.x}, ${pan.y}) scale(${zoomLevel})`}
            style={{ transformOrigin: 'center center' }}
          >
            {features.map((feature: any) => {
              const code = String(feature.properties.codarea);
              const name = feature.properties.name || '';
              const featuredData = BAHIA_MUNICIPALITIES_DATA[code];
              const isFeatured = !!featuredData;
              const isSelected = selectedMunicipalityId === code;

              // Region filter match
              const matchesRegion =
                activeRegion === 'all' ||
                (featuredData && featuredData.region.toLowerCase().includes(activeRegion.toLowerCase()));

              // Search term match
              const matchesSearch =
                searchTerm.trim().length > 1 &&
                name.toLowerCase().includes(searchTerm.toLowerCase());

              const d = pathGenerator(feature);
              if (!d) return null;

              let fillColor = 'fill-slate-200/90';
              let strokeColor = 'stroke-white';
              let strokeWidth = '0.5';
              let filter = '';

              if (isSelected) {
                fillColor = 'fill-orange-500';
                strokeColor = 'stroke-orange-950';
                strokeWidth = '2.5';
                filter = 'url(#selectedGlow)';
              } else if (matchesSearch) {
                fillColor = 'fill-amber-400';
                strokeColor = 'stroke-amber-800';
                strokeWidth = '2';
              } else if (isFeatured) {
                if (matchesRegion) {
                  fillColor = 'fill-blue-700 hover:fill-blue-600';
                  strokeColor = 'stroke-white';
                  strokeWidth = '1';
                  filter = 'url(#cityGlow)';
                } else {
                  fillColor = 'fill-blue-400/50 hover:fill-blue-500';
                  strokeColor = 'stroke-white';
                  strokeWidth = '0.6';
                }
              }

              return (
                <path
                  key={code}
                  d={d}
                  filter={filter}
                  className={`${fillColor} ${strokeColor} stroke-[${strokeWidth}] transition-all duration-200 ease-out cursor-pointer hover:opacity-90`}
                  onClick={(e) => {
                    e.stopPropagation();
                    sounds.playTap();
                    if (featuredData) {
                      onSelectMunicipality(featuredData);
                    } else {
                      onSelectMunicipality({
                        id: code,
                        name: name,
                        region: feature.properties.meso || 'Território da Bahia',
                        highlighted: false,
                        contractDate: 'Proposta Aberta',
                        schoolsCount: 0,
                        studentsImpacted: 0,
                        teachersTrained: 0,
                        primaryProject: 'alfa-educa',
                        projects: ['alfa-educa', 'robotica-maker'],
                        status: 'Em Expansão',
                        folderTitle: `Dossiê de Parceria Pedagógica — ${name}`,
                        folderCover:
                          'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=600&q=80',
                        videoTitle: `Apresentação de Soluções Educare para ${name}`,
                        videoThumbnail:
                          'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&w=600&q=80',
                        metrics: {
                          satisfaction: '100% Personalizado',
                        },
                      });
                    }
                  }}
                  onMouseEnter={(e) => {
                    const rect = e.currentTarget.getBoundingClientRect();
                    setHoveredMunicipality({
                      id: code,
                      name: name,
                      isFeatured,
                      region: featuredData ? featuredData.region : feature.properties.meso || 'Bahia',
                      projectTitle: featuredData ? featuredData.folderTitle : undefined,
                      students: featuredData ? featuredData.studentsImpacted : undefined,
                      x: rect.x + rect.width / 2,
                      y: rect.y - 12,
                    });
                  }}
                  onMouseLeave={() => setHoveredMunicipality(null)}
                />
              );
            })}

            {/* Glowing Centroids & City Pins */}
            {features
              .filter((f: any) => BAHIA_MUNICIPALITIES_DATA[String(f.properties.codarea)])
              .map((feature: any) => {
                const code = String(feature.properties.codarea);
                const centroid = pathGenerator.centroid(feature);
                if (isNaN(centroid[0]) || isNaN(centroid[1])) return null;

                const isSelected = selectedMunicipalityId === code;

                return (
                  <g
                    key={`pin-${code}`}
                    transform={`translate(${centroid[0]}, ${centroid[1]})`}
                    className="pointer-events-none"
                  >
                    {/* Concentric rings on selection */}
                    {isSelected ? (
                      <>
                        <circle r={14} className="fill-orange-500/30 animate-ping" />
                        <circle r={6} className="fill-orange-500 stroke-white stroke-2 drop-shadow" />
                      </>
                    ) : (
                      <>
                        <circle r={4.5} className="fill-amber-400 stroke-blue-950 stroke-[1.5]" />
                        <circle r={2} className="fill-white" />
                      </>
                    )}
                  </g>
                );
              })}
          </g>
        </svg>
      </div>

      {/* Floating Rich Tooltip */}
      {hoveredMunicipality && (
        <div
          className="fixed pointer-events-none z-50 transform -translate-x-1/2 -translate-y-full mb-3 px-4 py-3 bg-slate-950/95 text-white rounded-2xl shadow-modal border border-slate-700 text-xs backdrop-blur-md transition-all duration-150 min-w-[200px]"
          style={{
            left: `${hoveredMunicipality.x}px`,
            top: `${hoveredMunicipality.y}px`,
          }}
        >
          <div className="flex items-center justify-between gap-2 border-b border-slate-800 pb-1.5 mb-1.5">
            <div className="font-extrabold text-sm text-amber-400 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-orange-500" />
              <span>{hoveredMunicipality.name}</span>
            </div>
            <span className="text-[10px] text-slate-400 font-semibold">{hoveredMunicipality.region}</span>
          </div>

          {hoveredMunicipality.isFeatured ? (
            <div className="space-y-1">
              <div className="flex items-center gap-1.5 text-emerald-400 font-bold">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Rede Parceira Grupo Educare</span>
              </div>
              {hoveredMunicipality.students && (
                <div className="text-slate-300 text-[11px]">
                  Impacto: <strong>{hoveredMunicipality.students.toLocaleString()}</strong> alunos atendidos
                </div>
              )}
              <div className="text-[10px] text-amber-300/90 font-medium pt-1 flex items-center gap-1">
                <span>Toque para ver dossiê e folders</span>
                <ArrowUpRight className="w-3 h-3" />
              </div>
            </div>
          ) : (
            <div className="text-slate-300 text-[11px]">
              <div>Município elegível para novos projetos</div>
              <div className="text-orange-400 font-bold text-[10px] mt-1">
                Toque para simular proposta personalizada
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
