import globals from "./globals.js"
import { Game, GameText, Tile } from "./constants.js"

// funcion que renderiza los graficos
export default function render() {

  // change what the game is doing based on the game state
  switch (globals.gameState) {

    case Game.LOADING:
      // draw loading spinner
      break

    case Game.PLAYING:
      drawGame()
      break

    case Game.OVER:
      drawGameOver()
      break

    case Game.MAIN:
      drawNewGame()
      break

    case Game.STORY:
      drawStory()
      break

    case Game.CONTROLS:
      drawStory()
      breakﬂ

    default:
      console.error("Error: Game State invalid")
  }
}

function drawGame() {
  // borramos la pantalla entera y UHD
  globals.ctx.clearRect(0, 0, globals.canvas.width, globals.canvas.height)
  globals.ctxUHD.clearRect(0, 0, globals.canvasUHD.width, globals.canvasUHD.height)
  globals.ctxHammer.clearRect(0, 0, globals.canvasHammer.width, globals.canvasHammer.height)

  // dibujar el mapa (nivel)
  renderMap()

  // dibujar los elementos
  drawSprites()

  // dibujar el UHD
  renderUHD()

  // dibujar el martillo pasandole el valor de gastado
  renderHammer(0)
}

// función que dibuja el mapa
function renderMap() {
  const brickSize = globals.level.imageSet.gridSize
  const levelData = globals.level.data

  // dibujamos el mapa
  const num_fil = levelData.length
  const num_col = levelData[0].length

  for (let i = 0; i < num_fil; i++) {
    for (let j = 0; j < num_col; j++) {
      const xTile = (levelData[i][j] - 1) * brickSize
      const ytile = 0
      const xPos = j * brickSize
      const yPos = i * brickSize

      // dibujar el nuevo fotograma del sprite en la posicion adecuada
      globals.ctx.drawImage(
        globals.tileSets[Tile.SIZE_32],
        xTile, ytile,
        brickSize, brickSize,
        xPos, yPos,
        brickSize, brickSize
      )
    }
  }
}

function renderSprite(sprite) {

  // calcular la posicion del tile de inicio
  const xPosInit = sprite.imageSet.initCol * sprite.imageSet.gridSize
  const yPosInit = sprite.imageSet.initFil * sprite.imageSet.gridSize

  // calcular la posición en el tile a dibujar
  const xTile = xPosInit + sprite.frames.frameCounter * sprite.imageSet.gridSize + sprite.imageSet.xOffset
  const yTile = yPosInit + sprite.state * sprite.imageSet.gridSize + sprite.imageSet.yOffset

  const xPos = Math.floor(sprite.xPos)
  const yPos = Math.floor(sprite.yPos)

  // dibujar el nuevo fotograma del sprite en la posiciónadecuada
  globals.ctx.drawImage(
    globals.tileSets[Tile.SIZE_64],
    xTile, yTile,
    sprite.imageSet.xSize, sprite.imageSet.ySize,
    xPos, yPos,
    sprite.imageSet.xSize, sprite.imageSet.ySize,
  )

}

// dibujar los sprites
function drawSprites() {
  for (let i = 0; i < globals.sprites.length; ++i) {
    const sprite = globals.sprites[i];

    // TEST: dibuja un rectangulo verde alrededor del sprite
    // drawSpriteRectangle(sprite)

    renderSprite(sprite)
  }
}

// funcion para dibujar un rectangulo y así ajustar el sprite
function drawSpriteRectangle(sprite) {
  // datos del sprite
  const x1 = Math.floor(sprite.xPos)
  const y1 = Math.floor(sprite.yPos)
  const w1 = sprite.imageSet.xSize
  const h1 = sprite.imageSet.ySize

  // dibujo en verde
  globals.ctx.fillStyle = "green"
  globals.ctx.fillRect(x1, y1, w1, h1)
}

// funcion para dibujar los elementos del UHD
function renderUHD() {
  // TEST: datos hardcodeados
  const score = 1500
  const highScore = 130000
  const life = 10
  const time = 3000

  let alpha = life / 100

  // draw score
  globals.ctxUHD.font = '8px emulogic'
  globals.ctxUHD.fillStyle = 'lightblue'
  globals.ctxUHD.fillText("SCORE", 8, 8)
  globals.ctxUHD.fillStyle = 'lightgray'
  globals.ctxUHD.fillText(" " + score, 8, 16)

  // draw HIGH score
  globals.ctxUHD.fillStyle = 'lightblue'
  globals.ctxUHD.fillText("HIGH SCORE", 72, 8)
  globals.ctxUHD.fillStyle = 'lightgray'
  globals.ctxUHD.fillText(" " + highScore, 72, 16)

  // draw life
  globals.ctxUHD.font = '15px emulogic'
  globals.ctxUHD.fillStyle = 'red'
  globals.ctxUHD.fillText("LIFE", 158, 15.5)
  globals.ctxUHD.font = '15px emulogic'

  // save context state
  globals.ctxUHD.save()

  // modify bright with alpha value
  globals.ctxUHD.globalAlpha = alpha;
  globals.ctxUHD.fillStyle = 'blue'
  globals.ctxUHD.fillText("LIFE", 158, 15.5)

  // restore bright, restore context state
  globals.ctxUHD.restore()

  // draw time
  globals.ctxUHD.font = '8px emulogic'
  globals.ctxUHD.fillStyle = 'lightblue'
  globals.ctxUHD.fillText("TIME", 224, 8)
  globals.ctxUHD.fillStyle = 'lightgray'
  globals.ctxUHD.fillText(time, 224, 16)
}

// draw hammer
/* function renderHammer(value) {
  const spriteSheet = new Image();
  spriteSheet.src = globals.assetsToLoad[0].src

  // calcula el valor a restar de vida del martillo
  let x = 64 * value / 100

  // Dibuja el sprite en (sprite, sx, sy, sWidth, sHeight, displayX, displayY, displayWidth, displayHeight)
  globals.ctxHammer.drawImage(spriteSheet, -2, 1359, 68, 68, 0, 0, 64, 64);

  // Dibuja el segundo sprite (siguiente en el eje X) en (120, 50)
  globals.ctxHammer.drawImage(spriteSheet, 68, 1359, 68, 68, 0 + x / 2, 0, 64 - x, 64);
}
 */

function drawGameOver() {

  // globals
  let ctx = globals.ctx
  let uhd = globals.ctxUHD
  // let hammer = globals.ctxHammer

  const time = 30

  // variable del texto
  let text = GameText.GAME_OVER

  // CTX 
  ctx.fillStyle = "black"
  // ctx.fillRect(x, y, width, height);
  ctx.fillRect(0, 0, 512, 384)

  // main text
  ctx.font = '40px emulogic'
  ctx.fillStyle = 'lightblue'
  ctx.fillText(text, 80, 215)

  // UP LEFT
  ctx.fillStyle = "blue"
  ctx.fillRect(0, 0, 64, 64)

  // text up left
  ctx.font = '22px emulogic'
  ctx.fillStyle = 'red'
  ctx.fillText("STORY", 5, 40)

  // UP RIGHT
  ctx.fillStyle = "red"
  ctx.fillRect(448, 0, 64, 64)

  // text up right
  ctx.font = '22px emulogic'
  ctx.fillStyle = 'blue'
  // context.fillText(text, x, y [, maxWidth])
  ctx.fillText("CONTROLS", 325, 40)

  // DOWN LEFT
  ctx.fillStyle = "red"
  ctx.fillRect(0, 320, 64, 64)

  // print down left
  ctx.font = '22px emulogic'
  ctx.fillStyle = 'blue'
  // context.fillText(text, x, y [, maxWidth])
  ctx.fillText("SCORES", 5, 360)

  // DOWN CENTRE
  uhd.fillStyle = "black"
  uhd.fillRect(0, 0, 512, 64)
  // text down centre
  uhd.font = '16px emulogic'
  uhd.fillStyle = 'lightblue'
  uhd.fillText("NEW GAME IN " + time + " seg", 100, 40)

  // DOWN RIGHT
  ctx.fillStyle = "blue"
  ctx.fillRect(448, 320, 64, 64)

  // print down right
  ctx.font = '22px emulogic'
  ctx.fillStyle = 'red'
  // context.fillText(text, x, y [, maxWidth])
  ctx.fillText("NEW GAME", 320, 360)
  // ctx.fillText("GAME", 400, 370)
}

function drawNewGame() {

  // globals
  let ctx = globals.ctx
  let uhd = globals.ctxUHD

  const time = 30

  // variable del texto
  let text = GameText.GAME_NAME

  // CTX 
  ctx.fillStyle = "black"
  // ctx.fillRect(x, y, width, height);
  ctx.fillRect(0, 0, 512, 384)

  // main text
  ctx.font = '30px emulogic'
  ctx.fillStyle = 'lightblue'
  ctx.fillText(text, 50, 215, 400)

  // UP LEFT
  ctx.fillStyle = "blue"
  ctx.fillRect(0, 0, 64, 64)

  // text up left
  ctx.font = '22px emulogic'
  ctx.fillStyle = 'red'
  ctx.fillText("STORY", 5, 40)

  // UP RIGHT
  ctx.fillStyle = "red"
  ctx.fillRect(448, 0, 64, 64)

  // text up right
  ctx.font = '22px emulogic'
  ctx.fillStyle = 'blue'
  // context.fillText(text, x, y [, maxWidth])
  ctx.fillText("CONTROLS", 325, 40)

  // DOWN LEFT
  ctx.fillStyle = "red"
  ctx.fillRect(0, 320, 64, 64)

  // print down left
  ctx.font = '22px emulogic'
  ctx.fillStyle = 'blue'
  // context.fillText(text, x, y [, maxWidth])
  ctx.fillText("SCORES", 5, 360)

  // DOWN CENTRE
  // uhd.fillStyle = "blue"
  // uhd.fillRect(258, 0, 10, 50)
  // uhd.font = '8px emulogic'
  // uhd.fillStyle = 'red'
  // uhd.fillText("NEW GAME", 258, 12)

  // DOWN RIGHT
  ctx.fillStyle = "blue"
  ctx.fillRect(448, 320, 64, 64)

  // print down right
  ctx.font = '22px emulogic'
  ctx.fillStyle = 'red'
  // context.fillText(text, x, y [, maxWidth])
  ctx.fillText("NEW GAME", 320, 360)
  // ctx.fillText("GAME", 400, 370)

}

function drawStory() {

  // globals
  let ctx = globals.ctx
  let uhd = globals.ctxUHD

  const time = 30

  // CTX 
  ctx.fillStyle = "black"
  // ctx.fillRect(x, y, width, height);
  ctx.fillRect(0, 0, 512, 384)

  // main text
  let text = ""
  let lineHeight = 20
  let startX = 30
  let startY = 120

  ctx.font = '10px emulogic'
  ctx.fillStyle = 'lightblue'
  // recorrer el array corigiendo la posición por línea
  for (let i = 0; i < GameText.GAME_STORY.length; i++) {
    ctx.fillText(GameText.GAME_STORY[i], startX, startY + i * lineHeight, 450)
  }

  // UP LEFT
  ctx.fillStyle = "blue"
  ctx.fillRect(0, 0, 64, 64)

  // text up left
  ctx.font = '22px emulogic'
  ctx.fillStyle = 'red'
  ctx.fillText("STORY", 5, 40)

  // UP RIGHT
  ctx.fillStyle = "red"
  ctx.fillRect(448, 0, 64, 64)

  // text up right
  ctx.font = '22px emulogic'
  ctx.fillStyle = 'blue'
  // context.fillText(text, x, y [, maxWidth])
  ctx.fillText("CONTROLS", 325, 40)

  // DOWN LEFT
  ctx.fillStyle = "red"
  ctx.fillRect(0, 320, 64, 64)

  // print down left
  ctx.font = '22px emulogic'
  ctx.fillStyle = 'blue'
  // context.fillText(text, x, y [, maxWidth])
  ctx.fillText("SCORES", 5, 360)

  // DOWN CENTRE
  // uhd.fillStyle = "blue"
  // uhd.fillRect(258, 0, 10, 50)
  // uhd.font = '8px emulogic'
  // uhd.fillStyle = 'red'
  // uhd.fillText("NEW GAME", 258, 12)

  // DOWN RIGHT
  ctx.fillStyle = "blue"
  ctx.fillRect(448, 320, 64, 64)

  // print down right
  ctx.font = '22px emulogic'
  ctx.fillStyle = 'red'
  // context.fillText(text, x, y [, maxWidth])
  ctx.fillText("NEW GAME", 320, 360)
  // ctx.fillText("GAME", 400, 370)

}