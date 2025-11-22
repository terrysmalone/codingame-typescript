import { Position } from "./Position";

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
