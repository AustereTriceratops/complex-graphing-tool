import { Slider } from '@mui/material';

const InputSlider = (props) => {
    const {value, setValue, step, min, max, title} = props;

    return (
        <div>
            <div>{title}</div>
            <div style={{
                display: 'flex',
                flexDirection:'row',
                gap: '1rem',
                alignItems: 'center'
            }}>
                <Slider
                    value={value}
                    step={step}
                    min={min}
                    max={max}
                    onChange={(_, value) => setValue(value)}
                    sx={{minWidth: '200px', maxWidth: '200px'}}
                />
                {value.toFixed(2)}
            </div>
        </div>
    );
};

export default InputSlider;
