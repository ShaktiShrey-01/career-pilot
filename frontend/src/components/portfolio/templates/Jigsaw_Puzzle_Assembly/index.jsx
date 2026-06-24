import React from 'react';
import { usePortfolio } from '../../../../context/PortfolioContext';

import FloatingPuzzleBackground from './FloatingPuzzleBackground';
import Hero         from './sections/Hero';
import About        from './sections/About';
import Skills       from './sections/Skills';
import Projects     from './sections/Projects';
import Experience   from './sections/Experience';
import Testimonials from './sections/Testimonials';
import Contact      from './sections/Contact';

/**
 * Jigsaw Puzzle Assembly Portfolio Template
 * Category: Portfolio — Interactive / Dark
 * Description: A scroll-driven puzzle assembly experience where every section
 * emerges from scattered fragments that progressively connect into a complete
 * picture of the user's professional identity.
 *
 * Architecture: Volcanic_Forge pattern — selective destructuring at root,
 * specific props passed to each section.
 */
export default function JigsawPuzzleAssembly() {
  const { portfolioData: data } = usePortfolio();

  if (!data) return null;

  const { personal, socials, skills, projects, experience, testimonials, stats } = data;

  return (
    <div
      className="relative min-h-screen overflow-x-hidden font-sans"
      style={{ background: '#080B14', color: '#F1F5F9' }}
    >
      {/* Global animated background — visible behind all sections */}
      <FloatingPuzzleBackground />

      {/* Sections stacked with z-index: 1 to sit above fixed background */}
      <Hero         personal={personal}      socials={socials}       stats={stats}        />
      <About        personal={personal}      stats={stats}                                />
      <Skills       skills={skills}                                                       />
      <Projects     projects={projects}                                                   />
      <Experience   experience={experience}                                               />
      <Testimonials testimonials={testimonials}                                           />
      <Contact      personal={personal}      socials={socials}                           />
    </div>
  );
}
