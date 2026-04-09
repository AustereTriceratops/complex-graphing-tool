import { Input } from '@mui/material';

const NumberInput = (props) => {
    const {title, value, onChange} = props;

    return (
        <div style={{
            display:'flex',
            flexDirection:'row',
            gap: '0.5rem'
        }}>
            <div>
                {title}
            </div>
            <Input
                type='number'
                value={value}
                onChange={onChange}
                style={{backgroundColor: 'white', paddingLeft: '5px',}}
                readOnly
            />
        </div>
    )
}

export default NumberInput;
