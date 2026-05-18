// 头像提示词配置（用于AI生成）
export const portraitPrompts: Record<string, string> = {
  narrator: '神秘的戴兜帽人物',
  father: '严厉的中年父亲',
  hunter: '年轻的废土猎人',
  mechanic: '友善的技师',
  female_warrior: '强壮的女战士',
  red_wolf: '冷酷的赏金猎人',
};

// 本地头像配置（存放于 /src/assets/portraits/ 文件夹）
// 使用AI生成的像素风头像
export const localPortraits: Record<string, string> = {
  narrator: 'https://neeko-copilot.bytedance.net/api/text2image?prompt=pixel%20art%20portrait%20of%20a%20mysterious%20hooded%20figure%20with%20glowing%20blue%20eyes%20dark%20robe%20mysterious%20storyteller%20post-apocalyptic%20game%20avatar%201%3A1&size=square',
  father: 'https://neeko-copilot.bytedance.net/api/text2image?prompt=pixel%20art%20portrait%20of%20a%20stern%20middle-aged%20father%20rough%20features%20tough%20expression%20work%20clothes%20post-apocalyptic%20game%20avatar%201%3A1&size=square',
  hunter: 'https://neeko-copilot.bytedance.net/api/text2image?prompt=pixel%20art%20portrait%20of%20a%20young%20male%20post-apocalyptic%20hunter%20leather%20jacket%20red%20bandana%20determined%20expression%20game%20avatar%201%3A1&size=square',
  mechanic: 'https://neeko-copilot.bytedance.net/api/text2image?prompt=pixel%20art%20portrait%20of%20a%20young%20male%20mechanic%20goggles%20friendly%20smile%20tool%20belt%20post-apocalyptic%20game%20avatar%201%3A1&size=square',
  female_warrior: 'https://neeko-copilot.bytedance.net/api/text2image?prompt=pixel%20art%20portrait%20of%20a%20strong%20female%20warrior%20short%20hair%20combat%20armor%20fierce%20expression%20post-apocalyptic%20game%20avatar%201%3A1&size=square',
  red_wolf: 'https://neeko-copilot.bytedance.net/api/text2image?prompt=pixel%20art%20portrait%20of%20a%20cool%20confident%20male%20warrior%20red%20themed%20armor%20long%20coat%20bounty%20hunter%20post-apocalyptic%20game%20avatar%201%3A1&size=square',
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