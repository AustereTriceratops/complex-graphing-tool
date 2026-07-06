import { useEffect, useState } from 'react';
import { Input } from '@mui/material';

const NumberInput = (props) => {
    const {title, value, updateValue, readOnly} = props;

    const [internalValue, setInternalValue] = useState(value);

    useEffect(() => {
        setInternalValue(value);
    }, [value])

    return (
        <div style={{
            display:'flex',
            flexDirection:'row',
            justifyContent:'space-between',
            gap: '1.0rem'
        }}>
            <div>
                {title}
            </div>
            <Input
                type='number'
                value={internalValue}
                onChange={(ev) => setInternalValue(ev.target.value)}
                sx={{backgroundColor: 'white', paddingLeft: '5px', maxWidth: '7rem'}}
                readOnly={readOnly}
                onKeyDown={(ev) => {
                    if (ev.key == 'Enter') {
                        updateValue(Number(internalValue));
                    }
                }}
            />
        </div>
    )
}

export default NumberInput;
