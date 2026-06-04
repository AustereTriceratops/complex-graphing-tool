import Visitor from './Visitor';
import * as AST from './AST';

export class EquationVisitor extends Visitor {
    visitE(node: AST.E): string {
        const t = node.t?.accept(this);
        const e_prime = node.e_prime?.accept(this) ?? '';

        return `${t}${e_prime}`;
    }

    visitPlus(node: AST.Plus): string {
        const t = node.t?.accept(this);
        const e_prime = node.e_prime?.accept(this) ?? '';

        return ` + ${t}${e_prime}`;
    }

    visitMinus(node: AST.Minus): string {
        const t = node.t?.accept(this);
        const e_prime = node.e_prime?.accept(this) ?? '';

        return ` - ${t}${e_prime}`;
    }

    visitT(node: AST.T): string {
        const f = node.f?.accept(this);
        const t_prime = node.t_prime?.accept(this) ?? '';

        return `${f}${t_prime}`;
    }

    visitTimes(node: AST.Times): string {
        const f = node.f?.accept(this);
        const t_prime = node.t_prime?.accept(this) ?? '';

        return `*${f}${t_prime}`;
    }
    
    visitDivide(node: AST.Divide): string {
        const f = node.f?.accept(this);
        const t_prime = node.t_prime?.accept(this) ?? '';

        return `/${f}${t_prime}`;
    }

    visitNum(node: AST.Num): string {
        return `${node.value}`;
    }
    
    visitParen(node: AST.Paren): string {

        const expr = node.e?.accept(this);

        return `(${expr})`;
    }

    visitX(node: AST.X): string {
        return "x";
    }
    
    visitZ(node: AST.Z): string {
        return "z";
    }
    
    visitQ(node: AST.Q): string {
        return "q";
    }
    
    visitI(node: AST.I): string {
        return "i";
    }
}

export default EquationVisitor;