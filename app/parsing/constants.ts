/// NONTERMINALS
export const E = 'E'
export const EPrime = "EPrime"
export const T = 'T'
export const TPrime = "TPrime"
export const P = 'P'
export const PPrime = "PPrime"
export const F = "F"

/// TERMINALS
export const UNK = '<?>'
export const X = 'X'
export const Z = 'Z'
export const Q = 'Q'
export const I = 'I'
export const PLUS= 'PLUS'
export const MINUS = 'MINUS'
export const TIMES = 'TIMES'
export const DIVIDE = 'DIVIDE'
export const POW = 'POW'
export const NUM = 'NUM'
export const LPAREN = 'LPAREN'
export const RPAREN = 'RPAREN'
export const BAR = 'BAR'
export const FUNC = 'FUNC'
export const END = 'END'

// named functions
export const EXP = 'exp'
export const SIN = 'sin'
export const COS = 'cos'
export const LOG = 'log'

export const FUNCTIONS = Object.freeze(new Set([EXP, LOG, SIN, COS]));
