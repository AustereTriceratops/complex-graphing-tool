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
            <p>y = x^4</p>
            <canvas
                ref={canvasRef}
                width={1000}
                height={600}
            />
        </div>
    )
}

export default App;
