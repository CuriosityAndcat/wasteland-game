import React, { useState } from 'react';
import { getIconUrl, buildingTypeIconMap } from '../data/iconConfig';

interface GameIconProps {
  id: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  fallback?: string; // emoji fallback
}

const sizeMap = {
  sm: 'w-8 h-8',
  md: 'w-10 h-10',
  lg: 'w-14 h-14',
};

const GameIcon: React.FC<GameIconProps> = ({ id, size = 'md', className = '', fallback = '?' }) => {
  const [imgError, setImgError] = useState(false);
  
  // Try building type mapping first
  const iconId = buildingTypeIconMap[id] || id;
  const url = getIconUrl(iconId);

  if (url && !imgError) {
    return (
      <div className={`${sizeMap[size]} rounded-lg overflow-hidden flex-shrink-0 bg-gray-800/50 ${className}`}>
        <img
          src={url}
          alt={id}
          className="w-full h-full object-cover"
          onError={() => setImgError(true)}
        />
      </div>
    );
  }

  // Fallback to emoji
  return (
    <div className={`${sizeMap[size]} rounded-lg flex items-center justify-center bg-gray-800/50 flex-shrink-0 ${className}`}>
      <span className="text-lg">{fallback}</span>
    </div>
  );
};

export default GameIcon;
