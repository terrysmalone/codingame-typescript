function logComment(comment) {
    console.error(`Comment: ${comment}`);
}
function logPacs(pacs) {
    for (const pac of pacs) {
        console.error(`Pac: ${pac.id}`);
        console.error(`Pos: ${pac.xPos}, ${pac.yPos}`);
        console.error(`Type: ${pac.pacType}`);
        console.error(`Speed turns left: ${pac.speedTurnsLeft}`);
        console.error(`Ability cooldown: ${pac.abilityCooldown}`);
        console.error();
    }
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
    var pacs = [];
    var inputs = readline().split(' ');
    parseInt(inputs[0]);
    parseInt(inputs[1]);
    const visiblePacCount = parseInt(readline()); // all your pacs and enemy pacs in sight
    for (let i = 0; i < visiblePacCount; i++) {
        var inputs = readline().split(' ');
        const pacId = parseInt(inputs[0]); // pac number (unique within a team)
        const mine = inputs[1] !== '0'; // true if this pac is yours
        const x = parseInt(inputs[2]); // x position in the grid
        const y = parseInt(inputs[3]); // y position in the grid
        const typeId = inputs[4]; // Rock, Scissors, Paper, dead
        const speedTurnsLeft = parseInt(inputs[5]); // remaining turns before the speed effect fades
        const abilityCooldown = parseInt(inputs[6]); // turns until you can request a new ability for this pac
        if (mine) {
            pacs.push({
                id: pacId,
                xPos: x,
                yPos: y,
                pacType: typeId,
                speedTurnsLeft: speedTurnsLeft,
                abilityCooldown: abilityCooldown,
            });
        }
    }
    const visiblePelletCount = parseInt(readline()); // all pellets in sight
    for (let i = 0; i < visiblePelletCount; i++) {
        var inputs = readline().split(' ');
        parseInt(inputs[0]);
        parseInt(inputs[1]);
        parseInt(inputs[2]); // amount of points this pellet is worth
    }
    logPacs(pacs);
    // Write an action using console.log()
    // To debug: console.error('Debug messages...');
    logComment("Test comment");
    console.log('MOVE 0 15 10'); // MOVE <pacId> <x> <y>
}
