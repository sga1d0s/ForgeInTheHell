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

    default:
      console.error("Error: Game State invalid")
  }
}

function updateJoker(sprite) {
  // actualizar el estado de las variables del pirata
  sprite.xPos = 55
  sprite.yPos = 7

  sprite.state = State.STILL

  sprite.frames.frameCounter = 0
}

function updatePirate(sprite) {
  // actualizar el estado de las variables del pirata
  sprite.xPos = 125
  sprite.yPos = 113

  sprite.state = State.LEFT_2

  sprite.frames.frameCounter = 3
}

function updatePlayer(sprite) {
  // actualizar el estado de las variables del pirata
  sprite.xPos = 100
  sprite.yPos = 200

  sprite.state = State.RIGHT

  sprite.frames.frameCounter = 1
}

function playGame() {
  // updateSprites()
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

    // caso pirata
    case SpriteID.PIRATE:
      updatePirate(sprite)
      break

    // caso pirata
    case SpriteID.JOKER:
      updateJoker(sprite)
      break

    // caso del enemigo
    default:
      break
  }
}

