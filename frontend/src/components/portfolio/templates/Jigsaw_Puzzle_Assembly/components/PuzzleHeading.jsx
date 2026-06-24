import React from 'react';
import { motion } from 'framer-motion';
import { PUZZLE_PATH, PUZZLE_VIEWBOX, PIECE_EASE } from '../utils/puzzleHelpers';

const letterVariants = {
  hidden:  { opacity: 0, y: 32, rotate: -12, scale: 0.7 },
  visible: (i) => ({
    opacity: 1, y: 0, rotate: 0, scale: 1,
    transition: { type: 'spring', stiffness: 300, damping: 24, delay: i * 0.04 },
  }),
};

// Continuous subtle oscillation so heading stays alive after assembly
const floatVariants = {
  float: (i) => ({
    y: [0, i % 2 === 0 ? -3 : -2, 0],
    transition: {
      duration: 3 + (i % 3) * 0.5,
      repeat: Infinity,
      ease: 'easeInOut',
      delay: i * 0.08,
    },
  }),
};

/**
 * Section heading that assembles letter-by-letter then gently oscillates.
 * Mirrors Volcanic_Forge/components/SectionHeader.jsx pattern.
 */
export default function PuzzleHeading({ label, title, accentColor = '#7C3AED', gradientTo = '#06B6D4' }) {
  const words = title.split(' ');
  let globalIndex = 0;

  return (
    <div className="mb-10">
      {/* Label row */}
      {label && (
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease: PIECE_EASE }}
          className="flex items-center gap-2.5 mb-3"
        >
          <svg width="18" height="18" viewBox={PUZZLE_VIEWBOX} aria-hidden="true">
            <path
              d={PUZZLE_PATH}
              fill={`${accentColor}30`}
              stroke={`${accentColor}cc`}
              strokeWidth="2.5"
            />
          </svg>
          <span
            className="text-xs font-bold tracking-[0.32em] uppercase"
            style={{ color: accentColor }}
          >
            {label}
          </span>
        </motion.div>
      )}

      {/* Animated title */}
      <motion.h2
        className="text-3xl md:text-5xl font-extrabold flex flex-wrap gap-x-3 gap-y-1"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.5 }}
      >
        {words.map((word, wi) => (
          <span key={wi} className="flex">
            {word.split('').map((ch, ci) => {
              const idx = globalIndex++;
              return (
                <motion.span
                  key={ci}
                  custom={idx}
                  variants={letterVariants}
                  animate="float"
                  style={{
                    display: 'inline-block',
                    background: `linear-gradient(135deg, #ffffff 20%, ${gradientTo})`,
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                  }}
                >
                  {ch}
                </motion.span>
              );
            })}
          </span>
        ))}
      </motion.h2>

      {/* Gradient underline */}
      <motion.div
        initial={{ scaleX: 0, originX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7, delay: 0.3, ease: PIECE_EASE }}
        className="h-0.5 w-20 mt-4 rounded-full"
        style={{ background: `linear-gradient(90deg, ${accentColor}, ${gradientTo})` }}
      />
    </div>
  );
}
