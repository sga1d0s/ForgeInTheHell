// clase gestora de los sprites
export default class Sprite {
  constructor(id, state, xPos, yPos, imageSet, frames) {
    this.id = id
    this.state = state
    this.xPos = xPos
    this.yPos = yPos
    this.imageSet = imageSet
    this.frames = frames
  }
}