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
    'NUM',
    'LPAREN',
    'RPAREN',
]) // should END be in here?

export const NONTERMINALS = new Set(["E", "EPrime", "T", "TPrime", "F"]);

export const NULLABLE_NONTERMINALS = new Set(['EPrime', 'TPrime']);

export const PRODUCTIONS: [string, string[]][]  = [
    ['E', ['T', 'EPrime']],
    ['EPrime', ['PLUS', 'T', 'EPrime']],
    ['EPrime', ['MINUS', 'T', 'EPrime']],
    ['EPrime', []],
    ['T', ['F', 'TPrime']],
    ['TPrime', ['TIMES', 'F', 'TPrime']],
    ['TPrime', ['DIVIDE', 'F', 'TPrime']],
    ['TPrime', []],
    ['F', ['LPAREN', 'E', 'RPAREN']],
    ['F', ['NUM']],
    ['F', ['X']],
    ['F', ['Z']],
    ['F', ['Q']],
    ['F', ['I']],
] as const;

export const PARSING_TABLE: Record<string, Record<string, string[]>> = {
    'E': {
        'NUM': PRODUCTIONS[0][1], //['T', 'EPrime']
        'LPAREN': PRODUCTIONS[0][1], //['T', 'EPrime']
        'X': PRODUCTIONS[0][1], //['T', 'EPrime']
        'Z': PRODUCTIONS[0][1], //['T', 'EPrime']
        'Q': PRODUCTIONS[0][1], //['T', 'EPrime']
        'I': PRODUCTIONS[0][1], //['T', 'EPrime']
        'END': []
    },
    'EPrime': {
        'PLUS': PRODUCTIONS[1][1], //['PLUS', 'T', 'EPrime'],
        'MINUS': PRODUCTIONS[2][1], //['MINUS', 'T', 'EPrime']
        'RPAREN': PRODUCTIONS[3][1], //[],
        'END': PRODUCTIONS[3][1], //[],
    },
    'T': {
        'NUM': PRODUCTIONS[4][1], //['F', 'TPrime'],
        'LPAREN': PRODUCTIONS[4][1], //['F', 'TPrime'],
        'X': PRODUCTIONS[4][1], //['F', 'TPrime'],
        'Z': PRODUCTIONS[4][1], //['F', 'TPrime'],
        'Q': PRODUCTIONS[4][1], //['F', 'TPrime'],
        'I': PRODUCTIONS[4][1], //['F', 'TPrime'],
    },
    'TPrime': {
        'RPAREN': PRODUCTIONS[7][1], //[],
        'END': PRODUCTIONS[7][1], //[],
        'PLUS': PRODUCTIONS[7][1], //[],
        'MINUS': PRODUCTIONS[7][1], //[],
        'TIMES': PRODUCTIONS[5][1], //['TIMES', 'F', 'TPrime'],
        'DIVIDE': PRODUCTIONS[6][1], //['DIVIDE', 'F', 'TPrime']
    },
    'F': {
        'LPAREN': PRODUCTIONS[8][1], //['LPAREN', 'E', 'RPAREN'],
        'NUM': PRODUCTIONS[9][1], //['NUM'],
        'X': PRODUCTIONS[10][1], //['X'],
        'Z': PRODUCTIONS[11][1], //['Z'],
        'Q': PRODUCTIONS[12][1], //['Q'],
        'I': PRODUCTIONS[13][1], //['I'],
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