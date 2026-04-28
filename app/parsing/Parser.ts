import * as AST from './AST/AST';
import { TERMINALS, NONTERMINALS, NULLABLE_NONTERMINALS, PARSING_TABLE, Token } from './grammar';

class Parser {
    static parse(tokens: Token[]) {
        let accept = true;
        const ast = new AST.E();
        const nodeStack: AST.ASTNode[] = [ast];

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
