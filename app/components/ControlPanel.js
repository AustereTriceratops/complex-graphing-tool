
import { useMemo, useState } from 'react';
import { Checkbox, FormControlLabel, Paper } from '@mui/material';
import ArrowLeftIcon from '@mui/icons-material/ArrowLeft';
import ArrowRightIcon from '@mui/icons-material/ArrowRight';

import './components.css';
import { InputSlider, NumberInput, NumberDisplay } from './index';

const ControlPanel = (props) => {
    const {
        offsetX, setOffsetX, offsetY, setOffsetY, zoom, setZoom, aspect, phase, setPhase,
        radialOffset, setRadialOffset, displayContours, setDisplayContours, saturation, setSaturation,
        parameters, updateASTParameter
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

    const [hidden, setHidden] = useState(false);

    return (
        <div style={{
            display:'flex',
            flexDirection:'row',
            position:'absolute',
        }}>
            <Paper 
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    background: '#ddd',
                    cursor: 'pointer',
                    opacity: 0.6,
                    minHeight: '200px',
                }}
                onClick={() => setHidden(!hidden)}
            >
                {hidden ? <ArrowRightIcon/> : <ArrowLeftIcon/>}
            </Paper>
            <Paper sx={{
                visibility: hidden ? 'hidden' : 'visible',
                display: 'flex',
                flexDirection:'column',
                overflow: 'auto',
                padding: '1rem',
                maxHeight: '100vh',
                minWidth: '320px',
                maxWidth: '320px',
                gap: '2rem',
                background: '#444',
                color: '#fff',
                opacity: 0.4,
                ":hover": {opacity: '0.9'},
            }}>
                <div className='controlPanelSection'>
                    <p className='controlPanelSectionTitle'>Display options</p>
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
                        max={1.0}
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
                    {displayContours > 0 &&
                        <InputSlider
                            title="Radial offset"
                            value={radialOffset}
                            step={0.005}
                            min={0}
                            max={10}
                            setValue={setRadialOffset}
                        />
                    }
                </div>
                <div className='controlPanelSection'>
                    <p className='controlPanelSectionTitle'>Graph info</p>
                    <NumberInput
                        title="zoom"
                        value={zoom.toFixed(4)}
                        updateValue={setZoom}
                    />
                    <NumberInput
                        title="offset_x"
                        value={offsetX.toFixed(4)}
                        updateValue={setOffsetX}
                        />
                    <NumberInput
                        title="offset_y"
                        value={offsetY.toFixed(4)}
                        updateValue={setOffsetY}
                    />
                    <div style={{display: 'flex', flexDirection: 'row', gap: '1rem'}}>
                        <NumberDisplay
                            title="x_min:"
                            value={xMin.toFixed(4)}
                        />
                        <NumberDisplay
                            title="x_max:"
                            value={xMax.toFixed(4)}
                        />
                    </div>
                    <div style={{display: 'flex', flexDirection: 'row', gap: '1rem'}}>
                        <NumberDisplay
                            title="y_min"
                            value={yMin.toFixed(4)}
                        />
                        <NumberDisplay
                            title="y_max"
                            value={yMax.toFixed(4)}
                        />
                    </div>
                </div>
                <div className='controlPanelSection'>
                    <p className='controlPanelSectionTitle'>Equation Parameters</p>
                    { parameters.map((param, i) =>
                        <InputSlider
                            key={i}
                            title={`parameter ${i + 1}`}
                            value={param.value}
                            step={0.01}
                            min={-20}
                            max={20}
                            setValue={updateASTParameter(i)}
                        />
                    )}
                </div>
            </Paper>
        </div>
    );
};

export default ControlPanel;
