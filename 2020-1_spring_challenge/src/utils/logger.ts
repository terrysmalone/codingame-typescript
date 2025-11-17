import {Pac} from "../Pac";
import {FloorType} from "../FloorType";

export function logComment(comment: string): void {
    console.error(`Comment: ${comment}`);
}

export function logPacs(pacs: Pac[]): void {
    for (const pac of pacs) {
        console.error(`Pac: ${pac.id}`);
        console.error(`Pos: (${pac.xPos}, ${pac.yPos})`);
        console.error(`Type: ${pac.pacType}`);
        console.error(`Speed turns left: ${pac.speedTurnsLeft}`);
        console.error(`Ability cooldown: (${pac.abilityCooldown})`);
        console.error();
    }
}

export function logFloor(floorMap: FloorType[][]): void {
    const wall: string = "\u2B1C";
    const empty: string = "\u2B1B";
    const unknown: string = "❓\uFE0F";
    const smallPellet: string = "\u25FD\uFE0F";
    const largePellet: string = "\u26AA";

    console.error("Walls");
    for (let y=0; y<floorMap.length; y++) {
        var row: string = "";
        for (let x=0; x<floorMap[y].length; x++) {
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