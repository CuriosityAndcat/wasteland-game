import React, { useState, useEffect } from 'react';
import { useGameStore } from '../store/useGameStore';
import NameInput from './NameInput';
import ParticleBackground from './ParticleBackground';
import TypewriterText from './TypewriterText';

const TitleScreen: React.FC = () => {
  const { startGame, loadGame, hasSaveData } = useGameStore();
  const [showNameInput, setShowNameInput] = useState(false);
  const [hasSave, setHasSave] = useState(false);
  const [loadError, setLoadError] = useState('');
  const [titleRevealed, setTitleRevealed] = useState(false);
  const [subtitleRevealed, setSubtitleRevealed] = useState(false);
  const [buttonsVisible, setButtonsVisible] = useState(false);
  const [glitchEffect, setGlitchEffect] = useState(false);

  useEffect(() => {
    setHasSave(hasSaveData());
    const t1 = setTimeout(() => setTitleRevealed(true), 500);
    const t2 = setTimeout(() => setSubtitleRevealed(true), 2000);
    const t3 = setTimeout(() => setButtonsVisible(true), 3200);
    const glitch = setInterval(() => {
      setGlitchEffect(true);
      setTimeout(() => setGlitchEffect(false), 150);
    }, 5000 + Math.random() * 3000);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); clearInterval(glitch); };
  }, [hasSaveData]);

  const handleStartGame = () => setShowNameInput(true);
  const handleNameConfirm = (name: string) => { startGame(name); setShowNameInput(false); };
  const handleLoadGame = () => {
    const ok = loadGame();
    if (!ok) { setLoadError('没有找到存档！'); setTimeout(() => setLoadError(''), 2000); }
  };

  if (showNameInput) return <NameInput title="请输入你的名字" defaultName="猎人" onConfirm={handleNameConfirm} />;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#0a0a0f] overflow-hidden relative">
      <ParticleBackground count={35} color="rgba(232,184,48,0.4)" />
      <ParticleBackground count={8} color="rgba(204,51,51,0.25)" className="z-[2]" />

      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-yellow-500/5 rounded-full blur-[120px]" />
      <div className="absolute bottom-1/3 right-1/4 w-48 h-48 bg-red-500/5 rounded-full blur-[100px]" />

      <div className="relative z-10 text-center px-4">
        {/* Top decor */}
        <div className={`mb-6 transition-all duration-1000 ${titleRevealed ? 'opacity-100' : 'opacity-0'}`}>
          <div className="flex items-center justify-center gap-3">
            <div className="h-px w-16 bg-gradient-to-r from-transparent to-yellow-500/50" />
            <span className="text-yellow-600/60 text-xs tracking-[0.3em] uppercase">WASTELAND CHRONICLES</span>
            <div className="h-px w-16 bg-gradient-to-l from-transparent to-yellow-500/50" />
          </div>
        </div>

        {/* Title */}
        <h1 className={`text-6xl md:text-8xl font-black tracking-wider mb-4 transition-all duration-1000 ${titleRevealed ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'} ${glitchEffect ? 'animate-glitch' : ''}`}>
          <span className="text-transparent bg-clip-text bg-gradient-to-b from-yellow-300 via-yellow-400 to-yellow-600">
            废土战歌
          </span>
        </h1>

        {/* Glow line */}
        <div className={`flex justify-center mb-6 transition-all duration-700 delay-500 ${titleRevealed ? 'opacity-100' : 'opacity-0'}`}>
          <div className="w-32 h-[2px] bg-gradient-to-r from-transparent via-yellow-500 to-transparent glow-yellow" />
        </div>

        {/* Subtitle */}
        <div className={`mb-10 h-8 transition-all duration-700 ${subtitleRevealed ? 'opacity-100' : 'opacity-0'}`}>
          <TypewriterText text="在这个被破坏的世界中，成为传说..." speed={45} className="text-gray-400 text-sm md:text-base tracking-wider" as="p" />
        </div>

        {/* Buttons - same structure for alignment */}
        <div className={`space-y-4 transition-all duration-700 ${buttonsVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="flex justify-center">
            <button onClick={handleStartGame}
              className="w-64 bg-gradient-to-b from-yellow-600 to-yellow-800 hover:from-yellow-500 hover:to-yellow-700 text-white text-xl font-bold py-4 px-12 rounded-lg transition-all duration-300 overflow-hidden">
              ⚔️ 开始游戏
            </button>
          </div>
          <div className="flex justify-center">
            <button onClick={handleLoadGame} disabled={!hasSave}
              className={`w-64 text-lg font-bold py-4 px-12 rounded-lg border-2 transition-all duration-300 ${hasSave ? 'bg-gray-800/50 hover:bg-gray-700/50 text-gray-200 border-gray-600 hover:border-gray-500' : 'bg-gray-900/30 text-gray-600 border-gray-800 cursor-not-allowed'}`}>
              📂 读取进度
            </button>
          </div>
        </div>

        {loadError && <p className="text-red-400 text-sm mt-4 animate-fadeIn">{loadError}</p>}
      </div>

      {/* Bottom */}
      <div className={`absolute bottom-8 left-0 right-0 text-center transition-all duration-700 delay-1000 ${buttonsVisible ? 'opacity-60' : 'opacity-0'}`}>
        <p className="text-gray-600 text-xs tracking-wider">收集战车 · 击败赏金首 · 挑战审判者AI</p>
      </div>
    </div>
  );
};

export default TitleScreen;
