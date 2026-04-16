import Lexer from '../app/parsing/Lexer';
import Parser from '../app/parsing/Parser';

test('simple malformed expressions', () => {
    const tokens = Lexer.scan("1+");
    const {AST, accept} = Parser.parse(tokens);

    expect(typeof(accept)).toBe('boolean');
    expect(accept).toBeFalsy();
})