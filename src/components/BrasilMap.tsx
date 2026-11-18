import React, { useMemo, useState, useRef } from 'react';
import * as d3Geo from 'd3-geo';
import brasilGeoJson from '../data/brasil-geo.json';
import { BRASIL_STATES_DATA, type StateCase } from '../data/educareData';
import { ZoomIn, ZoomOut, RotateCcw, MapPin, Sparkles } from 'lucide-react';

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

  const width = 800;
  const height = 700;

  const { pathGenerator } = useMemo(() => {
    const proj = d3Geo.geoMercator();
    proj.fitExtent([[30, 30], [width - 30, height - 30]], brasilGeoJson as any);
    const pathGen = d3Geo.geoPath().projection(proj);
    return { pathGenerator: pathGen };
  }, [width, height]);

  const features = useMemo(() => {
    return (brasilGeoJson as any).features || [];
  }, []);

  const handleZoom = (factor: number) => {
    setZoomLevel((prev) => Math.min(Math.max(prev * factor, 0.8), 4));
  };

  const handleResetZoom = () => {
    setZoomLevel(1);
    setPan({ x: 0, y: 0 });
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

  return (
    <div className="relative w-full h-[620px] lg:h-[700px] bg-gradient-to-b from-sky-50/50 via-white to-slate-100 rounded-3xl border border-slate-200/80 shadow-inner overflow-hidden select-none">
      {/* Map Controls */}
      <div className="absolute top-4 left-4 z-20 flex flex-col gap-2 bg-white/90 backdrop-blur-md p-1.5 rounded-2xl shadow-md border border-slate-200/80">
        <button
          onClick={() => handleZoom(1.25)}
          className="p-2.5 text-slate-700 hover:text-sky-700 hover:bg-sky-50 rounded-xl transition-all duration-200 active:scale-95"
          title="Aumentar Zoom"
        >
          <ZoomIn className="w-5 h-5" />
        </button>
        <button
          onClick={() => handleZoom(0.8)}
          className="p-2.5 text-slate-700 hover:text-sky-700 hover:bg-sky-50 rounded-xl transition-all duration-200 active:scale-95"
          title="Diminuir Zoom"
        >
          <ZoomOut className="w-5 h-5" />
        </button>
        <button
          onClick={handleResetZoom}
          className="p-2.5 text-slate-700 hover:text-sky-700 hover:bg-sky-50 rounded-xl transition-all duration-200 active:scale-95"
          title="Restaurar Visualização"
        >
          <RotateCcw className="w-5 h-5" />
        </button>
      </div>

      {/* Map Badge Status */}
      <div className="absolute top-4 right-4 z-20 hidden sm:flex items-center gap-2 bg-white/95 backdrop-blur-md px-3.5 py-2 rounded-2xl shadow-sm border border-slate-200 text-xs font-semibold text-slate-600">
        <span className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse"></span>
        <span>10 Estados Alcançados no Brasil</span>
      </div>

      <div className="absolute bottom-4 left-4 z-20 flex items-center gap-2 bg-slate-900/80 text-white backdrop-blur-md px-3 py-1.5 rounded-xl text-xs font-medium shadow-lg pointer-events-none">
        <Sparkles className="w-3.5 h-3.5 text-amber-400" />
        <span>Selecione um estado para ver a presença ou clique na Bahia para detalhar os municípios</span>
      </div>

      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="w-full h-full cursor-grab active:cursor-grabbing transition-transform duration-75"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        <g
          transform={`translate(${pan.x}, ${pan.y}) scale(${zoomLevel})`}
          style={{ transformOrigin: 'center center' }}
        >
          {features.map((feature: any) => {
            const sigla = feature.properties.sigla || '';
            const nome = feature.properties.nome || '';
            const stateData = BRASIL_STATES_DATA[sigla];
            const isActive = !!stateData;
            const isSelected = selectedStateSigla === sigla;
            const isBahia = sigla === 'BA';

            const d = pathGenerator(feature);
            if (!d) return null;

            return (
              <path
                key={sigla}
                d={d}
                className={`transition-colors duration-200 ease-out cursor-pointer ${
                  isSelected
                    ? 'fill-amber-500 stroke-amber-700 stroke-[2] drop-shadow-lg'
                    : isBahia
                    ? 'fill-blue-700 hover:fill-blue-600 stroke-amber-300 stroke-[2]'
                    : isActive
                    ? 'fill-sky-600 hover:fill-sky-500 stroke-white stroke-[1]'
                    : 'fill-slate-200/90 hover:fill-slate-300 stroke-white stroke-[0.8]'
                }`}
                onClick={(e) => {
                  e.stopPropagation();
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
                    y: rect.y - 10,
                  });
                }}
                onMouseLeave={() => setHoveredState(null)}
              />
            );
          })}

          {/* State centroid labels for active states */}
          {features
            .filter((f: any) => BRASIL_STATES_DATA[f.properties.sigla])
            .map((feature: any) => {
              const sigla = feature.properties.sigla;
              const centroid = pathGenerator.centroid(feature);
              if (isNaN(centroid[0]) || isNaN(centroid[1])) return null;

              return (
                <g
                  key={`label-${sigla}`}
                  transform={`translate(${centroid[0]}, ${centroid[1]})`}
                  className="pointer-events-none"
                >
                  <circle
                    r={sigla === 'BA' ? 14 : 11}
                    className={`${
                      sigla === 'BA'
                        ? 'fill-amber-400 stroke-blue-900 stroke-2'
                        : 'fill-white stroke-sky-700 stroke-[1.5]'
                    } drop-shadow`}
                  />
                  <text
                    textAnchor="middle"
                    dy="3.5"
                    className={`font-black ${
                      sigla === 'BA' ? 'text-[11px] fill-blue-950' : 'text-[9px] fill-sky-900'
                    }`}
                  >
                    {sigla}
                  </text>
                </g>
              );
            })}
        </g>
      </svg>

      {hoveredState && (
        <div
          className="fixed pointer-events-none z-50 transform -translate-x-1/2 -translate-y-full mb-3 px-3.5 py-2 bg-slate-900/95 text-white rounded-xl shadow-xl border border-slate-700 text-xs backdrop-blur-md transition-all duration-150"
          style={{
            left: `${hoveredState.x}px`,
            top: `${hoveredState.y}px`,
          }}
        >
          <div className="font-bold text-sm text-sky-300 flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-amber-400" />
            {hoveredState.nome} ({hoveredState.sigla})
          </div>
          {hoveredState.data ? (
            <div className="mt-1 space-y-0.5">
              <div className="text-emerald-400 font-semibold">
                {hoveredState.data.municipiosAtendidos} municípios atendidos
              </div>
              <div className="text-slate-300 text-[11px]">
                {hoveredState.data.alunosImpactados.toLocaleString()} alunos impactados
              </div>
              {hoveredState.sigla === 'BA' && (
                <div className="text-amber-300 font-bold text-[11px] mt-1">
                  ⭐ Clique para ver o mapa detalhado da Bahia
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
