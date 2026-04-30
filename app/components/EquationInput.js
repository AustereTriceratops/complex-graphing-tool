import { useEffect, useState } from 'react';
import { Input, Checkbox } from "@mui/material";
import ErrorIcon from '@mui/icons-material/Error';

import Lexer from '../parsing/Lexer';
import Parser from '../parsing/Parser';
import PrintVisitor from '../parsing/AST/PrintVisitor';

const function_source_1 = `
vec2 function(vec2 x) {
  vec2 y = c_pow(x, 5.0) - vec2(1.0, 0.0);

  return y;
}
`

const function_source_2 = `
vec2 function(vec2 x) {
  vec2 y = c_pow(x, 3.0) - vec2(0.0, 1.0);

  return y;
}
`

const EquationInput = (props) => {
    const {value, updateValue, updateShader} = props;

    const [internalValue, setInternalValue] = useState(value);
    
    useEffect(() => {
        setInternalValue(value);
    }, [value])

    // error reporting
    const [error, setError] = useState(false);

    // dev
    const [testFn, setTestFn] = useState(false);

    return (
        <div style={{display: 'flex', flexDirection: 'row', padding: '0.5rem', gap: '0.25rem', justifyContent: 'center', alignItems: 'center'}}>
            <Checkbox 
                style={{background: 'white'}}
                onChange={() => {
                    setTestFn(!testFn);

                    if (testFn) {
                        updateShader(function_source_1);
                    } else {
                        updateShader(function_source_2);
                    }
                }}
            />
            <Input
                type="text"
                value={internalValue}
                error={error}
                onChange={(ev) => setInternalValue(ev.target.value)}
                sx={{backgroundColor: 'white', width: '30rem', paddingLeft: '0.5rem'}}
                onKeyDown={(ev) => {
                    if (ev.key == 'Enter') {
                        const tokens = Lexer.scan(internalValue);
                        
                        const {ast, accept} = Parser.parse(tokens);
                        
                        if (!accept) {
                            setError(true);
                        } else {
                            updateValue(internalValue);
                            setError(false);
                            const printVisitor = new PrintVisitor();
                            // const GLSLVisitor = new GLSLVisitor();  TODO: implement
    
                            ast.accept(printVisitor);
                            // function_source = ast.accept(GLSLVisitor);
                            // updateShader(function_source);
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
