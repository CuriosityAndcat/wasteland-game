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
  npc: '/portraits/系统.png',
  father: '/portraits/父亲.png',
  hunter: '/portraits/猎人.png',
  mechanic: '/portraits/机械师.png',
  female_warrior: '/portraits/女战士.png',
  red_wolf: '/portraits/红狼.png',
  // 对话框角色头像
  '姐姐': '/portraits/姐姐.png',
  '酒吧老板': '/portraits/酒吧老板.png',
  '装备店老板': '/portraits/装备店老板.png',
  '战车装备店老板': '/portraits/战车装备店老板.png',
  '旅馆老板': '/portraits/旅馆老板.png',
  '明奇博士': '/portraits/明奇博士.png',
  '赏金管理员': '/portraits/赏金管理员.png',
  '保管处管理员': '/portraits/保管处管理员.png',
  '工匠': '/portraits/工匠.png',
  '神秘猎人': '/portraits/红狼.png',
  '小男孩': '/portraits/小男孩.png',
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