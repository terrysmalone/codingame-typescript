// https://www.codingame.com/ide/puzzle/defibrillators
type Defibralator = {
    id: number
    name: string;
    address: string;
    phoneNumber: number;
    longitude: number;
    latitude: number;

};

let defibs: Defibralator[] = [];

const longitude: number = parseFloat(readline().replace(',', '.'));
const latitude: number = parseFloat(readline().replace(',', '.'));

const N: number = parseInt(readline());
for (let i = 0; i < N; i++) {
    const line: string = readline();

    const lines = line.split(';');

    const defib: Defibralator = {
        id:  parseInt(lines[0]),
        name: lines[1],
        address: lines[2],
        phoneNumber: parseInt(lines[3]),
        longitude: parseFloat(lines[4].replace(',', '.')),
        latitude: parseFloat(lines[5].replace(',', '.')),
    }

    defibs.push(defib);
}

const closest: string = getClosest(longitude, latitude, defibs);

// Write an answer using console.log()
// To debug: console.error('Debug messages...');
console.log(closest);

function getClosest(longitude: number, latitude: number, defibs: Defibralator[]): string {
    let closestDefib: string = "";
    let closest: number = Number.MAX_SAFE_INTEGER;

    for (let i=0; i<defibs.length; i++) {
        let dist: number = getDistance(longitude, latitude, defibs[i])

        if (dist < closest) {
            closestDefib = defibs[i].name;
            closest = dist;
        }
    }

    return closestDefib;
}

function getDistance(longitude: number, latitude: number, defib: Defibralator): number {
    const x = (defib.longitude - longitude) * Math.cos((latitude + defib.latitude) / 2);

    const y = defib.latitude - latitude;

    const distance = Math.sqrt((x * x) + (y * y)) * 6371;

    return distance;
}
