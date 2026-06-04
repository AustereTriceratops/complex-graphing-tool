import Lexer, {lookAhead} from '../app/parsing/Lexer.ts';

test('test lookahead', () => {
    let input = '444.0'
    let {txt, indexIncrement} = lookAhead(input, 0, /[0-9]/);

    expect(txt).toEqual('444');
    expect(indexIncrement).toEqual(2);

    input = '44.0';
    ({txt, indexIncrement} = lookAhead(input, 0, /[0-9]/));

    expect(txt).toEqual('44');
    expect(indexIncrement).toEqual(1);

    input = '4.0';
    ({txt, indexIncrement} = lookAhead(input, 0, /[0-9]/));

    expect(txt).toEqual('4');
    expect(indexIncrement).toEqual(0);

    input = '.0';
    ({txt, indexIncrement} = lookAhead(input, 0, /[0-9]/));

    expect(txt).toEqual('');
    expect(indexIncrement).toEqual(-1);
})

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

test('scanning to the longest match', () => {
    tokens = Lexer.scan("xerox printer ink");
    expectedTokens = [
        "<?>", "<?>", "<?>", "END"
    ];
    expectedValues = [
        "xerox", "printer", "ink", null,
    ];
    
    expect(tokens.length).toEqual(expectedTokens.length);
    tokens.map((t, i) => expect(t.name).toEqual(expectedTokens[i]));
    tokens.map((t, i) => expect(t.value).toEqual(expectedValues[i]));
})

test('scanning with no spaces', () => {
    const tokens = Lexer.scan("2x");
    const expectedTokens = [
        "NUM", "X", "END"
    ];

    expect(tokens.length).toEqual(expectedTokens.length);
    tokens.map((t, i) => expect(t.name).toEqual(expectedTokens[i]));
});

test('tokenizing single characters', () => {
    let tokens = Lexer.scan("+-*/()^x i q z 1");
    let expectedTokens = [
        "PLUS", "MINUS", "TIMES", "DIVIDE", "LPAREN", "RPAREN", "POW", "X", "I", "Q", "Z", "NUM", "END"
    ];

    tokens.map((t, i) => expect(t.name).toEqual(expectedTokens[i]));

    tokens = Lexer.scan("+-*/()^xiqz1");
    expectedTokens = [
        "PLUS", "MINUS", "TIMES", "DIVIDE", "LPAREN", "RPAREN", "POW", "<?>", "NUM", "END"
    ];

    tokens.map((t, i) => expect(t.name).toEqual(expectedTokens[i]));
});

test('tokenizing simple expressions', () => {
    let tokens = Lexer.scan("x + 2 + i");
    let expectedTokens = [
        "X", "PLUS", "NUM", "PLUS", "I", "END"
    ];

    expect(tokens.length).toEqual(expectedTokens.length);
    tokens.map((t, i) => expect(t.name).toEqual(expectedTokens[i]));

    tokens = Lexer.scan("x*(1+i)");
    expectedTokens = [
        "X", "TIMES", "LPAREN", "NUM", "PLUS", "I", "RPAREN", "END"
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
    let expectedTokens = ["NUM", "END"];
    let expectedValues = ["7", null];

    expect(tokens.length).toEqual(expectedTokens.length);
    tokens.map((t, i) => expect(t.name).toEqual(expectedTokens[i]));
    tokens.map((t, i) => expect(t.value).toEqual(expectedValues[i]));

    tokens = Lexer.scan("51");
    expectedTokens = ["NUM", "END"];
    expectedValues = ["51", null];

    expect(tokens.length).toEqual(expectedTokens.length);
    tokens.map((t, i) => expect(t.name).toEqual(expectedTokens[i]));
    tokens.map((t, i) => expect(t.value).toEqual(expectedValues[i]));

    tokens = Lexer.scan("9999 999");
    expectedTokens = ["NUM", "NUM", "END"];
    expectedValues = ["9999", "999", null];

    expect(tokens.length).toEqual(expectedTokens.length);
    tokens.map((t, i) => expect(t.name).toEqual(expectedTokens[i]));
    tokens.map((t, i) => expect(t.value).toEqual(expectedValues[i]));

    tokens = Lexer.scan("201*x + 450");
    expectedValues = ["201", null, null, null, "450", null];

    tokens.map((t, i) => expect(t.value).toEqual(expectedValues[i]));
})

test('tokenizing floats', () => {
    let tokens = Lexer.scan("1.0");
    let expectedTokens = ["NUM", "END"];
    let expectedValue = "1.0";

    console.log(tokens)
    expect(tokens.length).toEqual(expectedTokens.length);
    expect(tokens[0].value).toEqual(expectedValue)
    
    tokens = Lexer.scan("1.");
    expectedTokens = ["NUM", "END"];
    expectedValue = "1.";

    console.log(tokens)
    expect(tokens.length).toEqual(expectedTokens.length);
    expect(tokens[0].value).toEqual(expectedValue)

    tokens = Lexer.scan("3.14159265");
    expectedTokens = ["NUM", "END"];
    expectedValue = "3.14159265";

    console.log(tokens)
    expect(tokens.length).toEqual(expectedTokens.length);
    expect(tokens[0].value).toEqual(expectedValue)
})