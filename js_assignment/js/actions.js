/**
 * Authors: London Dummer
 * Purpose: Handles action system and changes the model
 * Date Created: 2/11/2026
 * Note: Refactored from script.js, logic began to be written on 2/8/2026
 * */


import { loadLevel, renderCurrentState } from "./levelLoader.js";
import { AddToInventory, globalGameState, loadGameState, saveGameState } from "./saving.js";
import { stopAllSound, playSound } from "./audio.js";
import { RenderProgress, StartGame } from "./script.js";
/**
 * Perform action, interpret strings
 * Do different game actions depending on received input
 * Handle most game logic
 * @param {string} rawAction 
 * @param {object} objectData
 * @param {div} objDiv 
 * @param {object} runtimeState
 */
export function DoAction(rawAction, objectData, objDiv, runtimeState) {
    if (Array.isArray(rawAction)) {
        rawAction.forEach(element => {
            DoAction(element, objectData, objDiv, runtimeState);
        });
        return;
    }
    let actionStatus = true;
    //regex so I can pass args 
    const match = rawAction.match(/^([a-zA-Z0-9_]+)(?:\((.*)\))?$/);
    const action = match ? match[1] : rawAction; //if not in format we use raw action
    const args = match && match[2] ? match[2].split(',').map(arg => arg.trim()) : []; //split up args by commas, usually I just use one though
    //helper to log a state change to the runtime state
    function logStateChange() {
        if (!globalGameState.objects) globalGameState.objects = {};
        globalGameState.objects[objectData.id] =
        {
            //just these two are sufficient, as the game is based on FSMs
            currentIndex: runtimeState.currentIndex,
            disableClicks: objectData.disableClicks || false, 
        };
        saveGameState();
    };
    const currentState = objectData.states[runtimeState.currentIndex];
    const examineText = currentState.examine || objectData.examine;
    //^ state takes priority over base
    //This is to prevent too many examine texts popping up
    if (!args.includes("noExamine")
        && examineText != "noExamine") {
        showExamineText(examineText, objDiv, runtimeState.viewport);
    }
    switch (action) {
        //examine, nothing else
        case 'justExamine':
            if (!args.includes("noExamine") //to block examines again
                && examineText != "noExamine") {
                showExamineText(args[0], objDiv, runtimeState.viewport);
            }
            //this is useful for if I want to examine without having to click 
            break;
        //conditional based on flags
        case 'conditional':
            let flagToCheck = args[0];
            let isInverted = false; //so I can do ! 
            if (flagToCheck.startsWith('!')) {
                isInverted = true;
                flagToCheck = flagToCheck.substring(1);
            }
            const actionIfTrue = args[1];
            const subArgs = args.slice(2).join(', ');
            let flagValid = (globalGameState.flags && globalGameState.flags[flagToCheck]);
            if (isInverted) {
                flagValid = !flagValid;
            }
            if (flagValid) {
                const action = subArgs ? `${actionIfTrue}(${subArgs})` : actionIfTrue;
                DoAction(action, objectData, objDiv, runtimeState);
                //this recursive setup makes it easy to build
                //seemingly complex behaviour
            } else {
                actionStatus = false;
            }
            break; //conditional syntax is like: conditional(flag, action, arg1, arg2, ...);
        //set a flag by the first arg
        case 'setFlag':
            globalGameState.flags[args[0]] = true;
            saveGameState();
            break;
        //just goes to a specific level by filepath
        case 'goToLevel':
            loadLevel(args[0], runtimeState.viewport);
            break;
        //will rotate through the objects states. However, it wont work if the state is 'stuck'
        case 'rotateState':
            if (objectData.states[runtimeState.currentIndex].stuck == "yes") {
                return;
            }
            runtimeState.currentIndex = (runtimeState.currentIndex + 1) % objectData.states.length;
            renderCurrentState(objectData, runtimeState, true);
            logStateChange();
            break;
        //add to inventory, maybe remove. If its a special take, it can change level and do cutscene
        case 'take':
            AddToInventory(objectData);
            //prevents it from being rendered next level load
            if (!globalGameState.consumedItems) globalGameState.consumedItems = [];
            globalGameState.consumedItems.push(objectData.id);
            saveGameState();

            if (runtimeState.currentAudio) {
                runtimeState.currentAudio.pause();
            }
            objDiv.remove();
            break;
        //this one rotates the state, waits a second, then goes to the 'nextLevel'
        //I made this in order to allow for jump cuts after player does something
        case 'rotateStateThenNext':
            if (objectData.states[runtimeState.currentIndex].stuck == "yes") {
                return;
            }
            runtimeState.currentIndex = (runtimeState.currentIndex + 1) % objectData.states.length;
            renderCurrentState(objectData, runtimeState, true);
            logStateChange();
            const delayTime = objectData.delay || 1500;
            //this was used to add a delay for the car scene
            //if I were to do it again I'd just use a delay action
            //and pass another as an arg similar to conditional
            setTimeout(() => {
                if (objectData.special === 'yes') {
                    if (objectData.cutscene) {
                        playCutscene(objectData.cutscene, objectData.nextLevel, runtimeState.viewport);
                    } else if (objectData.nextLevel) {
                        loadLevel(objectData.nextLevel, runtimeState.viewport);
                    }
                }
            }, delayTime);
            break;
        //originally was going to play an anim, but instead it just plays a sound.
        case 'playSoundAnim':
            if (objectData.actionSound) {
                playSound("art/sound/" + objectData.actionSound, false);
            }
            break;
        //force a state to a specific one. This is done so that for example I can set a locked box 'stuck' and quickly go to an open state with a condition
        case 'forceState':
            runtimeState.currentIndex = parseInt(args[0], 10);
            renderCurrentState(objectData, runtimeState, true);
            logStateChange();
            break;
        //plays the cutscene from args
        case 'playCutscene':
            playCutscene(args[0], args[1], runtimeState.viewport);
            break;
        //blocks the div from being clicked
        case 'disableClicks':
            objectData.disableClicks = true;
            objDiv.style.pointerEvents = "none";
            objDiv.onclick = null;
            logStateChange();
            break;
        //restarts the game from 0
        case 'restartGame':
            StartGame(true);
            break;
        //add to the progress counter
        case 'addProgress':
            globalGameState.progress++;
            RenderProgress();
            break;
        //set the best time
        case 'setBestTime':
            if (globalGameState.timeThisRun < globalGameState.bestTime) {
                globalGameState.bestTime = globalGameState.timeThisRun;
            }
            break;
    }
    saveGameState();
    return actionStatus;
}
/**
 * Shows examine text, 
 * ensures it fits on the screen
 * @param {string} examineText 
 * @param {div} objDiv 
 * @param {div} viewport
 */function showExamineText(examineText, objDiv, viewport) {
    if (!examineText) return;
    const existingText = document.getElementById('examine-tooltip'); 
    if (existingText) {existingText.remove();}
    const textDiv = document.createElement('div');
    textDiv.id = 'examine-tooltip';
    textDiv.innerText = examineText;
    textDiv.style.position = 'absolute';
    textDiv.style.left = objDiv.style.left;
    textDiv.style.top = `calc(${objDiv.style.top} + 15%)`;
    textDiv.style.transform = 'translate(-50%, -50%)';

    viewport.appendChild(textDiv);
    const textRect = textDiv.getBoundingClientRect();
    const vpRect = viewport.getBoundingClientRect();

    const padding = 15;
    //shift the text to fit into the screen
    let centerX = (textRect.left + textRect.width / 2) - vpRect.left;
    let centerY = (textRect.top + textRect.height / 2) - vpRect.top;

    if (centerX - (textRect.width / 2) < padding) {
        centerX = (textRect.width / 2) + padding;
    } else if (centerX + (textRect.width / 2) > vpRect.width - padding) {
        centerX = vpRect.width - (textRect.width / 2) - padding;
    }

    if (centerY - (textRect.height / 2) < padding) {
        centerY = (textRect.height / 2) + padding;
    } else if (centerY + (textRect.height / 2) > vpRect.height - padding) {
        centerY = vpRect.height - (textRect.height / 2) - padding;
    }

    textDiv.style.left = `${centerX}px`;
    textDiv.style.top = `${centerY}px`;

    const displayDuration = 1500 + (examineText.length * 5); //length depends on letters
    //erase after time
    setTimeout(() => {
        if (document.getElementById('examine-tooltip') === textDiv) {
            textDiv.remove();
        }
    }, displayDuration);
}
/**
 * Play cutscenes, change to next level, or return to prior level
 * @param {string} cutsceneFile 
 * @param {string} nextLevelFile
 * @param {div} viewport
 */
export function playCutscene(cutsceneFile, nextLevelFile, viewport) {
    stopAllSound();
    // allow cutscene to play sound instead
    fetch("./js/cutscenes/" + cutsceneFile)
        .then(response => response.text())
        .then(text => {
            const cutsceneData = JSON.parse(text);

            viewport.innerHTML = "";

            const textContainer = document.createElement('div');
            textContainer.className = "cutscene-text-container";

            const textElement = document.createElement('span');
            textElement.className = "shaky-text";
            textContainer.style.top = "0";
            textContainer.style.transform = "translateX(-50%)";
            textContainer.style.paddingTop = "20px";

            textContainer.appendChild(textElement);
            viewport.appendChild(textContainer);
            //next button to make it clear
            const nextButton = document.createElement('button');
            nextButton.innerText = "Next >>";
            nextButton.className = "cutscene-next-button";
            viewport.appendChild(nextButton);

            if (cutsceneData.music) {
                playSound(cutsceneData.music, true);
            }

            let currentSlideIndex = 0;
            //helper func to render each slide
            const renderSlide = () => {
                if (currentSlideIndex >= cutsceneData.slides.length) {
                    viewport.onclick = null;
                    //makes syntax simpler
                    const levelToLoad = nextLevelFile || globalGameState.currentLevel;

                    if (levelToLoad) {
                        loadLevel(levelToLoad, viewport);
                    } else {
                        viewport.innerHTML = "";
                        viewport.style.backgroundImage = "none";
                        stopAllSound();
                    }
                    return;
                }

                const slide = cutsceneData.slides[currentSlideIndex];

                let displayText = slide.text || "";
                // I wanted to add reading vars to the cutscenes
                //this is just a regex similar to doaction
                displayText = displayText.replace(/\$\{([^}]+)\}/g, (match, varName) => {
                    let val = globalGameState[varName];
                    if (val !== undefined) {
                        //these two cases are super hacky
                        //if I had more time I'd implement some kind of type system
                        //to parse the vars according to their type
                        if (varName === 'timeThisRun') {
                            return formatTime(val); 
                        }
                        else if (varName === 'bestTime') {
                            return formatTime(val);
                        }
                        return val;
                    }
                    return match;
                });
                textElement.innerText = displayText;

                if (slide.backdrop) {
                    viewport.style.backgroundImage = `url('${slide.backdrop}')`;
                    viewport.style.backgroundSize = 'contain';
                    viewport.style.backgroundRepeat = 'no-repeat';
                    viewport.style.backgroundPosition = 'center';
                }
                //if there are buttons on the slide, the user must click those instead
                //so that you cant just click next and get stuck into nothingness
                if (slide.buttons && slide.buttons.length > 0) {
                    nextButton.style.display = 'none';
                    viewport.onclick = null;
                } else {
                    nextButton.style.display = 'block';

                    nextButton.onclick = (e) => {
                        e.stopPropagation();
                        currentSlideIndex++;
                        renderSlide();
                    };

                    viewport.onclick = (e) => {
                        e.stopPropagation();
                        currentSlideIndex++;
                        renderSlide();
                    };
                }
                //remove
                const oldButtons = textContainer.querySelectorAll('.custom-cutscene-btn');
                oldButtons.forEach(btn => btn.remove());
                //add buttons from the currentslide 
                if (slide.buttons) {
                    slide.buttons.forEach(btnData => {
                        const newBtn = document.createElement('button');
                        newBtn.innerText = btnData.text;
                        newBtn.className = "custom-cutscene-btn";
                        newBtn.style.margin = "10px";
                        newBtn.style.position = "relative";
                        newBtn.style.zIndex = "100";

                        newBtn.onclick = (e) => {
                            e.stopPropagation();
                            //these dummy objects prevent breaking doaction

                            const dummyObject = {
                                id: "btn_" + btnData.action,
                                states: [{}]
                            };
                            const dummyRuntime = {
                                currentIndex: 0,
                                viewport: viewport
                            };

                            DoAction(btnData.action, dummyObject, newBtn, dummyRuntime); //
                        };
                        textContainer.appendChild(newBtn);
                    });
                }
            };

            renderSlide();
        })
        .catch(error => console.error(`cutscene broken ${cutsceneFile}:`, error)); //
}
/**
 * Format time to make it more human readable.
 * @param {int} ms 
 */function formatTime(ms) {
    if (ms === 0) return "00:00.00";

    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    const milliseconds = Math.floor((ms % 1000) / 10);

    const minStr = String(minutes).padStart(2, '0');
    const secStr = String(seconds).padStart(2, '0');
    const msStr = String(milliseconds).padStart(2, '0');

    return `${minStr}:${secStr}.${msStr}`;
}
