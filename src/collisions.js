import globals from "./globals.js"
import { Block, SpriteID, State } from "./constants.js"

export default function detectCollisions() {
  // calcular colision del player con cada uno de los sprites
  for (let i = 4; i < globals.sprites.length; i++) {
    const sprite = globals.sprites[i]

    // colision entre player y sprites
    detectCollisionBetweenPlayerAndSprites(sprite)

    // colision entre skeleton y sprites
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

  if (sprite.state !== State.DEATH && sprite.id !== SpriteID.SKELETON) {
    switch (direction) {

      case State.RIGHT:
        // posiciones de PLAYER hacia la derecha
        xPos = player.xPos

        if (isOverlap) {
          // existe colision a la derecha
          player.isCollidingWithObstacleOnTheRight = true

          // AJUSTE: Calcular solapamiento y mover el personaje lo correspondiente
          overlap = Math.floor(xPos) % player.hitBox.xSize
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
          overlap = Math.floor(xPos) % player.hitBox.xSize
          player.xPos += overlap
        }
        break

      case State.UP:
      case State.UP_LEFT:
      case State.UP_RIGHT:
        // primera colisión en (xPos, yPos)
        yPos = player.yPos

        if (isOverlap) {
          // existe colisión hacia arriba
          player.isCollidingWithObstacleOnTheTop = true;

          // AJUSTE: Calcular solapamiento y mover el personaje lo correspondiente
          overlap = Math.floor(yPos) % player.hitBox.ySize + 5;
          player.yPos += overlap
        }
        break;

      case State.DOWN:
      case State.DOWN_LEFT:
      case State.DOWN_RIGHT:
        // primera colisión en (xPos, yPos)
        yPos = player.yPos

        if (isOverlap) {
          // existe colisión hacia arriba
          player.isCollidingWithObstacleOnTheTop = true;

          // AJUSTE: Calcular solapamiento y mover el personaje lo correspondiente
          overlap = Math.floor(yPos) % player.hitBox.ySize + 5;
          player.yPos -= overlap
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

    // verificar si hay intersección
    const isOverlap = rectIntersect(x1, y1, w1, h1, x2, y2, w2, h2);

    if (isOverlap && otherSprite.id != SpriteID.SKELETON) {
      // ajustar la posición del esqueleto y cambiar su dirección
      let overlap;
      // ESQUELETO
      switch (sprite.state) {
        // ESQUELETO
        case State.UP:
          overlap = Math.floor(sprite.yPos) % sprite.hitBox.ySize + 10;
          sprite.yPos += overlap
          sprite.state = State.DOWN
          break
        // ESQELETO
        case State.DOWN:
          switch (otherSprite.state) {
            // PLAYER
            case State.RIGHT:
              overlap = Math.floor(sprite.xPos) % sprite.hitBox.xSize + 10;
              sprite.xPos += overlap
              sprite.state = State.RIGHT
              break;
            // PLAYER
            case State.LEFT:
              overlap = Math.floor(sprite.xPos) % sprite.hitBox.xSize + 10;
              sprite.xPos -= overlap
              sprite.state = State.LEFT
              break;
            // DEFAULT
            default:
              overlap = Math.floor(sprite.yPos) % sprite.hitBox.ySize + 10;
              sprite.yPos -= overlap
              sprite.state = State.UP
              break
          }
          break
        // ESQUELETO
        case State.LEFT:
          overlap = Math.floor(sprite.xPos) % sprite.hitBox.xSize + 10;
          sprite.xPos += overlap
          sprite.state = State.RIGHT
          break;
        // ESQUELETO
        case State.RIGHT:
          switch (otherSprite.state) {
            // PLAYER
            case State.UP:
              overlap = Math.floor(sprite.yPos) % sprite.hitBox.ySize + 10;
              sprite.yPos -= overlap
              sprite.state = State.UP
              break;
            // PLAYER
            case State.DOWN:
              overlap = Math.floor(sprite.yPos) % sprite.hitBox.ySize + 10;
              sprite.yPos += overlap
              sprite.state = State.DOWN
              break;
            // DEFAULT
            default:
              overlap = Math.floor(sprite.xPos) % sprite.hitBox.xSize + 10;
              sprite.xPos -= overlap
              sprite.state = State.LEFT
              break
          }
          break
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
  let isCollidingOnPos3
  let isCollidingOnPos4
  let isCollidingOnPos6

  let isColliding
  let isCollidingLeft
  let isCollidingRight
  let isCollidingUp
  let isCollidingDown
  let overlap

  let overlapX
  let overlapY

  const brickSize = globals.level.imageSet.gridSize
  const direction = player.state

  // ID del obstáculo
  const obstacleIdW = Block.WALL
  const obstacleIdWl = Block.WALL_LEFT
  const obstacleIdWr = Block.WALL_RIGHT
  const obstacleIdFl = Block.FLOOR_2

  switch (direction) {

    case State.UP_RIGHT:
    case State.DOWN_RIGHT:
    case State.RIGHT:
      // primera colision en (xpos + xsize -1, ypos)
      xPos = player.xPos + player.hitBox.xOffset + player.hitBox.xSize - 1

      yPos = player.yPos + player.hitBox.yOffset
      isCollidingOnPos1 = isCollidingWithObstacleAt(xPos, yPos, obstacleIdFl)
      isCollidingOnPos1 ? console.log("POS 1") : false

      // ultima colision en (xpos + xsize - 1, ypos + ysize -1)
      yPos = player.yPos + player.hitBox.yOffset + player.hitBox.ySize - 1
      isCollidingOnPos3 = isCollidingWithObstacleAt(xPos, yPos, obstacleIdFl)
      isCollidingOnPos3 ? console.log("POS 3") : false

      // habrá colision si toca alguno de los 3 bloques
      isColliding = isCollidingOnPos1 || isCollidingOnPos3

      if (isColliding) {
        // existe colision a la derecha
        player.isCollidingWithObstacleOnTheRight = true

        // AJUSTE: Calcular solapamiento y mover el personaje lo correspondiente
        overlap = Math.floor(xPos) % brickSize + 1
        player.xPos -= overlap
      }

      break;

    case State.UP_LEFT:
    case State.DOWN_LEFT:
    case State.LEFT:
      // primera colision en (xpos + xsize -1, ypos)
      xPos = player.xPos + player.hitBox.xOffset - 1
      yPos = player.yPos + player.hitBox.yOffset
      isCollidingOnPos1 = isCollidingWithObstacleAt(xPos, yPos, obstacleIdFl)

      // ultima colision en (xpos + xsize - 1, ypos + ysize -1)
      yPos = player.yPos + player.hitBox.yOffset + player.hitBox.ySize - 1
      isCollidingOnPos3 = isCollidingWithObstacleAt(xPos, yPos, obstacleIdFl)

      // habrá colision si toca alguno de los 3 bloques
      isColliding = isCollidingOnPos1 || isCollidingOnPos3

      if (isColliding) {
        // existe colision a la derecha
        player.isCollidingWithObstacleOnTheLeft = true

        // AJUSTE: Calcular solapamiento y mover el personaje lo correspondiente
        overlap = Math.floor(xPos) % brickSize + 1
        player.xPos -= overlap - brickSize
      }
      break

    case State.DOWN:
      // primera colisión en (xPos, yPos + ySize - 1)
      yPos = player.yPos + player.hitBox.yOffset + player.hitBox.ySize - 1;

      xPos = player.xPos + player.hitBox.xOffset;
      isCollidingOnPos1 = isCollidingWithObstacleAt(xPos, yPos, obstacleIdFl)
      isCollidingOnPos1? console.log("POS 1"): false

      // segunda colisión en (xPos + brickSize, yPos)
      xPos = player.xPos + brickSize - 3;
      isCollidingOnPos3 = isCollidingWithObstacleAt(xPos, yPos, obstacleIdFl)
      isCollidingOnPos3 ? console.log("POS 3") : false

      // habrá colisión si toca alguno de los 3 bloques
      isColliding = isCollidingOnPos1 || isCollidingOnPos3;

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
      yPos = player.yPos + player.hitBox.yOffset - 1;

      xPos = player.xPos + player.hitBox.xOffset + player.hitBox.xSize
      isCollidingOnPos1 = isCollidingWithObstacleAt(xPos, yPos, obstacleIdFl);
      isCollidingOnPos1? console.log("UP POS 1"): false

      // segunda colisión en (xPos + brickSize, yPos)
      xPos = player.xPos + player.hitBox.xOffset;
      isCollidingOnPos6= isCollidingWithObstacleAt(xPos, yPos, obstacleIdFl);
      isCollidingOnPos6? console.log("UP POS 6"): false

      // habrá colisión si toca alguno de los 3 bloques
      isColliding = isCollidingOnPos1 || isCollidingOnPos6;

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
      globals.score = globals.score + 10
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