import React, { useEffect } from 'react';
import { X, ArrowRight, MapPin } from 'lucide-react';
import { CONTRATOS_ESTADOS_ESTIMADOS, type StateCase } from '../data/educareData';

interface StateModalProps {
  state: StateCase | null;
  onClose: () => void;
  onDrillDownBahia: () => void;
}

export const StateModal: React.FC<StateModalProps> = ({ state, onClose, onDrillDownBahia }) => {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  if (!state) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-3 sm:p-6 bg-blue-950/60 backdrop-blur-sm animate-backdrop"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="estado-titulo"
        className="relative w-full max-w-md bg-white rounded-[2rem] shadow-modal overflow-hidden animate-rise"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="band-deep px-7 pt-7 pb-6">
          <button
            type="button"
            onClick={onClose}
            autoFocus
            className="absolute top-4 right-4 w-10 h-10 flex items-center justify-center rounded-xl text-blue-100 hover:text-white hover:bg-white/10"
            aria-label="Fechar"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-1.5 text-sm text-blue-100">
            <MapPin className="w-4 h-4 text-amber-400" />
            Região {state.regiao}
          </div>
          <h2 id="estado-titulo" className="mt-1 text-3xl sm:text-4xl text-white leading-tight pr-10">
            {state.nome}
          </h2>
        </div>

        <div className="px-7 py-7">
          <div className="flex items-end gap-4">
            <span className="font-heading font-semibold text-orange-500 text-7xl leading-[0.8] tabular-nums">
              {state.contratos.toLocaleString('pt-BR')}
            </span>
            <span className="pb-1">
              <span className="block font-heading font-semibold text-2xl text-blue-950 leading-tight">
                {state.contratos === 1 ? 'contrato' : 'contratos'}
              </span>
              <span className="block text-slate-600">fornecidos pelo Grupo Educare</span>
            </span>
          </div>
          <p className="mt-4 text-slate-700">{state.destaque}</p>
          {state.municipios && state.municipios.length > 0 && (
            <ul className="mt-3 flex flex-wrap gap-1.5" aria-label="Municípios atendidos">
              {state.municipios.map((m) => (
                <li key={m} className="text-[13px] font-medium text-blue-950 bg-blue-50 ring-1 ring-blue-100 rounded-full px-3 py-1">
                  {m}
                </li>
              ))}
            </ul>
          )}
          {CONTRATOS_ESTADOS_ESTIMADOS && (
            <p className="mt-4 text-xs text-slate-500 bg-slate-100 rounded-lg px-3 py-2">
              Total nacional de cerca de 2.000 contratos. A divisão por estado é estimada.
            </p>
          )}

          {state.sigla === 'BA' && (
            <button
              onClick={() => {
                onClose();
                onDrillDownBahia();
              }}
              className="btn-yellow mt-6 w-full h-12 rounded-2xl font-semibold flex items-center justify-center gap-2"
            >
              Ver os municípios atendidos na Bahia
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
