import { useEffect, useRef } from "react";

// Calls `onOutside` on mousedown outside the returned ref, or on Escape, while `active`.
export const useClickOutside = (onOutside, active = true) => {
    const ref = useRef(null);

    useEffect(() => {
        if (!active) return undefined;
        const handleMouseDown = (e) => {
            if (ref.current && !ref.current.contains(e.target)) onOutside();
        };
        const handleKey = (e) => {
            if (e.key === "Escape") onOutside();
        };
        document.addEventListener("mousedown", handleMouseDown);
        document.addEventListener("keydown", handleKey);
        return () => {
            document.removeEventListener("mousedown", handleMouseDown);
            document.removeEventListener("keydown", handleKey);
        };
    }, [onOutside, active]);

    return ref;
};
