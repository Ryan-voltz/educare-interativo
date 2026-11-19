import React, { useEffect } from 'react';
import { X, MapPin, CheckCircle2 } from 'lucide-react';
import type { MunicipalityCase } from '../data/educareData';
import { sounds } from '../utils/audio';

interface MunicipioPanelProps {
  municipality: MunicipalityCase;
  onClose: () => void;
}

/**
 * Ao tocar em um município, mostra o nome e que a rede é atendida.
 * O número de contratos aparece só por estado, na visão Brasil (pedido do cliente).
 */
export const MunicipioPanel: React.FC<MunicipioPanelProps> = ({ municipality, onClose }) => {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  const close = () => {
    sounds.playTap();
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-3 sm:p-6 bg-blue-950/60 backdrop-blur-sm animate-backdrop"
      onClick={close}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="municipio-titulo"
        className="relative w-full max-w-md bg-white rounded-[2rem] shadow-modal overflow-hidden animate-rise"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="band-deep px-7 pt-7 pb-6">
          <button
            type="button"
            onClick={close}
            autoFocus
            className="absolute top-4 right-4 w-10 h-10 flex items-center justify-center rounded-xl text-blue-100 hover:text-white hover:bg-white/10"
            aria-label="Fechar"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-1.5 text-sm text-blue-100">
            <MapPin className="w-4 h-4 text-amber-400" />
            {municipality.region} · Bahia
          </div>
          <h2 id="municipio-titulo" className="mt-1 text-3xl sm:text-4xl text-white leading-tight pr-10">
            {municipality.name}
          </h2>
        </div>

        <div className="px-7 py-7">
          <div className="flex items-start gap-4">
            <span className="w-14 h-14 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-7 h-7" />
            </span>
            <span>
              <span className="block font-heading font-semibold text-2xl text-blue-950 leading-tight">
                Rede atendida pelo Grupo Educare
              </span>
              <span className="block text-slate-600 mt-1.5 leading-snug">
                A Bahia é o estado com mais contratos do Grupo Educare, com mais de 400 municípios atendidos.
              </span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
