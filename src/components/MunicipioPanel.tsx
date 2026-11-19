import React, { useEffect } from 'react';
import { X, MapPin, FileCheck2, MessageCircle } from 'lucide-react';
import type { MunicipalityCase } from '../data/educareData';
import { contratosDo, CONTRATOS_FICTICIOS } from '../data/contratos';
import { VITORIA_NOME, whatsappLink } from '../config/contato';
import { sounds } from '../utils/audio';

interface MunicipioPanelProps {
  municipality: MunicipalityCase;
  isPartner: boolean;
  onClose: () => void;
}

/**
 * Ao tocar em um município, mostra apenas o número de contratos fornecidos
 * (pedido do cliente nos áudios da demanda 2).
 */
export const MunicipioPanel: React.FC<MunicipioPanelProps> = ({ municipality, isPartner, onClose }) => {
  const contratos = isPartner ? contratosDo(municipality.id) : 0;

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
          {isPartner ? (
            contratos !== null ? (
              <div>
                <div className="flex items-end gap-4">
                  <span className="font-heading font-semibold text-orange-500 text-8xl leading-[0.8] tabular-nums">
                    {contratos}
                  </span>
                  <span className="pb-1">
                    <span className="block font-heading font-semibold text-2xl text-blue-950 leading-tight">
                      {contratos === 1 ? 'contrato' : 'contratos'}
                    </span>
                    <span className="block text-slate-600">fornecidos pelo Grupo Educare</span>
                  </span>
                </div>
                {CONTRATOS_FICTICIOS && (
                  <p className="mt-5 text-xs text-slate-500 bg-slate-100 rounded-lg px-3 py-2">
                    Dados de exemplo (fictícios). Os números oficiais serão atualizados em breve.
                  </p>
                )}
              </div>
            ) : (
              <div className="flex items-start gap-4">
                <span className="w-14 h-14 rounded-2xl bg-blue-100 text-blue-700 flex items-center justify-center shrink-0">
                  <FileCheck2 className="w-7 h-7" />
                </span>
                <span>
                  <span className="block font-heading font-semibold text-2xl text-blue-950 leading-tight">
                    Rede parceira
                  </span>
                  <span className="block text-slate-600 mt-1">Número de contratos em atualização.</span>
                </span>
              </div>
            )
          ) : (
            <div>
              <p className="font-heading font-semibold text-2xl text-blue-950 leading-tight">
                Ainda não atendemos esta rede
              </p>
              <p className="text-slate-600 mt-2">
                Quer levar as soluções do Grupo Educare para {municipality.name}? Fale com a {VITORIA_NOME}.
              </p>
              <a
                href={whatsappLink(
                  `Olá, ${VITORIA_NOME}! Sou de ${municipality.name} (BA) e quero conhecer as soluções do Grupo Educare.`,
                )}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-5 inline-flex items-center gap-2 h-12 px-5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold transition-colors"
              >
                <MessageCircle className="w-5 h-5" />
                Falar com a {VITORIA_NOME}
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
