const TOKENS = [
    '<?>',
    'X',
    'Z',
    'Q',
    'I',
    'PLUS',
    'TIMES',
    'POW',
    'INT'
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
                console.log("END");
                break;
            } else {
                console.log(input[i])

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
                } else if (char == '*') {
                    tokens.push(new Token('TIMES'));
                } else if (char == '^') {
                    tokens.push(new Token('POW'));
                } else if (/[0-9]/.test(char)) {
                    tokens.push(new Token('INT', char));
                } else {
                    tokens.push(new Token('<?>'));
                }
                
            }
        }

        return tokens
    }
}

export default Lexer;
