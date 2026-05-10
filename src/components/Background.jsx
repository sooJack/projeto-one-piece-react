import React from 'react';

export default function Background() {
  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: -1, overflow: 'hidden',
      background: 'var(--black)',
    }}>
      <div style={{
        position: 'absolute', inset: 0,
        backgroundImage: `
          repeating-linear-gradient(0deg, transparent, transparent 59px, rgba(200,168,75,0.03) 59px, rgba(200,168,75,0.03) 60px),
          repeating-linear-gradient(90deg, transparent, transparent 59px, rgba(200,168,75,0.02) 59px, rgba(200,168,75,0.02) 60px)
        `,
      }} />

      <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0.03 }}>
        <defs>
          <pattern id="diag" patternUnits="userSpaceOnUse" width="40" height="40" patternTransform="rotate(45)">
            <line x1="0" y1="0" x2="0" y2="40" stroke="#c8a84b" strokeWidth="1" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#diag)" />
      </svg>

      {[...Array(12)].map((_, i) => (
        <div key={i} style={{
          position: 'absolute',
          left: `${Math.random() * 100}%`,
          top: `${Math.random() * 100}%`,
          width: i % 3 === 0 ? 3 : i % 3 === 1 ? 2 : 1,
          height: i % 3 === 0 ? 3 : i % 3 === 1 ? 2 : 1,
          borderRadius: '50%',
          background: i % 4 === 0 ? 'var(--gold)' : 'rgba(200,168,75,0.3)',
          animation: `float ${3 + i * 0.5}s ease-in-out infinite`,
          animationDelay: `${i * 0.3}s`,
          opacity: 0.4,
        }} />
      ))}

      <div style={{
        position: 'absolute', inset: 0,
        background: 'radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.6) 100%)',
        pointerEvents: 'none',
      }} />

      <svg style={{ position: 'absolute', top: 0, left: 0, width: 200, height: 200, opacity: 0.06 }}>
        <line x1="0" y1="0" x2="200" y2="200" stroke="#c8a84b" strokeWidth="1" />
        <line x1="50" y1="0" x2="200" y2="150" stroke="#c8a84b" strokeWidth="0.5" />
        <line x1="0" y1="50" x2="150" y2="200" stroke="#c8a84b" strokeWidth="0.5" />
      </svg>
      <svg style={{ position: 'absolute', bottom: 0, right: 0, width: 200, height: 200, opacity: 0.06, transform: 'rotate(180deg)' }}>
        <line x1="0" y1="0" x2="200" y2="200" stroke="#c8a84b" strokeWidth="1" />
        <line x1="50" y1="0" x2="200" y2="150" stroke="#c8a84b" strokeWidth="0.5" />
        <line x1="0" y1="50" x2="150" y2="200" stroke="#c8a84b" strokeWidth="0.5" />
      </svg>
    </div>
  );
}
