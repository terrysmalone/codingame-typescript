const wordCount: number = parseInt(readline()); // Number of words in the word set

let wordList: string[] = [];
var inputs: string[] = readline().split(' ');
for (let i = 0; i < wordCount; i++) {
    wordList.push(inputs[i]);
}

// Keep track of when we've filtered by correct
let filteredByCorrect: boolean[] = new Array().fill(false);
let guess: string = "";

// game loop
while (true) {
    var inputs: string[] = readline().split(' ');

    if(!inputs.includes("0")) {
        for (let i = 0; i < 6; i++) {
            const state: number = parseInt(inputs[i]);// State of the letter of the corresponding position of previous guess

            if (state ===  3) {
                // remove all words that don't have this char in this place
                if(!filteredByCorrect[i]) {
                    filterOutCorrectlyPlacedLetter(guess.charAt(i), i);
                    filteredByCorrect[i] = true;
                }
            } else if (state === 1) {
                filterOutUnusedLetter(guess.charAt(i));
            } else if (state === 2) {
                // Get rid of words that don't contian this letter
                filterOutGuessedLetter(guess.charAt(i))

                // Get rid of words that contain this letter at this position
                filterOutMisplacedLetter(guess.charAt(i), i)
            }
        }
    }

    // Write an action using console.log()
    // To debug: console.error('Debug messages...');

    // Make a guess
    const num: number = getRandomInt(wordList.length);

    guess = wordList[num];

    console.log(guess);
}

function getRandomInt(max: number): number {
    return Math.floor(Math.random() * max);
}

// Remove words that don't contain this character in this position
function filterOutCorrectlyPlacedLetter(character: string, position: number) {
    for (let i=wordList.length-1; i>=0; i--) {
        if (wordList[i].charAt(position) !== character) {
            wordList.splice(i, 1);
        }
    }
}

// Remove words that don't contain this character
function filterOutGuessedLetter(character: string) {
    for (let i=wordList.length-1; i>=0; i--) {
        if (!wordList[i].includes(character)) {
            wordList.splice(i, 1);
        }
    }
}

// Remove words that contain this character in this place
function filterOutMisplacedLetter(character: string, position: number) {
    for (let i=wordList.length-1; i>=0; i--) {
        if (wordList[i].charAt(position) === character) {
            wordList.splice(i, 1);
        }
    }
}

// Remove words that contain this character
function filterOutUnusedLetter(character: string) {
    for (let i=wordList.length-1; i>=0; i--) {
        if (wordList[i].includes(character)) {
            wordList.splice(i, 1);
        }
    }
}
