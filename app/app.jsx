"use client"; // allows next.js to use useState, useRef, etc.

import React, { useEffect, useMemo, useRef, useState } from 'react';

import glManager from './shader/glManager';
import InputSlider from './InputSlider';
import NumberInput from './NumberInput';

const App = () => {
    //
    // CANVAS AND SHADER SETUP
    //
    const canvasRef = useRef(null);
    const programRef = useRef(null);

    const [canvasWidth, setCanvasWidth] = useState(0);
    const [canvasHeight, setCanvasHeight] = useState(0);

    useEffect(() => {
        const canvas = canvasRef.current;

        if (canvas) {
            programRef.current = new glManager(canvas);

            setCanvasWidth(canvas.width);
            setCanvasHeight(canvas.height);
        }
    }, [])

    const aspect = useMemo(() => {
        return canvasHeight/canvasWidth;
    }, [canvasWidth, canvasHeight])

    //
    // INTERACTIVITY
    //

    // dragging
    const [isDragging, setIsDragging] = useState(false);

    const onMouseDown = () => {
        setIsDragging(true);
    }

    const onMouseUp = () => {
        setIsDragging(false);
    }

    // zoom
    const [zoom, setZoom] = useState(1);

    const onScroll = (ev) => {
        setZoom(zoom + 0.002 * zoom * ev.deltaY);
    }

    // mouse movement
    const [mouseX, setMouseX] = useState(0);
    const [mouseY, setMouseY] = useState(0);
    const [offsetX, setOffsetX] = useState(0);
    const [offsetY, setOffsetY] = useState(0);
    
    const onMouseMove = (ev) => {
        // (0,0) at top left, increasing rightwards and downwards to (canvasWidth, canvasHeight)
        const bounds = canvasRef.current.getBoundingClientRect();
        setMouseX(ev.clientX - bounds.left);
        setMouseY(ev.clientY - bounds.top);

        if (isDragging) {
            setOffsetX(offsetX - 2 * zoom * ev.movementX/canvasWidth);
            setOffsetY(offsetY + 2 * zoom * ev.movementY/canvasHeight);
        }
    }

    const xMin = useMemo(() => {
        const xMin = (aspect < 1) ? offsetX - zoom/aspect : offsetX - zoom;
        
        return xMin
    }, [zoom, aspect, offsetX]);

    //
    // SHADER CONTROLS
    //
    const [shaderParameter1, setShaderParameter1] = useState(0.3);
    const [shaderParameter2, setShaderParameter2] = useState(0);

    //
    // CANVAS RE-RENDERING
    //
    useEffect(() => {
        programRef.current.render(zoom, offsetX, offsetY, shaderParameter1, shaderParameter2)
    }, [zoom, offsetX, offsetY, shaderParameter1, shaderParameter2]);

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
                    <p style={{fontSize: '18px', fontWeight: '600'}}>Graph info</p>
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
                    onMouseDown={onMouseDown}
                    onMouseUp={onMouseUp}
                    onMouseMove={onMouseMove}
                    onWheel={onScroll}
                />
            </div>
        </div>
    )
}

export default App;
