import Visitor from "./Visitor";

export class ASTNode{
    constructor(){}
}

export class E extends ASTNode {
    t?: T;
    e_prime?: EPrime;

    get incomplete() {
        return (this.t == undefined || this.e_prime == undefined);
    }

    accept(visitor: Visitor){
        return visitor.visitE(this);
    }
}

export class EPrime extends ASTNode {
    t?: T;
    e_prime?: EPrime;

    get isNull() {
        return (this.t == undefined || this.e_prime == undefined);
    }

    constructor(t?: T, e_prime?: EPrime) {
        super();
        this.t = t;
        this.e_prime = e_prime;
    }

    accept(_visitor: Visitor) {
        throw new Error('EPrime.accept() is an abstract method');
    }
}

export class Plus extends EPrime {
    accept(visitor: Visitor){
        return visitor.visitPlus(this);
    }
}

export class Minus extends EPrime {
    accept(visitor: Visitor){
        return visitor.visitMinus(this);
    }
}

export class T extends ASTNode {
    p?: P;
    t_prime?: TPrime;

    get incomplete() {
        return (this.p == undefined || this.t_prime == undefined);
    }

    accept(visitor: Visitor) {
        return visitor.visitT(this);
    }
}

export class TPrime extends ASTNode {
    p?: P;
    t_prime?: TPrime;

    get isNull() {
        return (this.p == undefined || this.t_prime == undefined);
    }

    constructor(p?: P, t_prime?: TPrime) {
        super();
        this.p = p;
        this.t_prime = t_prime;
    }

    accept(_visitor: Visitor) {
        throw new Error('TPrime.accept() is an abstract method');
    }
}

export class Times extends TPrime {
    accept(visitor: Visitor) {
        return visitor.visitTimes(this);
    }
}

export class Divide extends TPrime {
    accept(visitor: Visitor) {
        return visitor.visitDivide(this);
    }
}

export class P extends ASTNode {
    f?: F;
    p_prime?: PPrime;

    get incomplete() {
        return (this.f == undefined || this.p_prime == undefined);
    }

    accept(visitor: Visitor) {
        return visitor.visitP(this);
    }
}

export class PPrime extends ASTNode {
    f?: F;
    p_prime?: PPrime;

    get isNull() {
        return (this.f == undefined || this.p_prime == undefined);
    }

    constructor(f?: F, p_prime?: PPrime) {
        super();
        this.f = f;
        this.p_prime = p_prime;
    }

    accept(_visitor: Visitor) {
        throw new Error('PPrime.accept() is an abstract method');
    }
}

export class Pow extends PPrime {
    accept(visitor: Visitor) {
        return visitor.visitPow(this);
    }
}

export  class F extends ASTNode {
    accept(_visitor: Visitor) { throw new Error("F.accept() is an abstract method")};
}

export class Num extends F {
    value: number;

    constructor(value: number) {
        super();
        this.value = value;
    }

    accept(visitor: Visitor) {
        return visitor.visitNum(this);
    }
}

export class Paren extends F {
    e?: E;
    
    accept(visitor: Visitor) {
        return visitor.visitParen(this)
    }
}

export class X extends F {
    accept(visitor: Visitor) {
        return visitor.visitX(this);
    }
}

export class Z extends F {
    accept(visitor: Visitor) {
        return visitor.visitZ(this);
    }
}

export class Q extends F {
    accept(visitor: Visitor) {
        return visitor.visitQ(this);
    }
}

export class I extends F {
    accept(visitor: Visitor) {
        return visitor.visitI(this);
    }
}

export class Negation extends F {
    f?: F;
    
    accept(visitor: Visitor) {
        return visitor.visitNegation(this)
    }
}
