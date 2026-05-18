import React from 'react';

export type EffectType = 
  | 'slash'    // 近战斩击
  | 'shoot'    // 远程射击
  | 'fire'     // 火焰
  | 'explosion' // 爆炸
  | 'hit'      // 受击
  | 'miss';    // 闪避

interface BattleEffectProps {
  type: EffectType;
  position: 'enemy' | 'player';
  onComplete?: () => void;
  visible: boolean;
}

const BattleEffect: React.FC<BattleEffectProps> = ({ type, position, onComplete, visible }) => {
  if (!visible) return null;

  const getEffectContent = () => {
    switch (type) {
      case 'slash':
        return (
          <div className="relative w-20 h-20">
            <div className="absolute inset-0 animate-slash">
              <svg viewBox="0 0 80 80" className="w-full h-full">
                <path 
                  d="M10 70 Q40 40 70 10" 
                  stroke="#FFD700" 
                  strokeWidth="6" 
                  fill="none"
                  strokeLinecap="round"
                />
                <path 
                  d="M15 65 Q40 35 65 15" 
                  stroke="#FFF" 
                  strokeWidth="3" 
                  fill="none"
                  strokeLinecap="round"
                />
              </svg>
            </div>
          </div>
        );
      
      case 'shoot':
        return (
          <div className="relative w-20 h-20">
            <div className="absolute inset-0 animate-shoot">
              <svg viewBox="0 0 80 80" className="w-full h-full">
                <circle cx="40" cy="40" r="8" fill="#FF6B6B">
                  <animate attributeName="r" from="5" to="15" dur="0.3s" fill="freeze" />
                  <animate attributeName="opacity" from="1" to="0" dur="0.3s" fill="freeze" />
                </circle>
                <circle cx="40" cy="40" r="3" fill="#FFF" />
              </svg>
            </div>
          </div>
        );
      
      case 'fire':
        return (
          <div className="relative w-24 h-24">
            <div className="absolute inset-0 animate-fire">
              <svg viewBox="0 0 96 96" className="w-full h-full">
                {[...Array(5)].map((_, i) => (
                  <ellipse 
                    key={i}
                    cx="48" 
                    cy={60 - i * 10} 
                    rx={20 - i * 3} 
                    ry={15 - i * 2}
                    fill={i % 2 === 0 ? '#FF4500' : '#FFD700'}
                    opacity={0.8 - i * 0.15}
                  >
                    <animate 
                      attributeName="cy" 
                      values={`${60 - i * 10};${50 - i * 10};${60 - i * 10}`}
                      dur={`${0.5 + i * 0.1}s`}
                      repeatCount="indefinite"
                    />
                  </ellipse>
                ))}
              </svg>
            </div>
          </div>
        );
      
      case 'explosion':
        return (
          <div className="relative w-28 h-28">
            <div className="absolute inset-0 animate-explosion">
              <svg viewBox="0 0 112 112" className="w-full h-full">
                {[...Array(8)].map((_, i) => {
                  const angle = (i * 45) * Math.PI / 180;
                  const x = 56 + Math.cos(angle) * 35;
                  const y = 56 + Math.sin(angle) * 35;
                  return (
                    <g key={i}>
                      <circle cx="56" cy="56" r="25" fill="#FF6B00" opacity="0.7">
                        <animate attributeName="r" from="10" to="50" dur="0.4s" fill="freeze" />
                        <animate attributeName="opacity" from="0.8" to="0" dur="0.4s" fill="freeze" />
                      </circle>
                      <circle cx={x} cy={y} r="8" fill="#FFD700">
                        <animate attributeName="r" from="8" to="12" dur="0.3s" fill="freeze" />
                        <animate attributeName="opacity" from="1" to="0" dur="0.3s" fill="freeze" />
                      </circle>
                    </g>
                  );
                })}
              </svg>
            </div>
          </div>
        );
      
      case 'hit':
        return (
          <div className="relative w-20 h-20">
            <div className="absolute inset-0 animate-hit">
              <svg viewBox="0 0 80 80" className="w-full h-full">
                <circle cx="40" cy="40" r="30" fill="none" stroke="#FF4444" strokeWidth="4">
                  <animate attributeName="r" from="5" to="35" dur="0.3s" fill="freeze" />
                  <animate attributeName="opacity" from="1" to="0" dur="0.3s" fill="freeze" />
                </circle>
                {[...Array(6)].map((_, i) => {
                  const angle = (i * 60) * Math.PI / 180;
                  return (
                    <line 
                      key={i}
                      x1={40 + Math.cos(angle) * 10}
                      y1={40 + Math.sin(angle) * 10}
                      x2={40 + Math.cos(angle) * 25}
                      y2={40 + Math.sin(angle) * 25}
                      stroke="#FF6B6B"
                      strokeWidth="3"
                      strokeLinecap="round"
                    >
                      <animate attributeName="opacity" from="1" to="0" dur="0.3s" fill="freeze" />
                    </line>
                  );
                })}
              </svg>
            </div>
          </div>
        );
      
      case 'miss':
        return (
          <div className="relative w-16 h-16">
            <div className="absolute inset-0 animate-miss">
              <svg viewBox="0 0 64 64" className="w-full h-full">
                <text x="32" y="40" textAnchor="middle" fontSize="32" fill="#888">
                  MISS
                </text>
              </svg>
            </div>
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <div 
      className={`absolute z-50 flex items-center justify-center pointer-events-none ${
        position === 'enemy' ? 'top-8 left-1/2 -translate-x-1/2' : 'bottom-28 left-1/2 -translate-x-1/2'
      }`}
      style={{ animation: 'effect-fade 0.5s ease-out forwards' }}
      onAnimationEnd={onComplete}
    >
      {getEffectContent()}
    </div>
  );
};

export default BattleEffect;
