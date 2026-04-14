import { useEffect, useState } from 'react';
import { Input } from "@mui/material";
import Lexer from '../parsing/Lexer';

const EquationInput = (props) => {
    const {value, updateValue} = props;

    const [internalValue, setInternalValue] = useState(value);
    
    useEffect(() => {
        setInternalValue(value);
    }, [value])

    return (
        <div style={{display: 'flex', padding: '0.5rem', justifyContent: 'center'}}>
            <Input
                type="text"
                value={internalValue}
                onChange={(ev) => setInternalValue(ev.target.value)}
                sx={{backgroundColor: 'white', width: '30rem', paddingLeft: '0.5rem'}}
                onKeyDown={(ev) => {
                    if (ev.key == 'Enter') {
                        updateValue(internalValue);
                        const tokens = Lexer.scan(internalValue);
                        console.log(tokens.map((t) => t.name));
                        console.log(tokens.map((t) => t.value));
                    } else if (!/[A-Za-z0-9\(\)\-\+\*\^/\. _]/.test(ev.key)) {
                        ev.preventDefault();
                    }
                }}
            />
        </div>
    )
}

export default EquationInput;
