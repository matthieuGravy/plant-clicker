import { getBoost } from "./game";

// Definitions of constants for DOM elements
const bankElement = document.getElementById("bank");
const tamponAutoclicker = document.getElementById("tampon-autoclick");
const tamponMultiplier = document.getElementById("tampon-multiplier");
const tamponBooster = document.getElementById("tampon-boost");

/**
 * @param {HTMLElement} el - The DOM element to modify
 */
function fullPourcent(el) {
  el.style.width = "100%";
}
/**
 * @param {HTMLElement} el - The DOM element to modify
 */
function zeroPourcent(el) {
  el.style.width = "0%";
}
/**
 * @param {HTMLElement} el - The DOM element to add the class to
 * @param {string} className - The name of the class to add
 */
function addClass(el, className) {
  el.classList.add(className);
}
/**
 * @param {HTMLElement} el - The DOM element to remove the class from
 * @param {string} className - The name of the class to remove
 */
function delClass(el, className) {
  el.classList.remove(className);
}

const toCent = "to-cent";
/**
 * @param {MutationRecord[]} mutationsList - The list of observed mutations
 * @param {MutationObserver} observer - The mutation observer
 */
function handleDOMMutation(mutationsList, observer) {
  const currentValueBank = parseInt(bankElement.textContent);
  
  const currentValueAutoClickPrice = parseInt(
    document.getElementById("autoClickPrice").textContent
  );
  const currentValueMultiplier = parseInt(
    document.getElementById("multiplierPrice").textContent
  );
  const currentValueBooster = parseInt(
    document.getElementById("boostPrice").textContent
  );
  const boosted = getBoost();

  if (currentValueAutoClickPrice <= currentValueBank) {
    fullPourcent(tamponAutoclicker);
  } else {
    zeroPourcent(tamponAutoclicker);
  }

  if (currentValueMultiplier <= currentValueBank) {
    fullPourcent(tamponMultiplier);
  } else {
    zeroPourcent(tamponMultiplier);
  }

  if (boosted === true) {
    zeroPourcent(tamponBooster);
    addClass(tamponBooster, toCent);
  } else if (currentValueBooster <= currentValueBank) {
    fullPourcent(tamponBooster);
    delClass(tamponBooster, toCent);
  } else {
    zeroPourcent(tamponBooster);
  }
}

// Creates a new instance of the mutation observer and triggers it
const observer = new MutationObserver(handleDOMMutation);

// Observer configuration to monitor changes in the DOM
const config = { childList: true, subtree: true };

// Starts the observer from the bank element
observer.observe(bankElement, config);
