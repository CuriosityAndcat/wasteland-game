import React, { useEffect, useRef } from 'react';
import { useGameStore } from '../store/useGameStore';

const getMessageStyle = (msg: string): string => {
  if (msg.includes('击败') || msg.includes('战胜') || msg.includes('获得') || msg.includes('🎉') || msg.includes('🏆') || msg.includes('🎖️')) return 'text-green-400';
  if (msg.includes('BOSS') || msg.includes('警告') || msg.includes('⚠️') || msg.includes('💀') || msg.includes('被击败')) return 'text-red-400 font-medium';
  if (msg.includes('升级')) return 'text-yellow-400 font-medium';
  if (msg.includes('💰') || msg.includes('金币')) return 'text-yellow-300';
  if (msg.includes('🏠') || msg.includes('🍺') || msg.includes('🏥') || msg.includes('📦') || msg.includes('🎯')) return 'text-cyan-300';
  if (msg.includes('购买了') || msg.includes('装备了')) return 'text-purple-300';
  if (msg.includes('招募') || msg.includes('加入')) return 'text-pink-300';
  if (msg.includes('🔒') || msg.includes('需战车')) return 'text-orange-300';
  return 'text-gray-300';
};

const MessageLog: React.FC = () => {
  const messages = useGameStore(state => state.messages);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div className="bg-gray-800 border border-gray-600 rounded-lg overflow-hidden">
      <div className="bg-gray-750 px-3 py-2 border-b border-gray-700">
        <h3 className="text-yellow-400 font-bold text-xs tracking-wide">消息日志</h3>
      </div>
      <div ref={containerRef} className="h-36 overflow-y-auto p-3 space-y-1 scroll-smooth">
        {messages.length === 0 ? (
          <p className="text-gray-500 text-xs">暂无消息</p>
        ) : (
          messages.map((msg, index) => (
            <p key={msg.id || index} className={`text-xs leading-relaxed ${getMessageStyle(msg.text)}`}>
              {msg.text}
            </p>
          ))
        )}
      </div>
    </div>
  );
};

export default React.memo(MessageLog);
