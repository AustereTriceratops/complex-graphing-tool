import * as AST from './AST';

class Visitor{
    visitE(node: AST.E) { throw Error('visitE not implemented') };
    // visitEPrime(node: AST.EPrime) { throw Error('visitEPrime not implemented') };
    visitPlus(node: AST.Plus) { throw Error('visitPlus not implemented') };
    visitMinus(node: AST.Minus) { throw Error('visitMinus not implemented') };
    visitT(node: AST.T) { throw Error('visitT not implemented') };
    // visitTPrime(node: AST.TPrime) { throw Error('visitTPrime not implemented') };
    visitTimes(node: AST.Times) { throw Error('visitTimes not implemented') };
    visitDivide(node: AST.Divide) { throw Error('visitDivide not implemented') };
    visitX(node: AST.X) { throw Error('visitX not implemented') };
    visitInt(node: AST.Int) { throw Error('visitInt not implemented')};
    visitParen(node: AST.Paren) { throw Error('visitParen not implemented')};
}

class PrintVisitor extends Visitor {
    visitX(node: AST.X) {
        console.log('x');
    }

    visitInt(node: AST.Int) {
        console.log(node.value);
    }
}

export default Visitor;
