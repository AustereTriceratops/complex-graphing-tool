import Visitor from "./Visitor";
import * as AST from '../AST/AST';

export type NumOrParam = AST.Num | AST.Param

class ParameterVisitor extends Visitor{
    parameters: NumOrParam[] = [];

    visitS(node: AST.S): void {
        this.parameters = [];

        node.e?.accept(this);

        console.log(this.parameters.length);
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
        // TODO: should only parameters get counted?
        if (!node.isConstant) {
            this.parameters.push(node);
        }
    };

    visitParam(node: AST.Param) {
        let name_matches = false;

        this.parameters.forEach((paramNode) => {
            if (paramNode instanceof AST.Param) {
                if (paramNode.name == node.name) {
                    name_matches = true;
                }
            }
        });
        
        if (!name_matches) {
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
