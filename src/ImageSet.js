// clase que gestiona el titleSet de un sprite
export default class ImageSet {
  constructor(initFil, initCol, xSize, ySize, gridSize, xOffset, yOffset) {
    this.initFil = initFil
    this.initCol = initCol
    this.xSize = xSize
    this.ySize = ySize
    this.gridSize = gridSize
    this.xOffset = xOffset
    this.yOffset = yOffset
  }
}