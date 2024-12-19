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
  GAME_STORY_TEXT: [
    "That morning something different was haunting",
    "John Smith's forge... a darkness hung over the village.",
    "John was well aware that it was something he harbored in",
    "his possession that was causing it. At last he had found",
    "the mallet of destiny with which to forge extraordinary",
    "wonders. But... undoubtedly that would make others want",
    "to get hold of the magnificent mallet...               ",
  ],
  SHORTCUTS: "--- SELECT WITH ARROWS --- PRESS 'ENTER' TO CONFIRM ---"
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
  UP: 0,
  LEFT: 1,
  DOWN: 2,
  RIGHT: 3,
  STILL_UP: 4,
  STILL_LEFT: 5,
  STILL_DOWN: 6,
  STILL_RIGHT: 7,
  UP_LEFT: 16,
  UP_RIGHT: 15,
  DOWN_LEFT: 18,
  DOWN_RIGHT: 17,

  STILL: 0
};

// diferentes TileSets
export const Tile = {
  SIZE_64: 0,
  SIZE_32: 1,
}

// id de bloque del mapa
export const Block = {
  EMPTY: 0,
  VINES: 1,
  BROWN_1: 2,
  BROWN_2: 3,
  DARK_1: 4,
  GRAY: 5,
  CRYSTAL_1: 6,
  CRYSTAL_2: 7,
}

// Keyboard key codes
export const Key = {
  UP: 38,
  DOWN: 40,
  RIGHT: 39,
  LEFT: 37,
}
