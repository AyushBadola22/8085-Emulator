
/*
    TODO : - Add the remaining instructions
    TODO : - Add the flags
    TODO : - Add the ALU
    TODO : - Add the CPU components
    TODO : - Add the memory
    TODO : - Add the instructions
    TODO : - Add the simulator functions
    TODO : - Add the debugger
    TODO : - Add the disassembler
    TODO : - Add the assembler
    TODO : - Add the linker
    TODO : - Add the loader
    TODO : - Add the debugger
    TODO : - Add the disassembler
    TODO : - Add the assembler
    TODO : - Add the linker
    TODO : - Add the loader
    TODO : - Add the debugger
    TODO : - Add the disassembler
    TODO : - Add the assembler
    TODO : - Add the linker
    TODO : - Add the loader
    
*/

export const Register = {
    'A' : 0 , 
    'B' : 0 , 
    'C' : 0 , 
    'D' : 0 , 
    'E' : 0 , 
    'H' : 0 , 
    'L' : 0 , 
    'M' : 0  
}

export const Memory = new Uint8Array(0x10000); // 64 kb ki memory storage 


export const InstructionExecuter = {
    // mov a , data
    0x3E : (operand) => (Register.A = operand),

    // mov b , data
    0x06 : (operand)=> (Register.B = operand) , 

    // add  b 
    0x80 : ()=> (ALU.add(Register.B)) , 

    // sta address
    0x32 : (lowerAddress , upperAddress)=>{
        const address = (upperAddress << 8) | lowerAddress; 
        Memory[address] = Register.A; 
    } , 

    // halt
    0x76 : () => {
        console.log("HALTED")
        return 'halt'; 
    }
}; 

export const InstructionSet = {
    'MVI' : {
        size : 2 , 
        'A' : 0x3E , 
        'B' : 0x06 , 
        'C' : 0x0E , 
        'D' : 0x16 , 
        'E' : 0x1E , 
        'H' : 0x26 , 
        'L' : 0x2E, 
        'M' : 0x36,
        convertOpcode : (operands, current_address) => {
            if(operands.length != 2 ){
                return {
                    message : "Invalid number of operands",
                    success : false
                }
            }
            const [register , data] = operands; 
            
            if(Register[register] === undefined){
                return {
                    message : 'Invalid Register specified', 
                    success : false 
                }
            }
            
            Memory[current_address] = InstructionSet['MVI'][register]
            Memory[current_address+1] = parseInt(data, 16)

            return {
                message : "Instruction compiled successfully",
                success : true
            }
        }
    }, 
    'ADD' : {
        size : 1 , 
        'A' : "0x87" , 
        'B' : "0x80" , 
        'C' : "0x81" , 
        'D' : "0x82" , 
        'E' : "0x83" , 
        'H' : "0x84" , 
        'L' : "0x85" , 
        'M' : "0x86" , 
        convertOpcode : (operands, current_address) => {
            if(operands.length != 1 ){
                return {
                    message : "Invalid number of operands",
                    success : false
                }
            }
            const [register] = operands; 
            if(Register[register] === undefined ){
                return {
                    message : 'Invalid Register specified', 
                    success : false 
                }
            }
            Memory[current_address] = InstructionSet['ADD'][register]   

            return {
                message : "Instruction compiled successfully",
                success : true
            }
        }
    }, 
    'STA' : {

        size : 3 , 
        opcode : 0x32, 
        convertOpcode : (operands , current_address) => {
            if(Array.isArray(operands) && operands.length != 1 ){
                return {
                    message : "Invalid number of operands",
                    success : false
                }
            }
            if(operands < 0x0000 || operands > 0xFFFF){
                return {
                    message : "Invalid address",
                    success : false
                }
            }
            const address = operands.toString(16).toUpperCase().padStart(4, '0');
            const upperAddress = address.slice(0,2);
            const lowerAddress = address.slice(2,4);
            Memory[current_address] = InstructionSet['STA'].opcode;
            Memory[current_address+1] = parseInt(lowerAddress, 16);
            Memory[current_address+2] = parseInt(upperAddress, 16);
            return {
                message : "Instruction compiled successfully",
                success : true
            }

        }
    }, 

    'HLT' : {
        size : 1 , 
        opcode : 0x76, 
        convertOpcode : (operands , current_address) => {
            if(operands.length != 0){
                return {
                    message : "No operands expected",
                    success : false
                }
            }
            Memory[current_address] = InstructionSet['HLT'].opcode;
            return {
                message : "Instruction compiled successfully",
                success : true
            }
        }

    }
}

export const Flags = {
    'Z' : 0 , 
    'S' : 0 , 
    'P' : 0 , 
    'CY' : 0 , 
    'AC' : 0 
}; 


export const ALU = {
    'add' : (operand) => {
        const result = Register.A + operand; 
        Flags.Z = result === 0; 
        Flags.S = result < 0; 
        Flags.P = result % 2 === 0; 
        Flags.CY = result > 255; 
        Flags.AC = (Register.A & 0x0F) + (operand & 0x0F) > 0x0F; 
        Register.A = result & 0xFF; 
    }, 
    'sub' : (operand) => {
        const result = Register.A - operand; 
        Flags.Z = result === 0; 
        Flags.S = result < 0; 
        Flags.P = result % 2 === 0; 
        Flags.CY = result > 255; 
    }, 
}

export const CPU = {
    'PC' : 0x0000, 
    'IR' : 0x00, 
    'cycle' : 0 , 
    'execute' : (opcode) => {
        const operation = InstructionExecuter[opcode]; 
        if(operation === 'halt') return; 
    }, 
    'fetch' : () => {
        CPU.IR = Memory[CPU.PC]; 
        CPU.PC++; 
    }, 
    'decode' : () => {
        const opcode = CPU.IR; 
        const operand = Memory[CPU.PC]; 
        CPU.PC++; 
        return {opcode , operand}; 
    },
    'run' : () => {
        while(CPU.PC < 0xFFFF){
            CPU.fetch(); 
            CPU.decode(); 
            CPU.execute(); 
        }
    }, 
    'reset' : () => {
        CPU.PC = 0x0000; 
        CPU.IR = 0x00; 
        CPU.cycle = 0; 
    }, 
    'loadProgram' : (program) => {
        for(let i = 0; i < program.length; i++){
            Memory[0x0000 + i] = program[i]; 
        }
    }, 
    'printState' : () => {
        console.log(`PC: ${CPU.PC.toString(16).padStart(4, '0')}`); 
        console.log(`IR: ${CPU.IR.toString(16).padStart(2, '0')}`); 
        console.log(`A: ${Register.A.toString(16).padStart(2, '0')}`); 
        console.log(`B: ${Register.B.toString(16).padStart(2, '0')}`); 
    }
}
