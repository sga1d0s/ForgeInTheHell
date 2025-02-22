//***** TEXT DATA
export const GameText = {
  GAME_OVER: "GAME OVER",
  GAME_NAME: "FORGE IN THE HELL",
  GAME_NEW: "NEW GAME",
  GAME_CONTROLS: "CONTROLS",
  GAME_CONTROLS_TEXT: [
    "-TYPE 'A' TO MOVE LEFT",
    "-TYPE 'D' TO MOVE RIGHT",
    "-TYPE 'W' TO MOVE UP",
    "-TYPE 'S' TO MOVE DOWN",
    "-TYPE 'SPACE' TO HIT THE ENEMY",
    "",
    "-TYPE 'R' TO RESTORE THE AXE",
  ],
  GAME_SCORES: "HIGH SCORES",
  SCORES: [
    { name: "JON", score: 100 },
    { name: "BIL", score: 1000 },
    { name: "DAN", score: 10000 },
    { name: "RAY", score: 10 },
    { name: "TOM", score: 1 },
  ],
  GAME_STORY: "STORY",
  GAME_STORY_TITTLE: "THE FORGE...",
  GAME_STORY_TEXT: "That morning something different was haunting John Smith's forge... a darkness hung over the village. John was well aware that it was something he harbored in his possession that was causing it. At last he had found the mallet of destiny with which to forge extraordinary wonders. But... undoubtedly that would make others want to get hold of the magnificent mallet...",
  SHORTCUTS: "--- SELECT WITH ARROWS --- PRESS 'ENTER' TO CONFIRM ---",
  GAME_LOADING: "LOADING..."
}

// estados del juego
export const Game = {
  INVALID: -1,
  LOADING: 0,
  PLAYING: 1,

  OVER: 2,
  STORY: 3,
  CONTROLS: 4,
  SCORES: 5,
  NEW_GAME: 6,
}

// velocidad del juevo
export const FPS = 30

// identificador de tipo de Sprite (ID)
export const SpriteID = {
  PLAYER: 0,
  SKELETON: 1,
  FORGE: 2,
  TABLE: 3,
  TOOLS: 4,
  HAMMER: 5
}

// identificador de estado de sprite (dirección)
export const State = {
  STILL_UP: 1,
  STILL_LEFT: 2,
  STILL_DOWN: 3,
  STILL_RIGHT: 4,

  UP_LEFT: 7,
  UP_RIGHT: 5,
  DOWN_LEFT: 6,
  DOWN_RIGHT: 8,

  UP: 9,
  LEFT: 10,
  DOWN: 11,
  RIGHT: 12,

  ATTACK_UP: 13,
  ATTACK_LEFT: 16,
  ATTACK_DOWN: 15,
  ATTACK_RIGHT: 14,

  DEATH: 21,

  STILL: 0,
};

// diferentes TileSets
export const Tile = {
  SIZE_64: 0,
  SIZE_32: 1,
}

// id de bloque del mapa
export const Block = {
  EMPTY: 0,
  WALL_LEFT: 1,
  WALL: 2,
  WALL_RIGHT: 3,
  FLOOR_1: 4,
  FLOOR_2: 5,
  FLOOR_3: 6,
  FLOOR_4: 7,
  FORGE: 8,
}

// Keyboard key codes
export const Key = {
  LEFT: 37,
  UP: 38,
  RIGHT: 39,
  DOWN: 40,
  SPACE: 32,
  ENTER: 13,

  W: 87,
  S: 83,
  A: 65,
  D: 68,
}

// crear el strikeBox(xSize, ySize, xOffset, yOffset)
export const StrikeBox = [
  { // NONE
    xSize: 0,
    ySize: 0,
    xOffset: -1000,
    yOffset: -1000,
  },
  { // UP
    xSize: 30,
    ySize: 17,
    xOffset: 10,
    yOffset: 10,
  },
  { // LEFT
    xSize: 20,
    ySize: 30,
    xOffset: 0,
    yOffset: 10,
  },
  { // DOWN
    xSize: 30,
    ySize: 17,
    xOffset: 10,
    yOffset: 39,
  },
  { // RIGHT
    xSize: 25,
    ySize: 30,
    xOffset: 40,
    yOffset: 10,
  },
  { // NONE
    xSize: 0,
    ySize: 0,
    xOffset: 0,
    yOffset: 10,
  },
]

// tiempo inicial de aparicion de esqueleto
export const InitialTimeNewSkeleton = 10