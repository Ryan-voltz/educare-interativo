import React, { useMemo, useState, useRef, useCallback } from 'react';
import * as d3Geo from 'd3-geo';
import brasilGeoRaw from '../data/brasil-geo.json';
import { rewindForD3 } from '../utils/geo';

const brasilGeoJson = rewindForD3(brasilGeoRaw as any);
import {
  BRASIL_STATES_DATA,
  CONTRATOS_ESTADOS_ESTIMADOS,
  TOTAL_CONTRATOS_BRASIL,
  type StateCase,
} from '../data/educareData';
import { sounds } from '../utils/audio';
import { ZoomIn, ZoomOut, RotateCcw, MapPin, ArrowRight } from 'lucide-react';

interface BrasilMapProps {
  selectedStateSigla: string | null;
  onSelectState: (state: StateCase) => void;
  onDrillDownBahia: () => void;
}

export const BrasilMap: React.FC<BrasilMapProps> = ({
  selectedStateSigla,
  onSelectState,
  onDrillDownBahia,
}) => {
  const [hoveredState, setHoveredState] = useState<{
    sigla: string;
    nome: string;
    data?: StateCase;
    x: number;
    y: number;
  } | null>(null);

  const [zoomLevel, setZoomLevel] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);

  const dragStartRef = useRef<{ x: number; y: number } | null>(null);
  const rafRef = useRef<number | null>(null);

  const width = 800;
  const height = 700;

  const { pathGenerator } = useMemo(() => {
    const proj = d3Geo.geoMercator();
    proj.fitExtent([[30, 30], [width - 30, height - 30]], brasilGeoJson as any);
    const pathGen = d3Geo.geoPath().projection(proj);
    return { pathGenerator: pathGen };
  }, [width, height]);

  // Pre-computed states for 60fps performance
  const precomputedFeatures = useMemo(() => {
    const rawFeatures = (brasilGeoJson as any).features || [];
    return rawFeatures.map((f: any) => {
      const sigla = f.properties.sigla || '';
      const nome = f.properties.nome || '';
      const pathD = pathGenerator(f) || '';
      const centroid = pathGenerator.centroid(f);
      const isValid = !isNaN(centroid[0]) && !isNaN(centroid[1]);

      return {
        sigla,
        nome,
        pathD,
        centroid: isValid ? centroid : null,
      };
    });
  }, [pathGenerator]);

  const activeCentroids = useMemo(() => {
    return precomputedFeatures
      .filter((f) => f.centroid && BRASIL_STATES_DATA[f.sigla])
      .map((f) => ({
        sigla: f.sigla,
        centroid: f.centroid as [number, number],
      }));
  }, [precomputedFeatures]);

  const handleZoom = useCallback((factor: number) => {
    sounds.playTap();
    setZoomLevel((prev) => Math.min(Math.max(prev * factor, 0.8), 4));
  }, []);

  const handleResetZoom = useCallback(() => {
    sounds.playTap();
    setZoomLevel(1);
    setPan({ x: 0, y: 0 });
  }, []);

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

  return (
    <div className="relative w-full h-full bg-white rounded-3xl border border-slate-200 shadow-elevated overflow-hidden select-none flex flex-col">
      {/* Map Controls */}
      <div className="absolute top-4 left-4 z-20 flex flex-col gap-1.5 bg-white/95 backdrop-blur-md p-1.5 rounded-2xl shadow-md border border-slate-200">
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

      {/* Map Badge Status */}
      <div className="absolute top-4 right-4 z-20 hidden sm:flex items-center gap-2 bg-white px-4 py-2 rounded-2xl shadow-elevated border border-slate-200 text-sm font-semibold text-blue-950">
        <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
        {Object.keys(BRASIL_STATES_DATA).length} estados · cerca de {TOTAL_CONTRATOS_BRASIL.toLocaleString('pt-BR')} contratos
      </div>

      {/* Bottom Hint */}
      <div className="absolute bottom-4 left-4 z-20 flex items-center gap-2 bg-blue-950 text-white px-4 py-2.5 rounded-2xl text-sm shadow-elevated pointer-events-none">
        <MapPin className="w-4 h-4 text-amber-400" />
        <span>Toque em um estado para ver os contratos. Na Bahia, abra os municípios.</span>
      </div>

      {/* Interactive SVG */}
      <div className="flex-1 min-h-0 w-full relative cursor-grab active:cursor-grabbing">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full h-full"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        >
          <g
            transform={`translate(${pan.x}, ${pan.y}) scale(${zoomLevel})`}
            style={{ transformOrigin: 'center center' }}
          >
            {precomputedFeatures.map((item) => {
              const { sigla, nome, pathD } = item;
              if (!pathD) return null;

              const stateData = BRASIL_STATES_DATA[sigla];
              const isActive = !!stateData;
              const isSelected = selectedStateSigla === sigla;
              const isBahia = sigla === 'BA';

              let fillColor = 'fill-slate-200/90 hover:fill-slate-300';
              let strokeColor = 'stroke-white';
              let strokeWidth = '0.8';

              if (isSelected) {
                fillColor = 'fill-orange-500';
                strokeColor = 'stroke-orange-950';
                strokeWidth = '2.5';
              } else if (isBahia) {
                fillColor = 'fill-blue-800 hover:fill-blue-700';
                strokeColor = 'stroke-amber-400';
                strokeWidth = '2';
              } else if (isActive) {
                fillColor = 'fill-sky-700 hover:fill-sky-600';
                strokeColor = 'stroke-white';
                strokeWidth = '1.2';
              }

              return (
                <path
                  key={sigla}
                  d={pathD}
                  className={`${fillColor} ${strokeColor} stroke-[${strokeWidth}] transition-colors duration-150 ease-out cursor-pointer`}
                  onClick={(e) => {
                    e.stopPropagation();
                    sounds.playTap();
                    if (isBahia) {
                      onDrillDownBahia();
                    } else if (stateData) {
                      onSelectState(stateData);
                    }
                  }}
                  onMouseEnter={(e) => {
                    const rect = e.currentTarget.getBoundingClientRect();
                    setHoveredState({
                      sigla,
                      nome,
                      data: stateData,
                      x: rect.x + rect.width / 2,
                      y: rect.y - 12,
                    });
                  }}
                  onMouseLeave={() => setHoveredState(null)}
                />
              );
            })}

            {/* State Badges on centroids */}
            {activeCentroids.map((item) => {
              const isBahia = item.sigla === 'BA';

              return (
                <g
                  key={`label-${item.sigla}`}
                  transform={`translate(${item.centroid[0]}, ${item.centroid[1]})`}
                  className="pointer-events-none"
                >
                  <circle
                    r={isBahia ? 14 : 11}
                    className={`${
 isBahia
 ? 'fill-amber-400 stroke-blue-950 stroke-2'
 : 'fill-white stroke-blue-900 stroke-[1.5]'
 } drop-shadow`}
                  />
                  <text
                    textAnchor="middle"
                    dy="3.5"
                    className={`font-semibold ${
 isBahia ? 'text-[11px] fill-blue-950' : 'text-[9px] fill-blue-900'
 }`}
                  >
                    {item.sigla}
                  </text>
                </g>
              );
            })}
          </g>
        </svg>
      </div>

      {hoveredState && (
        <div
          className="fixed pointer-events-none z-50 -translate-x-1/2 -translate-y-full px-4 py-3 bg-blue-950 text-white rounded-2xl shadow-modal text-xs"
          style={{
            left: `${hoveredState.x}px`,
            top: `${hoveredState.y}px`,
          }}
        >
          <div className="font-semibold text-sm text-sky-300 flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-amber-400" />
            <span>{hoveredState.nome} ({hoveredState.sigla})</span>
          </div>
          {hoveredState.data ? (
            <div className="mt-1 space-y-0.5">
              <div className="text-emerald-300 font-semibold text-[13px] tabular-nums">
                {CONTRATOS_ESTADOS_ESTIMADOS ? 'cerca de ' : ''}
                {hoveredState.data.contratos.toLocaleString('pt-BR')} contratos
              </div>
              {hoveredState.sigla === 'BA' && (
                <div className="text-amber-300 font-semibold text-[11px] mt-1 flex items-center gap-1">
                  <span>Toque para explorar os 42 municípios da Bahia</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              )}
            </div>
          ) : (
            <div className="text-slate-400 text-[11px] mt-0.5">
              Região em mapeamento para novos projetos
            </div>
          )}
        </div>
      )}
    </div>
  );
};
