/**
 * Authors: London Dummer
 * Purpose: Handle sound effects
 * Date Created: 2/11/2026
 * Note: Refactored from script.js, logic began to be written on 2/8/2026
 * */


let activeSounds = [];


export function playSound(soundPath, looping) {
    const audio = new Audio(soundPath);
    audio.play().catch(error => 
        { console.error("sound didnt work", error); }
    );
    audio.loop = looping || false;
    activeSounds.push(audio);
    return audio; 
}
export function stopAllSound(){
    activeSounds.forEach(audio => {
        audio.pause();
        audio.currentTime = 0;
    });
    activeSounds=[];
}