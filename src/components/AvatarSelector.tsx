import React, { useState } from 'react';
import { getPortraitUrl, portraitPrompts } from '../data/portraitConfig';

interface AvatarOption {
  id: string;
  name: string;
  description: string;
  url: string;
  selected: boolean;
}

const AvatarSelector: React.FC = () => {
  const [selectedAvatars, setSelectedAvatars] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState<Set<string>>(new Set());

  const avatarOptions: AvatarOption[] = [
    { id: 'narrator', name: '旁白', description: '神秘的讲故事者', url: getPortraitUrl(portraitPrompts.narrator), selected: !!selectedAvatars.narrator },
    { id: 'father', name: '父亲', description: '严厉的中年父亲', url: getPortraitUrl(portraitPrompts.father), selected: !!selectedAvatars.father },
    { id: 'hunter', name: '猎人', description: '年轻的废土猎人', url: getPortraitUrl(portraitPrompts.hunter), selected: !!selectedAvatars.hunter },
    { id: 'mechanic', name: '技师', description: '友善的技师小武', url: getPortraitUrl(portraitPrompts.mechanic), selected: !!selectedAvatars.mechanic },
    { id: 'female_warrior', name: '格斗家', description: '强壮的女战士阿雅', url: getPortraitUrl(portraitPrompts.female_warrior), selected: !!selectedAvatars.female_warrior },
    { id: 'red_wolf', name: '红狼', description: '冷酷的赏金猎人', url: getPortraitUrl(portraitPrompts.red_wolf), selected: !!selectedAvatars.red_wolf },
  ];

  const handleSelect = (avatar: AvatarOption) => {
    setSelectedAvatars(prev => ({
      ...prev,
      [avatar.id]: prev[avatar.id] ? '' : avatar.url
    }));
  };

  const handleImageLoad = (id: string) => {
    setLoading(prev => {
      const newSet = new Set(prev);
      newSet.delete(id);
      return newSet;
    });
  };

  const handleImageError = (id: string) => {
    setLoading(prev => {
      const newSet = new Set(prev);
      newSet.delete(id);
      return newSet;
    });
  };

  return (
    <div className="min-h-screen bg-gray-900 p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold text-white mb-6 text-center">头像选择器</h1>
        <p className="text-gray-400 mb-8 text-center">点击选择你喜欢的头像，已选择的会显示绿色边框</p>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {avatarOptions.map(avatar => (
            <div
              key={avatar.id}
              className={`relative cursor-pointer rounded-xl overflow-hidden transition-all transform hover:scale-105 ${
                avatar.selected ? 'ring-4 ring-green-500' : 'ring-2 ring-gray-600'
              }`}
              onClick={() => handleSelect(avatar)}
            >
              <div className="aspect-[3/4] bg-gray-800 relative">
                {loading.has(avatar.id) && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-10 h-10 border-4 border-gray-600 border-t-blue-500 rounded-full animate-spin"></div>
                  </div>
                )}
                <img
                  src={avatar.url}
                  alt={avatar.name}
                  className="w-full h-full object-cover"
                  onLoad={() => handleImageLoad(avatar.id)}
                  onError={() => handleImageError(avatar.id)}
                  loading="lazy"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-3">
                  <p className="text-white font-medium text-sm">{avatar.name}</p>
                  <p className="text-gray-300 text-xs">{avatar.description}</p>
                </div>
                {avatar.selected && (
                  <div className="absolute top-2 right-2 bg-green-500 rounded-full p-1">
                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 p-4 bg-gray-800 rounded-xl">
          <h2 className="text-lg font-bold text-white mb-4">已选择的头像：</h2>
          {Object.keys(selectedAvatars).length > 0 ? (
            <div className="flex flex-wrap gap-4">
              {Object.entries(selectedAvatars)
                .filter(([, url]) => url)
                .map(([id, url]) => (
                  <div key={id} className="flex items-center gap-2 bg-gray-700 rounded-lg px-3 py-2">
                    <img src={url} alt={id} className="w-8 h-8 rounded-full object-cover" />
                    <span className="text-white text-sm">{id}</span>
                  </div>
                ))}
            </div>
          ) : (
            <p className="text-gray-500">暂无选择</p>
          )}
        </div>

        <div className="mt-8 p-4 bg-gray-800 rounded-xl">
          <h2 className="text-lg font-bold text-white mb-4">使用说明：</h2>
          <ul className="text-gray-400 space-y-2">
            <li>• 点击头像可以选择/取消选择</li>
            <li>• 选择你喜欢的头像后告诉我，我会应用到游戏中</li>
            <li>• 如果图片加载失败，请刷新页面重试</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default AvatarSelector;
