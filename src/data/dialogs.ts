import { Dialog } from '../types';

export const dialogs: Dialog[] = [
  // 拉多镇 - 离家剧情
  {
    id: 'radom_father_1',
    speaker: '父亲',
    content: '什么，你说想成为超级勇士？还没放弃这种无聊的追求！今天就从家里给我出去吧！',
    locationId: 'radom_home',
    nextDialogId: 'radom_father_2'
  },
  {
    id: 'radom_father_2',
    speaker: '系统',
    content: '主角被父亲赶出了家门...',
    nextDialogId: 'radom_father_3'
  },
  {
    id: 'radom_father_3',
    speaker: '系统',
    content: '现在可以去晨风镇探索了！记得先在镇内补充装备。',
    triggerCondition: 'hasLeftHome'
  },

  // 拉多镇 - 酒吧
  {
    id: 'radom_bar_1',
    speaker: '酒吧老板',
    content: '听说镇南的山洞里有战车，又有人说看见了"狗一样的怪物"...',
    locationId: 'radom_town'
  },
  {
    id: 'radom_bar_2',
    speaker: '酒吧老板',
    content: '如果你想变强，可以去镇外打打怪升级。巨蚁的经验值还不错！',
    locationId: 'radom_town'
  },

  // 拉多镇 - 姐姐
  {
    id: 'radom_sister_1',
    speaker: '姐姐',
    content: '弟弟，回家睡一觉吧～',
    locationId: 'radom_town',
    nextDialogId: 'radom_sister_rest'
  },
  {
    id: 'radom_sister_rest',
    speaker: '系统',
    content: '姐姐让你好好休息，HP完全恢复了！',
    action: 'restoreHP'
  },

  // 拉多镇 - 勇士中心
  {
    id: 'radom_hunter_1',
    speaker: '勇士中心',
    content: '【通缉令】\n深渊巨兽\n赏金：1000G\n地点：晨风镇北方洞穴\n特征：极其凶猛的水中怪物',
    locationId: 'radom_town'
  },

  // 狂犬首领山洞 - 进入
  {
    id: 'cave_entrance_1',
    speaker: '系统',
    content: '进入山洞深处...',
    locationId: 'radom_cave'
  },
  {
    id: 'cave_entrance_2',
    speaker: '系统',
    content: '在山洞深处发现了一辆废弃的战车！',
    locationId: 'radom_cave'
  },
  {
    id: 'cave_entrance_3',
    speaker: '系统',
    content: '突然，传来一阵咆哮声...',
    locationId: 'radom_cave',
    nextDialogId: 'cave_battle_start'
  },
  {
    id: 'cave_battle_start',
    speaker: '系统',
    content: '狂犬首领出现了！',
    action: 'startBattle_battleDog'
  },

  // 狂犬首领战斗后
  {
    id: 'cave_after_battle_1',
    speaker: '神秘猎人',
    content: '等等！这辆破车归我了！...等等，这只是个小孩？',
    triggerCondition: 'metRedWolf'
  },
  {
    id: 'cave_redwolf_2',
    speaker: '神秘猎人',
    content: '神秘猎人驾驶战车出现！',
    action: 'redWolfAppears'
  },
  {
    id: 'cave_redwolf_3',
    speaker: '神秘猎人',
    content: '我来帮你解决这家伙！',
    triggerCondition: 'metRedWolf'
  },

  // 战胜狂犬首领后
  {
    id: 'cave_victory_1',
    speaker: '系统',
    content: '狂犬首领被击败了！',
    triggerCondition: 'defeatedBattleDog'
  },
  {
    id: 'cave_victory_2',
    speaker: '神秘猎人',
    content: '这辆破车给你了！反正我也看不上这种货色。',
    nextDialogId: 'cave_victory_3'
  },
  {
    id: 'cave_victory_3',
    speaker: '系统',
    content: '获得【先锋号】！',
    action: 'getFirstTank'
  },
  {
    id: 'cave_victory_4',
    speaker: '系统',
    content: '给战车起个名字吧！',
    action: 'nameTank'
  },
  {
    id: 'cave_victory_5',
    speaker: '系统',
    content: '恭喜获得第一辆战车！现在可以挑战深渊巨兽了！去晨风镇北方探索吧！',
    triggerCondition: 'hasTank'
  },

  // 深渊巨兽洞
  {
    id: 'water_cave_entrance_1',
    speaker: '系统',
    content: '进入深渊巨兽洞穴深处...',
    locationId: 'water_cave'
  },
  {
    id: 'water_cave_entrance_2',
    speaker: '系统',
    content: '在洞穴深处发现了深渊巨兽的身影！',
    locationId: 'water_cave',
    nextDialogId: 'water_cave_battle'
  },
  {
    id: 'water_cave_battle',
    speaker: '深渊巨兽',
    content: '嘶嘶嘶...又来送死的？',
    locationId: 'water_cave',
    action: 'startBattle_waterMonster'
  },

  // 战胜深渊巨兽后
  {
    id: 'water_victory_1',
    speaker: '系统',
    content: '击败深渊巨兽！',
    triggerCondition: 'defeatedWaterMonster'
  },
  {
    id: 'water_victory_2',
    speaker: '系统',
    content: '获得经验值 150！\n获得金币 200！',
    action: 'addExpAndGold_150_200'
  },
  {
    id: 'water_victory_3',
    speaker: '系统',
    content: '回勇士中心领取赏金 1000G！',
    triggerCondition: 'defeatedWaterMonster'
  },

  // 关卡
  {
    id: 'checkpoint_1',
    speaker: '守关士兵',
    content: '站住！没有战车不得通过！',
    locationId: 'checkpoint'
  },

  // 波布镇 - 技师
  {
    id: 'bob_machanic_1',
    speaker: '小男孩',
    content: '那辆战车好帅啊！',
    locationId: 'bob_town',
    nextDialogId: 'bob_machanic_2'
  },
  {
    id: 'bob_machanic_2',
    speaker: '小男孩',
    content: '小男孩飞奔出来坐上你的战车绕着树乱开',
    nextDialogId: 'bob_machanic_3'
  },
  {
    id: 'bob_machanic_3',
    speaker: '系统',
    content: '小武加入队伍！\n（带花扳可修车）',
    action: 'recruitMechanic'
  },

  // 波布镇 - 工厂
  {
    id: 'factory_1',
    speaker: '社长',
    content: '那辆吉普车啊，随便你拿去好了。',
    locationId: 'factory',
    nextDialogId: 'factory_2'
  },
  {
    id: 'factory_2',
    speaker: '系统',
    content: '获得【铁壁号】！',
    action: 'getSecondTank',
    triggerCondition: 'visitedFactory'
  },

  // 奥多镇 - 格斗家
  {
    id: 'ordo_warrior_1',
    speaker: '格斗家',
    content: '你还没资格让我加入，除非...',
    locationId: 'ordo_town',
    nextDialogId: 'ordo_warrior_check'
  },
  {
    id: 'ordo_warrior_check',
    speaker: '系统',
    content: '要求：主角或技师HP > 255',
    action: 'checkHPRequirement'
  },
  {
    id: 'ordo_warrior_fail',
    speaker: '格斗家',
    content: 'HP不够！先变强再来吧！',
    condition: 'HP_NOT_ENOUGH'
  },
  {
    id: 'ordo_warrior_success',
    speaker: '格斗家',
    content: '好吧，我承认你有点本事。',
    nextDialogId: 'ordo_warrior_join'
  },
  {
    id: 'ordo_warrior_join',
    speaker: '系统',
    content: '阿雅加入队伍！',
    action: 'recruitWarrior',
    triggerCondition: 'recruitedWarrior'
  },

  // 击败铁血将军
  {
    id: 'marshall_victory_1',
    speaker: '系统',
    content: '击败铁血将军！',
    triggerCondition: 'defeatedMarshall'
  },
  {
    id: 'marshall_victory_2',
    speaker: '系统',
    content: '获得经验值 1000！\n获得金币 1500！\n获得【堡垒号】！',
    action: 'rewardMarshall'
  },

  // 击败黑风
  {
    id: 'gomez_victory_1',
    speaker: '系统',
    content: '击败黑风！',
    triggerCondition: 'defeatedGomez'
  },
  {
    id: 'gomez_victory_2',
    speaker: '系统',
    content: '获得经验值 2000！\n获得金币 3000！\n获得【赤焰号】！',
    action: 'rewardGomez'
  },

  // 击败暗影首领
  {
    id: 'porter_victory_1',
    speaker: '系统',
    content: '击败暗影首领！',
    triggerCondition: 'defeatedPorter'
  },
  {
    id: 'porter_victory_2',
    speaker: '系统',
    content: '获得经验值 2500！\n获得金币 4000！',
    action: 'rewardPorter'
  },

  // 最终BOSS审判者AI
  {
    id: 'noah_entrance_1',
    speaker: '审判者AI',
    content: '愚蠢的人类...我是不会让你们阻止我的！',
    locationId: 'noah_base',
    nextDialogId: 'noah_entrance_2'
  },
  {
    id: 'noah_entrance_2',
    speaker: '系统',
    content: '最终BOSS审判者AI出现！',
    action: 'startBattle_noah'
  },

  // 战胜审判者AI
  {
    id: 'noah_victory_1',
    speaker: '审判者AI',
    content: '不可能...人类怎么可能...',
    triggerCondition: 'defeatedNoah'
  },
  {
    id: 'noah_victory_2',
    speaker: '系统',
    content: '击败最终BOSS审判者AI！\n人类文明得到拯救！',
    action: 'ending'
  },
  {
    id: 'noah_victory_3',
    speaker: '系统',
    content: '🎉 恭喜通关废土战歌！\n感谢游玩！',
    action: 'showEnding'
  }
];

export const getDialogById = (id: string): Dialog | undefined => {
  return dialogs.find(d => d.id === id);
};

export const getDialogsByLocation = (locationId: string): Dialog[] => {
  return dialogs.filter(d => d.locationId === locationId);
};
