import React, { useRef } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { MapPin, User, Briefcase } from 'lucide-react';
import PuzzleHeading from '../components/PuzzleHeading';
import { PUZZLE_PATH, PUZZLE_VIEWBOX, COLORS } from '../utils/puzzleHelpers';

// Avatar quadrant definitions (4 pieces that converge on scroll)
const AVATAR_QUADS = [
  { clipPath: 'inset(0 50% 50% 0 round 16px)', xStart: -80, yStart: -60 },
  { clipPath: 'inset(0 0 50% 50% round 16px)', xStart:  80, yStart: -60 },
  { clipPath: 'inset(50% 50% 0 0 round 16px)', xStart: -80, yStart:  60 },
  { clipPath: 'inset(50% 0 0 50% round 16px)', xStart:  80, yStart:  60 },
];

function StatTile({ value, label, delay }) {
  return (
    <motion.div
      className="relative flex flex-col items-center justify-center"
      style={{ width: 110, height: 110 }}
      initial={{ opacity: 0, scale: 0.6, y: 30 }}
      whileInView={{ opacity: 1, scale: 1, y: 0 }}
      viewport={{ once: true, amount: 0.6 }}
      transition={{ delay, type: 'spring', stiffness: 260, damping: 22 }}
      whileHover={{ scale: 1.08, y: -4 }}
    >
      <svg viewBox={PUZZLE_VIEWBOX} className="absolute inset-0 w-full h-full">
        <path d={PUZZLE_PATH} fill="rgba(124,58,237,0.1)" stroke="rgba(124,58,237,0.4)" strokeWidth="1.5" />
      </svg>
      <div className="relative z-10 text-center px-2">
        <div
          className="text-2xl font-bold"
          style={{
            background: 'linear-gradient(135deg, #a78bfa, #67e8f9)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}
        >
          {value}+
        </div>
        <div className="text-[9px] mt-0.5 tracking-wider uppercase leading-tight" style={{ color: COLORS.faint }}>
          {label}
        </div>
      </div>
    </motion.div>
  );
}

// Self-contained avatar piece — receives scroll-driven values as props
function AvatarQuad({ quad, progress, src, name }) {
  const x = useTransform(progress, [0, 1], [quad.xStart, 0]);
  const y = useTransform(progress, [0, 1], [quad.yStart, 0]);
  const opacity = useTransform(progress, [0.05, 0.6], [0, 1]);

  return (
    <motion.div
      className="absolute inset-0"
      style={{ clipPath: quad.clipPath, x, y, opacity }}
    >
      {src ? (
        <img
          src={src}
          alt={name}
          className="w-full h-full object-cover rounded-2xl"
          style={{ filter: 'brightness(0.9) saturate(1.1)' }}
        />
      ) : (
        <div
          className="w-full h-full rounded-2xl"
          style={{ background: 'linear-gradient(135deg, #3b0764, #06b6d4)' }}
        />
      )}
    </motion.div>
  );
}

export default function About({ personal, stats }) {
  const sectionRef = useRef(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'center center'],
  });

  const smooth = useSpring(scrollYProgress, { stiffness: 80, damping: 20 });

  // Bio halves slide inward as section scrolls into view
  const leftX       = useTransform(smooth, [0, 1], [-90, 0]);
  const rightX      = useTransform(smooth, [0, 1], [ 90, 0]);
  const textOpacity = useTransform(smooth, [0, 0.5], [0, 1]);

  // Avatar assembly progress (pieces converge as user scrolls in)
  const avatarProgress = useTransform(smooth, [0, 0.9], [0, 1]);
  const ringOpacity    = useTransform(smooth, [0.4, 1], [0, 0.5]);

  return (
    <section
      ref={sectionRef}
      className="relative py-28 px-6 overflow-hidden"
      style={{ background: COLORS.bg, zIndex: 1 }}
    >
      {/* Ambient right glow */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 45% 55% at 90% 50%, rgba(6,182,212,0.06) 0%, transparent 70%)',
        }}
      />

      <div className="max-w-6xl mx-auto">
        <PuzzleHeading
          label="About"
          title="The Pieces That Define Me"
          accentColor={COLORS.violet}
          gradientTo="#67e8f9"
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">

          {/* Left — Avatar quad assembly + stats */}
          <div className="flex flex-col items-center gap-8">
            <div className="relative" style={{ width: 200, height: 200 }}>
              {AVATAR_QUADS.map((q, i) => (
                <AvatarQuad
                  key={i}
                  quad={q}
                  progress={avatarProgress}
                  src={personal?.avatar}
                  name={personal?.name}
                />
              ))}

              {/* Outer puzzle ring — fades in after assembly */}
              <motion.div
                aria-hidden="true"
                className="absolute -inset-4 pointer-events-none"
                style={{ opacity: ringOpacity }}
              >
                <svg viewBox={PUZZLE_VIEWBOX} className="w-full h-full">
                  <path d={PUZZLE_PATH} fill="none" stroke="rgba(124,58,237,0.5)" strokeWidth="1.5" />
                </svg>
              </motion.div>

              {/* Ambient glow pulse */}
              <motion.div
                aria-hidden="true"
                className="absolute inset-0 rounded-2xl pointer-events-none"
                animate={{ opacity: [0.2, 0.5, 0.2] }}
                transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                style={{ boxShadow: '0 0 50px rgba(124,58,237,0.3)' }}
              />
            </div>

            {/* Stats */}
            <div className="flex gap-2">
              <StatTile value={stats?.yearsExperience}   label="Years Exp."  delay={0}    />
              <StatTile value={stats?.projectsCompleted} label="Projects"    delay={0.12} />
              <StatTile value={stats?.happyClients}      label="Clients"     delay={0.24} />
            </div>

            {personal?.location && (
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.5 }}
                className="flex items-center gap-2 text-sm"
                style={{ color: COLORS.faint }}
              >
                <MapPin size={13} style={{ color: COLORS.violet }} />
                {personal.location}
              </motion.div>
            )}
          </div>

          {/* Right — Bio + role cards sliding in */}
          <div className="flex flex-col gap-5">
            <motion.div
              style={{
                x: rightX,
                opacity: textOpacity,
                background: COLORS.surface,
                border: `1px solid ${COLORS.border}`,
                borderRadius: 16,
                padding: 24,
              }}
            >
              <div className="flex items-center gap-2 mb-3">
                <User size={13} style={{ color: COLORS.violet }} />
                <span className="text-xs font-bold tracking-wider uppercase" style={{ color: COLORS.violet }}>
                  Introduction
                </span>
              </div>
              <p className="text-sm md:text-base leading-relaxed" style={{ color: '#CBD5E1' }}>
                {personal?.bio}
              </p>
            </motion.div>

            <motion.div
              style={{
                x: leftX,
                opacity: textOpacity,
                background: 'rgba(124,58,237,0.08)',
                border: '1px solid rgba(124,58,237,0.25)',
                borderRadius: 16,
                padding: 24,
              }}
            >
              <div className="flex items-center gap-2 mb-2">
                <Briefcase size={13} style={{ color: COLORS.violet }} />
                <span className="text-xs font-bold tracking-wider uppercase" style={{ color: COLORS.violet }}>
                  Current Role
                </span>
              </div>
              <p className="font-semibold text-lg" style={{ color: COLORS.text }}>
                {personal?.title}
              </p>
            </motion.div>

            {/* Decorative assembled piece trail */}
            <motion.div
              style={{ opacity: textOpacity }}
              className="flex items-center gap-3 pt-2"
            >
              {[0.12, 0.22, 0.35].map((op, i) => (
                <motion.div
                  key={i}
                  animate={{ opacity: [op, op * 2.2, op], scale: [1, 1.12, 1] }}
                  transition={{ duration: 3 + i * 0.6, repeat: Infinity, delay: i * 0.7, ease: 'easeInOut' }}
                >
                  <svg width="28" height="28" viewBox={PUZZLE_VIEWBOX}>
                    <path d={PUZZLE_PATH} fill="rgba(124,58,237,0.15)" stroke="rgba(124,58,237,0.5)" strokeWidth="2" />
                  </svg>
                </motion.div>
              ))}
              <span className="text-xs" style={{ color: COLORS.faint }}>
                Every piece connects.
              </span>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
