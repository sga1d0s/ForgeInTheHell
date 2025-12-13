import { Key, SpriteID } from "./constants.js";
import globals from "./globals.js";
import { createHammerSparks, initHammerPickupAt } from "./initialize.js";

export function keydownHandler(event) {
  switch (event.keyCode) {
    case Key.W:
    case Key.UP:
      globals.action.moveUp = true
      break;
    case Key.S:
    case Key.DOWN:
      globals.action.moveDown = true
      break;
    case Key.A:
    case Key.LEFT:
      globals.action.moveLeft = true
      break;
    case Key.D:
    case Key.RIGHT:
      globals.action.moveRight = true
      break;
    case Key.SPACE:
      globals.action.attack = true
      break;
    case Key.ENTER:
      globals.action.enter = true
      break;

    default:
      break;
  }
}

export function keyupHandler(event) {
  switch (event.keyCode) {
    case Key.W:
    case Key.UP:
      globals.action.moveUp = false
      break;
    case Key.S:
    case Key.DOWN:
      globals.action.moveDown = false
      break;
    case Key.A:
    case Key.LEFT:
      globals.action.moveLeft = false
      break;
    case Key.D:
    case Key.RIGHT:
      globals.action.moveRight = false
      break;
    case Key.SPACE:
      globals.action.attack = false
      break;
    case Key.ENTER:
      globals.action.enter = false
      break;

    default:
      break;
  }
}

// evento HammerBroken
export class HammerBrokenEvent {
  constructor() {
    this.id = "HAMMER";
    this.type = "SIMPLE";
    this.priority = 100;
    this.running = false;
    // Delay before the pickup appears (seconds)
    this.spawnDelaySeconds = 1.5;
    this.spawnTimerSeconds = 0;
    this.pickupSpawned = false;
  }

  spawnHammerPickup() {
    if (globals.hammerPickupActive) return;

    const pos = this.getPickupSpawnPosition();
    initHammerPickupAt(pos.x, pos.y);
  }

  canTrigger() {
    // si ya hay pickup en el mapa, no vuelvas a disparar el evento
    return (
      !this.running &&
      !globals.attackDisabled &&
      !globals.hammerPickupActive &&
      globals.hammerDamage >= globals.hammerMaxDamage
    );
  }

  start() {
    this.running = true;
    globals.attackDisabled = true;

    // Limpia señal de recogida anterior (por si venimos de un evento previo)
    globals.hammerPickupCollected = false;

    // feedback visual inmediato opcional (HUD)
    const sparkX = 430 + 34;
    const sparkY = 0 + 40;
    createHammerSparks(sparkX, sparkY, 1.5);

    // Reset delay timer and wait before spawning the pickup
    this.spawnTimerSeconds = 0;
    this.pickupSpawned = false;
  }

  update(dt) {
    // Wait a bit before spawning the pickup
    if (!this.pickupSpawned) {
      // dt may be in ms or seconds depending on your loop; normalize to seconds
      const dtSeconds = dt > 5 ? dt / 1000 : dt;
      this.spawnTimerSeconds += dtSeconds;

      if (this.spawnTimerSeconds >= this.spawnDelaySeconds) {
        this.spawnHammerPickup();
        this.pickupSpawned = true;
      }
    }

    // si el jugador recoge el martillo:
    // - cerramos evento
    // - reseteamos failHitCounter para que hammerDamage no vuelva a 10 al siguiente frame
    if (globals.hammerPickupCollected) {
      globals.hammerPickupCollected = false;

      // hammerDamage = failHitCounter - score/3  -> queremos que sea 0
      globals.failHitCounter = globals.score / 3;

      globals.hammerDamage = 0;
      globals.prevHammerDamage = 0;

      this.end();
      return;
    }

    // si por algún motivo se re-habilita el ataque sin recogida, termina también
    if (!globals.attackDisabled) {
      this.end();
    }
  }

  end() {
    this.running = false;
    this.spawnTimerSeconds = 0;
    this.pickupSpawned = false;
  }

  getPickupSpawnPosition() {
    // Versión simple: centro (luego lo refinamos con validación como skeleton)
    return { x: 100, y: 150 };
  }
}

export default HammerBrokenEvent;