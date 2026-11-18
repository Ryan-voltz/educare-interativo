import React, { useMemo, useState, useRef } from 'react';
import * as d3Geo from 'd3-geo';
import bahiaGeoJson from '../data/bahia-geo.json';
import { BAHIA_MUNICIPALITIES_DATA, type MunicipalityCase } from '../data/educareData';
import { ZoomIn, ZoomOut, RotateCcw, MapPin, Sparkles, CheckCircle2 } from 'lucide-react';

interface BahiaMapProps {
  selectedMunicipalityId: string | null;
  onSelectMunicipality: (municipality: MunicipalityCase | null) => void;
  searchTerm: string;
}

export const BahiaMap: React.FC<BahiaMapProps> = ({
  selectedMunicipalityId,
  onSelectMunicipality,
  searchTerm,
}) => {
  const [hoveredMunicipality, setHoveredMunicipality] = useState<{
    id: string;
    name: string;
    isFeatured: boolean;
    x: number;
    y: number;
  } | null>(null);

  const [zoomLevel, setZoomLevel] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const dragStartRef = useRef<{ x: number; y: number } | null>(null);

  const width = 800;
  const height = 700;

  // Projection setup for Bahia
  const { pathGenerator } = useMemo(() => {
    const proj = d3Geo.geoMercator();
    proj.fitExtent([[40, 40], [width - 40, height - 40]], bahiaGeoJson as any);
    const pathGen = d3Geo.geoPath().projection(proj);
    return { pathGenerator: pathGen };
  }, [width, height]);

  // Features list
  const features = useMemo(() => {
    return (bahiaGeoJson as any).features || [];
  }, []);

  const handleZoom = (factor: number) => {
    setZoomLevel((prev) => Math.min(Math.max(prev * factor, 0.8), 5));
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

  // Touch handlers for tablets/phones at Undime
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
        <span className="w-3 h-3 rounded-full bg-blue-600 animate-pulse"></span>
        <span>42 Municípios Parceiros Ativos</span>
      </div>

      {/* Instruction pill for touch */}
      <div className="absolute bottom-4 left-4 z-20 flex items-center gap-2 bg-slate-900/80 text-white backdrop-blur-md px-3 py-1.5 rounded-xl text-xs font-medium shadow-lg pointer-events-none">
        <Sparkles className="w-3.5 h-3.5 text-amber-400" />
        <span>Toque em qualquer município destacado em azul para abrir os materiais</span>
      </div>

      {/* SVG Canvas */}
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="w-full h-full cursor-grab active:cursor-grabbing transition-transform duration-75"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
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

            // Highlight matches from search
            const matchesSearch =
              searchTerm.trim().length > 1 &&
              name.toLowerCase().includes(searchTerm.toLowerCase());

            const d = pathGenerator(feature);
            if (!d) return null;

            return (
              <path
                key={code}
                d={d}
                className={`transition-colors duration-200 ease-out cursor-pointer ${
                  isSelected
                    ? 'fill-amber-500 stroke-amber-700 stroke-[2] drop-shadow-md'
                    : matchesSearch
                    ? 'fill-orange-400 stroke-orange-600 stroke-[2] animate-bounce'
                    : isFeatured
                    ? 'fill-blue-600 hover:fill-blue-500 stroke-white stroke-[0.8] hover:stroke-amber-400 hover:stroke-[1.5]'
                    : 'fill-slate-200/90 hover:fill-slate-300 stroke-white stroke-[0.5]'
                }`}
                onClick={(e) => {
                  e.stopPropagation();
                  if (featuredData) {
                    onSelectMunicipality(featuredData);
                  } else {
                    // Click on unpartnered city allows prospect/lead proposal
                    onSelectMunicipality({
                      id: code,
                      name: name,
                      region: feature.properties.meso || 'Bahia',
                      highlighted: false,
                      contractDate: 'Proposta Aberta para Rede',
                      schoolsCount: 0,
                      studentsImpacted: 0,
                      teachersTrained: 0,
                      primaryProject: 'alfa-educa',
                      projects: ['alfa-educa', 'robotica-maker'],
                      status: 'Em Expansão',
                      folderTitle: `Proposta de Parceria Pedagógica — ${name}`,
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
                    x: rect.x + rect.width / 2,
                    y: rect.y - 10,
                  });
                }}
                onMouseLeave={() => setHoveredMunicipality(null)}
              />
            );
          })}

          {/* Centroid pins for key highlighted cities */}
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
                  <circle
                    r={isSelected ? 6 : 3.5}
                    className={`${
                      isSelected
                        ? 'fill-amber-400 stroke-white stroke-2'
                        : 'fill-white stroke-blue-700 stroke-[1.5]'
                    }`}
                  />
                  {isSelected && (
                    <circle
                      r={12}
                      className="fill-none stroke-amber-400 stroke-2 animate-ping"
                    />
                  )}
                </g>
              );
            })}
        </g>
      </svg>

      {/* Floating Tooltip */}
      {hoveredMunicipality && (
        <div
          className="fixed pointer-events-none z-50 transform -translate-x-1/2 -translate-y-full mb-3 px-3.5 py-2 bg-slate-900/95 text-white rounded-xl shadow-xl border border-slate-700 text-xs backdrop-blur-md transition-all duration-150"
          style={{
            left: `${hoveredMunicipality.x}px`,
            top: `${hoveredMunicipality.y}px`,
          }}
        >
          <div className="font-bold text-sm text-sky-300 flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-amber-400" />
            {hoveredMunicipality.name}
          </div>
          {hoveredMunicipality.isFeatured ? (
            <div className="flex items-center gap-1.5 text-emerald-400 font-semibold mt-0.5">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Rede Atendida pelo Grupo Educare</span>
            </div>
          ) : (
            <div className="text-slate-300 text-[11px] mt-0.5">
              Clique para simular proposta personalizada
            </div>
          )}
        </div>
      )}
    </div>
  );
};
