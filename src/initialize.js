import globals from "./globals.js"
import { Game, FPS, SpriteID, State } from "./constants.js"
import Sprite from "./Sprite.js"
import { ImageSet, } from "./ImageSet.js"
import Frames from "./Frames.js"
import { Level, level1 } from "./Level.js"
import Physics from "./Physics.js"
import { keydownHandler, keyupHandler } from "./events.js"
import HitBox from "./HitBox.js"

// funcionque inicializa los elementos HTML
function initHTMLElements() {
  // canvas y context Screen
  globals.canvas = document.getElementById('gameScreen')
  globals.ctx = globals.canvas.getContext('2d')

  // canvas y context UHD
  globals.canvasUHD = document.getElementById('gameUHD')
  globals.ctxUHD = globals.canvasUHD.getContext('2d')

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

  // iniciamos el contador
  globals.gameTime = 0

  globals.action = {
    moveLeft: false,
    moveRight: false,
    moveUp: false,
    moveDown: false,
    attack: false
  }

  // variable vida
  globals.life = 100;
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
    globals.gameState = Game.PLAYING
    // *********** Game State ************ //
    // *********** Game State ************ //
    // *********** Game State ************ //
  }
}

function initSprites() {
  initForge()
  initPlayer()
  initSkeleton()

  // initPlayerNewGame()
  // initSkeletonNewGame()Ñ
}

function initEvents() {
  // captura de eventos del teclado
  window.addEventListener("keydown", keydownHandler, false)
  window.addEventListener("keyup", keyupHandler, false)
}

/* function initForge() {
  // crear las propiedades de las imagenes: initFil, initCol, xSize, ySize, gridSize, xOffset, yOffset
  const forgeSet = new ImageSet(19, 1, 64, 130, 64, 0, 0)
  // const toolSet = new ImageSet(16, 2, 65, 69, 64, -3, 0)
  const tableSet = new ImageSet(16, 0, 69, 69, 64, -5, 0)

  // crear los datos de la animación. 8 frames / state
  const frames = new Frames(3, 9)
  const framesTable = new Frames(2, 20)

   // inicializamos physics
   const physics = new Physics(40)

   const physicsTable = new Physics(40)

  // crear sprite de la forja
  const forge = new Sprite(SpriteID.FORGE, State.STILL, 50, -10, forgeSet, frames, physics)

  // crear sprite de las herramientas
  // const tools = new Sprite(SpriteID.TOOLS, State.STILL, 10, 200, toolSet, frames)

  // crear sprite de la mesa
  const table = new Sprite(SpriteID.FORGE, State.STILL, 195, 120, tableSet, framesTable, physicsTable)

  // añadir el player al array de sprites
  globals.sprites.push(forge)
  // globals.sprites.push(tools)
  globals.sprites.push(table)
} */

function initForge() {
  // crear las propiedades de las imagenes: initFil, initCol, xSize, ySize, gridSize, xOffset, yOffset
  const forgeSet = new ImageSet(48, 1, 64, 130, 64, 16, 10)

  // crear los datos de la animación. 8 frames / state
  const frames = new Frames(3, 9)

  // inicializamos physics
  const physics = new Physics(40)

  // crear sprite de la forja
  const forge = new Sprite(SpriteID.FORGE, State.STILL, 50, -10, forgeSet, frames, physics)

  // añadir el player al array de sprites
  globals.sprites.push(forge)
}


function initPlayer() {
  // crear las propiedades de las imagenes: initFil, initCol, xSize, ySize, gridSize, xOffset, yOffset
  const imageSet = new ImageSet(20, 0, 64, 64, 64, 0, 0)

  // crear los datos de la animación. 9 frames / state
  const frames = new Frames(6, 6)

  // crear los frames de ataque
  const attackFrames = new Frames(9, 9)

  // inicializamos physics
  const physics = new Physics(40)

  // crear el HitBox(xSize, ySize, xOffset, yOffset)
  const hitBox = new HitBox(20, 46, 22, 15)

  // crear nuestro sprite
  const player = new Sprite(SpriteID.PLAYER, State.STILL_DOWN, 100, 198, imageSet, frames, attackFrames, physics, hitBox)

  // añadir el player al array de sprites
  globals.sprites.push(player)
}

function initSkeleton() {
  // crear las propiedades de las imagenes: initFil, initCol, xSize, ySize, gridSize, xOffset, yOffset
  const imageSet = new ImageSet(8, 0, 64, 64, 64, 0, 0)

  // crear los datos de la animación. 8 frames / state
  const frames = new Frames(5, 5)

  // inicializamos physics
  const physics = new Physics(40)

  // crear hitbox HitBox(xSize, ySize, xOffset, yOffset)
  const hitBox = new HitBox(18, 46, 21, 15)

  // crear nuestro sprite *** con fisicas añadidas
  const skeleton = new Sprite(SpriteID.SKELETON, State.LEFT, 300, 150, imageSet, frames, physics, hitBox)

  // añadir el esqueleto al array de sprites
  globals.sprites.push(skeleton)
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
  initEvents
}