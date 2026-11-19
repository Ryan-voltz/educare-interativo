import React, { useMemo, useState, useRef, useCallback } from 'react';
import * as d3Geo from 'd3-geo';
import bahiaGeoRaw from '../data/bahia-geo.json';
import { rewindForD3 } from '../utils/geo';

const bahiaGeoJson = rewindForD3(bahiaGeoRaw as any);
import type { MunicipalityCase } from '../data/educareData';
import { municipioCase, nomeRegiao, MUNICIPIOS_MARCADOS_BAHIA } from '../data/municipiosBahia';
import { sounds } from '../utils/audio';
import {
  ZoomIn,
  ZoomOut,
  RotateCcw,
  MapPin,
} from 'lucide-react';

interface BahiaMapProps {
  selectedMunicipalityId: string | null;
  onSelectMunicipality: (municipality: MunicipalityCase | null) => void;
  searchTerm: string;
}

// Atalhos por mesorregião do IBGE: o zoom e o centro são calculados a partir do mapa
const REGIONAL_PRESETS: { name: string; filter: string }[] = [
  { name: 'Toda a Bahia', filter: 'all' },
  { name: 'Metropolitana', filter: 'Metropolitana de Salvador' },
  { name: 'Nordeste', filter: 'Nordeste Baiano' },
  { name: 'Centro-Norte', filter: 'Centro Norte Baiano' },
  { name: 'Centro-Sul', filter: 'Centro Sul Baiano' },
  { name: 'Sul', filter: 'Sul Baiano' },
  { name: 'Oeste', filter: 'Extremo Oeste Baiano' },
  { name: 'São Francisco', filter: 'Vale São-Franciscano da Bahia' },
];

export const BahiaMap: React.FC<BahiaMapProps> = ({
  selectedMunicipalityId,
  onSelectMunicipality,
  searchTerm,
}) => {
  const [hoveredMunicipality, setHoveredMunicipality] = useState<{
    id: string;
    name: string;
    region: string;
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

  // Zoom e centro de cada mesorregião, a partir dos limites dos municípios
  const regionViews = useMemo(() => {
    const views: Record<string, { zoom: number; pan: { x: number; y: number } }> = {};
    const bounds: Record<string, [[number, number], [number, number]]> = {};
    (bahiaGeoJson as any).features.forEach((f: any) => {
      const meso = f.properties.meso || '';
      const [[x0, y0], [x1, y1]] = pathGenerator.bounds(f);
      const b = bounds[meso];
      bounds[meso] = b
        ? [[Math.min(b[0][0], x0), Math.min(b[0][1], y0)], [Math.max(b[1][0], x1), Math.max(b[1][1], y1)]]
        : [[x0, y0], [x1, y1]];
    });
    Object.entries(bounds).forEach(([meso, [[x0, y0], [x1, y1]]]) => {
      const zoom = Math.min(Math.max(0.85 * Math.min(width / (x1 - x0), height / (y1 - y0)), 1.2), 3.5);
      const mx = (x0 + x1) / 2;
      const my = (y0 + y1) / 2;
      views[meso] = { zoom, pan: { x: -zoom * (mx - width / 2), y: -zoom * (my - height / 2) } };
    });
    return views;
  }, [pathGenerator]);

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
    const view = regionViews[preset.filter];
    if (view) {
      setZoomLevel(view.zoom);
      setPan(view.pan);
    } else {
      setZoomLevel(1);
      setPan({ x: 0, y: 0 });
    }
  }, [regionViews]);

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

  // Camada dos 417 municípios: memorizada para não redesenhar a cada hover
  const pathLayer = useMemo(
    () => (
      <>
            {precomputedFeatures.map((item) => {
              const { code, name, meso, pathD } = item;
              if (!pathD) return null;

              const isSelected = selectedMunicipalityId === code;
              const matchesRegion = activeRegion === 'all' || meso === activeRegion;

              const matchesSearch =
                searchTerm.trim().length > 1 &&
                name.toLowerCase().includes(searchTerm.toLowerCase());

              // ~320 municípios marcados (escolha aleatória fixa, pedido do cliente)
              const isMarked = MUNICIPIOS_MARCADOS_BAHIA.has(code);
              let fillColor = isMarked
                ? matchesRegion
                  ? 'fill-blue-600 hover:fill-blue-500'
                  : 'fill-blue-200 hover:fill-blue-300'
                : matchesRegion
                  ? 'fill-slate-200 hover:fill-slate-300'
                  : 'fill-slate-100 hover:fill-slate-200';
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
                    onSelectMunicipality(municipioCase({ id: code, name, region: nomeRegiao(meso) }));
                  }}
                  onMouseEnter={(e) => {
                    const rect = e.currentTarget.getBoundingClientRect();
                    setHoveredMunicipality({
                      id: code,
                      name,
                      region: nomeRegiao(meso),
                      x: rect.x + rect.width / 2,
                      y: rect.y - 12,
                    });
                  }}
                  onMouseLeave={() => setHoveredMunicipality(null)}
                />
              );
            })}

      </>
    ),
    [precomputedFeatures, selectedMunicipalityId, activeRegion, searchTerm, onSelectMunicipality],
  );

  const legend = [
    { label: 'Município atendido', swatch: 'bg-blue-600' },
    { label: 'Selecionado', swatch: 'bg-amber-400 ring-1 ring-blue-950' },
    { label: 'Resultado da busca', swatch: 'bg-amber-300' },
    { label: 'Demais municípios', swatch: 'bg-slate-200' },
  ];

  return (
    <div className="relative w-full h-full bg-white rounded-3xl border border-slate-200 shadow-elevated overflow-hidden select-none flex flex-col">
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

      <div className="absolute bottom-4 right-4 z-20 hidden 2xl:flex items-center gap-2 bg-blue-950 text-white rounded-2xl px-4 py-2.5 text-sm shadow-elevated pointer-events-none">
        <MapPin className="w-4 h-4 text-amber-400" />
        Mais de 300 municípios baianos atendidos
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
          aria-label="Mapa dos municípios da Bahia"
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
            {pathLayer}
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
          <div className="mt-2 pt-2 border-t border-white/15 flex items-center gap-1.5 text-amber-300 font-medium text-[13px]">
            <MapPin className="w-4 h-4" />
            Toque para ver detalhes
          </div>
        </div>
      )}
    </div>
  );
};
