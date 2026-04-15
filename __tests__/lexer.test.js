import Lexer from '../app/parsing/Lexer';

test('single-character tokenizing', () => {
    const tokens = Lexer.scan("+-*/()^xiqz1");
    const expectedTokens = [
        "PLUS", "MINUS", "TIMES", "DIVIDE", "LPAREN", "RPAREN", "POW", "X", "I", "Q", "Z", "INT"
    ];

    tokens.map((t, i) => expect(t.name).toEqual(expectedTokens[i]))

    expect(tokens)
});