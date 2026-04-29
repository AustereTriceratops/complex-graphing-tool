import { useEffect, useState } from 'react';
import { Input } from "@mui/material";
import ErrorIcon from '@mui/icons-material/Error';
import Lexer from '../parsing/Lexer';
import Parser from '../parsing/Parser';
import PrintVisitor from '../parsing/AST/PrintVisitor';

const EquationInput = (props) => {
    const {value, updateValue} = props;

    const [internalValue, setInternalValue] = useState(value);
    
    useEffect(() => {
        setInternalValue(value);
    }, [value])

    // error reporting
    const [error, setError] = useState(false);

    return (
        <div style={{display: 'flex', flexDirection: 'row', padding: '0.75rem', gap: '0.25rem', justifyContent: 'center', alignItems: 'center'}}>
            <Input
                type="text"
                value={internalValue}
                error={error}
                onChange={(ev) => setInternalValue(ev.target.value)}
                sx={{backgroundColor: 'white', width: '30rem', paddingLeft: '0.5rem'}}
                onKeyDown={(ev) => {
                    if (ev.key == 'Enter') {
                        updateValue(internalValue);
                        const tokens = Lexer.scan(internalValue);

                        const {ast, accept} = Parser.parse(tokens);

                        if (!accept) {
                            setError(true);
                        } else {
                            setError(false);
                            const printVisitor = new PrintVisitor();
    
                            ast.accept(printVisitor);
                        }
                    } else if (!/[A-Za-z0-9\(\)\-\+\*\^/\. _]/.test(ev.key)) {
                        ev.preventDefault();
                    }
                }}
            />
            <ErrorIcon style={{visibility: (error)? 'visible' : 'hidden'}}/>
        </div>
    )
}

export default EquationInput;
