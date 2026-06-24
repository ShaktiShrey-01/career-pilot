import React from 'react';
import { motion } from 'framer-motion';
import { Quote } from 'lucide-react';
import PuzzleHeading from '../components/PuzzleHeading';
import { PUZZLE_PATH, PUZZLE_VIEWBOX, COLORS } from '../utils/puzzleHelpers';

const CARD_ACCENTS = [
  { fill: 'rgba(124,58,237,0.07)', border: 'rgba(124,58,237,0.22)', dot: '#a78bfa' },
  { fill: 'rgba(6,182,212,0.07)',  border: 'rgba(6,182,212,0.22)',  dot: '#67e8f9' },
  { fill: 'rgba(245,158,11,0.07)', border: 'rgba(245,158,11,0.22)', dot: '#fcd34d' },
  { fill: 'rgba(236,72,153,0.07)', border: 'rgba(236,72,153,0.22)', dot: '#f9a8d4' },
];

function TestimonialCard({ testimonial, index }) {
  const accent = CARD_ACCENTS[index % CARD_ACCENTS.length];
  const name   = testimonial.name || testimonial.author;
  const avatar = testimonial.avatar || testimonial.image;

  return (
    <motion.div
      initial={{ opacity: 0, y: 40, scale: 0.93 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ delay: index * 0.08, type: 'spring', stiffness: 180, damping: 24 }}
      className="relative rounded-2xl p-6 flex flex-col gap-4 group"
      style={{ background: accent.fill, border: `1px solid ${accent.border}`, backdropFilter: 'blur(8px)' }}
      whileHover={{ y: -6, boxShadow: `0 16px 50px ${accent.border}` }}
    >
      {/* Puzzle piece corner — rotates in on mount */}
      <motion.div
        aria-hidden="true"
        className="absolute top-4 right-4 pointer-events-none"
        initial={{ opacity: 0, rotate: -90 }}
        whileInView={{ opacity: 0.25, rotate: 0 }}
        viewport={{ once: true }}
        transition={{ delay: index * 0.08 + 0.4, duration: 0.5, ease: [0.34, 1.56, 0.64, 1] }}
      >
        <svg width="24" height="24" viewBox={PUZZLE_VIEWBOX}>
          <path d={PUZZLE_PATH} fill="none" stroke={accent.dot} strokeWidth="2" />
        </svg>
      </motion.div>

      {/* Quote icon */}
      <div
        className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
        style={{ background: `${accent.dot}22` }}
      >
        <Quote size={15} style={{ color: accent.dot }} />
      </div>

      {/* Text */}
      <p className="text-sm leading-relaxed flex-1 italic" style={{ color: COLORS.muted }}>
        "{testimonial.text}"
      </p>

      {/* Author */}
      <div
        className="flex items-center gap-3 pt-3"
        style={{ borderTop: `1px solid ${COLORS.border}` }}
      >
        {avatar ? (
          <img
            src={avatar}
            alt={name}
            className="w-9 h-9 rounded-full object-cover flex-shrink-0"
            style={{ border: `2px solid ${accent.border}` }}
          />
        ) : (
          <div
            className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
            style={{ background: `${accent.dot}22`, color: accent.dot, border: `2px solid ${accent.border}` }}
          >
            {(name || '?')[0].toUpperCase()}
          </div>
        )}
        <div>
          <p className="text-sm font-semibold leading-tight" style={{ color: COLORS.text }}>
            {name}
          </p>
          <p className="text-xs mt-0.5" style={{ color: accent.dot }}>
            {testimonial.role}
          </p>
        </div>
      </div>
    </motion.div>
  );
}

export default function Testimonials({ testimonials }) {
  if (!testimonials || testimonials.length === 0) return null;

  return (
    <section
      className="relative py-28 px-6 overflow-hidden"
      style={{ background: COLORS.bg, zIndex: 1 }}
    >
      {/* Ambient glow */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 50% 40% at 30% 70%, rgba(245,158,11,0.05) 0%, transparent 70%)',
        }}
      />

      {/* Large bg puzzle piece */}
      <motion.div
        aria-hidden="true"
        className="absolute -right-20 top-1/4 pointer-events-none opacity-[0.03]"
        animate={{ rotate: [0, 10, 0], y: [0, -30, 0] }}
        transition={{ duration: 16, repeat: Infinity, ease: 'easeInOut' }}
      >
        <svg width="380" height="380" viewBox={PUZZLE_VIEWBOX}>
          <path d={PUZZLE_PATH} fill="white" />
        </svg>
      </motion.div>

      <div className="max-w-6xl mx-auto">
        <PuzzleHeading
          label="Testimonials"
          title="Voices That Complete The Picture"
          accentColor={COLORS.amber}
          gradientTo="#f9a8d4"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {testimonials.map((t, i) => (
            <TestimonialCard key={i} testimonial={t} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
