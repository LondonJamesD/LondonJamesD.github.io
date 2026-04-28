const Journal = () => {
  return (
    <div className="max-w-4xl mx-auto px-6 py-24">
      <h1 className="text-6xl font-bold tracking-tight mb-16 text-center">
        Journal
      </h1>
      
      <div className="space-y-12">
        <section className="glass p-12 rounded-[2.5rem] relative overflow-hidden group transition-all">
          <div className="absolute top-0 right-0 p-8 opacity-10 text-8xl font-bold select-none pointer-events-none">01</div>
          <h2 className="text-3xl font-semibold text-accent mb-6 relative tracking-wide">My start</h2>
          <p className="text-xl leading-relaxed opacity-80">
            My name is London Dummer, and I have been programming and learning about software since I was young. 
            I have always been fascinated with computers, and got my start by making simple games in Unity. 
            Over time however, my focus became more about the systems behind games. 
            I made procedural generators, simulations, and other background stuff.
          </p>
        </section>

        <section className="glass p-12 rounded-[2.5rem] relative overflow-hidden group transition-all">
          <div className="absolute top-0 right-0 p-8 opacity-10 text-8xl font-bold select-none pointer-events-none">02</div>
          <h2 className="text-3xl font-semibold text-accent mb-6 relative tracking-wide">Business</h2>
          <p className="text-xl leading-relaxed opacity-80">
            Over time, I realized that my work was good, but I wanted to provide it for everyone. 
            So, I started a small sole proprietorship called LJ Games, where I sell my Unity assets and tools. 
            I have over 800 downloads, and the number keeps growing! Check out my store if you're a game developer, 
            or if you are building simulations in the Unity Engine. I have currently published 3 production ready 
            tooling packages and 7 visual asset packs.
          </p>
        </section>

        <section className="glass p-12 rounded-[2.5rem] relative overflow-hidden group transition-all">
          <div className="absolute top-0 right-0 p-8 opacity-10 text-8xl font-bold select-none pointer-events-none">03</div>
          <h2 className="text-3xl font-semibold text-accent mb-6 relative tracking-wide">Further on</h2>
          <p className="text-xl leading-relaxed opacity-80">
            I ended up getting into web development as well, thanks to my University experience. 
            I find it quite enjoyable, and have actually made two webgames for you to try! 
            Check em out on the work page. I have some experience in C, C#, Java, JavaScript, Python, and more! 
            I am always looking to learn new languages and tools, and if you feel I'd be a good fit for your team, 
            please reach out!
          </p>
        </section>
      </div>
    </div>
  );
};

export default Journal;
