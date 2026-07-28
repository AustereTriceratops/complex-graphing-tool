import { useState, useEffect, useRef } from 'react';
import katex from 'katex';
import "katex/dist/katex.min.css";
import { Paper, Typography } from '@mui/material';
import HelpIcon from '@mui/icons-material/Help';

const useClickOutsideEvent = (targetRef, exceptionRef, close) => {
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                targetRef.current && !targetRef.current.contains(event.target) &&
                exceptionRef.current && !exceptionRef.current.contains(event.target)
            ) {
                close();
            }
        };

        // Bind the event listener
        document.addEventListener("mousedown", handleClickOutside);

        // cleanup
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [targetRef, exceptionRef]);
};

const Info = () => {
    const [panelIsVisible, setPanelIsVisible] = useState(false);

    const paperRef = useRef();
    const controlRef = useRef();
    useClickOutsideEvent(paperRef, controlRef, () => setPanelIsVisible(false));

    return (
        <div style={{ position: 'relative' }}>
            <div ref={controlRef} onClick={() => {
                setPanelIsVisible(!panelIsVisible);
            }}>
                <HelpIcon
                    sx={{
                        cursor: 'pointer',
                        opacity: '0.8',
                        fontSize: '2rem',
                        ":hover": {opacity: '1.0'}
                    }}
                />
            </div>
            <Paper ref={paperRef} elevation={4} sx={{
                visibility: panelIsVisible ? 'visible' : 'hidden',
                position: 'absolute',
                right: 0,
                top: '3rem',
                padding: '0.5rem',
                background: '#555',
                color: 'white',
                width: '30rem',
            }}>
                <Typography variant="h6" sx={{fontWeight: 'bold'}}>Constants</Typography>
                <div style={{marginLeft: '1rem'}}
                    dangerouslySetInnerHTML={{
                        __html: katex.renderToString("pi = 3.141592653589793"),
                    }}
                />
                <div style={{marginLeft: '1rem'}}
                    dangerouslySetInnerHTML={{
                        __html: katex.renderToString("e = 2.718281828459045"),
                    }}
                />

                <Typography variant="h6" sx={{fontWeight: 'bold'}}>Functions</Typography>
                <div style={{marginLeft: '1rem'}}
                    dangerouslySetInnerHTML={{
                        __html: katex.renderToString("sin(x)"),
                    }}
                />
                <div style={{marginLeft: '1rem'}}
                    dangerouslySetInnerHTML={{
                        __html: katex.renderToString("cos(x)"),
                    }}
                />
                <div style={{marginLeft: '1rem'}}
                    dangerouslySetInnerHTML={{
                        __html: katex.renderToString("\\text{exp(x)} \\hspace{2cm} e^x"),
                    }}
                />
                <div style={{marginLeft: '1rem'}}
                    dangerouslySetInnerHTML={{
                        __html: katex.renderToString("\\text{log(x)} \\hspace{2.1cm} ln(x)"),
                    }}
                />
                <div style={{marginLeft: '1rem'}}
                    dangerouslySetInnerHTML={{
                        __html: katex.renderToString("\\text{sqrt(x)} \\hspace{1.9cm} \\sqrt{x}"),
                    }}
                />
                <div style={{marginLeft: '1rem'}}
                    dangerouslySetInnerHTML={{
                        __html: katex.renderToString(`\\text{conj(x)} \\hspace{1.8cm} \\text{complex conjugation}`),
                    }}
                />
                <div style={{marginLeft: '1rem'}}
                    dangerouslySetInnerHTML={{
                        __html: katex.renderToString(`\\text{dedekind\\_eta(x)} \\hspace{0.5cm} \\eta(x) = x^{1/24} \\prod_{n=1}^\\infty (1 - x^n)`),
                    }}
                />
            </Paper>
        </div>
    );
};

export default Info;