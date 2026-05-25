import React, { useState, useEffect } from 'react';
import { useGameStore } from '../store/useGameStore';
import { enemies } from '../data/gameData';
import { Enemy, Building } from '../types';
import Portrait from './Portrait';
import GameIcon from './GameIcon';
import MessageLog from './MessageLog';

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

  const isTown = currentLoc?.type === 'town';
  const isWilderness = currentLoc?.type === 'wilderness' || currentLoc?.type === 'dungeon';

  // Decorative top ornament
  const renderTopOrnament = () => (
    <div className="flex items-center gap-2 mb-1">
      <div className="h-px flex-1 bg-gradient-to-r from-transparent via-yellow-600/40 to-transparent" />
      <span className="text-yellow-600/40 text-[10px]">✦</span>
      <div className="h-px flex-1 bg-gradient-to-r from-transparent via-yellow-600/40 to-transparent" />
    </div>
  );

  // Section title
  const SectionTitle = ({ icon, label, color = 'text-yellow-400' }: { icon: string; label: string; color?: string }) => (
    <div className="flex items-center gap-1.5 px-3 py-2 bg-gradient-to-r from-gray-800 via-gray-750 to-transparent border-b border-gray-700/50">
      <span className="text-xs">{icon}</span>
      <span className={`font-bold text-xs tracking-wider ${color}`}>{label}</span>
    </div>
  );

  return (
    <div className="space-y-3">
      {renderTopOrnament()}
      
      {/* ===== 地点头部 - 沉浸式场景 ===== */}
      <div className="relative bg-gradient-to-b from-gray-850 to-gray-900 border border-gray-700/60 rounded-xl overflow-hidden shadow-lg">
        {/* 顶部氛围光 */}
        <div className="absolute top-0 left-1/4 w-1/2 h-16 bg-yellow-500/5 rounded-full blur-2xl pointer-events-none" />
        
        <div className="relative px-4 py-3">
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-400 shadow-[0_0_6px_rgba(74,222,128,0.5)]" />
              <h2 className="text-lg font-bold text-white tracking-wide">{currentLoc?.name}</h2>
            </div>
            {currentLoc?.bossId && defeatedBosses.includes(currentLoc.bossId) && (
              <span className="bg-green-600/20 text-green-400 text-[10px] font-medium px-2 py-0.5 rounded-full border border-green-500/30">
                ✓ 已清除
              </span>
            )}
          </div>
          <p className="text-gray-400 text-xs leading-relaxed pl-4">{currentLoc?.description}</p>
        </div>
        
        {/* 洞穴剧情 */}
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
        <div className="bg-gray-850 border border-gray-700/50 rounded-xl overflow-hidden shadow-lg">
          <SectionTitle icon="🏛️" label="镇上建筑" />
          <div className="p-2.5">
            <div className="grid grid-cols-4 sm:grid-cols-5 gap-2">
              {currentLoc.buildings.map(building => (
                <button
                  key={building.id}
                  onClick={() => handleBuildingClick(building)}
                  disabled={building.type === 'shop_tank' && tanks.length === 0}
                  className={`flex flex-col items-center py-2.5 px-1 rounded-xl transition-all duration-200 ${
                    building.type === 'shop_tank' && tanks.length === 0
                      ? 'bg-gray-800/50 cursor-not-allowed opacity-40'
                      : 'bg-gray-800/70 hover:bg-gray-700/80 border border-gray-700/40 hover:border-yellow-600/30 hover:shadow-[0_0_12px_rgba(232,184,48,0.08)] active:scale-95'
                  }`}
                >
                  <div className={`w-11 h-11 rounded-lg flex items-center justify-center mb-1.5 ${
                    building.type === 'shop_tank' && tanks.length === 0
                      ? 'bg-gray-700/30'
                      : 'bg-gray-750/70 border border-gray-600/30'
                  }`}>
                    <GameIcon id={building.type} size="sm" fallback={building.icon} />
                  </div>
                  <span className="font-medium text-[11px] text-gray-300 text-center leading-tight">{building.name}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {isWilderness && currentLocationEnemies.length > 0 && (
        <div className="bg-gray-850 border border-gray-700/50 rounded-xl overflow-hidden shadow-lg">
          <SectionTitle icon="👾" label="出没敌人" color="text-red-400" />
          <div className="p-2">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {currentLocationEnemies.map(enemy => (
                <button
                  key={enemy.id}
                  onClick={() => handleStartBattle(enemy)}
                  className="flex items-center gap-3 bg-gray-800/70 hover:bg-gray-700/80 p-2 rounded-xl border border-gray-700/30 hover:border-red-600/30 transition-all duration-200 active:scale-[0.98]"
                >
                  <div className="w-10 h-10 rounded-lg overflow-hidden bg-gray-750 flex-shrink-0 border border-gray-600/30">
                    <Portrait id={enemy.portraitId || enemy.id} size="sm" />
                  </div>
                  <div className="flex-1 text-left min-w-0">
                    <div className="font-semibold text-xs text-white truncate">{enemy.name}</div>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-[10px] text-red-300">HP {enemy.hp}</span>
                      <span className="text-[10px] text-orange-300">ATK {enemy.attack}</span>
                    </div>
                  </div>
                  <div className="w-7 h-7 rounded-lg bg-red-600/20 border border-red-600/30 flex items-center justify-center flex-shrink-0">
                    <span className="text-red-400 text-xs font-bold">⚔</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ===== 行动面板 ===== */}
      <div className="bg-gray-850 border border-gray-700/50 rounded-xl overflow-hidden shadow-lg">
        <SectionTitle icon="🛤️" label="可前往" color="text-blue-400" />
        <div className="p-3">
          <div className="flex flex-wrap gap-2">
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
                  className={`flex items-center gap-2 font-medium py-2.5 px-4 rounded-xl transition-all duration-200 text-sm ${
                    hasRequirement 
                      ? 'bg-gray-800/50 cursor-not-allowed opacity-40 border border-gray-700/20 text-gray-500'
                      : isBossLocation 
                        ? 'bg-gradient-to-b from-red-800/60 to-red-900/60 hover:from-red-700/60 hover:to-red-800/60 border border-red-700/30 hover:border-red-500/40 text-white shadow-[0_0_10px_rgba(220,38,38,0.1)]'
                        : 'bg-gradient-to-b from-blue-800/40 to-blue-900/40 hover:from-blue-700/40 hover:to-blue-800/40 border border-blue-700/25 hover:border-blue-500/35 text-white'
                  }`}
                >
                  {hasRequirement && (
                    <span className="text-[10px]">🔒</span>
                  )}
                  {isBossLocation && !hasRequirement && (
                    <span className="text-xs">🏴</span>
                  )}
                  {!hasRequirement && !isBossLocation && (
                    <span className="text-blue-300 text-xs">→</span>
                  )}
                  <span>{locationData?.name}</span>
                  {isBossLocation && !hasRequirement && (
                    <span className="text-[10px] text-red-300 font-normal">BOSS</span>
                  )}
                  {hasRequirement && (
                    <span className="text-[10px] text-orange-300 font-normal">需战车</span>
                  )}
                </button>
              );
            })}
            
            {canRecruitAtLocation() && (
              <button onClick={handleRecruit}
                className="flex items-center gap-2 bg-gradient-to-b from-yellow-700/60 to-yellow-800/60 hover:from-yellow-600/60 hover:to-yellow-700/60 border border-yellow-600/30 hover:border-yellow-500/40 text-white font-medium py-2.5 px-4 rounded-xl transition-all duration-200 text-sm">
                <span>🤝</span>
                <span>招募 {getRecruitName()}</span>
              </button>
            )}
            {(canGetTankAtLocation() || canGetFirstTank()) && (
              <button onClick={handleGetTank}
                className="flex items-center gap-2 bg-gradient-to-b from-orange-700/60 to-orange-800/60 hover:from-orange-600/60 hover:to-orange-700/60 border border-orange-600/30 hover:border-orange-500/40 text-white font-medium py-2.5 px-4 rounded-xl transition-all duration-200 text-sm">
                <span>🎖️</span>
                <span>获得 {getTankName()}</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ===== 消息日志 ===== */}
      <MessageLog />
    </div>
  );
};

export default React.memo(ExploreScreen);