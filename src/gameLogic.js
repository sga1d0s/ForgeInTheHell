import globals from "./globals.js"
import { Game, SpriteID, State, StrikeBox, FPS, } from "./constants.js"
import detectCollisions from "./collisions.js"
import { gameOverTime, initSkeleton } from "./initialize.js"

export default function update() {

  // change what the game is doing based on the game state
  switch (globals.gameState) {
    case Game.LOADING:
      console.log("Loading assets...")
      setTimeout(() => {
        globals.gameState = Game.NEW_GAME
      }, 1000);
      break

    case Game.PLAYING:
      if (!globals.skeletonSpawnInterval) {
        // Inicia un intervalo cada 10 segundos solo si no existe ya uno
        globals.skeletonSpawnInterval = setInterval(initSkeleton, 10000);
      }
      playGame()
      break

    case Game.OVER:
      // Detiene el intervalo cuando el juego termina
  if (globals.skeletonSpawnInterval) {
    clearInterval(globals.skeletonSpawnInterval);
    globals.skeletonSpawnInterval = null; // Reseteamos para permitir reiniciar el juego sin problemas
  }
      break

    case Game.NEW_GAME:
      // teclado en NEW GAME
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
      break

    case Game.STORY:
      // teclado en STORY
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
      break

    case Game.CONTROLS:
      // 
      if (globals.action.moveLeft) {
        globals.gameState = Game.STORY;
      }
      if (globals.action.moveRight) {
        globals.gameState = Game.CONTROLS;
      }
      if (globals.action.moveUp) {
        globals.gameState = Game.CONTROLS;
      }
      if (globals.action.moveDown) {
        globals.gameState = Game.NEW_GAME;
      }
      break

    case Game.SCORES:
      // teclado en SCORES
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
      break

    default:
      console.error("Error: Game State invalid")
  }
}

function updateForge(sprite) {
  // actualizar sprite para la animación
  updateAnimationFrame(sprite)
}

function updateSkeleton(sprite) {
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
    case State.DEATH:
      sprite.physics.vx = 0
      sprite.physics.vx = 0
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

function playGame() {
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
      globals.life--
    }
    if (globals.life === 0) {
      globals.gameState = Game.OVER
    }
  }
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
  if (globals.action.attack) {
    // Determinar el estado de ataque basado en la dirección actual
    sprite.state = sprite.state === State.LEFT || sprite.state === State.STILL_LEFT ? State.ATTACK_LEFT :
      sprite.state === State.RIGHT || sprite.state === State.STILL_RIGHT ? State.ATTACK_RIGHT :
        sprite.state === State.UP || sprite.state === State.STILL_UP ? State.ATTACK_UP :
          sprite.state === State.DOWN || sprite.state === State.STILL_DOWN ? State.ATTACK_DOWN :
            sprite.state
  } else if (globals.action.moveLeft) {
    sprite.state = State.LEFT;
  } else if (globals.action.moveRight) {
    sprite.state = State.RIGHT;
  } else if (globals.action.moveUp) {
    sprite.state = State.UP;
  } else if (globals.action.moveDown) {
    sprite.state = State.DOWN;
  } else {
    sprite.state = sprite.state === State.LEFT ? State.STILL_LEFT :
      sprite.state === State.RIGHT ? State.STILL_RIGHT :
        sprite.state === State.UP ? State.STILL_UP :
          sprite.state === State.DOWN ? State.STILL_DOWN :
            sprite.state;
  }
}

function reload() {
  // borramos la pantalla entera y UHD
  globals.ctx.clearRect(0, 0, globals.canvas.width, globals.canvas.height)
  globals.ctxUHD.clearRect(0, 0, globals.canvasUHD.width, globals.canvasUHD.height)

  // inicializar las variables de gestión de tiempo
  globals.previousCycleMilliseconds = 0
  globals.deltaTime = 0
  globals.frameTimeObj = 1 / FPS // frame time in seconds

  // iniciamos el contador
  globals.gameTime = 0

  // reiniciar variables de juego
  globals.life = 100
  globals.score = 0
}