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
  // actualizar el estado de las variables del pirata
  sprite.xPos = 50
  sprite.yPos = -10

  sprite.state = State.STILL

  sprite.frames.frameCounter = 0
}

/* function updateSkeleton(sprite) {
  // actualizar el estado de las variables del pirata
  sprite.xPos = 300
  sprite.yPos = 150

  sprite.state = State.LEFT

  sprite.frames.frameCounter = 4
} */


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
}

function updatePlayer(sprite) {
  // actualizar el estado de las variables del pirata
  sprite.xPos = 100
  sprite.yPos = 200

  sprite.state = State.RIGHT

  sprite.frames.frameCounter = 4
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



function updateAnimationFrame(sprite) {
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
}