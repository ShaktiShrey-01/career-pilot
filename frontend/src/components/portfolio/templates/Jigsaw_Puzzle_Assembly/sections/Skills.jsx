import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import PuzzleHeading from '../components/PuzzleHeading';
import { PUZZLE_PATH, PUZZLE_VIEWBOX, COLOR_MAP, SKILL_SCATTER, COLORS, PIECE_EASE } from '../utils/puzzleHelpers';

const categoryTabs = ['All', 'Frontend', 'Backend', 'DevOps', 'Design', 'Core'];

function SkillPiece({ skill, index, activeNeighbor, onHover, onLeave }) {
  const scatter = SKILL_SCATTER[index % SKILL_SCATTER.length];
  const colors = COLOR_MAP[skill.category] || COLOR_MAP.Core;
  const isNeighbor = activeNeighbor && activeNeighbor !== skill.name;

  return (
    <motion.div
      className="relative flex flex-col items-center justify-center cursor-default select-none"
      style={{ width: 130, height: 130 }}
      initial={{ opacity: 0, x: scatter.x, y: scatter.y, rotate: scatter.r, scale: 0.5 }}
      whileInView={{ opacity: 1, x: 0, y: 0, rotate: 0, scale: 1 }}
      viewport={{ once: true, amount: 0.4 }}
      transition={{ delay: (index % 8) * 0.06, type: 'spring', stiffness: 240, damping: 22 }}
      onHoverStart={() => onHover(skill.name)}
      onHoverEnd={onLeave}
      whileHover={{ scale: 1.12, y: -8, zIndex: 20 }}
    >
      {/* SVG puzzle piece background */}
      <motion.svg
        viewBox={PUZZLE_VIEWBOX}
        className="absolute inset-0 w-full h-full"
        animate={
          isNeighbor
            ? { filter: `drop-shadow(0 0 8px ${colors.glow})` }
            : { filter: 'none' }
        }
        transition={{ duration: 0.3 }}
      >
        <path
          d={PUZZLE_PATH}
          fill={isNeighbor ? colors.fill.replace(/0\.\d+\)/, '0.22)') : colors.fill}
          stroke={colors.stroke}
          strokeWidth="1.5"
        />
      </motion.svg>

      {/* Content */}
      <div className="relative z-10 text-center px-3">
        <div className="text-xs font-bold leading-tight mb-1" style={{ color: colors.text }}>
          {skill.name}
        </div>
        <div className="text-[10px] font-semibold mb-1.5" style={{ color: colors.stroke.replace('0.55', '0.9') }}>
          {skill.level}%
        </div>
        {/* Level bar */}
        <div
          className="w-10 h-[3px] rounded-full mx-auto overflow-hidden"
          style={{ background: 'rgba(255,255,255,0.08)' }}
        >
          <motion.div
            className="h-full rounded-full"
            style={{ background: colors.stroke.replace('0.55', '0.9') }}
            initial={{ width: 0 }}
            whileInView={{ width: `${skill.level}%` }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, delay: (index % 8) * 0.06 + 0.4, ease: PIECE_EASE }}
          />
        </div>
      </div>

      {/* Glow when hovered */}
      <motion.div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none rounded-xl"
        initial={{ opacity: 0 }}
        whileHover={{ opacity: 1 }}
        style={{ boxShadow: `0 0 20px ${colors.glow}` }}
      />
    </motion.div>
  );
}

export default function Skills({ skills }) {
  const [activeTab, setActiveTab] = useState('All');
  const [hoveredSkill, setHoveredSkill] = useState(null);

  const existingCategories = [
    'All',
    ...[...new Set((skills || []).map((s) => s.category || 'Core'))],
  ];

  const filtered =
    activeTab === 'All'
      ? skills || []
      : (skills || []).filter((s) => (s.category || 'Core') === activeTab);

  return (
    <section
      className="relative py-28 px-6 overflow-hidden"
      style={{ background: 'linear-gradient(180deg, #080B14 0%, #0D0A1A 50%, #080B14 100%)', zIndex: 1 }}
    >
      {/* Ambient glow */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 55% 40% at 85% 50%, rgba(6,182,212,0.06) 0%, transparent 70%)',
        }}
      />

      <div className="max-w-6xl mx-auto">
        <PuzzleHeading
          label="Skills"
          title="Skills That Fit Together"
          accentColor={COLORS.cyan}
          gradientTo="#a78bfa"
        />

        {/* Category tabs */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="flex flex-wrap gap-2 mb-12"
        >
          {existingCategories.map((tab) => (
            <motion.button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className="px-4 py-1.5 rounded-full text-xs font-semibold transition-colors"
              style={
                activeTab === tab
                  ? { background: 'rgba(6,182,212,0.2)', border: '1px solid rgba(6,182,212,0.55)', color: '#67e8f9' }
                  : { background: COLORS.surface,         border: `1px solid ${COLORS.border}`,    color: COLORS.faint  }
              }
              whileTap={{ scale: 0.95 }}
            >
              {tab}
            </motion.button>
          ))}
        </motion.div>

        {/* Skill pieces grid */}
        <AnimatePresence mode="popLayout">
          <motion.div
            key={activeTab}
            className="flex flex-wrap gap-4 justify-start"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            {filtered.map((skill, i) => (
              <SkillPiece
                key={skill.name}
                skill={skill}
                index={i}
                activeNeighbor={hoveredSkill}
                onHover={setHoveredSkill}
                onLeave={() => setHoveredSkill(null)}
              />
            ))}
          </motion.div>
        </AnimatePresence>

        {/* Assembly count */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          className="mt-14 pt-8 flex items-center gap-3"
          style={{ borderTop: `1px solid ${COLORS.border}` }}
        >
          <svg width="16" height="16" viewBox={PUZZLE_VIEWBOX}>
            <path d={PUZZLE_PATH} fill="none" stroke="rgba(6,182,212,0.5)" strokeWidth="2" />
          </svg>
          <span className="text-sm" style={{ color: COLORS.faint }}>
            {(skills || []).length} pieces assembled into a complete skill set
          </span>
        </motion.div>
      </div>
    </section>
  );
}
