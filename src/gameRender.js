import globals from "./globals.js"
import { Game, GameText, Tile, } from "./constants.js"
import { initProcessText } from "./initialize.js"

// funcion que renderiza los graficos
export default function render() {
  // change what the game is doing based on the game state
  switch (globals.gameState) {

    case Game.LOADING:
      // TODO ***** 
      drawSpinner()
      initProcessText()
      break

    case Game.PLAYING:
      drawGame()
      break

    case Game.OVER:
      drawGameOver()
      break

    case Game.NEW_GAME:
      drawNewGame()
      break

    case Game.STORY:
      drawStory()
      break

    case Game.CONTROLS:
      drawControls()
      break

    case Game.SCORES:
      drawScores()
      break

    default:
      console.error("Error: Game State invalid")
  }
}

// dibujar atajos de teclado
function keyboardShortcuts() {
  let uhd = globals.ctxUHD

  // DOWN CENTRE
  uhd.fillStyle = "black"
  uhd.fillRect(5, 10, 502, 30)
  uhd.font = '10px emulogic'
  uhd.fillStyle = 'white'
  uhd.fillText(GameText.SHORTCUTS, 10, 35, 480)
}

function drawGame() {
  // borramos la pantalla entera y UHD
  globals.ctx.clearRect(0, 0, globals.canvas.width, globals.canvas.height)
  globals.ctxUHD.clearRect(0, 0, globals.canvasUHD.width, globals.canvasUHD.height)

  // dibujar el mapa (nivel)
  renderMap()

  // dibujar los elementos
  drawSprites()

  // dibujar el UHD
  renderUHD()

  // dibujar el martillo pasandole el valor de gastado
  renderHammer()
}

// dibujar el mapa
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

// dibujar sprites
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

function drawSpritesNewGame() {
  const sprite = globals.sprites[4];
  renderSprite(sprite)
}

// mapear sprites
function drawSprites() {
  for (let i = 0; i < globals.sprites.length; ++i) {
    const sprite = globals.sprites[i];
    // TEST: dibuja un rectangulo verde alrededor del sprite
    // drawSpriteRectangle(sprite)

    renderSprite(sprite)

    // TEST: dibuja el hitbox
    // drawHitBox(sprite)

    // TEST: dibuja el hitbox del hacha
    // drawStrikeBox(sprite)
  }
}

// dibujar el cuadrado rojo del hitbox
function drawHitBox(sprite) {
  // datos del sprite
  const x1 = Math.floor(sprite.xPos) + Math.floor(sprite.hitBox.xOffset);
  const y1 = Math.floor(sprite.yPos) + Math.floor(sprite.hitBox.yOffset);
  const w1 = sprite.hitBox.xSize;
  const h1 = sprite.hitBox.ySize;

  globals.ctx.strokeStyle = "red";
  globals.ctx.strokeRect(x1, y1, w1, h1);
}

// dibujar el cuadrado rojo del hitbox
function drawStrikeBox(sprite) {
  // datos del sprite
  const x1 = Math.floor(sprite.xPos) + Math.floor(sprite.strikeBox.xOffset);
  const y1 = Math.floor(sprite.yPos) + Math.floor(sprite.strikeBox.yOffset);
  const w1 = sprite.strikeBox.xSize;
  const h1 = sprite.strikeBox.ySize;

  globals.ctx.strokeStyle = "blue";
  globals.ctx.strokeRect(x1, y1, w1, h1);
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
  const score = globals.score
  const highScore = 130000
  const life = globals.life
  const time = 180 - Math.floor(globals.gameTime / 2)

  const gridY = 26
  const gridY2 = gridY + 25

  const gridXScore = 10
  const gridXHighScore = gridXScore + 90
  const gridXTime = gridXHighScore + 250

  let alpha = life / 100

  // draw score
  globals.ctxUHD.font = '15px emulogic'
  globals.ctxUHD.fillStyle = 'lightblue'
  globals.ctxUHD.fillText("SCORE", gridXScore, gridY)
  globals.ctxUHD.fillStyle = 'lightgray'
  globals.ctxUHD.fillText(score, gridXScore, gridY2)

  // draw HIGH score
  globals.ctxUHD.fillStyle = 'lightblue'
  globals.ctxUHD.fillText("HIGH SCORE", gridXHighScore, gridY, 130)
  globals.ctxUHD.fillStyle = 'lightgray'
  globals.ctxUHD.fillText(highScore, gridXHighScore, gridY2)

  // draw life
  globals.ctxUHD.font = '45px emulogic'
  globals.ctxUHD.fillStyle = 'red'
  globals.ctxUHD.fillText("LIFE", 240, gridY2, 100)

  // save context state
  globals.ctxUHD.save()

  // modify bright with alpha value
  globals.ctxUHD.globalAlpha = alpha;
  globals.ctxUHD.fillStyle = 'blue'
  globals.ctxUHD.fillText("LIFE", 240, gridY2, 100)

  // restore bright, restore context state
  globals.ctxUHD.restore()

  // draw time
  globals.ctxUHD.font = '15px emulogic'
  globals.ctxUHD.fillStyle = 'lightblue'
  globals.ctxUHD.fillText("TIME", gridXTime, gridY)
  globals.ctxUHD.fillStyle = 'lightgray'
  globals.ctxUHD.fillText(time, gridXTime, gridY2)
}

// draw hammer
function renderHammer() {
  const spriteSheet = new Image();
  spriteSheet.src = globals.assetsToLoad[0].src

  // calcula el valor a restar de vida del martillo
  let x = 64 * globals.hammerDamage / 100

  // Dibuja el sprite en (sprite, sx, sy, sWidth, sHeight, displayX, displayY, displayWidth, displayHeight)
  globals.ctxUHD.drawImage(spriteSheet, 2, 3920, 68, 68, 430, 0, 68, 64);

  // Dibuja el segundo sprite (siguiente en el eje X) en (120, 50)
  globals.ctxUHD.drawImage(
    /* sprite */ spriteSheet, 
    /* sx */ 70, 
    /* sy */ 3920, 
    /* sWidth */ 90, 
    /* sHeight */ 68, 
    /* displayX */ 439 + x / 2, 
    /* displayY */ 0, 
    /* displayWidth */ 64 - x, 
    /* displayHeight */ 64);
}

function drawGameOver() {

  drawCorners()

  // globals
  let ctx = globals.ctx
  let uhd = globals.ctxUHD

  const time = 30

  // TEXT GAME OVER
  const text = GameText.GAME_OVER

  // TITTLE
  ctx.font = '40px emulogic'
  ctx.fillStyle = 'red'
  ctx.fillText(text, 80, 215)

  // drow time
  uhd.fillStyle = "black"
  uhd.fillRect(5, 10, 502, 30)
  uhd.font = '10px emulogic'
  uhd.fillStyle = 'white'
  uhd.fillText("--- NEW GAME WILL START IN " + time + " SECONDS ---", 50, 35, 480)
}

function drawNewGame() {
  drawCorners()

  // globals
  const ctx = globals.ctx

  // TEXT NEW GAME
  const text = GameText.GAME_NAME

  // TITTLE
  ctx.font = '30px emulogic'
  ctx.fillStyle = 'red'
  ctx.fillText(text, 50, 215, 400)
  ctx.font = '15px emulogic'
  ctx.fillText("(pres ENTER to start)", 85, 250, 400)

  // pintar inverso el nombre

  // DOWN RIGHT
  ctx.fillStyle = "lightblue"
  ctx.fillRect(367, 320, 145, 64)

  // print down right
  ctx.font = '22px emulogic'
  ctx.fillStyle = "black"
  // context.fillText(text, x, y [, maxWidth])
  ctx.fillText(GameText.GAME_NEW, 375, 360, 130)

  // dibujar los elementos
  drawSpritesNewGame()

  keyboardShortcuts()
}

function drawStory() {
  // Borrar la pantalla entera
  /* globals.ctx.clearRect(0, 0, globals.canvas.width, globals.canvas.height)
  globals.ctxUHD.clearRect(0, 0, globals.canvasUHD.width, globals.canvasUHD.height) */

  drawCorners()

  // Definir constantes
  const title = GameText.GAME_STORY_TITTLE
  const ctx = globals.ctx

  ctx.font = '15px emulogic'
  ctx.fillStyle = 'red'
  ctx.fillText(title, 160, 80)

  function renderText(wordsArray, ctx) {
    ctx.fillStyle = "lightgrey"
    ctx.font = "10px emulogic"

    // incrementar contador del temporizador
    globals.wordTimer.timeChangeCounter += globals.deltaTime

    if (globals.wordTimer.timeChangeCounter >= globals.wordTimer.timeChangeValue) {
      globals.wordTimer.timeChangeCounter = 0
      if (globals.currentWordIndex < wordsArray.length) {
        // mostrar la siguiente palabra
        globals.currentWordIndex++
      }
    }

    // dibujar solo las palabras hasta el indice
    for (let i = 0; i < globals.currentWordIndex; i++) {
      let word = wordsArray[i]
      ctx.fillText(word.word, word.xPos, word.yPos)
    }
  }

  renderText(globals.wordsArray, ctx)

  // UP LEFT
  ctx.fillStyle = "lightblue"
  ctx.fillRect(0, 0, 84, 64)

  // text up left
  ctx.font = '22px emulogic'
  ctx.fillStyle = "black"
  ctx.fillText(GameText.GAME_STORY, 5, 40, 70)

  keyboardShortcuts()
}


function drawControls() {

  drawCorners()

  // globals
  let ctx = globals.ctx

  const time = 30

  // TITTLE
  let lineHeight = 20
  let startX = 80
  let startY = 150

  ctx.font = '15px emulogic'
  ctx.fillStyle = 'red'
  ctx.fillText("GAME CONTROLS", 160, 110)
  ctx.fillStyle = 'lightblue'
  ctx.font = '10px emulogic'

  // recorrer el array corigiendo la posición por línea
  for (let i = 0; i < GameText.GAME_CONTROLS_TEXT.length; i++) {
    ctx.fillText(GameText.GAME_CONTROLS_TEXT[i], startX, startY + i * lineHeight, 450)
  }

  // UP RIGHT
  ctx.fillStyle = "lightblue"
  ctx.fillRect(375, 0, 137, 64)

  // text up right
  ctx.font = '22px emulogic'
  ctx.fillStyle = "black"
  // context.fillText(text, x, y [, maxWidth])
  ctx.fillText(GameText.GAME_CONTROLS, 386, 40, 120)

  keyboardShortcuts()
}

function drawScores() {

  drawCorners()

  // globals
  const ctx = globals.ctx

  // TEXT GRID REFERENCES
  const lineHeight = 20
  const nameX = 160
  const scoreX = 250
  const startY = 180

  ctx.font = '15px emulogic'
  ctx.fillStyle = 'red'
  ctx.fillText(GameText.GAME_SCORES, 160, 110)
  ctx.font = '14px emulogic'

  orderByscore(GameText.SCORES)

  // recorrer el array corigiendo la posición por línea
  for (let i = 0; i < GameText.SCORES.length; i++) {

    let space = " "
    let n

    // resaltar en amarillo los 3 primeros
    if (i == 0 | i == 1 | i == 2) {
      ctx.fillStyle = 'yellow'

    } else {
      ctx.fillStyle = 'lightblue'
    }

    // alinear a la derecha en función del nº de dígitos del score
    if (GameText.SCORES[i].score.toString().length < 5) {
      n = 5 - GameText.SCORES[i].score.toString().length
    }

    // imprimir el score alineado
    ctx.fillText((i + 1) + " " + GameText.SCORES[i].name, nameX, startY + i * lineHeight, 450)
    ctx.fillText((space.repeat(n)) + GameText.SCORES[i].score, scoreX, startY + i * lineHeight, 450)
  }

  // DOWN LEFT
  ctx.fillStyle = "lightblue"
  ctx.fillRect(0, 320, 162, 64)

  // print down left
  ctx.font = '22px emulogic'
  ctx.fillStyle = "black"
  // context.fillText(text, x, y [, maxWidth])
  ctx.fillText(GameText.GAME_SCORES, 5, 360, 150)

  keyboardShortcuts()
}

function orderByscore(array) {
  let n = array.length
  for (let i = 0; i < n - 1; i++) {
    for (let j = 0; j < n - i - 1; j++) {
      if (array[j].score < array[j + 1].score) {
        // intercambiar datos
        let temp = array[j];
        array[j] = array[j + 1];
        array[j + 1] = temp;
      }
    }
  }
  return array
}

// dibujar textos y cuadrados de las esquinas
function drawCorners() {

  // globals
  let ctx = globals.ctx
  let black = "black"
  let blue = "lightblue"

  // CTX 
  ctx.fillStyle = black
  // ctx.fillRect(x, y, width, height);
  ctx.fillRect(0, 0, 512, 384)

  // UP LEFT
  ctx.fillStyle = blue
  ctx.fillRect(0, 0, 10, 64)

  // text up left
  ctx.font = '22px emulogic'
  ctx.fillStyle = blue
  ctx.fillText(GameText.GAME_STORY, 5, 40, 70)

  // UP RIGHT
  ctx.fillStyle = blue
  ctx.fillRect(502, 0, 10, 64)

  // text up right
  ctx.font = '22px emulogic'
  ctx.fillStyle = blue
  // context.fillText(text, x, y [, maxWidth])
  ctx.fillText(GameText.GAME_CONTROLS, 386, 40, 120)

  // DOWN LEFT
  ctx.fillStyle = blue
  ctx.fillRect(0, 320, 10, 64)

  // print down left
  ctx.font = '22px emulogic'
  ctx.fillStyle = blue
  // context.fillText(text, x, y [, maxWidth])
  ctx.fillText(GameText.GAME_SCORES, 5, 360, 150)

  // DOWN RIGHT
  ctx.fillStyle = blue
  ctx.fillRect(502, 320, 10, 64)

  // print down right
  ctx.font = '22px emulogic'
  ctx.fillStyle = blue
  // context.fillText(text, x, y [, maxWidth])
  ctx.fillText(GameText.GAME_NEW, 375, 360, 130)
}

// pantalla de LOADING
function drawSpinner() {

  // globals
  let ctx = globals.ctx
  let black = "black"

  // CTX 
  ctx.fillStyle = black
  // ctx.fillRect(x, y, width, height);
  ctx.fillRect(0, 0, 512, 384)


  // TEXT LOADING
  const text = "LOADING..."

  // TITTLE
  ctx.font = '40px emulogic'
  ctx.fillStyle = 'red'
  ctx.fillText(text, 80, 215)
}