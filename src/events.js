import { Key } from "./constants.js"
import globals from "./globals.js";

export function keydownHandler(event) {
  switch (event.keyCode) {
    case Key.W:
    case Key.UP:
      globals.action.moveUp = true
      break;
    case Key.S:
    case Key.DOWN:
      globals.action.moveDown = true
      break;
    case Key.A:
    case Key.LEFT:
      globals.action.moveLeft = true
      break;
    case Key.D:
    case Key.RIGHT:
      globals.action.moveRight = true
      break;
    case Key.SPACE:
      globals.action.attack = true
      break;
    case Key.ENTER:
      globals.action.enter = true
      break;

    default:
      break;
  }
}

export function keyupHandler(event) {
  switch (event.keyCode) {
    case Key.W:
    case Key.UP:
      globals.action.moveUp = false
      break;
    case Key.S:
    case Key.DOWN:
      globals.action.moveDown = false
      break;
    case Key.A:
    case Key.LEFT:
      globals.action.moveLeft = false
      break;
    case Key.D:
    case Key.RIGHT:
      globals.action.moveRight = false
      break;
    case Key.SPACE:
      globals.action.attack = false
      break;

    default:
      break;
  }
}