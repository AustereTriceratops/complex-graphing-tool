"use client"; // allows next.js to use useState, useRef, etc.

import { useEffect, useMemo, useRef, useState } from 'react';

import glManager from './shader/glManager';
import { EquationInput, ControlPanel } from './components';
import { createFragmentShader } from './shader/shaders';
import Parser from './parsing/Parser';
import { GLSLVisitor, EquationVisitor, ParameterVisitor } from './parsing/visitors';

const App = () => {
    //
    // CANVAS AND SHADER STATE
    //
    const canvasRef = useRef(null);
    const programRef = useRef(null);

    const [canvasWidth, setCanvasWidth] = useState(1);
    const [canvasHeight, setCanvasHeight] = useState(0);
    const [windowWidth, setWindowWidth] = useState(100);
    const [windowHeight, setWindowHeight] = useState(100);

    const aspect = useMemo(() => {
        return canvasHeight/canvasWidth;
    }, [canvasWidth, canvasHeight]);


    ///
    /// INITIALIZE CANVAS
    ///
    useEffect(() => {const canvas = canvasRef.current;

        setWindowWidth(window.innerWidth);
        setWindowHeight(window.innerHeight);

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
            });

            observer.observe(canvas);

            // cleanup
            return () => observer.disconnect();
        }
    }, []);

    useEffect(() => {
        const canvas = canvasRef.current;

        if (canvas) {
            programRef.current.updateDims(canvas);
        }
    }, [windowWidth, windowHeight]);


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
        const dZoom = 0.002 * zoom * ev.deltaY;
        setZoom(zoom + dZoom);

        const biasX = mouseX/canvasWidth;
        const biasY = mouseY/canvasHeight;
        setOffsetX(offsetX - (2.0 * biasX - 1) * dZoom);
        setOffsetY(offsetY + (2.0 * biasY - 1) * dZoom);
    };

    // dragging
    const [isDragging, setIsDragging] = useState(false);

    const onMouseDown = () => {
        setIsDragging(true);
    };

    const onMouseUp = () => {
        setIsDragging(false);
    };
    
    const onMouseMove = (ev) => {
        // (0,0) at top left, increasing rightwards and downwards to (canvasWidth, canvasHeight)
        const bounds = canvasRef.current.getBoundingClientRect();
        setMouseX(ev.clientX - bounds.left);
        setMouseY(ev.clientY - bounds.top);

        if (isDragging) {
            setOffsetX(offsetX - 2 * zoom * ev.movementX/canvasWidth);
            setOffsetY(offsetY + 2 * zoom * ev.movementY/canvasHeight);
        }
    };


    //
    // EQUATION INPUT
    //
    const [equation, setEquation] = useState('');
    const [error, setError] = useState(false);
    
    const astRef = useRef(null);
    const [astVer, setAstVer] = useState(0);
    const [parameters, setParameters] = useState([]);

    const updateEquation = (eq) => {
        setEquation(eq);
                        
        const newAST= Parser.parse(eq);
        
        if (!newAST.valid) {
            setError(true);
        } else {
            astRef.current = newAST;
            updateAST();
            gatherASTParameters();
            setError(false);
        }
    };

    const updateAST = () => {
        if (astRef.current != undefined) {
            const visitor = new GLSLVisitor();
            const function_source = astRef.current.accept(visitor);
            const fragmentShader = createFragmentShader(function_source);
            // console.log(function_source)
            
            // printEquationFromAST(astRef.current)

            // const printVisitor = new PrintVisitor();
            // astRef.current.accept(printVisitor);

            const glManager = programRef.current;
    
            if (glManager) {
                glManager.updateFragmentShader(fragmentShader);
            }

            setAstVer(astVer + 1);
        }
    };

    const gatherASTParameters = () => {
        const parameterVisitor = new ParameterVisitor();
        astRef.current.accept(parameterVisitor);
        const params = parameterVisitor.parameters;
        setParameters(params);
    };

    const updateASTParameter = (index) => {
        return (newVal) => {
            parameters.forEach((param, j) => {
                if (index == j) {
                    param.value = newVal;
                    return param;
                } else {
                    return param;
                }
            });

            updateAST();

            // update equation on the displayed equation input field
            const equationVisitor = new EquationVisitor();
            const equationString = astRef.current.accept(equationVisitor);
            setEquation(equationString);
        };
    };

    useEffect(() => {
        // updateEquation('dedekind_eta(x)');
        updateEquation("x^11 - 3x^8 + 2x^4 - 6x^3 + 1x^2 + 2x + 0.5");
    }, []);


    //
    // SHADER CONTROLS
    //
    const [saturation, setSaturation] = useState(0.6);
    const [phase, setPhase] = useState(0);
    const [radialOffset, setRadialOffset] = useState(0);
    const [displayContours, setDisplayContours] = useState(1);


    //
    // CANVAS RE-RENDERING
    //
    useEffect(() => {
        programRef.current.render(zoom, offsetX, offsetY, saturation, phase, radialOffset, displayContours);
    }, [zoom, offsetX, offsetY, saturation, phase, radialOffset, displayContours, canvasWidth, canvasHeight, astVer]);

    return (
        <div style={{
            display: 'flex',
            flexDirection: 'row',
            gap: '5px',
            overflow: 'hidden',
            maxHeight: '100vh'
        }}>
            <ControlPanel
                offsetX={offsetX}
                setOffsetX={setOffsetX}
                offsetY={offsetY}
                setOffsetY={setOffsetY}
                zoom={zoom}
                setZoom={setZoom}
                aspect={aspect}
                phase={phase}
                setPhase={setPhase}
                radialOffset={radialOffset}
                setRadialOffset={setRadialOffset}
                displayContours={displayContours}
                setDisplayContours={setDisplayContours}
                saturation={saturation}
                setSaturation={setSaturation}
                parameters={parameters}
                updateASTParameter={updateASTParameter}
            />
            <div style={{position: 'fixed', top:'0.2rem', right:'15vw'}}>
                <EquationInput
                    value={equation}
                    setEquation={updateEquation}
                    error={error}
                />
            </div>
            <canvas
            style={{cursor: 'pointer'}}
                ref={canvasRef}
                width={windowWidth}
                height={windowHeight}
                onMouseDown={onMouseDown}
                onMouseUp={onMouseUp}
                onMouseMove={onMouseMove}
                onWheel={onScroll}
            />
        </div>
    );
};

export default App;
