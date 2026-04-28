export const TERMINALS = new Set([
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
]) // should END be in here?

export const NONTERMINALS = new Set(["E", "EPrime", "T", "TPrime", "F"]);

export const NULLABLE_NONTERMINALS = new Set(['EPrime', 'TPrime']);

export const PRODUCTIONS = [
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

export const PARSING_TABLE: Record<string, Record<string, string[]>> = {
    'E': {
        'INT': ['T', 'EPrime'],
        'LPAREN': ['T', 'EPrime'],
        'X': ['T', 'EPrime'],
        'Z': ['T', 'EPrime'],
        'Q': ['T', 'EPrime'],
        'I': ['T', 'EPrime'],
        'END': []
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
        'LPAREN': ['LPAREN', 'E', 'RPAREN'],
        'X': ['X'],
        'Z': ['Z'],
        'Q': ['Q'],
        'I': ['I'],
    }
}

type OptionalString = string | null

export class Token {
    name: string
    value: OptionalString

    constructor(name: string, value: OptionalString=null) {
        this.name = name;
        this.value = value;
    }
}