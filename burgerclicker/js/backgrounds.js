/**
 * Author: Ryan Teeninga and London Dummer
 * Date Created: 2/15/2026
 * Purpose: To handle changing backgrounds after certain conditions
 */

//initialize vars
let gameValues;
let currentBackgroundIndex = -1;
let currentBGM = null;
const backgrounds = [
    {
        img: "images/art/GIF/cloudy.gif", //background image path
        music: "audio/bgMusic.mp3", //music path
        condition: () => true // similar to trophies and alerts, if the condition evaluates then it will select bg
    },
    {
        img: "images/art/GIF/dark.gif", 
        music: "audio/bgMusic2.mp3",
        condition: () => gameValues.totalScore > 150
    },
    {
        img: "images/art/GIF/bonalds2.gif",
        music: "audio/bgMusic3.mp3",
        condition: () => gameValues.totalScore > 300
    },
    {
        img: "images/art/GIF/bonaldos.gif",
        music: "audio/bgMusic4.mp3",
        condition: () => gameValues.totalScore > 600
    },
    {
        img: "images/art/GIF/dubai.gif",
        music: "audio/bgMusic5.mp3",
        condition: () => gameValues.totalScore > 1000
    },
    {
        img: "images/art/GIF/toronto.gif",
        music: "audio/bgMusic6.mp3",
        condition: () => gameValues.totalScore > 2000
    },
    {
        img: "images/art/GIF/gumby1.gif",
        music: "audio/bgMusic7.mp3",
        condition: () => gameValues.totalScore > 3000
    },
    {
        img: "images/art/GIF/aliens.gif",
        music: "audio/bgMusic8.mp3",
        condition: () => gameValues.totalScore > 5000
    },
    {
        img: "images/art/GIF/creepy.gif",
        music: "audio/bgMusic9.mp3",
        condition: () => gameValues.totalScore > 7000
    }

]

/**
 * save gamevalues reference, and set first background
 * @param {gameValues} values 
 */
export function initializeBackgrounds(values) { 
    gameValues = values;
    document.body.style.backgroundImage = `url(${backgrounds[0].img})`;
}
/**
 * Go through each background, and choose the best one. It chooses the last in the list, as that is supposed to be in a linear order based on condition
 * 
 *  */
export function evaluateBackgrounds() {
    let best = -1;
    for (let i = backgrounds.length - 1; i >= 0; i--) {
        const bg = backgrounds[i];

        // Check if the condition is met and if it's not already the active background
        if (bg.condition()) {
            best = i;
            break;
        }
    }
    if (best != -1 && currentBackgroundIndex !== best) {
        startBackgroundAnimation(best);
    }
}
/**
 * Sets the background animation at index, uses the list of backgrounds to grab the correct object
 * @param {int} index 
 */
function startBackgroundAnimation(index) {
    const bg = backgrounds[index];
    currentBackgroundIndex = index;
    const newSrc = bg.music;

    if (!currentBGM) {
        currentBGM = new Audio(newSrc);
        currentBGM.loop = true;

        // browser can block autoplay music
        currentBGM.play().catch(error => {
            console.warn("Autoplay blocked by browser.");
        });
    } else if (currentBGM.src.indexOf(newSrc) === -1) {
        currentBGM.pause();
        currentBGM.src = newSrc;
        currentBGM.load();
        currentBGM.play().catch(e => console.error("Playback error:", e));
    } else {
        // If it's the SAME song and it's currently paused (because of autoplay block)
        // Try to play it again now that a click has occurred
        if (currentBGM.paused) {
            currentBGM.play().catch(() => { });
        }
    }
    document.body.style.backgroundImage = `url(${bg.img})`;
}