import { useState, useEffect, useRef } from 'react'
import { Paper, Typography, IconButton } from '@mui/material';
import InfoIcon from '@mui/icons-material/Info';

const useClickOutsideEvent = (targetRef, exceptionRef, close) => {
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                targetRef.current && !targetRef.current.contains(event.target) &&
                exceptionRef.current && !exceptionRef.current.contains(event.target)
            ) {
                close();
            }
        }

        // Bind the event listener
        document.addEventListener("mousedown", handleClickOutside);

        // cleanup
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [targetRef, exceptionRef])
}

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
                <InfoIcon
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
                width: '20rem',
            }}>
                <Typography variant="h6" sx={{fontWeight: 'bold'}}>
                    Constants
                </Typography>
                <Typography sx={{ml: 2}}>pi = 3.141592653589793</Typography>
                <Typography sx={{ml: 2}}>e = 2.718281828459045</Typography>

                <Typography variant="h6" sx={{fontWeight: 'bold'}}>Functions</Typography>
                <Typography sx={{ml: 2}}>sin(x)</Typography>
                <Typography sx={{ml: 2}}>cos(x)</Typography>
                <Typography sx={{ml: 2}}>exp(x)</Typography>
                <Typography sx={{ml: 2}}>log(x)</Typography>
                <Typography sx={{ml: 2}}>sqrt(x)</Typography>
                <Typography sx={{ml: 2}}>conj(x)</Typography>
            </Paper>
        </div>
    )
}

export default Info;