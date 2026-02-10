
import React, { useState, useRef, useEffect } from 'react';
import { es } from '../localization';

interface PTZControlsProps {
    isGamepadConnected: boolean;
}

const PTZControls: React.FC<PTZControlsProps> = ({ isGamepadConnected }) => {
    const [zoom, setZoom] = useState(50);
    const [focus, setFocus] = useState(50);
    const [iris, setIris] = useState(50);
    const [speed, setSpeed] = useState(5);
    const joystickRef = useRef<HTMLDivElement>(null);
    const knobRef = useRef<HTMLDivElement>(null);
    const [isDragging, setIsDragging] = useState(false);

    const handleJoystickMove = (clientX: number, clientY: number) => {
        if (!joystickRef.current || !knobRef.current) return;
        const rect = joystickRef.current.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        let x = clientX - centerX;
        let y = clientY - centerY;
        const maxDist = rect.width / 2 - 20;
        const dist = Math.sqrt(x*x + y*y);

        if (dist > maxDist) {
            x = (x / dist) * maxDist;
            y = (y / dist) * maxDist;
        }

        knobRef.current.style.transform = `translate(${x}px, ${y}px)`;
    };

    useEffect(() => {
        const move = (e: any) => {
            if (!isDragging) return;
            const touch = e.touches ? e.touches[0] : e;
            handleJoystickMove(touch.clientX, touch.clientY);
        };
        const end = () => {
            setIsDragging(false);
            if (knobRef.current) knobRef.current.style.transform = `translate(0px, 0px)`;
        };
        window.addEventListener('mousemove', move);
        window.addEventListener('touchmove', move, { passive: false });
        window.addEventListener('mouseup', end);
        window.addEventListener('touchend', end);
        return () => {
            window.removeEventListener('mousemove', move);
            window.removeEventListener('mouseup', end);
            window.removeEventListener('touchmove', move);
            window.removeEventListener('touchend', end);
        };
    }, [isDragging]);

    return (
        <div className="p-2 space-y-4">
            <div className="flex justify-around items-center h-40 bg-black/40 rounded-xl border border-gray-700">
                <div 
                    ref={joystickRef}
                    className="w-28 h-28 bg-gray-900 rounded-full border-4 border-gray-800 flex items-center justify-center relative touch-none"
                    onMouseDown={() => setIsDragging(true)}
                    onTouchStart={() => setIsDragging(true)}
                >
                    <div ref={knobRef} className="w-10 h-10 bg-blue-500 rounded-full shadow-lg border-2 border-white pointer-events-none transition-transform duration-75"></div>
                </div>
                
                <div className="flex flex-col items-center h-full justify-center gap-2">
                    <button className="w-10 h-10 bg-gray-700 rounded-full font-black text-lg active:bg-blue-600" onClick={() => setZoom(z => Math.min(100, z+10))}>+</button>
                    <div className="text-[10px] font-bold text-gray-500">ZOOM</div>
                    <button className="w-10 h-10 bg-gray-700 rounded-full font-black text-lg active:bg-blue-600" onClick={() => setZoom(z => Math.max(0, z-10))}>-</button>
                </div>
            </div>

            <div className="space-y-2 text-xs">
                <div>
                    <label className="font-semibold">{es.ptzFocus} ({focus}%)</label>
                    <input type="range" min="0" max="100" value={focus} onChange={e => setFocus(parseInt(e.target.value))} className="w-full h-1.5 bg-gray-600 rounded-lg appearance-none cursor-pointer" />
                </div>
                 <div>
                    <label className="font-semibold">{es.ptzIris} ({iris}%)</label>
                    <input type="range" min="0" max="100" value={iris} onChange={e => setIris(parseInt(e.target.value))} className="w-full h-1.5 bg-gray-600 rounded-lg appearance-none cursor-pointer" />
                </div>
                 <div>
                    <label className="font-semibold">{es.ptzSpeed} ({speed}/10)</label>
                    <input type="range" min="1" max="10" value={speed} onChange={e => setSpeed(parseInt(e.target.value))} className="w-full h-1.5 bg-gray-600 rounded-lg appearance-none cursor-pointer" />
                </div>
            </div>
            
            <div className="grid grid-cols-4 gap-2">
                {[1,2,3,4,5,6,7,8].map(p => (
                    <button key={p} className="p-3 bg-gray-800 border border-gray-700 rounded text-xs font-bold active:bg-blue-700">P{p}</button>
                ))}
            </div>
        </div>
    );
};

export default PTZControls;
