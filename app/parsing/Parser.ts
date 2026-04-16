import * as AST from './AST/AST';
import Token from './Lexer';

const nonterminals = new Set(["E", "EPrime", "T", "TPrime", "F"]);

const rules = [
    ['E', ['T', 'EPrime']],
    ['EPrime', ['PLUS', 'T', 'EPrime']],
    ['EPrime', ['MINUS', 'T', 'EPrime']],
    ['EPrime', []],
    ['T', ['F', 'TPrime']],
    ['TPrime', ['TIMES', 'F', 'TPrime']],
    ['TPrime', ['DIVIDE', 'F', 'TPrime']],
    ['TPrime', []],
    ['F', ['LPAREN', 'E', 'RPAREN']],
    ['F', ['INT']],
    ['F', ['X']],
    ['F', ['Z']],
    ['F', ['Q']],
    ['F', ['I']],
] as const;

class Parser {
    parsingTable = {
        'E': {
            'INT': ['T', 'EPrime'],
            'LPAREN': ['T', 'EPrime'],
            'X': ['T', 'EPrime'],
            'Z': ['T', 'EPrime'],
            'Q': ['T', 'EPrime'],
            'I': ['T', 'EPrime'],
        },
        'EPrime': {
            'RPAREN': [],
            'END': [],
            'PLUS': ['PLUS', 'T', 'EPrime'],
            'MINUS': ['MINUS', 'T', 'EPrime']
        },
        'T': {
            'INT': ['F', 'TPrime'],
            'LPAREN': ['F', 'TPrime'],
            'X': ['F', 'TPrime'],
            'Z': ['F', 'TPrime'],
            'Q': ['F', 'TPrime'],
            'I': ['F', 'TPrime'],
        },
        'TPrime': {
            'RPAREN': [],
            'END': [],
            'PLUS': [],
            'MINUS': [],
            'TIMES': ['TIMES', 'F', 'TPrime'],
            'DIVIDE': ['DIVIDE', 'F', 'TPrime']
        },
        'F': {
            'INT': ['INT'],
            'LPAREN': ['LPAREN'],
            'X': ['X'],
            'Z': ['Z'],
            'Q': ['Q'],
            'I': ['I'],
        }
    }

    static parse(tokens: Token[]) {
        let accept = true;

        accept = true;

        return {
            AST: new AST.ASTNode(), accept: accept
        };
    }
}

export default Parser;
