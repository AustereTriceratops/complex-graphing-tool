import Visitor from "./Visitor";
import * as AST from '../AST/AST';

class GLSLVisitor extends Visitor {
    function_start = "vec2 function(vec2 x) { vec2 y = "
    function_end = "; return y;}"

    entering = true;

    visitE(node: AST.E): string {
        let result = ''

        if (this.entering) {
            this.entering = false;

            const txt1 = node.t?.accept(this) ?? '';
            const txt2 = node.e_prime?.accept(this) ?? '';
            result = this.function_start + txt1 + txt2 + this.function_end
        } else {
            const txt1 = node.t?.accept(this) ?? '';
            const txt2 = node.e_prime?.accept(this) ?? '';
            result = txt1 + txt2;
        }
        return result;
    }
        
    visitPlus(node: AST.Plus): string {
        const txt1 = node.t?.accept(this) ?? '';
        const txt2 = node.e_prime?.accept(this) ?? '';

        return '+' + txt1 + txt2;
    };

    visitMinus(node: AST.Minus): string {
        const txt1 = node.t?.accept(this) ?? '';
        const txt2 = node.e_prime?.accept(this) ?? '';

        return '-' + txt1 + txt2;
    };

    visitT(node: AST.T): string {
        const txt1 = node.p?.accept(this) ?? '';
        let result = txt1;

        if (node.p != undefined && node.t_prime != undefined) {
            const txt2  = node.t_prime.accept(this);

            if (node.t_prime instanceof AST.Times) {
                result = `c_multiply(${txt1}, ${txt2})`;
            } else if (node.t_prime instanceof AST.Divide) {
                result = `c_divide(${txt1}, ${txt2})`;
            }
        }

        return result;
    };

    visitTimes(node: AST.Times): string {
        const txt1 = node.p?.accept(this) ?? '';
        let result = txt1;

        if (node.p != undefined && node.t_prime != undefined) {
            const txt2  = node.t_prime.accept(this);

            if (node.t_prime instanceof AST.Times) {
                result = `c_multiply(${txt1}, ${txt2})`;
            } else if (node.t_prime instanceof AST.Divide) {
                result = `c_divide(${txt1}, ${txt2})`;
            }
        }

        return result;
    };

    visitDivide(node: AST.Divide): string {
        const txt1 = node.p?.accept(this) ?? '';
        let result = txt1;

        if (node.p != undefined && node.t_prime != undefined) {
            const txt2  = node.t_prime.accept(this);

            if (node.t_prime instanceof AST.Times) {
                result = `c_multiply(${txt1}, ${txt2})`;
            } else if (node.t_prime instanceof AST.Divide) {
                result = `c_divide(${txt1}, ${txt2})`;
            }
        }

        return result;
    };

    visitP(node: AST.P): string {
        const txt1 = node.f?.accept(this) ?? '';
        let result = txt1;

        if (node.f != undefined && node.p_prime != undefined) {
            const txt2  = node.p_prime.accept(this);

            if (node.p_prime instanceof AST.Pow) {
                result = `c_pow_full(${txt1}, ${txt2})`;
            }
        }

        return result;
    };

    visitPow(node: AST.Pow): string {
        const txt1 = node.f?.accept(this) ?? '';
        let result = txt1;

        if (node.f != undefined && node.p_prime != undefined) {
            const txt2  = node.p_prime.accept(this);

            if (node.p_prime instanceof AST.Pow) {
                result = `c_pow_full(${txt1}, ${txt2})`;
            }
        }

        return result;
    };

    visitNum(node: AST.Num): string {
        return `vec2(${node.value.toFixed(1)}, 0.0)`;
    };

    visitParen(node: AST.Paren): string {
        const txt = node.e?.accept(this) ?? '';
        return `(${txt})`;
    };

    visitX(_node: AST.X): string {
        return 'x';
    };

    visitZ(_node: AST.Z): string {
        return 'x';
    };

    visitQ(_node: AST.Q): string {
        return 'q(x)';
    };

    visitI(_node: AST.I): string {
        return 'vec2(0.0, 1.0)';
    };

    visitNegation(node: AST.Negation): string {
        const txt = node.f?.accept(this) ?? '';
        return `vec2(0.0, 0.0) - ${txt}`;
    };

    visitFunc(node: AST.Func): string {
        const txt = node.e?.accept(this) ?? '';

        return `c_${node.name}(${txt})`;
    }
}

export default GLSLVisitor;
