import { useState, useCallback, useRef } from 'react';

interface Body {
  el: HTMLElement;
  x: number;
  y: number;
  w: number;
  h: number;
  vx: number;
  vy: number;
  isDragging: boolean;
  leftOrigin: number;
  topOrigin: number;
}

export const usePhysicsify = () => {
  const [isPhysicsActive, setIsPhysicsActive] = useState(false);
  const bodiesRef = useRef<Body[]>([]);
  const requestRef = useRef<number>(null);

  const startPhysics = useCallback((containerSelector: string) => {
    const cards = Array.from(document.querySelectorAll(containerSelector)) as HTMLElement[];
    const footer = document.querySelector('footer');
    const bodies: Body[] = [];

    // Capture all dimensions FIRST to avoid layout thrashing
    const rects = cards.map(card => card.getBoundingClientRect());

    cards.forEach((card, i) => {
      const rect = rects[i];
      
      const body: Body = {
        el: card,
        x: rect.left,
        y: rect.top,
        w: rect.width,
        h: rect.height,
        vx: (Math.random() - 0.5) * 10,
        vy: (Math.random() - 0.5) * 5,
        isDragging: false,
        leftOrigin: rect.left,
        topOrigin: rect.top,
      };

      // Set styles to absolute and fix dimensions
      card.style.width = `${rect.width}px`;
      card.style.height = `${rect.height}px`;
      card.style.position = 'fixed';
      card.style.left = `${rect.left}px`;
      card.style.top = `${rect.top}px`;
      card.style.margin = '0';
      card.style.zIndex = '1000';
      card.style.transition = 'none';
      card.style.cursor = 'grab';
      card.style.pointerEvents = 'auto';

      const iframe = card.querySelector('iframe');
      if (iframe) {
        iframe.style.pointerEvents = 'none';
      }

      bodies.push(body);
    });

    bodiesRef.current = bodies;

    let draggedBody: Body | null = null;
    let lastMouseX = 0;
    let lastMouseY = 0;

    const handlePointerDown = (e: PointerEvent) => {
      const target = (e.target as HTMLElement).closest(containerSelector) as HTMLElement;
      if (!target) return;
      
      const body = bodiesRef.current.find(b => b.el === target);
      if (body) {
        draggedBody = body;
        body.isDragging = true;
        body.el.style.cursor = 'grabbing';
        body.el.style.zIndex = '1001';
        lastMouseX = e.clientX;
        lastMouseY = e.clientY;
        body.vx = 0;
        body.vy = 0;
      }
    };

    window.addEventListener('pointerdown', handlePointerDown);

    const handlePointerMove = (e: PointerEvent) => {
      if (!draggedBody) return;
      const dx = e.clientX - lastMouseX;
      const dy = e.clientY - lastMouseY;
      draggedBody.x += dx;
      draggedBody.y += dy;
      draggedBody.vx = dx * 0.5;
      draggedBody.vy = dy * 0.5;
      lastMouseX = e.clientX;
      lastMouseY = e.clientY;
    };

    const handlePointerUp = () => {
      if (draggedBody) {
        draggedBody.isDragging = false;
        draggedBody.el.style.cursor = 'grab';
        draggedBody.el.style.zIndex = '1000';
        draggedBody = null;
      }
    };

    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerUp);

    const gravity = 0.5;
    const bounce = 0.6;
    const friction = 0.98;

    const animate = () => {
      const ww = window.innerWidth;
      const wh = window.innerHeight;
      const footerTop = footer ? footer.getBoundingClientRect().top : wh;
      const currentBodies = bodiesRef.current;

      for (let i = 0; i < currentBodies.length; i++) {
        const b = currentBodies[i];
        if (!b.isDragging) {
          b.vy += gravity;
          b.vx *= friction;
          b.vy *= friction;
          b.x += b.vx;
          b.y += b.vy;
        }

        // Screen boundaries
        if (b.x < 0) { b.x = 0; b.vx *= -bounce; }
        if (b.x + b.w > ww) { b.x = ww - b.w; b.vx *= -bounce; }
        if (b.y < 0) { b.y = 0; b.vy *= -bounce; }
        if (b.y + b.h > footerTop) {
          b.y = footerTop - b.h;
          b.vy *= -bounce;
          if (Math.abs(b.vy) < 1) b.vy = 0;
          b.vx *= 0.8;
        }
      }

      // Collisions
      for (let i = 0; i < currentBodies.length; i++) {
        for (let j = i + 1; j < currentBodies.length; j++) {
          const b1 = currentBodies[i];
          const b2 = currentBodies[j];
          if (b1.x < b2.x + b2.w && b1.x + b1.w > b2.x &&
              b1.y < b2.y + b2.h && b1.y + b1.h > b2.y) {
            const overlapX = Math.min(b1.x + b1.w - b2.x, b2.x + b2.w - b1.x);
            const overlapY = Math.min(b1.y + b1.h - b2.y, b2.y + b2.h - b1.y);
            if (overlapX < overlapY) {
              const direction = b1.x < b2.x ? -1 : 1;
              if (b1.isDragging) { b2.x -= overlapX * direction; b2.vx = b1.vx * bounce; }
              else if (b2.isDragging) { b1.x += overlapX * direction; b1.vx = b2.vx * bounce; }
              else {
                b1.x += (overlapX / 2) * direction;
                b2.x -= (overlapX / 2) * direction;
                const tempVx = b1.vx;
                b1.vx = b2.vx * bounce;
                b2.vx = tempVx * bounce;
              }
            } else {
              const direction = b1.y < b2.y ? -1 : 1;
              if (b1.isDragging) { b2.y -= overlapY * direction; b2.vy = b1.vy * bounce; }
              else if (b2.isDragging) { b1.y += overlapY * direction; b1.vy = b2.vy * bounce; }
              else {
                b1.y += (overlapY / 2) * direction;
                b2.y -= (overlapY / 2) * direction;
                const tempVy = b1.vy;
                b1.vy = b2.vy * bounce;
                b2.vy = tempVy * bounce;
              }
            }
          }
        }
      }

      // Update positions
      for (let i = 0; i < currentBodies.length; i++) {
        const b = currentBodies[i];
        b.el.style.transform = `translate(${b.x - b.leftOrigin}px, ${b.y - b.topOrigin}px)`;
      }

      requestRef.current = requestAnimationFrame(animate);
    };

    requestRef.current = requestAnimationFrame(animate);

    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
      window.removeEventListener('pointerdown', handlePointerDown);
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
    };
  }, []);

  const togglePhysics = useCallback((containerSelector: string) => {
    if (isPhysicsActive) {
      window.location.reload();
    } else {
      setIsPhysicsActive(true);
      startPhysics(containerSelector);
    }
  }, [isPhysicsActive, startPhysics]);

  return { isPhysicsActive, togglePhysics };
};
