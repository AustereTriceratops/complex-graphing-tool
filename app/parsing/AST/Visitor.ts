import * as AST from './AST';

class Visitor{
    visitE(node: AST.E) { throw Error('visitE not implemented') };
    visitPlus(node: AST.Plus) { throw Error('visitPlus not implemented') };
    visitMinus(node: AST.Minus) { throw Error('visitMinus not implemented') };
    visitT(node: AST.T) { throw Error('visitT not implemented') };
    visitTimes(node: AST.Times) { throw Error('visitTimes not implemented') };
    visitDivide(node: AST.Divide) { throw Error('visitDivide not implemented') };
    visitInt(node: AST.Int) { throw Error('visitInt not implemented')};
    visitParen(node: AST.Paren) { throw Error('visitParen not implemented')};
    visitX(node: AST.X) { throw Error('visitX not implemented') };
    visitZ(node: AST.Z) { throw Error('visitZ not implemented') };
    visitQ(node: AST.Q) { throw Error('visitQ not implemented') };
    visitI(node: AST.I) { throw Error('visitI not implemented') };
}

export default Visitor;
