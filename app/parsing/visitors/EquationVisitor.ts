import Visitor from './Visitor';
import * as AST from '../AST/AST';

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
        const p = node.p?.accept(this);
        const t_prime = node.t_prime?.accept(this) ?? '';

        return `${p}${t_prime}`;
    }
_
    visitTimes(node: AST.Times): string {
        const p = node.p?.accept(this);
        const t_prime = node.t_prime?.accept(this) ?? '';

        return `*${p}${t_prime}`;
    }
    
    visitDivide(node: AST.Divide): string {
        const p = node.p?.accept(this);
        const t_prime = node.t_prime?.accept(this) ?? '';

        return `/${p}${t_prime}`;
    }

    visitP(node: AST.P): string {
        const f = node.f?.accept(this);
        const p_prime = node.p_prime?.accept(this) ?? '';

        return `${f}${p_prime}`;
    }

    visitPow(node: AST.Pow): string {
        const f = node.f?.accept(this);
        const p_prime = node.p_prime?.accept(this) ?? '';

        return `^${f}${p_prime}`;
    }

    visitNum(node: AST.Num): string {
        return `${node.value}`;
    }
    
    visitParen(node: AST.Paren): string {

        const expr = node.e?.accept(this);

        return `(${expr})`;
    }

    visitX(_node: AST.X): string {
        return "x";
    }
    
    visitZ(_node: AST.Z): string {
        return "z";
    }
    
    visitQ(_node: AST.Q): string {
        return "q";
    }
    
    visitI(_node: AST.I): string {
        return "i";
    }
}

export default EquationVisitor;