import { expect, test } from '@jest/globals';

import Parser from '../app/parsing/Parser';
import { EquationVisitor } from '../app/parsing/visitors';


test('test equation visitor on negative ints', () => {
    const equationVisitor = new EquationVisitor();

    let expectedEq = '5.5';
    let ast = Parser.parse(expectedEq);
    let eq = ast.accept(equationVisitor);
    expect(eq).toEqual(expectedEq);
    
    expectedEq = '-1';
    ast = Parser.parse(expectedEq);
    eq = ast.accept(equationVisitor);
    expect(eq).toEqual(expectedEq);

    expectedEq = '1 + -2';
    ast = Parser.parse(expectedEq);
    eq = ast.accept(equationVisitor);
    expect(eq).toEqual(expectedEq);

    expectedEq = '-1 + -2';
    ast = Parser.parse(expectedEq);
    eq = ast.accept(equationVisitor);
    expect(eq).toEqual(expectedEq);

    ast = Parser.parse('1');
    ast.e.t.p.f.value = '-1';
    eq = ast.accept(equationVisitor);
    expect(eq).toEqual('-1');

    ast = Parser.parse('-1');
    ast.e.t.p.f.f.value = '-1';
    eq = ast.accept(equationVisitor);
    expect(eq).toEqual('1');

    ast = Parser.parse('--1');
    ast.e.t.p.f.f.f.value = '-1';
    eq = ast.accept(equationVisitor);
    expect(eq).toEqual('-1');

    ast = Parser.parse('---1');
    ast.e.t.p.f.f.f.f.value = '-1';
    eq = ast.accept(equationVisitor);
    expect(eq).toEqual('1');
});

test('test equation visitor on initial plus/minus', () => {
    const equationVisitor = new EquationVisitor();

    let ast = Parser.parse('--1');
    let eq = ast.accept(equationVisitor);
    expect(eq).toEqual('1');

    ast = Parser.parse('---1');
    eq = ast.accept(equationVisitor);
    expect(eq).toEqual('-1');

    ast = Parser.parse('----1');
    eq = ast.accept(equationVisitor);
    expect(eq).toEqual('1');

    ast = Parser.parse('-----1');
    eq = ast.accept(equationVisitor);
    expect(eq).toEqual('-1');

    ast = Parser.parse('(-1)');
    eq = ast.accept(equationVisitor);
    expect(eq).toEqual('(-1)');

    ast = Parser.parse('(--1)');
    eq = ast.accept(equationVisitor);
    expect(eq).toEqual('(1)');

    ast = Parser.parse('(---1)');
    eq = ast.accept(equationVisitor);
    expect(eq).toEqual('(-1)');

    ast = Parser.parse('(----1)');
    eq = ast.accept(equationVisitor);
    expect(eq).toEqual('(1)');

    ast = Parser.parse('(-----1)');
    eq = ast.accept(equationVisitor);
    expect(eq).toEqual('(-1)');

    ast = Parser.parse('+1');
    eq = ast.accept(equationVisitor);
    expect(eq).toEqual('1');

    ast = Parser.parse('(+1)');
    eq = ast.accept(equationVisitor);
    expect(eq).toEqual('(1)');
});

test('test equation visitor on operations', () => {
    const equationVisitor = new EquationVisitor();

    let expectedEq = 'x + x';
    let ast = Parser.parse(expectedEq);
    let eq = ast.accept(equationVisitor);
    expect(eq).toEqual(expectedEq);

    expectedEq = 'x - x';
    ast = Parser.parse(expectedEq);
    eq = ast.accept(equationVisitor);
    expect(eq).toEqual(expectedEq);

    expectedEq = 'x*x';
    ast = Parser.parse(expectedEq);
    eq = ast.accept(equationVisitor);
    expect(eq).toEqual(expectedEq);

    expectedEq = 'x/x';
    ast = Parser.parse(expectedEq);
    eq = ast.accept(equationVisitor);
    expect(eq).toEqual(expectedEq);

    expectedEq = 'x^x';
    ast = Parser.parse(expectedEq);
    eq = ast.accept(equationVisitor);
    expect(eq).toEqual(expectedEq);

    expectedEq = 'x^x^x';
    ast = Parser.parse(expectedEq);
    eq = ast.accept(equationVisitor);
    expect(eq).toEqual(expectedEq);
});

test('test equation visitor on named constants', () => {
    const equationVisitor = new EquationVisitor();

    let expectedEq = '1 + pi';
    let ast = Parser.parse(expectedEq);
    let eq = ast.accept(equationVisitor);
    expect(eq).toEqual(expectedEq);

    expectedEq = '1/pi^2';
    ast = Parser.parse(expectedEq);
    eq = ast.accept(equationVisitor);
    expect(eq).toEqual(expectedEq);

    expectedEq = 'e^x';
    ast = Parser.parse(expectedEq);
    eq = ast.accept(equationVisitor);
    expect(eq).toEqual(expectedEq);

    expectedEq = 'pi + e';
    ast = Parser.parse(expectedEq);
    eq = ast.accept(equationVisitor);
    expect(eq).toEqual(expectedEq);

    expectedEq = 'e*x^2';
    ast = Parser.parse(expectedEq);
    eq = ast.accept(equationVisitor);
    expect(eq).toEqual(expectedEq);
});

test('test equation visitor on parameters', () => {
    const equationVisitor = new EquationVisitor();

    let expectedEq = '2*a_0';
    let ast = Parser.parse(expectedEq);
    let eq = ast.accept(equationVisitor);
    expect(eq).toEqual(expectedEq);

    expectedEq = 'g_999*x^2';
    ast = Parser.parse(expectedEq);
    eq = ast.accept(equationVisitor);
    expect(eq).toEqual(expectedEq);

    expectedEq = '(x_0 + x_1)*x';
    ast = Parser.parse(expectedEq);
    eq = ast.accept(equationVisitor);
    expect(eq).toEqual(expectedEq);

    expectedEq = 'x^s_1';
    ast = Parser.parse(expectedEq);
    eq = ast.accept(equationVisitor);
    expect(eq).toEqual(expectedEq);
});
