import { Slider } from '@mui/material';

const InputSlider = (props) => {
    const {value, setValue, step, min, max, title} = props;

    return (
        <div>
            {title}
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
                    onChange={(ev) => setValue(ev.target.value)}
                />
                {value.toFixed(2)}
            </div>
        </div>
    )
}

export default InputSlider;
