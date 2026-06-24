import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Quote } from 'lucide-react';

const PUZZLE_PATH =
  'M 20,0 L 42,0 C 42,-12 58,-12 58,0 L 100,0 L 100,42 C 112,42 112,58 100,58 L 100,100 L 58,100 C 58,112 42,112 42,100 L 0,100 L 0,58 C -12,58 -12,42 0,42 L 0,0 Z';
const PUZZLE_VB = '-15 -15 130 130';

const CARD_ACCENTS = [
  { fill: 'rgba(124,58,237,0.08)', border: 'rgba(124,58,237,0.2)',  dot: '#a78bfa' },
  { fill: 'rgba(6,182,212,0.08)',  border: 'rgba(6,182,212,0.2)',  dot: '#67e8f9' },
  { fill: 'rgba(245,158,11,0.08)', border: 'rgba(245,158,11,0.2)', dot: '#fcd34d' },
  { fill: 'rgba(236,72,153,0.08)', border: 'rgba(236,72,153,0.2)', dot: '#f9a8d4' },
];

function TestimonialCard({ testimonial, index }) {
  const accent = CARD_ACCENTS[index % CARD_ACCENTS.length];
  const name = testimonial.name || testimonial.author;
  const avatar = testimonial.avatar || testimonial.image;

  return (
    <motion.div
      initial={{ opacity: 0, y: 40, scale: 0.94 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ delay: index * 0.1, type: 'spring', stiffness: 180, damping: 22 }}
      className="relative rounded-2xl p-6 flex flex-col gap-4 group"
      style={{
        background: accent.fill,
        border: `1px solid ${accent.border}`,
        backdropFilter: 'blur(8px)',
      }}
      whileHover={{ y: -6, boxShadow: `0 16px 50px ${accent.border}` }}
    >
      {/* Puzzle piece corner — top right */}
      <motion.div
        className="absolute top-4 right-4 opacity-20 group-hover:opacity-50 transition-opacity"
      >
        <svg width="26" height="26" viewBox={PUZZLE_VB}>
          <path d={PUZZLE_PATH} fill="none" stroke={accent.dot} strokeWidth="2" />
        </svg>
      </motion.div>

      {/* Quote icon */}
      <div
        className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
        style={{ background: `${accent.dot}22` }}
      >
        <Quote size={16} style={{ color: accent.dot }} />
      </div>

      {/* Text */}
      <p className="text-slate-400 text-sm leading-relaxed flex-1 italic">
        "{testimonial.text}"
      </p>

      {/* Author */}
      <div className="flex items-center gap-3 pt-3" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
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
          <p className="text-slate-200 text-sm font-semibold leading-tight">{name}</p>
          <p className="text-xs mt-0.5" style={{ color: accent.dot }}>{testimonial.role}</p>
        </div>
      </div>
    </motion.div>
  );
}

export default function Testimonials({ data }) {
  const { testimonials } = data;
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.1 });

  if (!testimonials || testimonials.length === 0) return null;

  return (
    <section
      ref={ref}
      className="relative py-28 px-6 overflow-hidden"
      style={{ background: '#080B14' }}
    >
      {/* Ambient glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse 55% 40% at 30% 70%, rgba(245,158,11,0.05) 0%, transparent 70%)' }}
      />

      {/* Large decorative BG puzzle piece */}
      <motion.div
        className="absolute -right-20 top-1/4 opacity-[0.03] pointer-events-none"
        animate={{ rotate: [0, 10, 0], y: [0, -30, 0] }}
        transition={{ duration: 16, repeat: Infinity, ease: 'easeInOut' }}
      >
        <svg width="400" height="400" viewBox={PUZZLE_VB}>
          <path d={PUZZLE_PATH} fill="white" />
        </svg>
      </motion.div>

      <div className="max-w-6xl mx-auto">
        <div className="flex items-center gap-3 mb-3">
          <svg width="20" height="20" viewBox={PUZZLE_VB}>
            <path d={PUZZLE_PATH} fill="rgba(245,158,11,0.25)" stroke="rgba(245,158,11,0.8)" strokeWidth="2.5" />
          </svg>
          <span className="text-amber-400 text-xs font-semibold tracking-[0.3em] uppercase">Testimonials</span>
        </div>

        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.1 }}
          className="text-3xl md:text-5xl font-bold mb-16"
          style={{ color: '#F1F5F9' }}
        >
          Voices That Complete<br />
          <span style={{ background: 'linear-gradient(135deg, #fcd34d, #f9a8d4)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
            The Picture
          </span>
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {testimonials.map((t, i) => (
            <TestimonialCard key={i} testimonial={t} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
