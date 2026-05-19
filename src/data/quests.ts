import { Quest } from '../types';

export const quests: Quest[] = [
  // 主线任务 - 角色主动想要去做的事情
  {
    id: 'main_1',
    name: '梦想成为勇士',
    description: '探索世界，成为最强的赏金猎人',
    type: 'main',
    objectives: [
      {
        id: 'main_1_1',
        description: '前往酒吧打探情报',
        location: 'radom_bar'
      },
      {
        id: 'main_1_2',
        description: '击败狂犬首领',
        target: 'boss0',
        targetCount: 1
      },
      {
        id: 'main_1_3',
        description: '领取赏金',
        location: 'radom_office'
      }
    ],
    rewards: {
      exp: 100,
      gold: 200
    },
    location: 'radom_town',
    npcGiver: 'intro',
    availableAfter: [],
    dialogueStart: '你被父亲赶出了家门，但你决心成为一名真正的勇士！'
  },
  {
    id: 'main_2',
    name: '寻找战车',
    description: '酒吧老板说山洞里有战车，快去找到它！',
    type: 'main',
    objectives: [
      {
        id: 'main_2_1',
        description: '前往山洞探索',
        location: 'radom_south'
      },
      {
        id: 'main_2_2',
        description: '找到并获得战车'
      }
    ],
    rewards: {
      exp: 200,
      gold: 100
    },
    location: 'radom_bar',
    npcGiver: 'bar_owner',
    availableAfter: ['main_1_1'],
    dialogueStart: '酒吧老板告诉你："山洞里藏着一辆战车，有本事就去拿！"'
  },
  {
    id: 'main_3',
    name: '消灭水怪',
    description: '勇士中心发布通缉令，水怪赏金1000G！',
    type: 'main',
    objectives: [
      {
        id: 'main_3_1',
        description: '前往北方洞穴',
        location: 'radom_north'
      },
      {
        id: 'main_3_2',
        description: '击败水怪',
        target: 'boss1',
        targetCount: 1
      },
      {
        id: 'main_3_3',
        description: '领取赏金',
        location: 'radom_office'
      }
    ],
    rewards: {
      exp: 300,
      gold: 1000
    },
    location: 'radom_office',
    npcGiver: 'bounty_board',
    availableAfter: ['main_1'],
    dialogueStart: '勇士中心的通缉令：水怪，赏金1000G！你决定接下这个任务。'
  },
  {
    id: 'main_4',
    name: '寻找同伴',
    description: '听说波布镇有一位机械师，去招募他加入队伍',
    type: 'main',
    objectives: [
      {
        id: 'main_4_1',
        description: '前往波布镇',
        location: 'bob_town'
      },
      {
        id: 'main_4_2',
        description: '找到机械师并说服他加入',
        location: 'bob_town_factory'
      }
    ],
    rewards: {
      exp: 150
    },
    location: 'radom_bar',
    npcGiver: 'bar_owner',
    availableAfter: ['main_3'],
    dialogueStart: '酒吧老板说："波布镇有个机械师，听说手艺不错..."'
  },
  {
    id: 'main_5',
    name: '成为无畏勇士',
    description: '挑战最终Boss暗影首领，证明自己是最强的赏金猎人',
    type: 'main',
    objectives: [
      {
        id: 'main_5_1',
        description: '击败最终Boss暗影首领',
        target: 'boss10',
        targetCount: 1
      },
      {
        id: 'main_5_2',
        description: '回到拉多镇，向父亲证明自己'
      }
    ],
    rewards: {
      exp: 5000,
      gold: 100000
    },
    location: 'radom_office',
    npcGiver: 'bounty_board',
    availableAfter: ['main_4'],
    dialogueStart: '勇士中心发布终极通缉令：暗影首领，赏金99800G！这是你的最终挑战！'
  },

  // 支线任务
  {
    id: 'side_1',
    name: '装备强化',
    description: '买一把称手的武器',
    type: 'side',
    objectives: [
      {
        id: 'side_1_1',
        description: '在人类装备店购买装备',
        location: 'radom_shop_human'
      }
    ],
    rewards: {
      exp: 50
    },
    location: 'radom_town'
  },
  {
    id: 'side_2',
    name: '战车维护',
    description: '学习如何维护战车',
    type: 'side',
    objectives: [
      {
        id: 'side_2_1',
        description: '前往战车店',
        location: 'radom_shop_tank'
      },
      {
        id: 'side_2_2',
        description: '修复战车装甲',
        completed: false
      }
    ],
    rewards: {
      exp: 80
    },
    location: 'radom_town'
  },
  {
    id: 'side_3',
    name: '宝藏猎人',
    description: '探索野外，寻找隐藏的宝藏',
    type: 'side',
    objectives: [
      {
        id: 'side_3_1',
        description: '在野外探索',
        location: 'radom_wild'
      }
    ],
    rewards: {
      exp: 100,
      gold: 150
    },
    location: 'radom_wild'
  }
];

export const getQuestById = (questId: string): Quest | undefined => {
  return quests.find(q => q.id === questId);
};

export const getMainQuests = (): Quest[] => {
  return quests.filter(q => q.type === 'main');
};

export const getSideQuests = (): Quest[] => {
  return quests.filter(q => q.type === 'side');
};
