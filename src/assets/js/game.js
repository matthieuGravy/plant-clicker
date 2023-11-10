import Click from './click';

// Retrieve user data from localStorage or create a new user if not exists
let currentUser = JSON.parse(localStorage.getItem("user"));
if (currentUser == null) {
    currentUser = newUser();
}
boostOFF();

// Update HTML elements with initial user data
updateUI();

// Event listener for clicking on the plant
document.getElementById("plantClicker").addEventListener("click", (event) => {
    currentUser = setScore(currentUser, getMultiplier(), false);
    currentUser = setBank(currentUser, getMultiplier());
    new Click(getMultiplier(), event.clientX, event.clientY, currentUser.boost)
    currentUser = increaseClicks(currentUser);
    updateUI();
});

// Event listener for purchasing autoclicker
document.getElementById("purchaseAutoClick").addEventListener("click", () => {
    handlePurchase(getAutoClickerPrice(), "autoclick");
});

// Event listener for purchasing multiplier
document.getElementById("purchaseMultiplier").addEventListener("click", () => {
    handlePurchase(getMultiplierPrice(), "multiplier");
});

// Event listener for purchasing boost
document.getElementById("purchaseBoost").addEventListener("click", () => {
    handlePurchase(getBoostPrice(currentUser.multiplier), "boost");
});

// Event listener for reset
document.getElementById("resetButton").addEventListener("click", () => {
    currentUser=newUser();
    updateUI();
});

// Handle purchases
function handlePurchase(price, type) {
    if(type=="boost" && currentUser.boost){
    } else if (currentUser.bank < price) {
    } else {
        currentUser = setBank(currentUser, -price);
        switch (type) {
            case "autoclick":
                currentUser = increaseAutoClicker(currentUser);
                break;
            case "multiplier":
                currentUser = increaseMultiplier(currentUser);
                break;
            case "boost":
                currentUser = boostON(currentUser);
                setTimeout(boostOFF, 15000);
                break;
        }
        updateUI();
    }
}

// Update the UI with current user data
function updateUI() {
    document.getElementById("bank").innerHTML = currentUser.bank;
    document.getElementById("amountAutoClick").innerHTML = currentUser.autoclick;
    document.getElementById("autoClickPrice").innerHTML = getAutoClickerPrice();
    document.getElementById("amountMultiplier").innerHTML = currentUser.multiplier;
    document.getElementById("multiplierPrice").innerHTML = getMultiplierPrice();
    document.getElementById("boostPrice").innerHTML = getBoostPrice(currentUser.multiplier);
    updateStats();
}

// Update the UI with current stats
function updateStats(){
    document.getElementById("scoreTotal").innerHTML=currentUser.score;
    document.getElementById("startDate").innerHTML=currentUser.startDate;
    document.getElementById("nbClick").innerHTML=currentUser.nbrClick;
    document.getElementById("scoreClick").innerHTML=currentUser.scrClick;
    document.getElementById("scoreAuto").innerHTML=currentUser.scrAuto;
    document.getElementById("nbBoost").innerHTML=currentUser.nbrBoost;
}

// Create a new user and stock it in localStorage
function newUser(){
    let now = new Date();
    let today = now.getDate() + '/' + now.getMonth() + '/' + now.getFullYear() + ' ' + now.getHours() + ':'
    today = (now.getMinutes() <10) ? today + '0'+now.getMinutes() : today + now.getMinutes()
    let user = {
        score: 0,
        bank: 0,
        multiplier: 1,
        autoclick: 0,
        boost: false,
        startDate: today,
        nbrClick: 0,
        scrClick: 0,
        scrAuto: 0,
        nbrBoost: 0
    };
    localStorage.setItem("user", JSON.stringify(user));
    setSeed(0)
    setSteps(0)
    return user;
}

// Booster
function boostON(user){
    user.boost=true;
    user.nbrBoost++;
    localStorage.setItem("user",JSON.stringify(user));
    return user;
}

function boostOFF() {
    currentUser.boost = false;
    localStorage.setItem("user", JSON.stringify(currentUser));
    updateUI();
}

// Autoclicker
setInterval(autoClick, 1000);

function autoClick() {
    currentUser = setScore(currentUser, getMultiplier() * getAutoClicker(), true);
    currentUser = setBank(currentUser, getMultiplier() * getAutoClicker());
    updateUI();
}

// Increment
function increaseAutoClicker(user) {
    user.autoclick++;
    localStorage.setItem("user", JSON.stringify(user));
    return user;
}

function increaseMultiplier(user) {
    user.multiplier++;
    localStorage.setItem("user", JSON.stringify(user));
    return user;
}

function increaseClicks(user){
    user.nbrClick++;
    localStorage.setItem("user", JSON.stringify(user));
    return user;
}

// Set value
function setScore(user, value, auto){
    if(user.boost){
        value*=3;
    }
    if(auto){
        user.scrAuto+=value;
    }else{
        user.scrClick+=value;
    }
    user.score+=value;
    localStorage.setItem("user",JSON.stringify(user));
    return user;
}

function setBank(user, value){
    if(user.boost && value>0){
        value*=3;
    }
    user.bank+=value;
    localStorage.setItem("user",JSON.stringify(user));
    return user;
}

export function setSeed(seed){
    localStorage.setItem("seed", seed)
}

export function setSteps(steps){
    localStorage.setItem("steps", steps)
}

// Get price
function getMultiplierPrice() {
    let multiplier = JSON.parse(localStorage.getItem("user")).multiplier;
    return 50 * Math.pow(2, multiplier);
}

function getAutoClickerPrice() {
  let autoclick = JSON.parse(localStorage.getItem("user")).autoclick;
  return Math.round(100 * Math.pow(1.5, autoclick));
}

function getBoostPrice(multiplier){
    return Math.round(75*multiplier + 75*getAutoClicker());
}

// Get value
export function getScore() {
    return JSON.parse(localStorage.getItem("user")).score;
}

export function getBank() {
    return JSON.parse(localStorage.getItem("user")).bank;
}

export function getMultiplier() {
    return JSON.parse(localStorage.getItem("user")).multiplier;
}

export function getAutoClicker(){
    return JSON.parse(localStorage.getItem("user")).autoclick;
}

export function getBoost(){
    return JSON.parse(localStorage.getItem("user")).boost;
}

export function getSeed(){
    return parseInt(localStorage.getItem("seed"))
}

export function getSteps(){
    return parseInt(localStorage.getItem("steps"))
}