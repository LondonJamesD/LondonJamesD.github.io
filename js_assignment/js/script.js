/**
 * Author: London Dummer
 * Purpose: Handle the main game loop
 * Date Created: 2/8/2026
 * */

import { playSplash } from "./splashscreen.js";
import { playCutscene } from "./actions.js";
import { clearGameState, globalGameState, loadGameState } from "./saving.js";
let progressMax;
let view;
let invBox;
let progressBar;
export const startTime = Date.now();
window.addEventListener("load", () => {

    view = document.getElementById("viewport");
    invBox = document.getElementById("inventory");
    progressMax = 4;
    progressBar = document.getElementById("progress");

    playSplash((bool) => StartGame(bool));
});
/**
 * Starts the game, if cleanStart is true, we want to delete old data 
 * @param {bool} cleanStart 
 */
export function StartGame(cleanStart) {
    if (cleanStart === true) {
        clearGameState();
    }
    loadGameState();
    playCutscene(globalGameState.lastCutscene, globalGameState.currentLevel, view);
}
/**
 * Render all inventory items
 */
export function RenderInventory() {
    invBox.innerHTML = "";
    //clear
    //iterate, show object
    for (let x = 0; x < globalGameState.inventory.length; x++) {
        const item = globalGameState.inventory[x];

        const imgEl = document.createElement("img");
        imgEl.src = "./art/objects/" + item.inventoryImage;
        imgEl.alt = item.id;
        imgEl.classList.add("inventory-icon");
        imgEl.id = "inv-item-" + item.id;
        imgEl.draggable = true;

        if (globalGameState.selectedItem === item.id) {
            imgEl.style.border = "2px solid yellow";  
            imgEl.style.transform = "scale(1.1)";
        }
        //originally used drag and drop, found out it didnt work on mobile
        imgEl.addEventListener('dragstart', (e) => {
            e.dataTransfer.setData('text/plain', item.id);
            setTimeout(() => imgEl.style.opacity = '0.5', 0);
        });
        imgEl.addEventListener('dragend', (e) => {
            imgEl.style.opacity = '1';
        });
        //mobile fix here
        imgEl.addEventListener('click', () => {
            if (globalGameState.selectedItem === item.id) {
                globalGameState.selectedItem = null;
            } else {
                globalGameState.selectedItem = item.id;
            }
            //this is recursive, but unlikely to be stuck
            RenderInventory();
        });

        invBox.appendChild(imgEl);  
    }
    //create help btn
    //its nicer as an inventory item, saves me the work
    //otherwise Id have to redo my html and css structure

    const helpBtn = document.createElement("img");

        helpBtn.src = "./art/objects/help.png";
        helpBtn.alt = "help";
        helpBtn.classList.add("inventory-icon");  

        helpBtn.draggable = false;

        helpBtn.style.marginLeft = "auto";
        helpBtn.style.cursor = "pointer";

        helpBtn.addEventListener('click', () => {
            playCutscene("help.json", globalGameState.currentLevel, view);
        });
        invBox.appendChild(helpBtn);
}
/**
 * Render progress bar
 */
export function RenderProgress() {
    let progress = globalGameState.progress || 0;
    let val = Math.floor((progress / progressMax) * 100);
    progressBar.value = val;
}
