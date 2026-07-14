
import { useMemo } from 'react';
import { Checkbox, FormControlLabel } from '@mui/material';


import { InputSlider, NumberInput, NumberDisplay } from './index';

const ControlPanel = (props) => {
    const {
        offsetX, setOffsetX, offsetY, setOffsetY, zoom, setZoom, aspect, phase, setPhase,
        radialOffset, setRadialOffset, displayContours, setDisplayContours, saturation, setSaturation,
        parameters, setParameters
    } = props;

    const xMin = useMemo(() => {
        const xMin = (aspect < 1) ? offsetX - zoom/aspect : offsetX - zoom;
        
        return xMin;
    }, [zoom, aspect, offsetX]);

    const xMax = useMemo(() => {
        const xMax = (aspect < 1) ? offsetX + zoom/aspect : offsetX + zoom;
        
        return xMax;
    }, [zoom, aspect, offsetX]);

    const yMin = useMemo(() => {
        const yMin = (aspect < 1) ? offsetY - zoom : offsetY - zoom/aspect;
        
        return yMin;
    }, [zoom, aspect, offsetY]);

    const yMax = useMemo(() => {
        const yMax = (aspect < 1) ? offsetY + zoom : offsetY + zoom/aspect;
        
        return yMax;
    }, [zoom, aspect, offsetY]);

    return (
        <div style={{
            display:'flex',
            flexDirection:'column',
            padding: '1rem',
            minWidth: '20%',
            gap: '5px'
        }}>
            <p style={{fontSize: '18px', fontWeight: '600'}}>Equation Parameters</p>
            { (parameters.length > 0) &&
                <InputSlider
                    title={`parameter 1`}
                    value={parameters[0].value}
                    step={0.01}
                    min={-100}
                    max={100}
                    setValue={
                        (newVal) => {
                            parameters.forEach((param, j) => {
                                if (j == 0) {
                                    param.value = newVal
                                }
                            });
                            
                            setParameters(parameters);
                        }
                    }
                />
            }
            <p style={{fontSize: '18px', fontWeight: '600'}}>Display options</p>
            <FormControlLabel control={
                <Checkbox
                    checked={displayContours > 0}
                    onChange = {() => setDisplayContours(1 - displayContours)}
                />}
                label='Show contour lines'
            />
            <InputSlider
                title="Saturation"
                value={saturation}
                step={0.01}
                min={0}
                max={0.5}
                setValue={setSaturation}
            />
            <InputSlider
                title="Phase"
                value={phase}
                step={0.005}
                min={0}
                max={4*Math.PI}
                setValue={setPhase}
            />
            <InputSlider
                title="Radial offset"
                value={radialOffset}
                step={0.005}
                min={0}
                max={10}
                setValue={setRadialOffset}
            />
            <p style={{fontSize: '18px', fontWeight: '600'}}>Graph info</p>
            <NumberInput
                title="zoom"
                value={zoom.toFixed(5)}
                updateValue={setZoom}
            />
            <NumberInput
                title="offset_x"
                value={offsetX.toFixed(5)}
                updateValue={setOffsetX}
                />
            <NumberInput
                title="offset_y"
                value={offsetY.toFixed(5)}
                updateValue={setOffsetY}
            />
            <NumberDisplay
                title="x_min"
                value={xMin.toFixed(5)}
            />
            <NumberDisplay
                title="x_max"
                value={xMax.toFixed(5)}
            />
            <NumberDisplay
                title="y_min"
                value={yMin.toFixed(5)}
            />
            <NumberDisplay
                title="y_max"
                value={yMax.toFixed(5)}
            />
        </div>
    )
}

export default ControlPanel;
