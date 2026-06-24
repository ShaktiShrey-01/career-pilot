import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { PUZZLE_PATH, PUZZLE_VIEWBOX } from './utils/puzzleHelpers';

// Three depth layers: slow-large, mid-medium, fast-small
// Each piece has deterministic position, opacity, rotation, duration, delay
const LAYERS = [
  // Layer 0 — large, slow, deep
  { size: 340, left: '-4%',  top:  '3%', rotate:  14, opacity: 0.045, dur: 14, delay: 0,   parallaxFactor: 0.08, stroke: '#7C3AED' },
  { size: 280, left: '72%',  top: '10%', rotate: -22, opacity: 0.035, dur: 17, delay: 2,   parallaxFactor: 0.06, stroke: '#06B6D4' },
  { size: 400, left: '52%',  top: '48%', rotate:  38, opacity: 0.030, dur: 20, delay: 4,   parallaxFactor: 0.05, stroke: '#7C3AED' },
  { size: 310, left: '78%',  top: '68%', rotate: -30, opacity: 0.040, dur: 16, delay: 1,   parallaxFactor: 0.07, stroke: '#06B6D4' },
  // Layer 1 — medium speed
  { size: 180, left: '8%',   top: '60%', rotate: -10, opacity: 0.060, dur: 10, delay: 0.5, parallaxFactor: 0.14, stroke: '#F59E0B' },
  { size: 200, left: '38%',  top: '75%', rotate:  22, opacity: 0.045, dur: 12, delay: 3,   parallaxFactor: 0.12, stroke: '#7C3AED' },
  { size: 160, left: '88%',  top: '35%', rotate: -45, opacity: 0.050, dur: 11, delay: 1.5, parallaxFactor: 0.13, stroke: '#06B6D4' },
  { size: 220, left: '20%',  top: '18%', rotate:  50, opacity: 0.040, dur: 13, delay: 2.5, parallaxFactor: 0.10, stroke: '#F59E0B' },
  // Layer 2 — small, fast, close
  { size: 110, left: '60%',  top: '20%', rotate:  -8, opacity: 0.070, dur:  7, delay: 0,   parallaxFactor: 0.22, stroke: '#7C3AED' },
  { size: 130, left: '14%',  top: '85%', rotate:  35, opacity: 0.060, dur:  8, delay: 1,   parallaxFactor: 0.20, stroke: '#06B6D4' },
  { size:  90, left: '46%',  top:  '5%', rotate: -20, opacity: 0.080, dur:  6, delay: 2,   parallaxFactor: 0.25, stroke: '#F59E0B' },
  { size: 150, left: '92%',  top: '55%', rotate:  15, opacity: 0.055, dur:  9, delay: 0.8, parallaxFactor: 0.18, stroke: '#7C3AED' },
];

function BackgroundPiece({ piece, scrollY }) {
  const { size, left, top, rotate, opacity, dur, delay, parallaxFactor, stroke } = piece;

  const yShift = useTransform(scrollY, [0, 3000], [0, -3000 * parallaxFactor]);

  return (
    <motion.div
      aria-hidden="true"
      className="absolute pointer-events-none"
      style={{ width: size, height: size, left, top, y: yShift }}
      animate={{
        y: [0, -28, 0],
        rotate: [rotate, rotate + 8, rotate],
        opacity: [opacity, opacity * 1.6, opacity],
      }}
      transition={{ duration: dur, delay, repeat: Infinity, ease: 'easeInOut' }}
    >
      <svg viewBox={PUZZLE_VIEWBOX} className="w-full h-full">
        <path d={PUZZLE_PATH} fill="none" stroke={stroke} strokeWidth="1.2" />
      </svg>
    </motion.div>
  );
}

/**
 * Global animated background — mounted once by index.jsx, visible across all sections.
 * Mirrors Volcanic_Forge/GlobalBackground.jsx role.
 */
export default function FloatingPuzzleBackground() {
  const containerRef = useRef(null);
  const { scrollY } = useScroll();

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      className="fixed inset-0 overflow-hidden pointer-events-none"
      style={{ zIndex: 0 }}
    >
      {/* Radial ambient glow */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 70% 45% at 50% 35%, rgba(109,40,217,0.14) 0%, transparent 70%)',
        }}
      />

      {/* Floating pieces with parallax */}
      {LAYERS.map((piece, i) => (
        <BackgroundPiece key={i} piece={piece} scrollY={scrollY} />
      ))}

      {/* Subtle grid overlay for depth */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            'linear-gradient(rgba(255,255,255,0.012) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.012) 1px, transparent 1px)',
          backgroundSize: '80px 80px',
        }}
      />
    </div>
  );
}
