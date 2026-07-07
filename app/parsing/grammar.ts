import {
    X, Z, Q, I, PLUS, MINUS, TIMES, DIVIDE, POW, NUM, LPAREN, RPAREN, BAR, FUNC,
    E, EPrime, T, TPrime, P, PPrime, F
} from "./constants"

export const PRODUCTIONS: [string, string[]][]  = [
    [E, [T, EPrime]],
    [EPrime, [PLUS, T, EPrime]],
    [EPrime, [MINUS, T, EPrime]],
    [EPrime, []],
    [T, [P, TPrime]],
    [TPrime, [TIMES, P, TPrime]],
    [TPrime, [DIVIDE, P, TPrime]],
    [TPrime, []],
    [P, [F, PPrime]],
    [PPrime, [POW, F, PPrime]],
    [PPrime, []],
    [F, [LPAREN, E, RPAREN]],
    [F, [NUM]],
    [F, [X]],
    [F, [Z]],
    [F, [Q]],
    [F, [I]],
    [F, [MINUS, F]],
    [F, [FUNC, LPAREN, E, RPAREN]],
    [F, [BAR, E, BAR]],
] as const;


// Record<Nonterminal, Record<Terminal, string[]>>
export const PARSING_TABLE: Record<string, Record<string, string[]>> = {
    E: {
        NUM: PRODUCTIONS[0][1], //[T, EPrime]
        LPAREN: PRODUCTIONS[0][1], //[T, EPrime]
        X: PRODUCTIONS[0][1], //[T, EPrime]
        Z: PRODUCTIONS[0][1], //[T, EPrime]
        Q: PRODUCTIONS[0][1], //[T, EPrime]
        I: PRODUCTIONS[0][1], //[T, EPrime]
        MINUS: PRODUCTIONS[0][1], //[T, EPrime]
        FUNC: PRODUCTIONS[0][1], //[T, EPrime]
        BAR: PRODUCTIONS[0][1], //[T, EPrime]
        END: []
    },
    EPrime: {
        PLUS: PRODUCTIONS[1][1], //[PLUS, T, EPrime],
        MINUS: PRODUCTIONS[2][1], //[MINUS, T, EPrime]
        RPAREN: PRODUCTIONS[3][1], //[],
        BAR: PRODUCTIONS[3][1], //[],
        END: PRODUCTIONS[3][1], //[],
    },
    T: {
        NUM: PRODUCTIONS[4][1], //[P, TPrime],
        LPAREN: PRODUCTIONS[4][1], //[P, TPrime],
        X: PRODUCTIONS[4][1], //[P, TPrime],
        Z: PRODUCTIONS[4][1], //[P, TPrime],
        Q: PRODUCTIONS[4][1], //[P, TPrime],
        I: PRODUCTIONS[4][1], //[P, TPrime],
        MINUS: PRODUCTIONS[4][1], //[P, TPrime],
        BAR: PRODUCTIONS[4][1], //[P, TPrime],
        FUNC: PRODUCTIONS[4][1], //[P, TPrime],
    },
    TPrime: {
        TIMES: PRODUCTIONS[5][1], //[TIMES, P, TPrime],
        DIVIDE: PRODUCTIONS[6][1], //[DIVIDE, P, 'TPrime]
        PLUS: PRODUCTIONS[7][1], //[],
        MINUS: PRODUCTIONS[7][1], //[],
        RPAREN: PRODUCTIONS[7][1], //[],
        BAR: PRODUCTIONS[7][1], //[],
        END: PRODUCTIONS[7][1], //[],
    },
    P: {
        NUM: PRODUCTIONS[8][1], //[F, PPrime],
        LPAREN: PRODUCTIONS[8][1], //[F, PPrime],
        X: PRODUCTIONS[8][1], //[F, PPrime],
        Z: PRODUCTIONS[8][1], //[F, PPrime],
        Q: PRODUCTIONS[8][1], //[F, PPrime],
        I: PRODUCTIONS[8][1], //[F, PPrime],
        MINUS: PRODUCTIONS[8][1], //[F, PPrime],
        BAR: PRODUCTIONS[8][1], //[F, PPrime],
        FUNC: PRODUCTIONS[8][1], //[F, PPrime],
    },
    PPrime: {
        POW: PRODUCTIONS[9][1], //[POW, F, PPrime],
        TIMES: PRODUCTIONS[10][1], //[],
        DIVIDE: PRODUCTIONS[10][1], //[]
        PLUS: PRODUCTIONS[10][1], //[],
        MINUS: PRODUCTIONS[10][1], //[],
        RPAREN: PRODUCTIONS[10][1], //[],
        BAR: PRODUCTIONS[10][1], //[],
        END: PRODUCTIONS[10][1], //[],
    },
    F: {
        LPAREN: PRODUCTIONS[11][1], //[LPAREN, E, RPAREN],
        NUM: PRODUCTIONS[12][1], //[NUM],
        X: PRODUCTIONS[13][1], //[X],
        Z: PRODUCTIONS[14][1], //[Z],
        Q: PRODUCTIONS[15][1], //[Q],
        I: PRODUCTIONS[16][1], //[I],
        MINUS: PRODUCTIONS[17][1], //[MINUS, F],
        FUNC: PRODUCTIONS[18][1], //[FUNC, LPAREN, E, RPAREN],
        BAR: PRODUCTIONS[19][1], //[BAR, E, BAR],
    }
}

export class Token {
    name: string // terminal symbol
    value: string | null

    constructor(name: string, value: string | null = null) {
        this.name = name;
        this.value = value;
    }
}