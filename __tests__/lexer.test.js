import Lexer from '../app/parsing/Lexer.ts';

test('scanning empty string', () => {
    const tokens = Lexer.scan("");
    const expectedTokens = [
        "END"
    ];

    expect(tokens.length).toEqual(expectedTokens.length);
    tokens.map((t, i) => expect(t.name).toEqual(expectedTokens[i]));
});

test('scanning unknown tokens', () => {
    const tokens = Lexer.scan("ke ] <=> x");
    const expectedTokens = [
        "<?>", "<?>", "<?>", "<?>", "<?>", "X", "END"
    ];
    const expectedValues = [
        "ke", null, null, null, null, null, null
    ];
    
    expect(tokens.length).toEqual(expectedTokens.length);
    tokens.map((t, i) => expect(t.name).toEqual(expectedTokens[i]));
    tokens.map((t, i) => expect(t.value).toEqual(expectedValues[i]));
});

test('scanning with no spaces', () => {
    const tokens = Lexer.scan("2x");
    const expectedTokens = [
        "INT", "X", "END"
    ];
});

test('tokenizing single characters', () => {
    const tokens = Lexer.scan("+-*/()^xiqz1");
    const expectedTokens = [
        "PLUS", "MINUS", "TIMES", "DIVIDE", "LPAREN", "RPAREN", "POW", "X", "I", "Q", "Z", "INT", "END"
    ];

    tokens.map((t, i) => expect(t.name).toEqual(expectedTokens[i]));
});

test('tokenizing simple expressions', () => {
    let tokens = Lexer.scan("x + 2 + i");
    let expectedTokens = [
        "X", "PLUS", "INT", "PLUS", "I", "END"
    ];

    expect(tokens.length).toEqual(expectedTokens.length);
    tokens.map((t, i) => expect(t.name).toEqual(expectedTokens[i]));

    tokens = Lexer.scan("x*(1+i)");
    expectedTokens = [
        "X", "TIMES", "LPAREN", "INT", "PLUS", "I", "RPAREN", "END"
    ];

    expect(tokens.length).toEqual(expectedTokens.length);
    tokens.map((t, i) => expect(t.name).toEqual(expectedTokens[i]));

    tokens = Lexer.scan("x*x*x");
    expectedTokens = [
        "X", "TIMES", "X", "TIMES", "X", "END"
    ];

    expect(tokens.length).toEqual(expectedTokens.length);
    tokens.map((t, i) => expect(t.name).toEqual(expectedTokens[i]));
})

test('tokenizing integers', () => {
    let tokens = Lexer.scan("7");
    let expectedTokens = ["INT", "END"];
    let expectedValues = ["7", null];

    expect(tokens.length).toEqual(expectedTokens.length);
    tokens.map((t, i) => expect(t.name).toEqual(expectedTokens[i]));
    tokens.map((t, i) => expect(t.value).toEqual(expectedValues[i]));

    tokens = Lexer.scan("51");
    expectedTokens = ["INT", "END"];
    expectedValues = ["51", null];

    expect(tokens.length).toEqual(expectedTokens.length);
    tokens.map((t, i) => expect(t.name).toEqual(expectedTokens[i]));
    tokens.map((t, i) => expect(t.value).toEqual(expectedValues[i]));

    tokens = Lexer.scan("9999 999");
    expectedTokens = ["INT", "INT", "END"];
    expectedValues = ["9999", "999", null];

    expect(tokens.length).toEqual(expectedTokens.length);
    tokens.map((t, i) => expect(t.name).toEqual(expectedTokens[i]));
    tokens.map((t, i) => expect(t.value).toEqual(expectedValues[i]));

    tokens = Lexer.scan("201*x + 450");
    expectedValues = ["201", null, null, null, "450", null];

    tokens.map((t, i) => expect(t.value).toEqual(expectedValues[i]));
})