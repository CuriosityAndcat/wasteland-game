import React, { useState, useEffect } from 'react';
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
import TypewriterText from '../components/TypewriterText';
import Portrait from '../components/Portrait';
import GameIcon from '../components/GameIcon';

const phaseConfig: Record<string, { label: string; color: string; iconId: string; pulse: boolean }> = {
  battle: { label: '战斗中', color: 'bg-red-600', iconId: 'equip', pulse: true },
  explore: { label: '探索中', color: 'bg-green-600', iconId: 'menu', pulse: false },
  shop: { label: '商店中', color: 'bg-purple-600', iconId: 'shop', pulse: false },
  menu: { label: '菜单', color: 'bg-blue-600', iconId: 'menu', pulse: false },
  crafting: { label: '制造中', color: 'bg-orange-600', iconId: 'workshop', pulse: false },
};

const speakerPortraitIds: Record<string, string> = {
  '父亲': 'father', '神秘猎人': 'red_wolf', '审判者AI': 'system',
  '深渊巨兽': 'boss1', '格斗家': 'female_warrior', '小男孩': 'mechanic', '姐姐': 'hunter',
  '系统': 'system',
};
const speakerColors: Record<string, string> = {
  '系统': 'text-blue-400', '父亲': 'text-orange-400', '酒吧老板': 'text-amber-400',
  '姐姐': 'text-pink-400', '神秘猎人': 'text-red-400', '小男孩': 'text-cyan-400',
  '格斗家': 'text-purple-400', '社长': 'text-green-400', '审判者AI': 'text-red-500',
};

const Home: React.FC = () => {
  const { gamePhase, isOnTank, tanks, openMenu, activeDialog, nextDialog } = useGameStore();
  const [typingFinished, setTypingFinished] = useState(false);

  useEffect(() => {
    setTypingFinished(false);
  }, [activeDialog?.id]);

  if (gamePhase === 'title') return <TitleScreen />;
  if (gamePhase === 'intro') return <IntroScene />;

  const phase = phaseConfig[gamePhase];

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white flex flex-col relative">
      {/* Dialog overlay */}
      {activeDialog && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="bg-gray-900/95 border border-gray-700 rounded-xl shadow-2xl w-full max-w-lg mx-4 animate-fadeInScale">
            <div className="bg-gradient-to-r from-gray-800 to-gray-800/80 px-4 py-3 border-b border-gray-700 flex items-center gap-3">
              {speakerPortraitIds[activeDialog.speaker] && (
                <div className="flex-shrink-0">
                  <Portrait id={speakerPortraitIds[activeDialog.speaker]} size="sm" />
                </div>
              )}
              <span className={`font-bold text-sm ${speakerColors[activeDialog.speaker] || 'text-gray-300'}`}>
                {activeDialog.speaker}
              </span>
            </div>
            <div className="p-5 min-h-[5rem] flex items-center">
              <div className="text-gray-100 text-base leading-relaxed whitespace-pre-line">
                {activeDialog.speaker !== '系统' && <span className="text-yellow-400/40 mr-1">「</span>}
                <TypewriterText text={activeDialog.content} speed={15}
                  onComplete={() => setTypingFinished(true)} skip={typingFinished} as="span" />
                {activeDialog.speaker !== '系统' && <span className="text-yellow-400/40 ml-1">」</span>}
              </div>
            </div>
            <div className="bg-gray-800/50 px-4 py-3 border-t border-gray-700 flex justify-center">
              {typingFinished ? (
                <button onClick={nextDialog}
                  className="px-8 py-2 bg-gradient-to-r from-yellow-600 to-yellow-700 hover:from-yellow-500 hover:to-yellow-600 text-white rounded-lg font-bold text-sm transition-all shadow-lg">
                  继续
                </button>
              ) : (
                <span className="text-gray-500 text-xs animate-pulse">⏳ 对话中...</span>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <header className="bg-gray-900/95 border-b border-gray-800 px-4 py-2.5 sticky top-0 z-50 shadow-lg backdrop-blur-sm">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2">
            <h1 className="text-lg font-bold text-yellow-400 tracking-wide glow-text">废土战歌</h1>
            {tanks.length > 0 && (
              <span className={`text-xs font-medium px-2 py-0.5 rounded-full border ${isOnTank ? 'bg-green-900/50 text-green-300 border-green-700' : 'bg-yellow-900/50 text-yellow-300 border-yellow-700'}`}>
                {isOnTank ? '🚗 乘車' : '🚶 徒步'}
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            {gamePhase !== 'battle' && (
              <button onClick={openMenu}
                className="bg-gray-800 hover:bg-gray-700 text-white px-3 py-1.5 rounded-lg text-sm font-bold border border-gray-700 transition-all">
                📋 菜单
              </button>
            )}
            {phase && (
              <span className={`${phase.color} text-white px-3 py-1 rounded-full text-xs font-bold ${phase.pulse ? 'animate-pulse' : ''}`}>
                <GameIcon id={phase.iconId} size="sm" /> {phase.label}
              </span>
            )}
          </div>
        </div>
      </header>

      {/* Main content */}
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
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
            <BattleScreen />
          </div>
        )}

        {gamePhase === 'menu' && <MenuScreen />}
      </main>
    </div>
  );
};

export default React.memo(Home);
