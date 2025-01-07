import globals from "./globals.js"
import { Game, SpriteID, State } from "./constants.js"

export default function update() {
  // change what the game is doing based on the game state
  switch (globals.gameState) {

    case Game.LOADING:
      console.log("Loading assets...")
      break

    case Game.PLAYING:
      playGame()
      break

    case Game.OVER:
      // 
      break

    case Game.NEW_GAME:
      //
      break

    case Game.STORY:
      //
      break

    case Game.CONTROLS:
      //
      break

    case Game.SCORES:
      //
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
    case State.RIGHT:
      sprite.physics.vx = sprite.physics.vLimit
      break

    case State.LEFT:
      sprite.physics.vx = -sprite.physics.vLimit
      break

    default:
      console.log("ERROR: State invalid");
      break;
  }

  // calcular la distancia que se mueve
  sprite.xPos += sprite.physics.vx * globals.deltaTime

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
  // leer teclado
  readKeyboardAndAssignState(sprite)

  switch (sprite.state) {
    case State.UP:
      sprite.physics.vx = 0
      sprite.physics.vy = -sprite.physics.vLimit
      break
    case State.DOWN:
      sprite.physics.vx = 0
      sprite.physics.vy = sprite.physics.vLimit
      break
    case State.RIGHT:
      sprite.physics.vx = sprite.physics.vLimit
      sprite.physics.vy = 0
      break
    case State.LEFT:
      sprite.physics.vx = -sprite.physics.vLimit
      sprite.physics.vy = 0
      break
    case State.UP_LEFT:
      sprite.physics.vx = -sprite.physics.vLimit / Math.SQRT2
      sprite.physics.vy = -sprite.physics.vLimit / Math.SQRT2
      break
    case State.UP_RIGHT:
      sprite.physics.vx = sprite.physics.vLimit / Math.SQRT2
      sprite.physics.vy = -sprite.physics.vLimit / Math.SQRT2
      break
    case State.DOWN_LEFT:
      sprite.physics.vx = -sprite.physics.vLimit / Math.SQRT2
      sprite.physics.vy = sprite.physics.vLimit / Math.SQRT2
      break
    case State.DOWN_RIGHT:
      sprite.physics.vx = sprite.physics.vLimit / Math.SQRT2
      sprite.physics.vy = sprite.physics.vLimit / Math.SQRT2
      break
    default:
      sprite.physics.vx = 0
      sprite.physics.vy = 0
      break;
  }

  // calcular la distancia
  sprite.xPos += sprite.physics.vx * globals.deltaTime
  sprite.yPos += sprite.physics.vy * globals.deltaTime

  // actualizar animación
  updateAnimationFrame(sprite)
}

function playGame() {
  updateSprites()
  updateGameTime()
}

function updateSprites() {
  for (let i = 0; i < globals.sprites.length; i++) {
    const sprite = globals.sprites[i]
    updateSprite(sprite)
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
      sprite.frames.frameCounter = 0
      sprite.frames.frameChangeCounter = 0
      break;

    default:
      // aumentar el contador de tiempo entre frames
      sprite.frames.frameChangeCounter++

      // si hemos llegado al maximo de frames reiniciamos el contador (animación cíclica)
      if (sprite.frames.frameChangeCounter === sprite.frames.speed) {
        // cambiar de frame y reseseamos el contador de cambio de frame
        sprite.frames.frameCounter++
        sprite.frames.frameChangeCounter = 0
      }

      // si hemos llegado al máximo de frames reiniciamos el contador
      if (sprite.frames.frameCounter === sprite.frames.framesPerState) {
        sprite.frames.frameCounter = 0
      }
      break;
  }
}

// cambio de dirección
function swapDirection(sprite) {
  sprite.state = sprite.state === State.RIGHT ? State.LEFT : State.RIGHT
}

// colision con los bordes de la pantalla
function calculateCollisionWithborders(sprite) {

  let isCollision = false

  // colision con el borde de la pantalla
  if (sprite.xPos + sprite.imageSet.xSize > globals.canvas.width) {
    isCollision = true
  } else if (sprite.xPos < 0) {
    isCollision = true
  }
  return isCollision
}

// teclado y movimiento
function readKeyboardAndAssignState(sprite) {
  if (globals.action.moveLeft && globals.action.moveUp) {
    sprite.state = State.UP_LEFT
  } else if (globals.action.moveLeft && globals.action.moveDown) {
    sprite.state = State.DOWN_LEFT
  } else if (globals.action.moveRight && globals.action.moveUp) {
    sprite.state = State.UP_RIGHT
  } else if (globals.action.moveRight && globals.action.moveDown) {
    sprite.state = State.DOWN_RIGHT
  } else if (globals.action.moveLeft) {
    sprite.state = State.LEFT
  } else if (globals.action.moveRight) {
    sprite.state = State.RIGHT
  } else if (globals.action.moveUp) {
    sprite.state = State.UP
  } else if (globals.action.moveDown) {
    sprite.state = State.DOWN
  } else {
    sprite.state = sprite.state === State.LEFT ? State.STILL_LEFT :
      sprite.state === State.RIGHT ? State.STILL_RIGHT :
        sprite.state === State.UP ? State.STILL_UP :
          sprite.state === State.DOWN ? State.STILL_DOWN :
            sprite.state === State.DOWN_LEFT ? State.STILL_LEFT :
              sprite.state === State.DOWN_RIGHT ? State.STILL_RIGHT :
                sprite.state === State.UP_LEFT ? State.STILL_LEFT :
                  sprite.state === State.UP_RIGHT ? State.STILL_RIGHT :
                    sprite.state
  }
}