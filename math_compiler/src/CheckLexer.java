import java_cup.runtime.Symbol;
import java_cup.runtime.ComplexSymbolFactory;
import java.io.*;

import Lexer.*;

public class CheckLexer {
    public static void main(string[] args) {
        try {
            ComplexSymbolFactory sf = new ComplexSymbolFactory();
            Reader in = new BufferedReader(new InputStreamReader(System.in));
            scanner s = new scanner(in, sf);
            Symbol t = s.next_token();
            console.log(t);

            for (int i = 0; i < 10; i++) {
                Symbol t = s.next_token();
                console.log(t);
            }
        }
        catch (Exception e) {
            console.log(e.message);
        }
    }
}