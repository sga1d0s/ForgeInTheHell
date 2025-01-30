import globals from "./globals.js"
import { Block, SpriteID, State } from "./constants.js"
import Sprite from "./Sprite.js"

export default function detectCollisions() {
  // calcular colision del player con cada uno de los sprites
  for (let i = 4; i < globals.sprites.length; i++) {
    const sprite = globals.sprites[i]
    detectCollisionBetweenPlayerAndSprites(sprite)

    detectCollisionBetweenSkeletonAndSprites(sprite)

    // detecta la colisión entre hacha y enemigo
    detectCollisionAttack(sprite)
  }

  // calcular colision del player con los obstaculos del mapa
  detectCollisionBetweenPlayerAndMapObstacles()
}

// detecta la colisión entre player y enemigos
function detectCollisionBetweenPlayerAndSprites(sprite) {
  // reset collision state
  sprite.isCollidingWithPlayer = false

  // nuestro player está en la posición 1
  const player = globals.sprites[3]

  // reset collision state
  player.isCollidingWithObstacleOnTheRight = false;
  player.isCollidingWithObstacleOnTheLeft = false;
  player.isCollidingWithObstacleOnTheTop = false;
  player.isCollidingWithObstacleOnTheBottom = false;

  // datos del player
  const x1 = player.xPos + player.hitBox.xOffset
  const y1 = player.yPos + player.hitBox.yOffset
  const w1 = player.hitBox.xSize
  const h1 = player.hitBox.ySize

  // datos del otro sprite
  const x2 = sprite.xPos + sprite.hitBox.xOffset
  const y2 = sprite.yPos + sprite.hitBox.yOffset
  const w2 = sprite.hitBox.xSize
  const h2 = sprite.hitBox.ySize

  const isOverlap = rectIntersect(x1, y1, w1, h1, x2, y2, w2, h2)

  if (isOverlap && sprite.id === SpriteID.SKELETON && sprite.state !== State.DEATH) {
    // existe colisión
    sprite.isCollidingWithPlayer = true
  }

  // variables to use
  let xPos
  let yPos
  let overlap

  const direction = player.state

  if (sprite.state !== State.DEATH) {
    switch (direction) {
      case State.RIGHT:
        // posiciones de PLAYER hacia la derecha
        xPos = player.xPos

        if (isOverlap) {
          // existe colision a la derecha
          player.isCollidingWithObstacleOnTheRight = true

          // AJUSTE: Calcular solapamiento y mover el personaje lo correspondiente
          overlap = Math.floor(xPos) % player.hitBox.xSize + 5
          player.xPos -= overlap
        }
        break;

      case State.LEFT:
        // posiones de PLAYER hacia la izquierda
        xPos = player.xPos

        if (isOverlap) {
          // existe colision a la izquierda]]
          player.isCollidingWithObstacleOnTheLeft = true

          // AJUSTE: Calcular solapamiento y mover el personaje lo correspondiente
          overlap = Math.floor(xPos) % player.hitBox.xSize + 5
          player.xPos += overlap
        }
        break

      case State.UP:
        // primera colisión en (xPos, yPos)
        yPos = player.yPos

        if (isOverlap) {
          // existe colisión hacia arriba
          player.isCollidingWithObstacleOnTheTop = true;

          // AJUSTE: Calcular solapamiento y mover el personaje lo correspondiente
          overlap = Math.floor(yPos) % player.hitBox.ySize + 5;
          player.yPos += overlap;
        }
        break;

      case State.DOWN:
        // primera colisión en (xPos, yPos)
        yPos = player.yPos

        if (isOverlap) {
          // existe colisión hacia arriba
          player.isCollidingWithObstacleOnTheTop = true;

          // AJUSTE: Calcular solapamiento y mover el personaje lo correspondiente
          overlap = Math.floor(yPos) % player.hitBox.ySize + 5;
          player.yPos -= overlap;
        }
        break;

      default:
        break
    }
  }
}

// detecta la colisión entre player y enemigos
function detectCollisionBetweenSkeletonAndSprites(sprite) {

  // Obtener todos los demás sprites
  const otherSprites = [];

  for (let i = 0; i < globals.sprites.length; i++) {
    if (globals.sprites[i] !== sprite) {
      otherSprites.push(globals.sprites[i]);
    }
  }

  // Iterar sobre los otros sprites
  for (const otherSprite of otherSprites) {
    // Datos del sprite en cuestión
    const x1 = sprite.xPos + sprite.hitBox.xOffset;
    const y1 = sprite.yPos + sprite.hitBox.yOffset;
    const w1 = sprite.hitBox.xSize;
    const h1 = sprite.hitBox.ySize;

    // Datos del otro sprite
    const x2 = otherSprite.xPos + otherSprite.hitBox.xOffset;
    const y2 = otherSprite.yPos + otherSprite.hitBox.yOffset;
    const w2 = otherSprite.hitBox.xSize;
    const h2 = otherSprite.hitBox.ySize;

    // Verificar si hay intersección
    const isOverlap = rectIntersect(x1, y1, w1, h1, x2, y2, w2, h2);

    if (sprite.state !== State.DEATH) {

      if (isOverlap) {
        // Ajustar la posición del esqueleto y cambiar su dirección
        let overlap;
        switch (sprite.state) {
          case State.RIGHT:
            overlap = Math.floor(sprite.xPos) % sprite.hitBox.xSize + 10;
            sprite.xPos -= overlap;
            sprite.state = State.LEFT
            break;

          case State.LEFT:
            overlap = Math.floor(sprite.xPos) % sprite.hitBox.xSize + 10;
            sprite.xPos += overlap;
            sprite.state = State.RIGHT; // Cambiar dirección a la derecha
            break;

          case State.UP:
            overlap = Math.floor(sprite.yPos) % sprite.hitBox.ySize + 10;
            sprite.yPos += overlap;
            sprite.state = State.DOWN; // Cambiar dirección hacia abajo
            break;

          case State.DOWN:
            overlap = Math.floor(sprite.yPos) % sprite.hitBox.ySize + 10;
            sprite.yPos -= overlap;
            sprite.state = State.UP; // Cambiar dirección hacia arriba
            break;

          default:
            break;
        }
      }
    }
  }
}



// calculo de colisiones con los bloques del mapa
function detectCollisionBetweenPlayerAndMapObstacles() {
  // player
  const player = globals.sprites[3]

  // eset collision state
  player.isCollidingWithObstacleOnTheRight = false;
  player.isCollidingWithObstacleOnTheLeft = false;
  player.isCollidingWithObstacleOnTheTop = false;
  player.isCollidingWithObstacleOnTheBottom = false;

  // variables to use
  let xPos
  let yPos
  let isCollidingOnPos1
  let isCollidingOnPos2
  let isCollidingOnPos3
  let isColliding
  let overlap

  const brickSize = globals.level.imageSet.gridSize
  const direction = player.state

  // ID del obstáculo
  const obstacleIdW = Block.WALL
  const obstacleIdWl = Block.WALL_LEFT
  const obstacleIdWr = Block.WALL_RIGHT

  switch (direction) {
    case State.RIGHT:
      // posiciones hacia la derecha
      xPos = player.xPos + player.hitBox.xOffset + player.hitBox.xSize - 1
      yPos = player.yPos + player.hitBox.ySize + player.hitBox.yOffset - 10;

      // ternario para comprobar si player está en el límite derecho
      isColliding = (xPos > globals.canvas.width) ? true : false

      if (isColliding) {
        // existe colision a la derecha
        player.isCollidingWithObstacleOnTheRight = true

        // AJUSTE: Calcular solapamiento y mover el personaje lo correspondiente
        overlap = Math.floor(xPos) % brickSize + 1
        player.xPos -= overlap
      }
      break;

    case State.LEFT:
      // posiones hacia la izquierda
      xPos = player.xPos + player.hitBox.xOffset - 1
      yPos = player.yPos + player.hitBox.ySize + player.hitBox.yOffset - 10;

      // ternario para comprobar si player está en el límite iaquierdo
      isColliding = (xPos < 0) ? true : false

      if (isColliding) {
        // existe colision a la izquierda
        player.isCollidingWithObstacleOnTheLeft = true

        // AJUSTE: Calcular solapamiento y mover el personaje lo correspondiente
        overlap = Math.floor(xPos) % brickSize + 1
        player.xPos -= overlap
      }
      break

    case State.DOWN:
      // posiciones hacia abajo
      yPos = player.yPos + player.hitBox.yOffset + player.hitBox.ySize - 1;
      xPos = player.xPos + player.hitBox.xOffset;

      // ternario para comprobar si player está en el límite inferior
      isColliding = (yPos > globals.canvas.height) ? true : false

      if (isColliding) {
        // existe colisión hacia abajo
        player.isCollidingWithObstacleOnTheBottom = true;

        // AJUSTE: Calcular solapamiento y mover el personaje lo correspondiente
        overlap = Math.floor(yPos) % brickSize + 1;
        player.yPos -= overlap;
      }
      break;

    case State.UP:
      // primera colisión en (xPos, yPos)
      yPos = player.yPos + player.hitBox.ySize + player.hitBox.yOffset - 10;
      xPos = player.xPos + player.hitBox.xOffset;

      isCollidingOnPos1 = isCollidingWithObstacleAt(xPos, yPos, obstacleIdW);
      isCollidingOnPos2 = isCollidingWithObstacleAt(xPos, yPos, obstacleIdWl);
      isCollidingOnPos3 = isCollidingWithObstacleAt(xPos, yPos, obstacleIdWr);

      // habrá colisión si toca alguno de los 3 bloques
      isColliding = isCollidingOnPos1 || isCollidingOnPos2 || isCollidingOnPos3;

      if (isColliding) {
        // existe colisión hacia arriba
        player.isCollidingWithObstacleOnTheTop = true;

        // AJUSTE: Calcular solapamiento y mover el personaje lo correspondiente
        overlap = Math.floor(yPos) % brickSize + 1;
        player.yPos -= overlap - brickSize;
      }
      break;

    default:
      break;
  }
}

// detecta colision entre hacha y enemigos
function detectCollisionAttack(sprite) {
  // reset collision state
  sprite.isAttackSuccsesfull = false

  // nuestro player está en la posición 1
  const player = globals.sprites[3]

  // datos del player
  const x1 = player.xPos + player.strikeBox.xOffset
  const y1 = player.yPos + player.strikeBox.yOffset
  const w1 = player.strikeBox.xSize
  const h1 = player.strikeBox.ySize

  // datos del otro sprite
  const x2 = sprite.xPos + sprite.hitBox.xOffset
  const y2 = sprite.yPos + sprite.hitBox.yOffset
  const w2 = sprite.hitBox.xSize
  const h2 = sprite.hitBox.ySize

  const isOverlap = rectIntersect(x1, y1, w1, h1, x2, y2, w2, h2)
  if (isOverlap && sprite.id === SpriteID.SKELETON) {
    // existe colisión
    sprite.isAttackSuccsesfull = true

    // Eliminar el esqueleto de la lista de sprites
    const index = globals.sprites.indexOf(sprite);
    if (index !== -1) {
      globals.score++
      globals.sprites[index].state = State.DEATH;
      globals.sprites.splice(index, 1)
    }
  }
}

// funcion que calcula si 2 rectangulos interseccionan
function rectIntersect(x1, y1, w1, h1, x2, y2, w2, h2) {
  let isOverlap

  // check x and y for overlap
  if (x2 > w1 + x1 || x1 > w2 + x2 || y2 > h1 + y1 || y1 > h2 + y2) {
    isOverlap = false
  } else
    isOverlap = true
  return isOverlap
}

// devuelve el id del tile del mapa para las coordenadas xpos e ypos
function getMapTileId(xPos, yPos) {
  const brickSize = globals.level.imageSet.gridSize
  const levelData = globals.level.data

  const fil = Math.floor(yPos / brickSize)
  const col = Math.floor(xPos / brickSize)

  return levelData[fil][col]
}

// devuelve true si hay colision con un obstáculo determinado
function isCollidingWithObstacleAt(xPos, yPos, obstacleId) {

  let isColliding

  const id = getMapTileId(xPos, yPos)

  // calcular la colision con bloque de cristal
  if (id === obstacleId) {
    isColliding = true
  } else isColliding = false
  return isColliding
}