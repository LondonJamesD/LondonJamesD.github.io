/**
 * Author: London Dummer
 * Purpose: Handle object spawning, level loading
 * Date Created: 2/8/2026
 * */

import { globalGameState, loadGameState, saveGameState, RemoveFromInventory } from "./saving.js";
import { DoAction } from "./actions.js";
import { stopAllSound, playSound } from "./audio.js";
import { RenderInventory } from "./script.js";
/**
 * This function is used to make sure
 * that objects are the same as they were left
 * for example leaving a room and coming back
 * @param {object} baseData
 * @param {object} savedState 
 */
function mergeRuntimeState(baseData, savedState) {
    let mergedData = JSON.parse(JSON.stringify(baseData));
    if (!savedState) return mergedData;

    function applyOverrides(target, source) {
        for (const key in source) {
            if (source.hasOwnProperty(key)) { //override properties
                if (typeof source[key] === 'object' && source[key] !== null && !Array.isArray(source[key])) {
                    target[key] = target[key] || {};
                    applyOverrides(target[key], source[key]);
                } else {
                    target[key] = source[key];
                }
            }
        }
    }

    applyOverrides(mergedData, savedState);
    return mergedData;
}
/**
 * Loads level and all its objects
 * Each object recursively loads its child objects
 * @param {string} level 
 * @param {div} viewport 
 */
export async function loadLevel(level, viewport) {
    stopAllSound();

    viewport.classList.add('fading');

    try { 
        //load the level from file
        const fetchPromise = fetch("./js/levels/" + level)
            .then(response => response.text())
            .then(text => JSON.parse(text));
        //fade in and out
        const fadePromise = new Promise(resolve => setTimeout(resolve, 300));
        const [levelData] = await Promise.all([fetchPromise, fadePromise]);
        //clear view
        viewport.innerHTML = "";
        //set background
        if (levelData.backdrop) {
            viewport.style.backgroundImage = `url('${levelData.backdrop}')`;
            viewport.style.backgroundSize = '100% 100%';
            viewport.style.backgroundRepeat = 'no-repeat';
            viewport.style.backgroundPosition = 'center';
            viewport.style.position = 'relative';
        }

        if (levelData.music) {
            playSound(levelData.music, levelData.loop);
        }
        //for each object recursively load children
        if (levelData.objects) {
            levelData.objects.forEach(obj => {
                const objectId = obj.id || obj.file.split('.')[0];
                if (globalGameState.consumedItems && globalGameState.consumedItems.includes(objectId)) {
                    return;
                }
                loadObject(obj, viewport, viewport, obj.overrideAction);
            });
        }
        //remove the fade animation
        viewport.classList.remove('fading');
        //set the state of current level
        globalGameState.currentLevel = level;
    } catch (error) {
        console.error("level didnt work:", error);
        viewport.classList.remove('fading');
    }
    //render inventory
    RenderInventory();
}
/**
 * Grab the prefab file, load it and perform calback on data
 * @param {string} file 
 * @param {function} callback 
 */
function fetchPrefab(file, callback) {
    fetch("./js/prefabs/" + file)
        .then(response => response.text())
        .then(text => {
            const data = JSON.parse(text);
            callback(data);
        })
        .catch(error => console.error("prefab missing:", error));
}
/**
 * Creates the dom object for the prefab.
 * Ensures size, placement is relative to parent, which is relative to viewport
 * @param {object} instanceData 
 * @param {div} parentElement
 * @param {div} viewport 
 */
function createObjectDOM(instanceData, parentElement, viewport) {
    const objDiv = document.createElement('div');
    objDiv.classList.add('gameObject');
    objDiv.style.position = 'absolute';

    const ratioX = viewport.clientWidth / parentElement.clientWidth;
    const ratioY = viewport.clientHeight / parentElement.clientHeight;
    objDiv.style.left = `calc(50% + ${instanceData.x * ratioX}%)`;
    objDiv.style.top = `calc(50% + ${instanceData.y * ratioY}%)`;

    objDiv.style.translate = '-50% -50%';
    objDiv.style.width = `${instanceData.scale}%`;
    objDiv.style.cursor = 'pointer';
    objDiv.style.zIndex = instanceData.z || 1;
    const imgEl = document.createElement('img');
    imgEl.style.width = '100%';
    imgEl.style.height = '100%';
    imgEl.style.objectFit = 'contain';
    imgEl.style.pointerEvents = 'none';

    const childrenContainer = document.createElement('div');
    childrenContainer.style.position = 'absolute';
    childrenContainer.style.left = '0';
    childrenContainer.style.top = '0';
    childrenContainer.style.width = '100%';
    childrenContainer.style.height = '100%';

    objDiv.appendChild(imgEl);
    objDiv.appendChild(childrenContainer);
    parentElement.appendChild(objDiv);

    return { objDiv, imgEl, childrenContainer };
}

function processItemInteraction(itemId, objectData, objDiv, runtimeState) {
    if (objectData.itemInteractions && objectData.itemInteractions[itemId]) {
        const interaction = objectData.itemInteractions[itemId];
        if(!DoAction(interaction.action, objectData, objDiv, runtimeState)){
            return false;
        }

        if (interaction.consumeItem) {
            RemoveFromInventory(itemId);
            saveGameState();
        }
        return true;
    }
    return false;
}
/**
 * Sets up drag and drop on the inventory items
 * @param {div} objDiv 
 * @param {object} objectData
 * @param {object} runtimeState 
 */
function setupDragAndDrop(objDiv, objectData, runtimeState) {
    objDiv.addEventListener('dragover', (e) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'use';
    });

    objDiv.addEventListener('drop', (e) => {
        e.preventDefault();
        e.stopPropagation();
        const draggedItemId = e.dataTransfer.getData('text/plain');
        processItemInteraction(draggedItemId, objectData, objDiv, runtimeState);
    });
}
/**
 * Render the current state of the object in question
 * Perform entry action if the state just changed
 * @param {object} objectData
 * @param {object} runtimeState 
 * @param {boolean} justChanged
 */
export function renderCurrentState(objectData, runtimeState, justChanged) {
    if (runtimeState.currentAudio) {
        runtimeState.currentAudio.pause();
        runtimeState.currentAudio.currentTime = 0;
        runtimeState.currentAudio = null;
    }

    const state = objectData.states[runtimeState.currentIndex];
    runtimeState.imgEl.src = "./art/objects/" + state.imgPath;
    runtimeState.childrenContainer.innerHTML = '';

    if (state.sound) {
        if (!state.playOnChange)
            runtimeState.currentAudio = playSound("./art/sound/" + state.sound, state.looping);
        else if (justChanged) {
            runtimeState.currentAudio = playSound("./art/sound/" + state.sound, state.looping);
        }
    }

    if (state.children && state.children.length > 0) {
        state.children.forEach(childInstance => {
            const childId = childInstance.id || childInstance.file.split('.')[0];
            if (globalGameState.consumedItems && globalGameState.consumedItems.includes(childId)) {
                return;
            }
            loadObject(childInstance, runtimeState.childrenContainer, runtimeState.viewport);
        });
    }
    if (state.entryAction && justChanged) {
        DoAction(state.entryAction, objectData, runtimeState.objDiv, runtimeState);
    }
}
/**
 * Load the object, connect it all together, render the state.
 * If there is an override action from the level, we can ensure that its click prioritizes that
 * @param {object} instanceData 
 * @param {object} parentElement
 * @param {div} viewport
 * @param {string} overrideAction 
 */
export function loadObject(instanceData, parentElement, viewport, overrideAction) {
    fetchPrefab(instanceData.file, (rawObjectData) => {
        const objectId = rawObjectData.id || instanceData.file.split('.')[0];
        rawObjectData.id = objectId;

        const objectSaveData = globalGameState.objects ? globalGameState.objects[objectId] : null;

        const objectData = mergeRuntimeState(rawObjectData, objectSaveData);

        const { objDiv, imgEl, childrenContainer } = createObjectDOM(instanceData, parentElement, viewport);

        const runtimeState = {
            currentIndex: objectData.currentIndex || 0,
            imgEl: imgEl,
            childrenContainer: childrenContainer,
            viewport: viewport,
            currentAudio: null,
            disableClicks: false,
            objDiv: objDiv
        };
        if (objectData.disableClicks) {
            objDiv.style.pointerEvents = "none";
            objDiv.onclick = null;
        } else {
            objDiv.onclick = (e) => {
                e.stopPropagation();

                if (globalGameState.selectedItem) {
                    processItemInteraction(globalGameState.selectedItem, objectData, objDiv, runtimeState);

                    globalGameState.selectedItem = null;
                    RenderInventory();
                    return; 
                }

                 let action = objectData.clickAction;
                if (overrideAction) {
                    action = overrideAction;
                }
                DoAction(action, objectData, objDiv, runtimeState);
            }
        }
        setupDragAndDrop(objDiv, objectData, runtimeState);
        renderCurrentState(objectData, runtimeState, false);
    });
}