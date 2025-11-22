import { GameState } from "../game/GameState";
import { logComment } from "../utils/Logger";
import { findShortestPath } from "./PathFinder";
import { Position } from "../utils/Position";

export function generateMoves(gameState: GameState) {
  var moves: string[] = [];

  // for each pac if it can use ability then speed up
  for (var i = 0; i < gameState.myPacs.length; i++) {
    const pac = gameState.myPacs[i];
    if (pac.abilityCooldown === 0) {
      moves.push(`SPEED ${pac.id}`);
      pac.moveFound = true;
    }
  }

  // if all pacs have moveFound == true
  if (gameState.myPacs.every((pac) => pac.moveFound)) return moves;

  // for each large pellet, assign the nearest pac that hasn't moved yet
  assignToPellets(gameState, gameState.largePellets, moves);

  // if all moves are found return them
  if (gameState.myPacs.every((pac) => pac.moveFound)) return moves;

  // for each pac, if it doesn't have an assigned move, send it to the nearest small pellet
  for (let i = 0; i < gameState.myPacs.length; i++) {
    const pac = gameState.myPacs[i];

    if (pac.moveFound) {
      continue;
    }

    logComment(
      `Finding nearest small pellet for Pac ${pac.id} at (${pac.position.x}, ${pac.position.y})`,
    );
    var nearestPellet: { x: number; y: number } | null = null;
    var nearestDistance = Number.MAX_SAFE_INTEGER;
    var nearestPath: Position[] = [];

    for (const smallPellet of gameState.smallPellets) {
      const [distance, path]: [number, Position[]] = findShortestPath(
        pac.position,
        smallPellet,
        gameState.map.wallMap,
        gameState.opponentPacs,
        true,
        gameState.myPacs,
        true,
      );

      if (distance > 0 && distance < nearestDistance) {
        logComment(
          `Nearest distance for ${pac.id} is now ${distance} to pellet at (${smallPellet.x}, ${smallPellet.y})`,
        );
        nearestDistance = distance;
        nearestPellet = smallPellet;
        nearestPath = path;
      }
    }

    if (nearestPellet) {
      moves.push(`MOVE ${pac.id} ${nearestPellet.x} ${nearestPellet.y}`);
      pac.currentPath = nearestPath;
      pac.moveFound = true;
    }
  }

  // if all moves are found return them
  if (gameState.myPacs.every((pac) => pac.moveFound)) return moves;

  // for each pac that doesn't have an assigned move make a random move
  for (let i = 0; i < gameState.myPacs.length; i++) {
    const pac = gameState.myPacs[i];

    if (pac.moveFound) {
      continue;
    }

    var invalidMove: boolean = true;
    while (invalidMove) {
      const randomX = Math.floor(Math.random() * gameState.map.width);
      const randomY = Math.floor(Math.random() * gameState.map.height);
      if (!gameState.map.wallMap[randomY][randomX]) {
        moves.push(`MOVE ${pac.id} ${randomX} ${randomY}`);
        pac.currentPath = [{ x: randomX, y: randomY }];
        invalidMove = false;
      }
    }
  }

  return moves;
}

function assignToPellets(
  gameState: GameState,
  pellets: Position[],
  moves: string[],
) {
  for (const pellet of pellets) {
    var nearestPacIndex: number = -1;
    var nearestDistance: number = Number.MAX_SAFE_INTEGER;
    var nearestPath: Position[] = [];

    for (let i = 0; i < gameState.myPacs.length; i++) {
      const pac = gameState.myPacs[i];
      if (pac.moveFound) {
        continue;
      }

      const [distance, path]: [number, Position[]] = findShortestPath(
        pac.position,
        pellet,
        gameState.map.wallMap,
        gameState.opponentPacs,
        true,
        gameState.myPacs,
        true,
      );

      if (distance > 0 && distance < nearestDistance) {
        nearestDistance = distance;
        nearestPacIndex = i;
        nearestPath = path;
      }
    }

    if (nearestPacIndex !== -1) {
      const pac = gameState.myPacs[nearestPacIndex];
      moves.push(`MOVE ${pac.id} ${pellet.x} ${pellet.y}`);
      pac.moveFound = true;
      pac.currentPath = nearestPath;
    }
  }
}
