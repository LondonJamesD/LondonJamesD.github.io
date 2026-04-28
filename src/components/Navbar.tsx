interface NavbarProps {
  activeSection: string;
}

const Navbar = ({ activeSection }: NavbarProps) => {
  const scrollTo = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <nav className="flex justify-center items-center gap-10 px-10 py-3 sticky top-6 mx-auto w-fit glass rounded-full z-50 border border-white/10 shadow-2xl">
      <button 
        onClick={() => scrollTo('about')} 
        className={`text-sm font-bold tracking-widest transition-all cursor-pointer ${activeSection === 'about' ? 'opacity-100 text-purple-400' : 'opacity-60 hover:opacity-100'}`}
      >
        ABOUT
      </button>
      <button 
        onClick={() => scrollTo('work')} 
        className={`text-sm font-bold tracking-widest transition-all cursor-pointer ${activeSection === 'work' ? 'opacity-100 text-purple-400' : 'opacity-60 hover:opacity-100'}`}
      >
        WORK
      </button>
      <div className="w-px h-4 bg-white/20 mx-2" />
      <a href="https://github.com/LondonJamesD" target="_blank" rel="noopener noreferrer" className="text-sm font-bold tracking-widest opacity-60 hover:opacity-100 transition-opacity">GITHUB</a>
      <a href="https://www.linkedin.com/in/london-d-47542427a/" target="_blank" rel="noopener noreferrer" className="text-sm font-bold tracking-widest opacity-60 hover:opacity-100 transition-opacity">LINKEDIN</a>
    </nav>
  );
};

export default Navbar;
