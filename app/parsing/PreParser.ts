import { Token } from "./grammar";
import { NUM, LPAREN, RPAREN, PLUS, MINUS, TIMES, BAR, END, OPERATIONS, VARIABLES, } from "./constants";

export function preParse(tokens: Token[]) {
    let new_tokens = scanImplicitMultiplication(tokens);
    new_tokens = scanFoldableMinus(new_tokens);
    // new_tokens = scanInitialMinus(new_tokens);
    return new_tokens;
}

export function scanInitialMinus(tokens: Token[]) {
    const n_tokens = tokens.length;
    const new_tokens = []

    for (let i = 0; i < n_tokens - 1; i++) {
        const t = tokens[i];
        const t_next = tokens[i + 1];

        if (
            (i == 0 && t.name == MINUS)
        ) {
            new_tokens.push(new Token(NUM, '0'));
            new_tokens.push(t);
        } else if (t.name == LPAREN && t_next.name == MINUS) {
            new_tokens.push(t);
            new_tokens.push(new Token(NUM, '0'));
        } else {
            new_tokens.push(t);
        }
    }

    new_tokens.push(new Token(END));
    return new_tokens;
}

export function scanFoldableMinus(tokens: Token[]) {
    const n_tokens = tokens.length;
    const new_tokens = []

    for (let i = 0; i < n_tokens - 1; i++) {
        const t = tokens[i];
        const t_next = tokens[i + 1];

        if (t.name == MINUS && t_next.name == MINUS) {
            new_tokens.push(new Token(PLUS));
            i += 1;
        } else if (t.name == PLUS && t_next.name == MINUS) {
            new_tokens.push(new Token(MINUS));
            i += 1;
        } else {
            new_tokens.push(t);
        }
    }

    new_tokens.push(new Token(END));
    return new_tokens;
}

export function scanImplicitMultiplication(tokens: Token[]) {
    const n_tokens = tokens.length;
    const new_tokens = [];

    for (let i = 0; i < n_tokens - 1; i++) {
        const t = tokens[i]
        const t_next = tokens[i + 1]
        new_tokens.push(t);

        const is_var = VARIABLES.has(t.name);
        const is_num_or_r_paren = (t.name == NUM || t.name == RPAREN);
        const next_is_new_expression = (
            !OPERATIONS.has(t_next.name) &&
            t_next.name != RPAREN &&
            t_next.name != END &&
            t_next.name != NUM &&
            t_next.name != BAR
        );

        if (
            (is_var && t_next.name == LPAREN) || 
            (is_num_or_r_paren && next_is_new_expression)
        ) {
            new_tokens.push(new Token(TIMES));
        }
    }

    new_tokens.push(new Token(END));
    return new_tokens
}

export default preParse;
