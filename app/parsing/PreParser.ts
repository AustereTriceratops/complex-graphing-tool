import { OPERATIONS, VARIABLES, Token } from "./grammar";
import { NUM, LPAREN, RPAREN, TIMES, END } from "./constants";

export function preParse(tokens: Token[]) {
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
            t_next.name != NUM
        );

        if (
            (is_var && t_next.name == LPAREN) || 
            (is_num_or_r_paren && next_is_new_expression)
        ) {
            new_tokens.push(new Token(TIMES));
        }
    }

    new_tokens.push(tokens[n_tokens - 1]);

    return new_tokens;
}

export default preParse;
