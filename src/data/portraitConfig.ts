// 头像提示词配置（用于AI生成/备用）
export const portraitPrompts: Record<string, string> = {
  narrator: '神秘的讲故事者',
  father: '严厉的中年父亲',
  hunter: '年轻的废土猎人',
  mechanic: '友善的技师',
  female_warrior: '强壮的女战士',
  red_wolf: '冷酷的赏金猎人',
  system: '科幻AI界面',
};

// 本地头像配置（存放于 /public/portraits/ 文件夹）
export const localPortraits: Record<string, string> = {
  // 系统
  narrator: '/portraits/system.jpg',
  npc: '/portraits/system.jpg',

  // 角色 (v4 新风格)
  system: '/portraits/system.jpg',
  father: '/portraits/father_v4.jpg',
  hunter: '/portraits/hunter_v4.jpg',
  mechanic: '/portraits/mechanic_v4.jpg',
  female_warrior: '/portraits/female_warrior_v4.jpg',
  red_wolf: '/portraits/red_wolf_v4.jpg',
  tank: '/portraits/tank.jpg',

  // 普通敌人
  e1: '/portraits/e1.jpg',
  e3: '/portraits/e3.jpg',
  e4: '/portraits/e4.jpg',
  e5: '/portraits/e5.jpg',
  e6: '/portraits/e6.jpg',
  e7: '/portraits/e7.jpg',
  e8: '/portraits/e8.jpg',
  e9: '/portraits/e9.jpg',
  e10: '/portraits/e10.jpg',

  // BOSS
  boss0: '/portraits/boss0.jpg',
  boss1: '/portraits/boss1.jpg',
  boss2: '/portraits/boss2.jpg',
  boss3: '/portraits/boss3.jpg',
  boss4: '/portraits/boss4.jpg',
  boss6: '/portraits/boss6.jpg',
  boss7: '/portraits/boss7.jpg',
  boss8: '/portraits/boss8.jpg',
  boss9: '/portraits/boss9.jpg',
  boss10: '/portraits/boss10.jpg',
  boss11: '/portraits/boss11.jpg',

  // 对话框角色头像映射
  '父亲': '/portraits/father_v4.jpg',
  '猎人': '/portraits/hunter_v4.jpg',
  '系统': '/portraits/system.jpg',
  '姐姐': '/portraits/female_warrior_v4.jpg',
  '酒吧老板': '/portraits/red_wolf_v4.jpg',
  '装备店老板': '/portraits/father_v4.jpg',
  '战车装备店老板': '/portraits/mechanic_v4.jpg',
  '旅馆老板': '/portraits/father_v4.jpg',
  '明奇博士': '/portraits/father_v4.jpg',
  '赏金管理员': '/portraits/red_wolf_v4.jpg',
  '保管处管理员': '/portraits/father_v4.jpg',
  '工匠': '/portraits/father_v4.jpg',
  '神秘猎人': '/portraits/red_wolf_v4.jpg',
  '小男孩': '/portraits/mechanic_v4.jpg',
  '格斗家': '/portraits/female_warrior_v4.jpg',
  '社长': '/portraits/father_v4.jpg',
  '守关士兵': '/portraits/e9.jpg',
  '审判者AI': '/portraits/boss11.jpg',
  '深渊巨兽': '/portraits/boss1.jpg',
  '勇士中心': '/portraits/system.jpg',
};

// 获取头像URL
export const getPortraitUrl = (portraitId: string): string => {
  return localPortraits[portraitId] || '';
};
