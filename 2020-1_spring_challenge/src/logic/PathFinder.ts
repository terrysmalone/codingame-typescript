import { FloorType } from "../game/FloorType";
import { Position } from "../utils/Position";

export function findShortestPath(
  start: Position,
  end: Position,
  wallMap: boolean[],
  floorMap: FloorType[][],
): [number, Position] {
  var distance = 0;
  var nextPosition: Position = { x: start.x, y: start.y };

  // Path finding here

  return [distance, nextPosition];
}
