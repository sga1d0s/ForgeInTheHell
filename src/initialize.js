import globals from "./globals.js"
import { Game, FPS, SpriteID, State, GameText, InitialTimeNewSkeleton, ParticleID, ParticleState } from "./constants.js"
import Sprite from "./Sprite.js"
import { ImageSet, } from "./ImageSet.js"
import Frames from "./Frames.js"
import { Level, level1 } from "./Level.js"
import Physics from "./Physics.js"
import { keydownHandler, keyupHandler } from "./events.js"
import HitBox from "./HitBox.js"
import Timer from "./Timer.js"
import TextWord from "./TextWord.js"
import { RainParticleSparkle, SkeletonSpawnCloudParticle, HammerSparkParticle } from "./Particle.js";
import EventManager from "./EventManager.js";

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

  globals.didReloadInGameOver = false;

  // FX particles
  globals.fxParticles = [];

  // si true, retrasar la aparición del esqueleto para que la nube aparezca primero.
  globals.pendingSkeletonSpawn = null;

  // HUD particles (hammer sparks)
  globals.hudParticles = [];
  globals.prevHammerDamage = 0;
  globals.prevAttack = false;

  globals.lowLifeAuraParticles = [];
  globals.lowLifeAuraEnabled = false;

  // Evento HammerBroken
  globals.attackDisabled = false;      // bloquea ataque cuando el martillo está roto
  globals.hammerMaxDamage = 10;        // o el valor que uses como límite real
  globals.hammerPickupActive = false;  // si hay un martillo en el mapa
  globals.hammerPickupSprite = null;   // referencia al sprite pickup si lo guardas
  globals.eventManager = new EventManager();
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
  }
}

function initSprites() {

  // Mantener las partículas de lluvia persistentes
  if (!globals.rainParticles) {
    globals.rainParticles = [];
  }

  // sprites de la forja
  initOven2()
  initForge2()
  initMelted2()

  initPlayer()
  initSkeleton()

  initMelted()
  initOven()
  initForge()
  initRainParticleParticles()
}

function initEvents() {
  // captura de eventos del teclado
  window.addEventListener("keydown", keydownHandler, false)
  window.addEventListener("keyup", keyupHandler, false)
}

// inicio partículas lluvia
function initRainParticleParticles() {
  initRainParticleSparkles();
}

function initRainParticleSparkles() {
  // Si ya está inicializado, no recrea
  if (globals.rainParticles && globals.rainParticles.length > 0) {
    return;
  }

  const numOfParticles = 100;

  for (let i = 0; i < numOfParticles; i++) {
    createRainParticleSparkle();
  }
}

function createRainParticleSparkle() {
  const xPos = Math.random() * globals.canvas.width;
  const yPos = Math.random() * globals.canvas.height;

  const width = 3.5;
  const height = 3.5;
  const radius = 3.5;

  const color = "red"

  // Base alpha + brillo
  const baseAlpha = 0.35 + Math.random() * 0.55;
  const twinkleSpeed = 3 + Math.random() * 6;
  const twinklePhase = Math.random() * Math.PI * 2;

  // Lluvia: velocidad vertical y horizontal
  const vy = 25 + Math.random() * 90;
  const vx = -6 + Math.random() * 12;

  const particle = new RainParticleSparkle(
    ParticleID.RAIN_PARTICLES,
    ParticleState.FADE,
    xPos,
    yPos,
    null,
    baseAlpha,
    width,
    height,
    radius,
    color
  );

  // asignar datos a campos dinámicos
  particle.baseAlpha = baseAlpha;
  particle.twinkleSpeed = twinkleSpeed;
  particle.twinklePhase = twinklePhase;
  particle.vx = vx;
  particle.vy = vy;

  globals.rainParticles.push(particle);
}

function createSkeletonSpawnCloud(xCenter, yCenter) {
  // nuve de partículas antes de la aparición
  const count = 14;
  for (let i = 0; i < count; i++) {
    const angle = Math.random() * Math.PI * 2;
    const speed = 10 + Math.random() * 25;

    const xPos = xCenter + (Math.random() * 14 - 7);
    const yPos = yCenter + (Math.random() * 10 - 5);

    const radius = 3 + Math.random() * 10;
    const alpha = 0.20 + Math.random() * 0.25;
    const timeToLive = 0.35 + Math.random() * 0.50;

    const p = new SkeletonSpawnCloudParticle(
      ParticleID.SKELETON_SPAWN_CLOUD,
      ParticleState.FADE,
      xPos,
      yPos,
      null,
      alpha,
      radius,
      timeToLive,
      "rgba(40, 40, 40, 1)"
    );

    p.vx = Math.cos(angle) * speed;
    p.vy = Math.sin(angle) * speed - 10;

    globals.fxParticles.push(p);
  }
}

function getRandomSkeletonSpawnPosition() {
  let randomX;
  let randomY;

  // RANDOM X
  if (Math.random() < 0.5) {
    randomX = Math.floor(Math.random() * (180 - 0 + 1)) + 0;
  } else {
    randomX = Math.floor(Math.random() * (440 - 272 + 1)) + 272;
  }

  // RANDOM Y
  if (Math.random() < 0.5) {
    randomY = Math.floor(Math.random() * (180 - 120 + 1)) + 120;
  } else {
    randomY = Math.floor(Math.random() * (300 - 70 + 1)) + 70;
  }

  return { x: randomX, y: randomY };
}

function initSkeletonAt(x, y) {
  const randomState = Math.floor(Math.random() * (12 - 9)) + 9;

  const imageSet = new ImageSet(-1, 0, 64, 64, 64, 0, 0);
  const frames = new Frames(5, 5);
  const physics = new Physics(40);
  const hitBox = new HitBox(18, 20, 21, 40);

  const skeleton = new Sprite(
    SpriteID.SKELETON,
    randomState,
    x, y,
    imageSet,
    frames,
    0,
    physics,
    hitBox,
    0
  );

  globals.sprites.splice(4, 0, skeleton);
}

function createHammerSparks(xCenter, yCenter, intensity = 1) {

  const count = Math.min(18 + Math.floor(intensity * 18), 60);

  for (let i = 0; i < count; i++) {
    // Ángulo y velocidad de las chispas
    const angle = (-Math.PI / 2) + (Math.random() * 1.35 - 0.675);
    const speed = 180 + Math.random() * 320;

    const radius = 1.5 + Math.random() * 3.8;

    // brillo
    const alpha = 0.75 + Math.random() * 0.25;

    // Duración
    const timeToLive = 0.55 + Math.random() * 0.35;

    const p = new HammerSparkParticle(
      ParticleID.HAMMER_SPARK,
      ParticleState.FADE,
      xCenter + (Math.random() * 14 - 7),
      yCenter + (Math.random() * 10 - 5),
      null,
      alpha,
      radius,
      timeToLive,
      "rgba(255, 40, 40, 1)"
    );

    p.vx = Math.cos(angle) * speed;
    p.vy = Math.sin(angle) * speed;

    // velocidad aleatoria
    p.vx += (Math.random() * 80 - 40);
    p.vy += (Math.random() * 60 - 30);

    globals.hudParticles.push(p);
  }
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
  const pos = getRandomSkeletonSpawnPosition();
  initSkeletonAt(pos.x, pos.y);
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

function initHammerPickupAt(x, y) {
  // crear las propiedades de las imagenes: 
  // initFil, initCol, xSize, ySize, gridSize, xOffset, yOffset
  const imageSet = new ImageSet(116, 12, 32, 32, 32, 10, 0)

  // crear los datos de la animación. 9 frames / state
  const frames = new Frames(5, 5)

  // crear los frames de ataque
  const attackFrames = new Frames(9, 9)

  // inicializamos physics
  const physics = new Physics(40)

  // crear el HitBox(xSize, ySize, xOffset, yOffset)
  const hitBox = new HitBox(20, 20, 12, 7)

  // crear nuestro sprite
  const pickup = new Sprite(
    SpriteID.HAMMER,
    State.STILL_DOWN,
    x, y,
    imageSet,
    frames,
    attackFrames,
    physics,
    hitBox,
    )

  // añadir el player al array de sprites
  globals.sprites.push(pickup)

  // globals.sprites.push(pickup);
  globals.hammerPickupActive = true;
  globals.hammerPickupSprite = pickup;

  return pickup;
};



// partículas de ataque
function createAttackDust(xCenter, yGround) {
  const count = 10;

  for (let i = 0; i < count; i++) {
    const angle = Math.PI + (Math.random() * Math.PI);
    const speed = 25 + Math.random() * 70;

    const xPos = xCenter + (Math.random() * 18 - 9);
    const yPos = yGround + (Math.random() * 6 - 3);

    const radius = 2 + Math.random() * 6;
    const alpha = 0.18 + Math.random() * 0.25;
    const timeToLive = 0.25 + Math.random() * 0.25;

    const p = new SkeletonSpawnCloudParticle(
      ParticleID.ATTACK_DUST,
      ParticleState.FADE,
      xPos,
      yPos,
      null,
      alpha,
      radius,
      timeToLive,
      "rgba(233, 233, 233, 1)"
    );

    p.vx = Math.cos(angle) * speed;
    p.vy = Math.sin(angle) * speed - (10 + Math.random() * 25)
    p.gravity = 140;

    globals.fxParticles.push(p);
  }
}

// partículas de vida baja
function ensureLowLifeAuraParticles() {
  if (!globals.lowLifeAuraParticles) globals.lowLifeAuraParticles = [];

  const targetCount = 18;

  while (globals.lowLifeAuraParticles.length < targetCount) {
    const p = new RainParticleSparkle(
      ParticleID.LOW_LIFE_AURA,
      ParticleState.FADE,
      0, 0,
      null,
      0.6,
      3.5, 3.5, 3.5,
      "rgba(251, 230, 0, 1)"
    );

    // parámetros orbitales (propiedades “sueltas”)
    p.orbitR = 14 + Math.random() * 22;
    p.angle = Math.random() * Math.PI * 2;
    p.angularSpeed = 1.2 + Math.random() * 1.8;
    p.baseAlpha = 0.25 + Math.random() * 0.35;
    p.twinklePhase = Math.random() * Math.PI * 2;

    globals.lowLifeAuraParticles.push(p);
  }
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

  globals.skeletonTime = new Timer(0, InitialTimeNewSkeleton)
  globals.skeletonTime.initialTimeNewSkeleton = InitialTimeNewSkeleton
  globals.loadingTime = new Timer(0, 2)
  globals.wordTimer = new Timer(0, 0.1)
  globals.gameOverTime = new Timer(360, 360)
  globals.gameOverPlayer = new Timer(0, 15)

  console.log("initTimers");
}

// función para procesar el texto y calcular posiciones
function processText(text, maxWidth, initX, initY, lineHeight, ctx) {
  let words = text.split(" ")
  let xPos = initX
  let yPos = initY
  let wordsArray = []

  ctx.font = "10px emulogic"

  for (let i = 0; i < words.length; i++) {
    let wordWidth = ctx.measureText(words[i]).width

    // salto de lionea si no cabe
    if (xPos + wordWidth > maxWidth) {
      xPos = initX;
      yPos = yPos + lineHeight
    }

    wordsArray.push(new TextWord(words[i], xPos, yPos))

    xPos += wordWidth + ctx.measureText(' ').width
  }

  return wordsArray
}

function initProcessText() {
  // parametros de render
  const text = GameText.GAME_STORY_TEXT
  const maxWidth = globals.canvas.width - 20
  const initX = 30
  const initY = 120
  const lineHeight = 20
  const ctx = globals.ctx

  // Procesar el texto y obtener posiciones
  globals.wordsArray = processText(text, maxWidth, initX, initY, lineHeight, ctx)
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
  initProcessText,
  processText,
  createRainParticleSparkle,
  initRainParticleSparkles,
  createSkeletonSpawnCloud,
  getRandomSkeletonSpawnPosition,
  initSkeletonAt,
  createHammerSparks,
  createAttackDust,
  ensureLowLifeAuraParticles,
  initHammerPickupAt
}