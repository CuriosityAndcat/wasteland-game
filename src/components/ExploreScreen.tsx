import React, { useState, useEffect } from 'react';
import { useGameStore } from '../store/useGameStore';
import { enemies } from '../data/gameData';
import { Enemy, Building } from '../types';
import Portrait from './Portrait';

const ExploreScreen: React.FC = () => {
  const { 
    currentLocationId: currentLocation, 
    locations, 
    moveToLocation, 
    openShop, 
    openInventory,
    rest,
    defeatedBosses,
    recruitMember,
    addTank,
    getFirstTank,
    members,
    tanks,
    startBattle,
    player,
    healPlayer,
    addMessage,
    repairAllTanks,
    renameTank,
    enterBuilding,
    gamePhase
  } = useGameStore();
  
  const [caveDialogStep, setCaveDialogStep] = useState<number>(-1);

  // 当游戏阶段不是探索时，关闭洞穴剧情对话框
  useEffect(() => {
    if (gamePhase !== 'explore') {
      setCaveDialogStep(-1);
    }
  }, [gamePhase]);

  // 当击败BOSS后，关闭洞穴剧情对话框
  useEffect(() => {
    if (defeatedBosses.includes('boss0')) {
      setCaveDialogStep(-1);
    }
  }, [defeatedBosses]);
  
  const currentLoc = locations.find(l => l.id === currentLocation);
  const connectedLocationIds = currentLoc?.connections.map(c => c.locationId) || [];
  const connectedLocations = locations.filter(l => connectedLocationIds.includes(l.id));

  const currentLocationEnemies = currentLoc?.enemyIds 
    ? enemies.filter(e => currentLoc.enemyIds?.includes(e.id) && !e.isBoss)
    : enemies.filter(e => !e.isBoss);

  const canRecruitAtLocation = () => {
    switch(currentLocation) {
      case 'bob_town': return !members.find(m => m.id === 'char2');
      case 'ordo_town': return !members.find(m => m.id === 'char3');
      default: return false;
    }
  };
  
  const canGetTankAtLocation = () => {
    switch(currentLocation) {
      case 'factory': return !tanks.find(t => t.id === 'tank2');
      case 'porto_town': return !tanks.find(t => t.id === 'tank3');
      case 'hospital': return !tanks.find(t => t.id === 'tank4') && defeatedBosses.includes('boss6');
      case 'sewer': return !tanks.find(t => t.id === 'tank5');
      case 'arsenal': return !tanks.find(t => t.id === 'tank6') && defeatedBosses.includes('boss10');
      case 'waterfall': return !tanks.find(t => t.id === 'tank7') && defeatedBosses.includes('boss9');
      default: return false;
    }
  };

  const canGetFirstTank = () => {
    return currentLocation === 'radom_cave_2f' && tanks.length === 0 && defeatedBosses.includes('boss0');
  };
  
  const handleRecruit = () => {
    switch(currentLocation) {
      case 'bob_town': recruitMember('char2'); break;
      case 'ordo_town': recruitMember('char3'); break;
    }
  };
  
  const handleGetTank = () => {
    switch(currentLocation) {
      case 'factory': addTank('tank2'); break;
      case 'porto_town': addTank('tank3'); break;
      case 'hospital': addTank('tank4'); break;
      case 'sewer': addTank('tank5'); break;
      case 'arsenal': addTank('tank6'); break;
      case 'waterfall': addTank('tank7'); break;
      case 'radom_cave_2f': getFirstTank(); break;
    }
  };
  
  const getRecruitName = () => {
    switch(currentLocation) {
      case 'bob_town': return '小武';
      case 'ordo_town': return '阿雅';
      default: return '';
    }
  };
  
  const getTankName = () => {
    switch(currentLocation) {
      case 'factory': return '铁壁号';
      case 'porto_town': return '救援号';
      case 'hospital': return '堡垒号';
      case 'sewer': return '疾风号';
      case 'arsenal': return '猎手号';
      case 'waterfall': return '赤焰号';
      case 'radom_cave': return '先锋号';
      default: return '';
    }
  };

  const handleStartBattle = (enemy: Enemy) => {
    startBattle(enemy);
  };

  const handleBuildingClick = (building: Building) => {
    enterBuilding(building);
  };

  const getBuildingColor = (type: string): string => {
    switch(type) {
      case 'bar': return 'bg-amber-700 hover:bg-amber-600 border-amber-900';
      case 'inn': return 'bg-green-700 hover:bg-green-600 border-green-900';
      case 'shop_human': return 'bg-purple-700 hover:bg-purple-600 border-purple-900';
      case 'shop_tank': return 'bg-blue-700 hover:bg-blue-600 border-blue-900';
      case 'hospital': return 'bg-red-700 hover:bg-red-600 border-red-900';
      case 'office': return 'bg-yellow-700 hover:bg-yellow-600 border-yellow-900';
      case 'warehouse': return 'bg-gray-700 hover:bg-gray-600 border-gray-900';
      case 'house': return 'bg-teal-700 hover:bg-teal-600 border-teal-900';
      case 'home': return 'bg-amber-700 hover:bg-amber-600 border-amber-900';
      default: return 'bg-gray-700 hover:bg-gray-600 border-gray-900';
    }
  };

  const isTown = currentLoc?.type === 'town';
  const isWilderness = currentLoc?.type === 'wilderness' || currentLoc?.type === 'dungeon';

  return (
    <div className="space-y-2">
      <div className="bg-gray-800 border border-gray-600 rounded-lg overflow-hidden">
        <div className="bg-gray-700 px-3 py-2 flex justify-between items-center">
          <h2 className="text-lg font-bold text-green-400">📍 {currentLoc?.name}</h2>
          {currentLoc?.bossId && defeatedBosses.includes(currentLoc.bossId) && (
            <span className="bg-green-600 text-white px-2 py-0.5 rounded-full text-xs">✅ BOSS已击败</span>
          )}
        </div>
        <div className="p-2">
          <p className="text-gray-300 text-xs leading-relaxed">{currentLoc?.description}</p>
        </div>
        
        {currentLocation === 'radom_cave_2f' && tanks.length === 0 && !defeatedBosses.includes('boss0') && caveDialogStep === -1 && (
          <div className="mx-2 mb-2 p-3 bg-gray-900/50 border border-blue-700/50 rounded-lg">
            <p className="text-blue-300 text-sm mb-3">你来到了废弃矿洞的最深处，一辆废弃的战车停在那里...</p>
            <div className="space-y-2">
              <button
                onClick={() => setCaveDialogStep(0)}
                className="w-full bg-blue-700 hover:bg-blue-600 text-white font-medium py-2 px-3 rounded-lg border-b-2 border-blue-900 transition-all text-sm"
              >
                🔍 上前查看战车
              </button>
              <button
                onClick={() => moveToLocation('radom_cave_1f')}
                className="w-full bg-gray-700 hover:bg-gray-600 text-white font-medium py-2 px-3 rounded-lg border-b-2 border-gray-900 transition-all text-sm"
              >
                ⬆️ 返回上层
              </button>
            </div>
          </div>
        )}

        {currentLocation === 'radom_cave_2f' && caveDialogStep >= 0 && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
            <div className="bg-gray-900 border-2 border-yellow-500 rounded-xl shadow-2xl w-full max-w-md mx-4 overflow-hidden">
              <div className="bg-gray-800 px-4 py-2 border-b border-yellow-500/50">
                <span className="text-yellow-400 font-bold text-sm">📖 剧情</span>
              </div>
              <div className="p-4 min-h-[160px] flex flex-col justify-between">
                <div className="space-y-2">
                  {caveDialogStep === 0 && (
                    <p className="text-white text-sm">你小心翼翼地靠近那辆废弃的战车...</p>
                  )}
                  {caveDialogStep === 1 && (
                    <p className="text-white text-sm">在昏暗的光线中，你清楚地看到了一辆轻型坦克！虽然有些老旧，但看起来还能用。</p>
                  )}
                  {caveDialogStep === 2 && (
                    <div>
                      <p className="text-white text-sm">突然！</p>
                      <p className="text-red-400 text-sm font-bold mt-1">一只巨大的狂犬首领从暗处扑了出来！</p>
                    </div>
                  )}
                  {caveDialogStep === 3 && (
                    <div>
                      <p className="text-red-400 text-sm">狂犬首领：汪汪汪！这是我的地盘！</p>
                      <p className="text-gray-300 text-xs mt-2">狂犬首领挡在了战车前面，对你龇牙咧嘴...</p>
                      <p className="text-yellow-400 text-xs mt-2">你必须击败它才能获得这辆战车！</p>
                    </div>
                  )}
                  {caveDialogStep === 4 && (
                    <p className="text-yellow-400 text-sm font-bold">你该怎么做？</p>
                  )}
                  {caveDialogStep === 5 && (
                    <div>
                      <p className="text-white text-sm">你握紧武器，准备迎战狂犬首领！</p>
                      <p className="text-red-400 text-xs mt-2">⚔️ 战斗开始！</p>
                    </div>
                  )}
                </div>

                <div className="mt-4">
                  {caveDialogStep < 4 && (
                    <button
                      onClick={() => setCaveDialogStep(caveDialogStep + 1)}
                      className="w-full bg-blue-700 hover:bg-blue-600 text-white font-medium py-2 rounded-lg transition-all text-sm"
                    >
                      继续 ▶
                    </button>
                  )}
                  {caveDialogStep === 4 && (
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => {
                          setCaveDialogStep(5);
                          setTimeout(() => {
                            const boss0 = enemies.find(e => e.id === 'boss0');
                            if (boss0) startBattle(boss0);
                          }, 500);
                        }}
                        className="bg-red-700 hover:bg-red-600 text-white font-medium py-2 rounded-lg transition-all text-sm"
                      >
                        ⚔️ 迎战狂犬首领
                      </button>
                      <button
                        onClick={() => moveToLocation('radom_cave_1f')}
                        className="bg-gray-700 hover:bg-gray-600 text-white font-medium py-2 rounded-lg transition-all text-sm"
                      >
                        🏃 先撤退
                      </button>
                    </div>
                  )}
                  {caveDialogStep === 5 && (
                    <p className="text-gray-400 text-xs text-center animate-pulse">⚔️ 战斗开始...</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {currentLocation === 'radom_cave_2f' && tanks.length > 0 && defeatedBosses.includes('boss0') && (
          <div className="mx-2 mb-2 p-2 bg-green-900/30 border border-green-700/50 rounded-lg">
            <p className="text-green-300 text-xs">🎉 这里就是你获得第一辆战车的地方！</p>
          </div>
        )}
      </div>

      {isTown && currentLoc?.buildings && currentLoc.buildings.length > 0 && (
        <div className="bg-gray-800 border border-purple-600 rounded-lg overflow-hidden">
          <div className="bg-gray-700 px-3 py-1.5">
            <h3 className="text-yellow-400 font-bold text-xs">🏠 镇上建筑</h3>
          </div>
          <div className="p-2">
            <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 gap-1.5">
              {currentLoc.buildings.map(building => (
                <button
                  key={building.id}
                  onClick={() => handleBuildingClick(building)}
                  disabled={building.type === 'shop_tank' && tanks.length === 0}
                  className={`flex flex-col items-center p-1.5 rounded-lg border-b-2 transition-all text-white ${
                    building.type === 'shop_tank' && tanks.length === 0
                      ? 'bg-gray-600 cursor-not-allowed opacity-50 border-gray-800'
                      : getBuildingColor(building.type)
                  }`}
                >
                  <span className="text-lg leading-none">{building.icon}</span>
                  <span className="font-bold text-xs mt-0.5">{building.name}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {isWilderness && currentLocationEnemies.length > 0 && (
        <div className="bg-gray-800 border border-red-600 rounded-lg overflow-hidden">
          <div className="bg-gray-700 px-3 py-1.5">
            <h3 className="text-yellow-400 font-bold text-xs">👾 敌人列表</h3>
          </div>
          <div className="p-2">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
              {currentLocationEnemies.map(enemy => (
                <button
                  key={enemy.id}
                  onClick={() => handleStartBattle(enemy)}
                  className="flex items-center gap-2 bg-gray-700 hover:bg-gray-600 p-1.5 rounded-lg transition-all"
                >
                  <Portrait id={enemy.portraitId || enemy.id} size="sm" />
                  <div className="flex-1 text-left">
                    <div className="font-bold text-xs text-white">{enemy.name}</div>
                    <div className="text-xs text-gray-400">HP:{enemy.hp} ATK:{enemy.attack}</div>
                  </div>
                  <span className="text-red-400 font-bold text-xs">⚔️</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      <div className="bg-gray-800 border border-blue-600 rounded-lg overflow-hidden">
        <div className="bg-gray-700 px-3 py-1.5">
          <h3 className="text-yellow-400 font-bold text-xs">🚶 行动</h3>
        </div>
        <div className="p-3">
          <div className="flex flex-wrap justify-center gap-2">
            {connectedLocations.map(location => {
              const locationData = locations.find(l => l.id === location.id);
              const isBossLocation = locationData?.bossId && !defeatedBosses.includes(locationData.bossId);
              const connection = currentLoc?.connections.find(c => c.locationId === location.id);
              const hasRequirement = connection?.requirement === 'hasTank' && tanks.length === 0;
              
              return (
                <button
                  key={location.id}
                  onClick={() => !hasRequirement && moveToLocation(location.id)}
                  disabled={hasRequirement}
                  className={`font-medium py-2 px-4 rounded-lg border-b-2 transition-all text-sm ${
                    hasRequirement 
                      ? 'bg-gray-600 cursor-not-allowed opacity-50 border-gray-800 text-white'
                      : isBossLocation 
                        ? 'bg-red-700 hover:bg-red-600 border-red-900 text-white' 
                        : 'bg-blue-700 hover:bg-blue-600 border-blue-900 text-white'
                  }`}
                >
                  {hasRequirement && '🔒 '}
                  {isBossLocation && !hasRequirement ? '⚔️ ' : '➡️ '}{locationData?.name}
                  {isBossLocation && !hasRequirement && ' (BOSS)'}
                  {hasRequirement && ' (需战车)'}
                </button>
              );
            })}
            
            {canRecruitAtLocation() && (
              <button
                onClick={handleRecruit}
                className="bg-yellow-700 hover:bg-yellow-600 text-white font-medium py-2 px-4 rounded-lg border-b-2 border-yellow-900 transition-all text-sm"
              >
                🤝 招募 {getRecruitName()}
              </button>
            )}
            {(canGetTankAtLocation() || canGetFirstTank()) && (
              <button
                onClick={handleGetTank}
                className="bg-orange-700 hover:bg-orange-600 text-white font-medium py-2 px-4 rounded-lg border-b-2 border-orange-900 transition-all text-sm"
              >
                🎖️ 获得 {getTankName()}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default React.memo(ExploreScreen);