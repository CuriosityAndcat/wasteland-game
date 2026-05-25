import React, { useState } from 'react';
import { useGameStore } from '../store/useGameStore';
import Portrait from './Portrait';
import NameInput from './NameInput';
import { Item } from '../types';
import QuestPanel from './QuestPanel';
import GameIcon from './GameIcon';

type MenuTab = 'status' | 'items' | 'tank' | 'equip' | 'ride' | 'quest' | 'save';

const tabs: { id: MenuTab; label: string; icon: string }[] = [
  { id: 'status', label: '状态', icon: '👤' },
  { id: 'items', label: '背包', icon: '🎒' },
  { id: 'tank', label: '战车', icon: '🎖️' },
  { id: 'equip', label: '装备', icon: '⚔️' },
  { id: 'ride', label: '乘降', icon: '🚗' },
  { id: 'quest', label: '任务', icon: '📜' },
  { id: 'save', label: '存档', icon: '💾' },
];

const MenuScreen: React.FC = () => {
  const {
    player, members, currentMemberIndex, playerEquip,
    tanks, currentTankIndex, isOnTank, tankLocation,
    locations, closeMenu, toggleRideTank, switchTank, switchMember,
    renamePlayer, renameTank, unequipItem, saveGame, loadGame, hasSaveData,
    inventory, equipItem, useItem, currentLocationId
  } = useGameStore();

  const [activeTab, setActiveTab] = useState<MenuTab>('status');
  const [showRenamePlayer, setShowRenamePlayer] = useState(false);
  const [showRenameTank, setShowRenameTank] = useState(false);
  const [saveMsg, setSaveMsg] = useState('');
  const [loadMsg, setLoadMsg] = useState('');
  const [itemCategory, setItemCategory] = useState<string>('all');
  const currentMember = members[currentMemberIndex] || player;
  const currentTank = tanks[currentTankIndex];

  const totalAttack = currentMember.attack + (playerEquip.weapon?.value || 0);
  const totalDefense = currentMember.defense +
    (playerEquip.head?.value || 0) + (playerEquip.body?.value || 0) +
    (playerEquip.hand?.value || 0) + (playerEquip.foot?.value || 0);
  const drivingBonusAttack = (currentMember.drivingLevel || 1) * 2;
  const drivingBonusDefense = (currentMember.drivingLevel || 1) * 1;

  const tankLocationName = tankLocation
    ? locations.find(l => l.id === tankLocation)?.name || tankLocation
    : null;

  const expPercent = Math.min(100, (currentMember.exp / (currentMember.level * 50)) * 100);
  const hpPercent = (currentMember.hp / currentMember.maxHp) * 100;

  const tankArmorPercent = currentTank ? (currentTank.armor / currentTank.maxArmor) * 100 : 0;
  const equipDef = (playerEquip.head?.value || 0) + (playerEquip.body?.value || 0) +
    (playerEquip.hand?.value || 0) + (playerEquip.foot?.value || 0);
  const isTankAvailable = isOnTank || (tankLocation === currentLocationId);

  const categories = [
    { id: 'all', name: '全部' },
    { id: 'consumable', name: '消耗品' },
    { id: 'humanWeapon', name: '武器' },
    { id: 'head', name: '头部' },
    { id: 'body', name: '身体' },
    { id: 'hand', name: '手部' },
    { id: 'foot', name: '脚部' },
  ];

  const filteredItems = itemCategory === 'all'
    ? inventory
    : inventory.filter(item => item.item.type === itemCategory);

  const getItemTypeColor = (type: string): string => {
    switch(type) {
      case 'consumable': return 'bg-green-700 hover:bg-green-600';
      case 'humanWeapon': return 'bg-indigo-700 hover:bg-indigo-600';
      case 'weapon': return 'bg-red-700 hover:bg-red-600';
      case 'head': return 'bg-cyan-700 hover:bg-cyan-600';
      case 'body': return 'bg-teal-700 hover:bg-teal-600';
      case 'hand': return 'bg-yellow-700 hover:bg-yellow-600';
      case 'foot': return 'bg-pink-700 hover:bg-pink-600';
      default: return 'bg-gray-700 hover:bg-gray-600';
    }
  };

  const handleItemClick = (item: Item) => {
    if (item.type === 'consumable') {
      useItem(item);
    } else {
      equipItem(item);
    }
  };

  const renderStatusTab = () => {
    return (
      <div className="space-y-3">
        <div className="bg-gray-800 rounded-lg p-3 border border-gray-700">
          <div className="flex items-center gap-3 mb-3">
            <Portrait id={currentMember.portraitId || 'hunter'} size="md" />
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <span className="font-bold text-green-400 text-sm">{currentMember.name}</span>
                <span className="text-yellow-400 text-xs ml-1.5">Lv.{currentMember.level}</span>
              </div>
              <span className="text-gray-500 text-xs">{currentMember.role}</span>
              <div className="flex items-center gap-2 mt-1">
                <button
                  onClick={() => setShowRenamePlayer(true)}
                  className="text-xs text-gray-500 hover:text-yellow-400 transition-all px-1.5 py-0.5 rounded hover:bg-gray-700"
                >
                  ✏️ 改名
                </button>
              </div>
            </div>
          </div>

          <div className="space-y-1.5">
            <div>
              <div className="flex justify-between text-xs text-gray-400 mb-0.5">
                <span>HP</span>
                <span className={currentMember.hp < currentMember.maxHp * 0.3 ? 'text-red-400' : ''}>
                  {currentMember.hp}/{currentMember.maxHp}
                </span>
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
        </div>

        {(playerEquip.weapon || playerEquip.head || playerEquip.body || playerEquip.hand || playerEquip.foot) && (
          <div className="bg-gray-800 rounded-lg p-3 border border-gray-700">
            <h4 className="text-yellow-400 text-xs font-bold mb-2">已装备</h4>
            <div className="space-y-0.5 text-xs text-gray-400">
              {playerEquip.weapon && (
                <div className="flex justify-between">
                  <span className="text-gray-500">⚔️ 武器</span>
                  <span className="text-yellow-400">{playerEquip.weapon.name}</span>
                </div>
              )}
              {playerEquip.head && (
                <div className="flex justify-between">
                  <span className="text-gray-500">🪖 头部</span>
                  <span className="text-cyan-400">{playerEquip.head.name}</span>
                </div>
              )}
              {playerEquip.body && (
                <div className="flex justify-between">
                  <span className="text-gray-500">👕 身体</span>
                  <span className="text-cyan-400">{playerEquip.body.name}</span>
                </div>
              )}
              {playerEquip.hand && (
                <div className="flex justify-between">
                  <span className="text-gray-500">🧤 手部</span>
                  <span className="text-cyan-400">{playerEquip.hand.name}</span>
                </div>
              )}
              {playerEquip.foot && (
                <div className="flex justify-between">
                  <span className="text-gray-500">👢 脚部</span>
                  <span className="text-cyan-400">{playerEquip.foot.name}</span>
                </div>
              )}
            </div>
          </div>
        )}

        {currentTank && isTankAvailable && (
          <div className="bg-gray-800 rounded-lg p-3 border border-gray-700">
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
            </div>
          </div>
        )}

        {currentTank && !isTankAvailable && (
          <div className="bg-gray-800 rounded-lg p-3 border border-gray-700">
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
          <div className="bg-gray-800 rounded-lg p-3 border border-gray-700">
            <h4 className="text-yellow-400 text-xs font-bold mb-1.5">同伴</h4>
            <div className="flex flex-wrap gap-1.5">
              {members.map((member, index) => (
                <button
                  key={member.id}
                  onClick={() => switchMember(index)}
                  className={`px-2 py-0.5 rounded text-xs font-medium transition-all flex items-center gap-1 ${
                    index === currentMemberIndex
                      ? 'bg-green-600 text-white'
                      : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  }`}
                >
                  <Portrait id={member.portraitId || 'hunter'} size="sm" className="!w-5 !h-5" />
                  {member.name}
                </button>
              ))}
            </div>
          </div>
        )}

        {tanks.length > 1 && (
          <div className="bg-gray-800 rounded-lg p-3 border border-gray-700">
            <h4 className="text-yellow-400 text-xs font-bold mb-1.5">战车</h4>
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
    );
  };

  const renderItemsTab = () => {
    return (
      <div className="space-y-3">
        <div className="px-3 py-2 flex-shrink-0">
          <div className="flex flex-wrap gap-1.5">
            {categories.map(category => (
              <button
                key={category.id}
                onClick={() => setItemCategory(category.id)}
                className={`px-2.5 py-1 rounded-full text-xs font-medium transition-all ${
                  itemCategory === category.id
                    ? 'bg-orange-600 text-white'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>

        {filteredItems.length === 0 ? (
          <div className="text-center py-8 text-gray-400 text-sm">
            背包中没有这个类别的物品
          </div>
        ) : (
          <div className="space-y-1.5">
            {filteredItems.map((invItem, index) => (
              <div
                key={`${invItem.item.id}-${index}`}
                className="bg-gray-800 rounded-lg p-3 border border-gray-700 flex items-center justify-between"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white text-sm">{invItem.item.name}</span>
                    <span className="text-yellow-400 text-xs font-medium">x{invItem.quantity}</span>
                  </div>
                  <p className="text-xs text-gray-400 truncate">{invItem.item.description}</p>
                </div>
                <button
                  onClick={() => handleItemClick(invItem.item)}
                  className={`flex-shrink-0 ml-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all text-white ${getItemTypeColor(invItem.item.type)}`}
                >
                  {invItem.item.type === 'consumable' ? '使用' : '装备'}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  const renderTankTab = () => {
    if (tanks.length === 0) {
      return (
        <div className="text-center py-8 text-gray-500">
          <p className="text-4xl mb-2">🎖️</p>
          <p>还没有获得战车</p>
        </div>
      );
    }

    return (
      <div className="space-y-3">
        {tanks.length > 1 && (
          <div className="flex flex-wrap gap-1.5">
            {tanks.map((tank, index) => (
              <button
                key={tank.id}
                onClick={() => switchTank(index)}
                className={`px-2.5 py-1 rounded text-xs font-medium transition-all ${
                  index === currentTankIndex
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                {tank.name}
              </button>
            ))}
          </div>
        )}

        {currentTank && (
          <div className="bg-gray-800 rounded-lg p-3 border border-gray-700">
            <div className="flex items-center gap-3 mb-3">
              <Portrait id="tank" size="md" />
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <div className="text-white font-bold text-sm">{currentTank.name}</div>
                  <button
                    onClick={() => setShowRenameTank(true)}
                    className="text-xs text-gray-500 hover:text-yellow-400 transition-all px-1.5 py-0.5 rounded hover:bg-gray-700"
                  >
                    ✏️ 改名
                  </button>
                </div>
                <div className={`text-xs font-medium ${isOnTank ? 'text-green-400' : 'text-yellow-400'}`}>
                  {isOnTank ? '✅ 乘車中' : '❌ 降車中'}
                </div>
              </div>
            </div>

            <div className="mb-2">
              <div className="flex justify-between text-xs text-gray-400 mb-0.5">
                <span>装甲</span>
                <span>{currentTank.armor} / {currentTank.maxArmor}</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div
                  className={`h-2 rounded-full ${(currentTank.armor / currentTank.maxArmor) < 0.3 ? 'bg-red-500' : 'bg-blue-500'}`}
                  style={{ width: `${(currentTank.armor / currentTank.maxArmor) * 100}%` }}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="bg-gray-900 rounded p-2">
                <span className="text-gray-500">⚔️ 攻击力</span>
                <div className="text-orange-400 font-bold mt-0.5">
                  {currentTank.attack + (currentTank.weapon?.value || 0) + (currentTank.se?.value || 0)}
                </div>
                <div className="text-cyan-400 text-[10px]">🚗 驾驶加成：+{drivingBonusAttack}</div>
              </div>
              <div className="bg-gray-900 rounded p-2">
                <span className="text-gray-500">🛡️ 防御力</span>
                <div className="text-blue-400 font-bold mt-0.5">
                  {currentTank.defense + (currentTank.engine?.value || 0) + (currentTank.cDevice?.value || 0)}
                </div>
                <div className="text-cyan-400 text-[10px]">🚗 驾驶加成：+{drivingBonusDefense}</div>
              </div>
            </div>

            <div className="mt-2 space-y-1 text-xs">
              <div className="flex justify-between bg-gray-900 rounded px-2 py-1.5">
                <span>主炮</span>
                <span className={currentTank.weapon ? 'text-yellow-400' : 'text-gray-600'}>
                  {currentTank.weapon ? `${currentTank.weapon.name} 📦${currentTank.mainCannonAmmo ?? 0}发` : '未装备'}
                </span>
              </div>
              <div className="flex justify-between bg-gray-900 rounded px-2 py-1.5">
                <span>副炮</span>
                <span className={currentTank.subWeapon ? 'text-cyan-400' : 'text-gray-600'}>
                  {currentTank.subWeapon ? currentTank.subWeapon.name : '未装备'}
                </span>
              </div>
              <div className="flex justify-between bg-gray-900 rounded px-2 py-1.5">
                <span>引擎</span>
                <span className={currentTank.engine ? 'text-green-400' : 'text-gray-600'}>
                  {currentTank.engine ? currentTank.engine.name : '未装备'}
                </span>
              </div>
              <div className="flex justify-between bg-gray-900 rounded px-2 py-1.5">
                <span>C装置</span>
                <span className={currentTank.cDevice ? 'text-purple-400' : 'text-gray-600'}>
                  {currentTank.cDevice ? currentTank.cDevice.name : '未装备'}
                </span>
              </div>
              <div className="flex justify-between bg-gray-900 rounded px-2 py-1.5">
                <span>SE</span>
                <span className={currentTank.se ? 'text-orange-400' : 'text-gray-600'}>
                  {currentTank.se ? `${currentTank.se.name} 📦${currentTank.seAmmo ?? 0}发` : '未装备'}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderEquipTab = () => {
    const slots: { key: keyof typeof playerEquip; label: string; icon: string }[] = [
      { key: 'weapon', label: '武器', icon: '⚔️' },
      { key: 'head', label: '头部', icon: '🪖' },
      { key: 'body', label: '身体', icon: '👕' },
      { key: 'hand', label: '手部', icon: '🧤' },
      { key: 'foot', label: '脚部', icon: '👢' },
    ];

    return (
      <div className="space-y-2">
        <div className="flex items-center gap-2 pb-2 border-b border-gray-700">
          <Portrait id={currentMember.portraitId || 'hunter'} size="sm" />
          <span className="text-white font-bold text-sm">{currentMember.name} 的装备</span>
        </div>
        {slots.map(slot => {
          const item = playerEquip[slot.key];
          return (
            <div key={slot.key} className="bg-gray-800 rounded-lg p-2.5 border border-gray-700 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-base">{slot.icon}</span>
                <div>
                  <div className="text-gray-500 text-xs">{slot.label}</div>
                  <div className={item ? 'text-white text-sm font-medium' : 'text-gray-600 text-sm'}>
                    {item ? item.name : '未装备'}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {item && (
                  <>
                    <div className="text-right">
                      <div className="text-green-400 text-xs">
                        {item.type === 'humanWeapon' ? `ATK+${item.value}` : `DEF+${item.value}`}
                      </div>
                      <div className="text-gray-600 text-xs">{item.description}</div>
                    </div>
                    <button
                      onClick={() => unequipItem(slot.key)}
                      className="bg-red-800 hover:bg-red-700 text-white px-2 py-1 rounded text-xs transition-all"
                    >
                      卸下
                    </button>
                  </>
                )}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  const renderRideTab = () => {
    if (tanks.length === 0) {
      return (
        <div className="text-center py-8 text-gray-500">
          <p className="text-4xl mb-2">🚗</p>
          <p>还没有战车</p>
          <p className="text-xs mt-2">去废弃矿洞寻找第一辆战车吧！</p>
        </div>
      );
    }

    return (
      <div className="space-y-3">
        <div className="bg-gray-800 rounded-lg p-3 border border-gray-700">
          <div className="flex items-center gap-3 mb-3">
            <Portrait id="tank" size="md" />
            <div>
              <div className="text-white font-bold text-sm">{currentTank?.name}</div>
              <div className={`text-xs font-medium ${isOnTank ? 'text-green-400' : 'text-yellow-400'}`}>
                {isOnTank ? '✅ 当前状态：乘車中' : '❌ 当前状态：降車中'}
              </div>
            </div>
          </div>

          {!isOnTank && tankLocationName && (
            <div className="bg-yellow-900/30 border border-yellow-700/50 rounded-lg p-2 mb-3">
              <p className="text-yellow-300 text-xs">
                🅿️ 战车停留在：{tankLocationName}
              </p>
              <p className="text-gray-400 text-xs mt-0.5">返回该地点即可重新乘上战车</p>
            </div>
          )}

          <button
            onClick={toggleRideTank}
            className={`w-full font-bold py-3 px-4 rounded-lg border-b-2 transition-all text-sm ${
              isOnTank
                ? 'bg-yellow-700 hover:bg-yellow-600 text-white border-yellow-900'
                : 'bg-green-700 hover:bg-green-600 text-white border-green-900'
            }`}
          >
            {isOnTank ? '⬇️ 从战车上下来' : '⬆️ 乘上战车'}
          </button>
        </div>

        {tanks.length > 1 && (
          <div className="bg-gray-800 rounded-lg p-3 border border-gray-700">
            <div className="text-gray-500 text-xs mb-1.5">🎖️ 战车列表</div>
            <div className="space-y-1.5">
              {tanks.map((tank, index) => (
                <button
                  key={tank.id}
                  onClick={() => switchTank(index)}
                  className={`w-full flex items-center justify-between p-2 rounded-lg text-xs transition-all ${
                    index === currentTankIndex
                      ? 'bg-blue-700/50 border border-blue-600'
                      : 'bg-gray-700 hover:bg-gray-600 border border-transparent'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span>🎖️</span>
                    <span className="text-white font-medium">{tank.name}</span>
                  </div>
                  <div className="text-gray-400">
                    装甲 {tank.armor}/{tank.maxArmor}
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="bg-gray-800 rounded-lg p-3 border border-gray-700">
          <div className="text-gray-500 text-xs mb-1.5">📖 乘降说明</div>
          <ul className="text-xs text-gray-400 space-y-1">
            <li>• 乘車中：战车跟随你移动，战斗中可使用战车</li>
            <li>• 降車中：战车停留在原地，战斗中只能徒步</li>
            <li>• 降車后移动到其他地点，战车不会跟随</li>
            <li>• 返回战车停留的地点即可重新乘上</li>
          </ul>
        </div>
      </div>
    );
  };

  const renderSaveTab = () => {
    const hasSave = hasSaveData();
    return (
      <div className="space-y-3">
        <div className="text-center mb-2">
          <p className="text-gray-400 text-xs font-bold">💾 存档管理</p>
        </div>
        <div className="bg-blue-900/30 rounded-lg p-4 border border-blue-700/50">
          <p className="text-blue-300 text-xs font-bold mb-2">📂 保存游戏</p>
          <p className="text-gray-500 text-[10px] mb-3">将当前进度保存到浏览器本地存储</p>
          <button
            onClick={() => {
              saveGame();
              setSaveMsg('✅ 保存成功！');
              setTimeout(() => setSaveMsg(''), 2000);
            }}
            className="w-full bg-blue-700 hover:bg-blue-600 text-white py-2.5 rounded-lg text-sm font-bold transition-all"
          >
            💾 保存游戏
          </button>
          {saveMsg && <p className="text-green-400 text-xs text-center mt-2">{saveMsg}</p>}
        </div>
        <div className="bg-green-900/30 rounded-lg p-4 border border-green-700/50">
          <p className="text-green-300 text-xs font-bold mb-2">📂 读取存档</p>
          <p className="text-gray-500 text-[10px] mb-3">从浏览器本地存储中读取存档</p>
          <button
            onClick={() => {
              const success = loadGame();
              if (success) {
                setLoadMsg('✅ 读取成功！');
                setTimeout(() => setLoadMsg(''), 2000);
              } else {
                setLoadMsg('❌ 没有找到存档！');
                setTimeout(() => setLoadMsg(''), 2000);
              }
            }}
            disabled={!hasSave}
            className={`w-full py-2.5 rounded-lg text-sm font-bold transition-all ${
              hasSave
                ? 'bg-green-700 hover:bg-green-600 text-white'
                : 'bg-gray-700 text-gray-500 cursor-not-allowed'
            }`}
          >
            📖 读取存档
          </button>
          {loadMsg && <p className={`text-xs text-center mt-2 ${loadMsg.includes('✅') ? 'text-green-400' : 'text-red-400'}`}>{loadMsg}</p>}
        </div>
        <div className="bg-gray-800/50 rounded-lg p-3 border border-gray-700">
          <p className="text-gray-500 text-[10px] font-bold">📌 存储位置</p>
          <p className="text-gray-600 text-[10px] mt-1">浏览器本地存储（localStorage）</p>
          <p className="text-gray-600 text-[10px]">存储键名：废土战歌存档</p>
          <p className="text-gray-600 text-[10px]">⚠️ 清除浏览器数据会导致存档丢失！</p>
        </div>
      </div>
    );
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'status': return renderStatusTab();
      case 'items': return renderItemsTab();
      case 'tank': return renderTankTab();
      case 'equip': return renderEquipTab();
      case 'ride': return renderRideTab();
      case 'quest': return <QuestPanel />;
      case 'save': return renderSaveTab();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80">
      <div className="bg-gray-900 border-2 border-yellow-500 rounded-xl shadow-2xl w-full max-w-lg mx-4 h-[600px] flex flex-col overflow-hidden">
        <div className="bg-gray-800 px-4 py-2.5 border-b border-yellow-500/50 flex items-center justify-between flex-shrink-0">
          <h2 className="text-yellow-400 font-bold text-sm">📋 菜单</h2>
          <button
            onClick={closeMenu}
            className="text-gray-400 hover:text-white text-lg leading-none px-1"
          >
            ✕
          </button>
        </div>

        <div className="flex border-b border-gray-700 flex-shrink-0 overflow-x-auto">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 py-2.5 text-xs font-bold transition-all min-w-[60px] ${
                activeTab === tab.id
                  ? 'bg-gray-800 text-yellow-400 border-b-2 border-yellow-400'
                  : 'bg-gray-900 text-gray-500 hover:text-gray-300 hover:bg-gray-850'
              }`}
            >
              <span className="block text-base mb-0.5">
                <GameIcon id={tab.id} size="sm" fallback={tab.icon} />
              </span>
              {tab.label}
            </button>
          ))}
        </div>

        <div className="flex-1 overflow-y-auto p-3">
          {renderTabContent()}
        </div>
      </div>
        {showRenamePlayer && (
          <NameInput
            title="重命名主角"
            defaultName={currentMember.name}
            onConfirm={(name) => {
              renamePlayer(name);
              setShowRenamePlayer(false);
            }}
            onCancel={() => setShowRenamePlayer(false)}
          />
        )}
        {showRenameTank && currentTank && (
          <NameInput
            title="重命名战车"
            defaultName={currentTank.name}
            onConfirm={(name) => {
              renameTank(currentTankIndex, name);
              setShowRenameTank(false);
            }}
            onCancel={() => setShowRenameTank(false)}
          />
        )}
    </div>
  );
};

export default React.memo(MenuScreen);
