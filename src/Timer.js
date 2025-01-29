export default class Timer {
  constructor(value, timeChangeValue) {
    // valor del temporizador
    this.value = value
    // temporizador para cambiar valor (seconds)
    this.timeChangeCounter = 0
    // tiempo para cambiar valor (seconds)
    this.timeChangeValue = timeChangeValue
  }
}