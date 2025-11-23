import { GameState } from "./game/GameState";
import { GameMap, initialiseGameMap } from "./game/GameMap";
import { generateMoves } from "./logic/MoveCalculator";
import { logFloor, logPacs, logPellets } from "./utils/Logger";

const gameMap: GameMap = initialiseGameMap();
const gameState = new GameState(gameMap);

// game loop
while (true) {
  gameState.update();

  // logFloor(gameState.map.floorMap);
  // logPacs("Opponent Pacs", gameState.opponentPacs);
  // logPellets("Large Pellets", gameState.largePellets);
  // logPellets("Small Pellets", gameState.smallPellets);

  // Write an action using console.log()
  // To debug: console.error('Debug messages...');

  const moves: string[] = generateMoves(gameState);

  logPacs("My Pacs", gameState.myPacs);

  console.log(moves.join(" | ")); // MOVE <pacId> <x> <y>
}
