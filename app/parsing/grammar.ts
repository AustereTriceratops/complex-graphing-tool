import {
    X, Z, Q, I, PLUS, MINUS, TIMES, DIVIDE, POW, NUM, PARAM, LPAREN, RPAREN, BAR, FUNC, END,
    S, E, EPrime, T, TPrime, P, PPrime, F
} from "./constants";

export const PRODUCTIONS: [string, string[]][]  = [
    [S, [E, END]],
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
    [F, [PARAM]],
] as const;


// Record<Nonterminal, Record<Terminal, string[]>>
export const PARSING_TABLE: Record<string, Record<string, string[]>> = {
    S: {
        NUM: PRODUCTIONS[0][1], //[E, END]
        LPAREN: PRODUCTIONS[0][1], //[E, END]
        X: PRODUCTIONS[0][1], //[E, END]
        Z: PRODUCTIONS[0][1], //[E, END]
        Q: PRODUCTIONS[0][1], //[E, END]
        I: PRODUCTIONS[0][1], //[E, END]
        MINUS: PRODUCTIONS[0][1], //[E, END]
        FUNC: PRODUCTIONS[0][1], //[E, END]
        BAR: PRODUCTIONS[0][1], //[E, END]
    },

    E: {
        NUM: PRODUCTIONS[1][1], //[T, EPrime]
        LPAREN: PRODUCTIONS[1][1], //[T, EPrime]
        X: PRODUCTIONS[1][1], //[T, EPrime]
        Z: PRODUCTIONS[1][1], //[T, EPrime]
        Q: PRODUCTIONS[1][1], //[T, EPrime]
        I: PRODUCTIONS[1][1], //[T, EPrime]
        MINUS: PRODUCTIONS[1][1], //[T, EPrime]
        FUNC: PRODUCTIONS[1][1], //[T, EPrime]
        BAR: PRODUCTIONS[1][1], //[T, EPrime]
        END: []
    },
    EPrime: {
        PLUS: PRODUCTIONS[2][1], //[PLUS, T, EPrime],
        MINUS: PRODUCTIONS[3][1], //[MINUS, T, EPrime]
        RPAREN: PRODUCTIONS[4][1], //[],
        BAR: PRODUCTIONS[4][1], //[],
        END: PRODUCTIONS[4][1], //[],
    },
    T: {
        NUM: PRODUCTIONS[5][1], //[P, TPrime],
        LPAREN: PRODUCTIONS[5][1], //[P, TPrime],
        X: PRODUCTIONS[5][1], //[P, TPrime],
        Z: PRODUCTIONS[5][1], //[P, TPrime],
        Q: PRODUCTIONS[5][1], //[P, TPrime],
        I: PRODUCTIONS[5][1], //[P, TPrime],
        MINUS: PRODUCTIONS[5][1], //[P, TPrime],
        BAR: PRODUCTIONS[5][1], //[P, TPrime],
        FUNC: PRODUCTIONS[5][1], //[P, TPrime],
    },
    TPrime: {
        TIMES: PRODUCTIONS[6][1], //[TIMES, P, TPrime],
        DIVIDE: PRODUCTIONS[7][1], //[DIVIDE, P, 'TPrime]
        PLUS: PRODUCTIONS[8][1], //[],
        MINUS: PRODUCTIONS[8][1], //[],
        RPAREN: PRODUCTIONS[8][1], //[],
        BAR: PRODUCTIONS[8][1], //[],
        END: PRODUCTIONS[8][1], //[],
    },
    P: {
        NUM: PRODUCTIONS[9][1], //[F, PPrime],
        LPAREN: PRODUCTIONS[9][1], //[F, PPrime],
        X: PRODUCTIONS[9][1], //[F, PPrime],
        Z: PRODUCTIONS[9][1], //[F, PPrime],
        Q: PRODUCTIONS[9][1], //[F, PPrime],
        I: PRODUCTIONS[9][1], //[F, PPrime],
        MINUS: PRODUCTIONS[9][1], //[F, PPrime],
        BAR: PRODUCTIONS[9][1], //[F, PPrime],
        FUNC: PRODUCTIONS[9][1], //[F, PPrime],
    },
    PPrime: {
        POW: PRODUCTIONS[10][1], //[POW, F, PPrime],
        TIMES: PRODUCTIONS[11][1], //[],
        DIVIDE: PRODUCTIONS[11][1], //[]
        PLUS: PRODUCTIONS[11][1], //[],
        MINUS: PRODUCTIONS[11][1], //[],
        RPAREN: PRODUCTIONS[11][1], //[],
        BAR: PRODUCTIONS[11][1], //[],
        END: PRODUCTIONS[11][1], //[],
    },
    F: {
        LPAREN: PRODUCTIONS[12][1], //[LPAREN, E, RPAREN],
        NUM: PRODUCTIONS[13][1], //[NUM],
        X: PRODUCTIONS[14][1], //[X],
        Z: PRODUCTIONS[15][1], //[Z],
        Q: PRODUCTIONS[16][1], //[Q],
        I: PRODUCTIONS[17][1], //[I],
        MINUS: PRODUCTIONS[18][1], //[MINUS, F],
        FUNC: PRODUCTIONS[19][1], //[FUNC, LPAREN, E, RPAREN],
        BAR: PRODUCTIONS[20][1], //[BAR, E, BAR],
        PARAM: PRODUCTIONS[21][1], //[CONST],
    }
};

export class Token {
    name: string; // terminal symbol
    value: string | null;

    constructor(name: string, value: string | null = null) {
        this.name = name;
        this.value = value;
    }
}