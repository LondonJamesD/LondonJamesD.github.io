import { Routes, Route } from 'react-router-dom';
import { useState, useRef } from 'react';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Journal from './pages/Journal';
import Work from './pages/Work';
import RainEffect from './components/RainEffect';

function App() {
  const [isMuted, setIsMuted] = useState(true);
  const audioRef = useRef<HTMLAudioElement>(null);

  const toggleMute = () => {
    if (audioRef.current) {
      if (isMuted) {
        audioRef.current.play().catch(e => console.log("Audio play blocked", e));
      } else {
        audioRef.current.pause();
      }
      setIsMuted(!isMuted);
    }
  };

  return (
    <div className="min-h-screen selection:bg-purple-500/30 overflow-x-hidden">
      {/* Background Image Layer */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="background-wallpaper absolute inset-0"></div>
      </div>

      {/* Canvas Rain Effect */}
      <RainEffect />

      {/* Rain Sound */}
      <audio 
        ref={audioRef}
        src="/js_assignment/art/music/rain.mp3" 
        loop 
      />

      {/* Audio Control */}
      <button 
        onClick={toggleMute}
        className="fixed bottom-6 right-6 z-50 p-3 glass rounded-full opacity-40 hover:opacity-100 transition-all active:scale-90"
        title={isMuted ? "Unmute rain" : "Mute rain"}
      >
        {isMuted ? (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.586 15H4a1 1 0 01-1-1V10a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
          </svg>
        ) : (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1V10a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
          </svg>
        )}
      </button>

      {/* Static Background Glows */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-900/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-900/5 rounded-full blur-[120px]" />
      </div>

      <div className="relative z-10 flex flex-col min-h-screen">
        <header className="fixed top-0 left-0 right-0 z-50 pointer-events-none p-6">
          <div className="pointer-events-auto flex justify-center">
            <Navbar />
          </div>
        </header>

        <main className="flex-grow pt-24">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/journal" element={<Journal />} />
            <Route path="/work" element={<Work />} />
          </Routes>
        </main>

        <footer className="py-12 border-t border-white/5 bg-black/40 backdrop-blur-md text-center">
          <div className="max-w-4xl mx-auto px-6">
            <p className="opacity-60 mb-2 font-medium">londonjamesgames@gmail.com</p>
            <p className="text-xs opacity-20 uppercase tracking-widest">&copy; London Dummer 2026</p>
          </div>
        </footer>
      </div>
    </div>
  );
}

export default App;
