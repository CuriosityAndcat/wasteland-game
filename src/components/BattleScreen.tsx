import React, { useState, useEffect } from 'react';
import { useGameStore } from '../store/useGameStore';
import Portrait from './Portrait';
import BattleEffect from './BattleEffect';
import { StatusEffect } from '../types';

type EffectType = 'slash' | 'shoot' | 'fire' | 'explosion' | 'hit' | 'miss';
type CurrentEffect = {
  type: EffectType;
  position: 'enemy' | 'player';
  visible: boolean;
} | null;

const statusEffectIcons: Record<string, { icon: string; color: string }> = {
  poison: { icon: '☠️', color: 'text-green-400' },
  burn: { icon: '🔥', color: 'text-orange-400' },
  paralyze: { icon: '⚡', color: 'text-yellow-400' },
  freeze: { icon: '❄️', color: 'text-cyan-400' },
  stun: { icon: '💫', color: 'text-purple-400' },
  slow: { icon: '🐌', color: 'text-blue-400' },
  defenseUp: { icon: '🛡️', color: 'text-blue-400' },
  defenseDown: { icon: '⬇️', color: 'text-red-400' },
  attackUp: { icon: '⚔️', color: 'text-red-400' },
  attackDown: { icon: '📉', color: 'text-orange-400' },
  bleed: { icon: '🩸', color: 'text-red-500' },
  regen: { icon: '💚', color: 'text-green-400' }
};

const BattleScreen: React.FC = () => {
  const {
    battle, player, tanks, currentTankIndex, playerEquip,
    attack, mainCannonAttack, subCannonAttack, seAttack,
    defend, useItem, flee, inventory, battleLog
  } = useGameStore();
  
  const [currentEffect, setCurrentEffect] = useState<CurrentEffect>(null);
  const [prevLogLength, setPrevLogLength] = useState(0);

  if (!battle) return null;

  const { enemy, turn, useTank } = battle;
  const enemyHpPercent = (enemy.hp / enemy.maxHp) * 100;
  const isBoss = enemy.isBoss;
  const currentTank = tanks[currentTankIndex];
  const recentLogs = battleLog.slice(-5);
  const playerStatusEffects = player.statusEffects || [];

  const hasMainCannon = !!currentTank?.weapon;
  const hasSubCannon = !!currentTank?.subWeapon;
  const hasSe = !!currentTank?.se;
  const mainAmmo = currentTank?.mainCannonAmmo ?? 0;
  const seAmmo = currentTank?.seAmmo ?? 0;
  
  // 监听 battleLog 变化，根据日志内容播放特效
  useEffect(() => {
    // 跳过首次渲染
    if (prevLogLength === 0 && battleLog.length > 0) {
      setPrevLogLength(battleLog.length);
      return;
    }
    
    if (battleLog.length > prevLogLength && prevLogLength > 0) {
      const lastLog = battleLog[battleLog.length - 1];
      
      // 判断是否是攻击日志
      if (lastLog && (lastLog.includes('伤害') || lastLog.includes('💥') || lastLog.includes('💣'))) {
        let effectType: EffectType = 'slash';
        let position: 'enemy' | 'player' = 'enemy';
        
        // 判断是玩家攻击还是敌人攻击
        if (lastLog.includes('你') || lastLog.includes('主炮') || lastLog.includes('副炮') || lastLog.includes('SE')) {
          position = 'enemy';
          
          // 根据武器类型判断特效
          if (lastLog.includes('主炮') || lastLog.includes('💥')) {
            effectType = 'explosion';
          } else if (lastLog.includes('副炮') || lastLog.includes('🔫')) {
            effectType = 'shoot';
          } else if (lastLog.includes('SE') || lastLog.includes('💣')) {
            if (currentTank?.se?.id === 's2') {
              effectType = 'fire';
            } else {
              effectType = 'explosion';
            }
          } else {
            if (playerEquip.weapon) {
              const weaponId = playerEquip.weapon.id;
              if (['wp1', 'wp2'].includes(weaponId)) {
                effectType = 'slash';
              } else {
                effectType = 'shoot';
              }
            } else {
              effectType = 'slash';
            }
          }
        } else {
          position = 'player';
          effectType = 'slash';
        }
        
        // 播放攻击特效
        setCurrentEffect({ type: effectType, position, visible: true });
        
        // 300ms后显示命中特效
        setTimeout(() => {
          setCurrentEffect({ type: 'hit', position, visible: true });
          
          // 再400ms后清除特效
          setTimeout(() => {
            setCurrentEffect(null);
          }, 400);
        }, 300);
      } else if (lastLog && (lastLog.includes('闪避') || lastLog.includes('💨'))) {
        // 闪避特效
        let position: 'enemy' | 'player' = 'player';
        if (lastLog.includes('你闪避')) {
          position = 'enemy';
        }
        setCurrentEffect({ type: 'miss', position, visible: true });
        
        setTimeout(() => {
          setCurrentEffect(null);
        }, 500);
      } else if (lastLog && (lastLog.includes('暴击'))) {
        // 暴击时播放爆炸特效
        setCurrentEffect({ type: 'explosion', position: 'enemy', visible: true });
        
        setTimeout(() => {
          setCurrentEffect({ type: 'hit', position: 'enemy', visible: true });
          
          setTimeout(() => {
            setCurrentEffect(null);
          }, 400);
        }, 300);
      }
    }
    setPrevLogLength(battleLog.length);
  }, [battleLog.length, battleLog, playerEquip.weapon, currentTank?.se]);
  
  // 当战斗结束时，清除特效
  useEffect(() => {
    if (!battle) {
      setCurrentEffect(null);
      setPrevLogLength(0);
    }
  }, [battle]);

  return (
    <div className="bg-gray-900 border-4 border-gray-600 rounded-xl shadow-2xl w-full max-w-lg mx-4 overflow-hidden relative">
      <div className="bg-red-900/30 px-4 py-2 border-b border-gray-600 flex justify-between items-center">
        <span className="text-red-400 font-bold text-sm">⚔️ 战斗</span>
        <div className="flex items-center gap-2">
          {useTank && <span className="text-blue-400 text-xs font-bold">🎖️ 战车战</span>}
          {isBoss && <span className="text-yellow-400 font-bold text-sm animate-pulse">⚠️ BOSS</span>}
        </div>
      </div>

      {currentEffect && (
        <BattleEffect
          type={currentEffect.type}
          position={currentEffect.position}
          visible={currentEffect.visible}
        />
      )}

      <div className="p-4 space-y-4">
        <div className="bg-gray-800 rounded-lg p-3 border border-gray-700">
          <div className="flex items-center gap-3 mb-2">
            <Portrait id={enemy.portraitId || enemy.id} size="lg" />
            <div className="flex-1">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-white">{enemy.name}</span>
                  {isBoss && enemy.bounty && (
                    <span className="text-xs text-yellow-400">💰{enemy.bounty}</span>
                  )}
                </div>
                <div className="text-right text-xs text-gray-400">
                  HP {enemy.hp}/{enemy.maxHp}
                </div>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-3 overflow-hidden mt-1">
                <div
                  className={`h-full rounded-full transition-all duration-300 ${enemyHpPercent < 30 ? 'bg-red-500' : 'bg-red-600'}`}
                  style={{ width: `${enemyHpPercent}%` }}
                />
              </div>
              {enemy.statusEffects && enemy.statusEffects.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-1.5">
                  {enemy.statusEffects.map((effect) => {
                    const effectInfo = statusEffectIcons[effect.type] || { icon: '❓', color: 'text-gray-400' };
                    return (
                      <div
                        key={effect.id}
                        className={`flex items-center gap-0.5 px-1.5 py-0.5 bg-gray-700/50 rounded text-xs ${effectInfo.color}`}
                        title={`${effect.name} - 剩余${effect.remainingTurns}回合`}
                      >
                        <span>{effectInfo.icon}</span>
                        <span>{effect.remainingTurns}</span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="bg-gray-800 rounded-lg p-3 border border-gray-700">
          <div className="flex items-center gap-3 mb-2">
            <Portrait id={useTank && currentTank ? 'tank' : (player.portraitId || 'hunter')} size="lg" />
            <div className="flex-1">
              <div className="flex justify-between items-start">
                <span className="font-bold text-white">
                  {useTank && currentTank ? currentTank.name : player.name}
                </span>
                <div className="text-right text-xs text-gray-400">
                  {useTank && currentTank
                    ? `装甲 ${currentTank.armor}/${currentTank.maxArmor}`
                    : `HP ${player.hp}/${player.maxHp}`
                  }
                </div>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-3 overflow-hidden mt-1">
                <div
                  className={`h-full rounded-full transition-all duration-300 ${useTank && currentTank ? 'bg-blue-600' : 'bg-green-500'}`}
                  style={{
                    width: `${useTank && currentTank ? (currentTank.armor / currentTank.maxArmor) * 100 : (player.hp / player.maxHp) * 100}%`
                  }}
                />
              </div>
              {!useTank && playerStatusEffects.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-1.5">
                  {playerStatusEffects.map((effect) => {
                    const effectInfo = statusEffectIcons[effect.type] || { icon: '❓', color: 'text-gray-400' };
                    return (
                      <div
                        key={effect.id}
                        className={`flex items-center gap-0.5 px-1.5 py-0.5 bg-gray-700/50 rounded text-xs ${effectInfo.color}`}
                        title={`${effect.name} - 剩余${effect.remainingTurns}回合`}
                      >
                        <span>{effectInfo.icon}</span>
                        <span>{effect.remainingTurns}</span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>

        {recentLogs.length > 0 && (
          <div className="bg-black/40 rounded-lg p-2 border border-gray-700 max-h-20 overflow-y-auto">
            {recentLogs.map((msg, i) => (
              <p key={i} className={`text-xs ${
                msg.includes('伤害') || msg.includes('💥') || msg.includes('💣') ? 'text-orange-400' :
                msg.includes('击败') || msg.includes('🎉') || msg.includes('🏆') ? 'text-green-400' :
                msg.includes('BOSS') || msg.includes('⚠️') ? 'text-red-400' :
                msg.includes('弹药') || msg.includes('📦') ? 'text-yellow-400' :
                msg.includes('副炮') || msg.includes('🔫') ? 'text-cyan-400' :
                msg.includes('💊') || msg.includes('🔧') ? 'text-blue-400' :
                msg.includes('🏃') ? 'text-yellow-400' :
                'text-gray-300'
              }`}>
                {msg}
              </p>
            ))}
          </div>
        )}

        <div className="text-center">
          <span className={`text-sm font-bold ${turn === 'player' ? 'text-green-400' : 'text-yellow-400 animate-pulse'}`}>
            {turn === 'player' ? '👉 选择指令' : '⏳ 敌人行动中...'}
          </span>
        </div>

        {turn === 'player' && (
          <div className="space-y-2">
            {useTank ? (
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={mainCannonAttack}
                  disabled={!hasMainCannon || mainAmmo <= 0}
                  className={`font-bold py-3 px-3 rounded-lg border-b-2 transition-all text-sm ${
                    hasMainCannon && mainAmmo > 0
                      ? 'bg-red-700 hover:bg-red-600 text-white border-red-900 hover:border-red-800'
                      : 'bg-gray-700 text-gray-500 cursor-not-allowed border-gray-800'
                  }`}
                >
                  <div className="text-base mb-0.5">💥</div>
                  <div>主炮</div>
                  <div className="text-xs font-normal opacity-80">
                    {hasMainCannon ? `📦${mainAmmo}发` : '未装备'}
                  </div>
                </button>
                <button
                  onClick={subCannonAttack}
                  disabled={!hasSubCannon}
                  className={`font-bold py-3 px-3 rounded-lg border-b-2 transition-all text-sm ${
                    hasSubCannon
                      ? 'bg-cyan-700 hover:bg-cyan-600 text-white border-cyan-900 hover:border-cyan-800'
                      : 'bg-gray-700 text-gray-500 cursor-not-allowed border-gray-800'
                  }`}
                >
                  <div className="text-base mb-0.5">🔫</div>
                  <div>副炮</div>
                  <div className="text-xs font-normal opacity-80">
                    {hasSubCannon ? `${currentTank?.subWeapon?.name}` : '未装备'}
                  </div>
                </button>
                <button
                  onClick={seAttack}
                  disabled={!hasSe || seAmmo <= 0}
                  className={`font-bold py-3 px-3 rounded-lg border-b-2 transition-all text-sm ${
                    hasSe && seAmmo > 0
                      ? 'bg-purple-700 hover:bg-purple-600 text-white border-purple-900 hover:border-purple-800'
                      : 'bg-gray-700 text-gray-500 cursor-not-allowed border-gray-800'
                  }`}
                >
                  <div className="text-base mb-0.5">💣</div>
                  <div>SE</div>
                  <div className="text-xs font-normal opacity-80">
                    {hasSe ? `📦${seAmmo}发` : '未装备'}
                  </div>
                </button>
                <button
                  onClick={defend}
                  className="bg-yellow-700 hover:bg-yellow-600 text-white font-bold py-3 px-3 rounded-lg border-b-2 border-yellow-900 hover:border-yellow-800 transition-all text-sm"
                >
                  <div className="text-base mb-0.5">🛡️</div>
                  <div>防御</div>
                  <div className="text-xs font-normal opacity-80">伤害减半</div>
                </button>
                <button
                  onClick={flee}
                  disabled={isBoss}
                  className={`font-bold py-3 px-3 rounded-lg border-b-2 transition-all text-sm col-span-2 ${
                    isBoss
                      ? 'bg-gray-600 text-gray-400 cursor-not-allowed border-gray-700'
                      : 'bg-gray-700 hover:bg-gray-600 text-white border-gray-900 hover:border-gray-800'
                  }`}
                >
                  🏃 {isBoss ? '无法撤退' : '撤退'}
                </button>
              </div>
            ) : (
              <div className="space-y-2">
                <div className="grid grid-cols-3 gap-2">
                  <button
                    onClick={attack}
                    className="bg-red-700 hover:bg-red-600 text-white font-bold py-2.5 px-3 rounded-lg border-b-2 border-red-900 hover:border-red-800 transition-all text-sm"
                  >
                    ⚔️ 攻击
                  </button>
                  <button
                    onClick={flee}
                    disabled={isBoss}
                    className={`font-bold py-2.5 px-3 rounded-lg border-b-2 transition-all text-sm ${
                      isBoss
                        ? 'bg-gray-600 text-gray-400 cursor-not-allowed border-gray-700'
                        : 'bg-gray-700 hover:bg-gray-600 text-white border-gray-900 hover:border-gray-800'
                    }`}
                  >
                    🏃 {isBoss ? '无法撤退' : '撤退'}
                  </button>
                  <button
                    onClick={defend}
                    className="bg-yellow-700 hover:bg-yellow-600 text-white font-bold py-2.5 px-3 rounded-lg border-b-2 border-yellow-900 hover:border-yellow-800 transition-all text-sm"
                  >
                    🛡️ 防御
                  </button>
                </div>

                {inventory.filter(item => item.item.type === 'consumable').length > 0 && (
                  <div>
                    <h4 className="text-yellow-400 font-bold text-xs mb-1.5">🎒 道具</h4>
                    <div className="flex flex-wrap gap-1.5">
                      {inventory
                        .filter(item => item.item.type === 'consumable')
                        .map(invItem => (
                          <button
                            key={invItem.item.id}
                            onClick={() => useItem(invItem.item)}
                            className="bg-green-800 hover:bg-green-700 text-white font-medium py-1 px-2.5 rounded border-b-2 border-green-900 transition-all text-xs"
                          >
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