import { Token } from "./grammar";
import Parser from './Parser';
import { EquationVisitor, GLSLVisitor } from './visitors';
import * as AST from './AST/AST';

export function printParsedEquation(tokens: Token[]): void {
    const ast = Parser.parseTokens(tokens);

    if (ast.valid) {
        printEquationFromAST(ast);
    } else {
        console.log('equation failed to parse');
    }
}

export function printEquationFromAST(ast: AST.S): void {
    const equationVisitor = new EquationVisitor();
    const result = ast.accept(equationVisitor);
    console.log(result);
}

export function printGLSLSourceForEquation(eq: string): void {
    const ast = Parser.parse(eq);
    
    const visitor = new GLSLVisitor();
    const function_source = ast.accept(visitor);
    console.log(function_source);
}