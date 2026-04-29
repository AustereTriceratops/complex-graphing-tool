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
        visitor.visitE(this);
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

    accept(visitor: Visitor) {
        throw new Error('EPrime.accept() is an abstract method');
    }
}

export class Plus extends EPrime {
    accept(visitor: Visitor){
        visitor.visitPlus(this);
    }
}

export class Minus extends EPrime {
    accept(visitor: Visitor){
        visitor.visitMinus(this);
    }
}

export class T extends ASTNode {
    f?: F;
    t_prime?: TPrime;

    get incomplete() {
        return (this.f == undefined || this.t_prime == undefined);
    }

    accept(visitor: Visitor) {
        visitor.visitT(this);
    }
}

export class TPrime extends ASTNode {
    f?: F;
    t_prime?: TPrime;

    get isNull() {
        return (this.f == undefined || this.t_prime == undefined);
    }

    constructor(f?: F, t_prime?: TPrime) {
        super();
        this.f = f;
        this.t_prime = t_prime;
    }

    accept(visitor: Visitor) {
        throw new Error('TPrime.accept() is an abstract method');
    }
}

export class Times extends TPrime {
    accept(visitor: Visitor) {
        visitor.visitTimes(this);
    }
}

export class Divide extends TPrime {
    accept(visitor: Visitor) {
        visitor.visitDivide(this);
    }
}

export  class F extends ASTNode {
    accept(visitor: Visitor) { throw new Error("F.accept() is an abstract method")};
}

export class Int extends F {
    value: number;

    constructor(value: number) {
        super();
        this.value = value;
    }

    accept(visitor: Visitor) {
        visitor.visitInt(this);
    }
}

export class Paren extends F {
    e?: E;
    
    accept(visitor: Visitor) {
        visitor.visitParen(this)
    }
}

export class X extends F {
    accept(visitor: Visitor) {
        visitor.visitX(this);
    }
}

export class Z extends F {
    accept(visitor: Visitor) {
        visitor.visitX(this);
    }
}

export class Q extends F {
    accept(visitor: Visitor) {
        visitor.visitX(this);
    }
}

export class I extends F {
    accept(visitor: Visitor) {
        visitor.visitX(this);
    }
}
