import {FloorType} from "./FloorType";

export interface GameMap {
    width: number;
    height: number;
    floorMap: FloorType[][];
    wallMap: boolean[][];
}

export function initialiseGameMap(): GameMap {
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

    const map: GameMap = {
        width: width,
        height: height,
        floorMap: floorMap,
        wallMap: wallMap,
    }

    return map;
}