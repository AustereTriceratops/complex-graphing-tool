import { Token } from "./grammar";
import Parser from './Parser';
import { EquationVisitor } from './visitors';

export function printParsedEquation(tokens: Token[]): void {
    const {ast, accept} = Parser.parseTokens(tokens);

    if (accept) {
        const equationVisitor = new EquationVisitor();
        const result = ast.accept(equationVisitor);
        console.log(result);
    } else {
        console.log('equation failed to parse');
    }
}