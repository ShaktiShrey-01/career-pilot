import React, { useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { PUZZLE_PATH, PUZZLE_VIEWBOX } from '../utils/puzzleHelpers';

const SPRING_CFG = { stiffness: 400, damping: 30 };

/**
 * Glassmorphism card with 3D perspective tilt on hover.
 * Optional puzzle-piece corner accents that separate slightly on hover.
 */
export default function PuzzleCard({
  children,
  className = '',
  accentColor = '#7C3AED',
  pieceSeparate = true,
  style = {},
}) {
  const ref = useRef(null);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [10, -10]), SPRING_CFG);
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-10, 10]), SPRING_CFG);
  const glowOpacity = useSpring(0, { stiffness: 200, damping: 25 });

  function handleMouseMove(e) {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    mouseX.set((e.clientX - rect.left) / rect.width - 0.5);
    mouseY.set((e.clientY - rect.top)  / rect.height - 0.5);
    glowOpacity.set(1);
  }

  function handleMouseLeave() {
    mouseX.set(0);
    mouseY.set(0);
    glowOpacity.set(0);
  }

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX,
        rotateY,
        transformStyle: 'preserve-3d',
        perspective: 800,
        background: 'rgba(255,255,255,0.04)',
        border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: 20,
        backdropFilter: 'blur(10px)',
        position: 'relative',
        overflow: 'hidden',
        ...style,
      }}
      whileHover={{ y: -6 }}
      transition={{ duration: 0.25 }}
      className={className}
    >
      {/* Dynamic glow overlay */}
      <motion.div
        aria-hidden="true"
        style={{
          opacity: glowOpacity,
          pointerEvents: 'none',
          position: 'absolute',
          inset: 0,
          borderRadius: 20,
          background: `radial-gradient(circle at 50% 50%, ${accentColor}18 0%, transparent 70%)`,
          zIndex: 0,
        }}
      />

      {/* Corner puzzle piece accents */}
      {pieceSeparate && (
        <>
          <motion.div
            aria-hidden="true"
            className="absolute top-2 right-2 pointer-events-none"
            style={{ opacity: 0.25, translateZ: 20 }}
            whileHover={{ opacity: 0.7, x: 4, y: -4 }}
            transition={{ duration: 0.2 }}
          >
            <svg width="24" height="24" viewBox={PUZZLE_VIEWBOX}>
              <path d={PUZZLE_PATH} fill="none" stroke={accentColor} strokeWidth="2" />
            </svg>
          </motion.div>
          <motion.div
            aria-hidden="true"
            className="absolute bottom-2 left-2 pointer-events-none"
            style={{ opacity: 0.15, translateZ: 20 }}
            whileHover={{ opacity: 0.5, x: -4, y: 4 }}
            transition={{ duration: 0.2 }}
          >
            <svg width="18" height="18" viewBox={PUZZLE_VIEWBOX}>
              <path d={PUZZLE_PATH} fill="none" stroke={accentColor} strokeWidth="2" />
            </svg>
          </motion.div>
        </>
      )}

      {/* Content at depth */}
      <div style={{ position: 'relative', zIndex: 1, translateZ: 20, transformStyle: 'preserve-3d' }}>
        {children}
      </div>
    </motion.div>
  );
}
