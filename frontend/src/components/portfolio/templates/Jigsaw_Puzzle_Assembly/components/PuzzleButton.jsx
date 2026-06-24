import React from 'react';
import { motion } from 'framer-motion';
import { PUZZLE_PATH, PUZZLE_VIEWBOX, PIECE_EASE } from '../utils/puzzleHelpers';

const cornerVariants = {
  rest:  { opacity: 0, scale: 0.5 },
  hover: { opacity: 0.7, scale: 1, transition: { type: 'spring', stiffness: 360, damping: 22 } },
};

/**
 * CTA button with puzzle-piece corner fragments that assemble on hover.
 */
export default function PuzzleButton({
  children,
  href,
  onClick,
  variant = 'primary',
  accentColor = '#7C3AED',
  className = '',
  as: Tag = 'button',
}) {
  const isPrimary = variant === 'primary';
  const El = href ? 'a' : Tag;
  const extraProps = href ? { href, target: '_blank', rel: 'noopener noreferrer' } : { onClick };

  return (
    <motion.div
      initial="rest"
      whileHover="hover"
      whileTap={{ scale: 0.96 }}
      className={`relative inline-flex ${className}`}
    >
      <El
        {...extraProps}
        className="relative flex items-center gap-2 px-7 py-3 rounded-full text-sm font-semibold overflow-hidden select-none"
        style={
          isPrimary
            ? { background: `linear-gradient(135deg, ${accentColor}, #5B21B6)`, color: '#fff' }
            : { border: '1px solid rgba(255,255,255,0.12)', background: 'rgba(255,255,255,0.04)', color: '#CBD5E1' }
        }
      >
        {/* Hover shimmer on primary */}
        {isPrimary && (
          <motion.span
            variants={{ rest: { x: '-110%' }, hover: { x: '110%', transition: { duration: 0.45, ease: 'easeInOut' } } }}
            aria-hidden="true"
            style={{
              position: 'absolute', inset: 0,
              background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.18), transparent)',
              pointerEvents: 'none',
            }}
          />
        )}
        {children}
      </El>

      {/* Puzzle-piece corner fragments */}
      <motion.div
        variants={cornerVariants}
        aria-hidden="true"
        className="absolute -top-2 -right-2 pointer-events-none"
      >
        <svg width="20" height="20" viewBox={PUZZLE_VIEWBOX}>
          <path d={PUZZLE_PATH} fill={`${accentColor}25`} stroke={`${accentColor}90`} strokeWidth="2" />
        </svg>
      </motion.div>
      <motion.div
        variants={cornerVariants}
        aria-hidden="true"
        className="absolute -bottom-2 -left-2 pointer-events-none"
      >
        <svg width="16" height="16" viewBox={PUZZLE_VIEWBOX}>
          <path d={PUZZLE_PATH} fill={`${accentColor}20`} stroke={`${accentColor}80`} strokeWidth="2" />
        </svg>
      </motion.div>
    </motion.div>
  );
}
