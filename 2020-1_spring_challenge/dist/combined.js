var FloorType;
(function (FloorType) {
    FloorType[FloorType["Unknown"] = 0] = "Unknown";
    FloorType[FloorType["Empty"] = 1] = "Empty";
    FloorType[FloorType["SmallPellet"] = 2] = "SmallPellet";
    FloorType[FloorType["LargePellet"] = 3] = "LargePellet";
    FloorType[FloorType["Wall"] = 4] = "Wall";
})(FloorType || (FloorType = {}));

function logComment(comment) {
    console.error(`Comment: ${comment}`);
}
function logPacs(pacs) {
    for (const pac of pacs) {
        console.error(`Pac: ${pac.id}`);
        console.error(`Pos: (${pac.xPos}, ${pac.yPos})`);
        console.error(`Type: ${pac.pacType}`);
        console.error(`Speed turns left: ${pac.speedTurnsLeft}`);
        console.error(`Ability cooldown: (${pac.abilityCooldown})`);
        console.error();
    }
}
function logFloor(floorMap) {
    const wall = "\u2B1C";
    const empty = "\u2B1B";
    const unknown = "❓\uFE0F";
    const smallPellet = "\u25FD\uFE0F";
    const largePellet = "\u26AA";
    console.error("Walls");
    for (let y = 0; y < floorMap.length; y++) {
        var row = "";
        for (let x = 0; x < floorMap[y].length; x++) {
            var tile = unknown;
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

/**
 * Grab the pellets as fast as you can!
 **/
var inputs = readline().split(' ');
parseInt(inputs[0]); // size of the grid
const height = parseInt(inputs[1]); // top left corner is (x=0, y=0)
// Even though we add walls to the floor map, track them here too
// for faster lookup
var wallMap = [];
var floorMap = [];
for (let y = 0; y < height; y++) {
    wallMap[y] = [];
    floorMap[y] = [];
    const row = readline(); // one line of the grid: space " " is floor, pound "#" is wall
    const tiles = row.split("");
    for (let x = 0; x < tiles.length; x++) {
        if (tiles[x] == " ") {
            wallMap[y][x] = false;
            floorMap[y][x] = FloorType.Unknown;
        }
        else {
            wallMap[y][x] = true;
            floorMap[y][x] = FloorType.Wall;
        }
    }
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
        // TODO: If it's a pac that's not mine log it's position
        floorMap[y][x] = FloorType.Empty;
    }
    const visiblePelletCount = parseInt(readline()); // all pellets in sight
    for (let i = 0; i < visiblePelletCount; i++) {
        var inputs = readline().split(' ');
        const x = parseInt(inputs[0]);
        const y = parseInt(inputs[1]);
        const value = parseInt(inputs[2]); // amount of points this pellet is worth
        // Update map
        if (value == 1) {
            floorMap[y][x] = FloorType.SmallPellet;
        }
        else {
            floorMap[y][x] = FloorType.LargePellet;
        }
        // TODO: extrapolate empty squares at some point by working out everywhere
        // each pac can see and subtracting the above
    }
    logFloor(floorMap);
    logPacs(pacs);
    // Write an action using console.log()
    // To debug: console.error('Debug messages...');
    logComment("Test comment");
    console.log('MOVE 0 15 10'); // MOVE <pacId> <x> <y>
}
