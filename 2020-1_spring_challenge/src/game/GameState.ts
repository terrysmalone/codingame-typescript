import { Pac, PacType } from "./Pac";
import { Position } from "../utils/Position";
import { GameMap } from "./GameMap";
import { FloorType } from "./FloorType";

export class GameState {
  turn: number = 0;
  myScore: number = 0;
  opponentScore: number = 0;
  map: GameMap;
  myPacs: Pac[] = [];
  opponentPacs: Pac[] = [];
  smallPellets: Position[] = [];
  largePellets: Position[] = [];

  constructor(map: GameMap) {
    this.map = map;
  }

  public update() {
    this.turn++;

    var inputs: string[] = readline().split(" ");
    this.myScore = parseInt(inputs[0]);
    this.opponentScore = parseInt(inputs[1]);

    this.myPacs = [];
    this.opponentPacs = [];

    this.largePellets = []; // Reset large pellets each turn since they'll be repopulated as we read them in

    const visiblePacCount: number = parseInt(readline()); // all your pacs and enemy pacs in sight

    for (let i = 0; i < visiblePacCount; i++) {
      inputs = readline().split(" ");
      const pacId: number = parseInt(inputs[0]); // pac number (unique within a team)
      const mine: boolean = inputs[1] !== "0"; // true if this pac is yours
      const x: number = parseInt(inputs[2]); // x position in the grid
      const y: number = parseInt(inputs[3]); // y position in the grid
      const typeId: string = inputs[4] as PacType; // Rock, Scissors, Paper, dead
      const speedTurnsLeft: number = parseInt(inputs[5]); // remaining turns before the speed effect fades
      const abilityCooldown: number = parseInt(inputs[6]); // turns until you can request a new ability for this pac

      const pac: Pac = <Pac>{
        id: pacId,
        xPos: x,
        yPos: y,
        pacType: typeId,
        speedTurnsLeft: speedTurnsLeft,
        abilityCooldown: abilityCooldown,
      };
      if (mine) {
        this.myPacs.push(pac);
      } else {
        this.opponentPacs.push(pac);
      }

      this.updateCell(x, y, FloorType.Empty);
    }
    const visiblePelletCount: number = parseInt(readline()); // all pellets in sight
    for (let i = 0; i < visiblePelletCount; i++) {
      var inputs: string[] = readline().split(" ");
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
      // each pac can see and subtracting the above pellets
    }
  }

  private updateCell(x: number, y: number, floorType: FloorType) {
    this.map.floorMap[y][x] = floorType;

    // NOTE: This might end up being expensive. If performance becomes an issue look into alternatives
    // If floor type is empty check if we need to clear pellets
    if (floorType === FloorType.Empty) {
      this.smallPellets = this.smallPellets.filter(
        (p) => p.x !== x || p.y !== y,
      );
      this.largePellets = this.largePellets.filter(
        (p) => p.x !== x || p.y !== y,
      );
    }
    // else if floor type is a pellet check if we need to add to the pellets list
    else if (floorType === FloorType.SmallPellet) {
      const exists = this.smallPellets.some((p) => p.x === x && p.y === y);
      if (!exists) {
        this.smallPellets.push({ x, y });
      }
    } else if (floorType === FloorType.LargePellet) {
      const exists = this.largePellets.some((p) => p.x === x && p.y === y);
      if (!exists) {
        this.largePellets.push({ x, y });
      }
    }
  }
}
