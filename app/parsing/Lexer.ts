import { Token } from "./grammar";

function lookAhead(inputString: string, startIndex: number, regex: RegExp, tokenType: string) {
    let lookAheadIndex = startIndex;
    let lookAheadChar = inputString[startIndex];
    
    while (regex.test(lookAheadChar)) {
        lookAheadIndex += 1;
        lookAheadChar = inputString[lookAheadIndex];
    }
    
    const token = new Token(tokenType, inputString.slice(startIndex, lookAheadIndex));
    
    // lookAheadIndex - i is the length of the integer's string
    // we don't want to re-analyze the characters of this string
    // since they have already been accounted for in the while loop above
    // so we increment i by that value minus 1 (becuase it will be 
    // incremented again at the start of the outer for loop)
    const indexIncrement = lookAheadIndex - startIndex - 1;

    return {token: token, indexIncrement: indexIncrement};
}

class Lexer {
    static scan(input: string) {
        const n = input.length;
        const tokens = [];

        for (let i = 0; i < n; i++) {
            const char = input[i]
            
            if (char == ' ') {
                continue;
            } else if (char == undefined) {
                throw Error("undefined character in input string");
            } else {
                if (/[a-zA-Z]/.test(char)) {
                    // TODO:  attempt to recognize sequences like exp, sin, cos. etc.
                    if (char == 'x') {
                        tokens.push(new Token('X'));
                    } else if (char == 'z') {
                        tokens.push(new Token('Z'));
                    } else if (char == 'q') {
                        tokens.push(new Token('Q'));
                    } else if (char == 'i') {
                        tokens.push(new Token('I'));
                    } else {
                        const {token, indexIncrement} = lookAhead(input, i, /[a-zA-Z]/, '<?>')

                        tokens.push(token);
                        i += indexIncrement;
                    }
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
                    const {token, indexIncrement} = lookAhead(input, i, /[0-9]/, 'INT')

                    tokens.push(token);
                    i += indexIncrement;
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
