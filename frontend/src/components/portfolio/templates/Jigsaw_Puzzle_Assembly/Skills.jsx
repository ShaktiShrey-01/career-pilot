import React, { useState, useRef } from 'react';
import { motion, useInView } from 'framer-motion';

const PUZZLE_PATH =
  'M 20,0 L 42,0 C 42,-12 58,-12 58,0 L 100,0 L 100,42 C 112,42 112,58 100,58 L 100,100 L 58,100 C 58,112 42,112 42,100 L 0,100 L 0,58 C -12,58 -12,42 0,42 L 0,0 Z';
const PUZZLE_VB = '-15 -15 130 130';

const CATEGORY_COLORS = {
  Frontend: { fill: 'rgba(124,58,237,0.12)', stroke: 'rgba(124,58,237,0.5)', text: '#a78bfa' },
  Backend:  { fill: 'rgba(6,182,212,0.10)',  stroke: 'rgba(6,182,212,0.5)',  text: '#67e8f9' },
  DevOps:   { fill: 'rgba(245,158,11,0.10)', stroke: 'rgba(245,158,11,0.5)', text: '#fcd34d' },
  Design:   { fill: 'rgba(236,72,153,0.10)', stroke: 'rgba(236,72,153,0.5)', text: '#f9a8d4' },
  Core:     { fill: 'rgba(124,58,237,0.12)', stroke: 'rgba(124,58,237,0.5)', text: '#a78bfa' },
};

function SkillPiece({ skill, index }) {
  const [hovered, setHovered] = useState(false);
  const colors = CATEGORY_COLORS[skill.category] || CATEGORY_COLORS.Core;

  return (
    <motion.div
      className="relative flex flex-col items-center justify-center cursor-default select-none"
      style={{ width: 130, height: 130 }}
      initial={{ opacity: 0, scale: 0.5, rotate: -10 }}
      whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
      viewport={{ once: true, amount: 0.4 }}
      transition={{ delay: index * 0.05, type: 'spring', stiffness: 250, damping: 20 }}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      whileHover={{ scale: 1.1, y: -6, zIndex: 10 }}
    >
      {/* Puzzle piece SVG background */}
      <motion.svg
        viewBox={PUZZLE_VB}
        className="absolute inset-0 w-full h-full"
        animate={hovered ? { filter: `drop-shadow(0 0 12px ${colors.stroke})` } : { filter: 'none' }}
      >
        <path
          d={PUZZLE_PATH}
          fill={hovered ? colors.fill.replace('0.12', '0.25').replace('0.10', '0.22') : colors.fill}
          stroke={colors.stroke}
          strokeWidth={hovered ? '2' : '1.5'}
        />
        {/* Level arc indicator */}
        <circle
          cx="50" cy="90" r="6"
          fill={colors.stroke.replace('0.5', '0.8')}
          opacity={hovered ? 1 : 0.5}
        />
      </motion.svg>

      {/* Content */}
      <div className="relative z-10 text-center px-3">
        <div
          className="text-xs font-bold leading-tight mb-1"
          style={{ color: colors.text }}
        >
          {skill.name}
        </div>
        <motion.div
          className="text-[10px] font-semibold"
          style={{ color: colors.stroke.replace('0.5', '0.9') }}
          animate={hovered ? { opacity: 1 } : { opacity: 0.6 }}
        >
          {skill.level}%
        </motion.div>
        {/* Level bar */}
        <div className="mt-1.5 w-10 h-0.5 rounded-full mx-auto" style={{ background: 'rgba(255,255,255,0.1)' }}>
          <motion.div
            className="h-full rounded-full"
            style={{ background: colors.stroke.replace('0.5', '0.9') }}
            initial={{ width: 0 }}
            whileInView={{ width: `${skill.level}%` }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: index * 0.05 + 0.3 }}
          />
        </div>
      </div>
    </motion.div>
  );
}

export default function Skills({ data }) {
  const { skills } = data;
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.1 });

  const categories = [...new Set((skills || []).map(s => s.category || 'Core'))];
  const [activeCategory, setActiveCategory] = useState('All');

  const filtered = activeCategory === 'All'
    ? skills
    : skills?.filter(s => (s.category || 'Core') === activeCategory);

  const tabs = ['All', ...categories];

  return (
    <section
      ref={ref}
      className="relative py-28 px-6 overflow-hidden"
      style={{ background: 'linear-gradient(180deg, #080B14 0%, #0D0A1A 50%, #080B14 100%)' }}
    >
      {/* Ambient glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse 60% 40% at 80% 50%, rgba(6,182,212,0.06) 0%, transparent 70%)' }}
      />

      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-3 mb-3">
          <svg width="20" height="20" viewBox={PUZZLE_VB}>
            <path d={PUZZLE_PATH} fill="rgba(6,182,212,0.25)" stroke="rgba(6,182,212,0.8)" strokeWidth="2.5" />
          </svg>
          <span className="text-cyan-400 text-xs font-semibold tracking-[0.3em] uppercase">Skills</span>
        </div>

        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.1 }}
          className="text-3xl md:text-5xl font-bold mb-10"
          style={{ color: '#F1F5F9' }}
        >
          Skills That<br />
          <span style={{ background: 'linear-gradient(135deg, #67e8f9, #a78bfa)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
            Fit Together
          </span>
        </motion.h2>

        {/* Category tabs */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.25 }}
          className="flex flex-wrap gap-2 mb-12"
        >
          {tabs.map(tab => (
            <button
              key={tab}
              onClick={() => setActiveCategory(tab)}
              className="px-4 py-1.5 rounded-full text-xs font-semibold transition-all"
              style={
                activeCategory === tab
                  ? { background: 'rgba(124,58,237,0.3)', border: '1px solid rgba(124,58,237,0.6)', color: '#c4b5fd' }
                  : { background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: '#64748b' }
              }
            >
              {tab}
            </button>
          ))}
        </motion.div>

        {/* Skills puzzle grid */}
        <div className="flex flex-wrap gap-4 justify-start">
          {(filtered || []).map((skill, i) => (
            <SkillPiece key={skill.name + i} skill={skill} index={i} />
          ))}
        </div>

        {/* Assembly count */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 0.6 }}
          className="mt-14 pt-8 flex items-center gap-3"
          style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}
        >
          <svg width="18" height="18" viewBox={PUZZLE_VB}>
            <path d={PUZZLE_PATH} fill="none" stroke="rgba(124,58,237,0.5)" strokeWidth="2" />
          </svg>
          <span className="text-slate-600 text-sm">
            {(skills || []).length} pieces assembled into a complete skill set
          </span>
        </motion.div>
      </div>
    </section>
  );
}
