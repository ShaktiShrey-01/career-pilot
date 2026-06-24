import React, { useRef } from 'react';
import { motion, useScroll, useTransform, useSpring, useMotionValue } from 'framer-motion';
import { ExternalLink, Github, Puzzle } from 'lucide-react';
import PuzzleHeading from '../components/PuzzleHeading';
import { PUZZLE_PATH, PUZZLE_VIEWBOX, COLORS, PIECE_EASE } from '../utils/puzzleHelpers';

const TECH_COLORS = ['#a78bfa', '#67e8f9', '#fcd34d', '#86efac', '#fb923c', '#f472b6'];

// 3D tilt hook — per card
function useTilt() {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [12, -12]), { stiffness: 400, damping: 30 });
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-12, 12]), { stiffness: 400, damping: 30 });

  function onMove(e) {
    const rect = e.currentTarget.getBoundingClientRect();
    x.set((e.clientX - rect.left) / rect.width - 0.5);
    y.set((e.clientY - rect.top)  / rect.height - 0.5);
  }
  function onLeave() { x.set(0); y.set(0); }

  return { rotateX, rotateY, onMove, onLeave };
}

// The four quadrant pieces that fly together as the card scrolls into view
const QUADS = [
  { clip: 'inset(0 50% 50% 0)', xOff: -30, yOff: -24 },
  { clip: 'inset(0 0 50% 50%)', xOff:  30, yOff: -24 },
  { clip: 'inset(50% 50% 0 0)', xOff: -30, yOff:  24 },
  { clip: 'inset(50% 0 0 50%)', xOff:  30, yOff:  24 },
];

function ProjectCard({ project, index }) {
  const cardRef = useRef(null);
  const tilt = useTilt();
  const [hovered, setHovered] = React.useState(false);

  const { scrollYProgress } = useScroll({
    target: cardRef,
    offset: ['start end', '0.65 end'],
  });
  const smooth = useSpring(scrollYProgress, { stiffness: 70, damping: 18 });
  const cardOpacity  = useTransform(smooth, [0, 0.4], [0, 1]);
  const cardY        = useTransform(smooth, [0, 1],   [50, 0]);

  // Per-quadrant x/y offsets driven by scroll progress
  const q0x = useTransform(smooth, [0, 1], [QUADS[0].xOff, 0]);
  const q0y = useTransform(smooth, [0, 1], [QUADS[0].yOff, 0]);
  const q1x = useTransform(smooth, [0, 1], [QUADS[1].xOff, 0]);
  const q1y = useTransform(smooth, [0, 1], [QUADS[1].yOff, 0]);
  const q2x = useTransform(smooth, [0, 1], [QUADS[2].xOff, 0]);
  const q2y = useTransform(smooth, [0, 1], [QUADS[2].yOff, 0]);
  const q3x = useTransform(smooth, [0, 1], [QUADS[3].xOff, 0]);
  const q3y = useTransform(smooth, [0, 1], [QUADS[3].yOff, 0]);

  const quadMotion = [
    { x: q0x, y: q0y },
    { x: q1x, y: q1y },
    { x: q2x, y: q2y },
    { x: q3x, y: q3y },
  ];

  return (
    <motion.div
      ref={cardRef}
      style={{
        opacity: cardOpacity,
        y: cardY,
        rotateX: tilt.rotateX,
        rotateY: tilt.rotateY,
        transformStyle: 'preserve-3d',
        perspective: 900,
      }}
      onMouseMove={tilt.onMove}
      onMouseLeave={() => { tilt.onLeave(); setHovered(false); }}
      onMouseEnter={() => setHovered(true)}
      className="relative rounded-2xl overflow-hidden flex flex-col"
      whileHover={{ y: -8, boxShadow: '0 24px 60px rgba(124,58,237,0.2)' }}
      transition={{ duration: 0.25 }}
    >
      {/* Card surface */}
      <div
        className="absolute inset-0 rounded-2xl"
        style={{
          background: COLORS.surface,
          border: `1px solid ${hovered ? 'rgba(124,58,237,0.4)' : COLORS.border}`,
          backdropFilter: 'blur(10px)',
          transition: 'border-color 0.3s',
        }}
      />

      {/* Image with quad-piece scroll assembly */}
      <div
        className="relative h-44 overflow-hidden rounded-t-2xl flex-shrink-0"
        style={{ transformStyle: 'preserve-3d' }}
      >
        {project.image ? (
          <>
            {QUADS.map((q, qi) => (
              <motion.div
                key={qi}
                className="absolute inset-0"
                style={{ clipPath: q.clip, x: quadMotion[qi].x, y: quadMotion[qi].y }}
              >
                <motion.img
                  src={project.image}
                  alt={project.title}
                  className="w-full h-full object-cover"
                  animate={hovered ? { scale: 1.07 } : { scale: 1 }}
                  transition={{ duration: 0.4 }}
                />
              </motion.div>
            ))}
          </>
        ) : (
          <div
            className="w-full h-full flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg, rgba(124,58,237,0.2), rgba(6,182,212,0.15))' }}
          >
            <Puzzle size={40} className="opacity-30" style={{ color: COLORS.violet }} />
          </div>
        )}

        {/* Bottom gradient */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: 'linear-gradient(to top, rgba(8,11,20,0.85) 0%, transparent 55%)' }}
        />

        {/* Puzzle corner decoration */}
        <div className="absolute top-3 right-3 opacity-40">
          <svg width="22" height="22" viewBox={PUZZLE_VIEWBOX}>
            <path d={PUZZLE_PATH} fill="rgba(124,58,237,0.3)" stroke="rgba(124,58,237,0.8)" strokeWidth="2.5" />
          </svg>
        </div>

        {/* Hover links overlay */}
        <motion.div
          className="absolute inset-0 flex items-center justify-center gap-4"
          animate={{ opacity: hovered ? 1 : 0 }}
          transition={{ duration: 0.2 }}
        >
          {project.liveUrl && (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold text-white"
              style={{ background: 'rgba(124,58,237,0.85)', backdropFilter: 'blur(8px)' }}
              onClick={(e) => e.stopPropagation()}
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
              onClick={(e) => e.stopPropagation()}
            >
              <Github size={12} /> Code
            </a>
          )}
        </motion.div>
      </div>

      {/* Content at translateZ depth */}
      <div className="relative flex flex-col flex-1 p-5 gap-3" style={{ translateZ: 30, transformStyle: 'preserve-3d' }}>
        <h3 className="font-bold text-base leading-snug" style={{ color: COLORS.text }}>
          {project.title}
        </h3>
        <p className="text-xs leading-relaxed flex-1 line-clamp-3" style={{ color: COLORS.faint }}>
          {project.description}
        </p>
        <div
          className="flex flex-wrap gap-1.5 mt-auto pt-3"
          style={{ borderTop: `1px solid ${COLORS.border}` }}
        >
          {(project.techStack || []).map((tech, ti) => (
            <span
              key={ti}
              className="px-2 py-0.5 rounded text-[10px] font-semibold"
              style={{
                background: `${TECH_COLORS[ti % TECH_COLORS.length]}18`,
                color: TECH_COLORS[ti % TECH_COLORS.length],
                border: `1px solid ${TECH_COLORS[ti % TECH_COLORS.length]}30`,
              }}
            >
              {tech}
            </span>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

export default function Projects({ projects }) {
  return (
    <section
      className="relative py-28 px-6 overflow-hidden"
      style={{ background: COLORS.bg, zIndex: 1 }}
    >
      {/* Ambient glow */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 50% 40% at 20% 60%, rgba(124,58,237,0.07) 0%, transparent 70%)',
        }}
      />

      <div className="max-w-6xl mx-auto">
        <PuzzleHeading
          label="Projects"
          title="Completed Puzzle Segments"
          accentColor={COLORS.amber}
          gradientTo="#fb923c"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {(projects || []).map((project, i) => (
            <ProjectCard key={project.title || i} project={project} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
