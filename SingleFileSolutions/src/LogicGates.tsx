// https://www.codingame.com/ide/puzzle/logic-gates
enum Operation {
    AND,
    OR,
    XOR,
    NAND,
    NOR,
    NXOR,
    NONE
};

type Signal = {
    name: string;
    signal: string;
};

type SignalInstruction = {
    name: string;
    operation: Operation;
    input1: string;
    input2: string;
}

const getOperation = (type: string): Operation => {
    switch(type) {
        case "AND":
            return Operation.AND;
        case "OR":
            return Operation.OR;
        case "XOR":
            return Operation.XOR;
        case "NAND":
            return Operation.NAND;
        case "NOR":
            return Operation.NOR;
        case "NXOR":
            return Operation.NXOR;
    }

    return Operation.NONE;
}

const calculate = (operation: Operation, input1: string, input2: string): string => {
    let result: string = "";

    for (let i=0; i<input1.length; i++) {
        result += operate(operation, input1.charAt(i), input2.charAt(i));
    }

    return result;
}

const operate = (operation: Operation, input1: string, input2: string): string => {
    let result: string = "_";

    switch(operation) {
        case Operation.AND:
            if (input1 == "-" && input2 == "-") {
                result = "-";
            };
            break;
        case Operation.OR:
            if (input1 == "-" || input2 == "-") {
                result = "-";
            };
            break;
        case Operation.XOR:
            if (input1 !== input2) {
                result = "-";
            };
            break;
        case Operation.NAND:
            if (!(input1 == "-" && input2 == "-")) {
                result = "-";
            };
            break;
        case Operation.NOR:
            if (!(input1 == "-" || input2 == "-")) {
                result = "-";
            };
            break;
        case Operation.NXOR:
            if (!(input1 !== input2)) {
                result = "-";
            };
            break;
    }

    return result;
};

const numberOfInputSignals: number = parseInt(readline());
const numberOfOutputSignals: number = parseInt(readline());

let inputSignals: Signal[] = [];
let signalInstructions: SignalInstruction[] = [];

for (let i = 0; i < numberOfInputSignals; i++) {
    var inputs: string[] = readline().split(' ');
    const inputName: string = inputs[0];
    const inputSignal: string = inputs[1];

    inputSignals.push({
        name: inputName,
        signal: inputSignal
    });
}

for (let i = 0; i < numberOfOutputSignals; i++) {
    var inputs: string[] = readline().split(' ');
    const outputName: string = inputs[0];
    const type: string = inputs[1];
    const inputName1: string = inputs[2];
    const inputName2: string = inputs[3];

    signalInstructions.push({
        name: outputName,
        operation: getOperation(type),
        input1: inputName1,
        input2: inputName2,
    })
}

for (let i = 0; i < numberOfOutputSignals; i++) {
    const instruction: SignalInstruction = signalInstructions[i];
    // Write an answer using console.log()
    // To debug: console.error('Debug messages...');
    const input1 = inputSignals.find(s => s.name === instruction.input1)?.signal;
    const input2 = inputSignals.find(s => s.name === instruction.input2)?.signal;

    const out: string = calculate(instruction.operation, input1, input2)

    console.log(instruction.name + " " + out);
}
