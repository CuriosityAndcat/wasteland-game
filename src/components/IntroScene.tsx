import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useGameStore } from '../store/useGameStore';
import TypewriterText from './TypewriterText';
import ParticleBackground from './ParticleBackground';
import Portrait from './Portrait';

interface DialogLine {
  speaker: string; content: string; mood?: 'system' | 'angry' | 'sad' | 'neutral';
}

const introDialogs: DialogLine[] = [
  { speaker: '系统', content: '在一个被破坏的世界中...', mood: 'system' },
  { speaker: '系统', content: '超级电脑"审判者AI"毁灭了人类文明...', mood: 'system' },
  { speaker: '系统', content: '残存的人类在废土上艰难生存...', mood: 'sad' },
  { speaker: '系统', content: '晨风镇的一间破旧小屋里...', mood: 'system' },
  { speaker: '父亲', content: '喂！太阳都晒到屁股了！还在睡懒觉！', mood: 'angry' },
  { speaker: '父亲', content: '什么？你说你想成为超级勇士？', mood: 'angry' },
  { speaker: '父亲', content: '哼！不知天高地厚！', mood: 'angry' },
  { speaker: '父亲', content: '既然你这么有骨气，今天就给我滚出这个家！', mood: 'angry' },
  { speaker: '父亲', content: '不成为超级勇士就别回来！', mood: 'angry' },
  { speaker: '系统', content: '你被父亲赶出了家门...', mood: 'sad' },
  { speaker: '系统', content: '从此，你踏上了成为超级勇士的冒险之旅！', mood: 'system' },
  { speaker: '系统', content: '前方的道路充满了危险与机遇...', mood: 'system' },
  { speaker: '系统', content: '出发吧，少年！', mood: 'system' },
];

const IntroScene: React.FC = () => {
  const { completeIntro } = useGameStore();
  const [step, setStep] = useState(0);
  const [typingComplete, setTypingComplete] = useState(false);
  const [skipType, setSkipType] = useState(false);
  const completedRef = useRef(false);
  const processingRef = useRef(false);

  const current = introDialogs[step];
  const isLast = step >= introDialogs.length - 1;

  const advance = useCallback(() => {
    if (processingRef.current) return;
    processingRef.current = true;

    if (!typingComplete) { setSkipType(true); setTypingComplete(true); processingRef.current = false; return; }
    if (isLast) {
      if (completedRef.current) { processingRef.current = false; return; }
      completedRef.current = true;
      processingRef.current = false;
      completeIntro();
      return;
    }
    setStep(s => s + 1);
    setTypingComplete(false);
    setSkipType(false);
    processingRef.current = false;
  }, [typingComplete, isLast, completeIntro]);

  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); advance(); }
    };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, [advance]);

  const speakerColors: Record<string, string> = { '系统': 'text-blue-400', '父亲': 'text-orange-400' };
  const speakerIcons: Record<string, string> = { '系统': '📖', '父亲': '👤' };

  return (
    <div className="min-h-screen bg-[#0a0a0f] flex flex-col items-center justify-center cursor-pointer px-4 relative overflow-hidden"
      onClick={advance}>
      <ParticleBackground count={20} color="rgba(232,184,48,0.25)" />

      {/* Dynamic mood glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className={`absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full blur-[140px] transition-all duration-1000 ${
          current.mood === 'angry' ? 'bg-red-500/12' : current.mood === 'sad' ? 'bg-blue-500/8' : 'bg-yellow-500/8'}`} />
      </div>

      <div className="relative z-10 w-full max-w-2xl animate-fadeInScale">
        <div className="flex items-center gap-2 mb-4">
          <div className="h-px flex-1 bg-gradient-to-r from-transparent via-yellow-500/30 to-transparent" />
          <span className="text-yellow-600/40 text-xs">★</span>
          <div className="h-px flex-1 bg-gradient-to-r from-transparent via-yellow-500/30 to-transparent" />
        </div>

        <div className="bg-gray-900/80 backdrop-blur-sm border border-gray-700/80 rounded-xl p-6 md:p-8 shadow-2xl">
          <div className="flex items-center gap-3 mb-4 pb-3 border-b border-gray-800">
            <div className="flex-shrink-0">
              {current.speaker === '系统' ? (
                <Portrait id="system" size="sm" />
              ) : current.speaker === '父亲' ? (
                <Portrait id="father" size="sm" />
              ) : (
                <div className="w-9 h-9 rounded-full bg-gray-800 flex items-center justify-center text-lg">
                  {speakerIcons[current.speaker] || '📖'}
                </div>
              )}
            </div>
            <span className={`font-bold text-base ${speakerColors[current.speaker] || 'text-gray-300'}`}>
              {current.speaker}
            </span>
          </div>

          <div className="min-h-[5rem] flex items-center">
            <div className="text-white text-lg md:text-xl leading-relaxed font-medium">
              {current.speaker !== '系统' && <span className="text-yellow-400/50 mr-1">「</span>}
              <TypewriterText text={current.content} speed={22}
                onComplete={() => { setTypingComplete(true); }}
                skip={skipType} as="span" />
              {current.speaker !== '系统' && <span className="text-yellow-400/50 ml-1">」</span>}
            </div>
          </div>
        </div>

        <div className="mt-4 flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            {introDialogs.map((_, i) => (
              <div key={i} className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                i === step ? 'bg-yellow-400 w-3' : i < step ? 'bg-yellow-600/40' : 'bg-gray-700'}`} />
            ))}
          </div>
          {typingComplete && (
            <span className="text-gray-500 text-xs animate-pulse">{isLast ? '🔄 点击进入游戏' : '👉 点击继续'}</span>
          )}
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 h-0.5 bg-gray-800">
        <div className="h-full bg-gradient-to-r from-yellow-600 to-yellow-400 transition-all duration-300"
          style={{ width: `${((step + 1) / introDialogs.length) * 100}%` }} />
      </div>
    </div>
  );
};

export default IntroScene;
