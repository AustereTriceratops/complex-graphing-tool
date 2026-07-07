import {expect, test} from '@jest/globals';

import Lexer, {lookAhead} from '../app/parsing/Lexer.ts';
import {
    UNK, X, Z, Q, I, PLUS, MINUS, TIMES, DIVIDE, POW, NUM, LPAREN, RPAREN, BAR, FUNC, END
} from "../app/parsing/constants"

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
        END
    ];

    expect(tokens.length).toEqual(expectedTokens.length);
    tokens.map((t, i) => expect(t.name).toEqual(expectedTokens[i]));
});

test('scanning unknown tokens', () => {
    const tokens = Lexer.scan("ke ] <=> x");
    const expectedTokens = [
        UNK, UNK, UNK, UNK, UNK, X, END
    ];
    const expectedValues = [
        "ke", null, null, null, null, null, null
    ];
    
    expect(tokens.length).toEqual(expectedTokens.length);
    tokens.map((t, i) => expect(t.name).toEqual(expectedTokens[i]));
    tokens.map((t, i) => expect(t.value).toEqual(expectedValues[i]));
});

test('scanning to the longest match', () => {
    const tokens = Lexer.scan("xerox printer ink");
    const expectedTokens = [
       UNK, UNK, UNK, END
    ];
    const expectedValues = [
        "xerox", "printer", "ink", null,
    ];
    
    expect(tokens.length).toEqual(expectedTokens.length);
    tokens.map((t, i) => expect(t.name).toEqual(expectedTokens[i]));
    tokens.map((t, i) => expect(t.value).toEqual(expectedValues[i]));
})

test('scanning with no spaces', () => {
    const tokens = Lexer.scan("2x");
    const expectedTokens = [
        NUM, X, END
    ];

    expect(tokens.length).toEqual(expectedTokens.length);
    tokens.map((t, i) => expect(t.name).toEqual(expectedTokens[i]));
});

test('tokenizing single characters', () => {
    let tokens = Lexer.scan("+-*/()^x i q z 1 |");
    let expectedTokens = [
        PLUS, MINUS, TIMES, DIVIDE, LPAREN, RPAREN, POW, X, I, Q, Z, NUM, BAR, END
    ];

    tokens.map((t, i) => expect(t.name).toEqual(expectedTokens[i]));

    tokens = Lexer.scan("+-*/()^xiqz1");
    expectedTokens = [
        PLUS, MINUS, TIMES, DIVIDE, LPAREN, RPAREN, POW, UNK, END
    ];

    tokens.map((t, i) => expect(t.name).toEqual(expectedTokens[i]));
});

test('tokenizing simple expressions', () => {
    let tokens = Lexer.scan("x + 2 + i");
    let expectedTokens = [
        X, PLUS, NUM, PLUS, I, END
    ];

    expect(tokens.length).toEqual(expectedTokens.length);
    tokens.map((t, i) => expect(t.name).toEqual(expectedTokens[i]));

    tokens = Lexer.scan("x*(1+i)");
    expectedTokens = [
        X, TIMES, LPAREN, NUM, PLUS, I, RPAREN, END
    ];

    expect(tokens.length).toEqual(expectedTokens.length);
    tokens.map((t, i) => expect(t.name).toEqual(expectedTokens[i]));

    tokens = Lexer.scan("x*x*x");
    expectedTokens = [
        X, TIMES, X, TIMES, X, END
    ];

    expect(tokens.length).toEqual(expectedTokens.length);
    tokens.map((t, i) => expect(t.name).toEqual(expectedTokens[i]));
})

test('tokenizing integers', () => {
    let tokens = Lexer.scan("7");
    let expectedTokens = [NUM, END];
    let expectedValues = ["7", null];

    expect(tokens.length).toEqual(expectedTokens.length);
    tokens.map((t, i) => expect(t.name).toEqual(expectedTokens[i]));
    tokens.map((t, i) => expect(t.value).toEqual(expectedValues[i]));

    tokens = Lexer.scan("51");
    expectedTokens = [NUM, END];
    expectedValues = ["51", null];

    expect(tokens.length).toEqual(expectedTokens.length);
    tokens.map((t, i) => expect(t.name).toEqual(expectedTokens[i]));
    tokens.map((t, i) => expect(t.value).toEqual(expectedValues[i]));

    tokens = Lexer.scan("9999 999");
    expectedTokens = [NUM, NUM, END];
    expectedValues = ["9999", "999", null];

    expect(tokens.length).toEqual(expectedTokens.length);
    tokens.map((t, i) => expect(t.name).toEqual(expectedTokens[i]));
    tokens.map((t, i) => expect(t.value).toEqual(expectedValues[i]));

    tokens = Lexer.scan("201*x + 450");
    expectedValues = ["201", null, null, null, "450", null];

    tokens.map((t, i) => expect(t.value).toEqual(expectedValues[i]));
})

test('tokenizing delimiters', () => {
    let tokens = Lexer.scan("|||");
    let expectedTokens = [BAR, BAR, BAR, END];

    expect(tokens.length).toEqual(expectedTokens.length);
    tokens.map((t, i) => expect(t.name).toEqual(expectedTokens[i]));

    tokens = Lexer.scan("()()");
    expectedTokens = [
        LPAREN, RPAREN, LPAREN, RPAREN, END
    ];

    expect(tokens.length).toEqual(expectedTokens.length);
    tokens.map((t, i) => expect(t.name).toEqual(expectedTokens[i]));


    tokens = Lexer.scan("(    (");
    expectedTokens = [LPAREN, LPAREN, END];

    expect(tokens.length).toEqual(expectedTokens.length);
    tokens.map((t, i) => expect(t.name).toEqual(expectedTokens[i]));
})

test('tokenizing floats', () => {
    let tokens = Lexer.scan("1.0");
    let expectedValue = "1.0";

    expect(tokens.length).toEqual(2);
    expect(tokens[0].value).toEqual(expectedValue);
    
    tokens = Lexer.scan("1.");
    expectedValue = "1.";

    expect(tokens.length).toEqual(2);
    expect(tokens[0].value).toEqual(expectedValue);

    tokens = Lexer.scan("3.14159265");
    expectedValue = "3.14159265";

    expect(tokens.length).toEqual(2);
    expect(tokens[0].value).toEqual(expectedValue);

    tokens = Lexer.scan("pi");
    expectedValue = "3.141592653589793";

    expect(tokens.length).toEqual(2);
    expect(tokens[0].value).toEqual(expectedValue)

    tokens = Lexer.scan("e");
    expectedValue = "2.718281828459045";

    expect(tokens.length).toEqual(2);
    expect(tokens[0].value).toEqual(expectedValue)
})

test('tokenizing special functions', () => {
    let tokens = Lexer.scan("exp(x)");
    let expectedValue = "exp";
    let expectedTokens = [FUNC, LPAREN, X, RPAREN, END];

    expect(tokens.length).toEqual(5);
    expect(tokens[0].value).toEqual(expectedValue);
    tokens.map((t, i) => expect(t.name).toEqual(expectedTokens[i]));

    tokens = Lexer.scan("cos(x)");
    expectedValue = "cos";
    expectedTokens = [FUNC, LPAREN, X, RPAREN, END];

    expect(tokens.length).toEqual(5);
    expect(tokens[0].value).toEqual(expectedValue);
    tokens.map((t, i) => expect(t.name).toEqual(expectedTokens[i]));

    tokens = Lexer.scan("sin(x)");
    expectedValue = "sin";
    expectedTokens = [FUNC, LPAREN, X, RPAREN, END];

    expect(tokens.length).toEqual(5);
    expect(tokens[0].value).toEqual(expectedValue);
    tokens.map((t, i) => expect(t.name).toEqual(expectedTokens[i]));

    tokens = Lexer.scan("sin(x^2)");
    expectedValue = "sin";
    expectedTokens = [FUNC, LPAREN, X, POW, NUM, RPAREN, END];

    expect(tokens.length).toEqual(7);
    expect(tokens[0].value).toEqual(expectedValue)
    tokens.map((t, i) => expect(t.name).toEqual(expectedTokens[i]));

    tokens = Lexer.scan("sin(sin(x))");
    expectedValue = "sin";
    expectedTokens = [FUNC, LPAREN, FUNC, LPAREN, X, RPAREN, RPAREN, END];

    expect(tokens.length).toEqual(8);
    expect(tokens[0].value).toEqual(expectedValue);
    expect(tokens[2].value).toEqual(expectedValue);
    tokens.map((t, i) => expect(t.name).toEqual(expectedTokens[i]));

    tokens = Lexer.scan("sin(pi*x)");
    expectedTokens = [FUNC, LPAREN, NUM, TIMES, X, RPAREN, END];

    expect(tokens.length).toEqual(7);
    tokens.map((t, i) => expect(t.name).toEqual(expectedTokens[i]));

    tokens = Lexer.scan("sink()");
    expectedValue = "sink";
    expectedTokens = [UNK, LPAREN, RPAREN, END];

    expect(tokens.length).toEqual(4);
    expect(tokens[0].value).toEqual(expectedValue);
    tokens.map((t, i) => expect(t.name).toEqual(expectedTokens[i]));
})