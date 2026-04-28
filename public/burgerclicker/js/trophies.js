/**
 * Authors: Ryan Teeninga and London Dummer
 * Date Created: 2/15/2026
 * Purpose: Handle trophy display system
 */


//initialization
let gameValues;
let trophyArea;
const trophies = [
    {
        text: "Wrapper",
        imageID: "wrapperTrophy.jpg", /*Path relative to images/trophies/_____ */
        condition: (gameValues) => (gameValues.totalScore >= 50), /*Dynamic func, this is the condition to show a trophy */
        amount: (gameValues) => (Math.floor(gameValues.totalScore / 50)), /*Allows conditional amount*/
        altText: "50 scores!",
        bundle: true,/*Bundles all copies into one with an amount counter*/
        prevAmount: 0
    },
    {
        text: "Grills",
        imageID: "grill.png", /*Path relative to images/trophies/_____ */
        condition: (gameValues) => (gameValues["Grills"] >= 1), /*Dynamic func, this is the condition to show a trophy */
        amount: (gameValues) => (Math.floor(gameValues["Grills"] / 1)), /*Allows conditional amount*/
        altText: "Many grills",
        bundle: true, /*Bundles all copies into one with an amount counter*/
        prevAmount: 0
    },
    {
        text: "Hats",
        imageID: "hat.webp", /*Path relative to images/trophies/_____ */
        condition: (gameValues) => (gameValues["Workers"] >= 1), /*Dynamic func, this is the condition to show a trophy */
        amount: (gameValues) => (Math.floor(gameValues["Workers"] / 1)), /*Allows conditional amount*/
        altText: "Worker amount",
        bundle: true, /*Bundles all copies into one with an amount counter*/
        prevAmount: 0
    },
    {
        text: "Fries",
        imageID: "fries.webp",
        condition: (gameValues) => (gameValues["Deepfriers"] >= 1),
        amount: (gameValues) => (Math.floor(gameValues["Deepfriers"] / 1)),
        altText: "Deepfrier count",
        bundle: true,
        prevAmount: 0
    },
    {
        text: "Milkshake",
        imageID: "milkshake.webp",
        condition: (gameValues) => (gameValues.clicksPerSecond >= 3),
        amount: (gameValues) => (Math.floor(gameValues.clicksPerSecond / 3)),
        altText: "Get milkshakes by clicks per second / 3!",
        bundle: true,
        prevAmount: 0
    },
    {
        text: "Coffee",
        imageID: "coffee.webp",
        condition: (gameValues) => (gameValues["Coffeemakers"] >= 1),
        amount: (gameValues) => (Math.floor(gameValues["Coffeemakers"] / 1)),
        altText: "Coffee maker count",
        bundle: true,
        prevAmount: 0
    },
    {
        text: "Hashbrown",
        imageID: "hashbrown.webp",
        condition: (gameValues) => (gameValues["Coffeemakers"] >= 3),
        amount: (gameValues) => (Math.floor(gameValues["Coffeemakers"] / 3)),
        altText: "Get hashbrowns by coffee makers / 3!",
        bundle: true,
        prevAmount: 0
    },
    {
        text: "Ice Cream",
        imageID: "souls.png",
        condition: (gameValues) => (gameValues["Icecream"] >= 1),
        amount: (gameValues) => (Math.floor(gameValues["Icecream"] / 1)),
        altText: "The machine is finally fixed!",
        bundle: true,
        prevAmount: 0
    }
];
/**
 * Save references
 * @param {gameValues} values 
 */
export function initializeTrophies(values) {
    trophyArea = document.getElementById("trophyArea");
    gameValues = values;
}
/**
 * Builds trophy div
 * @param {trophy} trophy 
 * @returns created div
 */
function createTrophyDiv(trophy) {
    const div = document.createElement("div");
    const img = document.createElement("img");
    const txt = document.createElement("p");

    txt.innerHTML = trophy.text;
    txt.margin = "1px";
    img.src = "images/trophies/" + trophy.imageID;
    img.className = "trophy";
    img.title = trophy.altText;
    img.style.width = "64px";
    img.style.height = "64px";
    img.style.objectFit = "fill";
    img.style.margin = "3px";

    img.style.animationName = "newTrophyAnimation";
    img.style.animationDuration = "1s";

    div.appendChild(img);
    div.appendChild(txt);
    div.id = "trophy" + trophy.text;

    return div;
}
/**
 * Render trophies to its correct spot 
 */
export function renderTrophies() {
    /*Similar to cookie clicker, the idea is to use trophies to show progress */
    /*dynamic behaviour defined in the trophy objects, so its more general */
    for (const trophy of trophies) { /**For each trophy object, we must evaluate status, and show if valid */
        const trophyAmount = trophy.amount(gameValues);
        if (trophy.condition(gameValues)) {
            if (!trophy.prevAmount) {
                trophy.prevAmount = 0;
            }
            if (trophyAmount == 0) {
                continue;
            }
            if (trophy.prevAmount != trophyAmount) {
                if (!trophy.bundle) {
                    for (let x = trophy.prevAmount; x < trophyAmount; x++) {
                        /*This loop lets us have a dynamic amount of trophies, (See example 'wrapper') */
                        let div = createTrophyDiv(trophy);
                        trophyArea.appendChild(div);
                    }
                } else {
                    let trophyDiv = document.getElementById("trophy" + trophy.text);
                    if (!trophyDiv) {
                        trophyDiv = createTrophyDiv(trophy);
                        trophyArea.appendChild(trophyDiv);
                    }
                    const img = trophyDiv.firstChild;
                    const txt = trophyDiv.lastChild;

                    img.style.animationName = "none";
                    void img.offsetWidth; //Reset the animation state
                    img.style.animationName = "newTrophyAnimation";
                    img.style.animationDuration = "1s";

                    txt.innerHTML = trophy.text + " x" + trophyAmount;
                    //txt.appendChild(count);
                }
                trophy.prevAmount = trophyAmount;
            }
        }
    }
}