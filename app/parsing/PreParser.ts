import { OPERATIONS, Token } from "./grammar";
import { NUM, TIMES, END } from "./constants";

export function preParse(tokens: Token[]) {
    const n_tokens = tokens.length;
    const new_tokens = [];

    for (let i = 0; i < n_tokens - 1; i++) {
        new_tokens.push[tokens[i]];

        if (tokens[i].name == NUM && tokens[i+1].name != END && !OPERATIONS.has(tokens[i+1].name)) {
            new_tokens.push(new Token(TIMES))
        }
    }

    new_tokens.push(tokens[n_tokens - 1]);

    return new_tokens;
}

export default preParse;
