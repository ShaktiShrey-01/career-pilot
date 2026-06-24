import React from 'react';
import { motion } from 'framer-motion';
import { Github, Linkedin, Mail, ChevronDown } from 'lucide-react';
import PuzzlePiece from '../components/PuzzlePiece';
import PuzzleButton from '../components/PuzzleButton';
import { PUZZLE_PATH, PUZZLE_VIEWBOX, PIECE_EASE, COLORS } from '../utils/puzzleHelpers';

// ─── Variants (module-level — Volcanic_Forge convention) ─────────────────────

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.055, delayChildren: 0.4 } },
};

const letterVariants = {
  hidden:  { opacity: 0, y: 55, scale: 0.55, rotate: -18 },
  visible: { opacity: 1, y: 0,  scale: 1,    rotate: 0,
    transition: { type: 'spring', stiffness: 280, damping: 22 } },
};

// 4 image quadrant pieces — start scattered, converge on mount
const quadrantDefs = [
  { id: 'tl', clipPath: 'inset(0 50% 50% 0)', x: -130, y: -100, r: -20 },
  { id: 'tr', clipPath: 'inset(0 0 50% 50%)', x:  130, y: -100, r:  20 },
  { id: 'bl', clipPath: 'inset(50% 50% 0 0)', x: -130, y:  100, r:  15 },
  { id: 'br', clipPath: 'inset(50% 0 0 50%)', x:  130, y:  100, r: -15 },
];

const quadVariants = {
  hidden:  (q) => ({ opacity: 0, x: q.x, y: q.y, rotate: q.r, scale: 0.8 }),
  visible: { opacity: 1, x: 0,   y: 0,   rotate: 0,   scale: 1,
    transition: { type: 'spring', stiffness: 200, damping: 26, delay: 0.2 } },
};

const statsVariants = {
  hidden:  { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0,  transition: { duration: 0.6, ease: PIECE_EASE } },
};

export default function Hero({ personal, socials, stats }) {
  const nameParts = (personal?.name || 'Your Name').split(' ');

  return (
    <section
      className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden"
      style={{ background: COLORS.bg, zIndex: 1 }}
    >
      {/* Extra radial glow specific to hero */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 90% 60% at 50% 45%, rgba(109,40,217,0.22) 0%, transparent 65%)',
        }}
      />

      <div className="relative z-10 flex flex-col items-center text-center px-6 max-w-5xl mx-auto w-full">

        {/* Profile image — 4 quadrant puzzle pieces assembling */}
        <motion.div
          className="relative mb-8"
          style={{ width: 140, height: 140 }}
          initial="hidden"
          animate="visible"
        >
          {quadrantDefs.map((q) => (
            <motion.div
              key={q.id}
              custom={q}
              variants={quadVariants}
              className="absolute inset-0"
              style={{ clipPath: q.clipPath }}
            >
              {personal?.avatar ? (
                <img
                  src={personal.avatar}
                  alt={personal?.name}
                  className="w-full h-full object-cover rounded-2xl"
                  style={{ filter: 'brightness(0.9) saturate(1.15)' }}
                />
              ) : (
                <div
                  className="w-full h-full rounded-2xl"
                  style={{ background: 'linear-gradient(135deg, #3b0764, #06b6d4)' }}
                />
              )}
            </motion.div>
          ))}
          {/* Puzzle piece ring around avatar */}
          <motion.div
            className="absolute -inset-3 pointer-events-none"
            initial={{ opacity: 0, scale: 0.7 }}
            animate={{ opacity: 0.5, scale: 1 }}
            transition={{ delay: 1, duration: 0.5 }}
          >
            <svg viewBox={PUZZLE_VIEWBOX} className="w-full h-full">
              <path
                d={PUZZLE_PATH}
                fill="none"
                stroke="rgba(124,58,237,0.55)"
                strokeWidth="1.5"
              />
            </svg>
          </motion.div>
        </motion.div>

        {/* Label */}
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="text-xs font-bold tracking-[0.36em] uppercase mb-4"
          style={{ color: COLORS.violet }}
        >
          Puzzle Assembly — Portfolio
        </motion.p>

        {/* Name — letter-by-letter spring assembly */}
        <motion.h1
          className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-extrabold mb-4 flex flex-wrap justify-center gap-x-5"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {nameParts.map((word, wi) => (
            <span key={wi} className="flex">
              {word.split('').map((ch, ci) => (
                <motion.span
                  key={ci}
                  variants={letterVariants}
                  style={{
                    display: 'inline-block',
                    background: 'linear-gradient(160deg, #ffffff 25%, #a78bfa)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                  }}
                >
                  {ch}
                </motion.span>
              ))}
            </span>
          ))}
        </motion.h1>

        {/* Title */}
        <motion.p
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.1, duration: 0.55 }}
          className="text-lg md:text-2xl font-light mb-3"
          style={{ color: COLORS.muted }}
        >
          {personal?.title}
        </motion.p>

        {/* Tagline */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.3, duration: 0.55 }}
          className="text-sm md:text-base max-w-lg mb-10 leading-relaxed"
          style={{ color: COLORS.faint }}
        >
          {personal?.tagline}
        </motion.p>

        {/* CTA buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.5, duration: 0.5 }}
          className="flex flex-wrap gap-4 justify-center mb-16"
        >
          <PuzzleButton href={socials?.github} variant="primary" accentColor={COLORS.violet}>
            <Github size={15} /> View Work
          </PuzzleButton>
          <PuzzleButton href={socials?.linkedin} variant="outline">
            <Linkedin size={15} /> Connect
          </PuzzleButton>
          <PuzzleButton href={`mailto:${socials?.email || ''}`} variant="outline">
            <Mail size={15} /> Contact
          </PuzzleButton>
        </motion.div>

        {/* Stats */}
        <motion.div
          variants={{ visible: { transition: { staggerChildren: 0.1, delayChildren: 1.7 } } }}
          initial="hidden"
          animate="visible"
          className="flex gap-10 md:gap-20"
        >
          {[
            { label: 'Years',    value: stats?.yearsExperience },
            { label: 'Projects', value: stats?.projectsCompleted },
            { label: 'Clients',  value: stats?.happyClients },
          ].map((s) => (
            <motion.div key={s.label} variants={statsVariants} className="text-center">
              <div
                className="text-3xl font-bold"
                style={{
                  background: 'linear-gradient(135deg, #a78bfa, #67e8f9)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                {s.value}+
              </div>
              <div className="text-[10px] mt-1 tracking-widest uppercase" style={{ color: COLORS.faint }}>
                {s.label}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-1"
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
      >
        <span className="text-[10px] tracking-widest uppercase" style={{ color: COLORS.faint }}>
          Scroll
        </span>
        <ChevronDown size={18} style={{ color: COLORS.faint }} />
      </motion.div>
    </section>
  );
}
