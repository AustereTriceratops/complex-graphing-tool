"use client"; // allows next.js to use useState, useRef, etc.

import React, { useEffect, useRef, useState } from 'react';

import glManager from './shader/glManager';
import InputSlider from './InputSlider';
import NumberInput from './NumberInput';

const App = () => {
    // INTERACTIVITY
    
    const [aspect, setAspect] = useState(0);
    const [xMin, setXMin] = useState(0);

    const [zoom, setZoom] = useState(1)

    const onScroll = (ev) => {
        setZoom(zoom + 0.001 * zoom * ev.deltaY);
        console.log(zoom)
    }

    // CANVAS AND SHADER SETUP
    const canvasRef = useRef(null);
    const programRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;

        if (canvas) {
            programRef.current = new glManager(canvas);

            const aspect = canvas.height/canvas.width;
            setAspect(aspect);
            setXMin(-aspect); //TODO: this is incorrect
        }
    }, [])

    // SHADER CONTROLS
    const [shaderParameter1, setShaderParameter1] = useState(0.3);
    const [shaderParameter2, setShaderParameter2] = useState(0);

    // RENDER THE CANVAS

    useEffect(() => {
        programRef.current.render(zoom, shaderParameter1, shaderParameter2)
    }, [zoom, shaderParameter1, shaderParameter2]);

    return (
        <div>
            <p>Eisenstein series E_4</p>
            <div style={{
                display: 'flex',
                flexDirection: 'row',
                gap: '5px'
            }}>
                <div style={{
                    display:'flex',
                    flexDirection:'column',
                    padding: '1rem',
                    width: '15%vw',
                    gap: '5px'
                }}>
                    <p style={{fontSize: '18px', fontWeight: '600'}}>Display options</p>
                    <InputSlider
                        title="Color intensity"
                        value={shaderParameter1}
                        step={0.01}
                        min={0}
                        max={0.5}
                        setValue={setShaderParameter1}
                    />
                    <InputSlider
                        title="Phase"
                        value={shaderParameter2}
                        step={0.01}
                        min={0}
                        max={4*Math.PI}
                        setValue={setShaderParameter2}
                    />
                    <NumberInput
                        title="x_min"
                        value={xMin.toFixed(5)}
                        onChange={(ev) => setXMin(ev.target.value)}
                    />
                </div>
                <canvas
                    ref={canvasRef}
                    width={0.85*window.innerWidth}
                    height={0.95*window.innerHeight}
                    onWheel={onScroll}
                />
            </div>
        </div>
    )
}

export default App;
