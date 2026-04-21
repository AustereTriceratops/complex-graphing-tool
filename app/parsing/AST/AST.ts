import Visitor from "./Visitor";

export class ASTNode{
    constructor(){}
}

export class E extends ASTNode {
    t: T | null = null;
    e_prime: EPrime | null = null;

    get incomplete() {
        return (this.t == null || this.e_prime == null);
    }

    // constructor(t: T, e_prime: EPrime) {
    //     super();
    //     this.t = t;
    //     this.e_prime = e_prime;
    // }

    accept(visitor: Visitor){
        visitor.visitE(this);
    }
}

export class EPrime extends ASTNode {
    t: T;
    e_prime: EPrime;

    constructor(t: T, e_prime: EPrime) {
        super();
        this.t = t;
        this.e_prime = e_prime;
    }

    accept(visitor: Visitor){
        visitor.visitEPrime(this);
    }
}

export class T extends ASTNode {
    f: F;
    t_prime: TPrime;

    constructor(f: F, t_prime: TPrime) {
        super();
        this.f = f;
        this.t_prime = t_prime;
    }
}

export class TPrime extends ASTNode {
    f: F;
    t_prime: TPrime;

    constructor(f: F, t_prime: TPrime) {
        super();
        this.f = f;
        this.t_prime = t_prime;
    }
}


export  class F extends ASTNode {}

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

export class X extends F {
    accept(visitor: Visitor) {
        visitor.visitX(this);
    }
}
