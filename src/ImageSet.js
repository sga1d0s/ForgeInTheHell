// clase que gestiona el titleSet de un sprite
export class ImageSet {
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

export class ImageSetFree {
  constructor(initFil, initCol, xSize, ySize, gridXSize, gridYSize, xOffset, yOffset) {
    this.initFil = initFil
    this.initCol = initCol
    this.xSize = xSize
    this.ySize = ySize
    this.gridXSize = gridXSize
    this.gridYSize = gridYSize
    this.xOffset = xOffset
    this.yOffset = yOffset
  }
}