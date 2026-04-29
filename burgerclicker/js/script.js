/**
 * Authors: Ryan Teeninga and London Dummer
 * Date Created: 2/11/2026
 * Purpose: To handle central game logic and the overall game loop
 */

import { initializeTrophies, renderTrophies } from "./trophies.js";
import { initializeUpgrades, changeUpgrades, updateEnabledUpgrades, } from "./upgrades.js";
import { initializeAlerts, evaluateAlerts } from "./alerts.js";
import { initializeBackgrounds, evaluateBackgrounds } from "./backgrounds.js";
window.addEventListener("load", function () {
    /*TROPHIES*/
    const trophies = [
        {
            text: "Wrapper",
            imageID: "wrapperTrophy.jpg", /*Path relative to images/trophies/_____ */
            condition: () => (gameValues.totalScore >= 1000), /*Dynamic func, this is the condition to show a trophy */
            amount: () => (Math.floor(gameValues.totalScore / 1000)), /*Allows conditional amount*/
            bundle: true /*Bundles all copies into one with an amount counter*/
        },
    ];
    /*UPGRADES */
    const upgrades = [
        {
            name: "Enlarge Grill",
            cost: 20,
            costMul: 1.5,
            benefitType: "clickMulAdd",
            value: 1,
            valueAdd: 0,
        },
        {
            name: "New Deepfrier",
            cost: 50,
            costMul: 1.5,
            benefitType: "cpsAdd",
            value: 1,
            valueAdd: 0,
        },
        {
            name: "New Grill",
            cost: 250,
            costMul: 1.5,
            benefitType: "clickMulAdd",
            value: 3,
            valueAdd: 0.1,
            forceIntValue: true,
        },
        {
            name: "Hire Worker",
            cost: 1000,
            costMul: 1.5,
            benefitType: "cpsAdd",
            value: 10,
            valueAdd: 0,
        },
    ];
    let gameValues = {
        score: 0,
        totalScore: 0,
        clicksPerSecond: 0,
        clickMultiplier: 1,
        resetDisplay: () => setDisplay(),
        evaluate: () => {
            updateEnabledUpgrades();
            evaluateAlerts();
            evaluateBackgrounds();
            renderTrophies();
        },
        addToScore: (value) => {
            Click(value);
        }
    };
    /**INITIALIZATION */
    const scoreOBJ = document.getElementById("count");
    const totalCountOBJ = document.getElementById("totalCount");
    const cpsOBJ = document.getElementById("cps");
    const clickValueOBJ = document.getElementById("clickValue");
    const burgerOBJ = document.getElementById("clickable");
    const helpButtonOBJ = document.getElementById("helpButton");
    const helpSectionOBJ = document.getElementById("helpSection")
    let helpActive = false;
    helpButtonOBJ.addEventListener("click", () => ToggleHelpButton());
    /* */
    /*CLICK FUNCTIONALITY */
    /**
     * Toggles help button 
     * @returns nothing
     */
    function ToggleHelpButton() {
        helpSectionOBJ.innerHTML = "";
        if (helpActive) {
            helpActive = false;
            return;
        }
        let paragraph = document.createElement("p");
        let header = document.createElement("h2")
        header.innerHTML = "Welcome to Burger Clicker!"
        paragraph.innerHTML = "Click the burger to gain burgers! You might find some special rewards :) "
            + "When you do something notable, you\'ll get an alert (thats your achievements). Click to get rewards. "
            + " Each of these trophies stand for something, hover to find out! "
            + "The possible trophies are: coffee, fries, grill, hashbrowns, hats, milkshakes, souls, and wrappers. "
            + "Buy upgrades with burgers, you can improve your speed. "
            + "\nGOOD LUCK";
        helpSectionOBJ.appendChild(header);
        helpSectionOBJ.appendChild(paragraph);
        helpActive = true;
    }
    function Click(amount = 1) {
        gameValues.score += amount * gameValues.clickMultiplier;
        gameValues.totalScore += amount * gameValues.clickMultiplier;
        setDisplay();
        updateEnabledUpgrades();
        evaluateAlerts();
        evaluateBackgrounds();
        renderTrophies();
    }
    burgerOBJ.addEventListener("click", () => {
        const img = document.getElementById("hand");
        img.style.animationName = false;
        void img.offsetWidth; //Reset the animation state
        img.style.animationName = "handSwing";
        img.style.animationDuration = "180ms";
        Click();
    });
    /**
     * Purpose: To refresh the display 
     */
    function setDisplay() {
        scoreOBJ.innerHTML = "Burgers Made: " + gameValues.score;
        totalCountOBJ.innerHTML = "Playthrough Total: " + gameValues.totalScore;
        cpsOBJ.innerHTML = "Clicks per second: " + Math.round(gameValues.clicksPerSecond * 10) / 10;
        clickValueOBJ.innerHTML = "Burgers per click: " + gameValues.clickMultiplier;
    }
    /**
     * Do clicks per update, handle timing
     */
    let tracker = 0;
    function Update(deltaTime) {
        tracker += deltaTime;
        if (gameValues.clicksPerSecond == 0) {
            return;
        }
        if (tracker >= 1 / gameValues.clicksPerSecond) {
            let numClicks = Math.floor(tracker / (1 / gameValues.clicksPerSecond))
            tracker -= (1 / gameValues.clicksPerSecond) * numClicks;
            Click(numClicks);
        }
    }
    const FPS = 60;
    /**
     * handle the update 
     */
    function Frame() {
        const dt = 1 / FPS;
        setTimeout(Frame, 1000 / FPS);
        Update(dt);
    }
    setTimeout(Frame, 1000 / FPS);
    initializeTrophies(gameValues);
    initializeUpgrades(gameValues);
    initializeAlerts(gameValues);
    initializeBackgrounds(gameValues);
    setDisplay();
    changeUpgrades();
    evaluateBackgrounds();
    renderTrophies();

    document.addEventListener("keypress", function (event) {
        if (event.key == "b") {
            Click(50);
        }
    });
});