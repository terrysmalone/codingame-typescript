import {logComment, logPacs, logFloor} from "./utils/logger";
import {GameState} from "./game/GameState";
import {GameMap, initialiseGameMap} from "./game/GameMap";

const gameMap: GameMap = initialiseGameMap();
const gameState = new GameState(gameMap);

// game loop
while (true) {
    gameState.update();

    logFloor(gameState.map.floorMap);
    logPacs("My Pacs", gameState.myPacs);
    logPacs("Opponent Pacs", gameState.opponentPacs);

    // Write an action using console.log()
    // To debug: console.error('Debug messages...');

    logComment("Test comment");
    console.log('MOVE 0 15 10');     // MOVE <pacId> <x> <y>
}
