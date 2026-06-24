import React from 'react';
import { motion } from 'framer-motion';
import { PUZZLE_PATH, PUZZLE_VIEWBOX } from '../utils/puzzleHelpers';

/**
 * Reusable SVG puzzle piece shape.
 * Can be used as a decorative element, background tile, or skill container.
 */
export default function PuzzlePiece({
  size = 60,
  fill = 'rgba(124,58,237,0.12)',
  stroke = 'rgba(124,58,237,0.55)',
  strokeWidth = 1.5,
  float = false,
  floatDelay = 0,
  className = '',
  style = {},
  children,
}) {
  const floatAnimation = float
    ? {
        y: [0, -14, 0],
        rotate: [0, 4, 0],
        opacity: [1, 1, 1],
      }
    : undefined;

  const floatTransition = float
    ? { duration: 6, repeat: Infinity, ease: 'easeInOut', delay: floatDelay }
    : undefined;

  return (
    <motion.div
      className={`relative ${className}`}
      style={{ width: size, height: size, ...style }}
      animate={floatAnimation}
      transition={floatTransition}
    >
      <svg
        viewBox={PUZZLE_VIEWBOX}
        className="absolute inset-0 w-full h-full"
        aria-hidden="true"
      >
        <path
          d={PUZZLE_PATH}
          fill={fill}
          stroke={stroke}
          strokeWidth={strokeWidth}
        />
      </svg>
      {children && (
        <div className="absolute inset-0 flex items-center justify-center z-10">
          {children}
        </div>
      )}
    </motion.div>
  );
}
