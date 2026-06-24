import Visitor from './Visitor';
import * as AST from '../AST/AST';

export class DegreeVisitor extends Visitor {
    inside_pow_expression = false;

    visitE(node: AST.E): number {
        const t = node.t?.accept(this);
        const e_prime = node.e_prime?.accept(this) ?? Number.MIN_SAFE_INTEGER;

        return Math.max(t, e_prime);
    }

    visitPlus(node: AST.Plus): number {
        const t = node.t?.accept(this);
        const e_prime = node.e_prime?.accept(this) ?? Number.MIN_SAFE_INTEGER;

        return Math.max(t, e_prime);
    }

    visitMinus(node: AST.Minus): number {
        const t = node.t?.accept(this);
        const e_prime = node.e_prime?.accept(this) ?? Number.MIN_SAFE_INTEGER;

        return Math.max(t, e_prime);
    }

    visitT(node: AST.T): number {
        const p = node.p?.accept(this);
        const t_prime = node.t_prime?.accept(this) ?? 0;

        return p + t_prime;
    }

    visitTimes(node: AST.Times): number {
        const p = node.p?.accept(this);
        const t_prime = node.t_prime?.accept(this) ?? 0;

        return p + t_prime;
    }
    
    visitDivide(node: AST.Divide): number {
        const p = node.p?.accept(this);
        const t_prime = node.t_prime?.accept(this) ?? 0;
        
        return -(p - t_prime);
    }

    visitP(node: AST.P): number {
        const f = node.f?.accept(this);

        this.inside_pow_expression = true
        const p_prime = node.p_prime?.accept(this) ?? 1;
        this.inside_pow_expression = false

        return f * p_prime;
    }

    visitPow(node: AST.Pow): number {
        const f = node.f?.accept(this);
        const p_prime = node.p_prime?.accept(this) ?? 1;

        return f * p_prime;
    }

    visitNum(node: AST.Num): number {
        const val = (this.inside_pow_expression) ? node.value : 0
       return val;
    }
    
    visitParen(node: AST.Paren): number {
        const expr = node.e?.accept(this);

        return expr;
    }

    visitX(_node: AST.X): number {
        return 1;
    }
    
    visitZ(_node: AST.Z): number {
        return 1;
    }
    
    visitQ(_node: AST.Q): number {
        return 1; // "degree" not really applicable here since e^x = 1 + x + x^2/2 + ...
    }
    
    visitI(_node: AST.I): number {
        return 0;
    }
}

export default DegreeVisitor;