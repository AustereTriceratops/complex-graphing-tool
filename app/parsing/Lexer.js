const TOKENS = [
    '<?>',
    'X',
    'Z',
    'Q',
    'I',
    'PLUS',
    'MINUS',
    'TIMES',
    'DIVIDE',
    'POW',
    'INT',
    'LPAREN',
    'RPAREN',
]

class Token {
    constructor(name, value=null) {
        this.name = name;
        this.value = value;
    }
}

class Lexer {
    static scan(input) {
        const n = input.length;
        const tokens = [];

        for (let i = 0; i < n; i++) {
            const char = input[i]
            
            if (char == ' ') {
                continue;
            } else if (char == undefined) {
                throw Error("undefined character in input string");
            } else {
                if (char == 'x') {
                    tokens.push(new Token('X'));
                } else if (char == 'z') {
                    tokens.push(new Token('Z'));
                } else if (char == 'q') {
                    tokens.push(new Token('Q'));
                } else if (char == 'i') {
                    tokens.push(new Token('I'));
                } else if (char == '+') {
                    tokens.push(new Token('PLUS'));
                } else if (char == '-') {
                    tokens.push(new Token('MINUS'));
                } else if (char == '*') {
                    tokens.push(new Token('TIMES'));
                } else if (char == '/') {
                    tokens.push(new Token('DIVIDE'));
                } else if (char == '^') {
                    tokens.push(new Token('POW'));
                } else if (char == '(') {
                    tokens.push(new Token('LPAREN'));
                } else if (char == ')') {
                    tokens.push(new Token('RPAREN'));
                } else if (/[0-9]/.test(char)) {
                    let lookAheadIndex = i;
                    let lookAheadChar = char;

                    while (/[0-9]/.test(lookAheadChar)) {
                        lookAheadIndex += 1;
                        lookAheadChar = input[lookAheadIndex];
                    }

                    tokens.push(new Token('INT', input.slice(i, lookAheadIndex)));

                    // lookAheadIndex - i is the length of the integer's string
                    // we don't want to re-analyze the characters of this string
                    // since they have already been accounted for in the while loop above
                    // so we increment i by that value minus 1 (becuase it will be 
                    // incremented again at the start of the outer for loop)
                    i += lookAheadIndex - i - 1;
                } else {
                    tokens.push(new Token('<?>'));
                }
            }
        }

        tokens.push(new Token('END'));
        return tokens;
    }
}

export default Lexer;
