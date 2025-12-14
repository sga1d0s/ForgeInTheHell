import { Key } from "./constants.js";
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

    // Timer retrasar el la aparición del martillo
    this.spawnTimer = new Timer(false, 20);
  }

  spawnHammerPickup() {
    if (globals.hammerPickupActive) return;

    const pos = this.getPickupSpawnPosition();
    initHammerPickupAt(pos.x, pos.y);
  }

  canTrigger() {
    // si ya hay pickup en el mapa, no dispara el evento
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
    // 1) Si ya se recoge el martillo cerrar evento
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

    // Rehabilita ataque al cerrar el evento
    globals.attackDisabled = false;

    // Limpieza de estado interno
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
    ];

    const index = Math.floor(Math.random() * pos.length);

    return pos[index]
  }
}

export class BlessingEvent {
  constructor() {
    this.id = "BLESSING";
    this.type = "SIMPLE";
    this.priority = 50;
    this.running = false;

    this.requiredStrike = 10;
    this.durationSeconds = 20;

    // timer de duración
    this.durationTimer = new Timer(false, this.durationSeconds);
  }

  canTrigger() {
    // no se apila
    if (this.running) return false;
    if (globals.blessingActive) return false;

    // si estás en martillo roto / ataque bloqueado, no lances blessing
    if (globals.attackDisabled) return false;

    return globals.hitStrike >= this.requiredStrike;
  }

  start() {
    this.running = true;

    globals.blessingActive = true;
    globals.hammerWearDisabled = true;
    globals.blessingTimeLeft = this.durationSeconds;

    // Congela el desgaste: guardo el contador para restaurarlo al final
    globals.failHitCounterAtBlessingStart = globals.failHitCounter;

    // reset timer
    this.durationTimer.timeChangeCounter = 0;
    this.durationTimer.value = false;

    // consume la racha (si no, re-dispara instantáneo)
    globals.hitStreak = 0;

    // FX: chispa fuerte al activar 
    this._sparkX = 430 + 34;
    this._sparkY = 0 + 40;

    // acumulador para chispas continuas mientras dure el blessing
    this._sparkAcc = 0;

    // Burst inicial (1 sola vez)
    createHammerSparks(this._sparkX, this._sparkY, 1.2, {
      direction: Math.PI / 2, // abajo
      spread: 0.6,
      color: "rgba(255, 215, 80, 1)",
      speedMin: 35,
      speedMax: 110,
      ttlMin: 0.28,
      ttlMax: 0.55,
      alphaMin: 0.22,
      alphaMax: 0.6,
    });
  }

  update(dt) {
    if (!this.running) return;

    // partículas constantes mientras dure el blessing
    this._sparkAcc ??= 0;
    this._sparkAcc += globals.deltaTime;
    if (this._sparkAcc >= 0.12) {
      this._sparkAcc = 0;
      createHammerSparks(
        this._sparkX ?? (430 + 34),
        this._sparkY ?? (0 + 40),
        0.75,
        {
          direction: Math.PI / 2,
          spread: 0.6,
          color: "rgba(255, 215, 80, 1)",
          speedMin: 35,
          speedMax: 110,
          ttlMin: 0.28,
          ttlMax: 0.55,
          alphaMin: 0.22,
          alphaMax: 0.55,
        }
      );
    }

    const dtSeconds = globals.deltaTime;

    globals.blessingTimeLeft -= dtSeconds;
    if (globals.blessingTimeLeft < 0) globals.blessingTimeLeft = 0;

    this.durationTimer.timeChangeCounter += dtSeconds;

    if (this.durationTimer.timeChangeCounter >= this.durationTimer.timeChangeValue) {
      this.end();
    }
  }

  end() {
    this.running = false;

    globals.blessingActive = false;
    globals.hammerWearDisabled = false;
    globals.blessingTimeLeft = 0;

    // borra desgaste durante blessing 
    globals.failHitCounter = globals.failHitCounterAtBlessingStart;

    // seguridad
    globals.failHitCounterAtBlessingStart = 0;
    this.durationTimer.timeChangeCounter = 0;
    this.durationTimer.value = false;

    // limpiar acumulador
    this._sparkAcc = 0;
  }
}