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

  initPlayer()
  initSkeleton()

  initForge()
  initOven()
  initMelted()

  // initPlayerNewGame()
  // initSkeletonNewGame()
}

function initSpritesForge() {

  initPlayer()
  initSkeleton()

  initForge()
  initOven()
  initMelted()

  // initPlayerNewGame()
  // initSkeletonNewGame()
}

function initEvents() {
  // captura de eventos del teclado
  window.addEventListener("keydown", keydownHandler, false)
  window.addEventListener("keyup", keyupHandler, false)


  // Generar un nuevo esqueleto cada minuto
  setInterval(initSkeleton, 6000);
}

// PLAYER
function initPlayer() {
  // crear las propiedades de las imagenes: 
  // initFil, initCol, xSize, ySize, gridSize, xOffset, yOffset
  const imageSet = new ImageSet(20, 0, 64, 64, 64, 2, 0)

  // crear los datos de la animación. 9 frames / state
  const frames = new Frames(5, 5)

  // crear los frames de ataque
  const attackFrames = new Frames(9, 9)

  // inicializamos physics
  const physics = new Physics(40)

  // crear el HitBox(xSize, ySize, xOffset, yOffset)
  const hitBox = new HitBox(20, 20, 20, 36)

  const strikeBox = new HitBox(0, 0, 0, 0)

  // crear nuestro sprite
  const player = new Sprite(
    SpriteID.PLAYER,
    State.STILL_DOWN,
    100, 198,
    imageSet,
    frames,
    attackFrames,
    physics,
    hitBox,
    strikeBox)

  // añadir el player al array de sprites
  globals.sprites.push(player)
}

// SKELETON
function initSkeleton() {
  // Generar coordenadas aleatorias dentro de un rango
  const randomX = Math.floor(Math.random() * globals.canvas.width);
  const randomY = Math.floor(Math.random() * globals.canvas.height);

  // crear las propiedades de las imagenes: 
  // initFil, initCol, xSize, ySize, gridSize, xOffset, yOffset
  const imageSet = new ImageSet(-1, 0, 64, 64, 64, 0, 0)

  // crear los datos de la animación. 8 frames / state
  const frames = new Frames(5, 5)

  // inicializamos physics
  const physics = new Physics(40)

  // crear hitbox HitBox(xSize, ySize, xOffset, yOffset)
  const hitBox = new HitBox(18, 20, 21, 40)

  // crear nuestro sprite *** con fisicas añadidas
  const skeleton = new Sprite(
    SpriteID.SKELETON,
    State.LEFT,
    randomX, randomY,
    imageSet,
    frames,
    /* attackFrames */ 0,
    physics,
    hitBox,
    /* strikeBox */ 0)

  // añadir el esqueleto al array de sprites
  globals.sprites.push(skeleton)
}

// FORJA
function initForge() {
  // crear las propiedades de las imagenes: 
  // initFil, initCol, xSize, ySize, gridSize, xOffset, yOffset
  const imageSet = new ImageSet(48, 1, 64, 130, 64, 16, 10)

  // crear los datos de la animación. 8 frames / state
  const frames = new Frames(3, 9)

  // inicializamos physics
  const physics = new Physics(40)

  // crear hitbox HitBox(xSize, ySize, xOffset, yOffset)
  const hitBox = new HitBox(64, 64, 0, 64)

  // crear sprite de la forja
  const forge = new Sprite(
    SpriteID.FORGE,
    State.STILL,
    50, -10,
    imageSet,
    frames,
    /* attackFrames */ 0,
    physics,
    hitBox,
    /* strikeBox */ 0)

  // añadir el player al array de sprites
  globals.sprites.push(forge)
}

// OVEN  
function initOven() {
  // crear las propiedades de las imagenes: 
  // initFil, initCol, xSize, ySize, gridSize, xOffset, yOffset
  const imageSet = new ImageSet(56, 1, 64, 80, 64, 15, 0)

  // crear los datos de la animación. 8 frames / state
  const frames = new Frames(3, 9)

  // inicializamos physics
  const physics = new Physics(40)

  // crear hitbox HitBox(xSize, ySize, xOffset, yOffset)
  const hitBox = new HitBox(64, 40, 0, 24)

  // crear sprite de la forja
  const forge = new Sprite(
    /* ID */ SpriteID.FORGE,
    /* STATE */ State.STILL,
    /* XPOS, YPOS */ 205, 115,
    /* IMAGESET */ imageSet,
    /* FRAMES */ frames,
    /* attackFrames */ 0,
    /* PHYSICS */ physics,
    /* HITBOX */ hitBox,
    /* strikeBox */ 0)

  // añadir el player al array de sprites
  globals.sprites.push(forge)
}

// MELTED  
function initMelted() {
  // crear las propiedades de las imagenes: 
  // initFil, initCol, xSize, ySize, gridSize, xOffset, yOffset
  const imageSet = new ImageSet(57, 1, 64, 80, 64, 15, 1)

  // crear los datos de la animación. 8 frames / state
  const frames = new Frames(3, 9)

  // inicializamos physics
  const physics = new Physics(40)

  // crear hitbox HitBox(xSize, ySize, xOffset, yOffset)
  const hitBox = new HitBox(64, 32, 0, 32)

  // crear sprite de la forja
  const forge = new Sprite(
    /* ID */ SpriteID.FORGE,
    /* STATE */ State.STILL,
    /* XPOS, YPOS */ 15, 225,
    /* IMAGESET */ imageSet,
    /* FRAMES */ frames,
    /* attackFrames */ 0,
    /* PHYSICS */ physics,
    /* HITBOX */ hitBox,
    /* strikeBox */ 0)

  // añadir el player al array de sprites
  globals.sprites.push(forge)
}

function initLevel() {
  // crear las propiedades de las imagenes: 
  // initFil, initCol, xSize, ySize, gridSize, xOffset, yOffset
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