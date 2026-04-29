/**
 * Author: London Dummer
 * Purpose: Display a splash screen
 * Date Created: 2/8/2026
 * */


/**
 * Takes in start callback
 * Takes care of everything for splashscreen,
 * cleans itself up
 * @param {function(bool)} onStartCallback 
 */
export function playSplash(onStartCallback) {
    //vars
    const textToDisplay = "LJ Games";
    const fontStyle = "sans-serif";

    const baseColour = "#2e4057";
    const textColour = "#66a182";

    const buttonText = "Load Game";
    const buttonText2 = "New Game";

    const RESOLUTION_SCALE = 3;

    const formFrames = 90;
    const holdFrames = 60;
    const gravity = 0.15 * RESOLUTION_SCALE;
    //using inline styles
    const canvas = document.createElement('canvas');
    Object.assign(canvas.style, {
        position: 'fixed',
        top: '0',
        left: '0',
        width: '100%',
        height: '100dvh',
        zIndex: '9999',
        pointerEvents: 'none',
        imageRendering: 'pixelated'
    });
    document.body.appendChild(canvas);
    //spawn objects
    const startBtn = document.createElement('button');
    const newGameBtn = document.createElement('button');
    startBtn.innerText = buttonText;
    newGameBtn.innerText = buttonText2;
    startBtn.classList.add('game-btn', 'start-btn');
    newGameBtn.classList.add('game-btn', 'new-game-btn');
    newGameBtn.style.display='none';
    startBtn.style.display='none';
    startBtn.onclick = () => {
        startBtn.remove();
        newGameBtn.remove();
        if (typeof onStartCallback === 'function') {
            onStartCallback(false);
        }
    };
    newGameBtn.onclick = () => {
        newGameBtn.remove();
        startBtn.remove();
        if (typeof onStartCallback === 'function') {
            onStartCallback(true);
        }
    };
    document.body.appendChild(startBtn);
    document.body.appendChild(newGameBtn);
    const ctx = canvas.getContext('2d', { alpha: false });

    let width, height;
    //we want to scale it to cover the whole screen
    const resizeHandler = () => {
        width = canvas.width = Math.floor(window.innerWidth * RESOLUTION_SCALE);
        height = canvas.height = Math.floor(window.innerHeight * RESOLUTION_SCALE);
    };
    resizeHandler();
    window.addEventListener('resize', resizeHandler);
    //originally it was a random grid that formed the letters
    //now forming is a remainder word
    let state = 'forming';
    let frameCount = 0;
    let animationFrameId;

    let yOffset = 0;
    let velocity = 0;
    //animate
    function animate() {
        frameCount++;

        ctx.fillStyle = baseColour;
        ctx.fillRect(0, 0, width, height);
        let scaleX = 1;
        let scaleY = 1;
        //place in the center
        let currentY = height / 2;
        if (state === 'forming') {
            if (frameCount > formFrames) {
                state = 'holding';
                frameCount = 0;
            } else {
                //bounce according to t and functions
                let t = frameCount / formFrames;
                let grow = Math.min(1, t * 5);
                let squash = 0.4 * Math.sin(t * Math.PI * 5) * (1 - t);
                scaleX = grow * (1 + squash);
                scaleY = grow * (1 - squash);
            }
            //wait until later
        } else if (state === 'holding') {
            if (frameCount > holdFrames) {
                state = 'melting';
                frameCount = 0;
            }
            //melting is also an old term, but its close enough
        } else if (state === 'melting') {
            velocity += gravity;
            yOffset += velocity;
            currentY += yOffset;
            //shrink it off the screen
            scaleY = 1 + velocity * 0.03;
            scaleX = 1 / scaleY;
            const fontSize = Math.min(width / 8, 120 * RESOLUTION_SCALE);
            if (currentY - fontSize > height) {
                cancelAnimationFrame(animationFrameId);
                window.removeEventListener('resize', resizeHandler);
                canvas.remove();

                startBtn.style.display = 'block';
                startBtn.style.transform = 'translate(-50%, -110%) scale(1)';
                newGameBtn.style.display = 'block';
                newGameBtn.style.transform = 'translate(-50%, 10%) scale(1)';
                return;
            }
        }
        ctx.save();
        ctx.translate(width / 2, currentY);
        ctx.scale(scaleX, scaleY);
        ctx.fillStyle = textColour;
        const fontSize = Math.min(width / 8, 120 * RESOLUTION_SCALE);
        ctx.font = `bold ${fontSize}px ${fontStyle}`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        ctx.fillText(textToDisplay, 0, 0);
        ctx.restore();
        animationFrameId = requestAnimationFrame(animate);
    }

    animate();
}   