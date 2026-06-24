import {expect, test} from '@jest/globals';

import Lexer from '../app/parsing/Lexer.ts';
import preParser from '../app/parsing/PreParser';
import {
    UNK, X, Z, Q, I, PLUS, MINUS, TIMES, DIVIDE, POW, NUM, LPAREN, RPAREN, END
} from "../app/parsing/constants"


test('test sequences left unchanged by the pre-parser', () => {
    let tokens = Lexer.scan("x2");
    tokens = preParser(tokens);
    let expectedTokens = [
        UNK, END
    ];

    tokens.map((t, i) => expect(t.name).toEqual(expectedTokens[i]));

    tokens = Lexer.scan("144");
    tokens = preParser(tokens);
    expectedTokens = [
        NUM, END
    ];


    tokens = Lexer.scan("3 5");
    tokens = preParser(tokens);
    expectedTokens = [
        NUM, NUM, END
    ];

    tokens.map((t, i) => expect(t.name).toEqual(expectedTokens[i]));

    tokens = Lexer.scan("(1 + 3)");
    tokens = preParser(tokens);
    expectedTokens = [
        LPAREN, NUM, PLUS, NUM, RPAREN, END
    ];

    tokens.map((t, i) => expect(t.name).toEqual(expectedTokens[i]));

    tokens.map((t, i) => expect(t.name).toEqual(expectedTokens[i]));
    
    tokens = Lexer.scan("x+2");
    tokens = preParser(tokens);
    expectedTokens = [
        X, PLUS, NUM, END
    ];
    
    tokens.map((t, i) => expect(t.name).toEqual(expectedTokens[i]));
    
    tokens = Lexer.scan("x-2");
    tokens = preParser(tokens);
    expectedTokens = [
        X, MINUS, NUM, END
    ];
    
    tokens.map((t, i) => expect(t.name).toEqual(expectedTokens[i]));
    
    tokens = Lexer.scan("x*2");
    tokens = preParser(tokens);
    expectedTokens = [
        X, TIMES, NUM, END
    ];
    
    tokens.map((t, i) => expect(t.name).toEqual(expectedTokens[i]));
    
    tokens = Lexer.scan("x/2");
    tokens = preParser(tokens);
    expectedTokens = [
        X, DIVIDE, NUM, END
    ];
    
    tokens.map((t, i) => expect(t.name).toEqual(expectedTokens[i]));
    
    tokens = Lexer.scan("x^2");
    tokens = preParser(tokens);
    expectedTokens = [
        X, POW, NUM, END
    ];

    tokens.map((t, i) => expect(t.name).toEqual(expectedTokens[i]));
    
    tokens = Lexer.scan("z*(z + 3)");
    tokens = preParser(tokens);
    expectedTokens = [
        Z, TIMES, LPAREN, Z, PLUS, NUM, RPAREN, END
    ];

    tokens.map((t, i) => expect(t.name).toEqual(expectedTokens[i]));

    tokens = Lexer.scan("(z + q)");
    tokens = preParser(tokens);
    expectedTokens = [
        LPAREN, Z, PLUS, Q, RPAREN, END
    ];

    tokens.map((t, i) => expect(t.name).toEqual(expectedTokens[i]));
})


test('test implicit multiplication on numbers', () => {
    let tokens = Lexer.scan("1 + 7i");
    tokens = preParser(tokens);
    let expectedTokens = [
        NUM, PLUS, NUM, TIMES, I, END
    ];

    tokens.map((t, i) => expect(t.name).toEqual(expectedTokens[i]));

    tokens = Lexer.scan("2(x + 1)");
    tokens = preParser(tokens);
    expectedTokens = [
        NUM, TIMES, LPAREN, X, PLUS, NUM, RPAREN, END
    ];

    tokens.map((t, i) => expect(t.name).toEqual(expectedTokens[i]));

    tokens = Lexer.scan("2 + 2 + 2 + 6q");
    tokens = preParser(tokens);
    expectedTokens = [
        NUM, PLUS, NUM, PLUS, NUM, PLUS, NUM, TIMES, Q, END
    ];

    tokens.map((t, i) => expect(t.name).toEqual(expectedTokens[i]));
})


test('test implicit multiplication on parentheses', () => {
    let tokens = Lexer.scan("zzz");
    tokens = preParser(tokens);
    let expectedTokens = [
        UNK, END
    ];
    
    tokens.map((t, i) => expect(t.name).toEqual(expectedTokens[i]));

    tokens = Lexer.scan("z((z)z)");
    tokens = preParser(tokens);
    expectedTokens = [
        Z, TIMES, LPAREN, LPAREN, Z, RPAREN, TIMES, Z, RPAREN, END
    ];

    tokens.map((t, i) => expect(t.name).toEqual(expectedTokens[i]));

    tokens = Lexer.scan("(z)z(z)");
    tokens = preParser(tokens);
    expectedTokens = [
       LPAREN, Z, RPAREN, TIMES, Z, TIMES, LPAREN, Z, RPAREN, END
    ];

    tokens.map((t, i) => expect(t.name).toEqual(expectedTokens[i]));

    tokens = Lexer.scan("((z)z)(z)");
    tokens = preParser(tokens);
    expectedTokens = [
        LPAREN, LPAREN, Z, RPAREN, TIMES, Z, RPAREN, TIMES, LPAREN, Z, RPAREN, END
    ];

    tokens.map((t, i) => expect(t.name).toEqual(expectedTokens[i]));

    tokens = Lexer.scan("(q + 1)(q - 1)");
    tokens = preParser(tokens);
    expectedTokens = [
        LPAREN, Q, PLUS, NUM, RPAREN, TIMES, LPAREN, Q, MINUS, NUM, RPAREN, END
    ];

    tokens.map((t, i) => expect(t.name).toEqual(expectedTokens[i]));
})


test('test implicit multiplication with nums and vars', () => {
    let tokens = Lexer.scan("2x");
    tokens = preParser(tokens);
    let expectedTokens = [
        NUM, TIMES, X, END
    ];

    tokens = Lexer.scan("2q^24");
    tokens = preParser(tokens);
    expectedTokens = [
        NUM, TIMES, Q, POW, NUM, END
    ];

    tokens.map((t, i) => expect(t.name).toEqual(expectedTokens[i]));

    tokens = Lexer.scan("2(x^2 + 1)");
    tokens = preParser(tokens);
    expectedTokens = [
        NUM, TIMES, LPAREN, X, POW, NUM, PLUS, NUM, RPAREN, END
    ];

    tokens.map((t, i) => expect(t.name).toEqual(expectedTokens[i]));

    tokens = Lexer.scan("z(z + 3)");
    tokens = preParser(tokens);
    expectedTokens = [
        Z, TIMES, LPAREN, Z, PLUS, NUM, RPAREN, END
    ];
    
    tokens.map((t, i) => expect(t.name).toEqual(expectedTokens[i]));
    
})

test('test folding minus signs', () => {
    let tokens = Lexer.scan("x - -2");
    tokens = preParser(tokens);
    let expectedTokens = [
        X, PLUS, NUM, END
    ];
    
    tokens.map((t, i) => expect(t.name).toEqual(expectedTokens[i]));

    tokens = Lexer.scan("2 - -z");
    tokens = preParser(tokens);
    expectedTokens = [
        NUM, PLUS, Z, END
    ];
    
    tokens.map((t, i) => expect(t.name).toEqual(expectedTokens[i]));

    tokens = Lexer.scan("(2000)--(q)");
    tokens = preParser(tokens);
    expectedTokens = [
        LPAREN, NUM, RPAREN, PLUS, LPAREN, Q, RPAREN, END
    ];
    
    tokens.map((t, i) => expect(t.name).toEqual(expectedTokens[i]));

    tokens = Lexer.scan("x + -2");
    tokens = preParser(tokens);
    expectedTokens = [
        X, MINUS, NUM, END
    ];
    
    tokens.map((t, i) => expect(t.name).toEqual(expectedTokens[i]));

    tokens = Lexer.scan("2 + -z");
    tokens = preParser(tokens);
    expectedTokens = [
        NUM, MINUS, Z, END
    ];
    
    tokens.map((t, i) => expect(t.name).toEqual(expectedTokens[i]));

    tokens = Lexer.scan("(2000)+-(q)");
    tokens = preParser(tokens);
    expectedTokens = [
        LPAREN, NUM, RPAREN, MINUS, LPAREN, Q, RPAREN, END
    ];
    
    tokens.map((t, i) => expect(t.name).toEqual(expectedTokens[i]));
})

test('test initial minus signs', () => {
    let tokens = Lexer.scan("-x");
    tokens = preParser(tokens);
    let expectedTokens = [NUM, MINUS, X, END]

    tokens.map((t, i) => expect(t.name).toEqual(expectedTokens[i]));
    expect(tokens[0].value).toEqual('0')

    tokens = Lexer.scan("-75");
    tokens = preParser(tokens);
    expectedTokens = [NUM, MINUS, NUM, END]

    tokens.map((t, i) => expect(t.name).toEqual(expectedTokens[i]));

    tokens = Lexer.scan("-(-q)");
    tokens = preParser(tokens);
    expectedTokens = [NUM, MINUS, LPAREN, NUM, MINUS, Q, RPAREN, END]

    tokens.map((t, i) => expect(t.name).toEqual(expectedTokens[i]));

    tokens = Lexer.scan("(-q - -4)");
    tokens = preParser(tokens);
    expectedTokens = [LPAREN, NUM, MINUS, Q, PLUS, NUM, RPAREN, END]

    tokens.map((t, i) => expect(t.name).toEqual(expectedTokens[i]));
})
