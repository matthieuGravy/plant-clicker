import * as PIXI from 'pixi.js';
import Leaf from './leaf';
import seedrandom from 'seedrandom';

const COLOR_STEM = '0xBB665D'

const MAX_LENGTH = 30 // Maximum number of segments in a branch
const SEGMENT_MIN_LENGTH = 15 // Minimum length of a semgent (pixels)
const SEGMENT_MAX_LENGTH = 30  // Maximum length of a semgent (pixels)
const SEGMENT_MAX_WIDTH = 15 // Maximum width of a semgent (pixels)
const SEGMENT_MAX_OFFSET = 5 // Maximum angle offset from previous segment (degrees)
const GROWTH_STEPS = 10 // Number of rendering loops it takes to draw a segment
const BRANCH_APPEARANCE = 7 // Number of segments between new branches
const LEAF_APPEARANCE = 15 // Maximum number of steps between 2 leaves
const BRANCH_MIN_ANGLE = 15 // Minimum angle at which a branch will grow on its parent branch (degrees)
const BRANCH_MAX_ANGLE = 35 // Maximum angle at which a branch will grow on its parent branch (degrees)

export default class Branch {
  constructor(graphics, seed, x, y, angle, mainBranch) {
    this.graphics = graphics
    this.seed = seed
    this.angle = angle
    this.mainBranch = mainBranch
    this.points = []
    this.addPoint(x, y)
    this.growingSegment = {}
    this.newSegment(x, y)
    this.childBranches = []
    this.leaves = []
    this.maxWidth = (mainBranch) ? SEGMENT_MAX_WIDTH*2 : SEGMENT_MAX_WIDTH
  }

  randomInt(min, max) {
    let srng = seedrandom(this.seed)()
    let randomInt = Math.floor(srng * (max - min) + min);
    this.seed++
    return randomInt
  }

  addPoint(x, y) {
    let newPoint = new PIXI.Point(x, y)
    this.points.push(newPoint)
    return newPoint
  }

  offsetAngle() {
    this.angle += this.randomInt(-SEGMENT_MAX_OFFSET, SEGMENT_MAX_OFFSET)
  }

  newSegment(x, y) {
    this.growingSegment.point = this.addPoint(x, y)
    this.growingSegment.maxLength = this.randomInt(SEGMENT_MIN_LENGTH, SEGMENT_MAX_LENGTH)
    this.growingSegment.endX = this.growingSegment.maxLength * Math.sin(this.angle * (Math.PI/180))
    this.growingSegment.endY = this.growingSegment.maxLength * Math.cos(this.angle * (Math.PI/180))
    this.growingSegment.step = 0
  }

  addChildBranch(x, y) {
    let angle;
    if (this.randomInt(0, 10)>5) {
      angle = this.randomInt(this.angle-BRANCH_MAX_ANGLE, this.angle-BRANCH_MIN_ANGLE)
    } else {
      angle = this.randomInt(this.angle+BRANCH_MIN_ANGLE, this.angle+BRANCH_MAX_ANGLE)
    }

    let branch = new Branch(this.graphics, this.seed + this.randomInt(1,50), x, y, angle)
    this.childBranches.push(branch)
  }

  addLeaf(x, y) {
    let leaf = new Leaf(this.graphics, this.seed, x, y)
    this.leaves.push(leaf)
  }

  grow() {
    if (this.points.length >= MAX_LENGTH) return false

    if (this.growingSegment.step < GROWTH_STEPS) {
      this.growingSegment.point.x += this.growingSegment.endX / GROWTH_STEPS
      this.growingSegment.point.y -= this.growingSegment.endY / GROWTH_STEPS
      this.growingSegment.step += 1
    } else {
      this.newSegment(this.growingSegment.point.x, this.growingSegment.point.y)
      this.offsetAngle()

      if (this.points.length%BRANCH_APPEARANCE == 0)
        this.addChildBranch(this.growingSegment.point.x, this.growingSegment.point.y)
    }

    if (this.randomInt(1, LEAF_APPEARANCE) == 1 && !this.mainBranch) {
      this.addLeaf(this.growingSegment.point.x, this.growingSegment.point.y)
    }

    this.childBranches.forEach((branch) => branch.grow())
    this.leaves.forEach((leaf) => leaf.grow())

    return true
  }

  render() {
    this.graphics.moveTo(this.points[0].x, this.points[0].y);
    this.points.forEach((point, index) => {
      var lineWidth = this.points.length - index + 1
      this.graphics.lineStyle({
        width: (lineWidth > this.maxWidth) ? this.maxWidth : lineWidth,
        color: COLOR_STEM,
        join: 'round',
        cap: 'round'
      })
      this.graphics.lineTo(point.x, point.y);
    })

    this.childBranches.forEach((branch) => branch.render())
    this.leaves.forEach((leaf) => leaf.render())
  }
}