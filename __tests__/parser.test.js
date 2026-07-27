import {expect, test} from '@jest/globals';

import Parser from '../app/parsing/Parser';
import { Token } from '../app/parsing/grammar';
import { END, UNK } from '../app/parsing/constants';


test('parsing end token', () => {
    const tokens = [new Token(END)];
    const {_, accept} = Parser.parseTokens(tokens);

    expect(accept).toBeFalsy();
})

test('unknown token', () => {
    const tokens = [new Token(UNK)];
    const {_, accept} = Parser.parseTokens(tokens);

    expect(accept).toBeFalsy();
})

test('parser rejects empty string', () => {
    const {_, accept} = Parser.parse('');
    expect(accept).toBeFalsy();
})

test('simple malformed expressions', () => {
    let {_, accept} = Parser.parse("1+");
    expect(accept).toBeFalsy();

    ({_, accept} = Parser.parse("1 1"));
    expect(accept).toBeFalsy();

    ({_, accept} = Parser.parse("*2"));
    expect(accept).toBeFalsy();

    ({_, accept} = Parser.parse("x++i"));
    expect(accept).toBeFalsy();

    ({_, accept} = Parser.parse("((()"));
    expect(accept).toBeFalsy();

    ({_, accept} = Parser.parse(")))))"));
    expect(accept).toBeFalsy();
    
    ({_, accept} = Parser.parse("++++"));
    expect(accept).toBeFalsy();

    ({_, accept} = Parser.parse("x -+ z"));
    expect(accept).toBeFalsy();

    ({_, accept} = Parser.parse("x --+ z"));
    expect(accept).toBeFalsy();

    ({_, accept} = Parser.parse("x ---+ z"));
    expect(accept).toBeFalsy();
    
    ({_, accept} = Parser.parse("x ++ z"));
    expect(accept).toBeFalsy();

    ({_, accept} = Parser.parse("x +++ z"));
    expect(accept).toBeFalsy();

    ({_, accept} = Parser.parse("x ++++ z"));
    expect(accept).toBeFalsy();

    // TODO: the grammar allows these expressions by F ::= -F
    // maybe refactor into 
    //      P ::= FP' | F'P'
    //      P' ::= ^FP' | ^F'P' | null. (requires 2 lookahead)  
    //      F' ::= F
    // ({_, accept} = Parser.parse("5 ----75"));
    // expect(accept).toBeFalsy();

    // ({_, accept} = Parser.parse("12 +-- z"));
    // expect(accept).toBeFalsy();
})

test('accepts simple expressions', () => {
    let {_, accept} = Parser.parse("1 + 1");
    expect(accept).toBeTruthy();

    ({_, accept} = Parser.parse("(50)"));
    expect(accept).toBeTruthy();

    ({_, accept} = Parser.parse("1 * x + 6"));
    expect(accept).toBeTruthy();

    ({_, accept} = Parser.parse("(x / 4)"));
    expect(accept).toBeTruthy();

    ({_, accept} = Parser.parse("6/(1 + x)"));
    expect(accept).toBeTruthy();

    ({_, accept} = Parser.parse("2x + 5i"));
    expect(accept).toBeTruthy();
})

test('parses initial plus / minus', () => {
    let {_, accept} = Parser.parse("+x");
    expect(accept).toBeTruthy();

    ({_, accept} = Parser.parse("(+x)"));
    expect(accept).toBeTruthy();

    ({_, accept} = Parser.parse("+cos(+x)"));
    expect(accept).toBeTruthy();

    ({_, accept} = Parser.parse("-z"));
    expect(accept).toBeTruthy();

    ({_, accept} = Parser.parse("(-z)"));
    expect(accept).toBeTruthy();

    ({_, accept} = Parser.parse("-sin(-z)"));
    expect(accept).toBeTruthy();
})

test('parses exponential expressions', () => {
    let {_, accept} = Parser.parse("x^2");
    expect(accept).toBeTruthy();

    ({_, accept} = Parser.parse("x^(2)"));
    expect(accept).toBeTruthy();

    ({_, accept} = Parser.parse("x^x^x"));
    expect(accept).toBeTruthy();
})

test('test parsing negative numbers and variables', () => {
    let {_, accept} = Parser.parse("-x");
    expect(accept).toBeTruthy();

    ({_, accept} = Parser.parse("-75"));
    expect(accept).toBeTruthy();

    ({_, accept} = Parser.parse("-(-q)"));
    expect(accept).toBeTruthy();
    
    ({_, accept} = Parser.parse("(-q - -4)"));
    expect(accept).toBeTruthy();
    
    ({_, accept} = Parser.parse("x^-1"));
    expect(accept).toBeTruthy();

    ({_, accept} = Parser.parse("x * -1"));
    expect(accept).toBeTruthy();

    ({_, accept} = Parser.parse("x / -1"));
    expect(accept).toBeTruthy();

    ({_, accept} = Parser.parse("x * -(x - 2i)"));
    expect(accept).toBeTruthy();
})

test('parsing special functions', () => {
    let {_, accept} = Parser.parse("2exp(x)");
    expect(accept).toBeTruthy();

    ({_, accept} = Parser.parse("sin(x) + -cos(2x)"));
    expect(accept).toBeTruthy();

    ({_, accept} = Parser.parse("1.3/exp(exp(-x))"));
    expect(accept).toBeTruthy();

    ({_, accept} = Parser.parse("(1 + cos(1/(1 + 2z)))z^3 / (z + 6i - z^2)"));
    expect(accept).toBeTruthy();
})

test('parsing conjugation', () => {
    let {_, accept} = Parser.parse("|x|");
    expect(accept).toBeTruthy();

    ({_, accept} = Parser.parse("3 * |x|"));
    expect(accept).toBeTruthy();

    ({_, accept} = Parser.parse("1 - |x|"));
    expect(accept).toBeTruthy();

    ({_, accept} = Parser.parse("|||x|||"));
    expect(accept).toBeTruthy();

    ({_, accept} = Parser.parse("|x + 3|"));
    expect(accept).toBeTruthy();

    ({_, accept} = Parser.parse("|2|*|||x| + 3||"));
    expect(accept).toBeTruthy();

    // tokens = Lexer.scan("-|x|");
    // ({_, accept} = Parser.parse(tokens));
    // expect(accept).toBeTruthy();

//     tokens = Lexer.scan("-|-x|");
//     ({_, accept} = Parser.parse(tokens));
//     expect(accept).toBeTruthy();

//     tokens = Lexer.scan("z|-z|");
//     ({_, accept} = Parser.parse(tokens));
//     expect(accept).toBeTruthy();

    ({_, accept} = Parser.parse("|x| * sin(x)"));
    expect(accept).toBeTruthy();

//     tokens = Lexer.scan("|-x|sin(x)");
//     ({_, accept} = Parser.parse(tokens));
//     expect(accept).toBeTruthy();

//     tokens = Lexer.scan("z/-|z|");
//     ({_, accept} = Parser.parse(tokens));
//     expect(accept).toBeTruthy();
})
