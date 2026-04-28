import { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  z: number;
  baseX: number;
  baseY: number;
  baseZ: number;
}

const InteractiveBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = window.innerWidth;
    let height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;

    const particles: Particle[] = [];
    const spacing = 120; // Slightly sparser for better performance with connections
    const connectionDist = 180;
    const mouseConnectionDist = 250;
    let time = 0;

    const initParticles = () => {
      particles.length = 0;
      for (let x = -spacing; x < width + spacing; x += spacing) {
        for (let y = -spacing; y < height + spacing; y += spacing) {
          const baseZ = Math.random() * 0.5 + 0.5; // Depth factor
          particles.push({
            x,
            y,
            z: baseZ,
            baseX: x,
            baseY: y,
            baseZ: baseZ,
          });
        }
      }
    };

    initParticles();

    const handleResize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
      initParticles();
    };

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouseMove);

    let animationFrameId: number;

    const draw = () => {
      time += 0.015;
      ctx.clearRect(0, 0, width, height);

      // Mouse glow (Background)
      const bgGradient = ctx.createRadialGradient(
        mouseRef.current.x, mouseRef.current.y, 0,
        mouseRef.current.x, mouseRef.current.y, 500
      );
      bgGradient.addColorStop(0, 'rgba(170, 59, 255, 0.08)');
      bgGradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = bgGradient;
      ctx.fillRect(0, 0, width, height);

      // Update particles
      particles.forEach((p) => {
        // Wavy movement with Z simulation
        const waveX = Math.sin(time + p.baseY * 0.01) * 30 * p.baseZ;
        const waveY = Math.cos(time + p.baseX * 0.01) * 30 * p.baseZ;
        const waveZ = Math.sin(time * 0.5 + (p.baseX + p.baseY) * 0.005) * 0.2;
        
        p.z = p.baseZ + waveZ;
        p.x = p.baseX + waveX;
        p.y = p.baseY + waveY;

        // Mouse displacement
        const dx = mouseRef.current.x - p.x;
        const dy = mouseRef.current.y - p.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 250) {
          const force = (250 - dist) / 250;
          p.x -= dx * force * 0.3;
          p.y -= dy * force * 0.3;
        }

        // Draw particle with depth scaling
        const size = 1.5 * p.z;
        const opacity = p.z * 0.6;
        ctx.beginPath();
        ctx.arc(p.x, p.y, size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(170, 59, 255, ${opacity})`;
        ctx.fill();
      });

      // Draw connections between grid particles
      ctx.lineWidth = 0.5;
      for (let i = 0; i < particles.length; i++) {
        const p1 = particles[i];
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dx = p1.x - p2.x;
          const dy = p1.y - p2.y;
          const distSq = dx * dx + dy * dy;

          if (distSq < connectionDist * connectionDist) {
            const dist = Math.sqrt(distSq);
            const opacity = (1 - dist / connectionDist) * 0.2 * (p1.z * p2.z);
            ctx.strokeStyle = `rgba(170, 59, 255, ${opacity})`;
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
          }
        }

        // Higher contrast connections to mouse
        const mdx = mouseRef.current.x - p1.x;
        const mdy = mouseRef.current.y - p1.y;
        const mdistSq = mdx * mdx + mdy * mdy;

        if (mdistSq < mouseConnectionDist * mouseConnectionDist) {
          const mdist = Math.sqrt(mdistSq);
          const mOpacity = (1 - mdist / mouseConnectionDist) * 0.5 * p1.z;
          ctx.strokeStyle = `rgba(190, 100, 255, ${mOpacity})`;
          ctx.lineWidth = 1 * p1.z;
          ctx.beginPath();
          ctx.moveTo(p1.x, p1.y);
          ctx.lineTo(mouseRef.current.x, mouseRef.current.y);
          ctx.stroke();
        }
      }

      // Mouse particle
      ctx.beginPath();
      ctx.arc(mouseRef.current.x, mouseRef.current.y, 3, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(200, 120, 255, 0.9)';
      ctx.shadowBlur = 10;
      ctx.shadowColor = 'rgba(170, 59, 255, 0.8)';
      ctx.fill();
      ctx.shadowBlur = 0; // Reset for performance

      animationFrameId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      style={{ background: '#000000' }}
    />
  );
};

export default InteractiveBackground;
