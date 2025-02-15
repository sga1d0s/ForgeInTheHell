import globals from "./globals.js"
import { Game, FPS, SpriteID, State, RenderParams, GameText } from "./constants.js"
import Sprite from "./Sprite.js"
import { ImageSet, } from "./ImageSet.js"
import Frames from "./Frames.js"
import { Level, level1 } from "./Level.js"
import Physics from "./Physics.js"
import { keydownHandler, keyupHandler } from "./events.js"
import HitBox from "./HitBox.js"
import Timer from "./Timer.js"
import TextWord from "./TextWord.js"

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
    // globals.gameState = Game.STORY
    // *********** Game State ************ //
    // *********** Game State ************ //
    // *********** Game State ************ //

  }
}

function initSprites() {

  // sprites de la forja
  initOven2()
  initForge2()
  initMelted2()

  initPlayer()
  initSkeleton()

  initMelted()
  initOven()
  initForge()
}

function initEvents() {
  // captura de eventos del teclado
  window.addEventListener("keydown", keydownHandler, false)
  window.addEventListener("keyup", keyupHandler, false)
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
    40, 100,
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
  let randomX = 0
  do {
    // generar coordenadas aleatorias dentro de un rango
    randomX = Math.floor(Math.random() * (450 - 50 + 1)) + 50
  } while (randomX < 65);

  let randomY = 0
  do {
    // posición Y aleatoria entre 100 y 384
    randomY = Math.floor(Math.random() * (50 - 320 + 1)) + 320
  } while (randomY < 150);

  const randomState = Math.floor(Math.random() * (12 - 9)) + 9

  // crear las propiedades de las imágenes
  const imageSet = new ImageSet(-1, 0, 64, 64, 64, 0, 0);

  // crear los datos de la animación (8 frames / estado)
  const frames = new Frames(5, 5);

  // inicializamos physics
  const physics = new Physics(40);

  // crear hitbox HitBox(xSize, ySize, xOffset, yOffset)
  const hitBox = new HitBox(18, 20, 21, 40);

  // crear el sprite del esqueleto con la posición inicial
  const skeleton = new Sprite(
    SpriteID.SKELETON,
    /* State */ randomState,
    randomX, randomY,
    imageSet,
    frames,
    /* attackFrames */ 0,
    physics,
    hitBox,
    /* strikeBox */ 0
  );

  // Agregar el nuevo esqueleto al array de sprites
  globals.sprites.splice(4, 0, skeleton);
}

// FORJA
function initForge() {
  // crear las propiedades de las imagenes: 
  const imageSet = new ImageSet(
    /* initFil */ 48,
    /* initCol */ 1,
    /* xSize */ 0,
    /* ySize */ 0,
    /* gridSize */ 64,
    /* xOffset */ 16,
    /* yOffset */ 10,
  )

  // crear los datos de la animación. 8 frames / state
  const frames = new Frames(3, 9)

  // inicializamos physics
  const physics = new Physics(40)

  // crear hitbox HitBox(xSize, ySize, xOffset, yOffset)
  const hitBox = new HitBox(
    /* xSize */ 0,
    /* ySize */ 0,
    /* xOffset */ 0,
    /* yOffset */ 0,
  )

  // crear sprite de la forja
  const forge = new Sprite(
    SpriteID.FORGE,
    State.STILL,
    62, -10,
    imageSet,
    frames,
    /* attackFrames */ 0,
    physics,
    hitBox,
    /* strikeBox */ 0)

  // añadir el player al array de sprites
  globals.sprites.push(forge)
}

// FORJA 2
function initForge2() {
  // crear las propiedades de las imagenes: 
  // initFil, initCol, xSize, ySize, gridSize, xOffset, yOffset
  // const imageSet = new ImageSet(48, 1, 64, 130, 64, 16, 10)
  const imageSet = new ImageSet(
    /* initFil */ 48,
    /* initCol */ 1,
    /* xSize */ 64,
    /* ySize */ 130,
    /* gridSize */ 64,
    /* xOffset */ 16,
    /* yOffset */ 10,
  )

  // crear los datos de la animación. 8 frames / state
  const frames = new Frames(3, 9)

  // inicializamos physics
  const physics = new Physics(40)

  // crear hitbox HitBox(xSize, ySize, xOffset, yOffset)
  const hitBox = new HitBox(64, 64, 0, 64)
  //const hitBox = new HitBox(0, 0, 0, 0)

  // crear sprite de la forja
  const forge = new Sprite(
    SpriteID.FORGE,
    State.STILL,
    62, 0,
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
  const imageSet = new ImageSet(56, 1, 64, 40, 64, 15, 0)

  // crear los datos de la animación. 8 frames / state
  const frames = new Frames(3, 9)

  // inicializamos physics
  const physics = new Physics(40)

  // crear hitbox HitBox(xSize, ySize, xOffset, yOffset)
  const hitBox = new HitBox(54, 26, 6, 38)

  // crear sprite de la forja
  const forge = new Sprite(
    /* ID */ SpriteID.FORGE,
    /* STATE */ State.STILL,
    /* XPOS, YPOS */ 225, 125,
    /* IMAGESET */ imageSet,
    /* FRAMES */ frames,
    /* attackFrames */ 0,
    /* PHYSICS */ physics,
    /* HITBOX */ hitBox,
    /* strikeBox */ 0)

  // añadir el player al array de sprites
  globals.sprites.push(forge)
}

// OVEN 2
function initOven2() {
  // crear las propiedades de las imagenes: 
  // initFil, initCol, xSize, ySize, gridSize, xOffset, yOffset
  const imageSet = new ImageSet(56, 1, 64, 40, 64, 15, 40)

  // crear los datos de la animación. 8 frames / state
  const frames = new Frames(3, 9)

  // inicializamos physics
  const physics = new Physics(40)

  // crear hitbox HitBox(xSize, ySize, xOffset, yOffset)
  const hitBox = new HitBox(0, 0, 0, 0)

  // crear sprite de la forja
  const forge = new Sprite(
    /* ID */ SpriteID.FORGE,
    /* STATE */ State.STILL,
    /* XPOS, YPOS */ 225, 165,
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
  const imageSet = new ImageSet(57, 1, 64, 40, 64, 15, 1)

  // crear los datos de la animación. 8 frames / state
  const frames = new Frames(3, 9)

  // inicializamos physics
  const physics = new Physics(40)

  // crear hitbox HitBox(xSize, ySize, xOffset, yOffset)
  const hitBox = new HitBox(60, 7, 2, 44)

  // crear sprite de la forja
  const forge = new Sprite(
    /* ID */ SpriteID.FORGE,
    /* STATE */ State.STILL,
    /* XPOS, YPOS */ 32, 225,
    /* IMAGESET */ imageSet,
    /* FRAMES */ frames,
    /* attackFrames */ 0,
    /* PHYSICS */ physics,
    /* HITBOX */ hitBox,
    /* strikeBox */ 0)

  // añadir el player al array de sprites
  globals.sprites.push(forge)
}

// MELTED 2
function initMelted2() {
  // crear las propiedades de las imagenes: 
  // initFil, initCol, xSize, ySize, gridSize, xOffset, yOffset
  const imageSet = new ImageSet(57, 1, 64, 40, 64, 15, 41)

  // crear los datos de la animación. 8 frames / state
  const frames = new Frames(3, 9)

  // inicializamos physics
  const physics = new Physics(40)

  // crear hitbox HitBox(xSize, ySize, xOffset, yOffset)
  const hitBox = new HitBox(0, 0, 0, 0)

  // crear sprite de la forja
  const forge = new Sprite(
    /* ID */ SpriteID.FORGE,
    /* STATE */ State.STILL,
    /* XPOS, YPOS */ 32, 265,
    /* IMAGESET */ imageSet,
    /* FRAMES */ frames,
    /* attackFrames */ 0,
    /* PHYSICS */ physics,
    /* HITBOX */ hitBox,
    /* strikeBox */ 0)

  // añadir el player al array de sprites
  globals.sprites.push(forge)
}

// init LEVEL
function initLevel() {
  // crear las propiedades de las imagenes: 
  const imageSet = new ImageSet(
    /* initFil */ 0,
    /* initCol */ 0,
    /* xSize */ 32,
    /* ySize */ 32,
    /* gridSize */ 32,
    /* xOffset */ 0,
    /* yOffset */ 0
  )

  // creamos y guardamos nuestro nivel
  globals.level = new Level(level1, imageSet)
}

// init TIMERS
function initTimers() {
  // creamos timer de valor 200, con cambios cada 0.5 segundos
  globals.skeletonTime = new Timer(360, 20)
  globals.loadingTime = new Timer(360, 2)


  globals.scoreWordTime = new Timer(360, 1)

  // timer game over BETA 180 sg
  globals.gameOverTime = new Timer(360, 360)

  console.log("initTimers");
}

// Función para procesar el texto y calcular posiciones
function processText(text, maxWidth, initX, initY, lineHeight, ctx) {
  let words = text.split(" ")
  let xPos = initX
  let yPos = initY

  ctx.font = `10px emulogic`; // Configurar fuente

  console.log(ctx.font);
  for (let i = 0; i < words.length; i++) {
    let wordWidth = ctx.measureText(words[i]).width
    // Si la palabra no cabe en la línea actual, saltar a la siguiente línea
    if (xPos + wordWidth > maxWidth) {
      xPos = initX;
      yPos += lineHeight
    }

    globals.wordsArray.push(new TextWord(words[i], xPos, yPos))

    xPos += wordWidth + ctx.measureText(" ").width
    console.log(wordWidth);

    // console.log(globals.wordsArray);
  }
}

function initProcessText (){
              // ########################### parametros de render
              const maxWidth = globals.canvas.width - 20;
              const lineHeight = 20
              const initX = 30
              const initY = 120
              const ctx = globals.ctx
              console.log("TEST max width" + globals.canvas.width);
              const text = GameText.GAME_STORY_TEXT
        
              // Procesar el texto y obtener posiciones
              processText(text, maxWidth, initX, initY, lineHeight, ctx)
        
              // ##################################################
}


// exportar funciones
export {
  initHTMLElements,
  initVars,
  loadAssets,
  initSprites,
  initLevel,
  initEvents,
  initSkeleton,
  initTimers,
  processText,
  initProcessText
}