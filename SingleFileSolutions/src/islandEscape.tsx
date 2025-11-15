// https://www.codingame.com/ide/puzzle/island-escape
type Space = {
    elevation: number;
    visited: boolean;
}

const canReachOcean = (x: number, y: number, parentElevation: number = -1): boolean => {
    if (grid[x][y].visited) {
        return false;
    }

    const currentElevation = grid[x][y].elevation;

    // Return false if it can't move here
    if (parentElevation !== -1) {
        if (Math.abs(currentElevation-parentElevation) > 1) {
            return false;
        }
    }

    grid[x][y].visited = true;

    if (currentElevation === 0) {
        return true;
    }

    // Check North
    if (y > 0) {
        if (canReachOcean(x, y-1, currentElevation)) {
            return true;
        }
    }

    // Check East
    if (x < N-1) {
        if (canReachOcean(x+1, y, currentElevation)) {
            return true;
        }
    }

    // Check South
    if (y < N-1) {
        if (canReachOcean(x, y+1, currentElevation)) {
            return true;
        }
    }

    // Check West
    if (x > 0) {
        if (canReachOcean(x-1, y, currentElevation)) {
            return true;
        }
    }

    return false;
};

const N: number = parseInt(readline());

let grid: Space[][] = [];

for (let row = 0; row < N; row++) {
    var inputs: string[] = readline().split(' ');
    grid[row] = [];
    for (let column = 0; column < N; column++) {
        const elevation: number = parseInt(inputs[column]);
        grid[row][column] = {
            elevation: elevation,
            visited: false,
        };
    }
}

const middle: number = Math.floor(N / 2);
const canReach: boolean = canReachOcean(middle, middle);

console.log(canReach ? 'yes': 'no');
