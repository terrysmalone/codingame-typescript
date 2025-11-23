import { GameState } from "../game/GameState";
import { findShortestPath } from "./PathFinder";
import { Position } from "../utils/Position";
import { getDistanceFromOpponent } from "../utils/Distances";
import { Pac } from "../game/Pac";
import { logComment } from "../utils/Logger";

export function generateMoves(gameState: GameState) {
  var moves: string[] = [];

  // for each pac if an enemy pac is within range and can be defeated then attack
  const attackRange: number = 4;

  for (var i = 0; i < gameState.myPacs.length; i++) {
    const pac = gameState.myPacs[i];

    if (pac.moveFound) {
      continue;
    }

    for (var j = 0; j < gameState.opponentPacs.length; j++) {
      const enemyPac = gameState.opponentPacs[j];

      const [distance, path]: [number, Position[]] = findShortestPath(
        pac.position,
        enemyPac.position,
        gameState.map.wallMap,
      );

      if (distance > 0 && distance <= attackRange) {
        // determine if pac can defeat enemyPac
        const canDefeat =
          (pac.pacType === "ROCK" && enemyPac.pacType === "SCISSORS") ||
          (pac.pacType === "SCISSORS" && enemyPac.pacType === "PAPER") ||
          (pac.pacType === "PAPER" && enemyPac.pacType === "ROCK");

        if (canDefeat) {
          if (distance >= 1 && enemyPac.abilityCooldown === 0) {
            // Hold still to see if enemy pac switches or moves closer
            moves.push(`MOVE ${pac.id} ${pac.position.x} ${pac.position.y}`);
            pac.task = `Holding position to bait enemy pac ${enemyPac.id}`;
            pac.moveFound = true;
            break;
          }

          // If they can't switch then attack
          if (enemyPac.abilityCooldown !== 0) {
            moves.push(
              `MOVE ${pac.id} ${enemyPac.position.x} ${enemyPac.position.y}`,
            );
            pac.task = `Attacking enemy pac ${enemyPac.id} at ${enemyPac.position.x} ${enemyPac.position.y}`;
            pac.currentPath = path;
            pac.moveFound = true;
            break;
          }
        }

        // I can't defeat them, can I switch
        if (pac.abilityCooldown === 0) {
          // change pac type to one that can defeat enemyPac
          let newType: string = "";
          if (enemyPac.pacType === "ROCK") newType = "PAPER";
          if (enemyPac.pacType === "PAPER") newType = "SCISSORS";
          if (enemyPac.pacType === "SCISSORS") newType = "ROCK";

          moves.push(`SWITCH ${pac.id} ${newType}`);
          pac.task = `Switching type to ${newType} to defeat enemy pac ${enemyPac.id}`;
          pac.moveFound = true;
          break;
        }

        // I can't defeat them or switch, just run
        var moveFound: boolean = getFleeMove(
          pac,
          moves,
          enemyPac.position,
          distance,
          gameState.map.wallMap,
        );
        if (moveFound) break;
      }
    }
  }

  // if all moves are found return them
  if (gameState.myPacs.every((pac) => pac.moveFound)) return moves;

  // for each pac if it can use ability then speed up
  for (var i = 0; i < gameState.myPacs.length; i++) {
    const pac = gameState.myPacs[i];
    if (pac.moveFound) {
      continue;
    }
    if (pac.abilityCooldown === 0) {
      moves.push(`SPEED ${pac.id}`);
      pac.task = "Doing speed boost";
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

    // logComment(
    //   `Finding nearest small pellet for Pac ${pac.id} at (${pac.position.x}, ${pac.position.y})`,
    // );
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
        10,
      );

      if (distance > 0 && distance < nearestDistance) {
        // logComment(
        //   `Nearest distance for ${pac.id} is now ${distance} to pellet at (${smallPellet.x}, ${smallPellet.y})`,
        // );
        nearestDistance = distance;
        nearestPellet = smallPellet;
        nearestPath = path;
      }
    }

    if (nearestPellet) {
      moves.push(`MOVE ${pac.id} ${nearestPellet.x} ${nearestPellet.y}`);
      pac.task = `Going for small pellet at ${nearestPellet.x} ${nearestPellet.y}`;
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
        pac.task = `Making random move to ${randomX} ${randomY}`;
        invalidMove = false;
      }
    }
  }

  return moves;
}

type PelletPairings = {
  pelletIndex: number;
  pacIndex: number;
  distance: number;
  path: Position[];
};

function assignToPellets(
  gameState: GameState,
  pellets: Position[],
  moves: string[],
) {
  var pairings: PelletPairings[] = [];
  // for each pellet get the distance to each pac that hasn't moved yet and add it to pairings
  for (let i = 0; i < pellets.length; i++) {
    const pellet = pellets[i];

    for (let j = 0; j < gameState.myPacs.length; j++) {
      const pac = gameState.myPacs[j];
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

      pairings.push({
        pelletIndex: i,
        pacIndex: j,
        distance: distance,
        path: path,
      });
    }
  }

  pairings.sort((a, b) => a.distance - b.distance);

  // assign pellets to pacs based on shortest distance
  const assignedPellets = new Set<number>();
  const assignedPacs = new Set<number>();

  for (const pairing of pairings) {
    if (
      !assignedPellets.has(pairing.pelletIndex) &&
      !assignedPacs.has(pairing.pacIndex)
    ) {
      const pac = gameState.myPacs[pairing.pacIndex];
      moves.push(
        `MOVE ${pac.id} ${pellets[pairing.pelletIndex].x} ${pellets[pairing.pelletIndex].y}`,
      );
      pac.task = `Going for large pellet at ${pellets[pairing.pelletIndex].x} ${pellets[pairing.pelletIndex].y}`;
      pac.moveFound = true;
      pac.currentPath = pairing.path;

      assignedPellets.add(pairing.pelletIndex);
      assignedPacs.add(pairing.pacIndex);
    }
  }
}

function getFleeMove(
  pac: Pac,
  moves: string[],
  enemyPos: Position,
  distance: number,
  wallMap: boolean[][],
): boolean {
  // check up
  if (
    tryMove(
      pac,
      { x: pac.position.x, y: pac.position.y - 1 },
      enemyPos,
      wallMap,
      distance,
      moves,
    )
  ) {
    return true;
  }

  // check down
  if (
    tryMove(
      pac,
      { x: pac.position.x, y: pac.position.y + 1 },
      enemyPos,
      wallMap,
      distance,
      moves,
    )
  ) {
    return true;
  }

  // check left
  if (
    tryMove(
      pac,
      { x: pac.position.x - 1, y: pac.position.y },
      enemyPos,
      wallMap,
      distance,
      moves,
    )
  ) {
    return true;
  }

  // check right
  if (
    tryMove(
      pac,
      { x: pac.position.x + 1, y: pac.position.y },
      enemyPos,
      wallMap,
      distance,
      moves,
    )
  ) {
    return true;
  }

  return false;
}

function tryMove(
  pac: Pac,
  movePos: Position,
  enemyPos: Position,
  wallMap: boolean[][],
  distance: number,
  moves: string[],
): boolean {
  var moveDistance = getDistanceFromOpponent(movePos, enemyPos, wallMap);

  if (moveDistance > distance) {
    moves.push(`MOVE ${pac.id} ${movePos.x} ${movePos.y}`);
    pac.task = `Running away from enemy at ${enemyPos.x} ${enemyPos.y}`;
    pac.currentPath = [movePos];
    pac.moveFound = true;
    return true;
  }

  return false;
}
