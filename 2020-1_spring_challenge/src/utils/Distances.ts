import { Position } from "./Position";
import { findShortestPath } from "../logic/PathFinder";
import { logComment } from "./Logger";

export function getEuclideanDistance(
  pos1: Position,
  pos2: Position,
  mapWidth: number,
): number {
  // Get Euclidean distance taking into account that the map wraps horizontally
  const horizontalDistance = Math.abs(pos1.x - pos2.x);

  const dx = Math.min(horizontalDistance, mapWidth - horizontalDistance);
  const dy = pos1.y - pos2.y;

  return Math.sqrt(dx * dx + dy * dy);
}

export function getDistanceFromOpponent(
  myPos: Position,
  enemyPos: Position,
  wallMap: boolean[][],
): number {
  var distance = -1;

  // Check bounds
  if (
    myPos.x < 0 ||
    myPos.x > wallMap[0].length - 1 ||
    myPos.y < 0 ||
    myPos.y > wallMap.length - 1
  ) {
    return distance;
  }

  if (!wallMap[myPos.y][myPos.x]) {
    const [newDistance, _]: [number, Position[]] = findShortestPath(
      myPos,
      enemyPos,
      wallMap,
    );

    return newDistance;
  }

  return distance;
}
