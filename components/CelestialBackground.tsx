import { CSSProperties } from 'react';

export default function CelestialBackground() {
  return (
    <div className='celestial-background' aria-hidden='true'>
      {Array.from({ length: 24 }, (_, index) => (
        <span
          key={index}
          className={`particle ${index % 5 === 0 ? 'particle--star' : ''}`}
          style={
            {
              left: `${(index * 37 + 7) % 100}%`,
              top: `${(index * 23 + 11) % 100}%`,
              '--duration': `${18 + (index % 7) * 3}s`,
              '--delay': `${-index * 2.7}s`,
              '--drift': `${index % 2 === 0 ? 18 : -18}px`,
            } as CSSProperties
          }
        />
      ))}
    </div>
  );
}
