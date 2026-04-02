"use client"; // allows next.js to use useState, useRef, etc.

import React, { useEffect, useRef, useState } from 'react';
import glManager from './shader/glManager';
import { Slider } from '@mui/material';

const App = () => {
    // CANVAS AND SHADER SETUP
    const canvasRef = useRef(null);
    const programRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;

        if (canvas) {
            programRef.current = new glManager(canvas);
        }
    })

    // SHADER CONTROLS
    const [shaderParameter1, setShaderParameter1] = useState(0.3);

    useEffect(() => {
        programRef.current.render(shaderParameter1)
    }, [shaderParameter1])

    // SHADER RE-RENDERING

    return (
        <div>
            <p>y = x^4</p>
            <div style={{
                display: 'flex',
                flexDirection: 'row',
                gap: '5px'
            }}>
                <div style={{
                    padding: '1rem',
                    width: '200px'
                }}>
                    Display options
                    <div style={{
                        display: 'flex',
                        flexDirection:'row',
                        gap: '1rem',
                        alignItems: 'center'
                    }}>
                        <Slider
                            value={shaderParameter1}
                            step={0.01}
                            min={0}
                            max={0.5}
                            onChange={(ev) => setShaderParameter1(ev.target.value)}
                        />
                        {shaderParameter1}
                    </div>
                </div>
                <canvas
                    ref={canvasRef}
                    width={1000}
                    height={600}
                />
            </div>
        </div>
    )
}

export default App;
