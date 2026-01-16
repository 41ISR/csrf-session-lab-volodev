import React, { useEffect, useRef } from 'react';

const ALL_SYMBOLS = ['📚', '✏️', '🧠', '🎓', '🔥', '💯', '❌'];

const Reel = ({ symbol, isSpinning }) => {
    const reelRef = useRef(null);

    useEffect(() => {
        if (!reelRef.current) return;

        if (isSpinning) {
            reelRef.current.classList.add('spinning');
            reelRef.current.style.top = '0';
        } else {
            reelRef.current.classList.remove('spinning');
            const index = ALL_SYMBOLS.indexOf(symbol);
            if (index !== -1) {
                const offset = -index * 100;
                reelRef.current.style.top = `${offset}px`;
            }
        }
    }, [isSpinning, symbol]);

    return (
        <div className="slot">
            <div className="reel" ref={reelRef}>
                {ALL_SYMBOLS.map((sym, i) => (
                    <div className="symbol" key={i}>
                        {sym}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Reel;