export function executeCode(code) {
    const tokens = [];
    const lines = code.split("\n");
    
    lines.forEach((line) => {
        const trimmed = line.trim();
        if (trimmed === "") return;
        tokens.push(trimmed.split(/[\s,]+/));
    });

    // Return a JSON object instead of a string
    return {
        success: true,
        data: tokens
    };
} 