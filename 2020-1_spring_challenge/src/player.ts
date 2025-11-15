import {logComment, logPacs} from "./utils/logger";
import {Pac} from "./Pac";
import {PacType} from "./PacType";

/**
 * Grab the pellets as fast as you can!
 **/
var inputs: string[] = readline().split(' ');
const width: number = parseInt(inputs[0]); // size of the grid
const height: number = parseInt(inputs[1]); // top left corner is (x=0, y=0)
for (let i = 0; i < height; i++) {
    const row: string = readline(); // one line of the grid: space " " is floor, pound "#" is wall
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
    }
    const visiblePelletCount: number = parseInt(readline()); // all pellets in sight
    for (let i = 0; i < visiblePelletCount; i++) {
        var inputs: string[] = readline().split(' ');
        const x: number = parseInt(inputs[0]);
        const y: number = parseInt(inputs[1]);
        const value: number = parseInt(inputs[2]); // amount of points this pellet is worth
    }

    logPacs(pacs);

    // Write an action using console.log()
    // To debug: console.error('Debug messages...');

    logComment("Test comment");
    console.log('MOVE 0 15 10');     // MOVE <pacId> <x> <y>
}
