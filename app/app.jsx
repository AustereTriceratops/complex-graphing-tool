"use client"; // allows next.js to use useState, useRef, etc.

import React, { useEffect, useRef, useState } from 'react';

import glManager from './shader/glManager';
import InputSlider from './InputSlider';

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
    const [shaderParameter2, setShaderParameter2] = useState(0);

    useEffect(() => {
        programRef.current.render(shaderParameter1, shaderParameter2)
    }, [shaderParameter1, shaderParameter2])

    // SHADER RE-RENDERING

    return (
        <div>
            <p>y = x^4 - 1</p>
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
                    <InputSlider
                        value={shaderParameter1}
                        step={0.01}
                        min={0}
                        max={0.5}
                        setValue={setShaderParameter1}
                    />
                    <InputSlider
                        value={shaderParameter2}
                        step={0.01}
                        min={0}
                        max={4*Math.PI}
                        setValue={setShaderParameter2}
                    />
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
