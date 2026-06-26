import * as AST from '../AST/AST';

class Visitor{
    visitE(_node: AST.E) { throw Error('visitE not implemented') };
    visitPlus(_node: AST.Plus) { throw Error('visitPlus not implemented') };
    visitMinus(_node: AST.Minus) { throw Error('visitMinus not implemented') };
    visitT(_node: AST.T) { throw Error('visitT not implemented') };
    visitTimes(_node: AST.Times) { throw Error('visitTimes not implemented') };
    visitDivide(_node: AST.Divide) { throw Error('visitDivide not implemented') };
    visitP(_node: AST.P) { throw Error('visitP not implemented') };
    visitPow(_node: AST.Pow) { throw Error('visitPow not implemented') };
    visitNum(_node: AST.Num) { throw Error('visitNum not implemented')};
    visitParen(_node: AST.Paren) { throw Error('visitParen not implemented')};
    visitX(_node: AST.X) { throw Error('visitX not implemented') };
    visitZ(_node: AST.Z) { throw Error('visitZ not implemented') };
    visitQ(_node: AST.Q) { throw Error('visitQ not implemented') };
    visitI(_node: AST.I) { throw Error('visitI not implemented') };
    visitNegation(_node: AST.Negation) { throw Error('visitNegation not implemented') };
    visitFunc(_node: AST.Func) { throw Error('visitNegation not implemented') };
}

export default Visitor;
