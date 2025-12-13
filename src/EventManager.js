import HammerBrokenEvent from "./events.js";

export default class EventManager {
  constructor() {
    this.active = null;
    this.events = [new HammerBrokenEvent()];
  }

  update(dt) {
    // si hay evento activo, actualiza y decide fin
    if (this.active) {
      this.active.update(dt);
      if (!this.active.running) this.active = null;
      return;
    }

    // si no hay evento activo, busca uno que pueda disparar
    for (const e of this.events) {
      if (e.canTrigger()) {
        this.active = e;
        e.start();
        break;
      }
    }
  }
}