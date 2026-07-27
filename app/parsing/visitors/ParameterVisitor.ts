import Visitor from "./Visitor";
import * as AST from '../AST/AST';

class ParameterVisitor extends Visitor{
    parameters: AST.Num[] = [];

    visitS(node: AST.S): void {
        node.e?.accept(this);
    }

    visitE(node: AST.E): void {
        node.t?.accept(this);
        node.e_prime?.accept(this);
    };

    visitPlus(node: AST.Plus) {
        node.t?.accept(this);
        node.e_prime?.accept(this);
    };

    visitMinus(node: AST.Minus) {
        node.t?.accept(this);
        node.e_prime?.accept(this);
    };

    visitT(node: AST.T) {
        node.p?.accept(this);
        node.t_prime?.accept(this);
    };

    visitTimes(node: AST.Times) {
        node.p?.accept(this);
        node.t_prime?.accept(this);
    };

    visitDivide(node: AST.Divide) {
        node.p?.accept(this);
        node.t_prime?.accept(this);
    };

    visitP(node: AST.P) {
        node.f?.accept(this);
        node.p_prime?.accept(this);
    };

    visitPow(node: AST.Pow) {
        node.f?.accept(this);
        node.p_prime?.accept(this);
    };

    visitNum(node: AST.Num) {
        if (!node.isConstant) {
            this.parameters.push(node);
        }
    };

    visitParen(node: AST.Paren) {
        node.e?.accept(this);
    };

    visitX(_node: AST.X) {};

    visitZ(_node: AST.Z) {};

    visitQ(_node: AST.Q) {};

    visitI(_node: AST.I) {};

    visitNegation(node: AST.Negation) {
        node.f?.accept(this);
    };

    visitFunc(node: AST.Func) {
        node.e?.accept(this);
    };

}

export default ParameterVisitor;
