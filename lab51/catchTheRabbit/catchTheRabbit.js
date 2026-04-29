let attempts = 0;
let tracker = 1;
const rabbitCount =4;
let rabbits = [];
let msg1 = document.getElementById("noeggs");
let msg2 = document.getElementById("slow");
function GetRabbits(){
    for(let i = 1; i <= rabbitCount; i++){
        let el = document.getElementById(`rabbit${i}`);
        if(el) {
            rabbits.push(el);
            el.addEventListener("mouseover", ShowNextRabbit);   
        }
        
    }
}
function HideMessages(){
    msg1.style.visibility='hidden';
    msg2.style.visibility='hidden';
}
function TryShowMessages(){
    if(attempts >= 4){
        msg1.style.visibility='visible';
    }
    if(attempts>=20){
        msg2.style.visibility='visible';
    }
}
function HideAllRabbits(){
    for(let i = 0; i < rabbits.length; i++){
        rabbits[i].style.visibility='hidden';
    }
}
function ShowAtIndex(i){
    rabbits[i].style.visibility='visible';
}
function ShowNextRabbit(){
    HideAllRabbits();
    attempts+=1;
    tracker+=1;
    if(tracker > rabbitCount){
        tracker=1;
    }
    TryShowMessages();
    ShowAtIndex(tracker-1);
}
GetRabbits();
HideMessages();
HideAllRabbits();
ShowAtIndex(0);