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
    this.id = "FORGE";
    this.type = "SIMPLE";
    this.priority = 100;
    this.running = false;
  }

  spawnHammerPickup() {
    if (globals.hammerPickupActive) return;

    const pos = this.getPickupSpawnPosition();
    initHammerPickupAt(pos.x, pos.y);
  }

  canTrigger() {
    return !this.running && !globals.attackDisabled && globals.hammerDamage >= globals.hammerMaxDamage;
  }

  start() {
    this.running = true;

    globals.attackDisabled = true;

    // feedback visual inmediato opcional (HUD)
    const sparkX = 430 + 34;
    const sparkY = 0 + 40;
    createHammerSparks(sparkX, sparkY, 1.5);

    // spawn pickup martillo
    this.spawnHammerPickup();
  }

  update(dt) {
    // si ya lo recogió, termina
    if (!globals.attackDisabled) {
      this.end();
    }
  }

  end() {
    this.running = false;
  }

  getPickupSpawnPosition() {
    // Versión simple: centro (luego lo refinamos con validación como skeleton)
    return { x: 100, y: 150 };
  }
}

export default HammerBrokenEvent;