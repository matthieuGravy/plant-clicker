import * as PIXI from 'pixi.js';
import Branch from './branch';
import { getScore, setSeed, getSeed, setSteps, getSteps } from '../game';

const CANVAS_WIDTH = 1000
const CANVAS_HEIGHT = 2000
const CANVAS_ID = 'plant'

class Plant {
  constructor(canvas, x, y) {
    this.canvas = canvas
    this.x = x;
    this.y = y;

    this.graphics = new PIXI.Graphics();
    this.canvas.stage.addChild(this.graphics);

    this.initializePlant();
    this.previousScore = getScore();

    this.canvas.ticker.add(this.update.bind(this));
  }

  initializePlant() {
    let seed = getSeed();
    let steps;
    if (seed) {
      this.createPlant(seed);
      steps = getSteps();
      for (let i = 0; i < steps; i++) {
        this.plant.grow();
      }
      this.plant.render();
    } else {
      seed = Math.floor(Math.random() * Math.pow(10, 10));
      setSeed(seed);
      this.createPlant(seed);
      steps = 0;
    }
    this.steps = steps;
  }

  createPlant(seed) {
    this.plant = new Branch(this.graphics, seed, this.x, this.y, 0, true);
  }

  update() {
    const score = getScore();

    if (score > this.previousScore * 1.015) {
      this.plant.grow();
      this.graphics.clear();
      this.plant.render();
      this.previousScore = score;
      this.steps++;
      setSteps(this.steps);
    }
  }

  destroy() {
    this.graphics.clear();
    this.canvas.stage.removeChild(this.graphics);
  }
}

// Initialize the Plant
const canvas = new PIXI.Application({
  antialias: false,
  width: CANVAS_WIDTH,
  height: CANVAS_HEIGHT,
  backgroundAlpha: 0,
});
document.getElementById(CANVAS_ID).appendChild(canvas.view);

let plant = new Plant(canvas, CANVAS_WIDTH/2, CANVAS_HEIGHT);

// New plant when user clicks on reset button
document.getElementById("resetButton").addEventListener("click", () => {
  plant.destroy()
  plant = new Plant(canvas, CANVAS_WIDTH/2, CANVAS_HEIGHT);
});