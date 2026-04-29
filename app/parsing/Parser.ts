import * as AST from './AST/AST';
import { TERMINALS, NONTERMINALS, NULLABLE_NONTERMINALS, PARSING_TABLE, Token } from './grammar';

// this parsing method buils the abstract syntax tree (AST) top-down
// this means that, given a production A -> BC, an AST Node for A is created with the fields for B and C uninitialized
// as a consequence, the field of every AST node must be marked with a '?' in typescript
// (representing the union type between an ASTNode type and undefined)

// Maybe I can switch to bottom-up parsing so that I won't have to deal with nodes 
// being potentially undefined


class Parser {
    static parse(tokens: Token[]) {
        let accept = true;
        const ast = new AST.E();
        const nodeStack: AST.ASTNode[] = [ast];
        const nodeStack2: [AST.ASTNode, string][] = [[ast, '']];

        const stackFinal = []; // will have only terminal symbols
        const stack = ['E']; // will have a mix of terminal and nonterminals

        // NOTE: every token is a terminal symbol in the grammar
        for (const token of tokens) {
            if (accept == false) break;

            if (token.name == '<?>') {
                console.log('parsing ERROR: attempting to parse unknown token');
                accept = false;
                break;
            }

            if (token.name == 'END') {
                let breakLoop = false;
                
                for (const symbol of stack) {
                    if (NONTERMINALS.has(symbol) && !NULLABLE_NONTERMINALS.has(symbol)) {
                        console.log('parsing ERROR: reached END token while stack has non-nullable nonterminal symbols');
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
                    console.log('parsing: stack is empty');
                    console.log(`parsed tokens: ${stackFinal}`);

                    // unsure how to test this, or how to create this fail condition
                    // but this is here just in case it causes an unsuccessful parse
                    if (token.name != 'END')  {
                        console.log(`parsing ERROR: stack empty, cannot proceed with token ${token}`)
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
                            )
                            accept = false;
                        }

                        continueLoop = false;
                        break;
                    } else if (NONTERMINALS.has(symbol)) {
                        const production = PARSING_TABLE[symbol][token.name];

                        if (production == undefined) {
                            console.log(
                                `parsing ERROR: symbol on the stack (${symbol}) has no productions for the terminal (${token.name})`
                            )
                            accept = false;
                            continueLoop = false;
                            break;
                        } else {
                            // this is the only case in which the while loop continues running
                            for (let i = production.length - 1; i >= 0; i--) {
                                const producedSymbol = production[i];
                                stack.push(producedSymbol);
                            }

                            const node = nodeStack.pop();

                            if (node == undefined) break;

                            if (symbol == 'E') {
                                // TODO: this case has a lot of "special code" because we
                                // create the base of the AST ahead of time instead of
                                // through productions.
                                // Could maybe add the usual "starter" production that compilers use
                                if (token.name == 'END') continue;

                                if (node instanceof AST.Paren) {
                                    node.e = new AST.E();
                                    nodeStack.push(node.e);
                                    nodeStack.push(node.e);
                                } else if (node instanceof AST.E) {
                                    nodeStack.push(node);
                                    nodeStack.push(node);
                                }
                                
                            } else if (symbol == 'EPrime') {
                                // for a given symbol on the stack, check that the corresponding node on the stack
                                // can produce that symbol (i.e. there's an appropriate production rule in the grammar)
                                if (!(node instanceof AST.EPrime || node instanceof AST.E)) continue;
                                if (token.name == 'END') continue;
                                if (token.name == 'RPAREN') continue;

                                if (token.name == 'PLUS') {
                                    node.e_prime = new AST.Plus();
                                    nodeStack.push(node.e_prime)
                                    nodeStack.push(node.e_prime)
                                }
                                if (token.name == 'MINUS') {
                                    node.e_prime = new AST.Minus();
                                    nodeStack.push(node.e_prime)
                                    nodeStack.push(node.e_prime)
                                }
                            } else if (symbol == 'T') {
                                if (!(node instanceof AST.EPrime || node instanceof AST.E)) continue;
                                
                                node.t = new AST.T();

                                nodeStack.push(node.t);
                                nodeStack.push(node.t);
                            } else if (symbol == 'TPrime') {
                                if (!(node instanceof AST.TPrime || node instanceof AST.T)) continue;
                                if (token.name == 'END') continue;
                                if (token.name == 'RPAREN') continue;
                                if (token.name == 'PLUS') continue;
                                if (token.name == 'MINUS') continue;

                                if (token.name == 'TIMES') {
                                    node.t_prime = new AST.Times();
                                    nodeStack.push(node.t_prime)
                                    nodeStack.push(node.t_prime)
                                }
                                if (token.name == 'DIVIDE') {
                                    node.t_prime = new AST.Divide();
                                    nodeStack.push(node.t_prime)
                                    nodeStack.push(node.t_prime)
                                }
                            } else if (symbol == 'F') {
                                if (!(node instanceof AST.TPrime || node instanceof AST.T)) continue;

                                if (token.name == 'INT') {
                                    if (!token.value) continue;
                                    node.f = new AST.Int(parseInt(token.value));
                                } else if (token.name == 'LPAREN') {
                                    node.f = new AST.Paren();
                                    nodeStack.push(node.f);
                                } else if (token.name == 'X') {
                                    node.f = new AST.X();
                                } else if (token.name == 'Z') {
                                    node.f = new AST.Z();
                                } else if (token.name == 'Q') {
                                    node.f = new AST.Q();
                                } else if (token.name == 'I') {
                                    node.f = new AST.I();
                                }
                            }
                        }
                    }
                }
            }
        }

        return {
            ast: ast, accept: accept
        };
    }
}

export default Parser;
