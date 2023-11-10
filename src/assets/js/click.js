const container = document.getElementById('clickDisplay')

/**
 * Represents a "+points" on the screen.
 * @class
 */
export default class Click {
  /**
   * Creates a new Click instance.
   * @constructor
   * @param {number} points - The points to be displayed.
   * @param {number} x - The x-coordinate of the element.
   * @param {number} y - The y-coordinate of the element.
   * @param {boolean} boost - Indicates if click has a boost.
   */
  constructor(points, x, y, boost) {
    this._x = x - 10 + Math.floor(Math.random() * (5 - (-5) + 1) + (-5));
    this._y = y - 20 + Math.floor(Math.random() * (5 - (-5) + 1) + (-5));
    this._boost = boost;
    this._el = this._createElement(points);
    this._fade(100);
  }

  /**
   * Creates a new DOM element for the click and appends it to the container.
   * @private
   * @param {number} points - The points to be displayed.
   * @returns {HTMLElement} - The created DOM element.
   */
  _createElement(points) {
    const element = document.createElement('span');
    element.classList.add('noselect');
    element.style.left = this._x + 'px';
    element.style.top = this._y + 'px';
    element.style.opacity = '1';
    element.textContent = '+' + (this._boost ? points * 3 : points);
    element.classList.add(this._boost ? 'click-boost' : 'click');
    container.appendChild(element);
    return element;
  }

  /**
   * Animates the fading effect of the click element.
   * @private
   * @param {number} opacity - The current opacity level.
   */
  _fade(opacity) {
    this._y += this._boost ? 0.6 : 0.3;
    this._el.style.top = this._y + 'px';
    this._el.style.opacity = 0.01 * opacity;
    if (opacity > 0) {
      setTimeout(() => this._fade(opacity - 1), 10);
    } else {
      this._el.remove();
    }
  }
}