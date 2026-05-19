import React, { useState } from 'react';
import { useGameStore } from '../store/useGameStore';

const QuestPanel: React.FC = () => {
  const { quests } = useGameStore();
  const [activeTab, setActiveTab] = useState<'main' | 'side' | 'completed'>('main');

  const mainQuests = quests.inProgress.filter(q => q.type === 'main');
  const sideQuests = quests.inProgress.filter(q => q.type === 'side');
  const completedQuests = quests.completed;

  const currentQuests = activeTab === 'main' ? mainQuests : 
                        activeTab === 'side' ? sideQuests : 
                        completedQuests;

  return (
    <div className="w-full h-full flex flex-col">
      <div className="bg-yellow-900/30 px-2 py-2 border-b border-gray-700 flex items-center flex-shrink-0 overflow-x-auto">
        <div className="flex gap-1.5">
          <button
            onClick={() => setActiveTab('main')}
            className={`px-2 py-1 rounded text-xs font-bold transition-all flex-shrink-0 ${
              activeTab === 'main' 
                ? 'bg-yellow-600 text-white' 
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            主线 ({mainQuests.length})
          </button>
          <button
            onClick={() => setActiveTab('side')}
            className={`px-2 py-1 rounded text-xs font-bold transition-all flex-shrink-0 ${
              activeTab === 'side' 
                ? 'bg-yellow-600 text-white' 
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            支线 ({sideQuests.length})
          </button>
          <button
            onClick={() => setActiveTab('completed')}
            className={`px-2 py-1 rounded text-xs font-bold transition-all flex-shrink-0 ${
              activeTab === 'completed' 
                ? 'bg-yellow-600 text-white' 
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            已完成 ({completedQuests.length})
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-2">
        {currentQuests.length === 0 ? (
          <div className="text-center text-gray-500 py-8">
            {activeTab === 'completed' 
              ? '还没有完成任何任务' 
              : '当前没有进行中的任务'}
          </div>
        ) : (
          <div className="space-y-2">
            {currentQuests.map(quest => (
              <div key={quest.id} className="bg-gray-800 rounded-lg p-2.5 border border-gray-700 hover:border-yellow-600 transition-all">
                <div className="flex items-start gap-2 mb-1.5">
                  <span className="text-base">
                    {quest.type === 'main' ? '⚔️' : '📋'}
                  </span>
                  <div className="flex-1">
                    <h4 className="font-bold text-white text-sm">{quest.name}</h4>
                    <p className="text-xs text-gray-400 mt-0.5">{quest.description}</p>
                  </div>
                  {quest.type === 'main' && (
                    <span className="bg-red-600 text-white text-xs px-1 py-0.5 rounded font-bold flex-shrink-0">
                      主线
                    </span>
                  )}
                </div>

                <div className="bg-gray-900/50 rounded p-1.5 mt-1.5">
                  <div className="text-xs text-gray-400 mb-1 font-semibold">🎯 目标：</div>
                  {quest.objectives.map((obj, idx) => {
                    const isCompleted = obj.completed || (obj.targetCount && obj.currentCount !== undefined && obj.currentCount >= obj.targetCount);
                    
                    return (
                      <div key={idx} className={`flex items-center gap-1.5 text-xs mb-0.5 ${isCompleted ? 'text-green-400' : 'text-gray-300'}`}>
                        <span>{isCompleted ? '✅' : '○'}</span>
                        <span className={isCompleted ? 'line-through opacity-70' : ''}>
                          {obj.description}
                        </span>
                        {obj.targetCount && obj.currentCount !== undefined && (
                          <span className="text-gray-500 ml-auto">
                            ({obj.currentCount}/{obj.targetCount})
                          </span>
                        )}
                        {obj.location && !isCompleted && (
                          <span className="text-gray-600 ml-auto text-xs">
                            📍 {obj.location}
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>

                {quest.rewards && (
                  <div className="bg-gray-900/30 rounded p-1.5 mt-1.5">
                    <div className="text-xs text-gray-400 mb-1 font-semibold">🎁 奖励：</div>
                    <div className="flex flex-wrap gap-1.5 text-xs">
                      {quest.rewards.gold && (
                        <span className="text-yellow-400">💰 {quest.rewards.gold}G</span>
                      )}
                      {quest.rewards.exp && (
                        <span className="text-blue-400">✨ {quest.rewards.exp} EXP</span>
                      )}
                      {quest.rewards.items && quest.rewards.items.length > 0 && (
                        <span className="text-green-400">
                          📦 {quest.rewards.items.map(i => i.name).join(', ')}
                        </span>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default React.memo(QuestPanel);
