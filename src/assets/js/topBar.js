const articleModal = document.getElementById("article-modal");
const buttonRules = document.getElementById("button-rules");
const buttonStats = document.getElementById("button-stats");
const croixRules = document.getElementById("croix-rules");
const croixStats = document.getElementById("croix-stats");
const cache = document.getElementById("cache");
const stat = document.getElementById("stat");

/**
 * Affiche ou masque un élément et l'autre element de la topbar : le rival (le cas échéant)
 * @param {HTMLElement} el - L'élément à afficher ou masquer
 * @param {HTMLElement} [rival=null] - L'élément de la à masquer
 */
function togle(el, rival) {
  const isHidden = el.style.display === "none" || el.style.display === "";
  el.style.display = isHidden ? "block" : "none";
  cache.style.display = isHidden ? "block" : "none";
  if (rival && isHidden) {
    rival.style.display = "none";
  }
}
/**
 * Attache un événement de clic à un élément avec ou sans rival
 * @param {HTMLElement} element - L'élément sur lequel attacher l'événement de clic
 * @param {HTMLElement} el - L'élément à afficher ou masquer
 * @param {HTMLElement} [rival=null] - L'élément rival à masquer
 */
function toggleEl(element, el, rival) {
  element.addEventListener("click", () => {
    togle(el, rival);
  });
}
// Attachement des événements aux boutons pour afficher ou masquer les éléments associés
toggleEl(buttonRules, articleModal, stat);
toggleEl(croixRules, articleModal);
toggleEl(buttonStats, stat, articleModal);
toggleEl(croixStats, stat);


// Event listener for reset
document.getElementById("resetButton").addEventListener("click", () => {
  togle(stat);
});
