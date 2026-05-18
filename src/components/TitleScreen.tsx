import React, { useState, useEffect } from 'react';
import { useGameStore } from '../store/useGameStore';
import NameInput from './NameInput';

const TitleScreen: React.FC = () => {
  const { startGame, loadGame, hasSaveData } = useGameStore();
  const [showNameInput, setShowNameInput] = useState(false);
  const [hasSave, setHasSave] = useState(false);
  const [loadError, setLoadError] = useState('');

  useEffect(() => {
    setHasSave(hasSaveData());
  }, [hasSaveData]);

  const handleStartGame = () => {
    setShowNameInput(true);
  };

  const handleNameConfirm = (name: string) => {
    startGame(name);
    setShowNameInput(false);
  };

  const handleLoadGame = () => {
    const success = loadGame();
    if (!success) {
      setLoadError('没有找到存档数据！');
      setTimeout(() => setLoadError(''), 2000);
    }
  };

  if (showNameInput) {
    return (
      <NameInput
        title="请输入你的名字"
        defaultName="猎人"
        onConfirm={handleNameConfirm}
      />
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900">
      <div className="text-center mb-8">
        <h1 className="text-5xl md:text-7xl font-bold text-yellow-400 mb-4 tracking-wider">
          废土战歌
        </h1>
        <p className="text-red-500 text-lg mb-2">WASTELAND SAGA</p>
      </div>
      
      <div className="space-y-4 mb-8">
        <button
          onClick={handleStartGame}
          className="block w-64 bg-red-700 hover:bg-red-600 text-white text-xl font-bold py-4 px-12 rounded-lg border-b-4 border-red-900 hover:border-red-800 transition-all transform hover:scale-105"
        >
          开始游戏
        </button>
        <button
          onClick={handleLoadGame}
          disabled={!hasSave}
          className={`block w-64 text-xl font-bold py-4 px-12 rounded-lg border-b-4 transition-all transform hover:scale-105 ${
            hasSave
              ? 'bg-blue-700 hover:bg-blue-600 text-white border-blue-900 hover:border-blue-800'
              : 'bg-gray-700 text-gray-500 border-gray-800 cursor-not-allowed'
          }`}
        >
          读取进度
        </button>
        {loadError && (
          <p className="text-red-400 text-sm text-center mt-2">{loadError}</p>
        )}
      </div>
      
      <div className="text-center text-gray-500 text-sm space-y-1">
        <p>在这个被破坏的世界中...</p>
        <p>你被父亲赶出家门，立志成为超级勇士！</p>
        <p>收集战车，击败赏金首，挑战审判者AI！</p>
      </div>
      
      <div className="mt-8 flex gap-4">
        <span className="text-4xl">🎖️</span>
        <span className="text-4xl">⚔️</span>
        <span className="text-4xl">🛡️</span>
        <span className="text-4xl">🚀</span>
      </div>
    </div>
  );
};

export default TitleScreen;