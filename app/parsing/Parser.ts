import * as AST from './AST/AST';
import { TERMINALS, NONTERMINALS, Token } from './grammar';

class Parser {
    static parsingTable: Record<string, Record<string, string[]>> = {
        'E': {
            'INT': ['T', 'EPrime'],
            'LPAREN': ['T', 'EPrime'],
            'X': ['T', 'EPrime'],
            'Z': ['T', 'EPrime'],
            'Q': ['T', 'EPrime'],
            'I': ['T', 'EPrime'],
            'END': []
        },
        'EPrime': {
            'RPAREN': [],
            'END': [],
            'PLUS': ['PLUS', 'T', 'EPrime'],
            'MINUS': ['MINUS', 'T', 'EPrime']
        },
        'T': {
            'INT': ['F', 'TPrime'],
            'LPAREN': ['F', 'TPrime'],
            'X': ['F', 'TPrime'],
            'Z': ['F', 'TPrime'],
            'Q': ['F', 'TPrime'],
            'I': ['F', 'TPrime'],
        },
        'TPrime': {
            'RPAREN': [],
            'END': [],
            'PLUS': [],
            'MINUS': [],
            'TIMES': ['TIMES', 'F', 'TPrime'],
            'DIVIDE': ['DIVIDE', 'F', 'TPrime']
        },
        'F': {
            'INT': ['INT'],
            'LPAREN': ['LPAREN', 'E', 'RPAREN'],
            'X': ['X'],
            'Z': ['Z'],
            'Q': ['Q'],
            'I': ['I'],
        }
    }

    static parse(tokens: Token[]) {
        let accept = true;
        const ast = new AST.ASTNode();

        const stackFinal = [];
        const stack = ['E'];

        for (const token of tokens) {
            if (accept == false) break;

            if (token.name == '<?>') {
                console.log('parsing ERROR: attempting to parse unknown token');
                accept = false;
                break;
            }
            
            let continueLoop = true;

            // NOTE: the extra breaks and continues are intentional
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
                        const production = this.parsingTable[symbol][token.name];

                        if (production == undefined) {
                            console.log(
                                `parsing ERROR: symbol on the stack (${symbol}) has no productions for the terminal (${token.name})`
                            )
                            accept = false;
                            continueLoop = false;
                            break;
                        }
        
                        // this is the only case in which the while loop continues running
                        for (let i = production.length - 1; i >= 0; i--) {
                            const producedSymbol = production[i];
                            stack.push(producedSymbol);
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
