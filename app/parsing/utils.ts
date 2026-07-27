import { Token } from "./grammar";
import Parser from './Parser';
import { EquationVisitor } from './visitors';
import * as AST from './AST/AST';

export function printParsedEquation(tokens: Token[]): void {
    const {ast, accept} = Parser.parseTokens(tokens);

    if (accept) {
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