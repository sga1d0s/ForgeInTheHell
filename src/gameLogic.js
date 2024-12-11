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
      // console.log("Over logic");
      break

    case Game.MAIN:
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

function updateSkeleton(sprite) {
  // actualizar el estado de las variables del pirata
  sprite.xPos = 300
  sprite.yPos = 150

  sprite.state = State.LEFT

  sprite.frames.frameCounter = 4
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

