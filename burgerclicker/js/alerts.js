/**
 * Authors: Ryan Teeninga and London Dummer
 * Purpose: Handle alerts/achievements and display them to the screen
 * Date Created: 2/15/2026
 * */

//Initialization
let gameValues;
const randMin = 0.8; //min size of alert
const randMax = 1.5; //max size of alert 
const alertObjects = [ //speed is the length it lasts
    {
        text: "wOAH 3 grills??", //text
        bgimg: "images/alerts/comic2.webp", // background graphic
        speed: 3000, //duration in ms
        shakeFactor: 10, // how much it should shake
        condition: () => gameValues["Grills"] >= 3, //condition on which the alert will be made visible
        clickAction: () => gameValues.addToScore(25), //what to do on click action
        alreadyHappened: false //used to track whether the alert has already happened. (only shows once)
    },
    {
        text: "So many workers",
        bgimg: "images/alerts/comic.webp",
        speed: 3000,
        shakeFactor: 10,
        condition: () => gameValues["Workers"] >= 2,
        clickAction: () => gameValues.addToScore(25),
        alreadyHappened: false
    },
    {
        text: "100 burgers?",
        bgimg: "images/alerts/comic2.webp",
        speed: 2000,
        shakeFactor: 10,
        condition: () => gameValues.totalScore >= 100,
        clickAction: () => gameValues.addToScore(25),
        alreadyHappened: false
    },
    {
        text: "NICE CLICKS!",
        bgimg: "images/alerts/comic.webp",
        speed: 2000,
        shakeFactor: 10,
        condition: () => gameValues.totalScore >= 9000,
        clickAction: () => gameValues.addToScore(35), //do some kind of bonus 
        alreadyHappened: false

    },
    {
        text: "CLICKIONAIRE!",
        bgimg: "images/alerts/comic.webp",
        speed: 2000,
        shakeFactor: 10,
        condition: () => gameValues.totalScore >= 3000,
        clickAction: () => gameValues.addToScore(100), //do some kind of bonus 
        alreadyHappened: false

    },
    {
        text: "EXPONENTIAL!",
        bgimg: "images/alerts/comic2.webp",
        speed: 2000,
        shakeFactor: 10,
        condition: () => gameValues.clicksPerSecond >= 3,
        clickAction: () => gameValues.addToScore(25), //do some kind of bonus 
        alreadyHappened: false
    },
    {
        text: "Heavy Hitter!",
        bgimg: "images/alerts/comic.webp",
        speed: 2000,
        shakeFactor: 10,
        condition: () => gameValues.clickMultiplier >= 3,
        clickAction: () => gameValues.addToScore(25), //do some kind of bonus 
        alreadyHappened: false
    },
    {
        text: "Slow down!!!!!",
        bgimg: "images/alerts/comic2.webp",
        speed: 2000,
        shakeFactor: 10,
        condition: () => gameValues.clickMultiplier >= 10,
        clickAction: () => gameValues.addToScore(25), //do some kind of bonus 
        alreadyHappened: false
    },
]
/**
 * Takes in game values, and saves the reference
 * @param {gameValues} values 
 */
export function initializeAlerts(values) {
    gameValues = values; 
}
/**
 * Evaluates alerts, iterates through each object, checks condition, and plays it if valid
 */
export function evaluateAlerts() {
    alertObjects.forEach((alert) => {
        // Evaluate the condition and check if it happened already
        if (alert.condition() && !alert.alreadyHappened) {
            spawnAlert(alert);
            alert.alreadyHappened = true;
        }
    });
}
/**
 * Plays a oneshot sound from a soundpath
 * @param {string} soundPath 
 */
function playSound(soundPath) {
    const boomSound = new Audio("audio/" + soundPath);
    boomSound.play().catch(error => console.error("Audio play failed:", error));
}
/**
 * Spawns the alert, called by evaluateAlerts
 * @param {object} alert 
 */
function spawnAlert(alert) {
    const wrapper = document.createElement("div");
    const randomScale = Math.random() * (randMax - randMin) + randMax;
    playSound("ding.mp3");
    const width = 200;
    const height = 200;

    //render to screen
    wrapper.style.position = "fixed";
    wrapper.style.width = `${width}px`;
    wrapper.style.height = `${height}px`;
    wrapper.style.zIndex = "9999";
    wrapper.style.display = "flex";
    wrapper.style.alignItems = "center";
    wrapper.style.justifyContent = "center";
    wrapper.style.pointerEvents = "none";

    const maxX = window.innerWidth - (width * randomScale);
    const maxY = window.innerHeight - (height * randomScale);
    wrapper.style.left = `${Math.max(0, Math.random() * maxX)}px`;
    wrapper.style.top = `${Math.max(0, Math.random() * maxY)}px`;
    wrapper.style.transform = `scale(${randomScale})`;

    const alertEl = document.createElement("div");
    alertEl.style.width = "100%";
    alertEl.style.height = "100%";
    alertEl.style.display = "flex";
    alertEl.style.alignItems = "center";
    alertEl.style.justifyContent = "center";
    alertEl.style.textAlign = "center";
    alertEl.style.cursor = "pointer";
    alertEl.style.pointerEvents = "auto";

    alertEl.style.backgroundImage = `url(${alert.bgimg})`;
    alertEl.style.backgroundSize = "contain";
    alertEl.style.backgroundRepeat = "no-repeat";
    alertEl.style.backgroundPosition = "center";

    alertEl.innerText = alert.text;
    alertEl.style.color = "white";
    alertEl.style.fontWeight = "bold";
    alertEl.style.textShadow = "2px 2px 4px rgba(0,0,0,0.5)";

    alertEl.style.animation = `shake 0.2s infinite alternate`;

    alertEl.style.transition = "transform 0.15s ease-out, opacity 0.15s ease-out";

    alertEl.addEventListener("click", () => {
        alertEl.style.pointerEvents = "none";

        playSound("boom.ogg");
        alertEl.style.transform = `scale(1.3)`;
        alertEl.style.opacity = "0";

        //Execute the click action 
        alert.clickAction();

        setTimeout(() => {
            if (wrapper.parentNode) wrapper.remove();
        }, 150);
    });

    wrapper.appendChild(alertEl);
    document.body.appendChild(wrapper);
    setTimeout(() => { if (wrapper.parentNode) wrapper.remove(); }, alert.speed); // remove the alert after time
}