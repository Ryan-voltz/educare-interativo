import React, { useEffect, useState } from 'react';
import QRCode from 'qrcode';
import { MessageCircle, Maximize2, X } from 'lucide-react';
import { VITORIA_NOME, telefoneFormatado, whatsappLink } from '../config/contato';
import { sounds } from '../utils/audio';
import { ToyPattern } from './ToyPattern';

/**
 * QR code que abre o WhatsApp da Vitória, com a logo da Atacadogé ao centro.
 * Usa correção de erro "H" (30%), então a logo central não impede a leitura.
 */
const QRImage: React.FC<{ size: number; className?: string }> = ({ size, className = '' }) => {
  const [svg, setSvg] = useState<string>('');

  useEffect(() => {
    let alive = true;
    QRCode.toString(whatsappLink(), {
      type: 'svg',
      errorCorrectionLevel: 'H',
      margin: 0,
      color: { dark: '#0E2A6B', light: '#FFFFFF' },
    }).then((s) => {
      if (alive) setSvg(s);
    });
    return () => {
      alive = false;
    };
  }, []);

  return (
    <div
      className={`relative bg-white ${className}`}
      style={{ width: size, height: size }}
      role="img"
      aria-label={`QR code para falar com a ${VITORIA_NOME} no WhatsApp`}
    >
      <div className="w-full h-full [&>svg]:w-full [&>svg]:h-full" dangerouslySetInnerHTML={{ __html: svg }} />
      <div
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-[22%] p-[3.5%] shadow-[0_0_0_3px_white]"
        style={{ width: size * 0.26, height: size * 0.26 }}
      >
        <img
          src="/brand/atacadoge-simbolo.png"
          alt="Atacadogé"
          className="w-full h-full object-contain"
          draggable={false}
        />
      </div>
    </div>
  );
};

export const WhatsAppQR: React.FC = () => {
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    if (!expanded) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setExpanded(false);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [expanded]);

  return (
    <>
      <section
        aria-labelledby="qr-vitoria-titulo"
        className="relative overflow-hidden rounded-3xl border border-blue-200 shadow-elevated bg-gradient-to-br from-sky-50 via-white to-amber-50"
      >
        <ToyPattern className="opacity-70" />
        <div className="relative p-5">
          <div className="flex items-center justify-between gap-3">
            <img src="/brand/atacadoge-logo.png" alt="Atacado GE" className="h-12 w-auto" draggable={false} />
            <span className="text-xs font-semibold text-blue-950 bg-amber-400 rounded-full px-3 py-1">
              Atendimento PDDE à escola
            </span>
          </div>

          <div className="mt-4 flex items-center gap-5">
            <button
              type="button"
              onClick={() => {
                sounds.playTap();
                setExpanded(true);
              }}
              className="group relative shrink-0 rounded-2xl bg-white p-2.5 shadow-elevated ring-1 ring-blue-200 hover:ring-blue-400 transition"
              aria-label="Ampliar QR code"
            >
              <QRImage size={128} />
              <span className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full bg-blue-950 text-white flex items-center justify-center shadow-md group-hover:scale-110 transition-transform">
                <Maximize2 className="w-4 h-4" />
              </span>
            </button>

            <div className="min-w-0">
              <h2 id="qr-vitoria-titulo" className="text-xl text-blue-950 leading-tight">
                Recurso PDDE
              </h2>
              <p className="text-[15px] text-slate-700 mt-1 leading-snug">
                Para utilizar o recurso PDDE, fale com a <strong className="font-semibold text-blue-950">{VITORIA_NOME}</strong> do Atacado GE.
              </p>
              <a
                href={whatsappLink()}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2.5 inline-flex items-center gap-1.5 text-sm font-semibold text-emerald-700 hover:text-emerald-800 tabular-nums"
              >
                <MessageCircle className="w-4 h-4" />
                {telefoneFormatado()}
              </a>
            </div>
          </div>
        </div>
      </section>

      {expanded && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-blue-950/80 backdrop-blur-sm animate-backdrop"
          onClick={() => setExpanded(false)}
          role="dialog"
          aria-modal="true"
          aria-labelledby="qr-ampliado-titulo"
        >
          <div
            className="relative overflow-hidden bg-gradient-to-br from-sky-50 via-white to-amber-50 rounded-[2rem] shadow-modal p-8 sm:p-10 flex flex-col items-center text-center max-w-md w-full animate-rise"
            onClick={(e) => e.stopPropagation()}
          >
            <ToyPattern scale={1.3} className="opacity-35" />
            <button
              type="button"
              onClick={() => setExpanded(false)}
              className="absolute z-10 top-4 right-4 p-2 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-100"
              aria-label="Fechar"
              autoFocus
            >
              <X className="w-5 h-5" />
            </button>
            <div className="relative flex flex-col items-center">
              <img src="/brand/atacadoge-logo.png" alt="Atacado GE" className="h-20 w-auto" draggable={false} />
              <h2 id="qr-ampliado-titulo" className="mt-4 text-3xl text-blue-950">
                Recurso PDDE
              </h2>
              <p className="text-slate-700 mt-1 text-lg leading-snug max-w-[28ch]">
                Para utilizar o recurso PDDE, fale com a {VITORIA_NOME} do Atacado GE.
              </p>
              <div className="mt-6 p-4 bg-white rounded-3xl shadow-elevated ring-1 ring-blue-200">
                <QRImage size={280} />
              </div>
              <p className="mt-4 text-sm text-slate-600">Aponte a câmera do celular para o código.</p>
              <p className="mt-1 font-semibold text-blue-950 tabular-nums">{telefoneFormatado()}</p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
