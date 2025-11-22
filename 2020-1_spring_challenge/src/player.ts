import { logPacs, logFloor, logPellets } from "./utils/Logger";
import { GameState } from "./game/GameState";
import { GameMap, initialiseGameMap } from "./game/GameMap";
import { generateMoves } from "./game/MoveCalculator";

const gameMap: GameMap = initialiseGameMap();
const gameState = new GameState(gameMap);

// game loop
while (true) {
  gameState.update();

  logFloor(gameState.map.floorMap);
  logPacs("My Pacs", gameState.myPacs);
  logPacs("Opponent Pacs", gameState.opponentPacs);
  logPellets("Large Pellets", gameState.largePellets);
  logPellets("Small Pellets", gameState.smallPellets);

  // Write an action using console.log()
  // To debug: console.error('Debug messages...');

  const moves: string[] = generateMoves(gameState);

  console.log(moves.join(" | ")); // MOVE <pacId> <x> <y>
}
