import React from 'react';

const ExperienceInfo: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <section className="space-y-16 pb-24">
        <div className="grid md:grid-cols-2 gap-8">
          {/* Education & Academic Success */}
          <div className="glass p-8 rounded-3xl space-y-6">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-2xl font-black">McMaster University</h3>
                <p className="text-purple-400 font-bold uppercase tracking-wider text-sm">Computer Science 1 CO-OP</p>
              </div>
              <div className="text-right">
                <span className="text-4xl font-black text-white">10.5</span>
                <span className="text-xs opacity-50 block uppercase font-bold">Term GPA</span>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="text-xs uppercase tracking-[0.2em] opacity-40 font-black">Key Academic Performance</h4>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-sm font-bold">Intro to Programming</p>
                  <p className="text-2xl font-black text-white/90">A+</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-bold">Intro to Communication</p>
                  <p className="text-2xl font-black text-white/90">A+</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-bold">Comput Thinking</p>
                  <p className="text-2xl font-black text-white/90">A</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-bold">Microeconomics</p>
                  <p className="text-2xl font-black text-white/90">A</p>
                </div>
              </div>
            </div>
          </div>

          {/* Professional Impact */}
          <div className="glass p-8 rounded-3xl space-y-6">
            <div>
              <h3 className="text-2xl font-black">Professional Impact</h3>
              <p className="text-purple-400 font-bold uppercase tracking-wider text-sm">Unity Ecosystem & Automation</p>
            </div>

            <div className="space-y-6">
              <div className="flex gap-6 items-center">
                <div className="text-4xl font-black text-white">800+</div>
                <div className="text-sm leading-tight opacity-80">
                  <span className="font-bold block text-white">Cumulative Downloads</span>
                  Across multiple C# tools and simulation frameworks on the Unity Asset Store.
                </div>
              </div>

              <div className="flex gap-6 items-center">
                <div className="text-4xl font-black text-white text-nowrap">5 <span className="text-xl">★</span></div>
                <div className="text-sm leading-tight opacity-80">
                  <span className="font-bold block text-white">User Rating</span>
                  Maintained excellence and user trust across all published assets.
                </div>
              </div>

              <div className="pt-4 border-t border-white/10">
                <p className="text-sm opacity-70 italic">
                  Currently developing logistics automation at Artlabel, integrating Google APIs and Python tooling to streamline nationwide operations.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Project Highlight Row */}
        <div className="glass p-8 rounded-3xl overflow-hidden relative group">
          <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
            <svg className="w-32 h-32" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z" />
            </svg>
          </div>

          <div className="relative z-10 space-y-6">
            <h3 className="text-xs uppercase tracking-[0.4em] opacity-40 font-black">Featured Development</h3>
            <div className="grid md:grid-cols-3 gap-12">
              <div className="space-y-2">
                <h4 className="text-xl font-black text-white">Naturoll</h4>
                <p className="text-sm opacity-70">Architected core trading systems and server APIs for a web-based card game.</p>
              </div>
              <div className="space-y-2">
                <h4 className="text-xl font-black text-white">Rubber</h4>
                <p className="text-sm opacity-70">React & TypeScript handwriting-to-LaTeX tool with AI integrations.</p>
              </div>
              <div className="space-y-2">
                <h4 className="text-xl font-black text-white">LJ Tags/Stats</h4>
                <p className="text-sm opacity-70">Deterministic simulation systems and high-performance Unity tag replacements.</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ExperienceInfo;
