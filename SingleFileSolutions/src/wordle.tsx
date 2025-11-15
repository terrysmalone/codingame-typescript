// https://www.codingame.com/ide/puzzle/wordle
const wordCount: number = parseInt(readline()); // Number of words in the word set

let wordList: string[] = [];
var inputs: string[] = readline().split(' ');
for (let i = 0; i < wordCount; i++) {
    wordList.push(inputs[i]);
}

sortByUniqueCharacters(wordList);

const untriedLettersList: string[] = wordList.slice();

// Keep track of when we've filtered by correct
let filteredByCorrect: boolean[] = new Array().fill(false);
let guess: string = "";

let filteredOutLetters: string = "";

// game loop
while (true) {
    var inputs: string[] = readline().split(' ');

    if(!inputs.includes("0")) {
        for (let i = 0; i < 6; i++) {
            const state: number = parseInt(inputs[i]);// State of the letter of the corresponding position of previous guess

            if (state ===  3) {
                // remove all words that don't have this char in this place
                if(!filteredByCorrect[i]) {
                    filterOutCorrectlyPlacedLetter(wordList, guess.charAt(i), i);
                    filteredByCorrect[i] = true;

                    if (!filteredOutLetters.includes(guess.charAt(i))) {
                        // Update the list of words with untried letters
                        filterOutUnusedLetter(untriedLettersList, guess.charAt(i));
                        filteredOutLetters += guess.charAt(i);
                    }

                }
            } else if (state === 1) {
                filterOutUnusedLetter(wordList, guess.charAt(i));
                // Update the list of words with unused letters

                if (!filteredOutLetters.includes(guess.charAt(i))) {
                    filterOutUnusedLetter(untriedLettersList, guess.charAt(i));
                    filteredOutLetters += guess.charAt(i);
                }

            } else if (state === 2) {
                // Get rid of words that don't contain this letter
                filterOutGuessedLetter(wordList, guess.charAt(i))

                // Get rid of words that contain this letter at this position
                filterOutMisplacedLetter(wordList, guess.charAt(i), i)

                if (!filteredOutLetters.includes(guess.charAt(i))) {
                    // Update the list of words with unused letters
                    filterOutUnusedLetter(untriedLettersList, guess.charAt(i));
                    filteredOutLetters += guess.charAt(i);
                }
            }
        }
    }

    console.error("wordList: ", wordList.length);
    console.error("untriedLettersList: ", untriedLettersList.length);
    // Make a guess
    //const num: number = getRandomInt(wordList.length);
    //guess = wordList[num];

    if (wordList.length > 1 && inputs.includes("1") && untriedLettersList.length > 0) {
        //sortByUniqueCharacters(untriedLettersList);
        guess = untriedLettersList[0];
    } else {
        // sortByUniqueCharacters(wordList);
        guess = wordList[0];
    }



    // Count how many letters we could pssibly add
    // If it's more than the missing ones
    //    Make a guess using all unknowns
    // else
    //    Make a standard guess



    console.log(guess);
}

//function getRandomInt(max): number {
//    return Math.floor(Math.random() * max);
//}

// Remove words that don't contain this character in this position
function filterOutCorrectlyPlacedLetter(list: string[], character: string, position: number) {
    for (let i=list.length-1; i>=0; i--) {
        if (list[i].charAt(position) !== character) {
            list.splice(i, 1);
        }
    }
}

// Remove words that don't contain this character
function filterOutGuessedLetter(list: string[], character: string) {
    for (let i=list.length-1; i>=0; i--) {
        if (!list[i].includes(character)) {
            list.splice(i, 1);
        }
    }
}

// Remove words that contain this character in this place
function filterOutMisplacedLetter(list: string[], character: string, position: number) {
    for (let i=list.length-1; i>=0; i--) {
        if (list[i].charAt(position) === character) {
            list.splice(i, 1);
        }
    }
}

// Remove words that contain this character
function filterOutUnusedLetter(list: string[], character: string) {
    for (let i=list.length-1; i>=0; i--) {
        if (list[i].includes(character)) {
            list.splice(i, 1);
        }
    }
}

function sortByUniqueCharacters(words: string[]) {
    return words.sort((a, b) => countUniqueCharacters(b) - countUniqueCharacters(a));
}

function countUniqueCharacters(word: string): number {
    const uniqueChars = new Set(word);
    return uniqueChars.size;
}

