// clase gestora de los sprites
export default class Sprite {
  constructor(id, state, xPos, yPos, imageSet, frames, attackFrames = 0, physics,
    hitBox = { xOffset: 0, yOffset: 0, xSize: 0, ySize: 0 },
    strikeBox = [0,0,0,0],
  ) {
    this.id = id
    this.state = state
    this.xPos = xPos
    this.yPos = yPos
    this.imageSet = imageSet
    this.frames = frames
    this.attackFrames = attackFrames
    this.physics = physics
    this.hitBox = hitBox
    this.strikeBox = strikeBox
    this.isCollidingWithPlayer = false
    this.isCollidingWithObstacleOnTheTop = false
    this.isCollidingWithObstacleOnTheLeft = false
    this.isCollidingWithObstacleOnTheBottom = false
    this.isCollidingWithObstacleOnTheRight = false
  }
}