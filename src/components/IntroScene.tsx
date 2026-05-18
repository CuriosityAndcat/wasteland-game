import React, { useState } from 'react';
import { useGameStore } from '../store/useGameStore';
import Portrait from './Portrait';

interface DialogLine {
  speaker: string;
  content: string;
  portraitId: string;
}

const introDialogs: DialogLine[] = [
  { speaker: '旁白', content: '在一个被破坏的世界中...', portraitId: 'narrator' },
  { speaker: '旁白', content: '拉多镇的一间小屋里，你从睡梦中醒来...', portraitId: 'narrator' },
  { speaker: '父亲', content: '喂！太阳都晒到屁股了！还在睡懒觉！', portraitId: 'father' },
  { speaker: '父亲', content: '什么？你说你想成为超级勇士？', portraitId: 'father' },
  { speaker: '父亲', content: '哼！不知天高地厚！你以为超级勇士是那么容易当的吗？', portraitId: 'father' },
  { speaker: '父亲', content: '既然你这么有骨气，今天就给我滚出这个家！', portraitId: 'father' },
  { speaker: '父亲', content: '不成为超级勇士就别回来！滚吧！', portraitId: 'father' },
  { speaker: '旁白', content: '你被父亲赶出了家门...', portraitId: 'narrator' },
  { speaker: '旁白', content: '从此，你踏上了成为超级勇士的冒险之旅！', portraitId: 'narrator' },
  { speaker: '旁白', content: '前方的道路充满了危险与机遇，出发吧！', portraitId: 'narrator' },
];

const IntroScene: React.FC = () => {
  const { completeIntro } = useGameStore();
  const [step, setStep] = useState(0);

  const currentDialog = introDialogs[step];
  const isLastStep = step >= introDialogs.length - 1;

  const handleClick = () => {
    if (isLastStep) {
      completeIntro();
    } else {
      setStep(step + 1);
    }
  };

  const getSpeakerColor = (speaker: string): string => {
    switch (speaker) {
      case '旁白': return 'text-blue-400';
      case '父亲': return 'text-amber-400';
      default: return 'text-yellow-400';
    }
  };

  return (
    <div
      className="min-h-screen bg-gray-900 flex flex-col items-center justify-center cursor-pointer px-4"
      onClick={handleClick}
    >
      <div className="max-w-lg w-full bg-gray-800 border-2 border-gray-700 rounded-xl p-6 shadow-2xl">
        <div className="flex items-start gap-4 mb-6">
          <div className="flex-shrink-0">
            <Portrait id={currentDialog.portraitId} size="lg" />
          </div>
          <div className="flex-1">
            <span className={`font-bold text-lg ${getSpeakerColor(currentDialog.speaker)}`}>
              {currentDialog.speaker === '旁白' ? '📖' : '👤'} {currentDialog.speaker}
            </span>
          </div>
        </div>
        
        <div className="mb-8">
          <p className="text-white text-xl leading-relaxed min-h-[80px]">
            {currentDialog.speaker === '旁白'
              ? currentDialog.content
              : `「${currentDialog.content}」`
            }
          </p>
        </div>
        
        <div className="border-t border-gray-700 pt-4">
          <p className="text-gray-500 text-sm text-center">
            {isLastStep ? '点击继续游戏' : '点击继续'}
          </p>
          <div className="flex justify-center mt-2 gap-1.5">
            {introDialogs.map((_, i) => (
              <span
                key={i}
                className={`w-2 h-2 rounded-full ${
                  i === step ? 'bg-yellow-400' : 'bg-gray-600'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default IntroScene;
