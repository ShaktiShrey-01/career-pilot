import React from 'react';
import { usePortfolio } from '../../../../context/PortfolioContext';
import Hero from './Hero';
import About from './About';
import Skills from './Skills';
import Projects from './Projects';
import Experience from './Experience';
import Testimonials from './Testimonials';
import Contact from './Contact';

export default function JigsawPuzzleAssembly() {
  const { portfolioData: data } = usePortfolio();
  if (!data) return null;

  return (
    <div
      className="min-h-screen overflow-x-hidden font-sans"
      style={{ background: '#080B14', color: '#F1F5F9' }}
    >
      <Hero data={data} />
      <About data={data} />
      <Skills data={data} />
      <Projects data={data} />
      <Experience data={data} />
      <Testimonials data={data} />
      <Contact data={data} />
    </div>
  );
}
