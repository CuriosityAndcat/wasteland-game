import React from 'react';
import { useGameStore } from '../store/useGameStore';
import Portrait from './Portrait';

const StatusPanel: React.FC = () => {
  const { player, members, currentMemberIndex, playerEquip, tanks, currentTankIndex, currentLocationId: currentLocation, isOnTank, tankLocation, switchMember, switchTank } = useGameStore();

  const currentMember = members[currentMemberIndex] || player;

  const totalAttack = currentMember.attack + (playerEquip.weapon?.value || 0);
  const totalDefense = currentMember.defense +
    (playerEquip.head?.value || 0) +
    (playerEquip.body?.value || 0) +
    (playerEquip.hand?.value || 0) +
    (playerEquip.foot?.value || 0);

  const expPercent = Math.min(100, (currentMember.exp / (currentMember.level * 50)) * 100);
  const hpPercent = (currentMember.hp / currentMember.maxHp) * 100;

  const currentTank = tanks[currentTankIndex];
  const tankArmorPercent = currentTank ? (currentTank.armor / currentTank.maxArmor) * 100 : 0;

  const equipDef = (playerEquip.head?.value || 0) + (playerEquip.body?.value || 0) +
    (playerEquip.hand?.value || 0) + (playerEquip.foot?.value || 0);

  const isTankAvailable = isOnTank || (tankLocation === currentLocation);

  return (
    <div className="bg-gray-800 border border-gray-600 rounded-lg overflow-hidden">
      <div className="bg-gray-750 px-3 py-2 border-b border-gray-700">
        <h3 className="text-yellow-400 font-bold text-xs tracking-wide">状态面板</h3>
      </div>

      <div className="p-3 space-y-3">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Portrait id={currentMember.portraitId || 'hunter'} size="sm" />
            <div>
              <span className="font-bold text-green-400 text-sm">{currentMember.name}</span>
              <span className="text-yellow-400 text-xs ml-1.5">Lv.{currentMember.level}</span>
              <span className="text-gray-500 text-xs ml-1">({currentMember.role})</span>
            </div>
          </div>

          <div className="space-y-1.5">
            <div>
              <div className="flex justify-between text-xs text-gray-400 mb-0.5">
                <span>HP</span>
                <span className={currentMember.hp < currentMember.maxHp * 0.3 ? 'text-red-400' : ''}>{currentMember.hp}/{currentMember.maxHp}</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-1.5">
                <div className={`h-1.5 rounded-full transition-all ${hpPercent < 30 ? 'bg-red-500' : 'bg-green-500'}`} style={{ width: `${hpPercent}%` }} />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-xs text-gray-400 mb-0.5">
                <span>EXP</span>
                <span>{currentMember.exp}/{currentMember.level * 50}</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-1.5">
                <div className="bg-blue-500 h-1.5 rounded-full transition-all" style={{ width: `${expPercent}%` }} />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-x-2 gap-y-1 text-xs pt-1">
              <div className="flex justify-between text-gray-300">
                <span>💰 金币</span>
                <span className="text-yellow-400 font-medium">{player.gold}</span>
              </div>
              <div className="flex justify-between text-gray-300">
                <span>⚔️ 攻击</span>
                <span>
                  {totalAttack}
                  {playerEquip.weapon && <span className="text-green-400 text-xs ml-0.5">(+{playerEquip.weapon.value})</span>}
                </span>
              </div>
              <div className="flex justify-between text-gray-300 col-span-2">
                <span>🛡️ 防御</span>
                <span>
                  {totalDefense}
                  {equipDef > 0 && <span className="text-green-400 text-xs ml-0.5">(+{equipDef})</span>}
                </span>
              </div>
            </div>
          </div>

          {(playerEquip.weapon || playerEquip.head || playerEquip.body || playerEquip.hand || playerEquip.foot) && (
            <div className="mt-2 pt-2 border-t border-gray-700">
              <h4 className="text-yellow-400 text-xs font-bold mb-1">装备</h4>
              <div className="space-y-0.5 text-xs text-gray-400">
                {playerEquip.weapon && (
                  <div className="flex justify-between">
                    <span className="text-gray-500">武器</span>
                    <span className="text-yellow-400">{playerEquip.weapon.name}</span>
                  </div>
                )}
                {playerEquip.head && (
                  <div className="flex justify-between">
                    <span className="text-gray-500">头</span>
                    <span className="text-cyan-400">{playerEquip.head.name}</span>
                  </div>
                )}
                {playerEquip.body && (
                  <div className="flex justify-between">
                    <span className="text-gray-500">身</span>
                    <span className="text-cyan-400">{playerEquip.body.name}</span>
                  </div>
                )}
                {playerEquip.hand && (
                  <div className="flex justify-between">
                    <span className="text-gray-500">手</span>
                    <span className="text-cyan-400">{playerEquip.hand.name}</span>
                  </div>
                )}
                {playerEquip.foot && (
                  <div className="flex justify-between">
                    <span className="text-gray-500">脚</span>
                    <span className="text-cyan-400">{playerEquip.foot.name}</span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {currentTank && isTankAvailable && (
          <div className="pt-2 border-t border-gray-700">
            <div className="flex items-center gap-2 mb-2">
              <Portrait id="tank" size="sm" />
              <span className="font-bold text-blue-400 text-sm">{currentTank.name}</span>
            </div>
            <div className="space-y-1.5">
              <div>
                <div className="flex justify-between text-xs text-gray-400 mb-0.5">
                  <span>装甲</span>
                  <span>{currentTank.armor}/{currentTank.maxArmor}</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-1.5">
                  <div className={`h-1.5 rounded-full transition-all ${tankArmorPercent < 30 ? 'bg-red-500' : 'bg-blue-600'}`} style={{ width: `${tankArmorPercent}%` }} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-x-2 gap-y-1 text-xs">
                <div className="flex justify-between text-gray-300">
                  <span>⚔️ 攻击</span>
                  <span>{currentTank.attack + (currentTank.weapon?.value || 0) + (currentTank.se?.value || 0)}</span>
                </div>
                <div className="flex justify-between text-gray-300">
                  <span>🛡️ 防御</span>
                  <span>{currentTank.defense + (currentTank.engine?.value || 0) + (currentTank.cDevice?.value || 0)}</span>
                </div>
              </div>
              <div className="text-xs text-gray-500 space-y-0.5">
                <div className="flex justify-between">
                  <span>主炮</span>
                  <span className={currentTank.weapon ? 'text-yellow-400' : 'text-gray-600'}>
                    {currentTank.weapon ? `${currentTank.weapon.name} 📦${currentTank.mainCannonAmmo ?? 0}发` : '无'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>副炮</span>
                  <span className={currentTank.subWeapon ? 'text-cyan-400' : 'text-gray-600'}>
                    {currentTank.subWeapon ? currentTank.subWeapon.name : '无'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>引擎</span>
                  <span className={currentTank.engine ? 'text-green-400' : 'text-gray-600'}>{currentTank.engine ? currentTank.engine.name : '无'}</span>
                </div>
                <div className="flex justify-between">
                  <span>C装置</span>
                  <span className={currentTank.cDevice ? 'text-purple-400' : 'text-gray-600'}>{currentTank.cDevice ? currentTank.cDevice.name : '无'}</span>
                </div>
                <div className="flex justify-between">
                  <span>SE</span>
                  <span className={currentTank.se ? 'text-orange-400' : 'text-gray-600'}>
                    {currentTank.se ? `${currentTank.se.name} 📦${currentTank.seAmmo ?? 0}发` : '无'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {currentTank && !isTankAvailable && (
          <div className="pt-2 border-t border-gray-700">
            <div className="flex items-center gap-2 mb-2">
              <Portrait id="tank" size="sm" />
              <div>
                <span className="font-bold text-blue-400 text-sm">{currentTank.name}</span>
                <div className="text-yellow-400 text-xs">🅿️ 战车停留在别处</div>
              </div>
            </div>
          </div>
        )}

        {members.length > 1 && (
          <div className="pt-2 border-t border-gray-700">
            <h4 className="text-yellow-400 font-bold text-xs mb-1.5">同伴</h4>
            <div className="flex flex-wrap gap-1.5">
              {members.map((member, index) => (
                <button
                  key={member.id}
                  onClick={() => switchMember(index)}
                  className={`px-2 py-0.5 rounded text-xs font-medium transition-all ${
                    index === currentMemberIndex
                      ? 'bg-green-600 text-white'
                      : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  }`}
                >
                  {member.name}
                  <span className="ml-1 opacity-75">Lv.{member.level}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {tanks.length > 1 && (
          <div className="pt-2 border-t border-gray-700">
            <h4 className="text-yellow-400 font-bold text-xs mb-1.5">战车</h4>
            <div className="flex flex-wrap gap-1.5">
              {tanks.map((tank, index) => (
                <button
                  key={tank.id}
                  onClick={() => switchTank(index)}
                  className={`px-2 py-0.5 rounded text-xs font-medium transition-all ${
                    index === currentTankIndex
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  }`}
                >
                  {tank.name.split(' ')[0]}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StatusPanel;