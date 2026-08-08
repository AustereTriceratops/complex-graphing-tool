import {expect, test} from '@jest/globals';

import Parser from '../app/parsing/Parser';
import { Token } from '../app/parsing/grammar';
import { END, UNK } from '../app/parsing/constants';


test('parsing end token', () => {
    const tokens = [new Token(END)];
    const ast = Parser.parseTokens(tokens);

    expect(ast.valid).toBeFalsy();
});

test('unknown token', () => {
    const tokens = [new Token(UNK)];
    const ast = Parser.parseTokens(tokens);

    expect(ast.valid).toBeFalsy();
});

test('parser rejects empty string', () => {
    const ast = Parser.parse('');
    expect(ast.valid).toBeFalsy();
});

test('simple malformed expressions', () => {
    let ast = Parser.parse("1+");
    expect(ast.valid).toBeFalsy();

    ast = Parser.parse("1 1");
    expect(ast.valid).toBeFalsy();

    ast = Parser.parse("*2");
    expect(ast.valid).toBeFalsy();

    ast = Parser.parse("x++i");
    expect(ast.valid).toBeFalsy();

    ast = Parser.parse("((()");
    expect(ast.valid).toBeFalsy();

    ast = Parser.parse(")))))");
    expect(ast.valid).toBeFalsy();
    
    ast = Parser.parse("++++");
    expect(ast.valid).toBeFalsy();

    ast = Parser.parse("x -+ z");
    expect(ast.valid).toBeFalsy();

    ast = Parser.parse("x --+ z");
    expect(ast.valid).toBeFalsy();

    ast = Parser.parse("x ---+ z");
    expect(ast.valid).toBeFalsy();
    
    ast = Parser.parse("x ++ z");
    expect(ast.valid).toBeFalsy();

    ast = Parser.parse("x +++ z");
    expect(ast.valid).toBeFalsy();

    ast = Parser.parse("x ++++ z");
    expect(ast.valid).toBeFalsy();

    // TODO: the grammar allows these expressions by F ::= -F
    // maybe refactor into 
    //      P ::= FP' | F'P'
    //      P' ::= ^FP' | ^F'P' | null. (requires 2 lookahead)  
    //      F' ::= F
    // ({_, ast.valid} = Parser.parse("5 ----75"));
    // expect(ast.valid).toBeFalsy();

    // ({_, ast.valid} = Parser.parse("12 +-- z"));
    // expect(ast.valid).toBeFalsy();
});

test('ast.valids simple expressions', () => {
    let ast = Parser.parse("1 + 1");
    expect(ast.valid).toBeTruthy();

    ast = Parser.parse("(50)");
    expect(ast.valid).toBeTruthy();

    ast = Parser.parse("1 * x + 6");
    expect(ast.valid).toBeTruthy();

    ast = Parser.parse("(x / 4)");
    expect(ast.valid).toBeTruthy();

    ast = Parser.parse("6/(1 + x)");
    expect(ast.valid).toBeTruthy();

    ast = Parser.parse("2x + 5i");
    expect(ast.valid).toBeTruthy();
});

test('parses initial plus / minus', () => {
    let ast = Parser.parse("+x");
    expect(ast.valid).toBeTruthy();

    ast = Parser.parse("(+x)");
    expect(ast.valid).toBeTruthy();

    ast = Parser.parse("+cos(+x)");
    expect(ast.valid).toBeTruthy();

    ast = Parser.parse("-z");
    expect(ast.valid).toBeTruthy();

    ast = Parser.parse("(-z)");
    expect(ast.valid).toBeTruthy();

    ast = Parser.parse("-sin(-z)");
    expect(ast.valid).toBeTruthy();
});

test('parses exponential expressions', () => {
    let ast = Parser.parse("x^2");
    expect(ast.valid).toBeTruthy();

    ast = Parser.parse("x^(2)");
    expect(ast.valid).toBeTruthy();

    ast = Parser.parse("x^x^x");
    expect(ast.valid).toBeTruthy();
});

test('test parsing negative numbers and variables', () => {
    let ast = Parser.parse("-x");
    expect(ast.valid).toBeTruthy();

    ast = Parser.parse("-75");
    expect(ast.valid).toBeTruthy();

    ast = Parser.parse("-(-q)");
    expect(ast.valid).toBeTruthy();
    
    ast = Parser.parse("(-q - -4)");
    expect(ast.valid).toBeTruthy();
    
    ast = Parser.parse("x^-1");
    expect(ast.valid).toBeTruthy();

    ast = Parser.parse("x * -1");
    expect(ast.valid).toBeTruthy();

    ast = Parser.parse("x / -1");
    expect(ast.valid).toBeTruthy();

    ast = Parser.parse("x * -(x - 2i)");
    expect(ast.valid).toBeTruthy();
});

test('parsing special functions', () => {
    let ast = Parser.parse("2exp(x)");
    expect(ast.valid).toBeTruthy();

    ast = Parser.parse("sin(x) + -cos(2x)");
    expect(ast.valid).toBeTruthy();

    ast = Parser.parse("1.3/exp(exp(-x))");
    expect(ast.valid).toBeTruthy();

    ast = Parser.parse("(1 + cos(1/(1 + 2z)))z^3 / (z + 6i - z^2)");
    expect(ast.valid).toBeTruthy();
});

test('parsing conjugation', () => {
    let ast = Parser.parse("|x|");
    expect(ast.valid).toBeTruthy();

    ast = Parser.parse("3 * |x|");
    expect(ast.valid).toBeTruthy();

    ast = Parser.parse("1 - |x|");
    expect(ast.valid).toBeTruthy();

    ast = Parser.parse("|||x|||");
    expect(ast.valid).toBeTruthy();

    ast = Parser.parse("|x + 3|");
    expect(ast.valid).toBeTruthy();

    ast = Parser.parse("|2|*|||x| + 3||");
    expect(ast.valid).toBeTruthy();

    // tokens = Lexer.scan("-|x|");
    // ast = Parser.parse(tokens);
    // expect(ast.valid).toBeTruthy();

//     tokens = Lexer.scan("-|-x|");
//     ast = Parser.parse(tokens);
//     expect(ast.valid).toBeTruthy();

//     tokens = Lexer.scan("z|-z|");
//     ast = Parser.parse(tokens);
//     expect(ast.valid).toBeTruthy();

    ast = Parser.parse("|x| * sin(x)");
    expect(ast.valid).toBeTruthy();

//     tokens = Lexer.scan("|-x|sin(x)");
//     ast = Parser.parse(tokens);
//     expect(ast.valid).toBeTruthy();

//     tokens = Lexer.scan("z/-|z|");
//     ast = Parser.parse(tokens);
//     expect(ast.valid).toBeTruthy();
});

test('parsing parameters', () => {
    let ast = Parser.parse("a_0");
    expect(ast.valid).toBeTruthy();

    ast = Parser.parse("2*a_0");
    expect(ast.valid).toBeTruthy();
    
    ast = Parser.parse("g_999*x^2");
    expect(ast.valid).toBeTruthy();

    ast = Parser.parse("(x_0 + x_1)*x");
    expect(ast.valid).toBeTruthy();

    ast = Parser.parse("x^s_1");
    expect(ast.valid).toBeTruthy();

    ast = Parser.parse("a_0*x^3 + a_1*x^2 + a_2*x + a_3");
    expect(ast.valid).toBeTruthy();
});
