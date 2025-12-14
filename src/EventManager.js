import globals from "./globals.js";
import { HammerBrokenEvent, BlessingEvent } from "./events.js";

export default class EventManager {
  constructor() {
    this.active = null;

    // Registra eventos (prioridad alta primero)
    this.events = [
      new HammerBrokenEvent(),
      new BlessingEvent(),
    ].sort((a, b) => (b.priority ?? 0) - (a.priority ?? 0));

    // Para detectar fallos (subidas de failHitCounter) y resetear racha
    globals.prevFailHitCounter ??= globals.failHitCounter ?? 0;
  }

  update(dt) {
    // si aumenta failHitCounter desde el último hit, hay fallo -- rompe racha
    const prev = globals.prevFailHitCounter ?? 0;
    const curr = globals.failHitCounter ?? 0;
    if (curr > prev) {
      globals.hitStreak = 0;
    }
    globals.prevFailHitCounter = curr;

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