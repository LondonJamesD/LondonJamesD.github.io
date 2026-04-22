const BACKGROUND = "rgba(15, 18, 22, 0.4)";
const game = document.getElementById("game");
const ctx = game.getContext("2d");

game.style.position = 'absolute';
game.style.left = '-10vw';
game.style.top = '-10vh';
game.style.width = '120vw';
game.style.height = '120vh';

function resizeCanvas() {
    game.width = window.innerWidth * 1.2;
    game.height = window.innerHeight * 1.2;
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

let targetMx = 0, targetMy = 0;
let mx = 0, my = 0;

window.addEventListener('mousemove', (e) => {
    targetMx = (e.clientX / window.innerWidth) * 2 - 1;
    targetMy = (e.clientY / window.innerHeight) * 2 - 1;
});

// Pre-allocate typed arrays to eliminate garbage collection pauses
const MAX_VERTS = 20; 
const projX = new Float32Array(MAX_VERTS);
const projY = new Float32Array(MAX_VERTS);
const projZ = new Float32Array(MAX_VERTS);

const ZOOM = 1.3;

const cubeVs = [{x:0.3,y:0.3,z:0.3},{x:-0.3,y:0.3,z:0.3},{x:-0.3,y:-0.3,z:0.3},{x:0.3,y:-0.3,z:0.3},{x:0.3,y:0.3,z:-0.3},{x:-0.3,y:0.3,z:-0.3},{x:-0.3,y:-0.3,z:-0.3},{x:0.3,y:-0.3,z:-0.3}];
const cubeFs = [[0,1,2,3],[4,5,6,7],[0,4],[1,5],[2,6],[3,7]];

const pyramidVs = [{x:0,y:0.4,z:0},{x:-0.3,y:-0.3,z:0.3},{x:0.3,y:-0.3,z:0.3},{x:0.3,y:-0.3,z:-0.3},{x:-0.3,y:-0.3,z:-0.3}];
const pyramidFs = [[0,1,2],[0,2,3],[0,3,4],[0,4,1],[1,2,3,4]]; 

const octaVs = [{x:0.4,y:0,z:0},{x:-0.4,y:0,z:0},{x:0,y:0.4,z:0},{x:0,y:-0.4,z:0},{x:0,y:0,z:0.4},{x:0,y:0,z:-0.4}];
const octaFs = [[0,2,4],[0,4,3],[0,3,5],[0,5,2],[1,2,4],[1,4,3],[1,3,5],[1,5,2]];

const tetVs = [{x:0.3,y:0.3,z:0.3},{x:0.3,y:-0.3,z:-0.3},{x:-0.3,y:0.3,z:-0.3},{x:-0.3,y:-0.3,z:0.3}];
const tetFs = [[0,1,2],[0,1,3],[0,2,3],[1,2,3]];

const triPVs = [{x:0,y:0.3,z:0.3},{x:-0.3,y:-0.3,z:0.3},{x:0.3,y:-0.3,z:0.3},{x:0,y:0.3,z:-0.3},{x:-0.3,y:-0.3,z:-0.3},{x:0.3,y:-0.3,z:-0.3}];
const triPFs = [[0,1,2],[3,4,5],[0,1,4,3],[1,2,5,4],[2,0,3,5]];

const diaVs = [{x:0,y:0.4,z:0},{x:0,y:-0.4,z:0},{x:0.3,y:0,z:0.3},{x:-0.3,y:0,z:0.3},{x:-0.3,y:0,z:-0.3},{x:0.3,y:0,z:-0.3}];
const diaFs = [[0,2,3],[0,3,4],[0,4,5],[0,5,2],[1,2,3],[1,3,4],[1,4,5],[1,5,2]];

const hexVs = [{x:0.3,y:0,z:0.3},{x:0.15,y:0.26,z:0.3},{x:-0.15,y:0.26,z:0.3},{x:-0.3,y:0,z:0.3},{x:-0.15,y:-0.26,z:0.3},{x:0.15,y:-0.26,z:0.3},{x:0.3,y:0,z:-0.3},{x:0.15,y:0.26,z:-0.3},{x:-0.15,y:0.26,z:-0.3},{x:-0.3,y:0,z:-0.3},{x:-0.15,y:-0.26,z:-0.3},{x:0.15,y:-0.26,z:-0.3}];
const hexFs = [[0,1,2,3,4,5],[6,7,8,9,10,11],[0,1,7,6],[1,2,8,7],[2,3,9,8],[3,4,10,9],[4,5,11,10],[5,0,6,11]];

const pentVs = [{x:0,y:0.4,z:0},{x:0,y:-0.2,z:0.3},{x:0.28,y:-0.2,z:0.09},{x:0.18,y:-0.2,z:-0.24},{x:-0.18,y:-0.2,z:-0.24},{x:-0.28,y:-0.2,z:0.09}];
const pentFs = [[0,1,2],[0,2,3],[0,3,4],[0,4,5],[0,5,1],[1,2,3,4,5]];

const starVs = [{x:0.3,y:0.3,z:0.3},{x:0.3,y:-0.3,z:-0.3},{x:-0.3,y:0.3,z:-0.3},{x:-0.3,y:-0.3,z:0.3},{x:-0.3,y:-0.3,z:-0.3},{x:-0.3,y:0.3,z:0.3},{x:0.3,y:-0.3,z:0.3},{x:0.3,y:0.3,z:-0.3}];
const starFs = [[0,1,2],[0,1,3],[0,2,3],[1,2,3],[4,5,6],[4,5,7],[4,6,7],[5,6,7]];

function drawShape(vs, fs, rotX, rotY, rotZ, movX, movY, movZ, hue) {
    const cx = Math.cos(rotX), sx = Math.sin(rotX);
    const cy = Math.cos(rotY), sy = Math.sin(rotY);
    const cz = Math.cos(rotZ), sz = Math.sin(rotZ);
    
    const hw = game.width / 2;
    const hh = game.height / 2;

    let avgZ = 0;
    
    for (let i = 0; i < vs.length; i++) {
        const v = vs[i];
        
        const y1 = v.y * cx - v.z * sx;
        const z1 = v.y * sx + v.z * cx;
        const x1 = v.x * cy + z1 * sy;
        const z2 = -v.x * sy + z1 * cy;
        const x2 = x1 * cz - y1 * sz;
        const y2 = x1 * sz + y1 * cz;

        const finalZ = z2 + movZ;
        projZ[i] = finalZ;
        avgZ += finalZ;

        const adjustedZ = Math.max(0.01, finalZ);
        const px = (x2 + movX) / adjustedZ;
        const py = (y2 + movY) / adjustedZ;

        // Bitwise OR to force integer coordinates
        projX[i] = (((px * ZOOM) + 1) * hw) | 0;
        projY[i] = ((1 - ((py * ZOOM) + 1) / 2) * game.height) | 0;
    }

    avgZ /= vs.length;
    if (avgZ <= 0) return; 

    ctx.strokeStyle = `hsl(${hue}, 80%, 60%)`;
    ctx.fillStyle = `hsla(${hue}, 80%, 60%, 0.15)`;
    ctx.lineWidth = 2.5 / Math.max(0.1, avgZ);

    ctx.beginPath();
    for (let i = 0; i < fs.length; i++) {
        const f = fs[i];
        
        let visible = true;
        // Dynamic check handles both 2-point lines and polygons without out-of-bounds indexing
        for (let j = 0; j < f.length; j++) {
            if (projZ[f[j]] <= 0) {
                visible = false;
                break;
            }
        }
        if (!visible) continue;

        ctx.moveTo(projX[f[0]], projY[f[0]]);
        for (let j = 1; j < f.length; j++) {
            ctx.lineTo(projX[f[j]], projY[f[j]]);
        }
        ctx.closePath();
    }
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = `hsl(${hue}, 90%, 75%)`;
    for (let i = 0; i < vs.length; i++) {
        if (projZ[i] > 0) {
            // Integer sizing and bitshift division
            const s = (15 / projZ[i]) | 0;
            const halfS = s >> 1; 
            ctx.fillRect(projX[i] - halfS, projY[i] - halfS, s, s);
        }
    }
}

let time = 0;

function frame(timestamp) {
    time = timestamp * 0.001;

    mx += (targetMx - mx) * 0.1;
    my += (targetMy - my) * 0.1;

    ctx.globalCompositeOperation = "source-over";
    ctx.fillStyle = BACKGROUND;
    ctx.fillRect(0, 0, game.width, game.height);

    ctx.globalCompositeOperation = "screen";

    const pulse = Math.abs(Math.sin(time * 4)) * 0.2 + Math.abs(Math.sin(time * 1.5)) * 0.3;
    const globalZ = 2.5 - pulse;
    const baseHue = (time * 50) % 360;

    drawShape(cubeVs, cubeFs, my * 2 + time * 0.5, mx * 2 + time * 0.8, time * 0.3, 0, 0, globalZ, baseHue);
    drawShape(pyramidVs, pyramidFs, time * 2, time * -1.5, 0, Math.cos(time * 2) * (0.8 + pulse * 0.5), Math.sin(time * 2.5) * (0.8 + pulse * 0.5), globalZ + 0.5, baseHue + 40);
    drawShape(octaVs, octaFs, time * -1.2, time * 0.9, time * -0.5, Math.sin(time * 1.8) * 1.2, 0, globalZ + 1.2 + Math.cos(time * 1.8) * 0.5, baseHue + 80);
    drawShape(tetVs, tetFs, time * 1.5, time * 1.5, time * 0.5, Math.cos(time * 1.5) * 1.5, Math.sin(time * 1.5) * 1.5, globalZ - 0.2, baseHue + 120);
    drawShape(triPVs, triPFs, time * -2, time * 1.1, time * -0.8, Math.sin(time * 1.2) * 1.8, Math.cos(time * 1.6) * 1.8, globalZ + 0.3, baseHue + 160);
    drawShape(diaVs, diaFs, time * 0.8, time * -2.2, time * 1.2, Math.cos(time * 1.1) * 2.0, Math.sin(time * 0.9) * 2.0, globalZ + 0.8, baseHue + 200);
    drawShape(hexVs, hexFs, time * 2.5, time * 0.5, time * -1.5, Math.sin(time * 1.4) * 2.2, Math.cos(time * 1.4) * 2.2, globalZ - 0.5, baseHue + 240);
    drawShape(pentVs, pentFs, time * -1.5, time * -1.5, time * 2, Math.cos(time * 0.8) * 2.5, Math.sin(time * 1.1) * 2.5, globalZ + 0.1, baseHue + 280);
    drawShape(starVs, starFs, time * 1.1, time * 1.9, time * -0.9, Math.sin(time * 1.7) * 2.8, Math.cos(time * 1.3) * 2.8, globalZ + 0.6, baseHue + 320);

    requestAnimationFrame(frame);
}

requestAnimationFrame(frame);