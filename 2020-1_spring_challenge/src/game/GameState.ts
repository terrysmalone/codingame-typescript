import {Pac, PacType} from "./Pac";
import {Position} from "../utils/Position";
import {GameMap} from "./GameMap";
import {FloorType} from "./FloorType";

export class GameState {
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
                })
            }

            // TODO: If it's a pac that's not mine log it's position
            this.updateCell(x, y, FloorType.Empty)
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
            } else {
                this.updateCell(x, y, FloorType.LargePellet);
            }

            // TODO: extrapolate empty squares at some point by working out everywhere
            // each pac can see and subtracting the above
        }
    }

    private updateCell(x: number, y: number, floorType: FloorType){
        this.map.floorMap[y][x] = floorType;

        // TODO: Update pellets lists based on above
        // If floor type is empty check if we need to clear pellets
        // else if floor type is a pellet check if we need to add to the pellets list
    }
}