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
        <div className="flex-1 space-y-6">
          <h2 className="text-xl text-purple-400 font-bold tracking-[0.4em] uppercase opacity-90">
            <Typewriter text="London Dummer" speed={40} />
          </h2>
          <h1 className="text-6xl md:text-8xl font-black tracking-tighter leading-none text-white">
            <Typewriter text="Systems & Development" speed={40} delay={1000} />
          </h1>
          <p className="text-xl opacity-80 max-w-lg mx-auto md:mx-0 leading-relaxed font-medium">
            I build game systems, tooling, and interactive web projects. 
            Focused on technical implementation and logic.
          </p>
        </div>
        <div className="relative group">
          <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000"></div>
          <img 
            src="/team/images/london_pfp.jpg" 
            alt="London Dummer" 
            className="relative w-56 h-56 md:w-64 md:h-64 rounded-2xl object-cover border border-white/10 shadow-2xl"
          />
        </div>
      </section>

      {/* Skills Section */}
      <section className="space-y-8">
        <h3 className="text-xs uppercase tracking-[0.4em] opacity-40 font-black ml-1">Core tech</h3>
        <div 
          ref={scrollRef}
          className="flex gap-4 overflow-x-auto no-scrollbar pb-4 -mx-6 px-6 cursor-ew-resize bg-transparent"
        >
          {skills.map(skill => (
            <div key={skill} className="flex-shrink-0 px-10 py-6 glass rounded-2xl text-lg font-bold text-white hover:border-purple-500/50 transition-all pointer-events-auto">
              {skill}
            </div>
          ))}
        </div>
      </section>

      {/* About & Grid Section */}
      <section className="grid md:grid-cols-12 gap-16 items-start">
        <div className="md:col-span-5 space-y-8">
          <h2 className="text-3xl font-bold tracking-tight text-white">Background</h2>
          <div className="space-y-6 opacity-80 text-lg leading-relaxed font-medium">
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
          <div className="grid grid-cols-4 gap-3 grid-flow-dense">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((i) => {
              let span = "";
              if (i === 1) span = "col-span-2 row-span-2";
              if (i === 5) span = "col-span-2 row-span-1";
              if (i === 8) span = "col-span-1 row-span-2";
              
              return (
                <div key={i} className={`aspect-square bg-white/5 rounded-xl overflow-hidden group border border-white/10 ${span}`}>
                  <img 
                    src={`/images/image${i}.jpg`} 
                    alt={`Project ${i}`}
                    className="w-full h-full object-cover transition-all duration-700 grayscale brightness-100 group-hover:grayscale-0 group-hover:scale-105"
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
