import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePortfolio } from '../../../../context/PortfolioContext';

export default function TextToSpeechNarratorDrive() {
  const { portfolioData } = usePortfolio();
  const { personal, socials, stats, skills, projects, experience, testimonials } = portfolioData;
  
  const [isPlaying, setIsPlaying] = useState(true);
  const [activeTab, setActiveTab] = useState('Overview');
  const [currentTime, setCurrentTime] = useState(0);

  const tabs = ['Overview', 'Projects', 'Experience', 'Equalizer', 'Testimonials', 'Contact'];

  // Fake audio progression loop
  useEffect(() => {
    let interval;
    if (isPlaying) {
      interval = setInterval(() => {
        setCurrentTime((prev) => (prev >= 100 ? 0 : prev + 0.2));
      }, 100);
    }
    return () => clearInterval(interval);
  }, [isPlaying]);

  // --- MEMOIZED ANIMATIONS ---
  const waveData = useMemo(() => {
    return [...Array(40)].map((_, i) => ({
      id: i,
      playing: { scaleY: [0.15, Math.random() * 0.7 + 0.3, 0.15] },
      paused: { scaleY: 0.1 },
      transition: { repeat: Infinity, duration: 0.6 + Math.random() * 0.5, ease: "easeInOut", delay: i * 0.02 }
    }));
  }, []);

  const spinAnim = useMemo(() => ({ rotate: [0, 360] }), []);
  const spinTrans = useMemo(() => ({ repeat: Infinity, duration: 8, ease: "linear" }), []);
  
  const glowAnim = useMemo(() => ({ opacity: [0.4, 0.8, 0.4], scale: [0.9, 1.1, 0.9] }), []);
  const glowTrans = useMemo(() => ({ repeat: Infinity, duration: 4, ease: "easeInOut" }), []);

  const dotAnim = useMemo(() => ({ scale: [1, 1.5, 1], opacity: [1, 0.5, 1] }), []);
  const dotTrans = useMemo(() => ({ repeat: Infinity, duration: 1.5 }), []);

  // --- Framer Motion Layout Variants ---
  const tabContentVariants = {
    initial: { opacity: 0, y: 20, filter: 'blur(10px)' },
    animate: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 0.5, ease: 'easeOut', staggerChildren: 0.1 } },
    exit: { opacity: 0, y: -20, filter: 'blur(10px)', transition: { duration: 0.3, ease: 'easeIn' } }
  };

  const itemVariants = {
    initial: { opacity: 0, y: 30, scale: 0.95 },
    animate: { opacity: 1, y: 0, scale: 1, transition: { type: 'spring', stiffness: 100, damping: 15 } }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-neutral-300 font-sans selection:bg-amber-500/30 overflow-hidden flex flex-col lg:flex-row">
      
      {/* LEFT PANEL: The Drive Player */}
      <div className="w-full lg:w-[350px] xl:w-[400px] bg-[#0a0a0a] border-b lg:border-b-0 lg:border-r border-neutral-900 p-6 lg:py-8 lg:px-8 flex flex-col relative z-20 shadow-[20px_0_50px_rgba(0,0,0,0.8)] lg:h-screen lg:sticky top-0 overflow-y-auto hide-scrollbar">
        
        {/* Status Bar */}
        <div className="flex items-center justify-between mb-auto pb-4 shrink-0">
          <div className="flex items-center space-x-3">
            <motion.div 
              animate={isPlaying ? dotAnim : { scale: 1, opacity: 0.5 }}
              transition={dotTrans}
              className="w-2.5 h-2.5 rounded-full bg-red-500" 
            />
            <span className="text-[10px] lg:text-xs font-mono font-bold tracking-[0.2em] text-neutral-500 uppercase">
              TTS // Engine.v3
            </span>
          </div>
          <span className="text-[10px] lg:text-xs font-mono text-amber-500/70">192kbps / Stereo</span>
        </div>
        
        {/* Core Player UI */}
        <div className="flex flex-col items-center justify-center w-full py-4 shrink-0">
          
          {/* Spinning Avatar / Vinyl */}
          <div className="relative mb-6 lg:mb-8 group perspective-1000">
            <motion.div 
              animate={isPlaying ? glowAnim : { opacity: 0, scale: 0.9 }}
              transition={glowTrans}
              className="absolute -inset-6 bg-amber-500/20 rounded-full blur-2xl pointer-events-none" 
            />
            <motion.div 
              animate={isPlaying ? spinAnim : { rotate: 0 }}
              transition={spinTrans}
              className="w-40 h-40 lg:w-48 lg:h-48 rounded-full border-[4px] border-[#050505] shadow-[0_0_30px_rgba(0,0,0,0.6)] relative overflow-hidden ring-1 ring-white/10 mx-auto"
            >
              <img src={personal.avatar} alt={personal.name} className="w-full h-full object-cover scale-110" />
              <div className="absolute inset-0 bg-gradient-to-tr from-black/80 via-transparent to-transparent" />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-6 h-6 bg-[#050505] rounded-full border border-neutral-800 shadow-inner" />
            </motion.div>
          </div>

          {/* Title & Tagline */}
          <motion.div layout className="text-center w-full mb-6">
            <motion.h1 layout className="text-2xl lg:text-3xl font-light text-white mb-2 tracking-tight leading-tight">{personal.name}</motion.h1>
            <motion.p layout className="text-amber-500 font-mono text-[10px] lg:text-xs tracking-widest uppercase mb-2">{personal.title}</motion.p>
            <motion.p layout className="text-neutral-500 text-xs max-w-[260px] mx-auto italic">"{personal.tagline}"</motion.p>
          </motion.div>

          {/* Scrubber & Audio Wave */}
          <div className="w-full mb-2">
            <div className="flex items-end justify-between w-full h-8 lg:h-10 mb-3 gap-[2px] overflow-hidden">
              {waveData.map((wave) => (
                <motion.div 
                  key={wave.id} 
                  initial={{ scaleY: 0.1 }}
                  animate={isPlaying ? wave.playing : wave.paused}
                  transition={wave.transition}
                  className="flex-1 h-full bg-amber-500 rounded-t-sm opacity-80 origin-bottom"
                  style={{ transformOrigin: "bottom" }}
                />
              ))}
            </div>

            <div className="group relative w-full h-1.5 bg-neutral-900 rounded-full cursor-pointer hover:h-2 transition-all overflow-hidden">
              <motion.div 
                className="absolute top-0 left-0 h-full bg-gradient-to-r from-amber-600 to-amber-300 rounded-full"
                style={{ width: `${currentTime}%` }}
                layout
              />
            </div>
            <div className="flex justify-between font-mono text-[9px] lg:text-[10px] text-neutral-600 mt-2 tracking-widest">
              <span>{`00:${Math.floor(currentTime * 0.6).toString().padStart(2, '0')}`}</span>
              <span>01:00</span>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-center space-x-6 mt-auto pt-4 shrink-0">
          <motion.button whileHover={{ scale: 1.2, color: '#fff' }} whileTap={{ scale: 0.9 }} className="text-neutral-600">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12.066 11.2a1 1 0 000 1.6l5.334 4A1 1 0 0019 16V8a1 1 0 00-1.6-.8l-5.333 4zM4.066 11.2a1 1 0 000 1.6l5.334 4A1 1 0 0011 16V8a1 1 0 00-1.6-.8l-5.334 4z" /></svg>
          </motion.button>
          
          <motion.button 
            whileHover={{ scale: 1.05, boxShadow: "0px 0px 20px rgba(245, 158, 11, 0.4)" }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsPlaying(!isPlaying)}
            className="w-16 h-16 bg-white rounded-full flex items-center justify-center text-black relative overflow-hidden group"
          >
            <motion.div 
              initial={false}
              animate={{ y: isPlaying ? '100%' : '0%' }}
              transition={{ duration: 0.4, ease: "circOut" }}
              className="absolute inset-0 bg-amber-400"
            />
            <span className="relative z-10 text-black">
              {isPlaying ? (
                <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24"><path d="M6 4h4v16H6zm8 0h4v16h-4z" /></svg>
              ) : (
                <svg className="w-8 h-8 ml-1.5" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
              )}
            </span>
          </motion.button>

          <motion.button whileHover={{ scale: 1.2, color: '#fff' }} whileTap={{ scale: 0.9 }} className="text-neutral-600">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11.933 12.8a1 1 0 000-1.6L6.6 7.2A1 1 0 005 8v8a1 1 0 001.6.8l5.333-4zM19.933 12.8a1 1 0 000-1.6l-5.333-4A1 1 0 0013 8v8a1 1 0 001.6.8l5.334-4z" /></svg>
          </motion.button>
        </div>
      </div>

      {/* RIGHT PANEL: Content Tracklist */}
      <div className="flex-1 flex flex-col h-auto lg:h-screen overflow-hidden bg-[#0a0a0a] relative">
        
        {/* Animated Background Mesh */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 50% 50%, #fff 1px, transparent 1px)', backgroundSize: '40px 40px' }} />

        {/* Navigation Tabs (Shared Element Underline) */}
        <div className="px-6 lg:px-12 pt-8 lg:pt-12 pb-4 border-b border-neutral-900 bg-[#0a0a0a]/90 backdrop-blur-xl sticky top-0 z-30">
          <div className="flex space-x-8 overflow-x-auto pb-2 scrollbar-hide relative hide-scrollbar">
            {tabs.map((tab) => (
              <button 
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`whitespace-nowrap text-xs lg:text-sm font-bold tracking-widest uppercase transition-colors relative py-2 ${activeTab === tab ? 'text-white' : 'text-neutral-600 hover:text-neutral-400'}`}
              >
                {tab}
                {activeTab === tab && (
                  <motion.div 
                    layoutId="activeTabUnderline"
                    className="absolute bottom-0 left-0 right-0 h-[2px] bg-amber-500 shadow-[0_-2px_10px_rgba(245,158,11,0.8)]" 
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content Area (AnimatePresence for smooth mounting/unmounting) */}
        <div className="flex-1 overflow-y-auto px-6 lg:px-12 py-8 lg:py-12 scroll-smooth relative z-10 hide-scrollbar">
          <AnimatePresence mode="wait">
            
            {/* OVERVIEW */}
            {activeTab === 'Overview' && (
              <motion.div key="overview" variants={tabContentVariants} initial="initial" animate="animate" exit="exit" className="max-w-4xl mx-auto space-y-12">
                <motion.div variants={itemVariants} className="relative group p-[1px] rounded-2xl bg-gradient-to-b from-neutral-800 to-transparent overflow-hidden">
                  <motion.div 
                    animate={{ x: ['-100%', '100%'] }} 
                    transition={{ duration: 3, repeat: Infinity, ease: "linear" }} 
                    className="absolute top-0 left-0 w-1/2 h-[2px] bg-gradient-to-r from-transparent via-amber-500 to-transparent opacity-50" 
                  />
                  <div className="bg-[#0f0f0f] p-8 lg:p-10 rounded-2xl relative">
                    <h2 className="text-xl font-light text-white mb-6 tracking-wide">Track 01. <span className="font-bold text-amber-500">Initialization</span></h2>
                    <p className="text-neutral-400 text-lg leading-relaxed font-light">{personal.bio}</p>
                  </div>
                </motion.div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {Object.entries(stats).map(([key, value]) => (
                    <motion.div 
                      key={key} 
                      variants={itemVariants}
                      whileHover={{ y: -10, scale: 1.02, borderColor: 'rgba(245,158,11,0.4)' }}
                      className="bg-[#0f0f0f] p-8 rounded-2xl border border-neutral-900 transition-colors relative overflow-hidden"
                    >
                      <div className="text-4xl lg:text-5xl font-bold text-white mb-3 tracking-tighter">{value}</div>
                      <div className="text-xs text-neutral-500 font-mono uppercase tracking-widest">{key.replace(/([A-Z])/g, ' $1').trim()}</div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* PROJECTS */}
            {activeTab === 'Projects' && (
              <motion.div key="projects" variants={tabContentVariants} initial="initial" animate="animate" exit="exit" className="max-w-4xl mx-auto space-y-6">
                {projects.map((project, idx) => (
                  <motion.div 
                    key={idx} 
                    variants={itemVariants}
                    whileHover={{ scale: 1.01, x: 10 }}
                    className="group relative bg-[#0f0f0f] rounded-2xl border border-neutral-900 overflow-hidden hover:border-amber-500/40 transition-colors"
                  >
                    <div className="flex flex-col sm:flex-row items-start sm:items-center p-6 lg:p-8 relative z-10">
                      
                      {/* Track Number */}
                      <div className="font-mono text-2xl font-bold text-neutral-800 group-hover:text-amber-500/30 transition-colors w-16 mb-4 sm:mb-0">
                        {String(idx + 1).padStart(2, '0')}
                      </div>
                      
                      {/* Project Image */}
                      <div className="w-full sm:w-40 h-28 rounded-xl overflow-hidden shrink-0 mb-4 sm:mb-0 relative">
                        <div className="absolute inset-0 bg-amber-500/20 opacity-0 group-hover:opacity-100 mix-blend-overlay transition-opacity z-10" />
                        <motion.img 
                          whileHover={{ scale: 1.1, rotate: 2 }} 
                          src={project.image} alt={project.title} 
                          className="w-full h-full object-cover" 
                        />
                      </div>
                      
                      {/* Project Content */}
                      <div className="sm:ml-8 flex-1 w-full relative z-20">
                        <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-amber-400 transition-colors">{project.title}</h3>
                        <p className="text-neutral-400 text-sm leading-relaxed mb-4">{project.description}</p>
                        
                        <div className="flex flex-wrap gap-2 mb-6">
                          {project.techStack.map(tech => (
                            <span key={tech} className="text-[10px] font-mono bg-[#1a1a1a] text-neutral-400 px-3 py-1.5 rounded-full border border-neutral-800 uppercase tracking-wider">
                              {tech}
                            </span>
                          ))}
                        </div>

                        {/* GitHub & Live URL Links */}
                        <div className="flex gap-6 items-center">
                          {project.githubUrl && (
                            <motion.a 
                              whileHover={{ scale: 1.05, color: '#f59e0b' }}
                              whileTap={{ scale: 0.95 }}
                              href={project.githubUrl} 
                              target="_blank" 
                              rel="noreferrer"
                              className="flex items-center gap-2 text-sm font-mono font-bold tracking-widest text-neutral-500 uppercase transition-colors cursor-pointer relative z-30"
                            >
                              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" /></svg>
                              <span>Repo</span>
                            </motion.a>
                          )}
                          {project.liveUrl && (
                            <motion.a 
                              whileHover={{ scale: 1.05, color: '#f59e0b' }}
                              whileTap={{ scale: 0.95 }}
                              href={project.liveUrl} 
                              target="_blank" 
                              rel="noreferrer"
                              className="flex items-center gap-2 text-sm font-mono font-bold tracking-widest text-neutral-500 uppercase transition-colors cursor-pointer relative z-30"
                            >
                              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                              <span>Live</span>
                            </motion.a>
                          )}
                        </div>

                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            )}

            {/* EXPERIENCE */}
            {activeTab === 'Experience' && (
              <motion.div key="experience" variants={tabContentVariants} initial="initial" animate="animate" exit="exit" className="max-w-4xl mx-auto relative before:absolute before:inset-0 before:left-[19px] md:before:left-1/2 md:before:-translate-x-[1px] before:h-full before:w-[2px] before:bg-gradient-to-b before:from-amber-500/50 before:via-neutral-900 before:to-transparent">
                {experience.map((exp, idx) => (
                  <motion.div key={idx} variants={itemVariants} className="relative flex flex-col md:flex-row items-start md:items-center justify-between mb-12 md:even:flex-row-reverse group">
                    
                    <motion.div 
                      whileHover={{ scale: 1.5, boxShadow: "0px 0px 20px rgba(245, 158, 11, 0.8)" }}
                      className="absolute left-[11px] md:left-1/2 md:-translate-x-1/2 w-4 h-4 rounded-full bg-[#050505] border-[3px] border-neutral-800 group-hover:border-amber-500 transition-colors z-10" 
                    />
                    
                    <div className="w-full pl-12 md:pl-0 md:w-[45%]">
                      <motion.div 
                        whileHover={{ y: -5, backgroundColor: "rgba(20,20,20,1)" }}
                        className="bg-[#0f0f0f] p-6 lg:p-8 rounded-2xl border border-neutral-900 group-hover:border-amber-500/30 transition-colors relative overflow-hidden"
                      >
                        <div className="flex flex-col mb-4">
                          <span className="text-amber-500 font-mono text-xs font-bold tracking-widest mb-2">{exp.period}</span>
                          <h4 className="font-bold text-white text-xl">{exp.role}</h4>
                          <span className="text-neutral-500 text-sm mt-1">{exp.company}</span>
                        </div>
                        <p className="text-neutral-400 text-sm leading-relaxed font-light">{exp.description}</p>
                      </motion.div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            )}

            {/* EQUALIZER (SKILLS) */}
            {activeTab === 'Equalizer' && (
              <motion.div key="equalizer" variants={tabContentVariants} initial="initial" animate="animate" exit="exit" className="max-w-4xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-10">
                  {skills.map((skill, idx) => (
                    <motion.div key={idx} variants={itemVariants} className="group">
                      <div className="flex justify-between text-sm mb-3 font-mono">
                        <span className="text-white font-bold tracking-wide">{skill.name}</span>
                        <span className="text-neutral-600 group-hover:text-amber-500 transition-colors">{skill.level}dB</span>
                      </div>
                      <div className="h-1.5 w-full bg-[#111] rounded-full overflow-hidden relative">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: `${skill.level}%` }}
                          transition={{ duration: 1.5, ease: "circOut", delay: idx * 0.1 }}
                          className="absolute top-0 left-0 h-full bg-gradient-to-r from-amber-700 via-amber-500 to-amber-300"
                        />
                        <motion.div 
                          animate={isPlaying ? { opacity: [0, 1, 0], x: ['-100%', '0%'] } : { opacity: 0 }}
                          transition={{ repeat: Infinity, duration: 2, ease: "linear", delay: (idx % 5) * 0.4 }}
                          className="absolute top-0 right-0 h-full w-10 bg-white/40 blur-[2px]"
                        />
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* TESTIMONIALS */}
            {activeTab === 'Testimonials' && (
              <motion.div key="testimonials" variants={tabContentVariants} initial="initial" animate="animate" exit="exit" className="max-w-5xl mx-auto columns-1 md:columns-2 gap-8 space-y-8">
                {testimonials.map((test, idx) => (
                  <motion.div 
                    key={idx} 
                    variants={itemVariants}
                    whileHover={{ scale: 1.02, rotate: idx % 2 === 0 ? 1 : -1 }}
                    className="break-inside-avoid bg-[#0f0f0f] p-8 rounded-3xl border border-neutral-900 hover:border-amber-500/40 relative group cursor-pointer"
                  >
                    <div className="absolute top-4 right-6 text-6xl font-serif text-neutral-800/50 group-hover:text-amber-500/10 transition-colors duration-500">"</div>
                    <p className="text-neutral-300 italic leading-relaxed mb-8 relative z-10 text-lg">"{test.text}"</p>
                    <div className="flex items-center space-x-4 relative z-10">
                      <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-neutral-800 group-hover:border-amber-500 transition-colors">
                        <img src={test.avatar} alt={test.name} className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <h4 className="text-white font-bold">{test.name}</h4>
                        <p className="text-neutral-500 text-xs font-mono uppercase mt-1">{test.role}</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            )}

            {/* CONTACT */}
            {activeTab === 'Contact' && (
              <motion.div key="contact" variants={tabContentVariants} initial="initial" animate="animate" exit="exit" className="max-w-2xl mx-auto mt-8">
                <motion.div 
                  whileHover={{ borderColor: 'rgba(245,158,11,0.5)' }}
                  className="bg-[#0f0f0f] p-12 rounded-[2.5rem] border border-neutral-900 text-center relative overflow-hidden group"
                >
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    {[1, 2, 3].map((ring) => (
                      <motion.div 
                        key={ring}
                        animate={{ scale: [0.8, 3], opacity: [1, 0] }}
                        transition={{ repeat: Infinity, duration: 3, ease: "linear", delay: ring * 1 }}
                        className="absolute w-32 h-32 border border-amber-500/20 rounded-full"
                      />
                    ))}
                  </div>

                  <div className="relative z-10">
                    <motion.div 
                      whileHover={{ scale: 1.2, rotate: 180 }}
                      transition={{ type: "spring", stiffness: 200 }}
                      className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-amber-500/10 text-amber-500 mb-6 cursor-pointer"
                    >
                      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                    </motion.div>
                    
                    <h2 className="text-3xl font-light text-white mb-2 tracking-wide">Open Frequency</h2>
                    <p className="text-neutral-400 mb-8 font-light">Broadcasting from <span className="text-amber-500 font-medium">{personal.location}</span>. Reach out to establish a connection.</p>
                    
                    <motion.a 
                      whileHover={{ scale: 1.05, backgroundColor: "#f59e0b", color: "#000", boxShadow: "0 0 20px rgba(245,158,11,0.5)" }}
                      whileTap={{ scale: 0.95 }}
                      href={`mailto:${socials.email}`} 
                      className="inline-block bg-white text-black font-bold font-mono tracking-widest uppercase px-8 py-4 rounded-full transition-colors mb-12"
                    >
                      Initialize Contact
                    </motion.a>

                    <div className="flex items-center justify-center space-x-8 pt-8 border-t border-neutral-900">
                      {Object.entries(socials).filter(([key, val]) => key !== 'email' && val).map(([platform, url]) => (
                        <motion.a 
                          key={platform} 
                          whileHover={{ y: -5, color: "#f59e0b" }}
                          href={url} target="_blank" rel="noreferrer" 
                          className="text-neutral-600 uppercase text-xs font-bold tracking-widest inline-block"
                        >
                          {platform}
                        </motion.a>
                      ))}
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            )}

          </AnimatePresence>
        </div>
      </div>
      <style>{`
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
}