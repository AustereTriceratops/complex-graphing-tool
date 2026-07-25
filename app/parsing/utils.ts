import { EquationVisitor } from '../app/parsing/visitors';
import Parser from '../app/parsing/Parser';

export function printParsedEquation(tokens) {
    const {ast, accept} = Parser.parseTokens(tokens);

    if (accept) {
        const equationVisitor = new EquationVisitor();
        const result = ast.accept(equationVisitor);
        console.log(result)
    } else {
        console.log('equation failed to parse');
    }
}