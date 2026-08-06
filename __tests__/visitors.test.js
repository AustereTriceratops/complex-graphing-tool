import { expect, test } from '@jest/globals';

import Parser from '../app/parsing/Parser';
import { ParameterVisitor, EquationVisitor } from '../app/parsing/visitors';


test('test parameter visitor', () => {
    const parameterVisitor = new ParameterVisitor();

    let ast = Parser.parse("1 + 2");
    ast.accept(parameterVisitor);
    expect(parameterVisitor.parameters.length).toEqual(2);
    expect(parameterVisitor.parameters[0].value).toEqual(1);
    expect(parameterVisitor.parameters[1].value).toEqual(2);

    parameterVisitor.parameters = [];
    ast = Parser.parse("3.2x^2 + 6x - 4");
    ast.accept(parameterVisitor);
    expect(parameterVisitor.parameters.length).toEqual(4);
    expect(parameterVisitor.parameters[0].value).toEqual(3.2);
    expect(parameterVisitor.parameters[1].value).toEqual(2);
    expect(parameterVisitor.parameters[2].value).toEqual(6);
    expect(parameterVisitor.parameters[3].value).toEqual(4);

    parameterVisitor.parameters = [];
    ast = Parser.parse("x^4");
    ast.accept(parameterVisitor);
    expect(parameterVisitor.parameters.length).toEqual(1);
    expect(parameterVisitor.parameters[0].value).toEqual(4);

    parameterVisitor.parameters = [];
    ast = Parser.parse("x^(5.11 - 1x)");
    ast.accept(parameterVisitor);
    expect(parameterVisitor.parameters.length).toEqual(2);
    expect(parameterVisitor.parameters[0].value).toEqual(5.11);
    expect(parameterVisitor.parameters[1].value).toEqual(1);

    parameterVisitor.parameters = [];
    ast = Parser.parse("3x + -5");
    ast.accept(parameterVisitor);
    expect(parameterVisitor.parameters.length).toEqual(2);
    expect(parameterVisitor.parameters[0].value).toEqual(3);
    expect(parameterVisitor.parameters[1].value).toEqual(5);

    parameterVisitor.parameters = [];
    ast = Parser.parse("2sin(2*pi*z + 1)");
    ast.accept(parameterVisitor);
    expect(parameterVisitor.parameters.length).toEqual(3);

    parameterVisitor.parameters = [];
    ast = Parser.parse("-x");
    ast.accept(parameterVisitor);
    expect(parameterVisitor.parameters.length).toEqual(0);

    parameterVisitor.parameters = [];
    ast = Parser.parse("-2x");
    ast.accept(parameterVisitor);
    expect(parameterVisitor.parameters.length).toEqual(1);
});


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
