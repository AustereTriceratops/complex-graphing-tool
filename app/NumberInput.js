import { Input } from '@mui/material';

const NumberInput = (props) => {
    const {title, value, onChange} = props;

    return (
        <div style={{
            display:'flex',
            flexDirection:'row',
            justifyContent:'center',
            gap: '1.0rem'
        }}>
            <div>
                {title}
            </div>
            <div>
                {value}
            </div>
            {/* <Input
                type='number'
                value={value}
                onChange={onChange}
                sx={{backgroundColor: 'white', paddingLeft: '5px'}}
                readOnly
            /> */}
        </div>
    )
}

export default NumberInput;
