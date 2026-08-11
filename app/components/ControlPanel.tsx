
import { useMemo, useState } from 'react';
import { Checkbox, FormControlLabel, Paper } from '@mui/material';
import ArrowLeftIcon from '@mui/icons-material/ArrowLeft';
import ArrowRightIcon from '@mui/icons-material/ArrowRight';

import './components.css';
import { InputSlider, NumberInput, NumberDisplay } from './index';
import { NumOrParam } from '../parsing/visitors/ParameterVisitor';
import { Param } from '../parsing/AST/AST';

interface ControlPanelProps {
    offsetX: number;
    setOffsetX: (offsetX: number) => void;
    offsetY: number;
    setOffsetY: (offsetY: number) => void;
    zoom: number;
    setZoom: (zoom: number) => void;
    aspect: number;
    phase: number;
    setPhase: (phase: number) => void;
    radialOffset: number;
    setRadialOffset: (radialOffset: number) => void;
    displayContours: number;
    setDisplayContours: (displayContours: number) => void;
    saturation: number;
    setSaturation: (saturation: number) => void;
    parameters: NumOrParam[];
    updateASTParameter: (index: number) => ((val: number) => void);
}

const ControlPanel = ({
        offsetX, setOffsetX, offsetY, setOffsetY, zoom, setZoom, aspect, phase, setPhase,
        radialOffset, setRadialOffset, displayContours, setDisplayContours, saturation, setSaturation,
        parameters, updateASTParameter
    }: ControlPanelProps) => {

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
                }}
                onClick={() => setHidden(!hidden)}
            >
                {hidden ? <ArrowRightIcon sx={{fontSize: "14px"}}/> : <ArrowLeftIcon/>}
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
                        setValue={setSaturation}
                        step={0.01}
                        min={0}
                        max={1.0}
                    />
                    <InputSlider
                        title="Phase"
                        value={phase}
                        setValue={setPhase}
                        step={0.005}
                        min={0}
                        max={4*Math.PI}
                    />
                    {displayContours > 0 &&
                        <InputSlider
                            title="Radial offset"
                            value={radialOffset}
                            setValue={setRadialOffset}
                            step={0.005}
                            min={0}
                            max={10}
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
                    <div style={{
                        display: 'flex', flexDirection: 'row', justifyContent: 'space-between', gap: '1rem'}}
                    >
                        <NumberDisplay
                            title="x_min:"
                            value={xMin.toFixed(4)}
                        />
                        <NumberDisplay
                            title="x_max:"
                            value={xMax.toFixed(4)}
                        />
                    </div>
                    <div style={{
                        display: 'flex', flexDirection: 'row', justifyContent: 'space-between', gap: '1rem'}}
                    >
                        <NumberDisplay
                            title="y_min:"
                            value={yMin.toFixed(4)}
                        />
                        <NumberDisplay
                            title="y_max:"
                            value={yMax.toFixed(4)}
                        />
                    </div>
                </div>
                <div className='controlPanelSection'>
                    <p className='controlPanelSectionTitle'>Equation Parameters</p>
                    { parameters.map((param, i) =>
                        <InputSlider
                            title={param instanceof Param? `${param.name}`: `parameter ${i + 1}`}
                            value={param.value}
                            setValue={updateASTParameter(i)}
                            step={0.001}
                            min={-20}
                            max={20}
                            key={i}
                        />
                    )}
                </div>
            </Paper>
        </div>
    );
};

export default ControlPanel;
