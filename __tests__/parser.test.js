import Lexer from '../app/parsing/Lexer.ts';
import Parser from '../app/parsing/Parser';
import { Token } from '../app/parsing/grammar';

test('parsing end token', () => {
    const tokens = [new Token('END')];
    const {ast, accept} = Parser.parse(tokens);

    expect(accept).toBeFalsy();
})

test('unknown token', () => {
    const tokens = [new Token('<?>')];
    const {ast, accept} = Parser.parse(tokens);

    expect(accept).toBeFalsy();
})

test('parser rejects empty string', () => {
    const tokens = Lexer.scan('');
    const {ast, accept} = Parser.parse(tokens);
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
    tokens = Lexer.scan("1 + 1");
    ({ast, accept} = Parser.parse(tokens));
    expect(accept).toBeTruthy();

    tokens = Lexer.scan("(50)");
    ({ast, accept} = Parser.parse(tokens));
    expect(accept).toBeTruthy();

    tokens = Lexer.scan("1 * x + 6");
    ({ast, accept} = Parser.parse(tokens));
    expect(accept).toBeTruthy();

    tokens = Lexer.scan("(x / 4)");
    ({ast, accept} = Parser.parse(tokens));
    expect(accept).toBeTruthy();

    // TODO
    // tokens = Lexer.scan("2x + 5i");
    // ({ast, accept} = Parser.parse(tokens));
    // expect(accept).toBeTruthy();
})