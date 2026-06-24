import React from 'react';
import { motion } from 'framer-motion';
import { Github, Mail, ChevronDown, Linkedin } from 'lucide-react';

const PUZZLE_PATH =
  'M 20,0 L 42,0 C 42,-12 58,-12 58,0 L 100,0 L 100,42 C 112,42 112,58 100,58 L 100,100 L 58,100 C 58,112 42,112 42,100 L 0,100 L 0,58 C -12,58 -12,42 0,42 L 0,0 Z';
const PUZZLE_VB = '-15 -15 130 130';

function FloatingPiece({ size, x, y, rotate, opacity, stroke, dur, delay }) {
  return (
    <motion.div
      className="absolute pointer-events-none"
      style={{ width: size, height: size, left: x, top: y }}
      animate={{ y: [0, -28, 0], rotate: [rotate, rotate + 7, rotate], opacity: [opacity, opacity * 1.6, opacity] }}
      transition={{ duration: dur, delay, repeat: Infinity, ease: 'easeInOut' }}
    >
      <svg viewBox={PUZZLE_VB} className="w-full h-full">
        <path d={PUZZLE_PATH} fill="none" stroke={stroke} strokeWidth="1.5" />
      </svg>
    </motion.div>
  );
}

const BG_PIECES = [
  { size: 300, x: '-4%',  y: '3%',  rotate: 15,  opacity: 0.06, stroke: '#7C3AED', dur: 8,  delay: 0   },
  { size: 220, x: '72%',  y: '8%',  rotate: -22, opacity: 0.05, stroke: '#06B6D4', dur: 11, delay: 1   },
  { size: 380, x: '55%',  y: '50%', rotate: 38,  opacity: 0.04, stroke: '#7C3AED', dur: 13, delay: 2   },
  { size: 190, x: '8%',   y: '62%', rotate: -12, opacity: 0.07, stroke: '#F59E0B', dur: 9,  delay: 0.5 },
  { size: 260, x: '82%',  y: '70%', rotate: 28,  opacity: 0.05, stroke: '#06B6D4', dur: 12, delay: 1.5 },
  { size: 170, x: '42%',  y: '78%', rotate: -30, opacity: 0.06, stroke: '#7C3AED', dur: 7,  delay: 3   },
  { size: 140, x: '20%',  y: '15%', rotate: 50,  opacity: 0.04, stroke: '#F59E0B', dur: 10, delay: 2.5 },
];

const letterVariants = {
  hidden: { opacity: 0, y: 50, scale: 0.6, rotate: -15 },
  visible: { opacity: 1, y: 0, scale: 1, rotate: 0, transition: { type: 'spring', stiffness: 280, damping: 22 } },
};

export default function Hero({ data }) {
  const { personal, socials, stats } = data;

  return (
    <section
      className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden"
      style={{ background: '#080B14' }}
    >
      {/* Radial glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse 80% 50% at 50% 40%, rgba(109,40,217,0.18) 0%, transparent 70%)' }}
      />
      {/* Bottom fade */}
      <div
        className="absolute bottom-0 left-0 right-0 h-40 pointer-events-none z-10"
        style={{ background: 'linear-gradient(to bottom, transparent, #080B14)' }}
      />

      {/* Floating background puzzle pieces */}
      {BG_PIECES.map((p, i) => <FloatingPiece key={i} {...p} />)}

      {/* Main content */}
      <div className="relative z-20 flex flex-col items-center text-center px-6 max-w-5xl mx-auto w-full">
        {/* Puzzle icon badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0, rotate: -20 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          transition={{ delay: 0.1, type: 'spring', stiffness: 260 }}
          className="mb-8"
        >
          <svg width="56" height="56" viewBox={PUZZLE_VB}>
            <path
              d={PUZZLE_PATH}
              fill="rgba(124,58,237,0.18)"
              stroke="rgba(124,58,237,0.9)"
              strokeWidth="2.5"
            />
          </svg>
        </motion.div>

        {/* Label */}
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-violet-400 text-xs font-semibold tracking-[0.35em] uppercase mb-5"
        >
          Puzzle Assembly — Portfolio
        </motion.p>

        {/* Name — letter-by-letter puzzle animation */}
        <motion.h1
          className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-extrabold mb-5 flex flex-wrap justify-center gap-x-5"
          initial="hidden"
          animate="visible"
          variants={{ visible: { transition: { staggerChildren: 0.045, delayChildren: 0.5 } } }}
        >
          {(personal?.name || 'Your Name').split(' ').map((word, wi) => (
            <span key={wi} className="flex">
              {word.split('').map((ch, li) => (
                <motion.span
                  key={li}
                  variants={letterVariants}
                  style={{
                    display: 'inline-block',
                    background: 'linear-gradient(160deg, #ffffff 30%, #a78bfa)',
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
          transition={{ delay: 1.1 }}
          className="text-lg md:text-2xl text-slate-400 mb-3 font-light"
        >
          {personal?.title}
        </motion.p>

        {/* Tagline */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.35 }}
          className="text-slate-500 text-sm md:text-base max-w-lg mb-10 leading-relaxed"
        >
          {personal?.tagline}
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.55 }}
          className="flex flex-wrap gap-4 justify-center mb-16"
        >
          <motion.a
            href={socials?.github || '#'}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-7 py-3 rounded-full text-white text-sm font-semibold"
            style={{ background: 'linear-gradient(135deg, #7C3AED, #5B21B6)' }}
            whileHover={{ scale: 1.06, y: -2 }}
            whileTap={{ scale: 0.95 }}
          >
            <Github size={16} /> View Work
          </motion.a>
          <motion.a
            href={socials?.linkedin || '#'}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-7 py-3 rounded-full text-slate-300 text-sm font-semibold"
            style={{ border: '1px solid rgba(255,255,255,0.12)', background: 'rgba(255,255,255,0.04)' }}
            whileHover={{ scale: 1.06, y: -2, borderColor: 'rgba(124,58,237,0.5)' }}
            whileTap={{ scale: 0.95 }}
          >
            <Linkedin size={16} /> Connect
          </motion.a>
          <motion.a
            href={`mailto:${socials?.email || ''}`}
            className="flex items-center gap-2 px-7 py-3 rounded-full text-slate-300 text-sm font-semibold"
            style={{ border: '1px solid rgba(255,255,255,0.12)', background: 'rgba(255,255,255,0.04)' }}
            whileHover={{ scale: 1.06, y: -2, borderColor: 'rgba(6,182,212,0.5)' }}
            whileTap={{ scale: 0.95 }}
          >
            <Mail size={16} /> Contact
          </motion.a>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.75 }}
          className="flex gap-10 md:gap-20"
        >
          {[
            { label: 'Years', value: stats?.yearsExperience },
            { label: 'Projects', value: stats?.projectsCompleted },
            { label: 'Clients', value: stats?.happyClients },
          ].map((s, i) => (
            <div key={i} className="text-center">
              <div
                className="text-3xl font-bold"
                style={{ background: 'linear-gradient(135deg, #a78bfa, #67e8f9)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}
              >
                {s.value}+
              </div>
              <div className="text-xs text-slate-500 mt-1 tracking-wider uppercase">{s.label}</div>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-1"
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
      >
        <span className="text-[10px] text-slate-600 tracking-widest uppercase">Scroll</span>
        <ChevronDown className="text-slate-600" size={20} />
      </motion.div>
    </section>
  );
}
