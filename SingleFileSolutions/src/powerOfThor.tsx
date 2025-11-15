// https://www.codingame.com/ide/puzzle/power-of-thor-episode-1
var inputs: string[] = readline().split(' ');
const lightX: number = parseInt(inputs[0]); // the X position of the light of power
const lightY: number = parseInt(inputs[1]); // the Y position of the light of power
const initialTx: number = parseInt(inputs[2]); // Thor's starting X position
const initialTy: number = parseInt(inputs[3]); // Thor's starting Y position

let toMoveX: number = lightX - initialTx;
let toMoveY: number = lightY - initialTy;

// game loop
while (true) {
    const remainingTurns: number = parseInt(readline()); // The remaining amount of turns Thor can move. Do not remove this line.

    // Write an action using console.log()
    // To debug: console.error('Debug messages...');

    let move: string = "";

    if (toMoveY > 0) {
        toMoveY--;

        move += "S";
    } else if (toMoveY < 0) {
        toMoveY++;

        move += "N";
    }

    if (toMoveX > 0) {
        toMoveX--;

        move += "E";
    } else if (toMoveX < 0) {
        toMoveX++;

        move += "W";
    }

    // A single line providing the move to be made: N NE E SE S SW W or NW
    console.log(move);
}
