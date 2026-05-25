import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useGameStore } from '../store/useGameStore';
import Portrait from './Portrait';
import BattleEffect, { EffectType } from './BattleEffect';

type CurrentEffect = {
  type: EffectType; position: 'enemy' | 'player'; visible: boolean; crit?: boolean;
} | null;

interface FloatNumber {
  id: number; value: number; x: number; y: number; type: 'damage' | 'heal';
}

// ============ 武器→特效映射表 ============

/** 根据武器ID返回对应的特效类型 */
function getWeaponEffect(weaponId: string): EffectType {
  switch (weaponId) {
    // 人类武器
    case 'wp1': return 'shoot';      // 弹弓 → 射击
    case 'wp2': return 'pierce';     // 弩 → 穿刺
    case 'wp3': return 'shoot';      // 短枪 → 射击
    case 'wp4': return 'shotgun';    // 火枪 → 散射
    case 'wp5': return 'machinegun'; // 机关枪 → 连射

    // 战车主炮
    case 'w1': return 'explosion';   // 55mm炮 → 爆炸
    case 'w2': return 'explosion';   // 75mm炮 → 爆炸
    case 'w3': return 'explosion';   // 105mm炮 → 爆炸（大）
    case 'w4': return 'explosion';   // 125mm炮 → 爆炸（大）
    case 'w5': return 'explosion';   // 150mm炮 → 爆炸（大）
    case 'w6': return 'explosion';   // 200mm炮 → 爆炸（特大）

    // 战车副炮
    case 'w10': return 'machinegun'; // 机枪 → 连射
    case 'w11': return 'shotgun';    // 散弹枪 → 散射

    // SE武器
    case 's1': return 'explosion';   // ATM导弹 → 爆炸
    case 's2': return 'fire';        // 喷火器 → 火焰
    case 's3': return 'lightning';   // Thunder-C → 雷电
    case 's4': return 'ice';         // 冷冻弹 → 冰冻

    default: return 'shoot';
  }
}

/** 根据log判断是否暴击 */
function isCrit(log: string): boolean {
  return log.includes('暴击');
}

/** 根据log识别武器ID */
function identifyWeaponId(log: string, playerEquip: any, currentTank: any): string {
  if (log.includes('主炮')) return currentTank?.weapon?.id || 'w1';
  if (log.includes('副炮')) return currentTank?.subWeapon?.id || 'w10';
  if (log.includes('SE')) return currentTank?.se?.id || 's1';
  if (log.includes('你') || log.includes('对手')) {
    return playerEquip?.weapon?.id || 'wp2';
  }
  return 'wp2';
}

// ============ 战斗画面主组件 ============

const BattleScreen: React.FC = () => {
  const {
    battle, player, tanks, currentTankIndex, playerEquip,
    attack, mainCannonAttack, subCannonAttack, seAttack,
    defend, useItem, flee, inventory, battleLog
  } = useGameStore();

  const [currentEffect, setCurrentEffect] = useState<CurrentEffect>(null);
  const [prevLogLength, setPrevLogLength] = useState(0);
  const [shake, setShake] = useState(false);
  const [flash, setFlash] = useState(false);
  const [floatNumbers, setFloatNumbers] = useState<FloatNumber[]>([]);
  const floatIdRef = useRef(0);

  const addFloatNumber = useCallback((value: number, x: number, y: number, type: 'damage' | 'heal') => {
    const id = ++floatIdRef.current;
    setFloatNumbers(prev => [...prev, { id, value, x, y, type }]);
    setTimeout(() => setFloatNumbers(prev => prev.filter(f => f.id !== id)), 1000);
  }, []);

  const triggerShake = useCallback(() => {
    setShake(true);
    setTimeout(() => setShake(false), 300);
  }, []);

  const triggerFlash = useCallback(() => {
    setFlash(true);
    setTimeout(() => setFlash(false), 200);
  }, []);

  if (!battle) return null;

  const { enemy, turn, useTank } = battle;
  const enemyHpPercent = (enemy.hp / enemy.maxHp) * 100;
  const isBoss = enemy.isBoss;
  const currentTank = tanks[currentTankIndex];
  const recentLogs = battleLog.slice(-5);

  const hasMainCannon = !!currentTank?.weapon;
  const hasSubCannon = !!currentTank?.subWeapon;
  const hasSe = !!currentTank?.se;
  const mainAmmo = currentTank?.mainCannonAmmo ?? 0;
  const seAmmo = currentTank?.seAmmo ?? 0;

  // Watch battleLog for effects
  useEffect(() => {
    if (prevLogLength === 0 && battleLog.length > 0) { setPrevLogLength(battleLog.length); return; }
    if (battleLog.length > prevLogLength && prevLogLength > 0) {
      const lastLog = battleLog[battleLog.length - 1];
      if (!lastLog) { setPrevLogLength(battleLog.length); return; }

      // Extract damage numbers
      const damageMatch = lastLog.match(/造成了\s*(\d+)\s*点/);
      if (damageMatch) {
        const dmg = parseInt(damageMatch[1]);
        if (lastLog.includes('对你') || lastLog.includes('战车')) {
          addFloatNumber(dmg, 30, 65, 'damage');
          triggerShake();
          triggerFlash();
        } else {
          addFloatNumber(dmg, 70, 35, 'damage');
        }
      }

      // Determine effect from log (play-er attack or enemy attack)
      if (lastLog.includes('伤害') || lastLog.includes('💥') || lastLog.includes('💣')) {
        let position: 'enemy' | 'player' = 'enemy';
        let effectType: EffectType = 'shoot';
        const crit = isCrit(lastLog);

        if (lastLog.includes('你') || lastLog.includes('主炮') || lastLog.includes('副炮') || lastLog.includes('SE')) {
          position = 'enemy';
          const weaponId = identifyWeaponId(lastLog, playerEquip, currentTank);
          effectType = getWeaponEffect(weaponId);
        } else {
          position = 'player';
          effectType = 'hit';
        }

        // Play attack effect first, then hit effect
        setCurrentEffect({ type: effectType, position, visible: true, crit });
        setTimeout(() => {
          if (effectType !== 'hit') setCurrentEffect({ type: 'hit', position, visible: true, crit });
          setTimeout(() => setCurrentEffect(null), 400);
        }, effectType === 'explosion' ? 400 : 300);
      } else if (lastLog.includes('闪避') || lastLog.includes('💨')) {
        const pos: 'enemy' | 'player' = lastLog.includes('你闪避') ? 'enemy' : 'player';
        setCurrentEffect({ type: 'miss', position: pos, visible: true });
        setTimeout(() => setCurrentEffect(null), 500);
      } else if (lastLog.includes('暴击')) {
        addFloatNumber(999, 70, 35, 'damage');
        setCurrentEffect({ type: 'explosion', position: 'enemy', visible: true, crit: true });
        setTimeout(() => { setCurrentEffect({ type: 'hit', position: 'enemy', visible: true, crit: true }); setTimeout(() => setCurrentEffect(null), 400); }, 300);
      } else if (lastLog.includes('恢复了') || lastLog.includes('💊') || lastLog.includes('🔧')) {
        const healMatch = lastLog.match(/恢复了\s*(\d+)/);
        if (healMatch) addFloatNumber(parseInt(healMatch[1]), 30, 65, 'heal');
      }
    }
    setPrevLogLength(battleLog.length);
  }, [battleLog.length, battleLog, playerEquip.weapon, currentTank?.weapon, currentTank?.subWeapon, currentTank?.se, addFloatNumber, triggerShake, triggerFlash]);

  useEffect(() => {
    if (!battle) { setCurrentEffect(null); setPrevLogLength(0); setFloatNumbers([]); }
  }, [battle]);

  const containerStyle: React.CSSProperties = shake ? { animation: 'shake 0.3s ease-in-out' } : {};

  return (
    <div className="bg-gray-900 border-4 border-gray-600 rounded-xl shadow-2xl w-full max-w-lg mx-4 overflow-hidden relative"
      style={containerStyle}>
      {flash && <div className="absolute inset-0 bg-red-500/20 z-40 pointer-events-none" />}

      <div className={`bg-red-900/30 px-4 py-2 border-b border-gray-600 flex justify-between items-center ${flash ? 'animate-enter-combat' : ''}`}>
        <span className="text-red-400 font-bold text-sm">⚔️ 战斗</span>
        <div className="flex items-center gap-2">
          {useTank && <span className="text-blue-400 text-xs font-bold">🎖️ 战车战</span>}
          {isBoss && <span className="text-yellow-400 font-bold text-sm animate-pulse">⚠️ BOSS</span>}
        </div>
      </div>

      {/* Battle effects */}
      {currentEffect && (
        <BattleEffect
          type={currentEffect.type}
          position={currentEffect.position}
          visible={currentEffect.visible}
          crit={currentEffect.crit}
        />
      )}

      {/* Floating damage numbers */}
      {floatNumbers.map(f => (
        <div key={f.id} className={`damage-number ${f.type === 'heal' ? 'heal-number' : ''}`}
          style={{ left: `${f.x}%`, top: `${f.y}%` }}>
          {f.type === 'heal' ? '+' : '-'}{f.value}
        </div>
      ))}

      <div className="p-4 space-y-4">
        {/* Enemy panel */}
        <div className="bg-gray-800 rounded-lg p-3 border border-gray-700">
          <div className="flex items-center gap-3 mb-2">
            <div className={`transition-all duration-150 ${currentEffect?.position === 'enemy' && currentEffect?.type === 'hit' ? 'scale-110' : 'scale-100'}`}>
              <Portrait id={enemy.portraitId || enemy.id} size="lg" />
            </div>
            <div className="flex-1">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-white">{enemy.name}</span>
                  {isBoss && enemy.bounty && <span className="text-xs text-yellow-400">💰{enemy.bounty}</span>}
                </div>
                <div className="text-right text-xs text-gray-400">HP {enemy.hp}/{enemy.maxHp}</div>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-3 overflow-hidden mt-1">
                <div className={`h-full rounded-full transition-all duration-300 ${enemyHpPercent < 30 ? 'bg-red-500' : 'bg-red-600'}`}
                  style={{ width: `${enemyHpPercent}%` }} />
              </div>
            </div>
          </div>
        </div>

        {/* Player panel */}
        <div className="bg-gray-800 rounded-lg p-3 border border-gray-700">
          <div className="flex items-center gap-3 mb-2">
            <div className={`transition-all duration-150 ${currentEffect?.position === 'player' ? 'scale-110' : 'scale-100'}`}>
              <Portrait id={useTank && currentTank ? 'tank' : (player.portraitId || 'hunter')} size="lg" />
            </div>
            <div className="flex-1">
              <div className="flex justify-between items-start">
                <span className="font-bold text-white">{useTank && currentTank ? currentTank.name : player.name}</span>
                <div className="text-right text-xs text-gray-400">
                  {useTank && currentTank ? `装甲 ${currentTank.armor}/${currentTank.maxArmor}` : `HP ${player.hp}/${player.maxHp}`}
                </div>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-3 overflow-hidden mt-1">
                <div className={`h-full rounded-full transition-all duration-300 ${useTank && currentTank ? 'bg-blue-600' : 'bg-green-500'}`}
                  style={{ width: `${useTank && currentTank ? (currentTank.armor / currentTank.maxArmor) * 100 : (player.hp / player.maxHp) * 100}%` }} />
              </div>
            </div>
          </div>
        </div>

        {/* Battle log */}
        {recentLogs.length > 0 && (
          <div className="bg-black/40 rounded-lg p-2 border border-gray-700 max-h-20 overflow-y-auto">
            {recentLogs.map((msg, i) => (
              <p key={i} className={`text-xs ${msg.includes('伤害') || msg.includes('💥') || msg.includes('💣') ? 'text-orange-400' : msg.includes('击败') || msg.includes('🎉') || msg.includes('🏆') ? 'text-green-400' : msg.includes('BOSS') || msg.includes('⚠️') ? 'text-red-400' : msg.includes('弹药') || msg.includes('📦') ? 'text-yellow-400' : msg.includes('副炮') || msg.includes('🔫') ? 'text-cyan-400' : msg.includes('💊') || msg.includes('🔧') ? 'text-blue-400' : msg.includes('🏃') ? 'text-yellow-400' : 'text-gray-300'}`}>
                {msg}
              </p>
            ))}
          </div>
        )}

        {/* Turn indicator */}
        <div className="text-center">
          <span className={`text-sm font-bold ${turn === 'player' ? 'text-green-400' : 'text-yellow-400 animate-pulse'}`}>
            {turn === 'player' ? '👉 选择指令' : '⏳ 敌人行动中...'}
          </span>
        </div>

        {/* Player actions */}
        {turn === 'player' && (
          <div className="space-y-2">
            {useTank ? (
              <div className="grid grid-cols-2 gap-2">
                <button onClick={mainCannonAttack} disabled={!hasMainCannon || mainAmmo <= 0}
                  className={`font-bold py-3 px-3 rounded-lg border-b-2 transition-all text-sm ${hasMainCannon && mainAmmo > 0 ? 'bg-red-700 hover:bg-red-600 text-white border-red-900' : 'bg-gray-700 text-gray-500 cursor-not-allowed border-gray-800'}`}>
                  <div className="text-base mb-0.5">💥</div><div>主炮</div>
                  <div className="text-xs font-normal opacity-80">{hasMainCannon ? `📦${mainAmmo}发` : '未装备'}</div>
                </button>
                <button onClick={subCannonAttack} disabled={!hasSubCannon}
                  className={`font-bold py-3 px-3 rounded-lg border-b-2 transition-all text-sm ${hasSubCannon ? 'bg-cyan-700 hover:bg-cyan-600 text-white border-cyan-900' : 'bg-gray-700 text-gray-500 cursor-not-allowed border-gray-800'}`}>
                  <div className="text-base mb-0.5">🔫</div><div>副炮</div>
                  <div className="text-xs font-normal opacity-80">{hasSubCannon ? `${currentTank?.subWeapon?.name}` : '未装备'}</div>
                </button>
                <button onClick={seAttack} disabled={!hasSe || seAmmo <= 0}
                  className={`font-bold py-3 px-3 rounded-lg border-b-2 transition-all text-sm ${hasSe && seAmmo > 0 ? 'bg-purple-700 hover:bg-purple-600 text-white border-purple-900' : 'bg-gray-700 text-gray-500 cursor-not-allowed border-gray-800'}`}>
                  <div className="text-base mb-0.5">💣</div><div>SE</div>
                  <div className="text-xs font-normal opacity-80">{hasSe ? `📦${seAmmo}发` : '未装备'}</div>
                </button>
                <button onClick={defend}
                  className="bg-yellow-700 hover:bg-yellow-600 text-white font-bold py-3 px-3 rounded-lg border-b-2 border-yellow-900 transition-all text-sm">
                  <div className="text-base mb-0.5">🛡️</div><div>防御</div>
                  <div className="text-xs font-normal opacity-80">伤害减半</div>
                </button>
                <button onClick={flee} disabled={isBoss}
                  className={`font-bold py-3 px-3 rounded-lg border-b-2 transition-all text-sm col-span-2 ${isBoss ? 'bg-gray-600 text-gray-400 cursor-not-allowed border-gray-700' : 'bg-gray-700 hover:bg-gray-600 text-white border-gray-900'}`}>
                  🏃 {isBoss ? '无法撤退' : '撤退'}
                </button>
              </div>
            ) : (
              <div className="space-y-2">
                <div className="grid grid-cols-3 gap-2">
                  <button onClick={attack} className="bg-red-700 hover:bg-red-600 text-white font-bold py-2.5 px-3 rounded-lg border-b-2 border-red-900 transition-all text-sm">⚔️ 攻击</button>
                  <button onClick={flee} disabled={isBoss}
                    className={`font-bold py-2.5 px-3 rounded-lg border-b-2 transition-all text-sm ${isBoss ? 'bg-gray-600 text-gray-400 cursor-not-allowed border-gray-700' : 'bg-gray-700 hover:bg-gray-600 text-white border-gray-900'}`}>
                    🏃 {isBoss ? '无法撤退' : '撤退'}
                  </button>
                  <button onClick={defend} className="bg-yellow-700 hover:bg-yellow-600 text-white font-bold py-2.5 px-3 rounded-lg border-b-2 border-yellow-900 transition-all text-sm">🛡️ 防御</button>
                </div>
                {inventory.filter(item => item.item.type === 'consumable').length > 0 && (
                  <div>
                    <h4 className="text-yellow-400 font-bold text-xs mb-1.5">🎒 道具</h4>
                    <div className="flex flex-wrap gap-1.5">
                      {inventory.filter(item => item.item.type === 'consumable').map(invItem => (
                        <button key={invItem.item.id} onClick={() => useItem(invItem.item)}
                          className="bg-green-800 hover:bg-green-700 text-white font-medium py-1 px-2.5 rounded border-b-2 border-green-900 transition-all text-xs">
                          {invItem.item.name} x{invItem.quantity}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default React.memo(BattleScreen);
