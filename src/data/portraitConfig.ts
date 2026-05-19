// 头像提示词配置（用于AI生成）
export const portraitPrompts: Record<string, string> = {
  narrator: '神秘的戴兜帽人物',
  father: '严厉的中年父亲',
  hunter: '年轻的废土猎人',
  mechanic: '友善的技师',
  female_warrior: '强壮的女战士',
  red_wolf: '冷酷的赏金猎人',
};

// 本地头像配置（存放于 /public/portraits/ 文件夹）
export const localPortraits: Record<string, string> = {
  narrator: '/portraits/系统.png',
  father: '/portraits/主角父亲.png',
  hunter: '/portraits/主角.png',
  mechanic: '/portraits/主角.png',
  female_warrior: '/portraits/主角.png',
  red_wolf: '/portraits/系统.png',
};

// 获取头像URL
export const getPortraitUrl = (portraitId: string): string => {
  if (localPortraits[portraitId]) {
    return localPortraits[portraitId];
  }
  const prompt = portraitPrompts[portraitId];
  if (prompt) {
    const encodedPrompt = encodeURIComponent(`${prompt} pixel art portrait game avatar 1:1`);
    return `https://neeko-copilot.bytedance.net/api/text2image?prompt=${encodedPrompt}&size=square`;
  }
  return '';
};