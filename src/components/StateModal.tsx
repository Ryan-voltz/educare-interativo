import React from 'react';
import { X, School, Users, ArrowRight, Award } from 'lucide-react';
import { type StateCase } from '../data/educareData';

interface StateModalProps {
  state: StateCase | null;
  onClose: () => void;
  onDrillDownBahia: () => void;
}

export const StateModal: React.FC<StateModalProps> = ({ state, onClose, onDrillDownBahia }) => {
  if (!state) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col">
        {/* Top Header */}
        <div className="px-6 py-5 bg-gradient-to-r from-blue-900 to-indigo-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-white/10 text-amber-400 font-semibold text-xl flex items-center justify-center backdrop-blur-md border border-white/20">
              {state.sigla}
            </div>
            <div>
              <div className="text-xs text-blue-200 font-semibold">
                Região {state.regiao}
              </div>
              <h3 className="text-xl font-bold text-white">{state.nome}</h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-xl transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-5">
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-center">
              <School className="w-5 h-5 text-blue-600 mx-auto mb-1" />
              <div className="text-2xl font-semibold text-slate-900">
                {state.municipiosAtendidos}
              </div>
              <div className="text-xs font-semibold text-slate-500">
                Municípios Atendidos
              </div>
            </div>

            <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-center">
              <Users className="w-5 h-5 text-emerald-600 mx-auto mb-1" />
              <div className="text-2xl font-semibold text-slate-900">
                {state.alunosImpactados.toLocaleString()}
              </div>
              <div className="text-xs font-semibold text-slate-500">
                Alunos Beneficiados
              </div>
            </div>
          </div>

          <div className="p-4 bg-sky-50/70 border border-sky-100 rounded-2xl flex items-start gap-3">
            <Award className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
            <div>
              <div className="text-xs font-bold text-blue-900">Atuação Regional</div>
              <p className="text-xs text-slate-700 mt-1 leading-relaxed">{state.destaque}</p>
            </div>
          </div>

          {state.sigla === 'BA' ? (
            <button
              onClick={() => {
                onClose();
                onDrillDownBahia();
              }}
              className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-xl flex items-center justify-center gap-2 shadow-md active:scale-95 transition-all"
            >
              <span>Ver Mapa Detalhado dos Municípios da Bahia</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={onClose}
              className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-xl transition-all"
            >
              Fechar Detalhes
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
