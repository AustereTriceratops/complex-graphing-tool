import Lexer from '../app/parsing/Lexer';

test('tokenizing single characters', () => {
    const tokens = Lexer.scan("+-*/()^xiqz1");
    const expectedTokens = [
        "PLUS", "MINUS", "TIMES", "DIVIDE", "LPAREN", "RPAREN", "POW", "X", "I", "Q", "Z", "INT"
    ];

    tokens.map((t, i) => expect(t.name).toEqual(expectedTokens[i]));
});

test('tokenizing simple expressions', () => {
    let tokens = Lexer.scan("x + 2 + i");
    let expectedTokens = [
        "X", "PLUS", "INT", "PLUS", "I"
    ];

    expect(tokens.length).toEqual(expectedTokens.length);
    tokens.map((t, i) => expect(t.name).toEqual(expectedTokens[i]));

    tokens = Lexer.scan("x*(1+i)");
    expectedTokens = [
        "X", "TIMES", "LPAREN", "INT", "PLUS", "I", "RPAREN"
    ];

    expect(tokens.length).toEqual(expectedTokens.length);
    tokens.map((t, i) => expect(t.name).toEqual(expectedTokens[i]));

    tokens = Lexer.scan("x*x*x");
    expectedTokens = [
        "X", "TIMES", "X", "TIMES", "X",
    ];

    expect(tokens.length).toEqual(expectedTokens.length);
    tokens.map((t, i) => expect(t.name).toEqual(expectedTokens[i]));
})

test('tokenizing integers', () => {
    let tokens = Lexer.scan("7");
    let expectedTokens = ["INT"];
    let expectedValues = ["7"];

    expect(tokens.length).toEqual(expectedTokens.length);
    tokens.map((t, i) => expect(t.name).toEqual(expectedTokens[i]));
    tokens.map((t, i) => expect(t.value).toEqual(expectedValues[i]));

    tokens = Lexer.scan("51");
    expectedTokens = ["INT"];
    expectedValues = ["51"];

    expect(tokens.length).toEqual(expectedTokens.length);
    tokens.map((t, i) => expect(t.name).toEqual(expectedTokens[i]));
    tokens.map((t, i) => expect(t.value).toEqual(expectedValues[i]));

    tokens = Lexer.scan("9999 999");
    expectedTokens = ["INT", "INT"];
    expectedValues = ["9999", "999"];

    expect(tokens.length).toEqual(expectedTokens.length);
    tokens.map((t, i) => expect(t.name).toEqual(expectedTokens[i]));
    tokens.map((t, i) => expect(t.value).toEqual(expectedValues[i]));

    tokens = Lexer.scan("201*x + 450");
    expectedValues = ["201", null, null, null, "450"];

    tokens.map((t, i) => expect(t.value).toEqual(expectedValues[i]));
})