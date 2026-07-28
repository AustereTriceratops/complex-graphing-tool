/// NONTERMINALS
export const S = 'S';
export const E = 'E';
export const EPrime = "EPrime";
export const T = 'T';
export const TPrime = "TPrime";
export const P = 'P';
export const PPrime = "PPrime";
export const F = "F";

/// TERMINALS
export const UNK = '<?>';
export const X = 'X';
export const Z = 'Z';
export const Q = 'Q';
export const I = 'I';
export const PLUS= 'PLUS';
export const MINUS = 'MINUS';
export const TIMES = 'TIMES';
export const DIVIDE = 'DIVIDE';
export const POW = 'POW';
export const NUM = 'NUM';
export const LPAREN = 'LPAREN';
export const RPAREN = 'RPAREN';
export const BAR = 'BAR';
export const FUNC = 'FUNC';
export const END = 'END';

// named numbers
export const e = '2.718281828459045';
export const pi = '3.141592653589793';
export const CONSTANTS = Object.freeze(new Set([e, pi]));

// named functions
export const EXP = 'exp';
export const SIN = 'sin';
export const COS = 'cos';
export const LOG = 'log';
export const SQRT = 'sqrt';
export const CONJ = 'conj';
export const DEDEKIND_ETA = 'dedekind_eta';

export const FUNCTIONS = Object.freeze(new Set([EXP, LOG, SIN, COS, SQRT, CONJ, DEDEKIND_ETA]));

// grammar
export const TERMINALS = Object.freeze(new Set([
    UNK,
    X,
    Z,
    Q,
    I,
    PLUS,
    MINUS,
    TIMES,
    DIVIDE,
    POW,
    NUM,
    LPAREN,
    RPAREN,
    BAR,
    FUNC,
    END,
]));
export const OPERATIONS = Object.freeze(new Set([PLUS, MINUS, TIMES, DIVIDE, POW]));
export const VARIABLES = Object.freeze(new Set([X, Z, Q]));

export const NONTERMINALS = Object.freeze(new Set([S, E, EPrime, T, TPrime, P, PPrime, F]));
export const NULLABLE_NONTERMINALS = Object.freeze(new Set([EPrime, TPrime, PPrime]));
