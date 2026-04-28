import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="flex justify-center items-center gap-12 px-12 py-3 sticky top-6 mx-auto w-fit glass rounded-full z-50 border border-white/5 shadow-2xl">
      <Link to="/" className="text-sm font-medium tracking-wide opacity-70 hover:opacity-100 transition-opacity">About</Link>
      <Link to="/journal" className="text-sm font-medium tracking-wide opacity-70 hover:opacity-100 transition-opacity">Journal</Link>
      <Link to="/work" className="text-sm font-medium tracking-wide opacity-70 hover:opacity-100 transition-opacity">Work</Link>
      <div className="w-px h-4 bg-white/10" />
      <a href="https://github.com/LondonJamesD" target="_blank" rel="noopener noreferrer" className="text-sm font-medium tracking-wide opacity-70 hover:opacity-100 transition-opacity">GitHub</a>
      <a href="https://www.linkedin.com/in/london-d-47542427a/" target="_blank" rel="noopener noreferrer" className="text-sm font-medium tracking-wide opacity-70 hover:opacity-100 transition-opacity">LinkedIn</a>
    </nav>
  );
};

export default Navbar;
