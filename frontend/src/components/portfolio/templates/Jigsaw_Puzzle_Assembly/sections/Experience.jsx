import React, { useRef } from 'react';
import { motion, useScroll, useTransform, useSpring, useInView } from 'framer-motion';
import { Briefcase, Calendar } from 'lucide-react';
import PuzzleHeading from '../components/PuzzleHeading';
import { PUZZLE_PATH, PUZZLE_VIEWBOX, COLORS, PIECE_EASE } from '../utils/puzzleHelpers';

// Animated SVG connector between timeline cards
function PuzzleConnector({ index, totalRefs }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.5 });

  return (
    <div ref={ref} className="flex justify-start items-center pl-6 my-0" style={{ height: 48 }}>
      <div className="relative flex flex-col items-center" style={{ width: 56 }}>
        {/* Vertical animated line */}
        <motion.div
          className="w-px"
          style={{
            background: 'linear-gradient(to bottom, rgba(124,58,237,0.6), rgba(6,182,212,0.4))',
            height: 28,
            transformOrigin: 'top',
          }}
          initial={{ scaleY: 0 }}
          animate={inView ? { scaleY: 1 } : {}}
          transition={{ delay: index * 0.15 + 0.3, duration: 0.4, ease: PIECE_EASE }}
        />
        {/* Connector node */}
        <motion.div
          className="w-2.5 h-2.5 rounded-full flex-shrink-0"
          style={{ background: 'rgba(6,182,212,0.7)', marginTop: 4 }}
          initial={{ scale: 0, opacity: 0 }}
          animate={inView ? { scale: 1, opacity: 1 } : {}}
          transition={{ delay: index * 0.15 + 0.7, type: 'spring', stiffness: 320 }}
        />
        {/* Puzzle piece at joint */}
        <motion.div
          className="absolute -right-4 top-1/2 -translate-y-1/2 opacity-30"
          initial={{ opacity: 0, scale: 0 }}
          animate={inView ? { opacity: 0.3, scale: 1 } : {}}
          transition={{ delay: index * 0.15 + 0.9, duration: 0.3 }}
        >
          <svg width="14" height="14" viewBox={PUZZLE_VIEWBOX}>
            <path d={PUZZLE_PATH} fill="rgba(6,182,212,0.3)" stroke="rgba(6,182,212,0.7)" strokeWidth="2.5" />
          </svg>
        </motion.div>
      </div>
    </div>
  );
}

function ExperienceCard({ exp, index }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.3 });

  return (
    <motion.div
      ref={ref}
      className="relative flex gap-5"
      initial={{ opacity: 0, x: -55 }}
      animate={inView ? { opacity: 1, x: 0 } : {}}
      transition={{ delay: index * 0.1, type: 'spring', stiffness: 160, damping: 24 }}
    >
      {/* Left — puzzle piece icon */}
      <div className="relative flex-shrink-0">
        <motion.div
          style={{ width: 54, height: 54 }}
          whileHover={{ scale: 1.1, rotate: 6 }}
          transition={{ type: 'spring', stiffness: 400 }}
        >
          <svg viewBox={PUZZLE_VIEWBOX} className="w-full h-full">
            <path
              d={PUZZLE_PATH}
              fill="rgba(124,58,237,0.15)"
              stroke="rgba(124,58,237,0.5)"
              strokeWidth="2"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <Briefcase size={16} style={{ color: COLORS.violet }} />
          </div>
        </motion.div>
      </div>

      {/* Right — card */}
      <motion.div
        className="flex-1 rounded-2xl p-5 relative"
        style={{ background: COLORS.surface, border: `1px solid ${COLORS.border}` }}
        whileHover={{
          borderColor: 'rgba(124,58,237,0.35)',
          background: 'rgba(124,58,237,0.06)',
          y: -3,
          boxShadow: '0 12px 40px rgba(124,58,237,0.12)',
        }}
        transition={{ duration: 0.25 }}
      >
        {/* Header */}
        <div className="flex flex-wrap items-start justify-between gap-3 mb-3">
          <div>
            <h3 className="font-bold text-base leading-tight" style={{ color: COLORS.text }}>
              {exp.role}
            </h3>
            <p
              className="text-sm font-semibold mt-0.5"
              style={{
                background: 'linear-gradient(135deg, #a78bfa, #67e8f9)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              {exp.company}
            </p>
          </div>
          {(exp.period || exp.start) && (
            <div
              className="flex items-center gap-1.5 px-3 py-1 rounded-full flex-shrink-0"
              style={{ background: COLORS.surface, border: `1px solid ${COLORS.border}` }}
            >
              <Calendar size={11} style={{ color: COLORS.faint }} />
              <span className="text-xs" style={{ color: COLORS.faint }}>
                {exp.period || `${exp.start}${exp.end ? ` – ${exp.end}` : ''}`}
              </span>
            </div>
          )}
        </div>

        {/* Description */}
        {exp.description && (
          <p className="text-sm leading-relaxed" style={{ color: COLORS.faint }}>
            {exp.description}
          </p>
        )}

        {/* Bullet points */}
        {Array.isArray(exp.bullets) && exp.bullets.length > 0 && (
          <ul className="mt-3 space-y-1.5">
            {exp.bullets.slice(0, 3).map((b, bi) => (
              <li key={bi} className="flex items-start gap-2 text-xs" style={{ color: COLORS.faint }}>
                <span
                  className="mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0"
                  style={{ background: 'rgba(124,58,237,0.7)' }}
                />
                {b}
              </li>
            ))}
          </ul>
        )}

        {/* Small puzzle piece accent */}
        <div className="absolute right-4 bottom-4 opacity-15">
          <svg width="18" height="18" viewBox={PUZZLE_VIEWBOX}>
            <path d={PUZZLE_PATH} fill="none" stroke="rgba(124,58,237,0.8)" strokeWidth="2" />
          </svg>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function Experience({ experience }) {
  return (
    <section
      className="relative py-28 px-6 overflow-hidden"
      style={{ background: 'linear-gradient(180deg, #080B14 0%, #0A0D1C 100%)', zIndex: 1 }}
    >
      {/* Ambient glow */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 45% 55% at 92% 30%, rgba(6,182,212,0.07) 0%, transparent 70%)',
        }}
      />

      <div className="max-w-3xl mx-auto">
        <PuzzleHeading
          label="Experience"
          title="A Chain of Connected Pieces"
          accentColor={COLORS.cyan}
          gradientTo="#a78bfa"
        />

        <div className="flex flex-col">
          {(experience || []).map((exp, i) => (
            <React.Fragment key={i}>
              <ExperienceCard exp={exp} index={i} />
              {i < (experience || []).length - 1 && (
                <PuzzleConnector index={i} />
              )}
            </React.Fragment>
          ))}
        </div>
      </div>
    </section>
  );
}
