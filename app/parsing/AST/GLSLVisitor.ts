import * as AST from "./AST";
import Visitor from "./Visitor";

class GLSLVisitor extends Visitor {
    function_start = "vec2 function(vec2 x) { vec2 y = "
    function_end = "; return y;}"

    entering = true;

    visitE(node: AST.E): string {
        const txt1 = node.t?.accept(this) ?? '';
        const txt2 = node.e_prime?.accept(this) ?? '';
        let result = txt1 + txt2;

        if (this.entering) {
            result = this.function_start + result + this.function_end
        }

        this.entering = false;
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
        const txt1 = node.f?.accept(this) ?? '';
        let result = txt1;

        if (node.f != undefined && node.t_prime != undefined) {
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
        const txt1 = node.f?.accept(this) ?? '';
        let result = txt1;

        if (node.f != undefined && node.t_prime != undefined) {
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
        const txt1 = node.f?.accept(this) ?? '';
        let result = txt1;

        if (node.f != undefined && node.t_prime != undefined) {
            const txt2  = node.t_prime.accept(this);

            if (node.t_prime instanceof AST.Times) {
                result = `c_multiply(${txt1}, ${txt2})`;
            } else if (node.t_prime instanceof AST.Divide) {
                result = `c_divide(${txt1}, ${txt2})`;
            }
        }

        return result;
    };

    visitInt(node: AST.Int): string {
        return `vec2(${node.value.toFixed(1)}, 0.0)`;
    };

    visitParen(node: AST.Paren): string {
        const txt = node.e?.accept(this) ?? '';
        return `(${txt})`;
    };

    visitX(node: AST.X): string {
        return 'x';
    };

    visitZ(node: AST.Z): string {
        return 'x';
    };

    visitQ(node: AST.Q): string {
        return 'q(x)';
    };

    visitI(node: AST.I): string {
        return 'vec2(0.0, 1.0)';
    };
}

export default GLSLVisitor;
