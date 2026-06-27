import {expect, test} from '@jest/globals';

import Lexer from '../app/parsing/Lexer.ts';
import Parser from '../app/parsing/Parser';
import { Token } from '../app/parsing/grammar';
import { END, UNK } from '../app/parsing/constants';
import { EquationVisitor } from '../app/parsing/visitors';

function printParsedEquation(tokens) {
    const {ast, accept} = Parser.parse(tokens);

    if (accept) {
        const equationVisitor = new EquationVisitor();
        const result = ast.accept(equationVisitor);
        console.log(result)
    } else {
        console.log('equation failed to parse');
    }
}

test('parsing end token', () => {
    const tokens = [new Token(END)];
    const {_, accept} = Parser.parse(tokens);

    expect(accept).toBeFalsy();
})

test('unknown token', () => {
    const tokens = [new Token(UNK)];
    const {_, accept} = Parser.parse(tokens);

    expect(accept).toBeFalsy();
})

test('parser rejects empty string', () => {
    const tokens = Lexer.scan('');
    const {_, accept} = Parser.parse(tokens);
    expect(accept).toBeFalsy();
})

test('simple malformed expressions', () => {
    let tokens = Lexer.scan("1+");
    let {_, accept} = Parser.parse(tokens);
    expect(accept).toBeFalsy();

    tokens = Lexer.scan("1 1");
    ({_, accept} = Parser.parse(tokens));
    expect(accept).toBeFalsy();

    tokens = Lexer.scan("*2");
    ({_, accept} = Parser.parse(tokens));
    expect(accept).toBeFalsy();

    tokens = Lexer.scan("x++i");
    ({_, accept} = Parser.parse(tokens));
    expect(accept).toBeFalsy();

    tokens = Lexer.scan("((()");
    ({_, accept} = Parser.parse(tokens));
    expect(accept).toBeFalsy();

    tokens = Lexer.scan(")))))");
    ({_, accept} = Parser.parse(tokens));
    expect(accept).toBeFalsy();
    
    tokens = Lexer.scan("++++");
    ({_, accept} = Parser.parse(tokens));
    expect(accept).toBeFalsy();
})

test('accepts simple expressions', () => {
    let tokens = Lexer.scan("1 + 1");
    let {_, accept} = Parser.parse(tokens);
    expect(accept).toBeTruthy();

    tokens = Lexer.scan("(50)");
    ({_, accept} = Parser.parse(tokens));
    expect(accept).toBeTruthy();

    tokens = Lexer.scan("1 * x + 6");
    ({_, accept} = Parser.parse(tokens));
    expect(accept).toBeTruthy();

    tokens = Lexer.scan("(x / 4)");
    ({_, accept} = Parser.parse(tokens));
    expect(accept).toBeTruthy();

    tokens = Lexer.scan("6/(1 + x)");
    ({_, accept} = Parser.parse(tokens));
    expect(accept).toBeTruthy();

    tokens = Lexer.scan("2x + 5i");
    ({_, accept} = Parser.parse(tokens));
    expect(accept).toBeTruthy();
})

test('parses exponential expressions', () => {
    let tokens = Lexer.scan("x^2");
    let {_, accept} = Parser.parse(tokens);
    expect(accept).toBeTruthy();

    tokens = Lexer.scan("x^(2)");
    ({_, accept} = Parser.parse(tokens));
    expect(accept).toBeTruthy();

    tokens = Lexer.scan("x^x^x");
    ({_, accept} = Parser.parse(tokens));
    expect(accept).toBeTruthy();
})

test('test parsing negative numbers and variables', () => {
    let tokens = Lexer.scan("-x");
    let {_, accept} = Parser.parse(tokens);
    expect(accept).toBeTruthy();

    tokens = Lexer.scan("-75");
    ({_, accept} = Parser.parse(tokens));
    expect(accept).toBeTruthy();

    tokens = Lexer.scan("-(-q)");
    ({_, accept} = Parser.parse(tokens));
    expect(accept).toBeTruthy();
    
    tokens = Lexer.scan("(-q - -4)");
    ({_, accept} = Parser.parse(tokens));
    expect(accept).toBeTruthy();
    
    tokens = Lexer.scan("x^-1");
    ({_, accept} = Parser.parse(tokens));
    expect(accept).toBeTruthy();

    tokens = Lexer.scan("x * -1");
    ({_, accept} = Parser.parse(tokens));
    expect(accept).toBeTruthy();

    tokens = Lexer.scan("x / -1");
    ({_, accept} = Parser.parse(tokens));
    expect(accept).toBeTruthy();

    tokens = Lexer.scan("x * -(x - 2i)");
    ({_, accept} = Parser.parse(tokens));
    expect(accept).toBeTruthy();
})

test('parsing special functions', () => {
    let tokens = Lexer.scan("2exp(x)");
    let {_, accept} = Parser.parse(tokens);
    expect(accept).toBeTruthy();

    tokens = Lexer.scan("sin(x) + cos(2x)");
    ({_, accept} = Parser.parse(tokens));
    expect(accept).toBeTruthy();

    tokens = Lexer.scan("1.3/exp(exp(-x))");
    ({_, accept} = Parser.parse(tokens));
    expect(accept).toBeTruthy();

    tokens = Lexer.scan("(1 + cos(1/(1 + 2z)))z^3 / (z + 6i - z^2)");
    ({_, accept} = Parser.parse(tokens));
    expect(accept).toBeTruthy();
})

// test('parsing conjugation', () => {
//     let tokens = Lexer.scan("|x|");
//     let {_, accept} = Parser.parse(tokens);
//     expect(accept).toBeTruthy();

//     tokens = Lexer.scan("-|x|");
//     ({_, accept} = Parser.parse(tokens));
//     expect(accept).toBeTruthy();

//     tokens = Lexer.scan("-|-x|");
//     ({_, accept} = Parser.parse(tokens));
//     expect(accept).toBeTruthy();

//     tokens = Lexer.scan("z|-z|");
//     ({_, accept} = Parser.parse(tokens));
//     expect(accept).toBeTruthy();

//     tokens = Lexer.scan("|-x|sin(x)");
//     ({_, accept} = Parser.parse(tokens));
//     expect(accept).toBeTruthy();

//     tokens = Lexer.scan("z/-|z|");
//     ({_, accept} = Parser.parse(tokens));
//     expect(accept).toBeTruthy();
// })
