import React, { useState, useRef } from 'react';
import {
  motion, AnimatePresence,
  useInView, useScroll, useTransform, useSpring, useMotionValue,
} from 'framer-motion';
import {
  Github, Linkedin, Mail, ChevronDown, MapPin, User, Briefcase,
  ExternalLink, Puzzle, Calendar, Quote, Twitter, Send, CheckCircle,
} from 'lucide-react';
import { usePortfolio } from '../../../../context/PortfolioContext';

// ─────────────────────────────────────────────────────────────────────────────
// CONSTANTS
// ─────────────────────────────────────────────────────────────────────────────

const PUZZLE_PATH =
  'M 20,0 L 42,0 C 42,-12 58,-12 58,0 L 100,0 L 100,42 C 112,42 112,58 100,58 L 100,100 L 58,100 C 58,112 42,112 42,100 L 0,100 L 0,58 C -12,58 -12,42 0,42 L 0,0 Z';
const PUZZLE_VB = '-15 -15 130 130';
const PIECE_EASE = [0.34, 1.56, 0.64, 1];

// Light warm palette — cream puzzle-board theme
const C = {
  bg:      '#F5F0EB',
  surface: 'rgba(255,255,255,0.82)',
  border:  'rgba(139,116,94,0.22)',
  violet:  '#6D28D9',
  cyan:    '#0E7490',
  amber:   '#B45309',
  text:    '#1C1728',
  muted:   '#5B4F6B',
  faint:   '#9480AA',
};

const COLOR_MAP = {
  Frontend: { fill: 'rgba(109,40,217,0.08)', stroke: 'rgba(109,40,217,0.45)', text: '#5B21B6', glow: 'rgba(109,40,217,0.25)' },
  Backend:  { fill: 'rgba(14,116,144,0.08)', stroke: 'rgba(14,116,144,0.45)', text: '#0E7490', glow: 'rgba(14,116,144,0.25)' },
  DevOps:   { fill: 'rgba(180,83,9,0.08)',   stroke: 'rgba(180,83,9,0.45)',   text: '#92400E', glow: 'rgba(180,83,9,0.25)'   },
  Design:   { fill: 'rgba(190,18,60,0.08)',  stroke: 'rgba(190,18,60,0.45)',  text: '#BE123C', glow: 'rgba(190,18,60,0.25)'  },
  Core:     { fill: 'rgba(109,40,217,0.08)', stroke: 'rgba(109,40,217,0.45)', text: '#5B21B6', glow: 'rgba(109,40,217,0.25)' },
};

const SKILL_SCATTER = [
  {x:-180,y:-120,r:-22},{x:160,y:-100,r:18},{x:-140,y:80,r:30},{x:200,y:60,r:-15},
  {x:-60,y:-160,r:25},{x:100,y:140,r:-28},{x:-200,y:20,r:12},{x:140,y:-150,r:-20},
  {x:-80,y:120,r:35},{x:180,y:100,r:-10},{x:-120,y:-60,r:20},{x:60,y:-130,r:-32},
  {x:-160,y:160,r:15},{x:120,y:-80,r:28},{x:-40,y:180,r:-18},
];

const TECH_COLORS = ['#5B21B6','#0E7490','#92400E','#166534','#991B1B','#9D174D'];

const CARD_ACCENTS = [
  { fill:'rgba(109,40,217,0.07)', border:'rgba(109,40,217,0.22)', dot:'#6D28D9' },
  { fill:'rgba(14,116,144,0.07)', border:'rgba(14,116,144,0.22)', dot:'#0E7490' },
  { fill:'rgba(180,83,9,0.07)',   border:'rgba(180,83,9,0.22)',   dot:'#B45309' },
  { fill:'rgba(190,18,60,0.07)',  border:'rgba(190,18,60,0.22)',  dot:'#BE123C' },
];

const FINAL_PIECES = [
  {size:80,xStart:-300,yStart:-200,rotate:30, color:'#6D28D9',delay:0   },
  {size:65,xStart: 300,yStart:-200,rotate:-25,color:'#0E7490',delay:0.08},
  {size:90,xStart:-350,yStart:   0,rotate:15, color:'#B45309',delay:0.16},
  {size:70,xStart: 350,yStart:   0,rotate:-20,color:'#6D28D9',delay:0.24},
  {size:75,xStart:-300,yStart: 200,rotate:35, color:'#0E7490',delay:0.32},
  {size:60,xStart: 300,yStart: 200,rotate:-30,color:'#B45309',delay:0.40},
];

const SOCIAL_LINKS = [
  {key:'github',  Icon:Github,  label:'GitHub',  color:'#6D28D9'},
  {key:'linkedin',Icon:Linkedin,label:'LinkedIn',color:'#0E7490'},
  {key:'twitter', Icon:Twitter, label:'Twitter', color:'#B45309'},
  {key:'email',   Icon:Mail,    label:'Email',   color:'#BE123C',isEmail:true},
];

// ─────────────────────────────────────────────────────────────────────────────
// ANIMATED JIGSAW BACKGROUND — light cream board with drifting puzzle pattern
// ─────────────────────────────────────────────────────────────────────────────

const JIGSAW_BG_SVG = encodeURIComponent(
  `<svg xmlns="http://www.w3.org/2000/svg" width="120" height="120">` +
  `<rect x="8" y="8" width="104" height="104" rx="6" fill="rgba(255,252,248,0.55)" stroke="rgba(160,130,100,0.22)" stroke-width="1.4"/>` +
  `<circle cx="60" cy="8"   r="13" fill="rgba(250,245,238,0.6)" stroke="rgba(160,130,100,0.22)" stroke-width="1.4"/>` +
  `<circle cx="112" cy="60" r="13" fill="rgba(250,245,238,0.6)" stroke="rgba(160,130,100,0.22)" stroke-width="1.4"/>` +
  `<circle cx="60" cy="112" r="13" fill="rgba(250,245,238,0.6)" stroke="rgba(160,130,100,0.22)" stroke-width="1.4"/>` +
  `<circle cx="8"  cy="60"  r="13" fill="rgba(250,245,238,0.6)" stroke="rgba(160,130,100,0.22)" stroke-width="1.4"/>` +
  `</svg>`
);

const BG_CSS = `
  @keyframes jigsawDrift {
    0%   { background-position: 0px 0px; }
    100% { background-position: 120px 120px; }
  }
`;

function JigsawBackground() {
  return (
    <>
      <style>{BG_CSS}</style>
      {/* Base board color */}
      <div className="fixed inset-0 pointer-events-none" style={{ zIndex: 0, backgroundColor: C.bg }} />
      {/* Drifting puzzle pattern */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          zIndex: 0,
          backgroundImage: `url("data:image/svg+xml,${JIGSAW_BG_SVG}")`,
          backgroundSize: '120px 120px',
          animation: 'jigsawDrift 26s linear infinite',
        }}
      />
      {/* Subtle warm vignette */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          zIndex: 0,
          background: 'radial-gradient(ellipse 85% 65% at 50% 40%, transparent 40%, rgba(200,175,145,0.15) 100%)',
        }}
      />
    </>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// PUZZLE ASSEMBLE — wraps ANY content and assembles it like puzzle pieces
// ─────────────────────────────────────────────────────────────────────────────
// Strategy: render children once (ghost) for natural height, then render
// 4 clipped absolutely-positioned copies that start scattered and converge.

const CLIPS = [
  'inset(0% 50% 50% 0% round 3px)',  // top-left  quadrant
  'inset(0% 0% 50% 50% round 3px)',  // top-right
  'inset(50% 50% 0% 0% round 3px)',  // bottom-left
  'inset(50% 0% 0% 50% round 3px)',  // bottom-right
];
const SCATTER = [
  { x: -100, y: -75, r: -18 },
  { x:  100, y: -75, r:  18 },
  { x: -100, y:  75, r:  14 },
  { x:  100, y:  75, r: -14 },
];

function PuzzleAssemble({ children, className = '', delay = 0, triggerAmount = 0.2 }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: triggerAmount });

  return (
    <div ref={ref} className={`relative ${className}`}>
      {/* Ghost render — establishes natural height so parent isn't 0 */}
      <div style={{ visibility: 'hidden', pointerEvents: 'none' }} aria-hidden="true">
        {children}
      </div>

      {/* 4 puzzle-piece quadrant clones that fly in and assemble */}
      {CLIPS.map((clip, i) => (
        <motion.div
          key={i}
          className="absolute inset-0"
          style={{ clipPath: clip, overflow: 'hidden' }}
          initial={{ x: SCATTER[i].x, y: SCATTER[i].y, rotate: SCATTER[i].r, opacity: 0 }}
          animate={inView ? { x: 0, y: 0, rotate: 0, opacity: 1 } : {}}
          transition={{ delay: delay + i * 0.09, type: 'spring', stiffness: 180, damping: 24 }}
        >
          {children}
        </motion.div>
      ))}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// SHARED UI COMPONENTS
// ─────────────────────────────────────────────────────────────────────────────

const headingLetterVariants = {
  hidden:  { opacity: 0, y: 28, rotate: -10, scale: 0.75 },
  visible: (i) => ({
    opacity: 1, y: 0, rotate: 0, scale: 1,
    transition: { type: 'spring', stiffness: 300, damping: 24, delay: i * 0.038 },
  }),
};

function PuzzleHeading({ label, title, accentColor = C.violet, gradientTo = C.cyan }) {
  const words = title.split(' ');
  let gi = 0;
  return (
    <div className="mb-10">
      {label && (
        <motion.div
          initial={{ opacity: 0, x: -16 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.45, ease: PIECE_EASE }}
          className="flex items-center gap-2.5 mb-3"
        >
          <svg width="16" height="16" viewBox={PUZZLE_VB} aria-hidden="true">
            <path d={PUZZLE_PATH} fill={`${accentColor}28`} stroke={`${accentColor}cc`} strokeWidth="2.5" />
          </svg>
          <span className="text-xs font-bold tracking-[0.3em] uppercase" style={{ color: accentColor }}>
            {label}
          </span>
        </motion.div>
      )}
      <motion.h2
        className="text-3xl md:text-5xl font-extrabold flex flex-wrap gap-x-3 gap-y-1"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.5 }}
      >
        {words.map((word, wi) => (
          <span key={wi} className="flex">
            {word.split('').map((ch, ci) => {
              const idx = gi++;
              return (
                <motion.span
                  key={ci}
                  custom={idx}
                  variants={headingLetterVariants}
                  style={{
                    display: 'inline-block',
                    background: `linear-gradient(140deg, ${C.text} 30%, ${accentColor})`,
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
      <motion.div
        initial={{ scaleX: 0, originX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.65, delay: 0.3, ease: PIECE_EASE }}
        className="h-0.5 w-16 mt-4 rounded-full"
        style={{ background: `linear-gradient(90deg, ${accentColor}, ${gradientTo})` }}
      />
    </div>
  );
}

const btnCornerV = {
  rest:  { opacity: 0, scale: 0.4 },
  hover: { opacity: 0.75, scale: 1, transition: { type: 'spring', stiffness: 380, damping: 20 } },
};

function PuzzleButton({ children, href, onClick, variant = 'primary', accentColor = C.violet, as: Tag = 'button' }) {
  const El = href ? 'a' : Tag;
  const extra = href ? { href, target: '_blank', rel: 'noopener noreferrer' } : { onClick };
  const isPrimary = variant === 'primary';
  return (
    <motion.div initial="rest" whileHover="hover" whileTap={{ scale: 0.96 }} className="relative inline-flex">
      <El
        {...extra}
        className="relative flex items-center gap-2 px-7 py-3 rounded-full text-sm font-semibold overflow-hidden select-none"
        style={
          isPrimary
            ? { background: `linear-gradient(135deg, ${accentColor}, #4C1D95)`, color: '#fff' }
            : { border: `1px solid ${C.border}`, background: C.surface, color: C.muted,
                backdropFilter: 'blur(8px)' }
        }
      >
        {isPrimary && (
          <motion.span
            variants={{ rest: { x: '-110%' }, hover: { x: '110%', transition: { duration: 0.4 } } }}
            aria-hidden="true"
            style={{ position: 'absolute', inset: 0, background: 'linear-gradient(90deg,transparent,rgba(255,255,255,0.2),transparent)', pointerEvents: 'none' }}
          />
        )}
        {children}
      </El>
      <motion.div variants={btnCornerV} aria-hidden="true" className="absolute -top-2 -right-2 pointer-events-none">
        <svg width="18" height="18" viewBox={PUZZLE_VB}>
          <path d={PUZZLE_PATH} fill={`${accentColor}22`} stroke={`${accentColor}88`} strokeWidth="2" />
        </svg>
      </motion.div>
      <motion.div variants={btnCornerV} aria-hidden="true" className="absolute -bottom-2 -left-2 pointer-events-none">
        <svg width="14" height="14" viewBox={PUZZLE_VB}>
          <path d={PUZZLE_PATH} fill={`${accentColor}18`} stroke={`${accentColor}70`} strokeWidth="2" />
        </svg>
      </motion.div>
    </motion.div>
  );
}

function InputField({ label, type = 'text', value, onChange, placeholder, multiline }) {
  const El = multiline ? 'textarea' : 'input';
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-bold tracking-wider uppercase" style={{ color: C.faint }}>{label}</label>
      <El
        type={type} value={value} onChange={onChange} placeholder={placeholder}
        rows={multiline ? 4 : undefined}
        className="w-full rounded-xl px-4 py-3 text-sm outline-none resize-none transition-all"
        style={{ background: C.surface, border: `1px solid ${C.border}`, color: C.text }}
        onFocus={e => (e.target.style.borderColor = `${C.violet}88`)}
        onBlur={e  => (e.target.style.borderColor = C.border)}
      />
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// HERO
// ─────────────────────────────────────────────────────────────────────────────

const heroNameVariants = {
  hidden:  {},
  visible: { transition: { staggerChildren: 0.05, delayChildren: 0.5 } },
};
const heroLetterV = {
  hidden:  { opacity: 0, y: 50, scale: 0.55, rotate: -16 },
  visible: { opacity: 1, y: 0, scale: 1, rotate: 0,
    transition: { type: 'spring', stiffness: 270, damping: 22 } },
};
const heroQuadDefs = [
  { id: 'tl', clipPath: 'inset(0 50% 50% 0)', x: -130, y: -100, r: -20 },
  { id: 'tr', clipPath: 'inset(0 0 50% 50%)', x:  130, y: -100, r:  20 },
  { id: 'bl', clipPath: 'inset(50% 50% 0 0)', x: -130, y:  100, r:  15 },
  { id: 'br', clipPath: 'inset(50% 0 0 50%)', x:  130, y:  100, r: -15 },
];
const heroQuadV = {
  hidden:  q => ({ opacity: 0, x: q.x, y: q.y, rotate: q.r, scale: 0.8 }),
  visible: { opacity: 1, x: 0, y: 0, rotate: 0, scale: 1,
    transition: { type: 'spring', stiffness: 190, damping: 26, delay: 0.2 } },
};

function Hero({ personal, socials, stats }) {
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden" style={{ zIndex: 1 }}>
      {/* Soft hero glow */}
      <div className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse 80% 55% at 50% 45%, rgba(109,40,217,0.09) 0%, transparent 70%)' }} />

      <div className="relative z-10 flex flex-col items-center text-center px-6 max-w-5xl mx-auto w-full">

        {/* Profile image — 4 quadrant puzzle assembly */}
        <motion.div className="relative mb-8" style={{ width: 148, height: 148 }}
          initial="hidden" animate="visible">
          {heroQuadDefs.map(q => (
            <motion.div key={q.id} custom={q} variants={heroQuadV}
              className="absolute inset-0" style={{ clipPath: q.clipPath }}>
              {personal?.avatar
                ? <img src={personal.avatar} alt={personal?.name} className="w-full h-full object-cover rounded-2xl" style={{ filter: 'saturate(1.05)' }} />
                : <div className="w-full h-full rounded-2xl" style={{ background: 'linear-gradient(135deg, #5B21B6, #0E7490)' }} />}
            </motion.div>
          ))}
          {/* Ring */}
          <motion.div className="absolute -inset-3 pointer-events-none"
            initial={{ opacity: 0, scale: 0.7 }} animate={{ opacity: 0.45, scale: 1 }}
            transition={{ delay: 0.9, duration: 0.5 }}>
            <svg viewBox={PUZZLE_VB} className="w-full h-full">
              <path d={PUZZLE_PATH} fill="none" stroke="rgba(109,40,217,0.5)" strokeWidth="1.5" />
            </svg>
          </motion.div>
        </motion.div>

        {/* Label */}
        <motion.p initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-xs font-bold tracking-[0.35em] uppercase mb-4"
          style={{ color: C.violet }}>
          Puzzle Assembly — Portfolio
        </motion.p>

        {/* Name assembly */}
        <motion.h1
          className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-extrabold mb-4 flex flex-wrap justify-center gap-x-5"
          variants={heroNameVariants} initial="hidden" animate="visible">
          {(personal?.name || 'Your Name').split(' ').map((word, wi) => (
            <span key={wi} className="flex">
              {word.split('').map((ch, ci) => (
                <motion.span key={ci} variants={heroLetterV}
                  style={{ display: 'inline-block', background: `linear-gradient(155deg, ${C.text} 20%, ${C.violet})`,
                    WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                  {ch}
                </motion.span>
              ))}
            </span>
          ))}
        </motion.h1>

        {/* Title */}
        <motion.p initial={{ opacity: 0, y: 22 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.1, duration: 0.55 }}
          className="text-lg md:text-2xl font-light mb-3" style={{ color: C.muted }}>
          {personal?.title}
        </motion.p>

        {/* Tagline */}
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          transition={{ delay: 1.3, duration: 0.5 }}
          className="text-sm md:text-base max-w-lg mb-10 leading-relaxed" style={{ color: C.faint }}>
          {personal?.tagline}
        </motion.p>

        {/* CTAs — assembled via PuzzleAssemble */}
        <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.5 }}
          className="flex flex-wrap gap-4 justify-center mb-14">
          <PuzzleButton href={socials?.github} variant="primary" accentColor={C.violet}>
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
          initial="hidden" animate="visible" className="flex gap-10 md:gap-20">
          {[
            { label: 'Years',    value: stats?.yearsExperience },
            { label: 'Projects', value: stats?.projectsCompleted },
            { label: 'Clients',  value: stats?.happyClients },
          ].map(s => (
            <motion.div key={s.label}
              variants={{ hidden: { opacity: 0, y: 35 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: PIECE_EASE } } }}
              className="text-center">
              <div className="text-3xl font-bold"
                style={{ background: `linear-gradient(135deg, ${C.violet}, ${C.cyan})`,
                  WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                {s.value}+
              </div>
              <div className="text-[10px] mt-1 tracking-widest uppercase" style={{ color: C.faint }}>{s.label}</div>
            </motion.div>
          ))}
        </motion.div>
      </div>

      <motion.div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-1"
        animate={{ y: [0, 10, 0] }} transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}>
        <span className="text-[10px] tracking-widest uppercase" style={{ color: C.faint }}>Scroll</span>
        <ChevronDown size={18} style={{ color: C.faint }} />
      </motion.div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// ABOUT
// ─────────────────────────────────────────────────────────────────────────────

const AVATAR_QUADS = [
  { clipPath: 'inset(0 50% 50% 0 round 14px)', xStart: -80, yStart: -60 },
  { clipPath: 'inset(0 0 50% 50% round 14px)', xStart:  80, yStart: -60 },
  { clipPath: 'inset(50% 50% 0 0 round 14px)', xStart: -80, yStart:  60 },
  { clipPath: 'inset(50% 0 0 50% round 14px)', xStart:  80, yStart:  60 },
];

function AvatarQuad({ quad, progress, src, name }) {
  const x = useTransform(progress, [0, 1], [quad.xStart, 0]);
  const y = useTransform(progress, [0, 1], [quad.yStart, 0]);
  const opacity = useTransform(progress, [0.05, 0.65], [0, 1]);
  return (
    <motion.div className="absolute inset-0" style={{ clipPath: quad.clipPath, x, y, opacity }}>
      {src
        ? <img src={src} alt={name} className="w-full h-full object-cover rounded-2xl" />
        : <div className="w-full h-full rounded-2xl" style={{ background: 'linear-gradient(135deg,#5B21B6,#0E7490)' }} />}
    </motion.div>
  );
}

function StatTile({ value, label, delay }) {
  return (
    <motion.div className="relative flex flex-col items-center justify-center"
      style={{ width: 110, height: 110 }}
      initial={{ opacity: 0, scale: 0.6, y: 28 }}
      whileInView={{ opacity: 1, scale: 1, y: 0 }}
      viewport={{ once: true, amount: 0.6 }}
      transition={{ delay, type: 'spring', stiffness: 260, damping: 22 }}
      whileHover={{ scale: 1.08, y: -4 }}>
      <svg viewBox={PUZZLE_VB} className="absolute inset-0 w-full h-full">
        <path d={PUZZLE_PATH} fill="rgba(109,40,217,0.08)" stroke="rgba(109,40,217,0.32)" strokeWidth="1.5" />
      </svg>
      <div className="relative z-10 text-center px-2">
        <div className="text-2xl font-bold"
          style={{ background: `linear-gradient(135deg,${C.violet},${C.cyan})`,
            WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text' }}>
          {value}+
        </div>
        <div className="text-[9px] mt-0.5 tracking-wider uppercase leading-tight" style={{ color: C.faint }}>
          {label}
        </div>
      </div>
    </motion.div>
  );
}

function About({ personal, stats }) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'center center'] });
  const smooth = useSpring(scrollYProgress, { stiffness: 80, damping: 20 });
  const avatarProgress = useTransform(smooth, [0, 0.9], [0, 1]);
  const ringOpacity    = useTransform(smooth, [0.4, 1], [0, 0.5]);

  return (
    <section ref={ref} className="relative py-28 px-6 overflow-hidden" style={{ zIndex: 1 }}>
      <div className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse 40% 50% at 88% 50%, rgba(14,116,144,0.06) 0%, transparent 70%)' }} />

      <div className="max-w-6xl mx-auto">
        <PuzzleHeading label="About" title="The Pieces That Define Me" accentColor={C.violet} gradientTo={C.cyan} />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">

          {/* Left — avatar + stats wrapped in PuzzleAssemble */}
          <PuzzleAssemble delay={0.1} className="flex flex-col items-center gap-8">
            <div className="relative" style={{ width: 200, height: 200 }}>
              {AVATAR_QUADS.map((q, i) => (
                <AvatarQuad key={i} quad={q} progress={avatarProgress}
                  src={personal?.avatar} name={personal?.name} />
              ))}
              <motion.div aria-hidden="true" className="absolute -inset-4 pointer-events-none"
                style={{ opacity: ringOpacity }}>
                <svg viewBox={PUZZLE_VB} className="w-full h-full">
                  <path d={PUZZLE_PATH} fill="none" stroke="rgba(109,40,217,0.4)" strokeWidth="1.5" />
                </svg>
              </motion.div>
              <motion.div aria-hidden="true" className="absolute inset-0 rounded-2xl pointer-events-none"
                animate={{ opacity: [0.15, 0.4, 0.15] }}
                transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
                style={{ boxShadow: '0 0 40px rgba(109,40,217,0.2)' }} />
            </div>
            <div className="flex gap-2">
              <StatTile value={stats?.yearsExperience}   label="Years Exp."  delay={0}    />
              <StatTile value={stats?.projectsCompleted} label="Projects"    delay={0.12} />
              <StatTile value={stats?.happyClients}      label="Clients"     delay={0.24} />
            </div>
            {personal?.location && (
              <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }}
                viewport={{ once: true }} transition={{ delay: 0.5 }}
                className="flex items-center gap-2 text-sm" style={{ color: C.faint }}>
                <MapPin size={13} style={{ color: C.violet }} /> {personal.location}
              </motion.div>
            )}
          </PuzzleAssemble>

          {/* Right — bio cards wrapped in PuzzleAssemble */}
          <PuzzleAssemble delay={0.2} className="flex flex-col gap-5">
            <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 16, padding: 24, backdropFilter: 'blur(8px)' }}>
              <div className="flex items-center gap-2 mb-3">
                <User size={13} style={{ color: C.violet }} />
                <span className="text-xs font-bold tracking-wider uppercase" style={{ color: C.violet }}>Introduction</span>
              </div>
              <p className="text-sm md:text-base leading-relaxed" style={{ color: C.muted }}>
                {personal?.bio}
              </p>
            </div>
            <div style={{ background: 'rgba(109,40,217,0.06)', border: '1px solid rgba(109,40,217,0.2)', borderRadius: 16, padding: 24 }}>
              <div className="flex items-center gap-2 mb-2">
                <Briefcase size={13} style={{ color: C.violet }} />
                <span className="text-xs font-bold tracking-wider uppercase" style={{ color: C.violet }}>Current Role</span>
              </div>
              <p className="font-semibold text-lg" style={{ color: C.text }}>{personal?.title}</p>
            </div>
            <div className="flex items-center gap-3 pt-2">
              {[0.15, 0.28, 0.42].map((op, i) => (
                <motion.div key={i} animate={{ opacity: [op, op * 2, op], scale: [1, 1.1, 1] }}
                  transition={{ duration: 3 + i * 0.6, repeat: Infinity, delay: i * 0.7, ease: 'easeInOut' }}>
                  <svg width="26" height="26" viewBox={PUZZLE_VB}>
                    <path d={PUZZLE_PATH} fill="rgba(109,40,217,0.12)" stroke="rgba(109,40,217,0.4)" strokeWidth="2" />
                  </svg>
                </motion.div>
              ))}
              <span className="text-xs" style={{ color: C.faint }}>Every piece connects.</span>
            </div>
          </PuzzleAssemble>
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// SKILLS
// ─────────────────────────────────────────────────────────────────────────────

function SkillPiece({ skill, index, hoveredSkill, onHover, onLeave }) {
  const scatter = SKILL_SCATTER[index % SKILL_SCATTER.length];
  const colors  = COLOR_MAP[skill.category] || COLOR_MAP.Core;
  const isNeighbor = hoveredSkill && hoveredSkill !== skill.name;

  return (
    <motion.div
      className="relative flex flex-col items-center justify-center cursor-default select-none"
      style={{ width: 130, height: 130 }}
      initial={{ opacity: 0, x: scatter.x, y: scatter.y, rotate: scatter.r, scale: 0.5 }}
      whileInView={{ opacity: 1, x: 0, y: 0, rotate: 0, scale: 1 }}
      viewport={{ once: true, amount: 0.35 }}
      transition={{ delay: (index % 8) * 0.055, type: 'spring', stiffness: 235, damping: 22 }}
      onHoverStart={() => onHover(skill.name)}
      onHoverEnd={onLeave}
      whileHover={{ scale: 1.1, y: -7, zIndex: 20 }}>
      <motion.svg viewBox={PUZZLE_VB} className="absolute inset-0 w-full h-full"
        animate={isNeighbor ? { filter: `drop-shadow(0 0 7px ${colors.glow})` } : { filter: 'none' }}
        transition={{ duration: 0.3 }}>
        <path d={PUZZLE_PATH} fill={colors.fill} stroke={colors.stroke} strokeWidth="1.5" />
      </motion.svg>
      <div className="relative z-10 text-center px-3">
        <div className="text-xs font-bold leading-tight mb-1" style={{ color: colors.text }}>{skill.name}</div>
        <div className="text-[10px] font-semibold mb-1.5" style={{ color: colors.stroke.replace('0.45','0.85') }}>
          {skill.level}%
        </div>
        <div className="w-10 h-[3px] rounded-full mx-auto overflow-hidden" style={{ background: 'rgba(0,0,0,0.08)' }}>
          <motion.div className="h-full rounded-full"
            style={{ background: colors.stroke.replace('0.45','0.85') }}
            initial={{ width: 0 }}
            whileInView={{ width: `${skill.level}%` }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, delay: (index % 8) * 0.055 + 0.4, ease: PIECE_EASE }} />
        </div>
      </div>
      <motion.div aria-hidden="true" className="absolute inset-0 pointer-events-none rounded-xl"
        initial={{ opacity: 0 }} whileHover={{ opacity: 1 }}
        style={{ boxShadow: `0 0 18px ${colors.glow}` }} />
    </motion.div>
  );
}

function Skills({ skills }) {
  const [tab, setTab] = useState('All');
  const [hoveredSkill, setHoveredSkill] = useState(null);
  const cats = ['All', ...[...new Set((skills || []).map(s => s.category || 'Core'))]];
  const filtered = tab === 'All' ? (skills || []) : (skills || []).filter(s => (s.category || 'Core') === tab);

  return (
    <section className="relative py-28 px-6 overflow-hidden" style={{ zIndex: 1 }}>
      <div className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse 50% 40% at 85% 50%, rgba(14,116,144,0.07) 0%, transparent 70%)' }} />

      <div className="max-w-6xl mx-auto">
        <PuzzleHeading label="Skills" title="Skills That Fit Together" accentColor={C.cyan} gradientTo={C.violet} />

        {/* Tabs */}
        <motion.div initial={{ opacity: 0, y: 14 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ delay: 0.2 }}
          className="flex flex-wrap gap-2 mb-12">
          {cats.map(t => (
            <motion.button key={t} onClick={() => setTab(t)}
              className="px-4 py-1.5 rounded-full text-xs font-semibold"
              style={tab === t
                ? { background: 'rgba(14,116,144,0.12)', border: '1px solid rgba(14,116,144,0.45)', color: C.cyan }
                : { background: C.surface, border: `1px solid ${C.border}`, color: C.faint }}
              whileTap={{ scale: 0.95 }}>
              {t}
            </motion.button>
          ))}
        </motion.div>

        {/* Skill grid — each tile uses its own scatter animation */}
        <AnimatePresence mode="popLayout">
          <motion.div key={tab} className="flex flex-wrap gap-4 justify-start"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}>
            {filtered.map((skill, i) => (
              <SkillPiece key={skill.name} skill={skill} index={i}
                hoveredSkill={hoveredSkill}
                onHover={setHoveredSkill} onLeave={() => setHoveredSkill(null)} />
            ))}
          </motion.div>
        </AnimatePresence>

        <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }}
          viewport={{ once: true }} transition={{ delay: 0.5 }}
          className="mt-14 pt-8 flex items-center gap-3"
          style={{ borderTop: `1px solid ${C.border}` }}>
          <svg width="15" height="15" viewBox={PUZZLE_VB}>
            <path d={PUZZLE_PATH} fill="none" stroke="rgba(14,116,144,0.5)" strokeWidth="2" />
          </svg>
          <span className="text-sm" style={{ color: C.faint }}>
            {(skills || []).length} pieces assembled into a complete skill set
          </span>
        </motion.div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// PROJECTS
// ─────────────────────────────────────────────────────────────────────────────

const PROJ_QUADS = [
  { clip: 'inset(0 50% 50% 0)', xOff: -28, yOff: -22 },
  { clip: 'inset(0 0 50% 50%)', xOff:  28, yOff: -22 },
  { clip: 'inset(50% 50% 0 0)', xOff: -28, yOff:  22 },
  { clip: 'inset(50% 0 0 50%)', xOff:  28, yOff:  22 },
];

function useTilt() {
  const mx = useMotionValue(0), my = useMotionValue(0);
  const rotX = useSpring(useTransform(my, [-0.5, 0.5], [10, -10]), { stiffness: 400, damping: 30 });
  const rotY = useSpring(useTransform(mx, [-0.5, 0.5], [-10, 10]), { stiffness: 400, damping: 30 });
  const onMove = e => {
    const r = e.currentTarget.getBoundingClientRect();
    mx.set((e.clientX - r.left) / r.width  - 0.5);
    my.set((e.clientY - r.top)  / r.height - 0.5);
  };
  const onLeave = () => { mx.set(0); my.set(0); };
  return { rotX, rotY, onMove, onLeave };
}

function ProjectCard({ project, index }) {
  const cardRef = useRef(null);
  const tilt = useTilt();
  const [hovered, setHovered] = useState(false);

  const { scrollYProgress } = useScroll({ target: cardRef, offset: ['start end', '0.65 end'] });
  const smooth = useSpring(scrollYProgress, { stiffness: 70, damping: 18 });

  // Per-quadrant scroll-driven offsets (no hooks in loops — all declared here)
  const q0x = useTransform(smooth, [0, 1], [PROJ_QUADS[0].xOff, 0]);
  const q0y = useTransform(smooth, [0, 1], [PROJ_QUADS[0].yOff, 0]);
  const q1x = useTransform(smooth, [0, 1], [PROJ_QUADS[1].xOff, 0]);
  const q1y = useTransform(smooth, [0, 1], [PROJ_QUADS[1].yOff, 0]);
  const q2x = useTransform(smooth, [0, 1], [PROJ_QUADS[2].xOff, 0]);
  const q2y = useTransform(smooth, [0, 1], [PROJ_QUADS[2].yOff, 0]);
  const q3x = useTransform(smooth, [0, 1], [PROJ_QUADS[3].xOff, 0]);
  const q3y = useTransform(smooth, [0, 1], [PROJ_QUADS[3].yOff, 0]);
  const qMotion = [
    { x: q0x, y: q0y }, { x: q1x, y: q1y },
    { x: q2x, y: q2y }, { x: q3x, y: q3y },
  ];
  const cardOpacity = useTransform(smooth, [0, 0.4], [0, 1]);
  const cardY       = useTransform(smooth, [0, 1],   [45, 0]);

  return (
    <motion.div ref={cardRef}
      style={{ opacity: cardOpacity, y: cardY, rotateX: tilt.rotX, rotateY: tilt.rotY,
        transformStyle: 'preserve-3d', perspective: 900 }}
      onMouseMove={tilt.onMove}
      onMouseLeave={() => { tilt.onLeave(); setHovered(false); }}
      onMouseEnter={() => setHovered(true)}
      className="relative rounded-2xl overflow-hidden flex flex-col"
      whileHover={{ y: -7, boxShadow: '0 20px 55px rgba(109,40,217,0.18)' }}
      transition={{ duration: 0.22 }}>

      {/* Card surface */}
      <div className="absolute inset-0 rounded-2xl"
        style={{ background: C.surface, border: `1px solid ${hovered ? 'rgba(109,40,217,0.35)' : C.border}`,
          backdropFilter: 'blur(10px)', transition: 'border-color 0.3s' }} />

      {/* Image — 4-quadrant scroll-assembly */}
      <div className="relative h-44 overflow-hidden rounded-t-2xl flex-shrink-0">
        {project.image ? (
          PROJ_QUADS.map((q, qi) => (
            <motion.div key={qi} className="absolute inset-0"
              style={{ clipPath: q.clip, x: qMotion[qi].x, y: qMotion[qi].y }}>
              <motion.img src={project.image} alt={project.title}
                className="w-full h-full object-cover"
                animate={hovered ? { scale: 1.07 } : { scale: 1 }}
                transition={{ duration: 0.4 }} />
            </motion.div>
          ))
        ) : (
          <div className="w-full h-full flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg,rgba(109,40,217,0.15),rgba(14,116,144,0.12))' }}>
            <Puzzle size={38} style={{ color: C.violet, opacity: 0.3 }} />
          </div>
        )}
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: 'linear-gradient(to top, rgba(245,240,235,0.7) 0%, transparent 55%)' }} />
        <div className="absolute top-3 right-3 opacity-35">
          <svg width="20" height="20" viewBox={PUZZLE_VB}>
            <path d={PUZZLE_PATH} fill="rgba(109,40,217,0.2)" stroke="rgba(109,40,217,0.7)" strokeWidth="2.5" />
          </svg>
        </div>
        <motion.div className="absolute inset-0 flex items-center justify-center gap-3"
          animate={{ opacity: hovered ? 1 : 0 }} transition={{ duration: 0.2 }}>
          {project.liveUrl && (
            <a href={project.liveUrl} target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold text-white"
              style={{ background: 'rgba(109,40,217,0.88)', backdropFilter: 'blur(8px)' }}
              onClick={e => e.stopPropagation()}>
              <ExternalLink size={11} /> Live
            </a>
          )}
          {project.githubUrl && (
            <a href={project.githubUrl} target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold text-white"
              style={{ background: 'rgba(28,23,40,0.85)', backdropFilter: 'blur(8px)' }}
              onClick={e => e.stopPropagation()}>
              <Github size={11} /> Code
            </a>
          )}
        </motion.div>
      </div>

      {/* Content */}
      <div className="relative flex flex-col flex-1 p-5 gap-3">
        <h3 className="font-bold text-base leading-snug" style={{ color: C.text }}>{project.title}</h3>
        <p className="text-xs leading-relaxed flex-1 line-clamp-3" style={{ color: C.faint }}>{project.description}</p>
        <div className="flex flex-wrap gap-1.5 mt-auto pt-3" style={{ borderTop: `1px solid ${C.border}` }}>
          {(project.techStack || []).map((tech, ti) => (
            <span key={ti} className="px-2 py-0.5 rounded text-[10px] font-semibold"
              style={{ background: `${TECH_COLORS[ti % TECH_COLORS.length]}12`,
                color: TECH_COLORS[ti % TECH_COLORS.length],
                border: `1px solid ${TECH_COLORS[ti % TECH_COLORS.length]}30` }}>
              {tech}
            </span>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

function Projects({ projects }) {
  return (
    <section className="relative py-28 px-6 overflow-hidden" style={{ zIndex: 1 }}>
      <div className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse 45% 40% at 18% 60%, rgba(109,40,217,0.07) 0%, transparent 70%)' }} />
      <div className="max-w-6xl mx-auto">
        <PuzzleHeading label="Projects" title="Completed Puzzle Segments" accentColor={C.amber} gradientTo="#DC2626" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {(projects || []).map((p, i) => <ProjectCard key={p.title || i} project={p} index={i} />)}
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// EXPERIENCE
// ─────────────────────────────────────────────────────────────────────────────

function PuzzleConnector({ index }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.5 });
  return (
    <div ref={ref} className="flex justify-start items-center pl-6 my-0" style={{ height: 44 }}>
      <div className="relative flex flex-col items-center" style={{ width: 54 }}>
        <motion.div className="w-px" style={{ background: `linear-gradient(to bottom, ${C.violet}88, ${C.cyan}55)`, height: 26, transformOrigin: 'top' }}
          initial={{ scaleY: 0 }} animate={inView ? { scaleY: 1 } : {}}
          transition={{ delay: index * 0.14 + 0.3, duration: 0.4, ease: PIECE_EASE }} />
        <motion.div className="w-2.5 h-2.5 rounded-full flex-shrink-0"
          style={{ background: `${C.cyan}bb`, marginTop: 4 }}
          initial={{ scale: 0 }} animate={inView ? { scale: 1 } : {}}
          transition={{ delay: index * 0.14 + 0.7, type: 'spring', stiffness: 320 }} />
        <motion.div className="absolute -right-3 top-1/2 -translate-y-1/2"
          initial={{ opacity: 0, scale: 0 }} animate={inView ? { opacity: 0.3, scale: 1 } : {}}
          transition={{ delay: index * 0.14 + 0.9, duration: 0.3 }}>
          <svg width="12" height="12" viewBox={PUZZLE_VB}>
            <path d={PUZZLE_PATH} fill={`${C.cyan}44`} stroke={`${C.cyan}99`} strokeWidth="2.5" />
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
    <motion.div ref={ref} className="relative flex gap-5"
      initial={{ opacity: 0, x: -50 }} animate={inView ? { opacity: 1, x: 0 } : {}}
      transition={{ delay: index * 0.1, type: 'spring', stiffness: 158, damping: 24 }}>
      {/* Left icon */}
      <div className="relative flex-shrink-0">
        <motion.div style={{ width: 52, height: 52 }}
          whileHover={{ scale: 1.1, rotate: 6 }} transition={{ type: 'spring', stiffness: 400 }}>
          <svg viewBox={PUZZLE_VB} className="w-full h-full">
            <path d={PUZZLE_PATH} fill="rgba(109,40,217,0.1)" stroke="rgba(109,40,217,0.42)" strokeWidth="2" />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <Briefcase size={15} style={{ color: C.violet }} />
          </div>
        </motion.div>
      </div>
      {/* Card — wrapped in PuzzleAssemble */}
      <PuzzleAssemble delay={index * 0.1} className="flex-1 mb-10">
        <motion.div className="rounded-2xl p-5 relative"
          style={{ background: C.surface, border: `1px solid ${C.border}`, backdropFilter: 'blur(8px)' }}
          whileHover={{ borderColor: 'rgba(109,40,217,0.3)', background: 'rgba(255,255,255,0.92)', y: -3, boxShadow: '0 10px 36px rgba(109,40,217,0.1)' }}
          transition={{ duration: 0.22 }}>
          <div className="flex flex-wrap items-start justify-between gap-3 mb-3">
            <div>
              <h3 className="font-bold text-base leading-tight" style={{ color: C.text }}>{exp.role}</h3>
              <p className="text-sm font-semibold mt-0.5"
                style={{ background: `linear-gradient(135deg,${C.violet},${C.cyan})`,
                  WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text' }}>
                {exp.company}
              </p>
            </div>
            {(exp.period || exp.start) && (
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-full flex-shrink-0"
                style={{ background: 'rgba(0,0,0,0.04)', border: `1px solid ${C.border}` }}>
                <Calendar size={10} style={{ color: C.faint }} />
                <span className="text-xs" style={{ color: C.faint }}>
                  {exp.period || `${exp.start}${exp.end ? ` – ${exp.end}` : ''}`}
                </span>
              </div>
            )}
          </div>
          {exp.description && <p className="text-sm leading-relaxed" style={{ color: C.muted }}>{exp.description}</p>}
          {Array.isArray(exp.bullets) && exp.bullets.length > 0 && (
            <ul className="mt-3 space-y-1.5">
              {exp.bullets.slice(0, 3).map((b, bi) => (
                <li key={bi} className="flex items-start gap-2 text-xs" style={{ color: C.faint }}>
                  <span className="mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0"
                    style={{ background: `${C.violet}99` }} />
                  {b}
                </li>
              ))}
            </ul>
          )}
          <div className="absolute right-4 bottom-4 opacity-12">
            <svg width="16" height="16" viewBox={PUZZLE_VB}>
              <path d={PUZZLE_PATH} fill="none" stroke={C.violet} strokeWidth="2" />
            </svg>
          </div>
        </motion.div>
      </PuzzleAssemble>
    </motion.div>
  );
}

function Experience({ experience }) {
  return (
    <section className="relative py-28 px-6 overflow-hidden" style={{ zIndex: 1 }}>
      <div className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse 42% 55% at 92% 30%, rgba(14,116,144,0.07) 0%, transparent 70%)' }} />
      <div className="max-w-3xl mx-auto">
        <PuzzleHeading label="Experience" title="A Chain of Connected Pieces" accentColor={C.cyan} gradientTo={C.violet} />
        <div className="flex flex-col">
          {(experience || []).map((exp, i) => (
            <React.Fragment key={i}>
              <ExperienceCard exp={exp} index={i} />
              {i < (experience || []).length - 1 && <PuzzleConnector index={i} />}
            </React.Fragment>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// TESTIMONIALS
// ─────────────────────────────────────────────────────────────────────────────

function TestimonialCard({ testimonial, index }) {
  const accent = CARD_ACCENTS[index % CARD_ACCENTS.length];
  const name   = testimonial.name || testimonial.author;
  const avatar = testimonial.avatar || testimonial.image;
  return (
    <PuzzleAssemble delay={index * 0.08}>
      <motion.div className="relative rounded-2xl p-6 flex flex-col gap-4 group"
        style={{ background: accent.fill, border: `1px solid ${accent.border}`, backdropFilter: 'blur(8px)' }}
        whileHover={{ y: -5, boxShadow: `0 14px 44px ${accent.border}` }}>
        <motion.div aria-hidden="true" className="absolute top-4 right-4 pointer-events-none"
          initial={{ opacity: 0, rotate: -90 }}
          whileInView={{ opacity: 0.25, rotate: 0 }}
          viewport={{ once: true }}
          transition={{ delay: index * 0.08 + 0.4, duration: 0.5, ease: PIECE_EASE }}>
          <svg width="22" height="22" viewBox={PUZZLE_VB}>
            <path d={PUZZLE_PATH} fill="none" stroke={accent.dot} strokeWidth="2" />
          </svg>
        </motion.div>
        <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
          style={{ background: `${accent.dot}1a` }}>
          <Quote size={14} style={{ color: accent.dot }} />
        </div>
        <p className="text-sm leading-relaxed flex-1 italic" style={{ color: C.muted }}>"{testimonial.text}"</p>
        <div className="flex items-center gap-3 pt-3" style={{ borderTop: `1px solid ${C.border}` }}>
          {avatar
            ? <img src={avatar} alt={name} className="w-9 h-9 rounded-full object-cover flex-shrink-0"
                style={{ border: `2px solid ${accent.border}` }} />
            : <div className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
                style={{ background: `${accent.dot}18`, color: accent.dot, border: `2px solid ${accent.border}` }}>
                {(name || '?')[0].toUpperCase()}
              </div>}
          <div>
            <p className="text-sm font-semibold leading-tight" style={{ color: C.text }}>{name}</p>
            <p className="text-xs mt-0.5" style={{ color: accent.dot }}>{testimonial.role}</p>
          </div>
        </div>
      </motion.div>
    </PuzzleAssemble>
  );
}

function Testimonials({ testimonials }) {
  if (!testimonials?.length) return null;
  return (
    <section className="relative py-28 px-6 overflow-hidden" style={{ zIndex: 1 }}>
      <div className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse 45% 40% at 28% 70%, rgba(180,83,9,0.06) 0%, transparent 70%)' }} />
      <div className="max-w-6xl mx-auto">
        <PuzzleHeading label="Testimonials" title="Voices That Complete The Picture" accentColor={C.amber} gradientTo="#BE123C" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {testimonials.map((t, i) => <TestimonialCard key={i} testimonial={t} index={i} />)}
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// CONTACT
// ─────────────────────────────────────────────────────────────────────────────

function Contact({ personal, socials }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.2 });
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [sent, setSent] = useState(false);
  const change = f => e => setForm(p => ({ ...p, [f]: e.target.value }));
  const submit = e => { e.preventDefault(); if (form.name && form.email && form.message) setSent(true); };

  return (
    <section ref={ref} className="relative py-28 px-6 overflow-hidden" style={{ zIndex: 1 }}>
      {/* Completion glow */}
      <motion.div aria-hidden="true" className="absolute inset-0 pointer-events-none"
        initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}}
        transition={{ delay: 1.2, duration: 1.2 }}
        style={{ background: 'radial-gradient(ellipse 75% 55% at 50% 50%, rgba(109,40,217,0.1) 0%, transparent 70%)' }} />

      {/* Final 6 pieces converging */}
      {FINAL_PIECES.map((p, i) => (
        <motion.div key={i} aria-hidden="true"
          className="absolute left-1/2 top-1/2 pointer-events-none"
          style={{ width: p.size, height: p.size, marginLeft: -p.size / 2, marginTop: -p.size / 2 }}
          initial={{ x: p.xStart, y: p.yStart, rotate: p.rotate, opacity: 0 }}
          animate={inView ? { x: 0, y: 0, rotate: 0, opacity: 0.1 } : {}}
          transition={{ delay: p.delay, type: 'spring', stiffness: 115, damping: 22 }}>
          <svg viewBox={PUZZLE_VB} className="w-full h-full">
            <path d={PUZZLE_PATH} fill={`${p.color}18`} stroke={`${p.color}55`} strokeWidth="1.5" />
          </svg>
        </motion.div>
      ))}

      <div className="max-w-6xl mx-auto relative z-10">
        <PuzzleHeading label="Contact" title="Let's Complete The Picture Together" accentColor={C.violet} gradientTo={C.cyan} />

        <motion.p initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 0.3 }} className="text-sm max-w-lg mb-14" style={{ color: C.faint }}>
          Every great collaboration starts with a single piece. Reach out and let's see what we can assemble together.
        </motion.p>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
          {/* Form */}
          <motion.div initial={{ opacity: 0, y: 38 }} animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.4, type: 'spring', stiffness: 148 }}
            className="lg:col-span-3">
            {sent ? (
              <motion.div initial={{ opacity: 0, scale: 0.85 }} animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center justify-center gap-4 p-12 rounded-2xl text-center"
                style={{ background: 'rgba(109,40,217,0.07)', border: '1px solid rgba(109,40,217,0.22)' }}>
                <motion.div animate={{ scale: [1, 1.15, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}>
                  <svg width="56" height="56" viewBox={PUZZLE_VB}>
                    <path d={PUZZLE_PATH} fill="rgba(109,40,217,0.18)" stroke="rgba(109,40,217,0.7)" strokeWidth="2" />
                  </svg>
                </motion.div>
                <CheckCircle size={28} style={{ color: C.violet }} />
                <p className="font-semibold text-lg" style={{ color: C.text }}>Piece received!</p>
                <p className="text-sm" style={{ color: C.faint }}>Thank you for reaching out. I'll be in touch soon.</p>
              </motion.div>
            ) : (
              <PuzzleAssemble delay={0.45}>
                <form onSubmit={submit} className="flex flex-col gap-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <InputField label="Name"  value={form.name}    onChange={change('name')}    placeholder="Your name" />
                    <InputField label="Email" type="email" value={form.email} onChange={change('email')} placeholder="you@example.com" />
                  </div>
                  <InputField label="Message" value={form.message} onChange={change('message')} placeholder="Tell me about your project…" multiline />
                  <PuzzleButton variant="primary" accentColor={C.violet} as="button">
                    <Send size={13} /> Send Message
                  </PuzzleButton>
                </form>
              </PuzzleAssemble>
            )}
          </motion.div>

          {/* Social links */}
          <motion.div initial={{ opacity: 0, x: 38 }} animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: 0.55, type: 'spring', stiffness: 148 }}
            className="lg:col-span-2 flex flex-col gap-5">
            <PuzzleAssemble delay={0.6}>
              <div className="p-6 rounded-2xl flex flex-col gap-4"
                style={{ background: C.surface, border: `1px solid ${C.border}`, backdropFilter: 'blur(8px)' }}>
                {personal?.location && (
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center"
                      style={{ background: 'rgba(109,40,217,0.1)' }}>
                      <MapPin size={13} style={{ color: C.violet }} />
                    </div>
                    <span className="text-sm" style={{ color: C.muted }}>{personal.location}</span>
                  </div>
                )}
                {socials?.email && (
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center"
                      style={{ background: 'rgba(14,116,144,0.1)' }}>
                      <Mail size={13} style={{ color: C.cyan }} />
                    </div>
                    <a href={`mailto:${socials.email}`} className="text-sm" style={{ color: C.muted }}>
                      {socials.email}
                    </a>
                  </div>
                )}
              </div>
            </PuzzleAssemble>
            <div className="flex flex-col gap-2.5">
              {SOCIAL_LINKS.map(({ key, Icon, label, color, isEmail }) => {
                const href = isEmail ? `mailto:${socials?.[key]||''}` : (socials?.[key]||'#');
                if (!socials?.[key]) return null;
                return (
                  <motion.a key={key} href={href}
                    target={isEmail ? undefined : '_blank'} rel="noopener noreferrer"
                    className="flex items-center gap-3 p-4 rounded-xl text-sm font-semibold"
                    style={{ background: C.surface, border: `1px solid ${C.border}`, color: C.muted,
                      backdropFilter: 'blur(8px)' }}
                    whileHover={{ x: 5, borderColor: `${color}50`, color, background: `${color}0c` }}
                    transition={{ duration: 0.18 }}>
                    <Icon size={14} />
                    <span>{label}</span>
                  </motion.a>
                );
              })}
            </div>
          </motion.div>
        </div>

        {/* Footer */}
        <motion.div initial={{ opacity: 0, y: 18 }} animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 1.5 }}
          className="mt-24 pt-8 flex flex-col items-center gap-3"
          style={{ borderTop: `1px solid ${C.border}` }}>
          <div className="flex items-center gap-3">
            {[0, 1, 2].map(i => (
              <motion.div key={i}
                animate={{ opacity: [0.15, 0.6, 0.15], scale: [0.9, 1.05, 0.9] }}
                transition={{ duration: 3, repeat: Infinity, delay: i * 0.55, ease: 'easeInOut' }}>
                <svg width="16" height="16" viewBox={PUZZLE_VB}>
                  <path d={PUZZLE_PATH} fill={`${C.violet}22`} stroke={`${C.violet}66`} strokeWidth="2" />
                </svg>
              </motion.div>
            ))}
          </div>
          <p className="text-xs tracking-widest uppercase" style={{ color: C.faint }}>
            {personal?.name} — Portfolio Assembled
          </p>
        </motion.div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// ROOT — composition layer (Volcanic_Forge pattern)
// ─────────────────────────────────────────────────────────────────────────────

export default function JigsawPuzzleAssembly() {
  const { portfolioData: data } = usePortfolio();
  if (!data) return null;
  const { personal, socials, skills, projects, experience, testimonials, stats } = data;

  return (
    <div className="relative min-h-screen overflow-x-hidden font-sans" style={{ color: C.text }}>
      <JigsawBackground />
      <Hero         personal={personal}      socials={socials}  stats={stats}        />
      <About        personal={personal}      stats={stats}                           />
      <Skills       skills={skills}                                                  />
      <Projects     projects={projects}                                              />
      <Experience   experience={experience}                                          />
      <Testimonials testimonials={testimonials}                                      />
      <Contact      personal={personal}      socials={socials}                      />
    </div>
  );
}
