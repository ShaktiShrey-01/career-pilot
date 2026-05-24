import React from 'react';
import { Utensils, Award, Clock, Star, ArrowUpRight } from 'lucide-react';

const Projects = () => {
  const culinaryProjects = [
    {
      id: 1,
      title: "The Alchemist's Tasting Menu",
      category: 'Menu Design & Concept',
      description: 'Curated a multi-sensory 9-course fine dining experience blending molecular gastronomy with traditional heritage flavors.',
      imageDesc: 'Plating artistry',
      icon: <Utensils className="w-5 h-5 text-amber-600" />,
      tags: ['Molecular Gastronomy', 'Fine Dining', 'Menu Curation']
    },
    {
      id: 2,
      title: 'Saffron & Stone Bistro',
      category: 'Culinary Consultation',
      description: 'Designed a sustainable, farm-to-table kitchen workflow and menu architecture, increasing seasonal profit margins by 22%.',
      imageDesc: 'Kitchen design',
      icon: <Award className="w-5 h-5 text-amber-600" />,
      tags: ['Kitchen Operations', 'Sustainability', 'Asset Management']
    },
    {
      id: 3,
      title: 'Le Petit Paris pop-up',
      category: 'Event Production',
      description: 'Led a highly acclaimed 3-week Parisian pastry pop-up event in downtown, serving over 4,500 artisanal desserts.',
      imageDesc: 'Artisanal pastries',
      icon: <Clock className="w-5 h-5 text-amber-600" />,
      tags: ['Pastry Arts', 'High-Volume Execution', 'Live Pop-up']
    }
  ];

  return (
    <section className="py-16 px-4 max-w-7xl mx-auto bg-stone-50 text-stone-900 rounded-2xl my-8 shadow-sm">
      <div className="text-center max-w-2xl mx-auto mb-14">
        <div className="flex justify-center items-center gap-2 text-amber-700 text-sm font-semibold tracking-widest uppercase mb-3">
          <Star className="w-4 h-4 fill-amber-700" />
          <span>Signature Work</span>
          <Star className="w-4 h-4 fill-amber-700" />
        </div>
        <h2 className="text-3xl md:text-4xl font-serif font-bold text-stone-800 tracking-tight">
          Culinary Creations & Projects
        </h2>
        <div className="h-0.5 w-16 bg-amber-600 mx-auto mt-4 rounded"></div>
        <p className="text-stone-600 mt-4 font-sans text-sm md:text-base leading-relaxed">
          A showcase of gastronomic concepts, high-performance kitchen layouts, and curated dining experiences executed across the globe.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {culinaryProjects.map((project) => (
          <div
            key={project.id}
            className="group flex flex-col bg-white border border-stone-200/80 rounded-xl overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
          >
            <div className="h-48 bg-stone-900 relative flex items-center justify-center p-6 overflow-hidden">
              <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#d97706_1px,transparent_1px)] [background-size:16px_16px]"></div>

              <div className="relative text-center z-10">
                <div className="p-4 bg-stone-800/90 border border-amber-600/30 rounded-full inline-block mb-3 shadow-inner group-hover:scale-110 transition-transform duration-300">
                  {project.icon}
                </div>
                <p className="text-stone-400 font-serif text-xs uppercase tracking-wider">Visual Showcase Portfolio</p>
                <p className="text-stone-500 font-mono text-[10px] mt-1">{`[ ${project.imageDesc} conceptualization ]`}</p>
              </div>

              <div className="absolute top-0 right-0 w-16 h-16 border-t-2 border-r-2 border-amber-600/20 m-3 group-hover:border-amber-600 transition-colors duration-300"></div>
            </div>

            <div className="p-6 flex flex-col flex-grow">
              <span className="text-xs font-semibold text-amber-700 tracking-wider uppercase mb-1">
                {project.category}
              </span>

              <h3 className="text-xl font-serif font-bold text-stone-800 group-hover:text-amber-800 transition-colors duration-200 flex items-center justify-between gap-2">
                {project.title}
                <ArrowUpRight className="w-4 h-4 opacity-0 group-hover:opacity-100 text-amber-700 transition-all duration-200 transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 shrink-0" />
              </h3>

              <p className="text-sm text-stone-600 mt-3 leading-relaxed flex-grow">
                {project.description}
              </p>

              <div className="flex flex-wrap gap-2 mt-6 pt-4 border-t border-stone-100">
                {project.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-[11px] font-medium font-sans tracking-wide px-2.5 py-1 rounded-md bg-stone-100 text-stone-700 border border-stone-200/40"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Projects;
