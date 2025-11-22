import { GameState } from "../game/GameState";
import { logComment } from "../utils/Logger";
import { findShortestPath } from "./PathFinder";
import { Position } from "../utils/Position";

export function generateMoves(gameState: GameState) {
  var movesFound: boolean[] = new Array(gameState.myPacs.length).fill(false);
  var moves: string[] = [];

  // for each pac if it can use ability then speed up
  for (var i = 0; i < gameState.myPacs.length; i++) {
    const pac = gameState.myPacs[i];
    if (pac.abilityCooldown === 0) {
      moves.push(`SPEED ${pac.id}`);
      movesFound[i] = true;
    }
  }

  // if all moves are found return them
  if (movesFound.every((move) => move)) {
    return moves;
  }

  // for each large pellet, assign the nearest pac that hasn't moved yet
  for (const largePellet of gameState.largePellets) {
    logComment(
      `Considering large pellet at (${largePellet.x}, ${largePellet.y})`,
    );
    var nearestPacIndex: number = -1;
    var nearestDistance: number = Number.MAX_SAFE_INTEGER;

    for (let i = 0; i < gameState.myPacs.length; i++) {
      const pac = gameState.myPacs[i];
      if (movesFound[i]) {
        continue;
      }

      logComment(`Checking pac ${gameState.myPacs[i].id}`);

      const [distance, path]: [number, Position[]] = findShortestPath(
        pac.position,
        largePellet,
        gameState.map.wallMap,
        gameState.opponentPacs,
        true,
      );
      logComment(`Distance to pac ${pac.id} is ${distance}`);
      if (distance < nearestDistance) {
        nearestDistance = distance;
        nearestPacIndex = i;
      }
    }

    if (nearestPacIndex !== -1) {
      const pac = gameState.myPacs[nearestPacIndex];
      logComment(`Chosen pac ${pac.id}`);
      moves.push(`MOVE ${pac.id} ${largePellet.x} ${largePellet.y}`);
      movesFound[nearestPacIndex] = true;
    }
  }

  // if all moves are found return them
  if (movesFound.every((move) => move)) {
    return moves;
  }

  // for each pac, if it doesn't have an assigned move, send it to the nearest small pellet
  for (let i = 0; i < gameState.myPacs.length; i++) {
    if (movesFound[i]) {
      continue;
    }

    const pac = gameState.myPacs[i];
    var nearestPellet: { x: number; y: number } | null = null;
    nearestDistance = Number.MAX_SAFE_INTEGER;

    for (const smallPellet of gameState.smallPellets) {
      const [distance, path]: [number, Position[]] = findShortestPath(
        smallPellet,
        pac.position,
        gameState.map.wallMap,
        gameState.opponentPacs,
        true,
      );
      if (distance < nearestDistance) {
        nearestDistance = distance;
        nearestPellet = smallPellet;
      }
    }

    if (nearestPellet) {
      moves.push(`MOVE ${pac.id} ${nearestPellet.x} ${nearestPellet.y}`);
      movesFound[i] = true;
    }
  }

  // if all moves are found return them
  if (movesFound.every((move) => move)) {
    return moves;
  }

  // for each pac that doesn't have an assigned move make a random move
  for (let i = 0; i < gameState.myPacs.length; i++) {
    if (movesFound[i]) {
      continue;
    }

    var invalidMove: boolean = true;
    while (invalidMove) {
      const randomX = Math.floor(Math.random() * gameState.map.width);
      const randomY = Math.floor(Math.random() * gameState.map.height);
      if (!gameState.map.wallMap[randomY][randomX]) {
        const pac = gameState.myPacs[i];

        moves.push(`MOVE ${pac.id} ${randomX} ${randomY}`);
        invalidMove = false;
      }
    }
  }

  return moves;
}
