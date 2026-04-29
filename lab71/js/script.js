const gameView = document.getElementById("GameView");
const inputField = document.getElementById("InputSection");
const validateButton = document.getElementById("Validate");
const guessesLeft = document.getElementById("GuessesLeft");
const restart = document.getElementById("Restart");
validateButton.addEventListener("click", () => Guess(inputField.value));
inputField.addEventListener("input", () => ColorIfError());
restart.addEventListener("click", () => RestartGame());
class Game{
    constructor(value){
        this.number = Math.floor(Math.random()*value+1);
        this.guesses = [];
    }
    checkGuess(guess){
        this.guesses.push(guess);
        if(guess == this.number){
            return true;
        }
        return false;
    }
    validateGuessCount(){
        if(this.guesses.length > 10){
            return false;
        }
        return true;
    }
    compareLastGuess(){
        if(this.guesses[this.guesses.length-1] < this.number){
            return "higher";
        } 
        else return "lower";
    }
    compareSpecificGuess(guess){
        if(guess < this.number){
            return "higher";
        }
        return "lower";
    }
}
function Save(){
    localStorage.setItem("game", JSON.stringify(gameInstance));
}
function Load(){
    let saveData = localStorage.getItem("game");
    if(saveData != null){
        let parsedData = JSON.parse(saveData);
        gameInstance = new Game(100);
        Object.assign(gameInstance, parsedData);
        return;
    }
    else gameInstance = new Game(100);
}
function ColorIfError(){
    if(inputField.value != parseInt(inputField.value)){
        inputField.style.color = "red";
        validInput = false;
        return;
    }
    inputField.style.color = "black";
    validInput = true;
    return;
}
function ClearScreen(){
    gameView.innerHTML='';
    guessesLeft.innerHTML="Guesses Left: 10";
}
function InitializeScreen(){
    ClearScreen();
    for(let i = 0; i < gameInstance.guesses.length; i++){
        guess = gameInstance.guesses[i];
        Render(gameInstance.number == guess);
    }
}
function Render(guessValid){
    ClearScreen();
    const div = document.createElement("div");
    let condition = document.createElement("p");
    if(guessValid){
        condition.innerHTML="Nice";
        div.appendChild(condition);
    }
    else
    {
        switch(gameInstance.compareLastGuess()){
            case "higher":
                condition.innerHTML="The number is higher";
                break;
            case "lower":
                condition.innerHTML="The number is lower";
                break;
        }
    }
    for(let i =0; i < gameInstance.guesses.length; i++){
        let guess = gameInstance.guesses[i];
        const txt = document.createElement("p");
        txt.innerHTML=guess + ":" + gameInstance.compareSpecificGuess(guess);
        gameView.appendChild(txt);
    }
    div.appendChild(condition);
    guessesLeft.innerHTML="Guesses left: " + (10 - gameInstance.guesses.length);
    gameView.appendChild(div);
}
function Guess(input){
    if(gameInstance.guessesLeft <= 0){
        return;
    }
    if(!validInput){
        return;
    }
    const win=gameInstance.checkGuess(input);
    Render(win);
    if(win){
        FinishGame();
    }
    if(!gameInstance.validateGuessCount()){
        FinishGame();
    }
    Save();
}
function FinishGame(){
    setTimeout(() => RestartGame(), 1000);
}
function RestartGame(){
    gameInstance = new Game(100);
    localStorage.game = null;
    ClearScreen();
}
let gameInstance = new Game(100);
let validInput = true;
Load();
InitializeScreen();

