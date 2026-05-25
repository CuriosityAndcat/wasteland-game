import React, { useMemo } from 'react';

interface Props {
  count?: number;
  color?: string;
  speed?: number;
  className?: string;
}

const ParticleBackground: React.FC<Props> = ({
  count = 30, color = 'rgba(232, 184, 48, 0.6)', speed = 1, className = ''
}) => {
  const particles = useMemo(() =>
    Array.from({ length: count }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      delay: Math.random() * 5,
      duration: (3 + Math.random() * 4) / speed,
      size: 2 + Math.random() * 3,
    })), [count, speed]);

  return (
    <div className={`particle-container ${className}`}>
      {particles.map(p => (
        <div key={p.id} className="particle" style={{
          '--x': `${p.x}%`, '--delay': `${p.delay}s`, '--duration': `${p.duration}s`,
          width: p.size, height: p.size, background: color,
          boxShadow: `0 0 ${p.size * 2}px ${color}`,
        } as React.CSSProperties} />
      ))}
    </div>
  );
};

export default ParticleBackground;
