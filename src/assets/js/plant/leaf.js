import * as PIXI from 'pixi.js';
import seedrandom from 'seedrandom';

const COLOR_GREEN_100 = '0x53621E'
const COLOR_GREEN_200 = '0x48551E'
const COLOR_GREEN_300 = '0x374015'
const COLOR_YELLOW_100 = '0xE4A838'
const COLOR_YELLOW_200 = '0xC28513'
const COLOR_YELLOW_300 = '0x896117'
const COLOR_PINK_100 = '0xF5BFD3'
const COLOR_PINK_200 = '0xF090B3'
const COLOR_PINK_300 = '0xE85A8D'

const THEMES = [
  [COLOR_GREEN_100, COLOR_GREEN_200, COLOR_GREEN_300],
  [COLOR_YELLOW_100, COLOR_YELLOW_200, COLOR_YELLOW_300],
  [COLOR_PINK_100, COLOR_PINK_200, COLOR_PINK_300]
]

export default class Leaf {
  constructor(graphics, seed, x, y) {
    this.graphics = graphics
    this.seed = seed
    this.x = x
    this.y = y
    this.coordinates = {}
    this.color = this.selectColor()
    this.direction = (this.randomInt(0, 10)<5) ? 'left' : 'right'
    this.growth = 0
    this.maxGrowth = this.randomInt(3,30)
    this.createLeaf()
  }

  selectColor() {
    let seedFirstNumber = String(this.seed).split("").map(Number)[0]
    let themeIndex = Math.floor(seedFirstNumber/3)
    return THEMES[themeIndex][this.randomInt(0,2)]
  }

  randomInt(min, max) {
    let srng = seedrandom(this.seed)()
    let randomInt = Math.floor(srng * (max - min) + min);
    this.seed++
    return randomInt
  }

  createLeaf() {
    this.coordinates.startX = this.x
    this.coordinates.startY = this.y
    this.coordinates.endX = (this.direction=='right') ? this.x+this.randomInt(7,15) : this.x-this.randomInt(7,15)
    this.coordinates.endY = this.y+this.randomInt(-5,5)
    this.coordinates.curveTopX = (this.direction=='right') ? this.x+this.randomInt(0,7) : this.x-this.randomInt(0,7)
    this.coordinates.curveTopY = this.y-this.randomInt(3,7)
    this.coordinates.curveBottomX = (this.direction=='right') ? this.x+this.randomInt(0,7) : this.x-this.randomInt(0,7)
    this.coordinates.curveBottomY = this.y+this.randomInt(3,7)
  }

  grow() {
    if (this.growth < this.maxGrowth && this.randomInt(1,5)==1) {
      this.coordinates.endX += (this.direction=='right') ? this.randomInt(1,2) : this.randomInt(-2,-1)
      this.coordinates.endY += this.randomInt(-1,1)
      this.coordinates.curveTopX += (this.direction=='right') ? this.randomInt(0,1) : this.randomInt(-1,0)
      this.coordinates.curveTopY += this.randomInt(1,2)
      this.coordinates.curveBottomX += (this.direction=='right') ? this.randomInt(0,1) : this.randomInt(-1,0)
      this.coordinates.curveBottomY += this.randomInt(-2,-1)
      this.growth++
    }
  }

  render() {
    this.graphics.lineStyle({
      width: 0
    })
    this.graphics.beginFill(this.color, 1);

    this.graphics.moveTo(this.coordinates.startX, this.coordinates.startY)
    this.graphics.quadraticCurveTo(this.coordinates.curveTopX, this.coordinates.curveTopY, this.coordinates.endX, this.coordinates.endY);
    this.graphics.moveTo(this.coordinates.startX, this.coordinates.startY)
    this.graphics.quadraticCurveTo(this.coordinates.curveBottomX, this.coordinates.curveBottomY, this.coordinates.endX, this.coordinates.endY);
  }
}