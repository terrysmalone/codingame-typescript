import { GameState } from "./GameState";
import { getEuclideanDistance } from "../utils/Distances";

export function generateMoves(gameState: GameState) {
  // Simple first pass solution
  var moves: string[] = [];

  for (const pac of gameState.myPacs) {
    var move = "";

    if (pac.abilityCooldown === 0) {
      moves.push(`SPEED ${pac.id}`);
      continue;
    }

    var targetPellet = null;

    // Find the nearest large pellet
    var nearestLargePellet = Number.MAX_SAFE_INTEGER;

    for (const pellet of gameState.largePellets) {
      const distance = getEuclideanDistance(pellet, pac.position);
      if (distance < nearestLargePellet) {
        nearestLargePellet = distance;
        targetPellet = pellet;
      }
    }

    if (targetPellet) {
      moves.push(`MOVE ${pac.id} ${targetPellet.x} ${targetPellet.y}`);
      continue;
    }

    // Find the nearest small pellet
    var nearestSmallPellet = Number.MAX_SAFE_INTEGER;

    for (const pellet of gameState.smallPellets) {
      const distance = getEuclideanDistance(pellet, pac.position);
      if (distance < nearestSmallPellet) {
        nearestSmallPellet = distance;
        targetPellet = pellet;
      }
    }

    if (targetPellet) {
      moves.push(`MOVE ${pac.id} ${targetPellet.x} ${targetPellet.y}`);
      continue;
    }

    // No pellets found, make a random move
    var invalidMove: boolean = true;
    while (invalidMove) {
      const randomX = Math.floor(Math.random() * gameState.map.width);
      const randomY = Math.floor(Math.random() * gameState.map.height);
      if (!gameState.map.wallMap[randomY][randomX]) {
        moves.push(`MOVE ${pac.id} ${randomX} ${randomY}`);
        invalidMove = false;
      }
    }
  }

  return moves;
}
