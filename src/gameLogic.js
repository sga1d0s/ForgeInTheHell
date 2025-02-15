import globals from "./globals.js"
import { Game, SpriteID, State, StrikeBox } from "./constants.js"
import detectCollisions from "./collisions.js"
import { initSkeleton, initSprites, initLevel } from "./initialize.js"

export default function update() {

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
      gameOver()
      break

    default:
      console.error("Error: Game State invalid")
  }
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
  // Leer teclado y asignar estado
  readKeyboardAndAssignState(sprite);

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
  // actualiza sprite
  updateSprites()

  // colisiones
  detectCollisions()

  // actualizar tiempo del juego
  updateGameTime()

  // actualizar vida
  updateLife()

  // TEST: tiempo limitado para la prueba
  gameOverTime()
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
      globals.gameState = Game.OVER
    }
  }
}

function updateSkeletonNewGame(sprite){
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
  // estados de ATAQUE
  if (globals.action.attack) {
    switch (sprite.state) {
      case State.LEFT:
      case State.STILL_LEFT:
        sprite.state = State.ATTACK_LEFT;
        break;
      case State.RIGHT:
      case State.STILL_RIGHT:
        sprite.state = State.ATTACK_RIGHT;
        break;
      case State.UP:
      case State.STILL_UP:
        sprite.state = State.ATTACK_UP;
        break;
      case State.DOWN:
      case State.STILL_DOWN:
        sprite.state = State.ATTACK_DOWN;
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
        break;
      case State.DOWN:
        sprite.state = State.STILL_DOWN;
        break;
    }
  }
}

// set esqueleto
function skeletonTime() {
  // incrementamos el contador de cambio de valor
  globals.skeletonTime.timeChangeCounter += globals.deltaTime

  // si ha pasado el tiempo necesario, cambiamos el valor del timer
  if (globals.skeletonTime.timeChangeCounter > globals.skeletonTime.timeChangeValue) {

    initSkeleton()
    // restear timeChangecounter
    globals.skeletonTime.timeChangeCounter = 0
  }
}

// tiempo de loading
function loadingTime() {
  // incrementamos el contador de cambio de valor
  globals.loadingTime.timeChangeCounter += globals.deltaTime

  // si ha pasado el tiempo necesario, cambiamos el valor del timer
  if (globals.loadingTime.timeChangeCounter > globals.loadingTime.timeChangeValue) {

    globals.gameState = Game.NEW_GAME
    console.log("loading time");
    // restear timeChangecounter
    globals.loadingTime.timeChangeCounter = 0
  }
}

// tiempo para gameOver
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

  // iniciamos el contador
  globals.gameTime = 0
  globals.deltaTime = 0

  globals.spritesNewGame = []
  globals.sprites = []

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

  // iniciar los sprites
  initSprites()

  // inicialización del mapa del juego
  initLevel()
}

function gameOver() {
  if (globals.action.moveLeft) {
    globals.gameState = Game.SCORES;
  }
  if (globals.action.moveRight) {
    if (globals.action.enter) {
      globals.gameState = Game.NEW_GAME
    }
  }

  reload()
}
