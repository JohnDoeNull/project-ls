import React from 'react';
import '../css/RainEffect.css'; // Import your CSS file for styling

const vietnamSymbols = ['🌸']; // You can use emojis or images

const RainEffect = () => {
  const drops = Array.from({ length: 40 });

  return (
    <div className="rain-container">
      {drops.map((_, i) => {
        const symbol = vietnamSymbols[Math.floor(Math.random() * vietnamSymbols.length)];
        return (
          <div
            key={i}
            className="symbol-drop"
            style={{
              left: `${Math.random() * 100}%`,
              animationDuration: `${2 + Math.random() * 2}s`,
              animationDelay: `${Math.random()}s`,
              fontSize: `${18 + Math.random() * 14}px`,
            }}
          >
            {symbol}
          </div>
        );
      })}
    </div>
  );
};

export default RainEffect;