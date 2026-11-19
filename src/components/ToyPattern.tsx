import React from 'react';
import {
  ToyBrick,
  Puzzle,
  Blocks,
  Shapes,
  Palette,
  Pencil,
  Baby,
  Rocket,
  Car,
  Smile,
  Star,
  Balloon,
  Rainbow,
  Backpack,
  Sun,
  Bike,
} from 'lucide-react';

/**
 * Fundo ilustrado de brinquedos e infância (pedido do cliente para o card PDDE).
 * Posições fixas para o desenho não "pular" entre renderizações.
 */
const ITEMS = [
  { Icon: ToyBrick, x: 4, y: 8, r: -12, s: 30, c: 'text-blue-300' },
  { Icon: Balloon, x: 22, y: 70, r: 10, s: 34, c: 'text-amber-300' },
  { Icon: Puzzle, x: 40, y: 6, r: 18, s: 26, c: 'text-emerald-300' },
  { Icon: Smile, x: 58, y: 78, r: -8, s: 28, c: 'text-blue-300' },
  { Icon: Rocket, x: 76, y: 10, r: 24, s: 30, c: 'text-orange-300' },
  { Icon: Blocks, x: 90, y: 62, r: -16, s: 30, c: 'text-amber-300' },
  { Icon: Star, x: 66, y: 40, r: 12, s: 20, c: 'text-amber-300' },
  { Icon: Car, x: 8, y: 44, r: 6, s: 28, c: 'text-emerald-300' },
  { Icon: Pencil, x: 30, y: 38, r: -30, s: 22, c: 'text-orange-300' },
  { Icon: Baby, x: 48, y: 50, r: 0, s: 24, c: 'text-blue-200' },
  { Icon: Shapes, x: 84, y: 34, r: -6, s: 24, c: 'text-blue-300' },
  { Icon: Rainbow, x: 14, y: 86, r: -4, s: 28, c: 'text-orange-300' },
  { Icon: Palette, x: 94, y: 6, r: 14, s: 24, c: 'text-emerald-300' },
  { Icon: Backpack, x: 72, y: 86, r: 8, s: 26, c: 'text-amber-300' },
  { Icon: Sun, x: 56, y: 16, r: 0, s: 22, c: 'text-amber-300' },
  { Icon: Bike, x: 38, y: 88, r: -10, s: 26, c: 'text-blue-200' },
];

export const ToyPattern: React.FC<{ className?: string; scale?: number }> = ({ className = '', scale = 1 }) => (
  <div aria-hidden="true" className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}>
    {ITEMS.map(({ Icon, x, y, r, s, c }, i) => (
      <Icon
        key={i}
        className={`absolute ${c}`}
        strokeWidth={1.75}
        style={{
          left: `${x}%`,
          top: `${y}%`,
          width: s * scale,
          height: s * scale,
          transform: `translate(-50%, -50%) rotate(${r}deg)`,
        }}
      />
    ))}
  </div>
);
