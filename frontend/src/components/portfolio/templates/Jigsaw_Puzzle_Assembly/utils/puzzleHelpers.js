// ─── Puzzle piece SVG path (all four tabs outward, 100×100 body) ──────────────
export const PUZZLE_PATH =
  'M 20,0 L 42,0 C 42,-12 58,-12 58,0 L 100,0 L 100,42 C 112,42 112,58 100,58 L 100,100 L 58,100 C 58,112 42,112 42,100 L 0,100 L 0,58 C -12,58 -12,42 0,42 L 0,0 Z';

// viewBox that gives breathing room around all four tabs
export const PUZZLE_VIEWBOX = '-15 -15 130 130';

// Spring-feel cubic-bezier for piece snapping into place
export const PIECE_EASE = [0.34, 1.56, 0.64, 1];

// Standard scroll-reveal ease
export const REVEAL_EASE = [0.075, 0.82, 0.165, 1];

// ─── Color palette ─────────────────────────────────────────────────────────────
export const COLORS = {
  bg:        '#080B14',
  surface:   'rgba(255,255,255,0.04)',
  border:    'rgba(255,255,255,0.08)',
  violet:    '#7C3AED',
  violetSoft:'rgba(124,58,237,0.5)',
  cyan:      '#06B6D4',
  cyanSoft:  'rgba(6,182,212,0.5)',
  amber:     '#F59E0B',
  text:      '#F1F5F9',
  muted:     '#94A3B8',
  faint:     '#475569',
};

// ─── Per-category skill palette ────────────────────────────────────────────────
export const COLOR_MAP = {
  Frontend: { fill: 'rgba(124,58,237,0.12)', stroke: 'rgba(124,58,237,0.55)', text: '#a78bfa', glow: 'rgba(124,58,237,0.4)' },
  Backend:  { fill: 'rgba(6,182,212,0.10)',  stroke: 'rgba(6,182,212,0.55)',  text: '#67e8f9', glow: 'rgba(6,182,212,0.4)' },
  DevOps:   { fill: 'rgba(245,158,11,0.10)', stroke: 'rgba(245,158,11,0.55)', text: '#fcd34d', glow: 'rgba(245,158,11,0.4)' },
  Design:   { fill: 'rgba(236,72,153,0.10)', stroke: 'rgba(236,72,153,0.55)', text: '#f9a8d4', glow: 'rgba(236,72,153,0.4)' },
  Core:     { fill: 'rgba(124,58,237,0.12)', stroke: 'rgba(124,58,237,0.55)', text: '#a78bfa', glow: 'rgba(124,58,237,0.4)' },
};

// ─── Precomputed scatter offsets for skill tiles (deterministic, no random) ────
export const SKILL_SCATTER = [
  { x: -180, y: -120, r: -22 },
  { x:  160, y: -100, r:  18 },
  { x: -140, y:   80, r:  30 },
  { x:  200, y:   60, r: -15 },
  { x:  -60, y: -160, r:  25 },
  { x:  100, y:  140, r: -28 },
  { x: -200, y:   20, r:  12 },
  { x:  140, y: -150, r: -20 },
  { x:  -80, y:  120, r:  35 },
  { x:  180, y:  100, r: -10 },
  { x: -120, y: -60,  r:  20 },
  { x:   60, y: -130, r: -32 },
  { x: -160, y: 160,  r:  15 },
  { x:  120, y:  -80, r:  28 },
  { x:  -40, y:  180, r: -18 },
];

// ─── Framer Motion shared variants ─────────────────────────────────────────────
export const fadeInUp = {
  hidden:  { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: REVEAL_EASE } },
};

export const pieceAssemble = {
  hidden:  { opacity: 0, scale: 0.6, rotate: -15 },
  visible: { opacity: 1, scale: 1,   rotate: 0,
    transition: { type: 'spring', stiffness: 260, damping: 22 } },
};
