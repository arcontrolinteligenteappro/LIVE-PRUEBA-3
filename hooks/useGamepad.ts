
import React, { useEffect, useState, useRef } from 'react';
import { Command } from '../components/console/CommandBus';

// This hook simulates a "HardwareMappingEngine". In a real application, this would
// be a more complex system allowing users to map any button/axis from any connected
// device (Gamepad, MIDI, etc.) to any available command in the CommandBus.
// For this simulation, we hardcode mappings for a standard gamepad.

export const useGamepad = (dispatch: (command: Command) => void): boolean => {
    const [isGamepadConnected, setIsGamepadConnected] = useState(false);
    const animationFrameRef = useRef<number>();
    const previousButtons = useRef<readonly GamepadButton[]>([]);
    const previousAxes = useRef<readonly number[]>([]);

    const handleGamepadConnected = (e: GamepadEvent) => {
        console.log('Gamepad connected:', e.gamepad.id);
        setIsGamepadConnected(true);
        previousButtons.current = e.gamepad.buttons;
        previousAxes.current = e.gamepad.axes;
        gameLoop();
    };

    const handleGamepadDisconnected = (e: GamepadEvent) => {
        console.log('Gamepad disconnected:', e.gamepad.id);
        const gamepads = navigator.getGamepads();
        if (!gamepads[0]) {
            setIsGamepadConnected(false);
        }
        
        if (animationFrameRef.current) {
            cancelAnimationFrame(animationFrameRef.current);
        }
    };

    const gameLoop = () => {
        const gamepads = navigator.getGamepads();
        if (!gamepads[0]) {
            animationFrameRef.current = requestAnimationFrame(gameLoop);
            return;
        }

        const gp = gamepads[0];
        const currentButtons = gp.buttons;
        const currentAxes = gp.axes;
        
        // --- Button Mappings (on press) ---
        if (currentButtons[0]?.pressed && !previousButtons.current[0]?.pressed) dispatch({ type: 'SWITCHER_CUT' }); // A / Cross
        if (currentButtons[1]?.pressed && !previousButtons.current[1]?.pressed) dispatch({ type: 'SWITCHER_AUTO' }); // B / Circle
        if (currentButtons[9]?.pressed && !previousButtons.current[9]?.pressed) dispatch({ type: 'MASTER_GO_LIVE' }); // Start / Options

        // --- PTZ Mappings (Analog Sticks & Triggers) ---
        const rightStickX = currentAxes[2] || 0;
        const rightStickY = currentAxes[3] || 0;
        const deadzone = 0.2;

        if (Math.abs(rightStickX) > deadzone || Math.abs(rightStickY) > deadzone) {
             console.log(`PTZ Pan/Tilt Command: X=${rightStickX.toFixed(2)}, Y=${rightStickY.toFixed(2)}`);
             // In a real app: dispatch({ type: 'PTZ_PAN_TILT', payload: { x: rightStickX, y: rightStickY } });
        }

        const zoomOutTrigger = currentButtons[6]?.value || 0; // LT
        const zoomInTrigger = currentButtons[7]?.value || 0; // RT

        if (zoomInTrigger > 0.1) {
            console.log(`PTZ Zoom In Command: Speed=${zoomInTrigger.toFixed(2)}`);
            // In a real app: dispatch({ type: 'PTZ_ZOOM', payload: { direction: 'in', speed: zoomInTrigger } });
        }
        if (zoomOutTrigger > 0.1) {
             console.log(`PTZ Zoom Out Command: Speed=${zoomOutTrigger.toFixed(2)}`);
            // In a real app: dispatch({ type: 'PTZ_ZOOM', payload: { direction: 'out', speed: zoomOutTrigger } });
        }


        previousButtons.current = currentButtons;
        previousAxes.current = currentAxes;
        animationFrameRef.current = requestAnimationFrame(gameLoop);
    };
    
    useEffect(() => {
        window.addEventListener('gamepadconnected', handleGamepadConnected);
        window.addEventListener('gamepaddisconnected', handleGamepadDisconnected);

        // Check if a gamepad is already connected
        const gamepads = navigator.getGamepads();
        if (gamepads[0]) {
             handleGamepadConnected({ gamepad: gamepads[0] } as GamepadEvent);
        }

        return () => {
            window.removeEventListener('gamepadconnected', handleGamepadConnected);
            window.removeEventListener('gamepaddisconnected', handleGamepadDisconnected);
            if (animationFrameRef.current) {
                cancelAnimationFrame(animationFrameRef.current);
            }
        };
    }, [dispatch]);

    return isGamepadConnected;
};
