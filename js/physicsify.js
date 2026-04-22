document.addEventListener('DOMContentLoaded', () => {
    const btn = document.getElementById('physicsify-btn');
    if (!btn) return;

    let isPhysicsActive = false;

    btn.addEventListener('click', () => {
        if (isPhysicsActive) {
            window.location.reload();
            return;
        }

        isPhysicsActive = true;
        btn.innerText = 'Reset';
        btn.style.opacity = '1';
        
        startPhysics();
    });
});

function startPhysics() {
    const cards = Array.from(document.querySelectorAll('.square-card'));
    const footer = document.querySelector('footer');
    const bodies = [];

    cards.forEach(card => {
        const rect = card.getBoundingClientRect();
        bodies.push({
            el: card,
            x: rect.left,
            y: rect.top,
            w: rect.width,
            h: rect.height,
            vx: (Math.random() - 0.5) * 10,
            vy: (Math.random() - 0.5) * 5,
            isDragging: false
        });
    });

    bodies.forEach(body => {
        const placeholder = document.createElement('div');
        placeholder.className = body.el.className;
        placeholder.style.width = body.w + 'px';
        placeholder.style.height = body.h + 'px';
        placeholder.style.visibility = 'hidden';
        placeholder.style.pointerEvents = 'none';
        body.el.parentNode.insertBefore(placeholder, body.el);

        body.el.style.position = 'fixed';
        body.el.style.left = body.x + 'px';
        body.el.style.top = body.y + 'px';
        body.el.style.width = body.w + 'px';
        body.el.style.height = body.h + 'px';
        body.el.style.margin = '0';
        body.el.style.zIndex = '1000';
        body.el.style.transition = 'none';
        
        const iframe = body.el.querySelector('iframe');
        if (iframe) {
            iframe.style.pointerEvents = 'none';
        }
    });

    let draggedBody = null;
    let lastMouseX = 0;
    let lastMouseY = 0;

    bodies.forEach(body => {
        body.el.style.cursor = 'grab';
        body.el.addEventListener('pointerdown', (e) => {
            draggedBody = body;
            body.isDragging = true;
            body.el.style.cursor = 'grabbing';
            body.el.style.zIndex = '1001';
            
            lastMouseX = e.clientX;
            lastMouseY = e.clientY;
            
            body.vx = 0;
            body.vy = 0;
            
            e.preventDefault();
        });
    });

    window.addEventListener('pointermove', (e) => {
        if (!draggedBody) return;

        const dx = e.clientX - lastMouseX;
        const dy = e.clientY - lastMouseY;

        draggedBody.x += dx;
        draggedBody.y += dy;

        draggedBody.vx = dx * 0.5;
        draggedBody.vy = dy * 0.5;

        lastMouseX = e.clientX;
        lastMouseY = e.clientY;
    });

    window.addEventListener('pointerup', () => {
        if (draggedBody) {
            draggedBody.isDragging = false;
            draggedBody.el.style.cursor = 'grab';
            draggedBody.el.style.zIndex = '1000';
            draggedBody = null;
        }
    });

    const gravity = 0.6;
    const bounce = 0.75;
    const friction = 0.99;

    function physicsLoop() {
        const ww = window.innerWidth;
        const footerTop = footer ? footer.getBoundingClientRect().top : window.innerHeight;

        for (let i = 0; i < bodies.length; i++) {
            let b = bodies[i];
            
            if (!b.isDragging) {
                b.vy += gravity;
                b.vx *= friction;
                b.vy *= friction;

                b.x += b.vx;
                b.y += b.vy;
            }

            if (b.x < 0) { b.x = 0; b.vx *= -bounce; }
            if (b.x + b.w > ww) { b.x = ww - b.w; b.vx *= -bounce; }
            if (b.y < 0) { b.y = 0; b.vy *= -bounce; }
            
            if (b.y + b.h > footerTop) { 
                b.y = footerTop - b.h; 
                b.vy *= -bounce; 
                
                if (Math.abs(b.vy) < 1.5) b.vy = 0;
                b.vx *= 0.9;
            }
        }

        for (let i = 0; i < bodies.length; i++) {
            for (let j = i + 1; j < bodies.length; j++) {
                let b1 = bodies[i];
                let b2 = bodies[j];

                if (b1.x < b2.x + b2.w && b1.x + b1.w > b2.x &&
                    b1.y < b2.y + b2.h && b1.y + b1.h > b2.y) {

                    let overlapX = Math.min(b1.x + b1.w - b2.x, b2.x + b2.w - b1.x);
                    let overlapY = Math.min(b1.y + b1.h - b2.y, b2.y + b2.h - b1.y);

                    if (overlapX < overlapY) {
                        let direction = b1.x < b2.x ? -1 : 1;
                        
                        if (b1.isDragging) {
                            b2.x -= overlapX * direction;
                            b2.vx = b1.vx * bounce;
                        } else if (b2.isDragging) {
                            b1.x += overlapX * direction;
                            b1.vx = b2.vx * bounce;
                        } else {
                            b1.x += (overlapX / 2) * direction;
                            b2.x -= (overlapX / 2) * direction;
                            let tempVx = b1.vx;
                            b1.vx = b2.vx * bounce;
                            b2.vx = tempVx * bounce;
                        }
                    } else {
                        let direction = b1.y < b2.y ? -1 : 1;
                        
                        if (b1.isDragging) {
                            b2.y -= overlapY * direction;
                            b2.vy = b1.vy * bounce;
                        } else if (b2.isDragging) {
                            b1.y += overlapY * direction;
                            b1.vy = b2.vy * bounce;
                        } else {
                            b1.y += (overlapY / 2) * direction;
                            b2.y -= (overlapY / 2) * direction;
                            let tempVy = b1.vy;
                            b1.vy = b2.vy * bounce;
                            b2.vy = tempVy * bounce;
                        }
                    }
                }
            }
        }

        for (let i = 0; i < bodies.length; i++) {
            let b = bodies[i];
            b.el.style.transform = `translate(${b.x - parseFloat(b.el.style.left)}px, ${b.y - parseFloat(b.el.style.top)}px)`;
        }

        requestAnimationFrame(physicsLoop);
    }

    requestAnimationFrame(physicsLoop);
}