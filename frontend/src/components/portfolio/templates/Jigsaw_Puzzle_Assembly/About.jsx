import React from 'react';
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { MapPin, User, Briefcase } from 'lucide-react';

const PUZZLE_PATH =
  'M 20,0 L 42,0 C 42,-12 58,-12 58,0 L 100,0 L 100,42 C 112,42 112,58 100,58 L 100,100 L 58,100 C 58,112 42,112 42,100 L 0,100 L 0,58 C -12,58 -12,42 0,42 L 0,0 Z';
const PUZZLE_VB = '-15 -15 130 130';

function SectionLabel({ children }) {
  return (
    <div className="flex items-center gap-3 mb-3">
      <svg width="22" height="22" viewBox={PUZZLE_VB} className="flex-shrink-0">
        <path d={PUZZLE_PATH} fill="rgba(124,58,237,0.25)" stroke="rgba(124,58,237,0.8)" strokeWidth="2.5" />
      </svg>
      <span className="text-violet-400 text-xs font-semibold tracking-[0.3em] uppercase">{children}</span>
    </div>
  );
}

function StatPiece({ value, label, delay }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, scale: 0.7, y: 20 }}
      animate={inView ? { opacity: 1, scale: 1, y: 0 } : {}}
      transition={{ delay, type: 'spring', stiffness: 240 }}
      className="relative flex flex-col items-center justify-center p-5"
      style={{ width: 120, height: 120 }}
    >
      <svg viewBox={PUZZLE_VB} className="absolute inset-0 w-full h-full">
        <path
          d={PUZZLE_PATH}
          fill="rgba(124,58,237,0.08)"
          stroke="rgba(124,58,237,0.3)"
          strokeWidth="1.5"
        />
      </svg>
      <div className="relative z-10 text-center">
        <div
          className="text-2xl font-bold"
          style={{ background: 'linear-gradient(135deg, #a78bfa, #67e8f9)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}
        >
          {value}+
        </div>
        <div className="text-[10px] text-slate-500 mt-0.5 tracking-wider uppercase leading-tight">{label}</div>
      </div>
    </motion.div>
  );
}

export default function About({ data }) {
  const { personal, stats } = data;
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.2 });

  return (
    <section
      ref={ref}
      className="relative py-28 px-6 overflow-hidden"
      style={{ background: '#080B14' }}
    >
      {/* Section divider glow */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-20 pointer-events-none"
        style={{ background: 'linear-gradient(to bottom, transparent, rgba(124,58,237,0.5), transparent)' }}
      />

      <div className="max-w-6xl mx-auto">
        <SectionLabel>About</SectionLabel>

        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.1 }}
          className="text-3xl md:text-5xl font-bold mb-16 max-w-xl"
          style={{ color: '#F1F5F9' }}
        >
          The Pieces That<br />
          <span style={{ background: 'linear-gradient(135deg, #a78bfa, #67e8f9)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
            Define Me
          </span>
        </motion.h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          {/* Left — Avatar + stats */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: 0.2, type: 'spring', stiffness: 120 }}
            className="flex flex-col items-center gap-8"
          >
            {/* Avatar in puzzle frame */}
            <div className="relative" style={{ width: 220, height: 220 }}>
              <svg viewBox={PUZZLE_VB} className="absolute inset-0 w-full h-full">
                <defs>
                  <clipPath id="avatarClip">
                    <path d={PUZZLE_PATH} />
                  </clipPath>
                </defs>
                <path
                  d={PUZZLE_PATH}
                  fill="none"
                  stroke="rgba(124,58,237,0.6)"
                  strokeWidth="2"
                />
              </svg>
              {personal?.avatar && (
                <div
                  className="absolute inset-0"
                  style={{
                    clipPath: `path('${PUZZLE_PATH}')`,
                    // Approximation: just use a rounded square since clip-path: path() coordinates don't scale
                  }}
                >
                  <img
                    src={personal.avatar}
                    alt={personal?.name}
                    className="w-full h-full object-cover rounded-2xl"
                    style={{ filter: 'brightness(0.9) saturate(1.1)' }}
                  />
                </div>
              )}
              {/* Glow ring */}
              <motion.div
                className="absolute inset-0 rounded-2xl pointer-events-none"
                animate={{ opacity: [0.3, 0.7, 0.3] }}
                transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                style={{ boxShadow: '0 0 40px rgba(124,58,237,0.35)', borderRadius: '50%' }}
              />
            </div>

            {/* Stats grid */}
            <div className="flex gap-2">
              <StatPiece value={stats?.yearsExperience} label="Years Exp." delay={0.4} />
              <StatPiece value={stats?.projectsCompleted} label="Projects" delay={0.55} />
              <StatPiece value={stats?.happyClients} label="Clients" delay={0.7} />
            </div>

            {/* Location */}
            {personal?.location && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={inView ? { opacity: 1 } : {}}
                transition={{ delay: 0.9 }}
                className="flex items-center gap-2 text-slate-500 text-sm"
              >
                <MapPin size={14} className="text-violet-500" />
                {personal.location}
              </motion.div>
            )}
          </motion.div>

          {/* Right — Bio + info cards */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: 0.3, type: 'spring', stiffness: 120 }}
            className="flex flex-col gap-6"
          >
            {/* Bio */}
            <div
              className="p-6 rounded-2xl"
              style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
            >
              <div className="flex items-center gap-2 mb-3">
                <User size={14} className="text-violet-400" />
                <span className="text-xs text-violet-400 font-semibold tracking-wider uppercase">Introduction</span>
              </div>
              <p className="text-slate-300 leading-relaxed text-sm md:text-base">
                {personal?.bio}
              </p>
            </div>

            {/* Title card */}
            <div
              className="p-6 rounded-2xl"
              style={{ background: 'rgba(124,58,237,0.08)', border: '1px solid rgba(124,58,237,0.25)' }}
            >
              <div className="flex items-center gap-2 mb-2">
                <Briefcase size={14} className="text-violet-400" />
                <span className="text-xs text-violet-400 font-semibold tracking-wider uppercase">Current Role</span>
              </div>
              <p className="text-slate-100 font-semibold text-lg">{personal?.title}</p>
            </div>

            {/* Connecting puzzle piece decorations */}
            <div className="flex items-center gap-4 pt-2">
              {[0.1, 0.25, 0.4].map((op, i) => (
                <motion.div
                  key={i}
                  animate={{ opacity: [op, op * 2, op], scale: [1, 1.1, 1] }}
                  transition={{ duration: 3 + i, repeat: Infinity, delay: i * 0.8, ease: 'easeInOut' }}
                >
                  <svg width="32" height="32" viewBox={PUZZLE_VB}>
                    <path d={PUZZLE_PATH} fill="rgba(124,58,237,0.15)" stroke="rgba(124,58,237,0.5)" strokeWidth="2" />
                  </svg>
                </motion.div>
              ))}
              <span className="text-xs text-slate-600 ml-1">Every piece connects.</span>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
