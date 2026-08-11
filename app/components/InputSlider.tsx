import { Slider } from '@mui/material';

interface InputSliderProps {
    title: string;
    value: number;
    setValue:  (val: number) => void;
    step: number;
    min: number;
    max: number;
}

const InputSlider = ({
    title, value, setValue, step, min, max
}: InputSliderProps) => {
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
