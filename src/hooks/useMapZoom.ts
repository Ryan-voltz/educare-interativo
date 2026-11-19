import { useCallback, useEffect, useRef, useState } from 'react';

export const MIN_ZOOM = 1;
export const MAX_ZOOM = 8;

type Anim = 'none' | 'fast' | 'slow';
interface View {
  zoom: number;
  x: number;
  y: number;
}

const clamp = (v: number, min: number, max: number) => Math.min(Math.max(v, min), max);

/** CSS transition do grupo do mapa: lenta para atalhos e botões, curta para a roda, nenhuma ao arrastar. */
export const ANIM_TRANSITION: Record<Anim, string> = {
  none: 'none',
  fast: 'transform 0.12s ease-out',
  slow: 'transform 0.45s cubic-bezier(0.16, 1, 0.3, 1)',
};

/**
 * Zoom e arraste de um mapa SVG (viewBox width x height, transform-origin no centro):
 * roda do mouse (zoom no ponto do cursor), arrastar para mover, pinça no toque e botões.
 * Mouse, toque e caneta passam pelos mesmos pointer events.
 */
export function useMapZoom(width: number, height: number) {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const [view, setView] = useState<View>({ zoom: 1, x: 0, y: 0 });
  const viewRef = useRef(view);
  const [anim, setAnim] = useState<Anim>('slow');
  const [dragging, setDragging] = useState(false);
  const movedRef = useRef(false);

  const commit = useCallback((v: View, a: Anim) => {
    viewRef.current = v;
    setView(v);
    setAnim(a);
  }, []);

  // Limita o arraste para o mapa não sumir da tela
  const clampView = useCallback(
    (zoom: number, x: number, y: number): View => {
      const z = clamp(zoom, MIN_ZOOM, MAX_ZOOM);
      if (z <= 1.001) return { zoom: 1, x: 0, y: 0 };
      const mx = ((z - 1) / 2 + 0.25) * width;
      const my = ((z - 1) / 2 + 0.25) * height;
      return { zoom: z, x: clamp(x, -mx, mx), y: clamp(y, -my, my) };
    },
    [width, height],
  );

  // Pixels da tela por unidade do viewBox
  const pxPerUnit = () => svgRef.current?.getScreenCTM()?.a || 1;

  const toViewBox = useCallback(
    (clientX: number, clientY: number) => {
      const ctm = svgRef.current?.getScreenCTM();
      if (!ctm) return { x: width / 2, y: height / 2 };
      const p = new DOMPoint(clientX, clientY).matrixTransform(ctm.inverse());
      return { x: p.x, y: p.y };
    },
    [width, height],
  );

  /** Multiplica o zoom mantendo fixo o ponto (cx, cy), em unidades do viewBox. */
  const zoomAt = useCallback(
    (factor: number, cx: number, cy: number, a: Anim, extraX = 0, extraY = 0) => {
      const v = viewRef.current;
      const z2 = clamp(v.zoom * factor, MIN_ZOOM, MAX_ZOOM);
      const k = z2 / v.zoom;
      const ox = width / 2;
      const oy = height / 2;
      const x = cx - ox - k * (cx - ox - v.x) + extraX;
      const y = cy - oy - k * (cy - oy - v.y) + extraY;
      commit(clampView(z2, x, y), a);
    },
    [width, height, commit, clampView],
  );

  const zoomBy = useCallback(
    (factor: number) => zoomAt(factor, width / 2, height / 2, 'slow'),
    [zoomAt, width, height],
  );
  const reset = useCallback(() => commit({ zoom: 1, x: 0, y: 0 }, 'slow'), [commit]);
  const goTo = useCallback(
    (zoom: number, pan: { x: number; y: number }) => commit({ zoom, x: pan.x, y: pan.y }, 'slow'),
    [commit],
  );
  /** Depois de arrastar, o clique que vem junto não deve selecionar o que está embaixo. */
  const ignoreClick = useCallback(() => movedRef.current, []);

  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;

    const pointers = new Map<number, { x: number; y: number }>();
    let start = { cx: 0, cy: 0, view: viewRef.current };
    let pinch = { dist: 1, mx: 0, my: 0 };

    const pair = () => {
      const [a, b] = [...pointers.values()];
      return { dist: Math.hypot(a.x - b.x, a.y - b.y) || 1, mx: (a.x + b.x) / 2, my: (a.y + b.y) / 2 };
    };

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      const dy = e.deltaMode === 1 ? e.deltaY * 16 : e.deltaY;
      const factor = Math.exp(-dy * (e.ctrlKey ? 0.01 : 0.002));
      const c = toViewBox(e.clientX, e.clientY);
      zoomAt(factor, c.x, c.y, 'fast');
    };

    const onDown = (e: PointerEvent) => {
      if (e.pointerType === 'mouse' && e.button !== 0) return;
      pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
      if (pointers.size === 1) {
        movedRef.current = false;
        start = { cx: e.clientX, cy: e.clientY, view: viewRef.current };
      } else if (pointers.size === 2) {
        pinch = pair();
        movedRef.current = true;
        setDragging(true);
      }
    };

    const onMove = (e: PointerEvent) => {
      if (!pointers.has(e.pointerId)) return;
      pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
      if (pointers.size >= 2) {
        const now = pair();
        const c = toViewBox(now.mx, now.my);
        const s = pxPerUnit();
        zoomAt(now.dist / pinch.dist, c.x, c.y, 'none', (now.mx - pinch.mx) / s, (now.my - pinch.my) / s);
        pinch = now;
        return;
      }
      const dx = e.clientX - start.cx;
      const dy = e.clientY - start.cy;
      if (!movedRef.current) {
        if (Math.hypot(dx, dy) < 5) return;
        movedRef.current = true;
        setDragging(true);
      }
      const s = pxPerUnit();
      const v = start.view;
      commit(clampView(v.zoom, v.x + dx / s, v.y + dy / s), 'none');
    };

    const onUp = (e: PointerEvent) => {
      if (!pointers.delete(e.pointerId)) return;
      if (pointers.size === 0) {
        setDragging(false);
      } else if (pointers.size === 1) {
        // Terminou a pinça: o dedo que ficou continua arrastando
        const [p] = [...pointers.values()];
        start = { cx: p.x, cy: p.y, view: viewRef.current };
      }
    };

    svg.addEventListener('wheel', onWheel, { passive: false });
    svg.addEventListener('pointerdown', onDown);
    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp);
    window.addEventListener('pointercancel', onUp);
    return () => {
      svg.removeEventListener('wheel', onWheel);
      svg.removeEventListener('pointerdown', onDown);
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
      window.removeEventListener('pointercancel', onUp);
    };
  }, [toViewBox, zoomAt, commit, clampView]);

  return {
    svgRef,
    zoomLevel: view.zoom,
    pan: { x: view.x, y: view.y },
    transition: ANIM_TRANSITION[anim],
    dragging,
    zoomBy,
    reset,
    goTo,
    ignoreClick,
  };
}
