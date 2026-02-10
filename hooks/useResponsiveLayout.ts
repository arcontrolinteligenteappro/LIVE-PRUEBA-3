
import { useState, useEffect } from 'react';
import { UiMode } from '../types';

const TABLET_BREAKPOINT = 1024; // lg in tailwind

export const useResponsiveLayout = (): UiMode => {
    const [uiMode, setUiMode] = useState<UiMode>(
        window.innerWidth >= TABLET_BREAKPOINT ? UiMode.STUDIO : UiMode.SINGLE
    );

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth >= TABLET_BREAKPOINT) {
                setUiMode(UiMode.STUDIO);
            } else {
                setUiMode(UiMode.SINGLE);
            }
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return uiMode;
};
