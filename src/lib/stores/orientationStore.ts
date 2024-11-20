import { readable } from 'svelte/store';

export const orientation = readable('landscape', (set) => {
    // Function to check orientation
    const checkOrientation = () => {
        const isPortrait = window.innerHeight > window.innerWidth;
        set(isPortrait ? 'portrait' : 'landscape');
    };

    // Initial check
    if (typeof window !== 'undefined') {
        checkOrientation();

        // Add event listener
        window.addEventListener('resize', checkOrientation);
    }

    // Cleanup
    return () => {
        if (typeof window !== 'undefined') {
            window.removeEventListener('resize', checkOrientation);
        }
    };
});
