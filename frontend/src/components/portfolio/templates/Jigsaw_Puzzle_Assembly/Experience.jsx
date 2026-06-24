import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Briefcase, Calendar } from 'lucide-react';

const PUZZLE_PATH =
  'M 20,0 L 42,0 C 42,-12 58,-12 58,0 L 100,0 L 100,42 C 112,42 112,58 100,58 L 100,100 L 58,100 C 58,112 42,112 42,100 L 0,100 L 0,58 C -12,58 -12,42 0,42 L 0,0 Z';
const PUZZLE_VB = '-15 -15 130 130';

function ConnectorLine({ index }) {
  return (
    <div className="absolute left-[27px] top-full w-px flex flex-col items-center" style={{ height: 40 }}>
      <motion.div
        className="w-px flex-1"
        style={{ background: 'linear-gradient(to bottom, rgba(124,58,237,0.5), rgba(6,182,212,0.3))' }}
        initial={{ scaleY: 0 }}
        whileInView={{ scaleY: 1 }}
        viewport={{ once: true }}
        transition={{ delay: index * 0.15 + 0.4, duration: 0.4 }}
      />
      {/* Connector node */}
      <motion.div
        className="w-2 h-2 rounded-full flex-shrink-0"
        style={{ background: 'rgba(6,182,212,0.6)' }}
        initial={{ scale: 0 }}
        whileInView={{ scale: 1 }}
        viewport={{ once: true }}
        transition={{ delay: index * 0.15 + 0.8, type: 'spring' }}
      />
    </div>
  );
}

function ExperienceCard({ exp, index }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.3 });

  return (
    <motion.div
      ref={ref}
      className="relative flex gap-6"
      initial={{ opacity: 0, x: -40 }}
      animate={inView ? { opacity: 1, x: 0 } : {}}
      transition={{ delay: index * 0.12, type: 'spring', stiffness: 160, damping: 22 }}
    >
      {/* Left — puzzle piece icon + connector */}
      <div className="relative flex flex-col items-center flex-shrink-0">
        <motion.div
          style={{ width: 54, height: 54 }}
          whileHover={{ scale: 1.1, rotate: 5 }}
          transition={{ type: 'spring', stiffness: 400 }}
        >
          <svg viewBox={PUZZLE_VB} className="w-full h-full">
            <path
              d={PUZZLE_PATH}
              fill="rgba(124,58,237,0.15)"
              stroke="rgba(124,58,237,0.55)"
              strokeWidth="2"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <Briefcase size={18} className="text-violet-400" />
          </div>
        </motion.div>
        {/* Connector */}
        {index < 99 && <ConnectorLine index={index} />}
      </div>

      {/* Right — card */}
      <motion.div
        className="flex-1 mb-10 rounded-2xl p-5"
        style={{
          background: 'rgba(255,255,255,0.04)',
          border: '1px solid rgba(255,255,255,0.08)',
        }}
        whileHover={{
          borderColor: 'rgba(124,58,237,0.35)',
          background: 'rgba(124,58,237,0.06)',
          y: -3,
          boxShadow: '0 12px 40px rgba(124,58,237,0.12)',
        }}
        transition={{ duration: 0.25 }}
      >
        {/* Top row */}
        <div className="flex flex-wrap items-start justify-between gap-3 mb-3">
          <div>
            <h3 className="text-slate-100 font-bold text-base leading-tight">{exp.role}</h3>
            <p
              className="text-sm font-semibold mt-0.5"
              style={{ background: 'linear-gradient(135deg, #a78bfa, #67e8f9)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}
            >
              {exp.company}
            </p>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full flex-shrink-0" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}>
            <Calendar size={11} className="text-slate-500" />
            <span className="text-xs text-slate-500">{exp.period || `${exp.start}${exp.end ? ` – ${exp.end}` : ''}`}</span>
          </div>
        </div>

        {/* Description */}
        <p className="text-slate-500 text-sm leading-relaxed">
          {exp.description || (Array.isArray(exp.bullets) ? exp.bullets[0] : '')}
        </p>

        {/* Bullet points */}
        {Array.isArray(exp.bullets) && exp.bullets.length > 0 && (
          <ul className="mt-3 space-y-1">
            {exp.bullets.slice(0, 3).map((b, bi) => (
              <li key={bi} className="flex items-start gap-2 text-xs text-slate-500">
                <span className="mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: 'rgba(124,58,237,0.6)' }} />
                {b}
              </li>
            ))}
          </ul>
        )}

        {/* Puzzle edge accent */}
        <div className="absolute right-4 bottom-4 opacity-20">
          <svg width="20" height="20" viewBox={PUZZLE_VB}>
            <path d={PUZZLE_PATH} fill="none" stroke="rgba(124,58,237,0.8)" strokeWidth="2" />
          </svg>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function Experience({ data }) {
  const { experience } = data;
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.1 });

  return (
    <section
      ref={ref}
      className="relative py-28 px-6 overflow-hidden"
      style={{ background: 'linear-gradient(180deg, #080B14 0%, #0A0D1C 100%)' }}
    >
      {/* Ambient glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse 50% 60% at 90% 30%, rgba(6,182,212,0.06) 0%, transparent 70%)' }}
      />

      <div className="max-w-3xl mx-auto">
        <div className="flex items-center gap-3 mb-3">
          <svg width="20" height="20" viewBox={PUZZLE_VB}>
            <path d={PUZZLE_PATH} fill="rgba(6,182,212,0.25)" stroke="rgba(6,182,212,0.8)" strokeWidth="2.5" />
          </svg>
          <span className="text-cyan-400 text-xs font-semibold tracking-[0.3em] uppercase">Experience</span>
        </div>

        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.1 }}
          className="text-3xl md:text-5xl font-bold mb-16"
          style={{ color: '#F1F5F9' }}
        >
          A Chain of<br />
          <span style={{ background: 'linear-gradient(135deg, #67e8f9, #a78bfa)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
            Connected Pieces
          </span>
        </motion.h2>

        <div className="flex flex-col">
          {(experience || []).map((exp, i) => (
            <ExperienceCard key={i} exp={exp} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
