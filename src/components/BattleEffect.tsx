import React, { useMemo } from 'react';

export type EffectType = 
  | 'slash'       // 近战斩击（小刀/剑系）
  | 'shoot'       // 远程射击（弩/手枪）
  | 'fire'        // 火焰（喷火器）
  | 'explosion'   // 爆炸（主炮/导弹）
  | 'pierce'      // 穿刺狙击（狙击类）
  | 'machinegun'  // 连射（机关枪）
  | 'shotgun'     // 散射（散弹枪）
  | 'lightning'   // 雷电（电磁武器）
  | 'ice'         // 冰冻（冷冻武器）
  | 'poison'      // 毒（毒气攻击）
  | 'hit'         // 受击
  | 'miss';       // 闪避

interface BattleEffectProps {
  type: EffectType;
  position: 'enemy' | 'player';
  onComplete?: () => void;
  visible: boolean;
  crit?: boolean;   // 暴击强化
  color?: string;   // 自定义颜色
}

// ============ 特效粒子和SVG组件 ============

/** 斩击 - 金色弧光 */
const SlashEffect = ({ color }: { color: string }) => (
  <div className="relative w-20 h-20">
    <div className="absolute inset-0 animate-slash">
      <svg viewBox="0 0 80 80" className="w-full h-full">
        <path d="M5 75 Q40 40 75 5" stroke={color} strokeWidth="6" fill="none" strokeLinecap="round">
          <animate attributeName="stroke-opacity" from="1" to="0" dur="0.4s" fill="freeze" />
        </path>
        <path d="M12 68 Q40 38 68 12" stroke="#FFF" strokeWidth="3" fill="none" strokeLinecap="round">
          <animate attributeName="stroke-opacity" from="1" to="0" dur="0.3s" fill="freeze" />
        </path>
        {/* 二次残影 */}
        <path d="M18 62 Q40 34 62 18" stroke={color} strokeWidth="2" fill="none" strokeLinecap="round" opacity="0.5">
          <animate attributeName="stroke-opacity" from="0.5" to="0" dur="0.5s" fill="freeze" />
        </path>
      </svg>
    </div>
  </div>
);

/** 射击 - 弹头命中 */
const ShootEffect = ({ color }: { color: string }) => (
  <div className="relative w-20 h-20">
    <div className="absolute inset-0 animate-shoot">
      <svg viewBox="0 0 80 80" className="w-full h-full">
        <circle cx="40" cy="40" r="10" fill={color}>
          <animate attributeName="r" from="4" to="18" dur="0.25s" fill="freeze" />
          <animate attributeName="opacity" from="1" to="0" dur="0.3s" fill="freeze" />
        </circle>
        <circle cx="40" cy="40" r="4" fill="#FFF" opacity="0.8">
          <animate attributeName="r" from="2" to="8" dur="0.2s" fill="freeze" />
          <animate attributeName="opacity" from="0.8" to="0" dur="0.3s" fill="freeze" />
        </circle>
        {/* 弹道轨迹 */}
        <line x1="0" y1="45" x2="35" y2="40" stroke={color} strokeWidth="2" strokeLinecap="round" opacity="0.6">
          <animate attributeName="opacity" from="0.8" to="0" dur="0.2s" fill="freeze" />
        </line>
      </svg>
    </div>
  </div>
);

/** 连射 - 多发弹幕 */
const MachinegunEffect = ({ color }: { color: string }) => (
  <div className="relative w-24 h-20">
    <div className="absolute inset-0 animate-shoot">
      <svg viewBox="0 0 96 80" className="w-full h-full">
        {[0, 1, 2].map(i => {
          const cx = 30 + i * 18;
          return (
            <g key={i}>
              <circle cx={cx} cy="40" r="6" fill={color}>
                <animate attributeName="r" from="3" to="10" dur="0.2s" begin={`${i * 0.08}s`} fill="freeze" />
                <animate attributeName="opacity" from="1" to="0" dur="0.25s" begin={`${i * 0.08}s`} fill="freeze" />
              </circle>
              <circle cx={cx} cy="40" r="2" fill="#FFF">
                <animate attributeName="r" from="1" to="5" dur="0.15s" begin={`${i * 0.08}s`} fill="freeze" />
                <animate attributeName="opacity" from="0.8" to="0" dur="0.2s" begin={`${i * 0.08}s`} fill="freeze" />
              </circle>
            </g>
          );
        })}
      </svg>
    </div>
  </div>
);

/** 散射 - 散弹扩散 */
const ShotgunEffect = ({ color }: { color: string }) => (
  <div className="relative w-24 h-24">
    <div className="absolute inset-0 animate-shoot">
      <svg viewBox="0 0 96 96" className="w-full h-full">
        {[-2, -1, 0, 1, 2].map(i => {
          const angle = i * 12;
          const rad = angle * Math.PI / 180;
          const cx = 48 + Math.cos(rad) * 20;
          const cy = 40 + Math.sin(rad) * 10;
          return (
            <circle key={i} cx={cx} cy={cy} r="5" fill={color} opacity="0.8">
              <animate attributeName="r" from="2" to="8" dur="0.3s" fill="freeze" />
              <animate attributeName="opacity" from="0.8" to="0" dur="0.3s" fill="freeze" />
            </circle>
          );
        })}
      </svg>
    </div>
  </div>
);

/** 穿刺 - 狙击穿透 */
const PierceEffect = ({ color }: { color: string }) => (
  <div className="relative w-24 h-24">
    <div className="absolute inset-0 animate-shoot">
      <svg viewBox="0 0 96 96" className="w-full h-full">
        <line x1="0" y1="48" x2="96" y2="48" stroke={color} strokeWidth="3" strokeLinecap="round">
          <animate attributeName="opacity" from="1" to="0" dur="0.4s" fill="freeze" />
        </line>
        <line x1="0" y1="45" x2="96" y2="45" stroke="#FFF" strokeWidth="1" opacity="0.6">
          <animate attributeName="opacity" from="0.6" to="0" dur="0.3s" fill="freeze" />
        </line>
        {/* 穿透光晕 */}
        <circle cx="48" cy="48" r="12" fill="none" stroke={color} strokeWidth="2" opacity="0.5">
          <animate attributeName="r" from="5" to="25" dur="0.35s" fill="freeze" />
          <animate attributeName="opacity" from="0.5" to="0" dur="0.35s" fill="freeze" />
        </circle>
      </svg>
    </div>
  </div>
);

/** 火焰 - 持续燃烧 */
const FireEffect = () => (
  <div className="relative w-24 h-24">
    <div className="absolute inset-0 animate-fire">
      <svg viewBox="0 0 96 96" className="w-full h-full">
        {[...Array(6)].map((_, i) => (
          <ellipse key={i} cx="48" cy={60 - i * 9} rx={20 - i * 3} ry={14 - i * 2}
            fill={i % 2 === 0 ? '#FF4500' : '#FFD700'} opacity={0.8 - i * 0.12}>
            <animate attributeName="cy" values={`${60 - i * 9};${48 - i * 9};${60 - i * 9}`}
              dur={`${0.4 + i * 0.1}s`} repeatCount="indefinite" />
            <animate attributeName="rx" values={`${20 - i * 3};${22 - i * 3};${20 - i * 3}`}
              dur={`${0.5 + i * 0.08}s`} repeatCount="indefinite" />
          </ellipse>
        ))}
        {/* 火星 */}
        {[...Array(3)].map((_, i) => (
          <circle key={`s${i}`} cx={38 + i * 10} cy={25 + i * 5} r="2" fill="#FFA500" opacity="0.8">
            <animate attributeName="cy" values={`${25 + i * 5};${15 + i * 5}`} dur={`${0.3 + i * 0.1}s`} repeatCount="indefinite" />
            <animate attributeName="opacity" from="0.8" to="0" dur={`${0.3 + i * 0.1}s`} repeatCount="indefinite" />
          </circle>
        ))}
      </svg>
    </div>
  </div>
);

/** 爆炸 - 大范围爆裂 */
const ExplosionEffect = ({ crit }: { crit?: boolean }) => (
  <div className={`relative ${crit ? 'w-36 h-36' : 'w-28 h-28'}`}>
    <div className="absolute inset-0 animate-explosion">
      <svg viewBox="0 0 112 112" className="w-full h-full">
        {/* 核心爆炸 */}
        <circle cx="56" cy="56" r="28" fill={crit ? '#FF2200' : '#FF6B00'} opacity="0.8">
          <animate attributeName="r" from={crit ? "5" : "10"} to={crit ? "55" : "45"} dur={crit ? "0.5s" : "0.4s"} fill="freeze" />
          <animate attributeName="opacity" from="0.9" to="0" dur={crit ? "0.5s" : "0.4s"} fill="freeze" />
        </circle>
        {/* 爆裂碎片 */}
        {[...Array(crit ? 12 : 8)].map((_, i) => {
          const angle = (i * (360 / (crit ? 12 : 8))) * Math.PI / 180;
          const dist = crit ? 42 : 35;
          const x = 56 + Math.cos(angle) * dist;
          const y = 56 + Math.sin(angle) * dist;
          return (
            <g key={i}>
              <circle cx={x} cy={y} r={crit ? 10 : 8} fill={crit ? '#FFD700' : '#FFA500'}>
                <animate attributeName="r" from={crit ? "8" : "6"} to={crit ? "14" : "12"} dur="0.3s" fill="freeze" />
                <animate attributeName="opacity" from="1" to="0" dur="0.3s" fill="freeze" />
              </circle>
              {crit && (
                <circle cx={x + 8} cy={y - 5} r="4" fill="#FFF">
                  <animate attributeName="opacity" from="1" to="0" dur="0.25s" fill="freeze" />
                </circle>
              )}
            </g>
          );
        })}
      </svg>
    </div>
  </div>
);

/** 雷电 - 电击 */
const LightningEffect = () => (
  <div className="relative w-24 h-24">
    <div className="absolute inset-0 animate-hit">
      <svg viewBox="0 0 96 96" className="w-full h-full">
        {/* 闪电主干 */}
        <polyline points="55,10 45,40 55,45 40,85" stroke="#4FC3F7" strokeWidth="5" fill="none" strokeLinejoin="round" strokeLinecap="round">
          <animate attributeName="stroke-opacity" values="1;0.3;1;0.5;1" dur="0.3s" fill="freeze" />
        </polyline>
        {/* 闪电内芯 */}
        <polyline points="55,10 45,40 55,45 40,85" stroke="#FFF" strokeWidth="2" fill="none" strokeLinejoin="round" strokeLinecap="round">
          <animate attributeName="stroke-opacity" values="1;0.5;1;0.3;1" dur="0.25s" fill="freeze" />
        </polyline>
        {/* 电弧分支 */}
        <polyline points="48,50 35,55 38,65" stroke="#81D4FA" strokeWidth="2" fill="none" strokeLinecap="round" opacity="0.6">
          <animate attributeName="opacity" values="0.6;0;0.6;0;0.6" dur="0.2s" fill="freeze" />
        </polyline>
        <polyline points="50,38 62,30 58,42" stroke="#81D4FA" strokeWidth="2" fill="none" strokeLinecap="round" opacity="0.5">
          <animate attributeName="opacity" values="0.5;0;0.5;0;0.5" dur="0.15s" fill="freeze" />
        </polyline>
      </svg>
    </div>
  </div>
);

/** 冰冻 */
const IceEffect = () => (
  <div className="relative w-24 h-24">
    <div className="absolute inset-0 animate-explosion">
      <svg viewBox="0 0 96 96" className="w-full h-full">
        {[...Array(6)].map((_, i) => {
          const angle = i * 60 * Math.PI / 180;
          const x2 = 48 + Math.cos(angle) * 35;
          const y2 = 48 + Math.sin(angle) * 35;
          return (
            <line key={i} x1="48" y1="48" x2={x2} y2={y2} stroke="#81D4FA" strokeWidth="4" strokeLinecap="round" opacity="0.8">
              <animate attributeName="opacity" from="0.9" to="0" dur="0.5s" fill="freeze" />
            </line>
          );
        })}
        <polygon points="48,18 54,38 74,42 58,54 62,76 48,60 34,76 38,54 22,42 42,38" fill="#E3F2FD" opacity="0.5">
          <animate attributeName="opacity" from="0.6" to="0" dur="0.5s" fill="freeze" />
        </polygon>
        <circle cx="48" cy="48" r="15" fill="none" stroke="#B3E5FC" strokeWidth="2" opacity="0.6">
          <animate attributeName="r" from="5" to="30" dur="0.4s" fill="freeze" />
          <animate attributeName="opacity" from="0.6" to="0" dur="0.4s" fill="freeze" />
        </circle>
      </svg>
    </div>
  </div>
);

/** 毒 - 毒雾 */
const PoisonEffect = () => (
  <div className="relative w-24 h-20">
    <div className="absolute inset-0 animate-fire">
      <svg viewBox="0 0 96 80" className="w-full h-full">
        <circle cx="48" cy="40" r="8" fill="#76FF03" opacity="0.7">
          <animate attributeName="r" from="5" to="30" dur="0.6s" fill="freeze" />
          <animate attributeName="opacity" from="0.7" to="0" dur="0.6s" fill="freeze" />
        </circle>
        {[...Array(4)].map((_, i) => (
          <circle key={i} cx={40 + i * 5} cy={35 + (i % 2) * 10} r="6" fill="#69F0AE" opacity="0.5">
            <animate attributeName="r" values="6;10;6" dur={`${0.8 + i * 0.2}s`} repeatCount="indefinite" />
            <animate attributeName="opacity" values="0.5;0.2;0.5" dur={`${0.8 + i * 0.2}s`} repeatCount="indefinite" />
          </circle>
        ))}
        <text x="48" y="45" textAnchor="middle" fontSize="9" fill="#76FF03" opacity="0.4">☠</text>
      </svg>
    </div>
  </div>
);

/** 受击 - 红色震荡 */
const HitEffect = ({ crit }: { crit?: boolean }) => (
  <div className={`relative ${crit ? 'w-28 h-28' : 'w-20 h-20'}`}>
    <div className="absolute inset-0 animate-hit">
      <svg viewBox={crit ? "0 0 112 112" : "0 0 80 80"} className="w-full h-full">
        <circle cx={crit ? 56 : 40} cy={crit ? 56 : 40} r={crit ? 35 : 25} fill="none" stroke={crit ? "#FF0000" : "#FF4444"} strokeWidth={crit ? 5 : 4}>
          <animate attributeName="r" from={crit ? "5" : "3"} to={crit ? "45" : "35"} dur="0.25s" fill="freeze" />
          <animate attributeName="opacity" from="1" to="0" dur="0.3s" fill="freeze" />
        </circle>
        {[...Array(crit ? 8 : 6)].map((_, i) => {
          const angle = (i * (360 / (crit ? 8 : 6))) * Math.PI / 180;
          const cx = (crit ? 56 : 40) + Math.cos(angle) * 15;
          const cy = (crit ? 56 : 40) + Math.sin(angle) * 15;
          const ex = (crit ? 56 : 40) + Math.cos(angle) * (crit ? 35 : 28);
          const ey = (crit ? 56 : 40) + Math.sin(angle) * (crit ? 35 : 28);
          return (
            <line key={i} x1={cx} y1={cy} x2={ex} y2={ey}
              stroke={crit ? "#FF6666" : "#FF6B6B"} strokeWidth={crit ? 3 : 2.5} strokeLinecap="round">
              <animate attributeName="opacity" from="1" to="0" dur="0.3s" fill="freeze" />
            </line>
          );
        })}
      </svg>
    </div>
  </div>
);

/** 闪避 */
const MissEffect = () => (
  <div className="relative w-16 h-16">
    <div className="absolute inset-0 animate-miss">
      <svg viewBox="0 0 64 64" className="w-full h-full">
        <text x="32" y="40" textAnchor="middle" fontSize="28" fill="#999" fontWeight="bold">MISS</text>
      </svg>
    </div>
  </div>
);

// ============ 主组件 ============

const colorMap: Record<EffectType, string> = {
  slash: '#FFD700',
  shoot: '#FF6B6B',
  fire: '#FF4500',
  explosion: '#FF6B00',
  pierce: '#00BCD4',
  machinegun: '#FF9800',
  shotgun: '#FF5722',
  lightning: '#4FC3F7',
  ice: '#81D4FA',
  poison: '#76FF03',
  hit: '#FF4444',
  miss: '#999',
};

const BattleEffect: React.FC<BattleEffectProps> = ({ type, position, onComplete, visible, crit, color }) => {
  if (!visible) return null;

  const effectColor = color || colorMap[type] || '#FFD700';

  const getEffectContent = () => {
    switch (type) {
      case 'slash': return <SlashEffect color={effectColor} />;
      case 'shoot': return <ShootEffect color={effectColor} />;
      case 'fire': return <FireEffect />;
      case 'explosion': return <ExplosionEffect crit={crit} />;
      case 'pierce': return <PierceEffect color={effectColor} />;
      case 'machinegun': return <MachinegunEffect color={effectColor} />;
      case 'shotgun': return <ShotgunEffect color={effectColor} />;
      case 'lightning': return <LightningEffect />;
      case 'ice': return <IceEffect />;
      case 'poison': return <PoisonEffect />;
      case 'hit': return <HitEffect crit={crit} />;
      case 'miss': return <MissEffect />;
      default: return null;
    }
  };

  return (
    <div 
      className={`absolute z-50 flex items-center justify-center pointer-events-none ${
        position === 'enemy' ? 'top-8 left-1/2 -translate-x-1/2' : 'bottom-28 left-1/2 -translate-x-1/2'
      }`}
      style={{ animation: 'effect-fade 0.45s ease-out forwards' }}
      onAnimationEnd={onComplete}
    >
      {getEffectContent()}
      {/* 暴击标签 */}
      {crit && (
        <div className="absolute -top-4 left-1/2 -translate-x-1/2 whitespace-nowrap">
          <span className="text-yellow-300 font-black text-sm tracking-wider animate-fadeInUp glow-text"
            style={{ textShadow: '0 0 10px #FFD700, 0 0 20px #FF6B00' }}>
            CRIT!
          </span>
        </div>
      )}
    </div>
  );
};

export default BattleEffect;
