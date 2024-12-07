import globals from "./globals.js"
import { Game, Tile } from "./constants.js"

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

  // dibujamos el UHD
  renderUHD()

  // dibujamos el martillo
  renderHammer(25)
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
  const life = 40
  const time = 3000

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
  globals.ctxUHD.fillStyle = 'lightblue'
  globals.ctxUHD.fillText("LIFE", 168, 8)
  globals.ctxUHD.fillStyle = 'lightgray'
  globals.ctxUHD.fillRect(168, 9, life, 8)

  // round corners. (Remove 1 pixel per corner)
  globals.ctxUHD.fillStyle = 'black'
  globals.ctxUHD.fillRect(168, 9, 1, 2)
  globals.ctxUHD.fillRect(168, 15, 1, 2)
  globals.ctxUHD.fillRect(168 + life - 1, 9, 1, 2)
  globals.ctxUHD.fillRect(168 + life - 1, 15, 1, 2)

  // draw time
  globals.ctxUHD.fillStyle = 'lightblue'
  globals.ctxUHD.fillText("TIME", 224, 8)
  globals.ctxUHD.fillStyle = 'lightgray'
  globals.ctxUHD.fillText(time, 224, 16)
}

function renderHammer(value) {
  const spriteSheet = new Image();
  spriteSheet.src = './images/spritesheet.png';

  // calcula el valor a restar de vida del marrtillo
  let x = 64 * value / 100

  // Dibuja el sprite en (sprite, sx, sy, sWidth, sHeight, displayX, displayY, displayWidth, displayHeight)
  globals.ctxHammer.drawImage(spriteSheet, -2, 1359, 68, 68, 0, 0, 64, 64);

  // Dibuja el segundo sprite (siguiente en el eje X) en (120, 50)
  globals.ctxHammer.drawImage(spriteSheet, 68, 1359, 68, 68, 0 + x / 2, 0, 64 - x, 64);
}