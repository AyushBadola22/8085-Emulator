import { CPU, InstructionExecuter, InstructionSet, Memory } from "./cpu-components";


export function tokenize(code) {
    const tokens = [];
    const lines = code.split("\n");
    lines.forEach((line) => {
        const trimmed = line.trim();
        if (trimmed === "") return;
        tokens.push(trimmed.split(/[\s,]+/));
    });

    return tokens;
}



export function parseInstructions(line, current_address){
    const [opcode , ...operands] = line; 
    if(InstructionSet[opcode] === undefined ){
        return JSON.stringify({
            message : "Invalid Instruction", 
            success : false
        })
    }

    const response = InstructionSet[opcode].convertOpcode(operands, current_address);
    if (response?.success){
        return current_address + InstructionSet[opcode].size ; 
    }
    return current_address; 
}



export function executeCode (code){
    const tokenized =  tokenize(code);
    let current_address = CPU.PC;
    tokenized.forEach((line) => {
        current_address = parseInstructions(line, current_address);
    });
    
    const sliced = [] 
    
    for (let i = CPU.PC; i < current_address; i++) {
        sliced.push(Memory[i].toString(16).padStart(2, "0").toUpperCase());
    }
    console.log(sliced);
}       