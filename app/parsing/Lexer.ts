import { Token } from "./grammar";
import {
    UNK, X, Z, Q, I, PLUS, MINUS, TIMES, DIVIDE, POW, NUM, LPAREN, RPAREN, FUNC, END
} from "./constants"

export function lookAhead(inputString: string, startIndex: number, regex: RegExp) {
    let lookAheadIndex = startIndex;
    let lookAheadChar = inputString[startIndex];
    
    while (regex.test(lookAheadChar)) {
        lookAheadIndex += 1;
        lookAheadChar = inputString[lookAheadIndex];

        if (lookAheadChar == undefined) break;
    }
    
    const txt = inputString.slice(startIndex, lookAheadIndex);
    
    // lookAheadIndex - startIndex is the length of the integer's string
    // we don't want to re-analyze the characters of this string
    // since they have already been accounted for in the while loop above
    // so we increment i by that value minus 1 (becuase it will be 
    // incremented again at the start of the outer for loop)
    const indexIncrement = lookAheadIndex - startIndex - 1;

    return {txt: txt, indexIncrement: indexIncrement};
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
                    const {txt, indexIncrement} = lookAhead(input, i, /[a-zA-Z_1-9]/)
                    const token = new Token(UNK, txt)

                    // TODO:  attempt to recognize sequences like exp, sin, cos. etc.
                    if (indexIncrement == 0) { // single-character reserved names
                        if (char == 'x') {
                            tokens.push(new Token(X));
                        } else if (char == 'z') {
                            tokens.push(new Token(Z));
                        } else if (char == 'q') {
                            tokens.push(new Token(Q));
                        } else if (char == 'i') {
                            tokens.push(new Token(I));
                        }
                    } else {
                        tokens.push(token);
                        i += indexIncrement;
                    }
                } else if (char == '+') {
                    tokens.push(new Token(PLUS));
                } else if (char == '-') {
                    tokens.push(new Token(MINUS));
                } else if (char == '*') {
                    tokens.push(new Token(TIMES));
                } else if (char == '/') {
                    tokens.push(new Token(DIVIDE));
                } else if (char == '^') {
                    tokens.push(new Token(POW));
                } else if (char == '(') {
                    tokens.push(new Token(LPAREN));
                } else if (char == ')') {
                    tokens.push(new Token(RPAREN));
                } else if (/[0-9]/.test(char)) {
                    let {txt, indexIncrement} = lookAhead(input, i, /[0-9]/);
                    i += indexIncrement;

                    if (input[i+1] == '.') {
                        const {txt: txt2, indexIncrement} = lookAhead(input, i + 2, /[0-9]/);
                        i += indexIncrement + 2;
                        txt += "." + txt2
                    }

                    const token = new Token(NUM, txt);
                    tokens.push(token);
                } else {
                    tokens.push(new Token(UNK));
                }
            }
        }

        tokens.push(new Token(END));
        return tokens;
    }
}

export default Lexer;
