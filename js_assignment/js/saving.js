/**
 * Author: London Dummer
 * Purpose: Handle saving and loading game state
 * Date Created: 2/11/2026
 * */

import { RenderInventory, RenderProgress, startTime} from "./script.js";

//object representing the global game state.
//mega object for the game
//this is acceptable because the scope is relatively controlled
export let globalGameState = {
    lastCutscene: "intro.json",
    currentLevel: "kitchenLevel.json",
    objects: {},
    flags: {},
    consumedItems: [],
    inventory: [],
    progress: 0,
    selectedItem: null,
    timeThisRun: 0,
    gameStart:Date.now(),
    bestTime:999999 //default the best time to something unlikely
};
/**
 * adds item to inventory, saves state, and renders
 * @param {objectData} item 
 */
export function AddToInventory(item) {
    globalGameState.inventory.push(item);
    saveGameState();
    RenderInventory();
}
/**
 * Opposite, but just takes the id rather than entire data, saves state, and renders
 * @param {string} itemID 
 */
export function RemoveFromInventory(itemID) {
    globalGameState.inventory = globalGameState.inventory.filter(x => x.id !== itemID);
    if (!globalGameState.consumedItems) globalGameState.consumedItems = [];
    globalGameState.consumedItems.push(itemID);
    saveGameState();
    RenderInventory();
}
/**
 * Load the game state from localstorage
 * 
 */
export function loadGameState() {
    const savedData = localStorage.getItem("myGameSave");
    //merge instead of overwrite
    if (savedData) {
        const parsedData = JSON.parse(savedData);
         Object.assign(globalGameState, parsedData); 
    }
    //render
    RenderInventory();
    RenderProgress();
}
/**
 * Save the game state to localstorage
 * 
 */
export function saveGameState() {
    globalGameState.timeThisRun = Date.now() - globalGameState.gameStart;

    localStorage.setItem("myGameSave", JSON.stringify(globalGameState));
}
/**
 * Reset the game to the start
 * 
 */
export function clearGameState() {
    //we gotta keep best time though
    let prevBestTime = globalGameState.bestTime;
    localStorage.removeItem("myGameSave");
    globalGameState = {
        lastCutscene: "intro.json",
        currentLevel: "kitchenLevel.json",
        objects: {},
        flags: {},
        consumedItems: [],
        inventory: [],
        progress: 0,
        selectedItem: null,
        timeThisRun:0,
        bestTime: prevBestTime,
        gameStart:Date.now()
    };
    RenderInventory();
    RenderProgress();
}