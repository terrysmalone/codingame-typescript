function logComment(comment) {
    console.error(`Comment: ${comment}`);
}

/**
 * Grab the pellets as fast as you can!
 **/
var inputs = readline().split(' ');
parseInt(inputs[0]); // size of the grid
const height = parseInt(inputs[1]); // top left corner is (x=0, y=0)
for (let i = 0; i < height; i++) {
    readline(); // one line of the grid: space " " is floor, pound "#" is wall
}
// game loop
while (true) {
    var inputs = readline().split(' ');
    parseInt(inputs[0]);
    parseInt(inputs[1]);
    const visiblePacCount = parseInt(readline()); // all your pacs and enemy pacs in sight
    for (let i = 0; i < visiblePacCount; i++) {
        var inputs = readline().split(' ');
        parseInt(inputs[0]); // pac number (unique within a team)
        inputs[1] !== '0'; // true if this pac is yours
        parseInt(inputs[2]); // position in the grid
        parseInt(inputs[3]); // position in the grid
        inputs[4]; // unused in wood leagues
        parseInt(inputs[5]); // unused in wood leagues
        parseInt(inputs[6]); // unused in wood leagues
    }
    const visiblePelletCount = parseInt(readline()); // all pellets in sight
    for (let i = 0; i < visiblePelletCount; i++) {
        var inputs = readline().split(' ');
        parseInt(inputs[0]);
        parseInt(inputs[1]);
        parseInt(inputs[2]); // amount of points this pellet is worth
    }
    // Write an action using console.log()
    // To debug: console.error('Debug messages...');
    logComment("Test comment");
    console.log('MOVE 0 15 10'); // MOVE <pacId> <x> <y>
}
