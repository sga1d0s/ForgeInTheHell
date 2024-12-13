import globals from "./globals.js"
import { Game, FPS, SpriteID, State } from "./constants.js"
import Sprite from "./Sprite.js"
import { ImageSet, } from "./ImageSet.js"
import Frames from "./Frames.js"
import { Level, level1 } from "./Level.js"

// funcionque inicializa los elementos HTML
function initHTMLElements() {
  // canvas y context Screen
  globals.canvas = document.getElementById('gameScreen')
  globals.ctx = globals.canvas.getContext('2d')

  // canvas y context UHD
  globals.canvasUHD = document.getElementById('gameUHD')
  globals.ctxUHD = globals.canvasUHD.getContext('2d')

  // canvas y context HammerScreen
  // globals.canvasHammer = document.getElementById('hammerScreen')
  // globals.ctxHammer = globals.canvasHammer.getContext('2d')

  // eliminación del Anti-Aliasing
  globals.ctx.imageSmoothingEnabled = false
}

// funcion que inicializa las variables del juego
function initVars() {
  // inicializamos las variables de gestión de tiempo
  globals.previousCycleMilliseconds = 0
  globals.deltaTime = 0
  globals.frameTimeObj = 1 / FPS // frame time in seconds

  // inicializamos el estado del juego
  globals.gameState = Game.LOADING
}

// carga de activos: TILEMAPS, IMAGES, SOUNDS
function loadAssets() {

  let tileSet;
  // load the spritesheet image
  tileSet = new Image()
  tileSet.addEventListener("load", loadHandler, false)
  tileSet.src = "./images/spritesheet.png"
  globals.tileSets.push(tileSet)
  globals.assetsToLoad.push(tileSet)

  // load the bricks image
  tileSet = new Image()
  tileSet.addEventListener("load", loadHandler, false)
  tileSet.src = "./images/bricks.png"
  globals.tileSets.push(tileSet)
  globals.assetsToLoad.push(tileSet)
}

// funcion que se llama cada vez que se carga un archivo
function loadHandler() {
  globals.assetsLoaded++

  // una vez se han cargado todos los activos pasar
  if (globals.assetsLoaded === globals.assetsToLoad.length) {

    for (let i = 0; i < globals.tileSets.length; i++) {
      // remove the load event listener
      globals.tileSets[i].removeEventListener("load", loadHandler, false)
    }

    console.log("Assets finish loading")

    // *********** Game State ************ //
    // *********** Game State ************ //
    // *********** Game State ************ //
    globals.gameState = Game.NEW_GAME
  }
}

function initSprites() {
  // initPlayer()
  // initSkeleton()
  // initForge()

  initPlayerNewGame()
  initSkeletonNewGame()
}

function initSkeletonNewGame() {
  // crear las propiedades de las imagenes: initFil, initCol, xSize, ySize, gridSize, xOffset, yOffset
  const imageSet = new ImageSet(0, 4, 64, 64, 64, 0, 0)

  // crear los datos de la animación. 8 frames / state
  const frames = new Frames(9)

  // crear nuestro sprite
  const skeleton = new Sprite(SpriteID.SKELETON, State.LEFT, 300, 130, imageSet, frames)

  // añadir el pirate al array de sprites
  globals.sprites.push(skeleton)
}

function initPlayerNewGame() {
  // crear las propiedades de las imagenes: initFil, initCol, xSize, ySize, gridSize, xOffset, yOffset
  const imageSet = new ImageSet(8, 4, 64, 64, 64, 0, 0)

  // crear los datos de la animación. 8 frames / state
  const frames = new Frames(9)

  // crear nuestro sprite
  const player = new Sprite(SpriteID.PLAYER, State.RIGHT, 100, 198, imageSet, frames)

  // añadir el player al array de sprites
  globals.sprites.push(player)
}

function initLevel() {
  // crear las propiedades de las imagenes: initFil, initCol, xSize, ySize, gridSize, xOffset, yOffset
  const imageSet = new ImageSet(0, 0, 32, 32, 32, 0, 0)

  // creamos y guardamos nuestro nivel
  globals.level = new Level(level1, imageSet)
}

// exportar funciones
export {
  initHTMLElements,
  initVars,
  loadAssets,
  initSprites,
  initLevel,
}