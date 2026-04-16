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
])

export const NONTERMINALS = new Set(["E", "EPrime", "T", "TPrime", "F"]);

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

type OptionalString = string | null

export class Token {
    name: string
    value: OptionalString

    constructor(name: string, value: OptionalString=null) {
        this.name = name;
        this.value = value;
    }
}