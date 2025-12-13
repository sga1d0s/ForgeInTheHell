import globals from "./globals.js"
import { Game, SpriteID, State, StrikeBox, ParticleID, ParticleState } from "./constants.js"
import detectCollisions from "./collisions.js"
import {
  initSkeleton, initSkeletonAt, getRandomSkeletonSpawnPosition, createSkeletonSpawnCloud, createHammerSparks, initSprites, initLevel, createAttackDust,
  ensureLowLifeAuraParticles,
} from "./initialize.js"

export default function update() {

  // partículas de lluvia de fondo
  if (globals.rainParticles && globals.rainParticles.length > 0) {
    updateRainParticleParticles();
  }
  // FX particles
  if (globals.fxParticles && globals.fxParticles.length > 0) {
    updateFxParticles();
  }

  // HUD particles (hammer)
  if (globals.hudParticles && globals.hudParticles.length > 0) {
    updateHudParticles();
  }

  // Si la aparición de un esqueleto está pendiente, cuenta atrás y aparece cuando esté listo.
  if (globals.pendingSkeletonSpawn) {
    updatePendingSkeletonSpawn();
  }

  // iniciar particulas de aura
  updateLowLifeAura();

  globals.gameTime += globals.deltaTime;

  // change what the game is doing based on the game state
  switch (globals.gameState) {
    case Game.LOADING:
      console.log("Loading assets...")
      loadingTime()
      break

    case Game.PLAYING:
      playGame()
      skeletonTime()
      break

    case Game.NEW_GAME:
      // teclado en NEW GAME
      newGame()
      // actualiza sprite®
      updateSkeletonNewGame()
      break

    case Game.STORY:
      // teclado en STORY
      story()
      break

    case Game.CONTROLS:
      // teclado en CONTROLS
      controls()
      break

    case Game.SCORES:
      // teclado en SCORES
      scores()
      break

    case Game.OVER:
      // teclado en OVER
      gameOver()
      break

    default:
      console.error("Error: Game State invalid")
  }

  globals.prevAttack = globals.action.attack;
}

// actualiza forja
function updateForge(sprite) {
  // actualizar sprite para la animación
  updateAnimationFrame(sprite)
}

// actualizar skeleton
function updateSkeleton(sprite) {
  switch (sprite.state) {
    case State.UP:
      sprite.physics.vy = -sprite.physics.vLimit;
      sprite.physics.vx = 0
      break;
    case State.DOWN:
      sprite.physics.vy = sprite.physics.vLimit;
      sprite.physics.vx = 0
      break;
    case State.LEFT:
      sprite.physics.vx = -sprite.physics.vLimit;
      sprite.physics.vy = 0
      break;
    case State.RIGHT:
      sprite.physics.vx = sprite.physics.vLimit;
      sprite.physics.vy = 0
      break;
    case State.DEATH:
      sprite.physics.vx = 0
      sprite.physics.vy = 0
      break

    default:
      console.log("ERROR: State invalid");
      break;
  }

  // calcular la distancia que se mueve
  sprite.xPos += sprite.physics.vx * globals.deltaTime
  sprite.yPos += sprite.physics.vy * globals.deltaTime

  // actualizar sprite para la animación
  updateAnimationFrame(sprite)

  // calcular colision con los bordes
  const isCollision = calculateCollisionWithborders(sprite)

  if (isCollision) {
    swapDirection(sprite)
  }
}

// actualizar player
function updatePlayer(sprite) {

  // asignar teclado solo si player no está muerto
  if (sprite.state != State.DEATH) {
    // Leer teclado y asignar estado
    readKeyboardAndAssignState(sprite);
  }

  // Reset de velocidades
  sprite.physics.vx = 0;
  sprite.physics.vy = 0;

  // Actualizar velocidad según el estado
  switch (sprite.state) {
    case State.UP:
      sprite.physics.vy = -sprite.physics.vLimit;
      break;
    case State.DOWN:
      sprite.physics.vy = sprite.physics.vLimit;
      break;
    case State.LEFT:
      sprite.physics.vx = -sprite.physics.vLimit;
      break;
    case State.RIGHT:
      sprite.physics.vx = sprite.physics.vLimit;
      break;

    case State.UP_LEFT:
      sprite.physics.vx = -sprite.physics.vLimit * Math.SQRT1_2
      sprite.physics.vy = -sprite.physics.vLimit * Math.SQRT1_2
      break
    case State.UP_RIGHT:
      sprite.physics.vx = sprite.physics.vLimit * Math.SQRT1_2
      sprite.physics.vy = -sprite.physics.vLimit * Math.SQRT1_2
      break
    case State.DOWN_LEFT:
      sprite.physics.vx = -sprite.physics.vLimit * Math.SQRT1_2
      sprite.physics.vy = sprite.physics.vLimit * Math.SQRT1_2
      break
    case State.DOWN_RIGHT:
      sprite.physics.vx = sprite.physics.vLimit * Math.SQRT1_2
      sprite.physics.vy = sprite.physics.vLimit * Math.SQRT1_2
      break
    default:
      break;
  }

  // Actualizar el cuadro de ataque (strikeBox) en función del estado del jugador
  if (sprite.state === State.ATTACK_LEFT) {
    sprite.strikeBox = StrikeBox[2];
  } else if (sprite.state === State.ATTACK_RIGHT) {
    sprite.strikeBox = StrikeBox[4];
  } else if (sprite.state === State.ATTACK_UP) {
    sprite.strikeBox = StrikeBox[1];
  } else if (sprite.state === State.ATTACK_DOWN) {
    sprite.strikeBox = StrikeBox[3];
  } else {
    // Si no está atacando, reiniciar el strikeBox
    sprite.strikeBox = StrikeBox[0]
  }

  // Calcular nueva posición
  sprite.xPos += sprite.physics.vx * globals.deltaTime;
  sprite.yPos += sprite.physics.vy * globals.deltaTime;

  // Actualizar animación
  updateAnimationFrame(sprite);
}

// funcion principal playGame
function playGame() {

  // evento HemmerBroken
  globals.eventManager.update(globals.deltaTime);

  // actualiza sprite
  updateSprites()

  // colisiones
  detectCollisions()

  // actualizar tiempo del juego
  updateGameTime()

  // actualizar vida
  updateLife()

  // actualizar el deterioro del martillo
  updateHammerDamage()

  // TEST: tiempo limitado para la prueba
  gameOverTime()
}

// rain particles
function updateRainParticleParticles() {
  for (let i = 0; i < globals.rainParticles.length; i++) {
    updateRainParticleParticle(globals.rainParticles[i]);
  }
}

function updateRainParticleParticle(particle) {
  const type = particle.id;

  switch (type) {
    case ParticleID.RAIN_PARTICLES:
      updateRainParticleSparkle(particle);
      break;
  }
}

function updateRainParticleSparkle(particle) {
  // movimiento de partículas
  particle.yPos += (particle.vy ?? 60) * globals.deltaTime;
  particle.xPos += (particle.vx ?? 0) * globals.deltaTime;

  if (particle.xPos < -particle.width) {
    particle.xPos = globals.canvas.width + particle.width;
  } else if (particle.xPos > globals.canvas.width + particle.width) {
    particle.xPos = -particle.width;
  }

  // Si sale por abajo, reaparece arriba con X nueva
  if (particle.yPos > globals.canvas.height + particle.height) {
    particle.yPos = -particle.height - Math.random() * 40;
    particle.xPos = Math.random() * globals.canvas.width;
  }

  // brillo alpha
  const baseAlpha = particle.baseAlpha ?? particle.alpha ?? 0.6;
  const speed = particle.twinkleSpeed ?? 6;
  const phase = particle.twinklePhase ?? 0;
  particle.alpha = baseAlpha * (0.65 + 0.35 * Math.sin(phase + speed * globals.gameTime));

  particle.state = ParticleState.FADE;
}

function updateFxParticles() {
  for (let i = 0; i < globals.fxParticles.length; i++) {
    const p = globals.fxParticles[i];

    if (p.state === ParticleState.OFF) {
      globals.fxParticles.splice(i, 1);
      i--;
      continue;
    }

    updateFxParticle(p);
  }
}

function updateFxParticle(particle) {
  switch (particle.id) {
    case ParticleID.SKELETON_SPAWN_CLOUD:
    case ParticleID.ATTACK_DUST:
      updateSkeletonSpawnCloud(particle);
      break;
  }
}

function updateSkeletonSpawnCloud(particle) {
  particle.life += globals.deltaTime;

  if (particle.gravity) {
    particle.vy += particle.gravity * globals.deltaTime;
  }

  particle.xPos += (particle.vx ?? 0) * globals.deltaTime;
  particle.yPos += (particle.vy ?? 0) * globals.deltaTime;

  const t = Math.min(particle.life / particle.timeToLive, 1);
  particle.alpha = (particle.baseAlpha ?? particle.alpha ?? 0.3) * (1 - t);

  if (particle.life >= particle.timeToLive) {
    particle.state = ParticleState.OFF;
  }
}

function updatePendingSkeletonSpawn() {
  globals.pendingSkeletonSpawn.delay -= globals.deltaTime;

  if (globals.pendingSkeletonSpawn.delay <= 0) {
    const { x, y } = globals.pendingSkeletonSpawn;
    initSkeletonAt(x, y);
    globals.pendingSkeletonSpawn = null;
  }
}

function updateHudParticles() {
  for (let i = 0; i < globals.hudParticles.length; i++) {
    const p = globals.hudParticles[i];

    if (p.state === ParticleState.OFF) {
      globals.hudParticles.splice(i, 1);
      i--;
      continue;
    }

    switch (p.id) {
      case ParticleID.HAMMER_SPARK:
        updateHammerSpark(p);
        break;
    }
  }
}

function updateHammerSpark(particle) {
  particle.life += globals.deltaTime;

  // gravedad
  particle.vy += 240 * globals.deltaTime;

  particle.xPos += (particle.vx ?? 0) * globals.deltaTime;
  particle.yPos += (particle.vy ?? 0) * globals.deltaTime;

  const t = Math.min(particle.life / particle.timeToLive, 1);
  particle.alpha = (particle.baseAlpha ?? particle.alpha ?? 0.5) * (1 - t);

  if (particle.life >= particle.timeToLive) {
    particle.state = ParticleState.OFF;
  }
}

function updateLowLifeAura() {
  const player = globals.sprites[3];
  if (!player) return;

  const threshold = 30;

  if (globals.life < threshold) {
    ensureLowLifeAuraParticles();
    globals.lowLifeAuraEnabled = true;

    const cx = player.xPos + 32;
    const cy = player.yPos + 34;

    for (const p of globals.lowLifeAuraParticles) {
      p.angle += p.angularSpeed * globals.deltaTime;

      // posición orbital
      p.xPos = cx + Math.cos(p.angle) * p.orbitR;
      p.yPos = cy + Math.sin(p.angle) * (p.orbitR * 0.6);

      // oscilaciones del brillo
      const t = globals.gameTime * 5 + (p.twinklePhase ?? 0);
      // variaciones aleatorias de la bibración
      p.alpha = (p.baseAlpha ?? 0.4) * (0.55 + 0.45 * Math.sin(t));
    }
  } else {
    globals.lowLifeAuraEnabled = false;
  }
}

// estado NEW_GAME
function newGame() {
  if (globals.action.moveLeft) {
    globals.gameState = Game.SCORES;
  }
  if (globals.action.moveRight) {
    globals.gameState = Game.NEW_GAME;
  }
  if (globals.action.moveUp) {
    globals.gameState = Game.CONTROLS;
  }
  if (globals.action.moveDown) {
    globals.gameState = Game.NEW_GAME;
  }
  if (globals.action.enter) {
    globals.gameState = Game.PLAYING;
  }
}

// estado STORY
function story() {
  if (globals.action.moveLeft) {
    globals.gameState = Game.STORY;
  }
  if (globals.action.moveRight) {
    globals.gameState = Game.CONTROLS;
  }
  if (globals.action.moveUp) {
    globals.gameState = Game.STORY;
  }
  if (globals.action.moveDown) {
    globals.gameState = Game.SCORES;
  }
}

// estado CONTROLS
function controls() {
  if (globals.action.moveLeft || globals.action.moveLeftA) {
    globals.gameState = Game.STORY;
  }
  if (globals.action.moveRight || globals.action.moveRightD) {
    globals.gameState = Game.CONTROLS;
  }
  if (globals.action.moveUp || globals.action.moveUpW) {
    globals.gameState = Game.CONTROLS;
  }
  if (globals.action.moveDown || globals.action.moveDownS) {
    globals.gameState = Game.NEW_GAME;
  }
}

// estado SCORES
function scores() {
  if (globals.action.moveLeft) {
    globals.gameState = Game.SCORES;
  }
  if (globals.action.moveRight) {
    globals.gameState = Game.NEW_GAME;
  }
  if (globals.action.moveUp) {
    globals.gameState = Game.STORY;
  }
  if (globals.action.moveDown) {
    globals.gameState = Game.SCORES;
  }
}

// actualiza sprites
function updateSprites() {
  for (let i = 0; i < globals.sprites.length; i++) {
    const sprite = globals.sprites[i]
    updateSprite(sprite)
  }
}

// actualiza la vida por colision
function updateLife() {
  for (let i = 1; i < globals.sprites.length; i++) {
    const sprite = globals.sprites[i]

    // reducimos si hay colision
    if (sprite.isCollidingWithPlayer) {
      globals.life = globals.life - 10
    }
    if (globals.life <= 10) {

      switch (sprite.id) {
        case SpriteID.PLAYER:
          sprite.state = State.DEATH
          break;

        default:
          break;
      }
      deathTimer()
    }
  }
}

// determina el tiempo entre muerto y gameOver
function deathTimer() {
  // incrementamos el contador de cambio de valor
  globals.gameOverPlayer.timeChangeCounter += globals.deltaTime

  // si ha pasado el tiempo necesario, cambiamos el valor del timer
  if (globals.gameOverPlayer.timeChangeCounter > globals.gameOverPlayer.timeChangeValue) {
    globals.gameState = Game.OVER

    // restear timeChangecounter
    globals.gameOverPlayer.timeChangeCounter = 0
  }
}

// actualiza el esqueleto de NewGame
function updateSkeletonNewGame(sprite) {
  sprite = globals.sprites[4]
  updateSkeleton(sprite)
}

// actualiza cada tipo de sprite
function updateSprite(sprite) {
  const type = sprite.id

  switch (type) {
    // caso jugador
    case SpriteID.PLAYER:
      updatePlayer(sprite)
      break

    // caso esqueleto
    case SpriteID.SKELETON:
      updateSkeleton(sprite)
      break

    // caso forja
    case SpriteID.FORGE:
      updateForge(sprite)
      break

    // caso martillo
    case SpriteID.HAMMER:
      updateAnimationFrame(sprite)
      break

    // caso del enemigo
    default:
      break
  }
}

// actualiza gameTime
function updateGameTime() {
  globals.gameTime += globals.deltaTime
}

// actualiza la animación
function updateAnimationFrame(sprite) {
  switch (sprite.state) {
    case State.STILL_UP:
    case State.STILL_LEFT:
    case State.STILL_DOWN:
    case State.STILL_RIGHT:
      // resetea el frame para estados 'still'
      sprite.frames.frameCounter = 0;
      sprite.frames.frameChangeCounter = 0;
      break;


    // ************************* DEATH
    case State.DEATH:
      // cambiar al siguiente frame si es momento
      if (sprite.frames.frameChangeCounter === sprite.frames.speed) {
        sprite.frames.frameCounter++;
        sprite.frames.frameChangeCounter = 0;
      }
    // ************************* DEATH


    case State.ATTACK_LEFT:
    case State.ATTACK_RIGHT:
    case State.ATTACK_UP:
    case State.ATTACK_DOWN:
      // incrementar el contador de cambio de frame
      sprite.frames.frameChangeCounter++;

      // cambiar al siguiente frame si es momento
      if (sprite.frames.frameChangeCounter === sprite.frames.speed) {
        sprite.frames.frameCounter++;
        sprite.frames.frameChangeCounter = 0;
      }

      // si llega al ultimo frame de ataque, mantener el último frame still
      if (sprite.frames.frameCounter === sprite.frames.framesPerState) {

        sprite.state = sprite.state === State.ATTACK_LEFT ? State.STILL_LEFT :
          sprite.state === State.ATTACK_RIGHT ? State.STILL_RIGHT :
            sprite.state === State.ATTACK_UP ? State.STILL_UP :
              sprite.state === State.ATTACK_DOWN ? State.STILL_DOWN :
                sprite.state;
      }
      break;

    default:

      // Animaciones cíclicas para otros estados en movimiento
      sprite.frames.frameChangeCounter++;

      if (sprite.frames.frameChangeCounter === sprite.frames.speed) {
        sprite.frames.frameCounter++;
        sprite.frames.frameChangeCounter = 0;
      }

      // Si llegamos al final de los frames, reiniciar la animación
      if (sprite.frames.frameCounter === sprite.frames.framesPerState) {
        sprite.frames.frameCounter = 0;
      }
      break;
  }
}

// cambio de dirección
function swapDirection(sprite) {
  if (sprite.state === State.RIGHT) {
    sprite.state = State.LEFT;
  } else if (sprite.state === State.LEFT) {
    sprite.state = State.RIGHT;
  } else if (sprite.state === State.DOWN) {
    sprite.state = State.UP;
  } else if (sprite.state === State.UP) {
    sprite.state = State.DOWN;
  }
}

// colision con los bordes de la pantalla
function calculateCollisionWithborders(sprite) {

  let isCollision = false

  // colision con el borde de la pantalla
  if (sprite.xPos + sprite.imageSet.xSize > globals.canvas.width || sprite.yPos + sprite.imageSet.ySize > globals.canvas.height) {
    isCollision = true
  } else if (sprite.xPos < 0 || sprite.yPos < 50) {
    isCollision = true
  }
  return isCollision
}

// teclado y movimiento
function readKeyboardAndAssignState(sprite) {
  const attackJustPressed = globals.action.attack && !globals.prevAttack;

  // estados de ATAQUE 
  if (attackJustPressed && !globals.attackDisabled) {
    switch (sprite.state) {
      case State.LEFT:
      case State.STILL_LEFT:
        sprite.state = State.ATTACK_LEFT;
        // polvo al atacar
        createAttackDust(sprite.xPos + 32, sprite.yPos + 58);
        break;
      case State.RIGHT:
      case State.STILL_RIGHT:
        sprite.state = State.ATTACK_RIGHT;
        // polvo al atacar
        createAttackDust(sprite.xPos + 32, sprite.yPos + 58);
        break;
      case State.UP:
      case State.STILL_UP:
        sprite.state = State.ATTACK_UP;
        // polvo al atacar
        createAttackDust(sprite.xPos + 32, sprite.yPos + 58);
        break;
      case State.DOWN:
      case State.STILL_DOWN:
        sprite.state = State.ATTACK_DOWN;
        // polvo al atacar
        createAttackDust(sprite.xPos + 32, sprite.yPos + 58);
        break;
      default:
        globals.failHitCounter++;
        break;
    }

    return;
  }
  // estados de MOVIMIENTO
  if (globals.action.moveLeft && globals.action.moveUp) {
    sprite.state = State.UP_LEFT;
  } else if (globals.action.moveLeft && globals.action.moveDown) {
    sprite.state = State.DOWN_LEFT;
  } else if (globals.action.moveRight && globals.action.moveUp) {
    sprite.state = State.UP_RIGHT;
  } else if (globals.action.moveRight && globals.action.moveDown) {
    sprite.state = State.DOWN_RIGHT;
  }
  // Verificar movimientos individuales
  else if (globals.action.moveLeft) {
    sprite.state = State.LEFT;
  } else if (globals.action.moveRight) {
    sprite.state = State.RIGHT;
  } else if (globals.action.moveUp) {
    sprite.state = State.UP;
  } else if (globals.action.moveDown) {
    sprite.state = State.DOWN;
  }
  // estados de STILL
  else {
    switch (sprite.state) {
      case State.LEFT:
      case State.DOWN_LEFT:
      case State.UP_LEFT:
        sprite.state = State.STILL_LEFT;
        break;
      case State.RIGHT:
      case State.DOWN_RIGHT:
      case State.UP_RIGHT:
        sprite.state = State.STILL_RIGHT;
        break;
      case State.UP:
        sprite.state = State.STILL_UP;
        // console.log("Xpos UP" + sprite.xPos);
        // console.log("Ypos UP" + sprite.yPos);
        break;
      case State.DOWN:
        sprite.state = State.STILL_DOWN;
        // console.log("Xpos DOWN" + sprite.xPos);
        // console.log("Ypos DOWN" + sprite.yPos);
        break;
    }
  }
}

// set esqueleto
function skeletonTime() {
  // incrementar el tiempo del esqueleto
  globals.skeletonTime.timeChangeCounter += globals.deltaTime

  if (globals.skeletonTime.timeChangeCounter > globals.skeletonTime.timeChangeValue) {

    // no apilar spawns si ya hay uno en cola
    if (!globals.pendingSkeletonSpawn) {
      const pos = getRandomSkeletonSpawnPosition();
      createSkeletonSpawnCloud(pos.x + 32, pos.y + 48);
      globals.pendingSkeletonSpawn = { x: pos.x, y: pos.y, delay: 0.28 };
    }

    globals.skeletonTime.timeChangeCounter = 0
  }

  // ############### cada 30 seg divide el teimpo de aparicion entre 2???????????????
  if (globals.gameTime > 0 && globals.gameTime % 30 < globals.deltaTime) {
    globals.skeletonTime.timeChangeValue = Math.max(globals.skeletonTime.timeChangeValue / 2, 1)
    // console.log("TEST TIEMOI ESQUELETO" + globals.skeletonTime.timeChangeValue)
  }
}

// tiempo de loading
function loadingTime() {
  // incrementamos el contador de cambio de valor
  globals.loadingTime.timeChangeCounter += globals.deltaTime

  // si ha pasado el tiempo necesario, cambiamos el valor del timer
  if (globals.loadingTime.timeChangeCounter > globals.loadingTime.timeChangeValue) {

    globals.gameState = Game.NEW_GAME
    // restear timeChangecounter
    globals.loadingTime.timeChangeCounter = 0
  }
}

// tiempo para gameOver ||||| NO FUNCIONA |||||
function gameOverTime() {

  // incrementamos el contador de cambio de valor
  globals.gameOverTime.timeChangeCounter += globals.deltaTime

  // si ha pasado el tiempo necesario, cambiamos el valor del timer
  if (globals.gameOverTime.timeChangeCounter > globals.gameOverTime.timeChangeValue) {

    globals.gameState = Game.OVER
    console.log("gameover");
    // restear timeChangecounter
    globals.gameOverTime.timeChangeCounter = 0
  }
}

function reload() {
  // borramos la pantalla entera y UHD
  globals.ctx.clearRect(0, 0, globals.canvas.width, globals.canvas.height)
  globals.ctxUHD.clearRect(0, 0, globals.canvasUHD.width, globals.canvasUHD.height)

  // ireiniciar contadores
  globals.gameTime = 0
  // globals.deltaTime = 0
  globals.skeletonTime.timeChangeValue = globals.skeletonTime.initialTimeNewSkeleton
  globals.skeletonTime.timeChangeCounter = 0

  globals.spritesNewGame = []
  globals.sprites = []

  globals.fxParticles = [];
  globals.pendingSkeletonSpawn = null;

  globals.hudParticles = [];
  globals.prevHammerDamage = 0;

  globals.action = {
    moveLeft: false,
    moveRight: false,
    moveUp: false,
    moveDown: false,
    attack: false
  }

  // reiniciar score
  globals.score = 0
  // variable vida
  globals.life = 100;
  // martillo
  globals.hammerDamage = 0
  // golpes fallidos
  globals.failHitCounter = 0
  globals.prevAttack = false;

  globals.lowLifeAuraParticles = [];
  globals.lowLifeAuraEnabled = false;

  // iniciar los sprites
  initSprites()

  // inicialización del mapa del juego
  initLevel()
}

function gameOver() {
  // solo una vez al entrar en OVER
  if (!globals.didReloadInGameOver) {
    reload();
    globals.didReloadInGameOver = true;
  }
  globals.gameState = Game.NEW_GAME;

  // agestionar menu
  if (globals.action.moveLeft) {
    globals.gameState = Game.SCORES;
    globals.didReloadInGameOver = false;
  }

  if (globals.action.moveRight || globals.action.enter) {
    globals.gameState = Game.NEW_GAME;
    globals.didReloadInGameOver = false;
  }
}

// calculo deterioro martillo
function updateHammerDamage() {
  const prev = globals.prevHammerDamage ?? 0;

  globals.hammerDamage = globals.failHitCounter - globals.score / 3;
  if (globals.hammerDamage < 0) globals.hammerDamage = 0;

  // Si aumenta el daño, chisporroteo detrás del icono del martillo
  if (globals.hammerDamage > prev) {
    const delta = globals.hammerDamage - prev;

    // coordenadas de martillo
    const sparkX = 430 + 34;
    const sparkY = 0 + 40;

    createHammerSparks(sparkX, sparkY, Math.min(delta / 8, 1.5));
    // console.log(globals.failHitCounter)
  }

  globals.prevHammerDamage = globals.hammerDamage;
}