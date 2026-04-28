import { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Work from './pages/Work';
import InteractiveBackground from './components/InteractiveBackground';

function App() {
  const [activeSection, setActiveSection] = useState('about');
  
  // Intersection Observer for the "dynamic loading" / "smooth pulldown" effect
  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: '0px',
      threshold: 0.1,
    };

    const handleIntersect = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          setActiveSection(entry.target.id);
        }
      });
    };

    const observer = new IntersectionObserver(handleIntersect, observerOptions);
    const sections = document.querySelectorAll('section[id]');
    sections.forEach((section) => observer.observe(section));

    return () => observer.disconnect();
  }, []);

  return (
    <div className="min-h-screen selection:bg-purple-500/30 overflow-x-hidden bg-black text-white font-sans">
      {/* Interactive Background Template */}
      <InteractiveBackground />

      <div className="relative z-10 flex flex-col min-h-screen">
        <header className="fixed top-0 left-0 right-0 z-50 pointer-events-none p-6">
          <div className="pointer-events-auto flex justify-center">
            <Navbar activeSection={activeSection} />
          </div>
        </header>

        <main className="flex-grow">
          {/* About Section */}
          <section id="about" className="section-entrance pt-32 pb-20">
            <Home />
          </section>

          {/* Work Section */}
          <section id="work" className="section-entrance py-20 border-t border-white/5">
            <Work />
          </section>
        </main>

        <footer className="py-20 border-t border-white/10 bg-black/80 backdrop-blur-md text-center">
          <div className="max-w-4xl mx-auto px-6">
            <p className="opacity-80 mb-2 font-semibold text-lg">londonjamesgames@gmail.com</p>
            <p className="text-xs opacity-40 uppercase tracking-[0.4em] font-bold">&copy; London Dummer 2026</p>
          </div>
        </footer>
      </div>
    </div>
  );
}

export default App;
