import React from 'react';
import { useAnimation } from '../context/AnimationContext';

const FlyToCartLayer = () => {
    const { animations } = useAnimation();

    if (animations.length === 0) return null;

    return (
        <div className="fixed inset-0 pointer-events-none z-[9999] overflow-hidden">
            {animations.map((anim) => (
                <div
                    key={anim.id}
                    className="absolute animate-fly-to-cart"
                    style={{
                        '--start-x': `${anim.startRect.left}px`,
                        '--start-y': `${anim.startRect.top}px`,
                        '--end-x': `${anim.endRect.left + anim.endRect.width / 2 - 20}px`,
                        '--end-y': `${anim.endRect.top + anim.endRect.height / 2 - 20}px`,
                        width: '50px',
                        height: '50px',
                        backgroundImage: `url(${anim.image})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        borderRadius: '50%',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
                    }}
                />
            ))}
            <style jsx>{`
                @keyframes flyToCart {
                    0% {
                        transform: translate(var(--start-x), var(--start-y)) scale(1);
                        opacity: 1;
                    }
                    60% {
                        transform: translate(calc(var(--start-x) + (var(--end-x) - var(--start-x)) * 0.5), calc(var(--start-y) - 100px)) scale(0.8);
                        opacity: 1;
                    }
                    100% {
                        transform: translate(var(--end-x), var(--end-y)) scale(0.1);
                        opacity: 0;
                    }
                }
                .animate-fly-to-cart {
                    animation: flyToCart 1.5s cubic-bezier(0.2, 0.8, 0.2, 1) forwards;
                }
            `}</style>
        </div>
    );
};

export default FlyToCartLayer;
