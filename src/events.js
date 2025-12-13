import { Key, SpriteID } from "./constants.js";
import globals from "./globals.js";
import { createHammerSparks, initHammerPickupAt } from "./initialize.js";
import Timer from "./Timer.js";

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

    // Timer para retrasar el spawn del martillo
    this.spawnTimer = new Timer(false, 1);
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

    globals.hammerPickupCollected = false;

    // reset del timer
    this.spawnTimer.timeChangeCounter = 0;
    this.spawnTimer.value = false;

    const sparkX = 430 + 34;
    const sparkY = 0 + 40;
    createHammerSparks(sparkX, sparkY, 1.5);
  }

  update(dt) {
    // 1) Si ya se recogió el martillo → cerrar evento
    if (globals.hammerPickupCollected) {
      globals.hammerPickupCollected = false;

      globals.failHitCounter = globals.score / 3;
      globals.hammerDamage = 0;
      globals.prevHammerDamage = 0;

      this.end();
      return;
    }

    // 2) Avanzar timer de spawn
    if (!this.spawnTimer.value) {
      this.spawnTimer.timeChangeCounter += globals.deltaTime;

      if (this.spawnTimer.timeChangeCounter >= this.spawnTimer.timeChangeValue) {
        this.spawnHammerPickup();
        this.spawnTimer.value = true;
      }
    }
  }

  end() {
    this.running = false;
    this.spawnTimer.timeChangeCounter = 0;
    this.spawnTimer.value = false;
  }

  getPickupSpawnPosition() {
    // psiciones para la reaparición del martillo
    const pos = [
      { x: 50, y: 300 },
      { x: 200, y: 200 },
      { x: 450, y: 300 },
      { x: 450, y: 100 },
      { x: 50, y: 300 }
    ]

    const index = Math.floor(Math.random() * pos.length);

    return pos[index]
  }
}

export default HammerBrokenEvent;