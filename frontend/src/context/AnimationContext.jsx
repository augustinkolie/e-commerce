import React, { createContext, useContext, useState, useRef } from 'react';

const AnimationContext = createContext();

export const useAnimation = () => useContext(AnimationContext);

export const AnimationProvider = ({ children }) => {
    const [animations, setAnimations] = useState([]);
    const cartIconRef = useRef(null);

    const registerCartIcon = (ref) => {
        cartIconRef.current = ref;
    };

    const triggerFlyToCart = (startRect, image) => {
        if (!cartIconRef.current) return;

        const endRect = cartIconRef.current.getBoundingClientRect();

        const animationId = Date.now();
        const newAnimation = {
            id: animationId,
            startRect,
            endRect,
            image,
        };

        setAnimations((prev) => [...prev, newAnimation]);

        // Auto remove animation after completion (1.5s + buffer)
        setTimeout(() => {
            setAnimations((prev) => prev.filter((anim) => anim.id !== animationId));
        }, 1600);
    };

    return (
        <AnimationContext.Provider value={{ triggerFlyToCart, registerCartIcon, animations }}>
            {children}
        </AnimationContext.Provider>
    );
};
