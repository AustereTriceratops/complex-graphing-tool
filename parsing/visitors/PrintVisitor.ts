import Visitor from './Visitor';
import * as AST from '../AST/AST';

export class PrintVisitor extends Visitor {
    indent_level = 0;

    get spacing() {
        return ' '.repeat(2*this.indent_level);
    }

    visitE(node: AST.E): void {
        node.t?.accept(this);
        node.e_prime?.accept(this);
    }

    visitPlus(node: AST.Plus): void {
        console.log(`${this.spacing}+`);

        this.indent_level += 1

        node.t?.accept(this);
        node.e_prime?.accept(this);

        this.indent_level -= 1
    }

    visitMinus(node: AST.Minus): void {
        console.log(`${this.spacing}-`);

        this.indent_level += 1

        node.t?.accept(this);
        node.e_prime?.accept(this);

        this.indent_level -= 1
    }

    visitT(node: AST.T): void {
        node.p?.accept(this);
        node.t_prime?.accept(this);
    }

    visitTimes(node: AST.Times): void {
        console.log(`${this.spacing}*`);
        
        this.indent_level += 1;

        node.p?.accept(this);
        node.t_prime?.accept(this);

        this.indent_level -= 1;
    }
    
    visitDivide(node: AST.Divide): void {
        console.log(`${this.spacing}/`);
        
        this.indent_level += 1;

        node.p?.accept(this);
        node.t_prime?.accept(this);

        this.indent_level -= 1;
    }

    visitP(node: AST.P): void {
        node.f?.accept(this);
        node.p_prime?.accept(this);
    }

    visitPow(node: AST.Pow): void {
        console.log(`${this.spacing}^`);
        
        this.indent_level += 1;

        node.f?.accept(this);
        node.p_prime?.accept(this);

        this.indent_level -= 1;
    }

    visitNum(node: AST.Num): void {
        console.log(`${this.spacing}${node.value}`);
    }
    
    visitParen(node: AST.Paren): void {
        console.log(`${this.spacing}(`);

        this.indent_level += 1;
        node.e?.accept(this);
        this.indent_level -= 1;


        console.log(`${this.spacing})`);
    }

    visitX(_node: AST.X): void {
        console.log(`${this.spacing}x`);
    }
    
    visitZ(_node: AST.Z): void {
        console.log(`${this.spacing}z`);
    }
    
    visitQ(_node: AST.Q): void {
        console.log(`${this.spacing}q`);
    }
    
    visitI(_node: AST.I): void {
        console.log(`${this.spacing}i`);
    }

    visitNegation(node: AST.Negation): void {
        console.log(`${this.spacing}-`);
        node.f?.accept(this)
    };

    visitFunc(node: AST.Func): void {
        console.log(`${this.spacing}${node.name}(`);

        this.indent_level += 1;
        node.e?.accept(this);
        this.indent_level -= 1;

        console.log(`${this.spacing})`);
    };
}

export default PrintVisitor;