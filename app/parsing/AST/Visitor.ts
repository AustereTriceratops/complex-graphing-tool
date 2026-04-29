import * as AST from './AST';

class Visitor{
    visitE(node: AST.E) { throw Error('visitE not implemented') };
    visitPlus(node: AST.Plus) { throw Error('visitPlus not implemented') };
    visitMinus(node: AST.Minus) { throw Error('visitMinus not implemented') };
    visitT(node: AST.T) { throw Error('visitT not implemented') };
    visitTimes(node: AST.Times) { throw Error('visitTimes not implemented') };
    visitDivide(node: AST.Divide) { throw Error('visitDivide not implemented') };
    visitInt(node: AST.Int) { throw Error('visitInt not implemented')};
    visitParen(node: AST.Paren) { throw Error('visitParen not implemented')};
    visitX(node: AST.X) { throw Error('visitX not implemented') };
    visitZ(node: AST.Z) { throw Error('visitZ not implemented') };
    visitQ(node: AST.Q) { throw Error('visitQ not implemented') };
    visitI(node: AST.I) { throw Error('visitI not implemented') };
}

export class PrintVisitor extends Visitor {
    indent_level = 0;

    visitE(node: AST.E): void {
        node.t?.accept(this);
        node.e_prime?.accept(this);
    }

    visitPlus(node: AST.Plus): void {
        console.log('+');
        node.t?.accept(this);
        node.e_prime?.accept(this);
    }

    visitMinus(node: AST.Minus): void {
        console.log('-');
        node.t?.accept(this);
        node.e_prime?.accept(this);
    }

    visitT(node: AST.T): void {
        node.f?.accept(this);
        node.t_prime?.accept(this);
    }

    visitTimes(node: AST.Times): void {
        console.log('*');
        node.f?.accept(this);
        node.t_prime?.accept(this);
    }
    
    visitDivide(node: AST.Divide): void {
        console.log('/');
        node.f?.accept(this);
        node.t_prime?.accept(this);
    }

    visitInt(node: AST.Int): void {
        console.log(node.value);
    }
    
    visitParen(node: AST.Paren): void {
        console.log('(');
        node.e?.accept(this);
        console.log(')');
    }

    visitX(node: AST.X): void {
        console.log('x');
    }

    visitZ(node: AST.Z): void {
        console.log('z');
    }

    visitQ(node: AST.Q): void {
        console.log('q');
    }

    visitI(node: AST.I): void {
        console.log('i');
    }
}

export default Visitor;
