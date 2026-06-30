"use client"; // allows next.js to use useState, useRef, etc.

import { useEffect, useMemo, useRef, useState } from 'react';

import glManager from './shader/glManager';
import {InputSlider, NumberInput, NumberDisplay, EquationInput} from './components';
import { createFragmentShader } from './shader/shaders';
import Parser from './parsing/Parser';
import Lexer from './parsing/Lexer';
import {GLSLVisitor, EquationVisitor} from './parsing/visitors';


const App = () => {
    //
    // CANVAS AND SHADER STATE
    //
    const canvasRef = useRef(null);
    const programRef = useRef(null);

    const [canvasWidth, setCanvasWidth] = useState(0);
    const [canvasHeight, setCanvasHeight] = useState(0);

    const aspect = useMemo(() => {
        return canvasHeight/canvasWidth;
    }, [canvasWidth, canvasHeight])

    ///
    /// INITIALIZE CANVAS
    ///
    useEffect(() => {
        const canvas = canvasRef.current;

        if (canvas) {
            programRef.current = new glManager(canvas);

            setCanvasWidth(canvas.width);
            setCanvasHeight(canvas.height);

            const observer = new ResizeObserver((entries) => {
                for (const entry of entries) {
                    const {width, height} = entry.contentRect;
                    setCanvasWidth(width);
                    setCanvasHeight(height);
                    programRef.current.updateDims(canvas);
                }
            })

            observer.observe(canvas);

            // cleanup
            return () => observer.disconnect();
        }
    }, [])

    //
    // INTERACTIVITY
    //
    const [mouseX, setMouseX] = useState(0);
    const [mouseY, setMouseY] = useState(0);
    
    // zoom & offset
    const [zoom, setZoom] = useState(1.5);
    const [offsetX, setOffsetX] = useState(0);
    const [offsetY, setOffsetY] = useState(0);

    const onScroll = (ev) => {
        const dZoom = 0.002 * zoom * ev.deltaY
        setZoom(zoom + dZoom);

        const biasX = mouseX/canvasWidth;
        const biasY = mouseY/canvasHeight;
        setOffsetX(offsetX - (2.0 * biasX - 1) * dZoom);
        setOffsetY(offsetY + (2.0 * biasY - 1) * dZoom);
    }

    // dragging
    const [isDragging, setIsDragging] = useState(false);

    const onMouseDown = () => {
        setIsDragging(true);
    }

    const onMouseUp = () => {
        setIsDragging(false);
    }
    
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

    //
    // EQUATION INPUT
    //
    const [equation, setEquation] = useState('')
    const [ast, setAst] = useState(undefined);
    const [error, setError] = useState(false);

    const updateEquation = (eq) => {
        console.log('updating equation')
        setEquation(eq)
        const tokens = Lexer.scan(eq);
                        
        const {ast, accept} = Parser.parse(tokens);
        
        if (!accept) {
            setError(true);
        } else {
            updateAST(ast);
            setError(false);
        }
    }

    const updateAST = (ast) => {
        if (ast != undefined) {
            const visitor = new GLSLVisitor();
            const function_source = ast.accept(visitor);
            const fragmentShader = createFragmentShader(function_source)
            // console.log(function_source)
            
            const equationVisitor = new EquationVisitor();
            const equationString = ast.accept(equationVisitor);
            console.log(equationString)

            // const printVisitor = new PrintVisitor();
            // ast.accept(printVisitor);

            const glManager = programRef.current;
    
            if (glManager) {
                glManager.updateFragmentShader(fragmentShader)
            }

            setAst(ast);
        }
    };

    useEffect(() => {
        updateEquation("x^11 - 3x^8 + 2x^4 - 6x^3 + 1x^2 + 2x + 0.5");
    }, [])

    ///
    /// EQUATION CONTROLS
    ///
    const [equationParameter1, setEquationParameter1] = useState(0)
    // const [equationParameter2, setEquationParameter2] = useState(0)
    // const [equationParameter3, setEquationParameter3] = useState(0)
    // const [equationParameter4, setEquationParameter4] = useState(0)

    //
    // SHADER CONTROLS
    //
    const [saturation, setSaturation] = useState(0.3);
    const [phase, setPhase] = useState(0);
    const [radialOffset, setRadialOffset] = useState(0);

    //
    // CANVAS RE-RENDERING
    //
    useEffect(() => {
        programRef.current.render(zoom, offsetX, offsetY, saturation, phase, radialOffset)
    }, [zoom, offsetX, offsetY, saturation, phase, radialOffset, canvasWidth, canvasHeight, ast]);

    return (
        <div style={{
            display: 'flex',
            flexDirection: 'row',
            gap: '5px'
        }}>
            <div style={{position: 'fixed', top:'0.2rem', right:'10%'}}>
                <EquationInput
                    value={equation}
                    setEquation={updateEquation}
                    error={error}
                />
            </div>
            <div style={{
                display:'flex',
                flexDirection:'column',
                padding: '1rem',
                minWidth: '20%',
                gap: '5px'
            }}>
                <p style={{fontSize: '18px', fontWeight: '600'}}>Equation Parameters</p>
                <InputSlider
                    title="parameter 1"
                    value={equationParameter1}
                    step={0.01}
                    min={-10}
                    max={10}
                    setValue={setEquationParameter1}
                />
                <p style={{fontSize: '18px', fontWeight: '600'}}>Display options</p>
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
    )
}

export default App;
