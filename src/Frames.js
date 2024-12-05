// clase que define los frames
export default class Frames {
  constructor(framesPerState) {
    // numero de frames por estado de animación
    this.framesPerState = framesPerState
    // contador de frames
    this.frameCounter = 0
  }
}