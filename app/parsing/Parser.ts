import * as AST from './AST/AST';
import { PARSING_TABLE, Token } from './grammar';
import preParse  from './PreParser';
import Lexer  from './Lexer';
import {
    UNK, X, Z, Q, I, PLUS, MINUS, TIMES, DIVIDE, POW, NUM, PARAM, LPAREN, BAR, FUNC, END,
    S, E, EPrime, T, TPrime, P, PPrime, F, CONSTANTS,
    TERMINALS, NONTERMINALS, NULLABLE_NONTERMINALS
} from "./constants";

// this parsing method buils the abstract syntax tree (AST) top-down
// this means that, given a production A -> BC, an AST Node for A is created with the fields for B and C uninitialized
// as a consequence, the field of every AST node must be marked with a '?' in typescript
// (representing the union type between an ASTNode type and undefined)

// Maybe I can switch to bottom-up parsing so that I won't have to deal with nodes 
// being potentially undefined

// TODO: error reporting
class Parser {
    static parseTokens(tokens: Token[], verbose=false): AST.S {
        let accept = true;
        const ast = new AST.S();
        const nodeStack: AST.ASTNode[] = [ast];

        const stackFinal: string[] = []; // will have only terminal symbols
        const stack: string[] = ['S']; // will have a mix of terminal and nonterminals

        tokens = preParse(tokens);

        // NOTE: every token is a terminal symbol in the grammar
        for (const token of tokens) {
            if (verbose) {
                console.log('stackFinal: ', stackFinal);
                console.log('stack: ', stack);
            }
            
            if (accept == false) break;

            if (token.name == UNK) {
                console.log('parsing ERROR: attempting to parse unknown token');
                accept = false;
                break;
            }

            if (token.name == END) {
                let breakLoop = false;
                
                for (const symbol of stack) {
                    if (NONTERMINALS.has(symbol) && !NULLABLE_NONTERMINALS.has(symbol)) {
                        console.log(`parsing ERROR: reached END token while stack has non-nullable nonterminal symbols ${stack}`);
                        accept = false;
                        breakLoop = true;
                        break;
                    }
                }

                if (breakLoop) break;
            }

            // TODO: check that token is in TERMINALS?
            
            let continueLoop = true;

            // NOTE: the break statements shouldn't be necessary, and are really just there to signal intent
            while (continueLoop) {
                const symbol = stack.pop();
                
                if (symbol == undefined) {
                    // unsure how to test this, or how to create this fail condition
                    // but this is here just in case it causes an unsuccessful parse
                    if (token.name != END)  {
                        console.log(`parsing ERROR: stack empty, cannot proceed with token ${token}`);
                        accept = false;
                    }

                    continueLoop = false;
                    break;
                } else {
                    if (TERMINALS.has(symbol)) {
                        // if the token being looked at is on the stack, then 
                        // continue onto the next token in the outer loop
                        // else, something might be wrong with the production rules or parse table
                        if (symbol == token.name) {
                            stackFinal.push(symbol);
                        } else {
                            // unsure how to test this case, but this is here just in case
                            console.log(
                                `parsing ERROR: symbol on the stack (${symbol}) does not match the terminal being looked at (${token.name}). Check the parse table.`
                            );
                            accept = false;
                        }

                        continueLoop = false;
                        break;
                    } else if (NONTERMINALS.has(symbol)) {
                        // the right-hand-side of a production of this form
                        // {symbol} ::= {token.name} + {other terminal and nonterminal symbols}
                        const production = PARSING_TABLE[symbol][token.name];

                        if (production == undefined) {
                            console.log(
                                `parsing ERROR: symbol on the stack (${symbol}) has no productions for the terminal (${token.name})`
                            );
                            accept = false;
                            continueLoop = false;
                            break;
                        } else {
                            // this is the only case in which the while loop continues running
                            for (let i = production.length - 1; i >= 0; i--) {
                                stack.push(production[i]);
                            }

                            Parser.buildASTNode(nodeStack, token, symbol);
                        }
                    }
                }
            }
        }

        ast.valid = accept;
        return ast;
    }

    static parse(input: string): AST.S {
        return Parser.parseTokens(Lexer.scan(input));
    }

    /**
     * 'Fills in' missing AST nodes for top-down parsing (AST nodes get initialized with no children)
     * Takes a nonterminal symbol with multiple productions and finds the production corresponding 
     * to a given token being looked at by the parser. It initializes the AST node corresponding to 
     * that production and stores in in the parent node at the stop of the node stack.
     * 
     * @param nodeStack - when nodes are created, they need to be "filled in" later on. This tracks them.
     * @param token  - the current input token (always a terminal symbol)
     * @param symbol - the current node being filled in
     */
    static buildASTNode(nodeStack: AST.ASTNode[], token: Token,  symbol: string) {
        const node = nodeStack.pop();

        if (node != undefined) {
            if (symbol == S) {
                if (node instanceof AST.S) {
                    if (token.name != END) {
                        nodeStack.push(node);
                    }
                }
            }
            if (symbol == E) {
                if (token.name != END) {
                    if (node instanceof AST.Paren) {
                        node.e = new AST.E();
                        nodeStack.push(node.e);
                        nodeStack.push(node.e);
                    } else if (node instanceof AST.Func) {
                        node.e = new AST.E();
                        nodeStack.push(node.e);
                        nodeStack.push(node.e);
                    } else if (node instanceof AST.S) {
                        node.e = new AST.E();
                        nodeStack.push(node.e);
                        nodeStack.push(node.e);
                    }
                }
            } else if (symbol == EPrime) {
                // for a given symbol on the stack, check that the corresponding node on the stack
                // can produce that symbol (i.e. there's an appropriate production rule in the grammar)
                if ((node instanceof AST.EPrime || node instanceof AST.E)) {
                    if (token.name == PLUS) {
                        node.e_prime = new AST.Plus();
                        nodeStack.push(node.e_prime);
                        nodeStack.push(node.e_prime);
                    } else if (token.name == MINUS) {
                        node.e_prime = new AST.Minus();
                        nodeStack.push(node.e_prime);
                        nodeStack.push(node.e_prime);
                    }
                }
            } else if (symbol == T) {
                if ((node instanceof AST.EPrime || node instanceof AST.E)) {
                    node.t = new AST.T();
                    nodeStack.push(node.t);
                    nodeStack.push(node.t);
                }
            } else if (symbol == TPrime) {
                if ((node instanceof AST.TPrime || node instanceof AST.T)) {
                    if (token.name == TIMES) {
                        node.t_prime = new AST.Times();
                        nodeStack.push(node.t_prime);
                        nodeStack.push(node.t_prime);
                    } else if (token.name == DIVIDE) {
                        node.t_prime = new AST.Divide();
                        nodeStack.push(node.t_prime);
                        nodeStack.push(node.t_prime);
                    }
                }
            } else if (symbol == P) {
                if ((node instanceof AST.TPrime || node instanceof AST.T)) {
                    node.p = new AST.P();
                    nodeStack.push(node.p);
                    nodeStack.push(node.p);
                }
            } else if (symbol == PPrime) {
                if ((node instanceof AST.PPrime || node instanceof AST.P)) {
                    if (token.name == POW) {
                        node.p_prime = new AST.Pow();
                        nodeStack.push(node.p_prime);
                        nodeStack.push(node.p_prime);
                    }
                }
            } else if (symbol == F) {
                if ((node instanceof AST.PPrime || node instanceof AST.P || node instanceof AST.Negation)) {
                    if (token.name == NUM) {
                        if (token.value != null) {
                            const isConstant = CONSTANTS.has(token.value);
                            node.f = new AST.Num(parseFloat(token.value), isConstant);
                        }
                    } else if (token.name == PARAM) {
                        if (token.value != null) {
                            node.f = new AST.Param(1, token.value);
                        }
                    } else if (token.name == LPAREN) {
                        node.f = new AST.Paren();
                        nodeStack.push(node.f);
                    } else if (token.name == X) {
                        node.f = new AST.X();
                    } else if (token.name == Z) {
                        node.f = new AST.Z();
                    } else if (token.name == Q) {
                        node.f = new AST.Q();
                    } else if (token.name == I) {
                        node.f = new AST.I();
                    } else if (token.name == MINUS) {
                        node.f = new AST.Negation();
                        nodeStack.push(node.f);
                    } else if (token.name == FUNC) {
                        node.f = new AST.Func();

                        if (node.f instanceof AST.Func) {
                            node.f.name = token.value ?? '';
                        }

                        nodeStack.push(node.f);
                    } else if (token.name == BAR) {
                        node.f = new AST.Func();

                        if (node.f instanceof AST.Func) {
                            node.f.name = "conj";
                        }

                        nodeStack.push(node.f);
                    }
                }
            }
        }
    }
}

export default Parser;
