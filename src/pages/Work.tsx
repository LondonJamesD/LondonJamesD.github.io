import { usePhysicsify } from '../hooks/usePhysicsify';
import { useMemo } from 'react';

const projects = [
  { title: 'The Daily News', link: '/layout/index.html', description: 'A clean and responsive news layout.' },
  { title: 'LJ Games', link: 'https://assetstore.unity.com/publishers/82732', description: 'My Unity Asset Store page with 800+ downloads.' },
  { title: 'MP3 Player', link: '/gizmos/mp3/musicplayer.html', isIframe: true },
  { title: '3D Canvas Demo', link: '/personal/3D_Demo/index.html', isIframe: true },
  { title: 'VSLR', link: '/team/index.html', description: 'Collaborative project site for card game platform.' },
  { title: 'Lab 5.1', link: '/lab51/catchTheRabbit/index.html', description: 'Interactive logic game.', isIframe: true },
  { title: 'Lab 6.1 & 7.1', link: '/lab71/ballDemo.html', description: 'Physics and circle collision demo.', isIframe: true },
  { title: 'Burger Clicker 2027', link: '/burgerclicker/index.html', description: 'Retro-inspired incremental game.' },
  { title: 'Murder Mystery', link: '/js_assignment/index.html', description: 'Story-driven decision game.' },
  { title: 'Rubber', link: 'https://github.com/stormy232/Rubber', description: 'AI-powered handwriting to LaTeX converter.' },
];

const Work = () => {
  const { isPhysicsActive, togglePhysics } = usePhysicsify();

  const cardColors = useMemo(() => {
    return projects.map((_, index) => {
      const hues = [260, 280, 240, 220]; 
      const hue = hues[index % hues.length];
      return `hsl(${hue}, 40%, 15%)`;
    });
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <div className="flex flex-col md:flex-row justify-between items-end mb-24 gap-8">
        <div className="space-y-1 text-left">
          <h1 className="text-5xl font-bold tracking-tight">Experiments</h1>
          <p className="text-lg opacity-70 font-medium">Web, game, and system prototypes.</p>
        </div>
        <button 
          onClick={() => togglePhysics('.square-card')}
          className="px-8 py-3 glass rounded-lg font-semibold hover:bg-white/10 active:scale-95 transition-all z-50 border-white/10"
        >
          {isPhysicsActive ? 'Reset' : 'Start physics'}
        </button>
      </div>
      
      {/* Expanded grid gap for physics space */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 min-h-[1200px]">
        {projects.map((project, index) => (
          <div 
            key={index} 
            className="square-card glass rounded-2xl overflow-hidden flex flex-col group transition-all duration-300 hover:border-white/20"
            style={{ 
              backgroundColor: project.isIframe ? 'rgba(10,10,12,0.95)' : cardColors[index],
              minHeight: '340px'
            }}
          >
            {project.isIframe ? (
              <div className="h-full flex flex-col">
                <div className="flex-grow bg-black/60 overflow-hidden relative flex items-center justify-center">
                   <iframe 
                      src={project.link} 
                      className="w-full h-full border-none absolute inset-0" 
                      title={project.title}
                      scrolling="no"
                    />
                   {!isPhysicsActive && <div className="absolute inset-0 z-10 pointer-events-none" />}
                </div>
                <div className="p-4 border-t border-white/10">
                  <h3 className="text-sm font-semibold opacity-80 tracking-wide">{project.title}</h3>
                </div>
              </div>
            ) : (
              <div className="p-8 flex flex-col h-full">
                <div className="flex-grow space-y-3">
                   <h3 className="text-xl font-bold tracking-tight opacity-95">{project.title}</h3>
                   <p className="text-base opacity-70 leading-snug font-medium">{project.description}</p>
                </div>
                <div className="mt-6">
                  <a 
                    href={project.link} 
                    target={project.link.startsWith('http') ? "_blank" : "_self"}
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 font-semibold text-sm opacity-70 hover:opacity-100 transition-opacity tracking-wide"
                  >
                    View project
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                  </a>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Work;
