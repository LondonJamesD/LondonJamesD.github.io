import { useEffect, useRef } from 'react';

const RainEffect = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = window.innerWidth;
    let height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;

    const handleResize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
    };
    
    window.addEventListener('resize', handleResize);

    const dropCount = 150;
    const drops: { x: number; y: number; length: number; speed: number; opacity: number; thickness: number }[] = [];

    for (let i = 0; i < dropCount; i++) {
      drops.push({
        x: Math.random() * width,
        y: Math.random() * height,
        length: Math.random() * 25 + 5,
        speed: Math.random() * 8 + 12,
        opacity: Math.random() * 0.15 + 0.05,
        thickness: Math.random() * 1 + 0.5,
      });
    }

    let animationFrameId: number;

    const draw = () => {
      ctx.clearRect(0, 0, width, height);
      
      ctx.lineCap = 'round';

      for (let i = 0; i < dropCount; i++) {
        const drop = drops[i];
        
        ctx.beginPath();
        ctx.moveTo(drop.x, drop.y);
        ctx.lineTo(drop.x, drop.y + drop.length);
        ctx.strokeStyle = `rgba(255, 255, 255, ${drop.opacity})`;
        ctx.lineWidth = drop.thickness;
        ctx.stroke();

        drop.y += drop.speed;

        if (drop.y > height) {
          drop.y = -drop.length;
          drop.x = Math.random() * width;
        }
      }

      animationFrameId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas 
      ref={canvasRef} 
      className="fixed inset-0 pointer-events-none z-10"
      style={{ opacity: 0.6 }}
    />
  );
};

export default RainEffect;
