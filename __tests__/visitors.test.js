import Lexer from '../app/parsing/Lexer.ts';
import Parser from '../app/parsing/Parser';
import DegreeVisitor from '../app/parsing/AST/DegreeVisitor';
import PrintVisitor from '../app/parsing/AST/PrintVisitor';

test('test degree visitor on multiplication', () => {
    const degreeVisitor = new DegreeVisitor();

    tokens = Lexer.scan("1 + 2");
    ({ast, accept} = Parser.parse(tokens));
    var degree = ast.accept(degreeVisitor);
    expect(degree).toEqual(0)

    tokens = Lexer.scan("x + 2");
    ({ast, accept} = Parser.parse(tokens));
    var degree = ast.accept(degreeVisitor);
    expect(degree).toEqual(1)

    tokens = Lexer.scan("x^8");
    ({ast, accept} = Parser.parse(tokens));
    var degree = ast.accept(degreeVisitor);
    const pv = new PrintVisitor();
    ast.accept(pv)
    expect(degree).toEqual(8)

    tokens = Lexer.scan("x + x^2");
    ({ast, accept} = Parser.parse(tokens));
    var degree = ast.accept(degreeVisitor);
    expect(degree).toEqual(2)

    tokens = Lexer.scan("x + x^3 - x^7");
    ({ast, accept} = Parser.parse(tokens));
    var degree = ast.accept(degreeVisitor);
    expect(degree).toEqual(7)

    tokens = Lexer.scan("(x + 1)^12");
    ({ast, accept} = Parser.parse(tokens));
    var degree = ast.accept(degreeVisitor);
    expect(degree).toEqual(12)

    tokens = Lexer.scan("x * x");
    ({ast, accept} = Parser.parse(tokens));
    var degree = ast.accept(degreeVisitor);
    expect(degree).toEqual(2)

    tokens = Lexer.scan("x * x * x * x");
    ({ast, accept} = Parser.parse(tokens));
    var degree = ast.accept(degreeVisitor);
    expect(degree).toEqual(4)

    tokens = Lexer.scan("x*(5 - x)*(x^2 + x + 1)^2");
    ({ast, accept} = Parser.parse(tokens));
    var degree = ast.accept(degreeVisitor);
    expect(degree).toEqual(6)
})

test('test degree visitor on division', () => {
    const degreeVisitor = new DegreeVisitor();

    tokens = Lexer.scan("x/x");
    ({ast, accept} = Parser.parse(tokens));
    var degree = ast.accept(degreeVisitor);
    expect(degree).toEqual(0)

    tokens = Lexer.scan("1/x^2");
    ({ast, accept} = Parser.parse(tokens));
    var degree = ast.accept(degreeVisitor);
    expect(degree).toEqual(-2)

    tokens = Lexer.scan("x + 1/x^2");
    ({ast, accept} = Parser.parse(tokens));
    var degree = ast.accept(degreeVisitor);
    expect(degree).toEqual(1)

    tokens = Lexer.scan("1/(x^3 + 2*x - 1)^2");
    ({ast, accept} = Parser.parse(tokens));
    var degree = ast.accept(degreeVisitor);
    expect(degree).toEqual(-6)

    tokens = Lexer.scan("(x^2 - x + 7)/(x^2 + 2*x + 1)");
    ({ast, accept} = Parser.parse(tokens));
    var degree = ast.accept(degreeVisitor);
    expect(degree).toEqual(0)

    tokens = Lexer.scan("(x/x)/x");
    ({ast, accept} = Parser.parse(tokens));
    var degree = ast.accept(degreeVisitor);
    expect(degree).toEqual(-1)

    tokens = Lexer.scan("x/(x/x)");
    ({ast, accept} = Parser.parse(tokens));
    var degree = ast.accept(degreeVisitor);
    expect(degree).toEqual(1)

    // TODO: make operations like division group to the right
    // tokens = Lexer.scan("x/x/x");
    // ({ast, accept} = Parser.parse(tokens));
    // var degree = ast.accept(degreeVisitor);
    // expect(degree).toEqual(1)

    // tokens = Lexer.scan("x/x/x/x");
    // ({ast, accept} = Parser.parse(tokens));
    // var degree = ast.accept(degreeVisitor);
    // expect(degree).toEqual(0)
})

test('test degree visitor for exponentiation', () => {
    const degreeVisitor = new DegreeVisitor();

    tokens = Lexer.scan("x^2^3");
    ({ast, accept} = Parser.parse(tokens));
    var degree = ast.accept(degreeVisitor);
    expect(degree).toEqual(6)

    tokens = Lexer.scan("(x^2)^3");
    ({ast, accept} = Parser.parse(tokens));
    var degree = ast.accept(degreeVisitor);
    expect(degree).toEqual(6)
})

// TODO: Implement
// test(('test degree visitor on expressions with no degree'), () => {
//     const degreeVisitor = new DegreeVisitor();
    
//     tokens = Lexer.scan("2^x");
//     ({ast, accept} = Parser.parse(tokens));
//     var degree = ast.accept(degreeVisitor);
//     expect(degree).toEqual(null)
    
//     tokens = Lexer.scan("x^x");
//     ({ast, accept} = Parser.parse(tokens));
//     var degree = ast.accept(degreeVisitor);
//     expect(degree).toEqual(null)
// })
