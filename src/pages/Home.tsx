import { useRef, useEffect } from 'react';
import Typewriter from '../components/Typewriter';

const Home = () => {
  const skills = ['Unity Engine', 'C# Architecture', 'React', 'TypeScript', 'Game Design', 'Tooling', 'FastAPI', 'Node.js', 'PostgreSQL', 'UI/UX'];
  const scrollRef = useRef<HTMLDivElement>(null);
  const targetScroll = useRef(0);
  const currentScroll = useRef(0);
  const isScrolling = useRef(false);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    const lerp = (start: number, end: number, factor: number) => {
      return start + (end - start) * factor;
    };

    const updateScroll = () => {
      if (!el) return;
      currentScroll.current = lerp(currentScroll.current, targetScroll.current, 0.1);
      el.scrollLeft = currentScroll.current;

      if (Math.abs(targetScroll.current - currentScroll.current) > 0.5) {
        requestAnimationFrame(updateScroll);
      } else {
        isScrolling.current = false;
        currentScroll.current = targetScroll.current;
        el.scrollLeft = currentScroll.current;
      }
    };

    const handleWheel = (e: WheelEvent) => {
      if (Math.abs(e.deltaY) > 0) {
        e.preventDefault();
        
        if (!isScrolling.current) {
          targetScroll.current = el.scrollLeft;
          currentScroll.current = el.scrollLeft;
          isScrolling.current = true;
          requestAnimationFrame(updateScroll);
        }
        
        const maxScroll = el.scrollWidth - el.clientWidth;
        targetScroll.current = Math.max(0, Math.min(targetScroll.current + e.deltaY * 1.5, maxScroll));
      }
    };

    el.addEventListener('wheel', handleWheel, { passive: false });
    return () => el.removeEventListener('wheel', handleWheel);
  }, []);

  return (
    <div className="max-w-6xl mx-auto px-6 py-12 space-y-24">
      {/* Hero Section */}
      <section className="flex flex-col md:flex-row items-center gap-16 text-center md:text-left">
        <div className="flex-1 space-y-4">
          <h2 className="text-base text-purple-400 font-serif tracking-widest opacity-80">
            <Typewriter text="London Dummer" speed={40} />
          </h2>
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight leading-tight">
            <Typewriter text="Systems & Development" speed={40} delay={1000} />
          </h1>
          <p className="text-lg opacity-70 max-w-lg mx-auto md:mx-0 leading-relaxed">
            I build game systems, tooling, and interactive web projects. 
            Focused on technical implementation and logic.
          </p>
        </div>
        <div className="relative">
          <img 
            src="/team/images/london_pfp.jpg" 
            alt="London Dummer" 
            className="w-56 h-56 md:w-64 md:h-64 rounded-2xl object-cover border border-white/5 shadow-2xl"
          />
        </div>
      </section>

      {/* Skills Section - Horizontally Scrollable via Mouse Wheel */}
      <section className="space-y-6">
        <h3 className="text-xs uppercase tracking-[0.3em] opacity-50 font-semibold ml-1">Core tech</h3>
        <div 
          ref={scrollRef}
          className="flex gap-4 overflow-x-auto no-scrollbar pb-2 -mx-6 px-6 cursor-ew-resize bg-transparent"
        >
          {skills.map(skill => (
            <div key={skill} className="flex-shrink-0 px-8 py-5 glass rounded-xl text-base font-semibold opacity-80 hover:opacity-100 transition-opacity border-white/10 pointer-events-auto">
              {skill}
            </div>
          ))}
        </div>
      </section>

      {/* About & Grid Section */}
      <section className="grid md:grid-cols-12 gap-16 items-start">
        <div className="md:col-span-5 space-y-8">
          <h2 className="text-2xl font-semibold tracking-wide opacity-90">Background</h2>
          <div className="space-y-6 opacity-70 text-base leading-relaxed font-medium">
            <p>
              I've been programming since I was young, starting with Unity games 
              and moving into the systems that power them.
            </p>
            <p>
              Currently building tools and assets for the Unity ecosystem, 
              with over 800 downloads across various packages.
            </p>
          </div>
        </div>

        <div className="md:col-span-7">
          <div className="grid grid-cols-4 gap-2 grid-flow-dense">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((i) => {
              let span = "";
              if (i === 1) span = "col-span-2 row-span-2";
              if (i === 5) span = "col-span-2 row-span-1";
              if (i === 8) span = "col-span-1 row-span-2";
              
              return (
                <div key={i} className={`aspect-square bg-white/5 rounded-lg overflow-hidden group border border-white/10 ${span}`}>
                  <img 
                    src={`/images/image${i}.jpg`} 
                    alt={`Project ${i}`}
                    className="w-full h-full object-cover transition-all duration-700 grayscale brightness-90 group-hover:grayscale-0 group-hover:brightness-100 group-hover:scale-105"
                  />
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
