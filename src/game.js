import globals from "./globals.js"
import { initHTMLElements, initVars, loadAssets, initSprites, initLevel } from "./initialize.js"
import update from "./gameLogic.js"
import updateSprite from "./gameLogic.js"
import render from "./gameRender.js"

////////////////////////////////////
//            GAME INIT           //
////////////////////////////////////

window.onload = init

function init() {

  // inicializamos los elementos HTML: Canvas, Context, Caja de texto de pruebas
  initHTMLElements()

  // cargamos todos los activos: TILEMAPS, IMAGES, SOUNDS
  loadAssets()

  // iniciar los sprites
  initSprites()

  // inicialización de las variables de juego
  initVars()

  // inicialización del mapa del juego
  initLevel()

  // start the first frame request
  window.requestAnimationFrame(gameLoop)
}

////////////////////////////////////
//           GAME EXECUTE         //
////////////////////////////////////

// bucle principal de ejecución
function gameLoop(timeStamp) {

  // keep requesting new frames
  window.requestAnimationFrame(gameLoop, globals.canvas)

  // tiempo real de ciclo de ejecución
  const elapsedCycleSeconds = (timeStamp - globals.previousCycleMilliseconds) / 1000

  // tiempo anterior de ciclo de ejecución
  globals.previousCycleMilliseconds = timeStamp

  // vbariable que corrige el tiempo de frame debido a retrqsos con respecto al tiempo objetivo (frameTimeObj)
  globals.deltaTime += elapsedCycleSeconds

  // CHANGES: CORRECTIONS
  globals.cycleRealTime += elapsedCycleSeconds

  if (globals.cycleRealTime >= globals.frameTimeObj) {

    // update the game logic. gameLogic.js
    update()

    updateSprite()

    // perform the drawing operation. gameRender.js
    render()

    //CHANGES:
    //Corregimos los excesos de tiempo
    globals.cycleRealTime -= globals.frameTimeObj
    globals.deltaTime = 0
  }
}