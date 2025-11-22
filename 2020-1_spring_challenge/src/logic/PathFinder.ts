import { Position } from "../utils/Position";
import { getEuclideanDistance } from "../utils/Distances";
import { Pac } from "../game/Pac";

export function findShortestPath(
  start: Position,
  end: Position,
  wallMap: boolean[][],
  enemyPacs: Pac[] = [],
  avoidEnemyPacs: boolean = false,
  myPacs: Pac[] = [],
  avoidMyPacPaths: boolean = false,
  maxDistance: number = Infinity,
): [number, Position[]] {
  var distance = 0;
  var path: Position[] = [];

  // A* algorithm with horizontal wrapping
  const width = wallMap[0].length;
  const height = wallMap.length;
  const openSet: Position[] = [start];
  const cameFrom = new Map<string, Position>();
  const gScore = new Map<string, number>();
  const fScore = new Map<string, number>();

  gScore.set(posKey(start), 0);
  fScore.set(posKey(start), getEuclideanDistance(start, end, width));

  while (openSet.length > 0) {
    // Get node in openSet with lowest fScore
    let currentIdx = 0;
    let current = openSet[0];
    for (let i = 1; i < openSet.length; i++) {
      if (
        (fScore.get(posKey(openSet[i])) ?? Infinity) <
        (fScore.get(posKey(current)) ?? Infinity)
      ) {
        current = openSet[i];
        currentIdx = i;
      }
    }

    if (current.x === end.x && current.y === end.y) {
      // Reconstruct path
      path = [];
      let curr = current;
      while (posKey(curr) !== posKey(start)) {
        path.unshift(curr);
        curr = cameFrom.get(posKey(curr))!;
      }
      path.unshift(start);
      distance = gScore.get(posKey(end)) ?? 0;
      break;
    }

    // Check max distance cutoff
    if ((gScore.get(posKey(current)) ?? Infinity) >= maxDistance) {
      // No valid path within maxDistance
      path = [];
      distance = 0;
      break;
    }

    openSet.splice(currentIdx, 1);

    const neighbors: Position[] = [];
    // Up
    if (current.y > 0) neighbors.push({ x: current.x, y: current.y - 1 });
    // Down
    if (current.y < height - 1)
      neighbors.push({ x: current.x, y: current.y + 1 });
    // Left (wrap)
    neighbors.push({ x: (current.x - 1 + width) % width, y: current.y });
    // Right (wrap)
    neighbors.push({ x: (current.x + 1) % width, y: current.y });

    for (const neighbor of neighbors) {
      if (wallMap[neighbor.y][neighbor.x]) {
        continue;
      }

      if (
        avoidEnemyPacs &&
        enemyPacs.some(
          (ep) => ep.position.x === neighbor.x && ep.position.y === neighbor.y,
        )
      ) {
        continue;
      }

      if (avoidMyPacPaths) {
        if (
          myPacs.some(
            (mp) =>
              mp.currentPath &&
              mp.currentPath.some(
                (pp) => pp.x === neighbor.x && pp.y === neighbor.y,
              ),
          )
        ) {
          continue;
        }
      }

      const tentative_gScore = (gScore.get(posKey(current)) ?? Infinity) + 1;
      if (tentative_gScore < (gScore.get(posKey(neighbor)) ?? Infinity)) {
        cameFrom.set(posKey(neighbor), current);
        gScore.set(posKey(neighbor), tentative_gScore);
        fScore.set(
          posKey(neighbor),
          tentative_gScore + getEuclideanDistance(neighbor, end, width),
        );
        if (!openSet.some((p) => posKey(p) === posKey(neighbor))) {
          openSet.push(neighbor);
        }
      }
    }
  }

  return [distance, path];
}

function posKey(pos: Position): string {
  return `${pos.x},${pos.y}`;
}
