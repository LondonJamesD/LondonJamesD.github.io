/**
 * Name: Ryan Teeninga and London Dummer
 * Date Created: 2/15/26
 *  Contains logic and objects for the upgrades system
 */
/*Initializing */
let gameValues;
let upgradeArea;
/*An object containing all upgrade data */
const upgrades = [
    {
        name: "Enlarge Grill",
        cost: 20, /*The cost of burgers */
        costMul: 1.5, /*How much it increases in cost each time */
        benefitType: "clickMulAdd",
        value: 1,  /*amount added */
        valueAdd: 0, /*This adds to the value provided of the upgrade, for each upgrade */
        keyAdd: "LargeGrill", /*Adds to gamevalues object, used for trophies */
        keyAmountPerUpgrade: 1 /*How many to add per upgrade */
    },
    {
        name: "New Deepfrier",
        cost: 50,
        costMul: 1.5,
        benefitType: "cpsAdd",
        value: 1,
        valueAdd: 0,
        keyAdd: "Deepfriers",
        keyAmountPerUpgrade: 1
    },
    {
        name: "New Coffee Maker",
        cost: 150,
        costMul: 1.5,
        benefitType: "cpsAdd",
        value: 2,
        valueAdd: 0,
        keyAdd: "Coffeemakers",
        keyAmountPerUpgrade: 1
    },
    {
        name: "New Grill",
        cost: 250,
        costMul: 1.5,
        benefitType: "clickMulAdd",
        value: 3,
        valueAdd: 0.1,
        forceIntValue: true,
        keyAdd: "Grills",
        keyAmountPerUpgrade: 1
    },
    {
        name: "Hire Worker",
        cost: 1000,
        costMul: 1.5,
        benefitType: "cpsAdd",
        value: 10,
        valueAdd: 0,
        keyAdd: "Workers",
        keyAmountPerUpgrade: 1
    },
    {
        name: "Fix Ice Cream Machine",
        cost: 100000,
        costMul: 999,
        benefitType: "cpsAdd",
        value: 99,
        valueAdd: 0,
        keyAdd: "Icecream",
        keyAmountPerUpgrade: 1
    },
];
/**
 * Creates upgrade keys in gameValues object
 * 
 * @param {gameValues} values 
 * @returns nothing
 */
export function initializeUpgrades(values) {
    upgradeArea = document.getElementById("upgradeArea");
    gameValues = values;
    for (const upgrade of upgrades) {
        if (upgrade.keyAdd == null) continue;
        if (gameValues[upgrade.keyAdd] == null) {
            gameValues[upgrade.keyAdd] = 0;
        }
    }
}
/**
 * Uses reference to gameValues object to rebuild upgrades when things change
 * @param none
 * @returns nothing 
 */
export function changeUpgrades() {
    upgradeArea.innerHTML = "";
    const title = document.createElement("h2");
    title.innerHTML = "Upgrades";
    for (let i = 0; i < upgrades.length; i++) {
        const upgrade = upgrades[i];
        let effectStr = "Unknown";
        switch (upgrade.benefitType) { /*Based on type, show different strings */
            case "cpsAdd":
                effectStr = "+" + (Math.round(upgrade.value * 10) / 10) + " CPS";
                break;

            case "clickMulAdd":
                effectStr = "+" + upgrade.value + " Burgers/click";
                break;

            default:
                break;
        }


        /*RENDER TO DOM */
        /*This was changed to make it more modular, and fit styling, functionality is the same*/
        const div = document.createElement("div");
        div.className = "upgrade";
        const h3 = document.createElement("h3");
        h3.textContent = upgrade.name;
        const costP = document.createElement("p");
        costP.textContent = "Cost: " + upgrade.cost;
        const effectP = document.createElement("p");
        effectP.textContent = "Effect: " + effectStr;
        const input = document.createElement("input");
        input.className = "buyButton";
        input.id = "upgrade#" + i;
        input.type = "button";
        input.value = "Buy Now";
        /*Hide element if not enough score*/
        if (!(gameValues.score >= upgrade.cost)) {
            input.disabled = true;
        }
        div.appendChild(h3);
        div.appendChild(costP);
        div.appendChild(effectP);
        div.appendChild(input);

        upgradeArea.appendChild(div);
        /*Adds event listeners to each upgrade to click */
        document
            .getElementById("upgrade#" + i)
            .addEventListener("click", () => {
                doUpgrade(upgrade);
                changeUpgrades();
            });
    }
}
/* Update whether an upgrade is enabled or not*/
/**
 * Just toggles it essentially, no return
 */
export function updateEnabledUpgrades() {
    for (let i = 0; i < upgrades.length; i++) {
        const upgrade = upgrades[i];
        const upgradeHTML = document.getElementById("upgrade#" + i);
        if (gameValues.score >= upgrade.cost) {
            upgradeHTML.disabled = false;
        } else {
            upgradeHTML.disabled = true;
        }
    }
}
/**
 * Basically performs an upgrade based on the upgrade's stats.
 * @param {object} upgrade 
 * @returns nothing
 */
export function doUpgrade(upgrade) {
    console.log("test");
    switch (upgrade.benefitType) {
        case "cpsAdd":
            gameValues.clicksPerSecond += upgrade.value;
            break;

        case "clickMulAdd":
            gameValues.clickMultiplier += upgrade.value;
            break;

        default:
            break;
    }
    if (upgrade.keyAdd != null) {
        if (gameValues[upgrade.keyAdd] == null) {
            gameValues[upgrade.keyAdd] = 0;
        }
        gameValues[upgrade.keyAdd] += upgrade.keyAmountPerUpgrade;
    }
    if (!upgrade.fracCost) {
        upgrade.fracCost = upgrade.cost;
    }

    if (!upgrade.fracValue) {
        upgrade.fracValue = upgrade.value;
    }

    gameValues.score -= upgrade.cost;
    upgrade.fracCost = upgrade.fracCost * upgrade.costMul;
    upgrade.cost = Math.floor(upgrade.fracCost);
    upgrade.fracValue = upgrade.fracValue + upgrade.valueAdd;
    if (upgrade.forceIntValue) {
        upgrade.value = Math.floor(upgrade.fracValue);
    } else {
        upgrade.value = upgrade.fracValue;
    }

    gameValues.resetDisplay();
    gameValues.evaluate();
    changeUpgrades();
}