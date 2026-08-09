import { Slider } from '@mui/material';

const InputSlider = (props) => {
    const {value, setValue, step, min, max, title} = props;

    return (
        <div>
            <div style={{
                display: 'flex',
                flexDirection:'row',
                gap: '1rem',
                alignItems: 'center'
            }}>
                <div>{title}</div>
                {value.toFixed(3)}
            </div>
            <Slider
                value={value}
                step={step}
                min={min}
                max={max}
                onChange={(_, value) => setValue(value)}
            />
        </div>
    );
};

export default InputSlider;
