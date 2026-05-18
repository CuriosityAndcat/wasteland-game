import React from 'react';

interface PortraitProps {
  id: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

const sizeMap = {
  sm: 'w-10 h-10',
  md: 'w-16 h-16',
  lg: 'w-24 h-24',
  xl: 'w-32 h-32',
};

const Portrait: React.FC<PortraitProps> = ({ id, size = 'md', className = '' }) => {

  const renderAvatar = () => {
    switch (id) {
      case 'narrator':
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <circle cx="50" cy="50" r="45" fill="#4a5568" />
            <circle cx="50" cy="45" r="30" fill="#2d3748" />
            <path d="M25 35 Q25 15 50 15 Q75 15 75 35 L75 50 Q75 60 50 60 Q25 60 25 50 Z" fill="#1a202c" />
            <ellipse cx="38" cy="42" rx="5" ry="6" fill="#667eea" />
            <ellipse cx="62" cy="42" rx="5" ry="6" fill="#667eea" />
            <ellipse cx="39" cy="40" rx="2" ry="3" fill="#ffffff" />
            <ellipse cx="63" cy="40" rx="2" ry="3" fill="#ffffff" />
          </svg>
        );

      case 'father':
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <circle cx="50" cy="50" r="45" fill="#4a3728" />
            <circle cx="50" cy="45" r="32" fill="#d4a574" />
            <ellipse cx="50" cy="35" rx="25" ry="15" fill="#4a3728" />
            <ellipse cx="38" cy="42" rx="5" ry="6" fill="#2d1f17" />
            <ellipse cx="62" cy="42" rx="5" ry="6" fill="#2d1f17" />
            <ellipse cx="39" cy="40" rx="2" ry="3" fill="#ffffff" />
            <ellipse cx="63" cy="40" rx="2" ry="3" fill="#ffffff" />
            <path d="M35 52 Q50 62 65 52" stroke="#8b4513" strokeWidth="3" fill="none" />
          </svg>
        );

      case 'hunter':
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <circle cx="50" cy="50" r="45" fill="#2d3748" />
            <circle cx="50" cy="45" r="30" fill="#d4a574" />
            <ellipse cx="50" cy="30" rx="22" ry="18" fill="#1a202c" />
            <ellipse cx="38" cy="42" rx="5" ry="6" fill="#2d1f17" />
            <ellipse cx="62" cy="42" rx="5" ry="6" fill="#2d1f17" />
            <ellipse cx="39" cy="40" rx="2" ry="3" fill="#ffffff" />
            <ellipse cx="63" cy="40" rx="2" ry="3" fill="#ffffff" />
            <path d="M38 52 Q50 60 62 52" stroke="#8b4513" strokeWidth="2" fill="none" />
            <ellipse cx="50" cy="45" rx="18" ry="8" fill="#e53e3e" opacity="0.5" />
          </svg>
        );

      case 'mechanic':
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <circle cx="50" cy="50" r="45" fill="#2d3748" />
            <circle cx="50" cy="45" r="30" fill="#d4a574" />
            <ellipse cx="50" cy="30" rx="20" ry="15" fill="#4a5568" />
            <ellipse cx="50" cy="22" rx="25" ry="8" fill="#2d3748" />
            <circle cx="40" cy="22" r="5" fill="#f6ad55" />
            <circle cx="60" cy="22" r="5" fill="#f6ad55" />
            <ellipse cx="38" cy="42" rx="5" ry="6" fill="#2d1f17" />
            <ellipse cx="62" cy="42" rx="5" ry="6" fill="#2d1f17" />
            <ellipse cx="39" cy="40" rx="2" ry="3" fill="#ffffff" />
            <ellipse cx="63" cy="40" rx="2" ry="3" fill="#ffffff" />
            <path d="M40 52 Q50 58 60 52" stroke="#8b4513" strokeWidth="2" fill="none" />
          </svg>
        );

      case 'female_warrior':
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <circle cx="50" cy="50" r="45" fill="#2d3748" />
            <circle cx="50" cy="45" r="30" fill="#f5d0c5" />
            <path d="M30 30 Q40 20 50 22 Q60 20 70 30 L70 45 Q65 50 50 50 Q35 50 30 45 Z" fill="#e53e3e" />
            <ellipse cx="38" cy="42" rx="5" ry="6" fill="#2d1f17" />
            <ellipse cx="62" cy="42" rx="5" ry="6" fill="#2d1f17" />
            <ellipse cx="39" cy="40" rx="2" ry="3" fill="#ffffff" />
            <ellipse cx="63" cy="40" rx="2" ry="3" fill="#ffffff" />
            <path d="M42 52 L50 58 L58 52" stroke="#8b4513" strokeWidth="2" fill="none" />
          </svg>
        );

      case 'red_wolf':
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <circle cx="50" cy="50" r="45" fill="#2d3748" />
            <circle cx="50" cy="45" r="30" fill="#d4a574" />
            <ellipse cx="50" cy="30" rx="22" ry="18" fill="#e53e3e" />
            <ellipse cx="38" cy="42" rx="5" ry="6" fill="#2d1f17" />
            <ellipse cx="62" cy="42" rx="5" ry="6" fill="#2d1f17" />
            <ellipse cx="39" cy="40" rx="2" ry="3" fill="#ffffff" />
            <ellipse cx="63" cy="40" rx="2" ry="3" fill="#ffffff" />
            <path d="M42 52 Q50 56 58 52" stroke="#8b4513" strokeWidth="2" fill="none" />
            <path d="M35 35 L30 25" stroke="#e53e3e" strokeWidth="3" />
            <path d="M65 35 L70 25" stroke="#e53e3e" strokeWidth="3" />
          </svg>
        );

      case 'tank':
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <circle cx="50" cy="50" r="45" fill="#1a365d" />
            <rect x="20" y="40" width="60" height="25" rx="5" fill="#2d3748" />
            <rect x="30" y="35" width="40" height="15" rx="3" fill="#4a5568" />
            <rect x="60" y="30" width="25" height="5" fill="#718096" />
            <circle cx="30" cy="65" r="8" fill="#2d3748" stroke="#4a5568" strokeWidth="2" />
            <circle cx="50" cy="65" r="8" fill="#2d3748" stroke="#4a5568" strokeWidth="2" />
            <circle cx="70" cy="65" r="8" fill="#2d3748" stroke="#4a5568" strokeWidth="2" />
          </svg>
        );

      default:
        if (id.startsWith('boss')) {
          return (
            <svg viewBox="0 0 100 100" className="w-full h-full">
              <circle cx="50" cy="50" r="45" fill="#742a2a" />
              <circle cx="50" cy="45" r="25" fill="#9b2c2c" />
              <circle cx="38" cy="42" r="8" fill="#fc8181" />
              <circle cx="62" cy="42" r="8" fill="#fc8181" />
              <circle cx="38" cy="42" r="4" fill="#000" />
              <circle cx="62" cy="42" r="4" fill="#000" />
              <path d="M35 60 Q50 70 65 60" stroke="#000" strokeWidth="3" fill="none" />
            </svg>
          );
        }
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <circle cx="50" cy="50" r="45" fill="#4a5568" />
            <circle cx="50" cy="45" r="25" fill="#2d3748" />
            <circle cx="50" cy="55" r="15" fill="#2d3748" />
            <circle cx="40" cy="40" r="4" fill="#667eea" />
            <circle cx="60" cy="40" r="4" fill="#667eea" />
          </svg>
        );
    }
  };

  return (
    <div className={`${sizeMap[size]} rounded-full overflow-hidden border-2 border-gray-600 bg-gray-800 flex-shrink-0 ${className}`}>
      {renderAvatar()}
    </div>
  );
};

export default React.memo(Portrait);
