package Scanner;

import java_cup.runtime.Symbol;
import java_cup.runtime.ComplexSymbolFactory;
import java_cup.runtime.ComplexSymbolFactory.ComplexSymbol;
import java_cup.runtime.ComplexSymbolFactory.Location;
import Parser.sym;


%%
%public
%final
%class Lexer
%unicode
%cup
%line
%column

Integer = -?(0|[1-9][0-9]*)

%%

"i" { return symbol(sym.I); }
"pi" { return symbol(sym.PI); }

"x" { return symbol(sym.X); }
"z" { return symbol(sym.X); }

"(" { return symbol(sym.LPAREN); }
")" { return symbol(sym.RPAREN); }

"+" { return symbol(sym.PLUS); }
"*" { return symbol(sym.TIMES); }
"**" { return symbol(sym.POW); }
"^" { return symbol(sym.POW); }

{Integer} { return symbol(sym.INTEGER, yytext()); }