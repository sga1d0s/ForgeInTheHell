// clase que define los frames
export default class Frames {
  constructor(framesPerState, speed = 1) {
    // numero de frames por estado de animación
    this.framesPerState = framesPerState
    // contador de frames
    this.frameCounter = 0
    // velocidad de cambio de frame
    this.speed = speed
    // contador de velocidad de cambio
    this.frameChangeCounter = 0
  }
}