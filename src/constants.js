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
  // estados PLAYER y ESQUELETO
  UP: 0,
  LEFT: 1,
  DOWN: 2,
  RIGHT: 3,

  // estados TOOLS
  STILL: 0,
}

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

//***** TEXT DATA
export const GameText = {
  GAME_OVER: "GAME OVER",
  GAME_NAME: "Forge In The Hell",
  GAME_NEW: "NEW GAME",
  GAME_CONTROLS: "CONTROLS",
  GAME_CONTROLS_TEXT: [
    "-TYPE 'A' TO GO LEFT",
    "-TYPE 'D' TO GO RIGHT",
    "-TYPE 'W' TO GO UP",
    "-TYPE 'S' TO GO DOWN",
    "-TYPE 'SPACE' TO HIT THE ENEMY",
    "",
    "-TYPE 'R' TO RESTORE THE AXE",
  ],
  GAME_STORY: "STORY",
  GAME_SCORES: "HIGH SCORES",
  SCORES: [
    {name: "JON", score: 100},
    {name: "BIL", score: 1000},
    {name: "DAN", score: 10000},
    {name: "RAY", score: 10},
    {name: "TOM", score: 1},
  ],
  GAME_STORY_TEXT: [
    "Veniam occaecat reprehenderit amet adipisicing ullamco irure minim elit ipsum",
    "Veniam occaecat reprehenderit amet adipisicing ullamco irure minim elit ipsum",
    "Veniam occaecat reprehenderit amet adipisicing ullamco irure minim elit ipsum",
    "Veniam occaecat reprehenderit amet adipisicing ullamco irure minim elit ipsum",
    "Veniam occaecat reprehenderit amet adipisicing ullamco irure minim elit ipsum",
    "Veniam occaecat reprehenderit amet adipisicing ullamco irure minim elit ipsum",
    "Veniam occaecat reprehenderit amet adipisicing ullamco irure minim elit ipsum",
    "Veniam occaecat reprehenderit amet adipisicing ullamco irure minim elit ipsum",
    "Veniam occaecat reprehenderit amet adipisicing ullamco irure minim elit ipsum",
  ],
  SHORTCUTS: "TYPE 'S' TO STORY - TYPE 'C' TO CONTROLS - TYPE 'H' TO HIGH SCORES - TYPE 'N' TO NEW GAME"
}
