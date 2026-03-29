"use client"; // allows next.js to use useState, useRef, etc.

import React, {useEffect, useRef} from 'react';
import glManager from './glManager';

const App = () => {
    const canvasRef = useRef(null);
    const programRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;

        if (canvas) {
            programRef.current = new glManager(canvas);
            programRef.current.render();
        }
    })

    return (
        <div>
            <p>Hello :)</p>
            <canvas ref={canvasRef}/>
        </div>
    )
}

export default App;
