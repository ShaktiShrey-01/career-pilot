import React, { useState, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { ExternalLink, Github, Puzzle } from 'lucide-react';

const PUZZLE_PATH =
  'M 20,0 L 42,0 C 42,-12 58,-12 58,0 L 100,0 L 100,42 C 112,42 112,58 100,58 L 100,100 L 58,100 C 58,112 42,112 42,100 L 0,100 L 0,58 C -12,58 -12,42 0,42 L 0,0 Z';
const PUZZLE_VB = '-15 -15 130 130';

function PuzzleConnector({ top, right, bottom, left }) {
  return (
    <svg
      viewBox={PUZZLE_VB}
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ opacity: 0.35 }}
    >
      <path d={PUZZLE_PATH} fill="none" stroke="rgba(124,58,237,0.6)" strokeWidth="1" />
    </svg>
  );
}

function ProjectCard({ project, index }) {
  const [hovered, setHovered] = useState(false);

  const techColors = [
    '#a78bfa', '#67e8f9', '#fcd34d', '#86efac', '#fb923c', '#f472b6',
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 40, scale: 0.95 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ delay: index * 0.1, type: 'spring', stiffness: 180, damping: 22 }}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      className="relative rounded-2xl overflow-hidden flex flex-col"
      style={{
        background: 'rgba(255,255,255,0.04)',
        border: '1px solid rgba(255,255,255,0.08)',
        backdropFilter: 'blur(10px)',
        transition: 'border-color 0.3s',
        borderColor: hovered ? 'rgba(124,58,237,0.45)' : 'rgba(255,255,255,0.08)',
      }}
      whileHover={{ y: -8, boxShadow: '0 20px 60px rgba(124,58,237,0.2)' }}
    >
      {/* Project image */}
      <div className="relative h-44 overflow-hidden">
        {project.image ? (
          <motion.img
            src={project.image}
            alt={project.title}
            className="w-full h-full object-cover"
            animate={hovered ? { scale: 1.08 } : { scale: 1 }}
            transition={{ duration: 0.4 }}
          />
        ) : (
          <div
            className="w-full h-full flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg, rgba(124,58,237,0.2), rgba(6,182,212,0.15))' }}
          >
            <Puzzle size={40} className="text-violet-600 opacity-40" />
          </div>
        )}
        {/* Overlay gradient */}
        <div
          className="absolute inset-0"
          style={{ background: 'linear-gradient(to top, rgba(8,11,20,0.8) 0%, transparent 60%)' }}
        />

        {/* Puzzle piece corner decoration */}
        <div className="absolute top-3 right-3 opacity-50">
          <svg width="28" height="28" viewBox={PUZZLE_VB}>
            <path d={PUZZLE_PATH} fill="rgba(124,58,237,0.25)" stroke="rgba(124,58,237,0.8)" strokeWidth="2.5" />
          </svg>
        </div>

        {/* Links — revealed on hover */}
        <motion.div
          className="absolute inset-0 flex items-center justify-center gap-4"
          animate={hovered ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          {project.liveUrl && (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold text-white"
              style={{ background: 'rgba(124,58,237,0.85)', backdropFilter: 'blur(8px)' }}
              onClick={e => e.stopPropagation()}
            >
              <ExternalLink size={12} /> Live
            </a>
          )}
          {project.githubUrl && (
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold text-white"
              style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)' }}
              onClick={e => e.stopPropagation()}
            >
              <Github size={12} /> Code
            </a>
          )}
        </motion.div>
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 p-5 gap-3">
        <h3 className="text-slate-100 font-bold text-base leading-snug">{project.title}</h3>
        <p className="text-slate-500 text-xs leading-relaxed flex-1 line-clamp-3">{project.description}</p>

        {/* Tech stack */}
        <div className="flex flex-wrap gap-1.5 mt-auto pt-3" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
          {(project.techStack || []).map((tech, ti) => (
            <span
              key={ti}
              className="px-2 py-0.5 rounded text-[10px] font-semibold"
              style={{
                background: `${techColors[ti % techColors.length]}18`,
                color: techColors[ti % techColors.length],
                border: `1px solid ${techColors[ti % techColors.length]}30`,
              }}
            >
              {tech}
            </span>
          ))}
        </div>
      </div>

      {/* Bottom puzzle connector indicator */}
      <motion.div
        className="absolute bottom-0 left-1/2 -translate-x-1/2"
        animate={hovered ? { opacity: 0.8, y: 0 } : { opacity: 0, y: 4 }}
        transition={{ duration: 0.2 }}
      >
        <svg width="24" height="12" viewBox="0 0 100 50">
          <path d="M 30,0 Q 30,-15 50,-15 Q 70,-15 70,0 L 100,0 L 0,0 Z" fill="rgba(124,58,237,0.5)" />
        </svg>
      </motion.div>
    </motion.div>
  );
}

export default function Projects({ data }) {
  const { projects } = data;
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.1 });

  return (
    <section
      ref={ref}
      className="relative py-28 px-6 overflow-hidden"
      style={{ background: '#080B14' }}
    >
      {/* Ambient glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse 50% 40% at 20% 60%, rgba(124,58,237,0.07) 0%, transparent 70%)' }}
      />

      <div className="max-w-6xl mx-auto">
        <div className="flex items-center gap-3 mb-3">
          <svg width="20" height="20" viewBox={PUZZLE_VB}>
            <path d={PUZZLE_PATH} fill="rgba(245,158,11,0.25)" stroke="rgba(245,158,11,0.8)" strokeWidth="2.5" />
          </svg>
          <span className="text-amber-400 text-xs font-semibold tracking-[0.3em] uppercase">Projects</span>
        </div>

        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.1 }}
          className="text-3xl md:text-5xl font-bold mb-16"
          style={{ color: '#F1F5F9' }}
        >
          Completed<br />
          <span style={{ background: 'linear-gradient(135deg, #fcd34d, #fb923c)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
            Puzzle Segments
          </span>
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {(projects || []).map((project, i) => (
            <ProjectCard key={i} project={project} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
