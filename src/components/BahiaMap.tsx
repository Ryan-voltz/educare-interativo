import React, { useMemo, useState, useRef, useCallback } from 'react';
import * as d3Geo from 'd3-geo';
import bahiaGeoRaw from '../data/bahia-geo.json';
import { rewindForD3 } from '../utils/geo';

const bahiaGeoJson = rewindForD3(bahiaGeoRaw as any);
import { BAHIA_MUNICIPALITIES_DATA, type MunicipalityCase } from '../data/educareData';
import { sounds } from '../utils/audio';
import {
  ZoomIn,
  ZoomOut,
  RotateCcw,
  MapPin,
  CheckCircle2,
  ArrowUpRight,
} from 'lucide-react';

interface BahiaMapProps {
  selectedMunicipalityId: string | null;
  onSelectMunicipality: (municipality: MunicipalityCase | null) => void;
  searchTerm: string;
}

const REGIONAL_PRESETS: { name: string; filter: string; center?: [number, number]; zoom?: number }[] = [
  { name: 'Toda a Bahia', filter: 'all', zoom: 1, center: [0, 0] },
  { name: 'Metropolitana (RMS)', filter: 'Metropolitana', zoom: 1.85, center: [-150, -40] },
  { name: 'Portal do Sertão', filter: 'Portal do Sertão', zoom: 1.7, center: [-80, -20] },
  { name: 'Sul e Extremo Sul', filter: 'Sul', zoom: 1.65, center: [-50, -190] },
  { name: 'Oeste Baiano', filter: 'Oeste', zoom: 1.55, center: [140, 20] },
  { name: 'São Francisco', filter: 'Vale do São Francisco', zoom: 1.65, center: [-30, 160] },
  { name: 'Sudoeste', filter: 'Sudoeste', zoom: 1.65, center: [10, -120] },
  { name: 'Recôncavo', filter: 'Recôncavo', zoom: 1.8, center: [-90, -30] },
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
    students?: number;
    contractDate?: string;
    x: number;
    y: number;
  } | null>(null);

  const [zoomLevel, setZoomLevel] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [activeRegion, setActiveRegion] = useState('all');
  const [isDragging, setIsDragging] = useState(false);

  const dragStartRef = useRef<{ x: number; y: number } | null>(null);
  const rafRef = useRef<number | null>(null);

  const width = 850;
  const height = 740;

  // 1. One-time Projection & Path Generator
  const { pathGenerator } = useMemo(() => {
    const proj = d3Geo.geoMercator();
    proj.fitExtent([[35, 35], [width - 35, height - 35]], bahiaGeoJson as any);
    const pathGen = d3Geo.geoPath().projection(proj);
    return { pathGenerator: pathGen };
  }, [width, height]);

  // 2. High-performance Pre-computation: Generate all 417 SVG path strings and centroids ONCE
  const precomputedFeatures = useMemo(() => {
    const rawFeatures = (bahiaGeoJson as any).features || [];
    return rawFeatures.map((f: any) => {
      const code = String(f.properties.codarea);
      const name = f.properties.name || '';
      const meso = f.properties.meso || '';
      const pathD = pathGenerator(f) || '';
      const centroid = pathGenerator.centroid(f);
      const isValidCentroid = !isNaN(centroid[0]) && !isNaN(centroid[1]);

      return {
        code,
        name,
        meso,
        pathD,
        centroid: isValidCentroid ? centroid : null,
      };
    });
  }, [pathGenerator]);

  // Centroids for partner cities only (for instant rendering)
  const partnerCentroids = useMemo(() => {
    return precomputedFeatures
      .filter((f) => f.centroid && BAHIA_MUNICIPALITIES_DATA[f.code])
      .map((f) => ({
        code: f.code,
        name: f.name,
        centroid: f.centroid as [number, number],
      }));
  }, [precomputedFeatures]);

  const handleZoom = useCallback((factor: number) => {
    sounds.playTap();
    setZoomLevel((prev) => Math.min(Math.max(prev * factor, 0.8), 5));
  }, []);

  const handleResetZoom = useCallback(() => {
    sounds.playTap();
    setZoomLevel(1);
    setPan({ x: 0, y: 0 });
    setActiveRegion('all');
  }, []);

  const handleSelectRegion = useCallback((preset: typeof REGIONAL_PRESETS[0]) => {
    sounds.playTap();
    setActiveRegion(preset.filter);
    if (preset.zoom && preset.center) {
      setZoomLevel(preset.zoom);
      setPan({ x: preset.center[0], y: preset.center[1] });
    } else {
      setZoomLevel(1);
      setPan({ x: 0, y: 0 });
    }
  }, []);

  // Smooth Throttled Drag Handlers with RequestAnimationFrame
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    dragStartRef.current = { x: e.clientX - pan.x, y: e.clientY - pan.y };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging && dragStartRef.current) {
      const clientX = e.clientX;
      const clientY = e.clientY;
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(() => {
        if (!dragStartRef.current) return;
        setPan({
          x: clientX - dragStartRef.current.x,
          y: clientY - dragStartRef.current.y,
        });
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
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
      const touchX = e.touches[0].clientX;
      const touchY = e.touches[0].clientY;
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(() => {
        if (!dragStartRef.current) return;
        setPan({
          x: touchX - dragStartRef.current.x,
          y: touchY - dragStartRef.current.y,
        });
      });
    }
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
  };

  const legend = [
    { label: 'Rede parceira', swatch: 'bg-blue-600' },
    { label: 'Selecionado', swatch: 'bg-amber-400 ring-1 ring-blue-950' },
    { label: 'Resultado da busca', swatch: 'bg-amber-300' },
    { label: 'Demais municípios', swatch: 'bg-slate-200' },
  ];

  return (
    <div className="relative w-full h-[520px] sm:h-[620px] lg:h-[760px] bg-white rounded-3xl border border-slate-200 shadow-elevated overflow-hidden select-none flex flex-col">
      {/* Oceano: faixa leste em azul bem claro, orienta a leitura geográfica */}
      <div className="absolute right-0 top-0 bottom-0 w-[30%] bg-gradient-to-l from-sky-100 to-transparent pointer-events-none" />
      <div className="absolute right-5 top-1/2 -translate-y-1/2 rotate-90 origin-center text-xs tracking-[0.3em] uppercase text-sky-700/50 pointer-events-none">
        Oceano Atlântico
      </div>

      {/* Regiões */}
      <div className="relative z-20 shrink-0 px-4 pt-4 pb-2 flex items-center gap-1.5 overflow-x-auto no-scrollbar" role="group" aria-label="Aproximar uma região">
        {REGIONAL_PRESETS.map((preset) => {
          const active = activeRegion === preset.filter;
          return (
            <button
              key={preset.name}
              aria-pressed={active}
              onClick={() => handleSelectRegion(preset)}
              className={`h-9 px-3.5 rounded-full text-[13px] font-medium shrink-0 transition-colors ${
                active
                  ? 'bg-blue-950 text-white'
                  : 'bg-white text-slate-700 border border-slate-200 hover:border-blue-300 hover:text-blue-950'
              }`}
            >
              {preset.name}
            </button>
          );
        })}
      </div>

      {/* Zoom */}
      <div className="absolute top-[4.25rem] left-4 z-20 flex flex-col bg-white rounded-2xl shadow-elevated border border-slate-200 overflow-hidden">
        {[
          { onClick: () => handleZoom(1.3), label: 'Aproximar', Icon: ZoomIn },
          { onClick: () => handleZoom(0.75), label: 'Afastar', Icon: ZoomOut },
          { onClick: handleResetZoom, label: 'Ver a Bahia inteira', Icon: RotateCcw },
        ].map(({ onClick, label, Icon }, i) => (
          <button
            key={label}
            onClick={onClick}
            title={label}
            aria-label={label}
            className={`w-11 h-11 flex items-center justify-center text-slate-600 hover:text-blue-950 hover:bg-blue-50 transition-colors ${i > 0 ? 'border-t border-slate-200' : ''}`}
          >
            <Icon className="w-[18px] h-[18px]" />
          </button>
        ))}
      </div>

      {/* Legenda */}
      <div className="absolute bottom-4 left-4 z-20 bg-white/95 rounded-2xl border border-slate-200 shadow-elevated px-4 py-3">
        <div className="text-[13px] font-semibold text-blue-950 mb-2">Legenda</div>
        <ul className="grid grid-cols-2 gap-x-5 gap-y-1.5">
          {legend.map((l) => (
            <li key={l.label} className="flex items-center gap-2 text-xs text-slate-700">
              <span className={`w-3.5 h-3.5 rounded ${l.swatch}`} />
              {l.label}
            </li>
          ))}
        </ul>
      </div>

      <div className="absolute bottom-4 right-4 z-20 hidden md:flex items-center gap-2 bg-blue-950 text-white rounded-2xl px-4 py-2.5 text-sm shadow-elevated pointer-events-none">
        <MapPin className="w-4 h-4 text-amber-400" />
        Toque em um município para ver os contratos
      </div>

      <div className={`flex-1 min-h-0 w-full relative ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}>
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full h-full touch-none"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          role="img"
          aria-label="Mapa dos municípios da Bahia com as redes parceiras do Grupo Educare"
        >
          <defs>
            <filter id="cityGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="1" stdDeviation="1.5" floodColor="#0E2A6B" floodOpacity="0.25" />
            </filter>
            <filter id="selectedGlow" x="-40%" y="-40%" width="180%" height="180%">
              <feDropShadow dx="0" dy="3" stdDeviation="4" floodColor="#0E2A6B" floodOpacity="0.4" />
            </filter>
          </defs>

          <g
            transform={`translate(${pan.x}, ${pan.y}) scale(${zoomLevel})`}
            style={{ transformOrigin: 'center center', transition: isDragging ? 'none' : 'transform 0.45s cubic-bezier(0.16, 1, 0.3, 1)' }}
          >
            {/* Render Pre-computed Paths (Instant 60fps) */}
            {precomputedFeatures.map((item) => {
              const { code, name, meso, pathD } = item;
              if (!pathD) return null;

              const featuredData = BAHIA_MUNICIPALITIES_DATA[code];
              const isFeatured = !!featuredData;
              const isSelected = selectedMunicipalityId === code;

              const matchesRegion =
                activeRegion === 'all' ||
                (featuredData && featuredData.region.toLowerCase().includes(activeRegion.toLowerCase()));

              const matchesSearch =
                searchTerm.trim().length > 1 &&
                name.toLowerCase().includes(searchTerm.toLowerCase());

              let fillColor = 'fill-slate-200 hover:fill-blue-100';
              let strokeColor = 'stroke-white';
              let strokeWidth = 0.5;
              let filter = '';

              if (isSelected) {
                fillColor = 'fill-amber-400';
                strokeColor = 'stroke-blue-950';
                strokeWidth = 2;
                filter = 'url(#selectedGlow)';
              } else if (matchesSearch) {
                fillColor = 'fill-amber-300';
                strokeColor = 'stroke-amber-800';
                strokeWidth = 1.5;
              } else if (isFeatured) {
                if (matchesRegion) {
                  fillColor = 'fill-blue-600 hover:fill-blue-500';
                  strokeColor = 'stroke-white';
                  strokeWidth = 0.9;
                  filter = 'url(#cityGlow)';
                } else {
                  fillColor = 'fill-blue-300 hover:fill-blue-400';
                  strokeColor = 'stroke-white';
                  strokeWidth = 0.6;
                }
              }

              return (
                <path
                  key={code}
                  d={pathD}
                  filter={filter || undefined}
                  strokeWidth={strokeWidth}
                  vectorEffect="non-scaling-stroke"
                  className={`${fillColor} ${strokeColor} transition-colors duration-150 ease-out cursor-pointer`}
                  onClick={(e) => {
                    e.stopPropagation();
                    sounds.playTap();
                    if (featuredData) {
                      onSelectMunicipality(featuredData);
                    } else {
                      onSelectMunicipality({
                        id: code,
                        name: name,
                        region: meso || 'Território da Bahia',
                        highlighted: false,
                        contractDate: 'Proposta Aberta para Rede',
                        schoolsCount: 0,
                        studentsImpacted: 0,
                        teachersTrained: 0,
                        primaryProject: 'alfa-educa',
                        projects: ['alfa-educa', 'robotica-maker'],
                        status: 'Em Expansão',
                        folderTitle: `Dossiê Pedagógico — ${name}`,
                        folderCover:
                          'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=600&q=80',
                        videoTitle: `Apresentação Educare para ${name}`,
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
                      name,
                      isFeatured,
                      region: featuredData ? featuredData.region : meso || 'Bahia',
                      students: featuredData ? featuredData.studentsImpacted : undefined,
                      contractDate: featuredData ? featuredData.contractDate : undefined,
                      x: rect.x + rect.width / 2,
                      y: rect.y - 12,
                    });
                  }}
                  onMouseLeave={() => setHoveredMunicipality(null)}
                />
              );
            })}

            {partnerCentroids.map((item) => {
              const isSelected = selectedMunicipalityId === item.code;
              const r = 1 / Math.sqrt(zoomLevel);
              return (
                <g
                  key={`pin-${item.code}`}
                  transform={`translate(${item.centroid[0]}, ${item.centroid[1]}) scale(${r})`}
                  className="pointer-events-none"
                >
                  {isSelected ? (
                    <>
                      <circle r={14} className="fill-amber-400/40 animate-ping" />
                      <circle r={6.5} className="fill-blue-950 stroke-white" strokeWidth={2} />
                    </>
                  ) : (
                    <>
                      <circle r={4} className="fill-white stroke-blue-950" strokeWidth={1.5} />
                    </>
                  )}
                </g>
              );
            })}
          </g>
        </svg>
      </div>

      {hoveredMunicipality && (
        <div
          className="fixed pointer-events-none z-50 -translate-x-1/2 -translate-y-full px-4 py-3 bg-blue-950 text-white rounded-2xl shadow-modal text-sm min-w-[220px]"
          style={{ left: `${hoveredMunicipality.x}px`, top: `${hoveredMunicipality.y}px` }}
        >
          <div className="font-heading font-semibold text-base leading-tight">{hoveredMunicipality.name}</div>
          <div className="text-xs text-blue-200 mt-0.5">{hoveredMunicipality.region}</div>
          {hoveredMunicipality.isFeatured ? (
            <div className="mt-2 pt-2 border-t border-white/15 space-y-1">
              <div className="flex items-center gap-1.5 text-emerald-300 font-medium text-[13px]">
                <CheckCircle2 className="w-4 h-4" />
                Rede parceira · {hoveredMunicipality.contractDate || 'ativa'}
              </div>
              {hoveredMunicipality.students ? (
                <div className="text-[13px] text-blue-100 tabular-nums">
                  {hoveredMunicipality.students.toLocaleString('pt-BR')} alunos atendidos
                </div>
              ) : null}
              <div className="text-xs text-amber-300 flex items-center gap-1">
                Toque para ver os contratos
                <ArrowUpRight className="w-3.5 h-3.5" />
              </div>
            </div>
          ) : (
            <div className="mt-2 pt-2 border-t border-white/15 text-[13px] text-blue-100">
              Rede elegível para novas soluções.
              <div className="text-amber-300 text-xs mt-1">Toque para saber como atender sua rede</div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
