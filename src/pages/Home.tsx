import React from 'react';
import { useGameStore } from '../store/useGameStore';
import TitleScreen from '../components/TitleScreen';
import IntroScene from '../components/IntroScene';
import BuildingScreen from '../components/BuildingScreen';
import ExploreScreen from '../components/ExploreScreen';
import BattleScreen from '../components/BattleScreen';
import ShopScreen from '../components/ShopScreen';
import MenuScreen from '../components/MenuScreen';
import CraftingScreen from '../components/CraftingScreen';
import MessageLog from '../components/MessageLog';

const phaseConfig: Record<string, { label: string; color: string; icon: string; pulse: boolean }> = {
  battle: { label: '战斗中', color: 'bg-red-600', icon: '⚔️', pulse: true },
  explore: { label: '探索中', color: 'bg-green-600', icon: '🗺️', pulse: false },
  shop: { label: '商店中', color: 'bg-purple-600', icon: '🏪', pulse: false },
  menu: { label: '菜单', color: 'bg-blue-600', icon: '📋', pulse: false },
  crafting: { label: '制造中', color: 'bg-orange-600', icon: '🔧', pulse: false },
};

const Home: React.FC = () => {
  const { gamePhase, isOnTank, tanks, openMenu } = useGameStore();

  if (gamePhase === 'title') {
    return <TitleScreen />;
  }

  if (gamePhase === 'intro') {
    return <IntroScene />;
  }

  const phase = phaseConfig[gamePhase];

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col">
      <header className="bg-gray-800 border-b border-gray-700 px-4 py-2.5 sticky top-0 z-50 shadow-lg">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2">
            <h1 className="text-lg font-bold text-yellow-400 tracking-wide">废土战歌</h1>
            {tanks.length > 0 && (
              <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${isOnTank ? 'bg-green-800 text-green-300' : 'bg-yellow-800 text-yellow-300'}`}>
                {isOnTank ? '🚗 乘車' : '🚶 徒步'}
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            {gamePhase !== 'battle' && (
              <button
                onClick={openMenu}
                className="bg-blue-700 hover:bg-blue-600 text-white px-4 py-1.5 rounded-lg text-sm font-bold border-b-2 border-blue-900 transition-all"
              >
                📋 菜单
              </button>
            )}
            {phase && (
              <span className={`${phase.color} text-white px-3 py-1 rounded-full text-xs font-bold ${phase.pulse ? 'animate-pulse' : ''}`}>
                {phase.icon} {phase.label}
              </span>
            )}
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-7xl mx-auto w-full p-3">
        {gamePhase === 'crafting' && <CraftingScreen />}
        
        {gamePhase !== 'crafting' && (
          <div className="flex flex-col lg:flex-row gap-3">
            <div className="flex-1 min-w-0">
              {gamePhase === 'building' && <BuildingScreen />}
              {(gamePhase === 'explore' || gamePhase === 'battle') && <ExploreScreen />}
              {gamePhase === 'shop' && <ShopScreen />}
            </div>

            <div className="w-full lg:w-72 xl:w-80 flex-shrink-0 space-y-3">
              <MessageLog />
            </div>
          </div>
        )}

        {gamePhase === 'battle' && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
            <BattleScreen />
          </div>
        )}

        {gamePhase === 'menu' && <MenuScreen />}
      </main>
    </div>
  );
};

export default React.memo(Home);
