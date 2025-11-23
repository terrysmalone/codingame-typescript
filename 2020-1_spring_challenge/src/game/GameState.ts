import { Pac, PacType } from "./Pac";
import { Position } from "../utils/Position";
import { GameMap } from "./GameMap";
import { FloorType } from "./FloorType";
import { logComment } from "../utils/Logger";

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

    // Initialise pellets
    for (let y = 0; y < map.height; y++) {
      for (let x = 0; x < map.width; x++) {
        const floorType: FloorType = map.floorMap[y][x];

        if (floorType == FloorType.SmallPellet) {
          this.smallPellets.push({ x: x, y: y });
        }
      }
    }
  }

  public update() {
    this.turn++;

    var inputs: string[] = readline().split(" ");
    this.myScore = parseInt(inputs[0]);
    this.opponentScore = parseInt(inputs[1]);

    this.myPacs = [];

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
        position: { x, y },
        pacType: typeId,
        speedTurnsLeft: speedTurnsLeft,
        abilityCooldown: abilityCooldown,
      };
      if (mine) {
        if (typeId != PacType.DEAD) {
          this.myPacs.push(pac);
        }
        // If first turn add mirrored opponent pacs
        if (this.turn === 1) {
          const opponentPac: Pac = <Pac>{
            id: pacId,
            position: { x: this.map.width - 1 - x, y: y },
            pacType: typeId,
            speedTurnsLeft: speedTurnsLeft,
            abilityCooldown: abilityCooldown,
          };

          this.opponentPacs.push(opponentPac);
        }
      } else {
        this.opponentPacs = this.opponentPacs.filter((p) => p.id !== pacId);

        if (typeId != PacType.DEAD) {
          this.opponentPacs.push(pac);
        }
      }

      this.updateCell(x, y, FloorType.Empty);
    }

    const visiblePelletCount: number = parseInt(readline()); // all pellets in sight
    var visiblePellets: Position[] = [];
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

      visiblePellets.push({ x, y });
    }

    for (let pac of this.myPacs) {
      var visiblePositions: Position[] = [];

      // Pacs can see in all 4 directions until they hit a wall
      // Up
      for (let ty = pac.position.y - 1; ty >= 0; ty--) {
        if (this.map.wallMap[ty][pac.position.x]) break;
        visiblePositions.push({ x: pac.position.x, y: ty });
      }
      // Down
      for (let ty = pac.position.y + 1; ty < this.map.height; ty++) {
        if (this.map.wallMap[ty][pac.position.x]) break;
        visiblePositions.push({ x: pac.position.x, y: ty });
      }
      // Left
      for (let tx = pac.position.x - 1; tx >= 0; tx--) {
        if (this.map.wallMap[pac.position.y][tx]) break;
        visiblePositions.push({ x: tx, y: pac.position.y });
      }
      // Right
      for (let tx = pac.position.x + 1; tx < this.map.width; tx++) {
        if (this.map.wallMap[pac.position.y][tx]) break;
        visiblePositions.push({ x: tx, y: pac.position.y });
      }

      // If any visible position does not have a matching pellet, it must be empty
      for (let pos of visiblePositions) {
        const found = visiblePellets.some(
          (p) => p.x === pos.x && p.y === pos.y,
        );
        if (!found) {
          this.updateCell(pos.x, pos.y, FloorType.Empty);
        }
      }
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
      // Remove any small pellets we think are here
      this.smallPellets = this.smallPellets.filter(
        (p) => p.x !== x || p.y !== y,
      );

      const exists = this.largePellets.some((p) => p.x === x && p.y === y);
      if (!exists) {
        this.largePellets.push({ x, y });
      }
    }
  }
}
