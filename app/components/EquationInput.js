import { useEffect, useState } from 'react';
import { Input } from "@mui/material";
import ErrorIcon from '@mui/icons-material/Error';

const EquationInput = (props) => {
    const {value, setEquation, error} = props;

    const [internalValue, setInternalValue] = useState(value);
    
    useEffect(() => {
        setInternalValue(value);
    }, [value])

    return (
        <div style={{display: 'flex', flexDirection: 'row', padding: '0.5rem', gap: '0.25rem', justifyContent: 'center', alignItems: 'center'}}>
            <Input
                type="text"
                value={internalValue}
                error={error}
                onChange={(ev) => setInternalValue(ev.target.value)}
                sx={{
                    backgroundColor: 'white',
                    opacity: 0.6,
                    width: '50rem',
                    height: '3rem',
                    paddingLeft: '0.5rem',
                    borderRadius: '8px',
                    ":hover": {
                        opacity: 1.0
                    }
                }}
                onKeyDown={(ev) => {
                    if (ev.key == 'Enter') {
                        setEquation(internalValue)
                    } else if (!/[A-Za-z0-9\(\)\-\+\*\^/\.| _]/.test(ev.key)) {
                        ev.preventDefault();
                    }
                }}
            />
            <ErrorIcon style={{visibility: (error)? 'visible' : 'hidden'}}/>
        </div>
    )
}

export default EquationInput;
