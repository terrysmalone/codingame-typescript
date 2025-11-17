import {logComment, logPacs, logFloor} from "./utils/logger";
import {Pac} from "./Pac";
import {PacType} from "./PacType";
import {FloorType} from "./FloorType";

/**
 * Grab the pellets as fast as you can!
 **/
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
        } else {
            wallMap[y][x] = true;
            floorMap[y][x] = FloorType.Wall;
        }
    }
}

// game loop
while (true) {
    var pacs: Pac[] = [];

    var inputs: string[] = readline().split(' ');
    const myScore: number = parseInt(inputs[0]);
    const opponentScore: number = parseInt(inputs[1]);
    const visiblePacCount: number = parseInt(readline()); // all your pacs and enemy pacs in sight

    for (let i = 0; i < visiblePacCount; i++) {
        var inputs: string[] = readline().split(' ');
        const pacId: number = parseInt(inputs[0]); // pac number (unique within a team)
        const mine: boolean = inputs[1] !== '0'; // true if this pac is yours
        const x: number = parseInt(inputs[2]); // x position in the grid
        const y: number = parseInt(inputs[3]); // y position in the grid
        const typeId: string = inputs[4] as PacType; // Rock, Scissors, Paper, dead
        const speedTurnsLeft: number = parseInt(inputs[5]); // remaining turns before the speed effect fades
        const abilityCooldown: number = parseInt(inputs[6]); // turns until you can request a new ability for this pac

        if (mine) {
            pacs.push(<Pac>{
                id: pacId,
                xPos: x,
                yPos: y,
                pacType: typeId,
                speedTurnsLeft: speedTurnsLeft,
                abilityCooldown: abilityCooldown,
            })
        }

        // TODO: If it's a pac that's not mine log it's position

        floorMap[y][x] = FloorType.Empty;
    }
    const visiblePelletCount: number = parseInt(readline()); // all pellets in sight
    for (let i = 0; i < visiblePelletCount; i++) {
        var inputs: string[] = readline().split(' ');
        const x: number = parseInt(inputs[0]);
        const y: number = parseInt(inputs[1]);
        const value: number = parseInt(inputs[2]); // amount of points this pellet is worth

        // Update map
        if (value == 1) {
            floorMap[y][x] = FloorType.SmallPellet;
        } else {
            floorMap[y][x] = FloorType.LargePellet;
        }

        // TODO: extrapolate empty squares at some point by working out everywhere
        // each pac can see and subtracting the above
    }

    logFloor(floorMap);
    logPacs(pacs);

    // Write an action using console.log()
    // To debug: console.error('Debug messages...');

    logComment("Test comment");
    console.log('MOVE 0 15 10');     // MOVE <pacId> <x> <y>
}
