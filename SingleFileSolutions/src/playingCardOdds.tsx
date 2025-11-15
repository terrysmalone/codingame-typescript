// https://www.codingame.com/ide/puzzle/playing-card-odds
const allSuits: string = "CDHS";
const allRanks: string = "23456789TJQKA";

let toRemove: string[] = [];
let sought: string[] = [];

var inputs: string[] = readline().split(' ');
const numberToRemove: number = parseInt(inputs[0]);
const numberSought: number = parseInt(inputs[1]);
for (let i = 0; i < numberToRemove; i++) {
    toRemove.push(readline())
}
for (let i = 0; i < numberSought; i++) {
    sought.push(readline());
}

let result: string = "";

const removed: Set<string> = getCards(toRemove);
const seeking: Set<string> = getCards(sought);

let notPossible: number = 0;

seeking.forEach(function(seek) {
    if (removed.has(seek))
    {
        notPossible++;
    }
});

if (notPossible == seeking.size) {
    result = "0%";
} else {
    const total: number = 52 - removed.size;
    const percentage: number = Math.floor(((seeking.size-notPossible) / total) * 100);

    result = percentage.toString() + "%";
}

console.log(result);

function getCards(classifications: string[]): Set<string> {
    let cards: Set<string> = new Set<string>();

    for (let i=0; i<classifications.length; i++) {
        const classification: string = classifications[i];

        let ranks:string[] = [];
        let suits:string[] = [];

        const chars: string[] = classification.split("");
        for(let j=0; j<chars.length; j++)
        {
            if(/^[2-9TJQKA]$/.test(chars[j])) {
                ranks.push(chars[j]);
            } else {
                suits.push(chars[j])
            }
        }

        // If there is no suit specified add them all
        if(suits.length == 0) {
            allSuits.split("").forEach((suit) => {
                suits.push(suit);
            });
        }

        // If there is no rank specified add them all
        if (ranks.length == 0) {
            allRanks.split("").forEach((rank) => {
                ranks.push(rank);
            });
        }

        for (let r=0; r<ranks.length; r++) {
            for (let s=0; s<suits.length; s++) {
                cards.add(ranks[r] + suits[s]);
            }
        }
    }

    return cards;
}