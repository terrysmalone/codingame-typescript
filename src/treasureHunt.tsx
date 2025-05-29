// https://www.codingame.com/ide/puzzle/treasure-hunt
type Point = {
    x: number;
    y: number;
}

type Cell = {
    gold: number;
    isStart: boolean;
    isWall: boolean;
    visited: boolean;
}

const inputs: string[] = readline().split(' ');
const height: number = parseInt(inputs[0]);
const width: number = parseInt(inputs[1]);

const map: Cell[][] = initialiseMap(width, height);

const bestScore = findBestRouteScore(map);

console.log(bestScore);

function initialiseMap(width: number, height: number): Cell[][] {
    let map: Cell[][] = [];

    for (let y = 0; y < height; y++) {
        map[y] = [];
        const row: string = readline();
        const cells: string[] = row.split('');

        for (let x = 0; x < width; x++) {
            let gold: number = 0;
            let isStart: boolean = false;
            let isWall: boolean = false;

            switch (cells[x]) {
                case "X":
                    isStart = true;
                    break;
                case "#":
                    isWall = true;
                    break;
                case " ":
                    gold = 0;
                    break;
                default:
                    gold = parseInt(cells[x]);
                    break;
            }

            map[y][x] = {
                gold: gold,
                isStart: isStart,
                isWall: isWall,
                visited: false,
            }
        }
    }

    return map;
}

function findBestRouteScore(map: Cell[][]): number {
    let startPoint: Point = getStartPoint();

    const bestScore: number = findBestScore(startPoint, 0);

    return bestScore;
}

function getStartPoint(): Point {
    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            if(map[y][x].isStart) {
                return {
                    x: x,
                    y: y,
                }
            }
        }
    }

    return {
        x: -1,
        y: -1,
    }
}

function findBestScore(currentPoint: Point, currentScore: number) {
    let maxScore = -1;

    if (map[currentPoint.y][currentPoint.x].isWall ||
        map[currentPoint.y][currentPoint.x].visited) {
        return currentScore;
    }

    currentScore += map[currentPoint.y][currentPoint.x].gold;

    map[currentPoint.y][currentPoint.x].visited = true;

    // Check North
    if(currentPoint.y-1 >= 0) {
        const score = findBestScore({ x: currentPoint.x, y: currentPoint.y-1}, currentScore);

        if(score > maxScore) {
            maxScore = score;
        }
    }

    // Check East
    if(currentPoint.x+1 < width) {
        const score = findBestScore({ x: currentPoint.x+1, y: currentPoint.y}, currentScore);

        if(score > maxScore) {
            maxScore = score;
        }
    }

    // Check South
    if(currentPoint.y+1 < height) {
        const score = findBestScore({ x: currentPoint.x, y: currentPoint.y+1}, currentScore);

        if(score > maxScore) {
            maxScore = score;
        }
    }

    // Check West
    if(currentPoint.x-1 >= 0) {
        const score = findBestScore({ x: currentPoint.x-1, y: currentPoint.y}, currentScore);

        if(score > maxScore) {
            maxScore = score;
        }
    }

    return maxScore;
}