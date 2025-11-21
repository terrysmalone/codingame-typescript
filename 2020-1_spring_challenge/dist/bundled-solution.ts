// Auto-generated bundle - Do not edit directly

// --- src/game/Pac.ts ---
enum PacType {
    ROCK = "ROCK",
    PAPER = "PAPER",
    SCISSORS = "SCISSORS",
    DEAD = "DEAD"
}
interface Pac {
    id: number;
    xPos: number;
    yPos: number;
    pacType: PacType;
    speedTurnsLeft: number;
    abilityCooldown: number;
}

// --- src/game/FloorType.ts ---
enum FloorType {
    Unknown,
    Empty,
    SmallPellet,
    LargePellet,
    Wall
}

// --- src/utils/logger.ts ---
function logComment(comment: string): void {
    console.error(`Comment: ${comment}`);
}
function logPacs(pacs: Pac[]): void {
    for (const pac of pacs) {
        console.error(`Pac: ${pac.id}`);
        console.error(`Pos: (${pac.xPos}, ${pac.yPos})`);
        console.error(`Type: ${pac.pacType}`);
        console.error(`Speed turns left: ${pac.speedTurnsLeft}`);
        console.error(`Ability cooldown: (${pac.abilityCooldown})`);
        console.error();
    }
}
function logFloor(floorMap: FloorType[][]): void {
    const wall: string = "\u2B1C";
    const empty: string = "\u2B1B";
    const unknown: string = "❓\uFE0F";
    const smallPellet: string = "\u25FD\uFE0F";
    const largePellet: string = "\u26AA";
    console.error("Walls");
    for (let y = 0; y < floorMap.length; y++) {
        var row: string = "";
        for (let x = 0; x < floorMap[y].length; x++) {
            var tile: string = unknown;
            switch (floorMap[y][x]) {
                case FloorType.Wall:
                    tile = wall;
                    break;
                case FloorType.Unknown:
                    tile = unknown;
                    break;
                case FloorType.SmallPellet:
                    tile = smallPellet;
                    break;
                case FloorType.LargePellet:
                    tile = largePellet;
                    break;
                case FloorType.Empty:
                    tile = empty;
                    break;
            }
            row += tile;
        }
        console.error(row);
    }
}

// --- src/utils/Position.ts ---
interface Position {
    x: number;
    y: number;
}

// --- src/game/GameMap.ts ---
interface GameMap {
    width: number;
    height: number;
    floorMap: FloorType[][];
    wallMap: boolean[][];
}
function initialiseGameMap(): GameMap {
    var inputs: string[] = readline().split(' ');
    const width: number = parseInt(inputs[0]); // size of the grid
    const height: number = parseInt(inputs[1]); // top left corner is (x=0, y=0)
    // Even though we add walls to the floor map, track them here too
    // for faster lookup
    var wallMap: boolean[][] = [];
    var floorMap: FloorType[][] = [];
    for (let y = 0; y < height; y++) {
        wallMap[y] = [];
        floorMap[y] = [];
        const row: string = readline(); // one line of the grid: space " " is floor, pound "#" is wall
        const tiles = row.split("");
        for (let x = 0; x < tiles.length; x++) {
            if (tiles[x] == " ") {
                wallMap[y][x] = false;
                floorMap[y][x] = FloorType.Unknown;
            }
            else {
                wallMap[y][x] = true;
                floorMap[y][x] = FloorType.Wall;
            }
        }
    }
    const map: GameMap = {
        width: width,
        height: height,
        floorMap: floorMap,
        wallMap: wallMap,
    };
    return map;
}

// --- src/game/GameState.ts ---
class GameState {
    turn: number = 0;
    myScore: number = 0;
    opponentScore: number = 0;
    map: GameMap;
    pacs: Pac[] = [];
    smallPellets: Position[] = [];
    largePellets: Position[] = [];
    constructor(map: GameMap) {
        this.map = map;
    }
    public update() {
        var inputs: string[] = readline().split(' ');
        this.myScore = parseInt(inputs[0]);
        this.opponentScore = parseInt(inputs[1]);
        this.pacs = [];
        const visiblePacCount: number = parseInt(readline()); // all your pacs and enemy pacs in sight
        for (let i = 0; i < visiblePacCount; i++) {
            inputs = readline().split(' ');
            const pacId: number = parseInt(inputs[0]); // pac number (unique within a team)
            const mine: boolean = inputs[1] !== '0'; // true if this pac is yours
            const x: number = parseInt(inputs[2]); // x position in the grid
            const y: number = parseInt(inputs[3]); // y position in the grid
            const typeId: string = inputs[4] as PacType; // Rock, Scissors, Paper, dead
            const speedTurnsLeft: number = parseInt(inputs[5]); // remaining turns before the speed effect fades
            const abilityCooldown: number = parseInt(inputs[6]); // turns until you can request a new ability for this pac
            if (mine) {
                this.pacs.push(<Pac>{
                    id: pacId,
                    xPos: x,
                    yPos: y,
                    pacType: typeId,
                    speedTurnsLeft: speedTurnsLeft,
                    abilityCooldown: abilityCooldown,
                });
            }
            // TODO: If it's a pac that's not mine log it's position
            this.updateCell(x, y, FloorType.Empty);
        }
        const visiblePelletCount: number = parseInt(readline()); // all pellets in sight
        for (let i = 0; i < visiblePelletCount; i++) {
            var inputs: string[] = readline().split(' ');
            const x: number = parseInt(inputs[0]);
            const y: number = parseInt(inputs[1]);
            const value: number = parseInt(inputs[2]); // amount of points this pellet is worth
            // Update map
            if (value == 1) {
                this.updateCell(x, y, FloorType.SmallPellet);
            }
            else {
                this.updateCell(x, y, FloorType.LargePellet);
            }
            // TODO: extrapolate empty squares at some point by working out everywhere
            // each pac can see and subtracting the above
        }
    }
    private updateCell(x: number, y: number, floorType: FloorType) {
        this.map.floorMap[y][x] = floorType;
        // TODO: Update pellets lists based on above
        // If floor type is empty check if we need to clear pellets
        // else if floor type is a pellet check if we need to add to the pellets list
    }
}

// --- src/player.ts ---
const gameMap: GameMap = initialiseGameMap();
const gameState = new GameState(gameMap);
// game loop
while (true) {
    gameState.update();
    logFloor(gameState.map.floorMap);
    logPacs(gameState.pacs);
    // Write an action using console.log()
    // To debug: console.error('Debug messages...');
    logComment("Test comment");
    console.log('MOVE 0 15 10'); // MOVE <pacId> <x> <y>
}

