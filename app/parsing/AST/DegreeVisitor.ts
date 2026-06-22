import Visitor from './Visitor';
import * as AST from './AST';

export class DegreeVisitor extends Visitor {
    inside_pow_expression = false;

    visitE(node: AST.E): int {
        const t = node.t?.accept(this);
        const e_prime = node.e_prime?.accept(this) ?? Number.MIN_SAFE_INTEGER;

        console.log("visitE: t = ", t)
        console.log("visitE: e_prime = ", e_prime)

        return Math.max(t, e_prime);
    }

    visitPlus(node: AST.Plus): int {
        const t = node.t?.accept(this);
        const e_prime = node.e_prime?.accept(this) ?? Number.MIN_SAFE_INTEGER;

        return Math.max(t, e_prime);
    }

    visitMinus(node: AST.Minus): int {
        const t = node.t?.accept(this);
        const e_prime = node.e_prime?.accept(this) ?? Number.MIN_SAFE_INTEGER;

        return Math.max(t, e_prime);
    }

    visitT(node: AST.T): int {
        const p = node.p?.accept(this);
        const t_prime = node.t_prime?.accept(this) ?? 0;

        console.log("visitT: p = ", p)
        console.log("visitT: t_prime = ", t_prime)

        return p + t_prime;
    }

    visitTimes(node: AST.Times): int {
        const p = node.p?.accept(this);
        const t_prime = node.t_prime?.accept(this) ?? 0;

        return p + t_prime;
    }
    
    visitDivide(node: AST.Divide): int {
        const p = node.p?.accept(this);
        const t_prime = node.t_prime?.accept(this) ?? 0;

        console.log("visitDivide: p = ", p)
        console.log("visitDivide: t_prime = ", t_prime)
        return -(p - t_prime);
    }

    visitP(node: AST.P): int {
        const f = node.f?.accept(this);

        this.inside_pow_expression = true
        const p_prime = node.p_prime?.accept(this) ?? 1;
        this.inside_pow_expression = false

        return f * p_prime;
    }

    visitPow(node: AST.Pow): int {
        const f = node.f?.accept(this);
        const p_prime = node.p_prime?.accept(this) ?? 1;

        return f * p_prime;
    }

    visitNum(node: AST.Num): int {
        const val = (this.inside_pow_expression) ? node.value : 0
       return val;
    }
    
    visitParen(node: AST.Paren): int {
        const expr = node.e?.accept(this);

        return expr;
    }

    visitX(node: AST.X): int {
        return 1;
    }
    
    visitZ(node: AST.Z): int {
        return 1;
    }
    
    visitQ(node: AST.Q): int {
        return 1; // "degree" not really applicable here since e^x = 1 + x + x^2/2 + ...
    }
    
    visitI(node: AST.I): int {
        return 0;
    }
}

export default DegreeVisitor;