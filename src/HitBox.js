// clase que gestiona el hitbox de un sprite
export default class HitBox {
  constructor(xSize, ySize, xOffset, yOffset) {
    this.xSize = xSize // tamaño en pixeles del hitbox (X)
    this.ySize = ySize // tamaño en pixeles del hitbox (Y)
    this.xOffset = xOffset // offset en x de comienzo del dibujo del hitbox respecto de xPos
    this.yOffset = yOffset // offset en y de comienzo del dibujo del hitbox respecto de yPos
  }
}