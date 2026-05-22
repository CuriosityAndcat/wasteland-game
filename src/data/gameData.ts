import { Enemy, Item, Location, Blueprint } from '../types';

export const enemies: Enemy[] = [
  { 
    id: 'enemy_1', name: '巨蚁', hp: 10, maxHp: 10, attack: 8, defense: 3, speed: 8,
    expReward: 5, goldReward: 5, portraitId: 'e1',
    statusEffects: [],
    critRate: 0.05, critDamage: 1.3, dodgeRate: 0.05,
    specialAbilities: [
      { name: '巨蚁叮咬', description: '有30%概率造成中毒', effectType: 'poison', effectChance: 0.3, damageMultiplier: 1 }
    ]
  },
  { 
    id: 'enemy_3', name: '杀人虫', hp: 16, maxHp: 16, attack: 16, defense: 5, speed: 12,
    expReward: 12, goldReward: 12, portraitId: 'e3',
    statusEffects: [],
    critRate: 0.08, critDamage: 1.4, dodgeRate: 0.08,
    specialAbilities: [
      { name: '毒素喷雾', description: '有40%概率造成中毒', effectType: 'poison', effectChance: 0.4, damageMultiplier: 1 }
    ]
  },
  { 
    id: 'enemy_4', name: '仿生蜗牛', hp: 20, maxHp: 20, attack: 22, defense: 10, speed: 5,
    expReward: 15, goldReward: 18, portraitId: 'e4',
    statusEffects: [],
    critRate: 0.05, critDamage: 1.3, dodgeRate: 0.03,
    specialAbilities: [
      { name: '粘液附着', description: '有35%概率造成减速', effectType: 'slow', effectChance: 0.35, damageMultiplier: 1 }
    ]
  },
  { 
    id: 'enemy_5', name: '蜈蚣', hp: 20, maxHp: 20, attack: 20, defense: 7, speed: 15,
    expReward: 15, goldReward: 15, portraitId: 'e5',
    statusEffects: [],
    critRate: 0.1, critDamage: 1.4, dodgeRate: 0.1,
    specialAbilities: [
      { name: '毒刺攻击', description: '有50%概率造成中毒', effectType: 'poison', effectChance: 0.5, damageMultiplier: 1 }
    ]
  },
  { 
    id: 'enemy_6', name: '蝎子', hp: 25, maxHp: 25, attack: 22, defense: 8, speed: 10,
    expReward: 18, goldReward: 18, portraitId: 'e6',
    statusEffects: [],
    critRate: 0.12, critDamage: 1.5, dodgeRate: 0.08,
    specialAbilities: [
      { name: '毒尾穿刺', description: '有60%概率造成中毒', effectType: 'poison', effectChance: 0.6, damageMultiplier: 1.2 },
      { name: '蝎钳攻击', description: '普通攻击，伤害提升20%', effectType: undefined, effectChance: 0.4, damageMultiplier: 1.2 }
    ]
  },
  { 
    id: 'enemy_7', name: '机器人', hp: 35, maxHp: 35, attack: 26, defense: 10, speed: 12,
    expReward: 25, goldReward: 25, portraitId: 'e7',
    statusEffects: [],
    critRate: 0.08, critDamage: 1.4, dodgeRate: 0.06,
    specialAbilities: [
      { name: '电击光束', description: '有45%概率造成麻痹', effectType: 'paralyze', effectChance: 0.45, damageMultiplier: 1 }
    ]
  },
  { 
    id: 'enemy_8', name: '变异鼠', hp: 30, maxHp: 30, attack: 24, defense: 9, speed: 18,
    expReward: 22, goldReward: 22, portraitId: 'e8',
    statusEffects: [],
    critRate: 0.15, critDamage: 1.6, dodgeRate: 0.15,
    specialAbilities: [
      { name: '撕咬攻击', description: '有40%概率造成流血', effectType: 'bleed', effectChance: 0.4, damageMultiplier: 1 }
    ]
  },
  { 
    id: 'enemy_9', name: '强化兵', hp: 45, maxHp: 45, attack: 32, defense: 12, speed: 14,
    expReward: 35, goldReward: 35, portraitId: 'e9',
    statusEffects: [],
    critRate: 0.1, critDamage: 1.5, dodgeRate: 0.08,
    specialAbilities: [
      { name: '强化打击', description: '普通攻击，伤害提升30%', effectType: undefined, effectChance: 0.5, damageMultiplier: 1.3 },
      { name: '战吼', description: '降低敌人攻击力', effectType: 'attackDown', effectChance: 0.3, damageMultiplier: 0.8 }
    ]
  },
  { 
    id: 'enemy_10', name: '铁甲兵', hp: 55, maxHp: 55, attack: 36, defense: 15, speed: 10,
    expReward: 45, goldReward: 45, portraitId: 'e10',
    statusEffects: [],
    critRate: 0.08, critDamage: 1.4, dodgeRate: 0.05,
    specialAbilities: [
      { name: '铁甲防御', description: '提升自身防御力', effectType: 'defenseUp', effectChance: 0.4, damageMultiplier: 0.8 },
      { name: '铁拳冲击', description: '伤害提升40%', effectType: undefined, effectChance: 0.6, damageMultiplier: 1.4 }
    ]
  },

  // Boss敌人
  { 
    id: 'boss0', name: '狂犬首领', hp: 150, maxHp: 150, attack: 30, defense: 8, speed: 20,
    expReward: 100, goldReward: 50, isBoss: true, bounty: 100, portraitId: 'boss0',
    statusEffects: [],
    critRate: 0.15, critDamage: 1.6, dodgeRate: 0.12,
    specialAbilities: [
      { name: '狂犬撕咬', description: '有70%概率造成流血', effectType: 'bleed', effectChance: 0.7, damageMultiplier: 1.3 },
      { name: '狂怒咆哮', description: '狂暴攻击，伤害提升50%', effectType: 'attackUp', effectChance: 0.3, damageMultiplier: 1.5 }
    ]
  },
  { 
    id: 'boss1', name: '深渊巨兽', hp: 300, maxHp: 300, attack: 35, defense: 10, speed: 12,
    expReward: 150, goldReward: 200, isBoss: true, bounty: 1000, portraitId: 'boss1',
    statusEffects: [],
    critRate: 0.12, critDamage: 1.6, dodgeRate: 0.08,
    specialAbilities: [
      { name: '深渊之触', description: '有60%概率造成中毒', effectType: 'poison', effectChance: 0.6, damageMultiplier: 1.2 },
      { name: '重压攻击', description: '伤害提升40%', effectType: undefined, effectChance: 0.4, damageMultiplier: 1.4 }
    ]
  },
  { 
    id: 'boss2', name: '暗影潜伏者', hp: 800, maxHp: 800, attack: 45, defense: 15, speed: 25,
    expReward: 300, goldReward: 400, isBoss: true, bounty: 3000, portraitId: 'boss2',
    statusEffects: [],
    critRate: 0.2, critDamage: 1.8, dodgeRate: 0.2,
    specialAbilities: [
      { name: '暗影穿刺', description: '有65%概率造成流血', effectType: 'bleed', effectChance: 0.65, damageMultiplier: 1.4 },
      { name: '黑暗笼罩', description: '有55%概率造成恐惧/减速', effectType: 'slow', effectChance: 0.55, damageMultiplier: 1.2 },
      { name: '背刺暴击', description: '100%暴击', effectType: undefined, effectChance: 0.25, damageMultiplier: 2 }
    ]
  },
  { 
    id: 'boss3', name: '钢铁巨兽', hp: 2000, maxHp: 2000, attack: 60, defense: 25, speed: 8,
    expReward: 800, goldReward: 1000, isBoss: true, bounty: 5000, portraitId: 'boss3',
    statusEffects: [],
    critRate: 0.1, critDamage: 1.7, dodgeRate: 0.03,
    specialAbilities: [
      { name: '钢铁践踏', description: '有50%概率造成眩晕', effectType: 'stun', effectChance: 0.5, damageMultiplier: 1.3 },
      { name: '装甲强化', description: '提升自身防御力', effectType: 'defenseUp', effectChance: 0.35, damageMultiplier: 0.8 },
      { name: '巨型冲击', description: '伤害提升60%', effectType: undefined, effectChance: 0.4, damageMultiplier: 1.6 }
    ]
  },
  { 
    id: 'boss4', name: '独眼巨人', hp: 1500, maxHp: 1500, attack: 50, defense: 20, speed: 10,
    expReward: 500, goldReward: 600, isBoss: true, bounty: 8000, portraitId: 'boss4',
    statusEffects: [],
    critRate: 0.15, critDamage: 1.7, dodgeRate: 0.05,
    specialAbilities: [
      { name: '巨拳打击', description: '伤害提升50%', effectType: undefined, effectChance: 0.5, damageMultiplier: 1.5 },
      { name: '凝视冲击', description: '有45%概率造成眩晕', effectType: 'stun', effectChance: 0.45, damageMultiplier: 1.2 },
      { name: '愤怒爆发', description: '狂暴状态，伤害提升70%', effectType: 'attackUp', effectChance: 0.3, damageMultiplier: 1.7 }
    ]
  },
  { 
    id: 'boss5', name: '变异体', hp: 1200, maxHp: 1200, attack: 40, defense: 18, speed: 18,
    expReward: 400, goldReward: 500, isBoss: true, bounty: 1000, portraitId: 'boss5',
    statusEffects: [],
    critRate: 0.18, critDamage: 1.7, dodgeRate: 0.12,
    specialAbilities: [
      { name: '酸液喷射', description: '有70%概率造成中毒', effectType: 'poison', effectChance: 0.7, damageMultiplier: 1.3 },
      { name: '变异触须', description: '有60%概率造成流血', effectType: 'bleed', effectChance: 0.6, damageMultiplier: 1.2 }
    ]
  },
  { 
    id: 'boss6', name: '铁血将军', hp: 2500, maxHp: 2500, attack: 65, defense: 30, speed: 14,
    expReward: 1000, goldReward: 1500, isBoss: true, bounty: 10000, portraitId: 'boss6',
    statusEffects: [],
    critRate: 0.15, critDamage: 1.8, dodgeRate: 0.08,
    specialAbilities: [
      { name: '铁血斩击', description: '伤害提升60%', effectType: undefined, effectChance: 0.5, damageMultiplier: 1.6 },
      { name: '将军令', description: '有60%概率造成恐惧/减速', effectType: 'slow', effectChance: 0.6, damageMultiplier: 1.3 },
      { name: '铁血护盾', description: '提升自身防御力', effectType: 'defenseUp', effectChance: 0.4, damageMultiplier: 0.8 }
    ]
  },
  { 
    id: 'boss7', name: '大象', hp: 3000, maxHp: 3000, attack: 70, defense: 35, speed: 6,
    expReward: 1200, goldReward: 1800, isBoss: true, bounty: 10000, portraitId: 'boss7',
    statusEffects: [],
    critRate: 0.1, critDamage: 1.7, dodgeRate: 0.03,
    specialAbilities: [
      { name: '巨象践踏', description: '有60%概率造成眩晕', effectType: 'stun', effectChance: 0.6, damageMultiplier: 1.4 },
      { name: '象鼻横扫', description: '伤害提升50%', effectType: undefined, effectChance: 0.4, damageMultiplier: 1.5 }
    ]
  },
  { 
    id: 'boss8', name: '百足巨虫', hp: 3500, maxHp: 3500, attack: 75, defense: 40, speed: 22,
    expReward: 1500, goldReward: 2000, isBoss: true, bounty: 32000, portraitId: 'boss8',
    statusEffects: [],
    critRate: 0.18, critDamage: 1.8, dodgeRate: 0.15,
    specialAbilities: [
      { name: '剧毒针刺', description: '有80%概率造成中毒', effectType: 'poison', effectChance: 0.8, damageMultiplier: 1.4 },
      { name: '百足缠绕', description: '有70%概率造成减速', effectType: 'slow', effectChance: 0.7, damageMultiplier: 1.2 },
      { name: '剧毒爆发', description: '伤害提升70%', effectType: undefined, effectChance: 0.3, damageMultiplier: 1.7 }
    ]
  },
  { 
    id: 'boss9', name: '黑风', hp: 4000, maxHp: 4000, attack: 80, defense: 45, speed: 28,
    expReward: 2000, goldReward: 3000, isBoss: true, bounty: 50000, portraitId: 'boss9',
    statusEffects: [],
    critRate: 0.2, critDamage: 1.9, dodgeRate: 0.2,
    specialAbilities: [
      { name: '黑风横扫', description: '伤害提升70%', effectType: undefined, effectChance: 0.5, damageMultiplier: 1.7 },
      { name: '黑暗刃', description: '有80%概率造成流血', effectType: 'bleed', effectChance: 0.8, damageMultiplier: 1.5 },
      { name: '黑风怒号', description: '狂暴状态，伤害翻倍', effectType: 'attackUp', effectChance: 0.25, damageMultiplier: 2 }
    ]
  },
  { 
    id: 'boss10', name: '暗影首领', hp: 4500, maxHp: 4500, attack: 85, defense: 50, speed: 25,
    expReward: 2500, goldReward: 4000, isBoss: true, bounty: 99800, portraitId: 'boss10',
    statusEffects: [],
    critRate: 0.22, critDamage: 2.0, dodgeRate: 0.22,
    specialAbilities: [
      { name: '暗影之怒', description: '伤害提升80%', effectType: undefined, effectChance: 0.5, damageMultiplier: 1.8 },
      { name: '暗影燃烧', description: '有85%概率造成燃烧', effectType: 'burn', effectChance: 0.85, damageMultiplier: 1.5 },
      { name: '黑暗之影', description: '100%暴击', effectType: undefined, effectChance: 0.3, damageMultiplier: 2.5 }
    ]
  },
  { 
    id: 'boss11', name: '审判者AI', hp: 10000, maxHp: 10000, attack: 100, defense: 60, speed: 16,
    expReward: 5000, goldReward: 10000, isBoss: true, portraitId: 'boss11',
    statusEffects: [],
    critRate: 0.2, critDamage: 2.0, dodgeRate: 0.15,
    specialAbilities: [
      { name: '审判光束', description: '有70%概率造成麻痹', effectType: 'paralyze', effectChance: 0.7, damageMultiplier: 1.6 },
      { name: '电磁脉冲', description: '有65%概率造成眩晕', effectType: 'stun', effectChance: 0.65, damageMultiplier: 1.4 },
      { name: '系统崩溃', description: '终结攻击，伤害翻倍', effectType: undefined, effectChance: 0.25, damageMultiplier: 2 },
      { name: 'AI强化', description: '提升自身攻击和防御', effectType: 'attackUp', effectChance: 0.35, damageMultiplier: 0.8 }
    ]
  }
];

export const items: Item[] = [
  { id: 'i1', name: '参丸', type: 'consumable', value: 50, description: '恢复50点HP', price: 10 },
  { id: 'i2', name: '手雷', type: 'consumable', value: 30, description: '投掷伤害30', price: 5 },
  { id: 'i3', name: '火瓶', type: 'consumable', value: 40, description: '投掷伤害40', price: 10 },
  { id: 'i4', name: '导弹', type: 'consumable', value: 60, description: '投掷伤害60', price: 20 },
  { id: 'i5', name: '解药', type: 'consumable', value: 0, description: '解除中毒状态', price: 20 },
  { id: 'i6', name: '烟幕', type: 'consumable', value: 0, description: '降低敌人命中率', price: 50 },
  { id: 'i7', name: '军号', type: 'consumable', value: 0, description: '提升攻击力', price: 100 },
  { id: 'i8', name: '雷达', type: 'consumable', value: 0, description: '提升攻击和命中', price: 150 },
  { id: 'i9', name: '地图', type: 'consumable', value: 0, description: '战斗中提升命中率', price: 80 },
  { id: 'i10', name: '药液', type: 'consumable', value: 50, description: '腐蚀敌人', price: 30 },
  { id: 'i11', name: '再生丸', type: 'consumable', value: 0, description: '复活同伴', price: 500 },

  { id: 'i12', name: 'PAG40', type: 'consumable', value: 40, description: '恢复40装甲', price: 30 },
  { id: 'i13', name: 'PAG80', type: 'consumable', value: 80, description: '恢复80装甲', price: 60 },
  { id: 'i14', name: 'PAGL', type: 'consumable', value: 150, description: '恢复150装甲', price: 100 },
  { id: 'i15', name: '传真', type: 'consumable', value: 0, description: '瞬间传送', price: 200 },
  { id: 'i16', name: '石蜡', type: 'consumable', value: 0, description: '酸中和', price: 20 },
  { id: 'i17', name: '迷彩条', type: 'consumable', value: 0, description: '降低遇敌率', price: 50 },

  { id: 'w1', name: '45炮', type: 'weapon', value: 20, description: '攻击力+20 主炮', price: 200, ammo: 16 },
  { id: 'w2', name: '55炮', type: 'weapon', value: 28, description: '攻击力+28 主炮', price: 500, ammo: 14 },
  { id: 'w3', name: '75炮', type: 'weapon', value: 35, description: '攻击力+35 主炮', price: 1000, ammo: 12 },
  { id: 'w4', name: '105加农炮', type: 'weapon', value: 50, description: '攻击力+50 主炮', price: 2500, ammo: 10 },
  { id: 'w5', name: '125加农炮', type: 'weapon', value: 65, description: '攻击力+65 主炮', price: 5000, ammo: 8 },
  { id: 'w6', name: '155加农炮', type: 'weapon', value: 80, description: '攻击力+80 主炮', price: 10000, ammo: 6 },

  { id: 'w7', name: '07机关炮', type: 'subWeapon', value: 8, description: '攻击力+8 副炮', price: 100 },
  { id: 'w8', name: '09机关炮', type: 'subWeapon', value: 12, description: '攻击力+12 副炮', price: 250 },
  { id: 'w9', name: '11机关炮', type: 'subWeapon', value: 15, description: '攻击力+15 副炮', price: 400 },
  { id: 'w10', name: '25机关炮', type: 'subWeapon', value: 25, description: '攻击力+25 副炮', price: 800 },
  { id: 'w11', name: '波坦', type: 'subWeapon', value: 35, description: '攻击力+35 副炮', price: 2000 },

  { id: 's1', name: 'ATM导弹', type: 'se', value: 50, description: '攻击力+50 SE', price: 3000, ammo: 5 },
  { id: 's2', name: '喷火器', type: 'se', value: 40, description: '攻击力+40 SE', price: 1500, ammo: 8 },
  { id: 's3', name: '托卢', type: 'se', value: 60, description: '攻击力+60 SE', price: 4000, ammo: 4 },
  { id: 's4', name: '截击', type: 'se', value: 70, description: '攻击力+70 SE', price: 6000, ammo: 3 },

  { id: 'e1', name: 'V24引擎', type: 'engine', value: 10, description: '防御力+10', price: 500 },
  { id: 'e2', name: 'V48引擎', type: 'engine', value: 20, description: '防御力+20', price: 1500 },
  { id: 'e3', name: 'V66引擎', type: 'engine', value: 30, description: '防御力+30', price: 3000 },
  { id: 'e4', name: 'V100引擎', type: 'engine', value: 40, description: '防御力+40', price: 5000 },

  { id: 'c1', name: 'HAL900', type: 'cDevice', value: 5, description: '命中率+5%', price: 800 },
  { id: 'c2', name: 'SOLO', type: 'cDevice', value: 10, description: '命中率+10%', price: 1500 },
  { id: 'c3', name: '艾米', type: 'cDevice', value: 15, description: '命中率+15%', price: 3000 },
  { id: 'c4', name: 'SOLOMON2', type: 'cDevice', value: 25, description: '命中率+25%', price: 6000 },

  { id: 'h1', name: '皮帽', type: 'head', value: 3, description: '防御力+3', price: 50 },
  { id: 'h2', name: '钢盔', type: 'head', value: 8, description: '防御力+8', price: 200 },
  { id: 'h3', name: '铁盔', type: 'head', value: 12, description: '防御力+12', price: 500 },

  { id: 'ha1', name: '手套', type: 'hand', value: 2, description: '防御力+2', price: 30 },
  { id: 'ha2', name: '钢爪', type: 'hand', value: 6, description: '防御力+6', price: 180 },
  { id: 'ha3', name: '铁爪', type: 'hand', value: 10, description: '防御力+10', price: 450 },

  { id: 'b1', name: '皮甲', type: 'body', value: 5, description: '防御力+5', price: 80 },
  { id: 'b2', name: '锁子甲', type: 'body', value: 12, description: '防御力+12', price: 300 },
  { id: 'b3', name: '铁甲', type: 'body', value: 18, description: '防御力+18', price: 800 },

  { id: 'f1', name: '皮靴', type: 'foot', value: 3, description: '防御力+3', price: 40 },
  { id: 'f2', name: '钢靴', type: 'foot', value: 7, description: '防御力+7', price: 150 },
  { id: 'f3', name: '铁靴', type: 'foot', value: 10, description: '防御力+10', price: 400 },

  { id: 'wp1', name: '弹弓', type: 'humanWeapon', value: 3, description: '攻击力+3', price: 30 },
  { id: 'wp2', name: '弩', type: 'humanWeapon', value: 8, description: '攻击力+8', price: 80 },
  { id: 'wp3', name: '短枪', type: 'humanWeapon', value: 15, description: '攻击力+15', price: 180 },
  { id: 'wp4', name: '火枪', type: 'humanWeapon', value: 25, description: '攻击力+25', price: 295 },
  { id: 'wp5', name: '机关枪', type: 'humanWeapon', value: 35, description: '攻击力+35', price: 500 },

  { id: 'bp1', name: '参丸配方', type: 'blueprint', value: 0, description: '学习制作参丸', price: 50 },
  { id: 'bp2', name: '手雷图纸', type: 'blueprint', value: 0, description: '学习制作手雷', price: 80 },
  { id: 'bp3', name: '火瓶图纸', type: 'blueprint', value: 0, description: '学习制作火瓶', price: 100 },
  { id: 'bp4', name: '导弹图纸', type: 'blueprint', value: 0, description: '学习制作导弹', price: 200 },
  { id: 'bp5', name: '45炮图纸', type: 'blueprint', value: 0, description: '学习制作45炮', price: 300 },
  { id: 'bp6', name: '55炮图纸', type: 'blueprint', value: 0, description: '学习制作55炮', price: 500 },
  { id: 'bp7', name: '75炮图纸', type: 'blueprint', value: 0, description: '学习制作75炮', price: 800 },
  { id: 'bp8', name: 'PAG40配方', type: 'blueprint', value: 0, description: '学习制作PAG40', price: 100 },
  { id: 'bp9', name: 'PAG80配方', type: 'blueprint', value: 0, description: '学习制作PAG80', price: 200 },
  { id: 'bp10', name: '短枪图纸', type: 'blueprint', value: 0, description: '学习制作短枪', price: 150 },
  { id: 'bp11', name: '火枪图纸', type: 'blueprint', value: 0, description: '学习制作火枪', price: 250 },
  { id: 'bp12', name: '机关枪图纸', type: 'blueprint', value: 0, description: '学习制作机关枪', price: 400 },
  { id: 'bp13', name: '钢盔图纸', type: 'blueprint', value: 0, description: '学习制作钢盔', price: 150 },
  { id: 'bp14', name: '锁子甲图纸', type: 'blueprint', value: 0, description: '学习制作锁子甲', price: 250 },
  { id: 'bp15', name: '105加农炮图纸', type: 'blueprint', value: 0, description: '学习制作105加农炮', price: 1200 },
  { id: 'bp16', name: '解药配方', type: 'blueprint', value: 0, description: '学习制作解药', price: 60 },

  { id: 'mat1', name: '草药', type: 'consumable', value: 0, description: '采集的野生草药，可用于制作药品', price: 5 },
  { id: 'mat2', name: '铁矿石', type: 'consumable', value: 0, description: '熔炼后可用于锻造武器和装甲板', price: 10 },
  { id: 'mat3', name: '火药', type: 'consumable', value: 0, description: '制作爆炸物和弹药的核心材料', price: 8 },
  { id: 'mat4', name: '精密零件', type: 'consumable', value: 0, description: '精密的机械零件，用于制作高级装备', price: 25 },
  { id: 'mat5', name: '燃料', type: 'consumable', value: 0, description: '易燃燃料，可用于制作燃烧瓶和焊接金属', price: 12 }
];

export const blueprints: Blueprint[] = [
  {
    id: 'bp1',
    name: '参丸配方',
    description: '将草药研磨成粉，制成恢复50点HP的参丸',
    price: 50,
    craftResult: { itemId: 'i1', quantity: 1 },
    materials: [
      { itemId: 'mat1', quantity: 2 }
    ]
  },
  {
    id: 'bp2',
    name: '手雷图纸',
    description: '铁壳内填充火药，制成投掷伤害30的手雷',
    price: 80,
    craftResult: { itemId: 'i2', quantity: 1 },
    materials: [
      { itemId: 'mat2', quantity: 1 },
      { itemId: 'mat3', quantity: 2 }
    ]
  },
  {
    id: 'bp3',
    name: '火瓶图纸',
    description: '瓶中灌入燃料，塞上引火药，制成投掷伤害40的火瓶',
    price: 100,
    craftResult: { itemId: 'i3', quantity: 1 },
    materials: [
      { itemId: 'mat5', quantity: 2 },
      { itemId: 'mat3', quantity: 1 }
    ]
  },
  {
    id: 'bp4',
    name: '导弹图纸',
    description: '精密制导装置配合高能炸药，制成投掷伤害60的导弹',
    price: 200,
    craftResult: { itemId: 'i4', quantity: 1 },
    materials: [
      { itemId: 'mat3', quantity: 3 },
      { itemId: 'mat4', quantity: 1 }
    ]
  },
  {
    id: 'bp5',
    name: '45炮图纸',
    description: '用铁矿石锻造45mm主炮，攻击力+20',
    price: 300,
    craftResult: { itemId: 'w1', quantity: 1 },
    materials: [
      { itemId: 'mat2', quantity: 4 }
    ]
  },
  {
    id: 'bp6',
    name: '55炮图纸',
    description: '锻造55mm主炮，配合精密膛线，攻击力+28',
    price: 500,
    craftResult: { itemId: 'w2', quantity: 1 },
    materials: [
      { itemId: 'mat2', quantity: 5 },
      { itemId: 'mat4', quantity: 1 }
    ]
  },
  {
    id: 'bp7',
    name: '75炮图纸',
    description: '锻造75mm大口径主炮，攻击力+35',
    price: 800,
    craftResult: { itemId: 'w3', quantity: 1 },
    materials: [
      { itemId: 'mat2', quantity: 6 },
      { itemId: 'mat4', quantity: 2 }
    ]
  },
  {
    id: 'bp8',
    name: 'PAG40配方',
    description: '铁矿石锻造装甲板，配合燃料焊接，制成PAG40恢复40装甲',
    price: 100,
    craftResult: { itemId: 'i12', quantity: 1 },
    materials: [
      { itemId: 'mat2', quantity: 3 },
      { itemId: 'mat5', quantity: 1 }
    ]
  },
  {
    id: 'bp9',
    name: 'PAG80配方',
    description: '更厚的装甲板配合燃料焊接，制成PAG80恢复80装甲',
    price: 200,
    craftResult: { itemId: 'i13', quantity: 1 },
    materials: [
      { itemId: 'mat2', quantity: 5 },
      { itemId: 'mat5', quantity: 2 }
    ]
  },
  {
    id: 'bp10',
    name: '短枪图纸',
    description: '铁管配合火药，制成攻击力+15的短枪',
    price: 150,
    craftResult: { itemId: 'wp3', quantity: 1 },
    materials: [
      { itemId: 'mat2', quantity: 2 },
      { itemId: 'mat3', quantity: 2 }
    ]
  },
  {
    id: 'bp11',
    name: '火枪图纸',
    description: '精铁枪管配合火药，制成攻击力+25的火枪',
    price: 250,
    craftResult: { itemId: 'wp4', quantity: 1 },
    materials: [
      { itemId: 'mat2', quantity: 3 },
      { itemId: 'mat3', quantity: 3 },
      { itemId: 'mat5', quantity: 1 }
    ]
  },
  {
    id: 'bp12',
    name: '机关枪图纸',
    description: '精密连发机构配合铁材，制成攻击力+35的机关枪',
    price: 400,
    craftResult: { itemId: 'wp5', quantity: 1 },
    materials: [
      { itemId: 'mat2', quantity: 4 },
      { itemId: 'mat4', quantity: 1 },
      { itemId: 'mat3', quantity: 2 }
    ]
  },
  {
    id: 'bp13',
    name: '钢盔图纸',
    description: '铁矿石锻造钢盔，防御力+8',
    price: 150,
    craftResult: { itemId: 'h2', quantity: 1 },
    materials: [
      { itemId: 'mat2', quantity: 2 }
    ]
  },
  {
    id: 'bp14',
    name: '锁子甲图纸',
    description: '铁矿石编织锁子甲，防御力+12',
    price: 250,
    craftResult: { itemId: 'b2', quantity: 1 },
    materials: [
      { itemId: 'mat2', quantity: 3 }
    ]
  },
  {
    id: 'bp15',
    name: '105加农炮图纸',
    description: '大口径加农炮，需要大量铁材和精密零件，攻击力+50',
    price: 1200,
    craftResult: { itemId: 'w4', quantity: 1 },
    materials: [
      { itemId: 'mat2', quantity: 8 },
      { itemId: 'mat4', quantity: 3 }
    ]
  },
  {
    id: 'bp16',
    name: '解药配方',
    description: '草药提炼解毒成分，制成解除中毒的解药',
    price: 60,
    craftResult: { itemId: 'i5', quantity: 1 },
    materials: [
      { itemId: 'mat1', quantity: 3 }
    ]
  }
];

export const locations: Location[] = [
  // ============ 晨风镇区域 ============
  // 晨风镇 → 晨风镇周边 → 废弃矿洞 / 晨风镇北方
  {
    id: 'radom_town',
    name: '晨风镇',
    description: '你的故乡，一个宁静的小镇。',
    type: 'town',
    connections: [
      { locationId: 'radom_south', direction: '镇南门（探索）' },
      { locationId: 'radom_north', direction: '镇北门（需战车）', requirement: 'hasTank' }
    ],
    parentTownId: 'radom',
    enemyChance: 0,
    treasureChance: 0,
    eventChance: 0.1,
    buildings: [
      { id: 'radom_home', name: '我的家', type: 'home', description: '你在晨风镇的住所', icon: '🏠' },
      { id: 'radom_house2', name: '姐姐家', type: 'house', description: '免费休息恢复HP', icon: '🏠' },
      { id: 'radom_bar', name: '酒吧', type: 'bar', description: '可以在这里打探情报', icon: '🍺' },
      { id: 'radom_inn', name: '旅馆', type: 'inn', description: '花50金币休息恢复HP', icon: '🏨' },
      { id: 'radom_shop_human', name: '人类装备店', type: 'shop_human', description: '购买武器和防具', icon: '⚔️', itemIds: ['i1', 'i2', 'wp1', 'h1', 'ha1', 'b1', 'f1'] },
      { id: 'radom_shop_tank', name: '战车装备店', type: 'shop_tank', description: '购买战车道具和装甲', icon: '🛞', itemIds: ['i12', 'w1', 'w7', 'e1', 'c1'] },
      { id: 'radom_hospital', name: '诊所', type: 'hospital', description: '复活死去的同伴', icon: '🏥' },
      { id: 'radom_office', name: '赏金大厅', type: 'office', description: '查看通缉犯名单，领取赏金', icon: '🎯' },
      { id: 'radom_warehouse', name: '保管处', type: 'warehouse', description: '存放多余的物品', icon: '📦' },
      { id: 'radom_house1', name: '居民房', type: 'house', description: '可以和居民交谈', icon: '🏠' },
      { id: 'radom_workshop', name: '简易工坊', type: 'workshop', description: '初级制造，只能做简单物品', icon: '🔧', itemIds: ['bp1', 'bp2', 'bp8', 'bp16', 'mat1', 'mat2', 'mat3', 'mat5'] }
    ]
  },
  {
    id: 'radom_south',
    name: '晨风镇周边',
    description: '晨风镇南方的荒野，可以打怪升级。',
    type: 'wilderness',
    connections: [
      { locationId: 'radom_town', direction: '返回镇内' },
      { locationId: 'radom_cave_1f', direction: '废弃矿洞' }
    ],
    parentTownId: 'radom',
    enemyChance: 0.4,
    treasureChance: 0.1,
    eventChance: 0.1,
    enemyIds: ['enemy_1', 'enemy_3']
  },
  {
    id: 'radom_cave_1f',
    name: '废弃矿洞1F',
    description: '阴森的山洞，深处隐约有光芒...',
    type: 'dungeon',
    connections: [
      { locationId: 'radom_south', direction: '返回洞口' },
      { locationId: 'radom_cave_2f', direction: '深入山洞' }
    ],
    parentTownId: 'radom',
    enemyChance: 0.4,
    treasureChance: 0.2,
    eventChance: 0.1,
    enemyIds: ['enemy_4', 'enemy_5']
  },
  {
    id: 'radom_cave_2f',
    name: '废弃矿洞2F',
    description: '山洞的最深处，一辆废弃的战车停在那里...',
    type: 'dungeon',
    connections: [
      { locationId: 'radom_cave_1f', direction: '返回上层' }
    ],
    parentTownId: 'radom',
    enemyChance: 0,
    treasureChance: 0,
    eventChance: 0,
    bossId: 'boss0',
    enemyIds: []
  },
  {
    id: 'radom_north',
    name: '晨风镇北方',
    description: '晨风镇北方的荒野，需要战车才能到达。',
    type: 'wilderness',
    connections: [
      { locationId: 'radom_town', direction: '返回镇内' },
      { locationId: 'water_cave', direction: '深渊洞穴' },
      { locationId: 'checkpoint', direction: '关卡' }
    ],
    parentTownId: 'radom',
    enemyChance: 0.5,
    treasureChance: 0.15,
    eventChance: 0.1,
    enemyIds: ['enemy_3', 'enemy_4']
  },
  {
    id: 'water_cave',
    name: '深渊洞穴',
    description: '深渊巨兽就藏在洞穴深处！',
    type: 'dungeon',
    connections: [{ locationId: 'radom_north', direction: '返回' }],
    parentTownId: 'radom',
    enemyChance: 0.7,
    treasureChance: 0.2,
    eventChance: 0.1,
    bossId: 'boss1'
  },
  {
    id: 'checkpoint',
    name: '关卡',
    description: '需要有战车才能通过的关卡。',
    type: 'wilderness',
    connections: [
      { locationId: 'radom_north', direction: '返回' },
      { locationId: 'negi_town', direction: '铁门镇', requirement: 'hasTank' }
    ],
    parentTownId: 'radom',
    enemyChance: 0,
    treasureChance: 0,
    eventChance: 0
  },

  // ============ 铁门镇区域 ============
  // 铁门镇 → 铁门镇周边
  {
    id: 'negi_town',
    name: '铁门镇',
    description: '一个宁静的小镇，时光机就在这里。',
    type: 'town',
    connections: [
      { locationId: 'checkpoint', direction: '返回' },
      { locationId: 'negi_wilderness', direction: '镇外探索' }
    ],
    parentTownId: 'negi',
    enemyChance: 0,
    treasureChance: 0,
    eventChance: 0.1,
    buildings: [
      { id: 'negi_bar', name: '酒吧', type: 'bar', description: '可以在这里打探情报', icon: '🍺' },
      { id: 'negi_inn', name: '旅馆', type: 'inn', description: '花金币休息恢复HP', icon: '🏨' },
      { id: 'negi_shop_human', name: '人类装备店', type: 'shop_human', description: '购买武器和防具', icon: '⚔️', itemIds: ['i1', 'i3', 'i5', 'wp2', 'h2', 'ha2', 'b2', 'f2'] },
      { id: 'negi_shop_tank', name: '战车装备店', type: 'shop_tank', description: '购买战车道具和装甲', icon: '🛞', itemIds: ['i12', 'i13', 'w2', 'w8', 'e2', 'c2'] },
      { id: 'negi_hospital', name: '诊所', type: 'hospital', description: '复活死去的同伴', icon: '🏥' },
      { id: 'negi_office', name: '赏金大厅', type: 'office', description: '查看通缉犯名单', icon: '🎯' },
      { id: 'negi_warehouse', name: '保管处', type: 'warehouse', description: '存放多余的物品', icon: '📦' },
      { id: 'negi_house1', name: '居民房', type: 'house', description: '可以和居民交谈', icon: '🏠' },
      { id: 'negi_timemachine', name: '时光机', type: 'timeMachine', description: '回到过去', icon: '⏰' },
      { id: 'negi_workshop', name: '铁器工坊', type: 'workshop', description: '可以制造基础武器和防具', icon: '🔨', itemIds: ['bp1', 'bp2', 'bp3', 'bp5', 'bp8', 'bp9', 'bp10', 'bp13', 'bp16', 'mat1', 'mat2', 'mat3', 'mat5'] }
    ]
  },
  {
    id: 'negi_wilderness',
    name: '铁门镇周边',
    description: '铁门镇周边的荒野地区。',
    type: 'wilderness',
    connections: [
      { locationId: 'negi_town', direction: '返回镇内' },
      { locationId: 'bob_town', direction: '绿洲镇' }
    ],
    parentTownId: 'negi',
    enemyChance: 0.4,
    treasureChance: 0.2,
    eventChance: 0.1,
    enemyIds: ['enemy_4', 'enemy_5', 'enemy_6']
  },

  // ============ 绿洲镇区域 ============
  // 绿洲镇 → 绿洲镇周边 → 废弃工厂 / 跨河大桥
  {
    id: 'bob_town',
    name: '绿洲镇',
    description: '繁华的贸易城镇，战车改造店很有名！',
    type: 'town',
    connections: [
      { locationId: 'negi_wilderness', direction: '返回' },
      { locationId: 'bob_wilderness', direction: '镇外探索' }
    ],
    parentTownId: 'bob',
    enemyChance: 0,
    treasureChance: 0,
    eventChance: 0.1,
    buildings: [
      { id: 'bob_bar', name: '酒吧', type: 'bar', description: '可以在这里打探情报', icon: '🍺' },
      { id: 'bob_inn', name: '旅馆', type: 'inn', description: '花金币休息恢复HP', icon: '🏨' },
      { id: 'bob_shop_human', name: '人类装备店', type: 'shop_human', description: '购买武器和防具', icon: '⚔️', itemIds: ['i1', 'i4', 'i6', 'wp3', 'h3', 'ha3', 'b3', 'f3'] },
      { id: 'bob_shop_tank', name: '战车装备店', type: 'shop_tank', description: '购买战车道具和装甲', icon: '🛞', itemIds: ['i12', 'i13', 'i14', 'w3', 'w9', 'e3', 'c3'] },
      { id: 'bob_hospital', name: '诊所', type: 'hospital', description: '复活死去的同伴', icon: '🏥' },
      { id: 'bob_office', name: '赏金大厅', type: 'office', description: '查看通缉犯名单，领取赏金', icon: '🎯' },
      { id: 'bob_warehouse', name: '保管处', type: 'warehouse', description: '存放多余的物品', icon: '📦' },
      { id: 'bob_house1', name: '居民房', type: 'house', description: '可以和居民交谈', icon: '🏠' },
      { id: 'bob_garage', name: '战车改造店', type: 'garage', description: '改造战车装备', icon: '🔧' },
      { id: 'bob_workshop', name: '机械工坊', type: 'workshop', description: '可以制造战车武器和中级装备', icon: '⚙️', itemIds: ['bp1', 'bp2', 'bp3', 'bp5', 'bp6', 'bp8', 'bp9', 'bp10', 'bp13', 'bp14', 'bp16', 'mat1', 'mat2', 'mat3', 'mat4', 'mat5'] }
    ]
  },
  {
    id: 'bob_wilderness',
    name: '绿洲镇周边',
    description: '绿洲镇周边的荒野地区。',
    type: 'wilderness',
    connections: [
      { locationId: 'bob_town', direction: '返回镇内' },
      { locationId: 'factory', direction: '废弃工厂' },
      { locationId: 'bridge', direction: '跨河大桥' }
    ],
    parentTownId: 'bob',
    enemyChance: 0.5,
    treasureChance: 0.2,
    eventChance: 0.1,
    enemyIds: ['enemy_6', 'enemy_7', 'enemy_8']
  },
  {
    id: 'factory',
    name: '废弃工厂',
    description: '废弃的工厂，里面藏着一辆战车！',
    type: 'dungeon',
    connections: [{ locationId: 'bob_wilderness', direction: '返回' }],
    parentTownId: 'bob',
    enemyChance: 0.5,
    treasureChance: 0.3,
    eventChance: 0.2,
    enemyIds: ['enemy_7', 'enemy_8']
  },
  {
    id: 'bridge',
    name: '跨河大桥',
    description: '连接两岸的大桥，暗影潜伏！',
    type: 'wilderness',
    connections: [
      { locationId: 'bob_wilderness', direction: '返回' },
      { locationId: 'giant_cannon', direction: '钢铁堡垒' }
    ],
    parentTownId: 'bob',
    enemyChance: 0.5,
    treasureChance: 0.1,
    eventChance: 0.1,
    bossId: 'boss2'
  },
  {
    id: 'giant_cannon',
    name: '钢铁堡垒',
    description: '废弃的军事设施，钢铁巨兽守护着这里。',
    type: 'dungeon',
    connections: [
      { locationId: 'bridge', direction: '返回' },
      { locationId: 'ordo_town', direction: '石山镇' }
    ],
    parentTownId: 'bob',
    enemyChance: 0.8,
    treasureChance: 0.2,
    eventChance: 0.1,
    bossId: 'boss3'
  },

  // ============ 石山镇区域 ============
  // 石山镇 → 石山镇周边
  {
    id: 'ordo_town',
    name: '石山镇',
    description: '一座美丽的城镇，可以招募格斗家！',
    type: 'town',
    connections: [
      { locationId: 'giant_cannon', direction: '返回' },
      { locationId: 'ordo_wilderness', direction: '镇外探索' }
    ],
    parentTownId: 'ordo',
    enemyChance: 0,
    treasureChance: 0,
    eventChance: 0.1,
    buildings: [
      { id: 'ordo_bar', name: '酒吧', type: 'bar', description: '可以在这里打探情报', icon: '🍺' },
      { id: 'ordo_inn', name: '旅馆', type: 'inn', description: '花金币休息恢复HP', icon: '🏨' },
      { id: 'ordo_shop_human', name: '人类装备店', type: 'shop_human', description: '购买武器和防具', icon: '⚔️', itemIds: ['i1', 'i7', 'wp4'] },
      { id: 'ordo_shop_tank', name: '战车装备店', type: 'shop_tank', description: '购买战车道具和装甲', icon: '🛞', itemIds: ['i12', 'i13', 'i14', 'w4', 'w10', 's2'] },
      { id: 'ordo_hospital', name: '诊所', type: 'hospital', description: '复活死去的同伴', icon: '🏥' },
      { id: 'ordo_office', name: '赏金大厅', type: 'office', description: '查看通缉犯名单，领取赏金', icon: '🎯' },
      { id: 'ordo_warehouse', name: '保管处', type: 'warehouse', description: '存放多余的物品', icon: '📦' },
      { id: 'ordo_house1', name: '居民房', type: 'house', description: '可以和居民交谈', icon: '🏠' },
      { id: 'ordo_workshop', name: '精密工坊', type: 'workshop', description: '可以制造高级武器和精密制造', icon: '🛠️', itemIds: ['bp1', 'bp2', 'bp3', 'bp4', 'bp5', 'bp6', 'bp7', 'bp8', 'bp9', 'bp10', 'bp11', 'bp13', 'bp14', 'bp16', 'mat1', 'mat2', 'mat3', 'mat4', 'mat5'] }
    ]
  },
  {
    id: 'ordo_wilderness',
    name: '石山镇周边',
    description: '石山镇周边的荒野地区。',
    type: 'wilderness',
    connections: [
      { locationId: 'ordo_town', direction: '返回镇内' },
      { locationId: 'porto_town', direction: '铁锚港' },
      { locationId: 'rock_town', direction: '铁拳镇' }
    ],
    parentTownId: 'ordo',
    enemyChance: 0.5,
    treasureChance: 0.2,
    eventChance: 0.1,
    enemyIds: ['enemy_7', 'enemy_8']
  },

  // ============ 铁锚港区域 ============
  // 铁锚港 → 港口大楼
  {
    id: 'porto_town',
    name: '铁锚港',
    description: '港口城镇，可以购买第三辆战车！',
    type: 'town',
    connections: [
      { locationId: 'ordo_wilderness', direction: '返回' },
      { locationId: 'porto_wilderness', direction: '港口探索' },
      { locationId: 'porto_building', direction: '港口大楼' }
    ],
    parentTownId: 'porto',
    enemyChance: 0,
    treasureChance: 0,
    eventChance: 0.1,
    buildings: [
      { id: 'porto_bar', name: '酒吧', type: 'bar', description: '可以在这里打探情报', icon: '🍺' },
      { id: 'porto_inn', name: '旅馆', type: 'inn', description: '花金币休息恢复HP', icon: '🏨' },
      { id: 'porto_shop_human', name: '人类装备店', type: 'shop_human', description: '购买武器和防具', icon: '⚔️', itemIds: ['i1', 'i8', 'i9', 'wp5'] },
      { id: 'porto_shop_tank', name: '战车装备店', type: 'shop_tank', description: '购买战车道具和装甲', icon: '🛞', itemIds: ['i12', 'i13', 'i14', 'w5', 'w11', 's1'] },
      { id: 'porto_hospital', name: '诊所', type: 'hospital', description: '复活死去的同伴', icon: '🏥' },
      { id: 'porto_office', name: '赏金大厅', type: 'office', description: '查看通缉犯名单，领取赏金', icon: '🎯' },
      { id: 'porto_warehouse', name: '保管处', type: 'warehouse', description: '存放多余的物品', icon: '📦' },
      { id: 'porto_house1', name: '居民房', type: 'house', description: '可以和居民交谈', icon: '🏠' },
      { id: 'porto_workshop', name: '码头工坊', type: 'workshop', description: '可以制造大部分武器', icon: '⚓', itemIds: ['bp1', 'bp2', 'bp3', 'bp4', 'bp5', 'bp6', 'bp7', 'bp8', 'bp9', 'bp10', 'bp11', 'bp12', 'bp13', 'bp14', 'bp16', 'mat1', 'mat2', 'mat3', 'mat4', 'mat5'] }
    ]
  },
  {
    id: 'porto_building',
    name: '港口大楼',
    description: '铁锚港的大楼，变异体藏身之处！',
    type: 'dungeon',
    connections: [{ locationId: 'porto_town', direction: '返回' }],
    parentTownId: 'porto',
    enemyChance: 0.6,
    treasureChance: 0.3,
    eventChance: 0.2,
    bossId: 'boss5'
  },
  {
    id: 'porto_wilderness',
    name: '铁锚港周边',
    description: '铁锚港周边的港口地区，有怪物出没。',
    type: 'wilderness',
    connections: [
      { locationId: 'porto_town', direction: '返回镇内' }
    ],
    parentTownId: 'porto',
    enemyChance: 0.5,
    treasureChance: 0.2,
    eventChance: 0.1,
    enemyIds: ['enemy_7', 'enemy_8', 'enemy_9']
  },

  // ============ 铁拳镇区域 ============
  // 铁拳镇 → 铁拳镇周边 → 废弃疗养院
  {
    id: 'rock_town',
    name: '铁拳镇',
    description: '被军阀占领的城镇，打败他获得战车！',
    type: 'town',
    connections: [
      { locationId: 'ordo_wilderness', direction: '返回' },
      { locationId: 'rock_wilderness', direction: '镇外探索' }
    ],
    parentTownId: 'rock',
    enemyChance: 0,
    treasureChance: 0,
    eventChance: 0.1,
    buildings: [
      { id: 'rock_bar', name: '酒吧', type: 'bar', description: '可以在这里打探情报', icon: '🍺' },
      { id: 'rock_inn', name: '旅馆', type: 'inn', description: '花金币休息恢复HP', icon: '🏨' },
      { id: 'rock_shop_human', name: '人类装备店', type: 'shop_human', description: '购买武器和防具', icon: '⚔️', itemIds: ['i1', 'i2', 'i3', 'i4', 'i10', 'i11', 'wp1', 'wp2', 'wp3', 'wp4', 'wp5', 'h1', 'h2', 'h3', 'ha1', 'ha2', 'ha3', 'b1', 'b2', 'b3', 'f1', 'f2', 'f3'] },
      { id: 'rock_shop_tank', name: '战车装备店', type: 'shop_tank', description: '购买战车道具和装甲', icon: '🛞', itemIds: ['i12', 'i13', 'i14', 'i15', 'i16', 'i17', 'w3', 'w4', 'w5', 'w6', 'w10', 'w11', 's1', 's2', 's3', 'e2', 'e3', 'e4', 'c2', 'c3', 'c4'] },
      { id: 'rock_hospital', name: '诊所', type: 'hospital', description: '复活死去的同伴', icon: '🏥' },
      { id: 'rock_office', name: '赏金大厅', type: 'office', description: '查看通缉犯名单，领取赏金', icon: '🎯' },
      { id: 'rock_warehouse', name: '保管处', type: 'warehouse', description: '存放多余的物品', icon: '📦' },
      { id: 'rock_house1', name: '居民房', type: 'house', description: '可以和居民交谈', icon: '🏠' },
      { id: 'rock_workshop', name: '制造工坊', type: 'workshop', description: '使用蓝图和材料制造装备武器', icon: '🔧', itemIds: ['bp1', 'bp2', 'bp3', 'bp4', 'bp5', 'bp6', 'bp7', 'bp8', 'bp9', 'bp10', 'bp11', 'bp12', 'bp13', 'bp14', 'bp15', 'bp16', 'mat1', 'mat2', 'mat3', 'mat4', 'mat5'] }
    ]
  },
  {
    id: 'rock_wilderness',
    name: '铁拳镇周边',
    description: '铁拳镇周边的荒野地区。',
    type: 'wilderness',
    connections: [
      { locationId: 'rock_town', direction: '返回镇内' },
      { locationId: 'hospital', direction: '废弃疗养院' },
      { locationId: 'free_town', direction: '北风镇' }
    ],
    parentTownId: 'rock',
    enemyChance: 0.5,
    treasureChance: 0.2,
    eventChance: 0.1,
    enemyIds: ['enemy_9', 'enemy_10']
  },
  {
    id: 'hospital',
    name: '废弃疗养院',
    description: '军阀的基地，一辆战车就在这里！',
    type: 'dungeon',
    connections: [{ locationId: 'rock_wilderness', direction: '返回' }],
    parentTownId: 'rock',
    enemyChance: 0.6,
    treasureChance: 0.3,
    eventChance: 0.2,
    enemyIds: ['enemy_9', 'enemy_10'],
    bossId: 'boss6'
  },

  // ============ 北风镇区域 ============
  // 北风镇 → 北风镇周边 → 北风大楼
  {
    id: 'free_town',
    name: '北风镇',
    description: '寒冷地带的城镇，大象在此出没！',
    type: 'town',
    connections: [
      { locationId: 'rock_wilderness', direction: '返回' },
      { locationId: 'free_wilderness', direction: '镇外探索' }
    ],
    parentTownId: 'free',
    enemyChance: 0,
    treasureChance: 0,
    eventChance: 0.1,
    buildings: [
      { id: 'free_bar', name: '酒吧', type: 'bar', description: '可以在这里打探情报', icon: '🍺' },
      { id: 'free_inn', name: '旅馆', type: 'inn', description: '花金币休息恢复HP', icon: '🏨' },
      { id: 'free_shop_human', name: '人类装备店', type: 'shop_human', description: '购买武器和防具', icon: '⚔️', itemIds: ['i1', 'i2', 'i3', 'i4', 'i5', 'i6', 'i7', 'i8', 'i9', 'i10', 'i11', 'wp1', 'wp2', 'wp3', 'wp4', 'wp5', 'h1', 'h2', 'h3', 'ha1', 'ha2', 'ha3', 'b1', 'b2', 'b3', 'f1', 'f2', 'f3'] },
      { id: 'free_shop_tank', name: '战车装备店', type: 'shop_tank', description: '购买战车道具和装甲', icon: '🛞', itemIds: ['i12', 'i13', 'i14', 'i15', 'i16', 'i17', 'w1', 'w2', 'w3', 'w4', 'w5', 'w6', 'w7', 'w8', 'w9', 'w10', 'w11', 's1', 's2', 's3', 's4', 'e1', 'e2', 'e3', 'e4', 'c1', 'c2', 'c3', 'c4'] },
      { id: 'free_hospital', name: '诊所', type: 'hospital', description: '复活死去的同伴', icon: '🏥' },
      { id: 'free_office', name: '赏金大厅', type: 'office', description: '查看通缉犯名单，领取赏金', icon: '🎯' },
      { id: 'free_warehouse', name: '保管处', type: 'warehouse', description: '存放多余的物品', icon: '📦' },
      { id: 'free_house1', name: '居民房', type: 'house', description: '可以和居民交谈', icon: '🏠' },
      { id: 'free_workshop', name: '冰雪工坊', type: 'workshop', description: '寒冷之地的工坊，可以制造全部装备', icon: '❄️', itemIds: ['bp1', 'bp2', 'bp3', 'bp4', 'bp5', 'bp6', 'bp7', 'bp8', 'bp9', 'bp10', 'bp11', 'bp12', 'bp13', 'bp14', 'bp15', 'bp16', 'mat1', 'mat2', 'mat3', 'mat4', 'mat5'] }
    ]
  },
  {
    id: 'free_wilderness',
    name: '北风镇周边',
    description: '北风镇周边的荒野地区。',
    type: 'wilderness',
    connections: [
      { locationId: 'free_town', direction: '返回镇内' },
      { locationId: 'free_building', direction: '北风大楼' },
      { locationId: 'irl_town', direction: '熔炉镇' }
    ],
    parentTownId: 'free',
    enemyChance: 0.5,
    treasureChance: 0.2,
    eventChance: 0.1,
    enemyIds: ['enemy_9', 'enemy_10']
  },
  {
    id: 'free_building',
    name: '北风大楼',
    description: '北风镇的大楼，大象出没！',
    type: 'dungeon',
    connections: [{ locationId: 'free_wilderness', direction: '返回' }],
    parentTownId: 'free',
    enemyChance: 0.7,
    treasureChance: 0.2,
    eventChance: 0.1,
    enemyIds: ['enemy_10'],
    bossId: 'boss7'
  },

  // ============ 熔炉镇区域 ============
  // 熔炉镇 → 熔炉镇周边
  {
    id: 'irl_town',
    name: '熔炉镇',
    description: '著名的战车改造店「铁洞」所在地！',
    type: 'town',
    connections: [
      { locationId: 'free_wilderness', direction: '返回' },
      { locationId: 'irl_wilderness', direction: '镇外探索' }
    ],
    parentTownId: 'irl',
    enemyChance: 0,
    treasureChance: 0,
    eventChance: 0.1,
    buildings: [
      { id: 'irl_bar', name: '酒吧', type: 'bar', description: '可以在这里打探情报', icon: '🍺' },
      { id: 'irl_inn', name: '旅馆', type: 'inn', description: '花金币休息恢复HP', icon: '🏨' },
      { id: 'irl_shop_human', name: '人类装备店', type: 'shop_human', description: '购买武器和防具', icon: '⚔️', itemIds: ['i1', 'i2', 'i3', 'i4', 'i5', 'i6', 'i7', 'i8', 'i9', 'i10', 'i11', 'wp1', 'wp2', 'wp3', 'wp4', 'wp5', 'h1', 'h2', 'h3', 'ha1', 'ha2', 'ha3', 'b1', 'b2', 'b3', 'f1', 'f2', 'f3'] },
      { id: 'irl_shop_tank', name: '战车装备店', type: 'shop_tank', description: '购买战车道具和装甲', icon: '🛞', itemIds: ['i12', 'i13', 'i14', 'i15', 'i16', 'i17', 'w1', 'w2', 'w3', 'w4', 'w5', 'w6', 'w7', 'w8', 'w9', 'w10', 'w11', 's1', 's2', 's3', 's4', 'e1', 'e2', 'e3', 'e4', 'c1', 'c2', 'c3', 'c4'] },
      { id: 'irl_hospital', name: '诊所', type: 'hospital', description: '复活死去的同伴', icon: '🏥' },
      { id: 'irl_office', name: '赏金大厅', type: 'office', description: '查看通缉犯名单，领取赏金', icon: '🎯' },
      { id: 'irl_warehouse', name: '保管处', type: 'warehouse', description: '存放多余的物品', icon: '📦' },
      { id: 'irl_house1', name: '居民房', type: 'house', description: '可以和居民交谈', icon: '🏠' },
      { id: 'irl_workshop', name: '铁洞', type: 'workshop', description: '著名的战车改造店，什么都能造！', icon: '🔥', itemIds: ['bp1', 'bp2', 'bp3', 'bp4', 'bp5', 'bp6', 'bp7', 'bp8', 'bp9', 'bp10', 'bp11', 'bp12', 'bp13', 'bp14', 'bp15', 'bp16', 'mat1', 'mat2', 'mat3', 'mat4', 'mat5'] }
    ]
  },
  {
    id: 'irl_wilderness',
    name: '熔炉镇周边',
    description: '熔炉镇周边的荒野地区。',
    type: 'wilderness',
    connections: [
      { locationId: 'irl_town', direction: '返回镇内' },
      { locationId: 'yuge_village', direction: '静寂村' }
    ],
    parentTownId: 'irl',
    enemyChance: 0.5,
    treasureChance: 0.2,
    eventChance: 0.1,
    enemyIds: ['enemy_9', 'enemy_10']
  },

  // ============ 静寂村区域 ============
  // 静寂村 → 静寂村周边
  {
    id: 'yuge_village',
    name: '静寂村',
    description: '被山贼占领的小村庄。',
    type: 'town',
    connections: [
      { locationId: 'irl_wilderness', direction: '返回' },
      { locationId: 'yuge_wilderness', direction: '村外探索' }
    ],
    parentTownId: 'yuge',
    enemyChance: 0,
    treasureChance: 0,
    eventChance: 0.1,
    buildings: [
      { id: 'yuge_bar', name: '酒吧', type: 'bar', description: '可以在这里打探情报', icon: '🍺' },
      { id: 'yuge_inn', name: '旅馆', type: 'inn', description: '花金币休息恢复HP', icon: '🏨' },
      { id: 'yuge_shop_human', name: '人类装备店', type: 'shop_human', description: '购买武器和防具', icon: '⚔️', itemIds: ['i1', 'i2', 'i3', 'i4', 'i5', 'i6', 'i7', 'i8', 'i9', 'i10', 'i11', 'wp1', 'wp2', 'wp3', 'wp4', 'wp5', 'h1', 'h2', 'h3', 'ha1', 'ha2', 'ha3', 'b1', 'b2', 'b3', 'f1', 'f2', 'f3'] },
      { id: 'yuge_shop_tank', name: '战车装备店', type: 'shop_tank', description: '购买战车道具和装甲', icon: '🛞', itemIds: ['i12', 'i13', 'i14', 'i15', 'i16', 'i17', 'w1', 'w2', 'w3', 'w4', 'w5', 'w6', 'w7', 'w8', 'w9', 'w10', 'w11', 's1', 's2', 's3', 's4', 'e1', 'e2', 'e3', 'e4', 'c1', 'c2', 'c3', 'c4'] },
      { id: 'yuge_hospital', name: '诊所', type: 'hospital', description: '复活死去的同伴', icon: '🏥' },
      { id: 'yuge_office', name: '赏金大厅', type: 'office', description: '查看通缉犯名单', icon: '🎯' },
      { id: 'yuge_warehouse', name: '保管处', type: 'warehouse', description: '存放多余的物品', icon: '📦' },
      { id: 'yuge_house1', name: '居民房', type: 'house', description: '可以和居民交谈', icon: '🏠' }
    ]
  },
  {
    id: 'yuge_wilderness',
    name: '静寂村周边',
    description: '静寂村周边的荒野地区。',
    type: 'wilderness',
    connections: [
      { locationId: 'yuge_village', direction: '返回村内' },
      { locationId: 'sol_town', direction: '日耀镇' }
    ],
    parentTownId: 'yuge',
    enemyChance: 0.5,
    treasureChance: 0.2,
    eventChance: 0.1,
    enemyIds: ['enemy_9', 'enemy_10']
  },

  // ============ 日耀镇区域 ============
  // 日耀镇 → 日耀镇周边 → 地下通道
  {
    id: 'sol_town',
    name: '日耀镇',
    description: '被怪物入侵的城镇，地下通道里有战车！',
    type: 'town',
    connections: [
      { locationId: 'yuge_wilderness', direction: '返回' },
      { locationId: 'sol_wilderness', direction: '镇外探索' }
    ],
    parentTownId: 'sol',
    enemyChance: 0,
    treasureChance: 0,
    eventChance: 0.1,
    buildings: [
      { id: 'sol_bar', name: '酒吧', type: 'bar', description: '可以在这里打探情报', icon: '🍺' },
      { id: 'sol_inn', name: '旅馆', type: 'inn', description: '花金币休息恢复HP', icon: '🏨' },
      { id: 'sol_shop_human', name: '人类装备店', type: 'shop_human', description: '购买武器和防具', icon: '⚔️', itemIds: ['i1', 'i2', 'i3', 'i4', 'i5', 'i6', 'i7', 'i8', 'i9', 'i10', 'i11', 'wp1', 'wp2', 'wp3', 'wp4', 'wp5', 'h1', 'h2', 'h3', 'ha1', 'ha2', 'ha3', 'b1', 'b2', 'b3', 'f1', 'f2', 'f3'] },
      { id: 'sol_shop_tank', name: '战车装备店', type: 'shop_tank', description: '购买战车道具和装甲', icon: '🛞', itemIds: ['i12', 'i13', 'i14', 'i15', 'i16', 'i17', 'w1', 'w2', 'w3', 'w4', 'w5', 'w6', 'w7', 'w8', 'w9', 'w10', 'w11', 's1', 's2', 's3', 's4', 'e1', 'e2', 'e3', 'e4', 'c1', 'c2', 'c3', 'c4'] },
      { id: 'sol_hospital', name: '诊所', type: 'hospital', description: '复活死去的同伴', icon: '🏥' },
      { id: 'sol_office', name: '赏金大厅', type: 'office', description: '查看通缉犯名单，领取赏金', icon: '🎯' },
      { id: 'sol_warehouse', name: '保管处', type: 'warehouse', description: '存放多余的物品', icon: '📦' },
      { id: 'sol_house1', name: '居民房', type: 'house', description: '可以和居民交谈', icon: '🏠' }
    ]
  },
  {
    id: 'sol_wilderness',
    name: '日耀镇周边',
    description: '日耀镇周边的荒野地区。',
    type: 'wilderness',
    connections: [
      { locationId: 'sol_town', direction: '返回镇内' },
      { locationId: 'sewer', direction: '地下通道' },
      { locationId: 'eden_town', direction: '伊甸镇' }
    ],
    parentTownId: 'sol',
    enemyChance: 0.5,
    treasureChance: 0.2,
    eventChance: 0.1,
    enemyIds: ['enemy_9', 'enemy_10']
  },
  {
    id: 'sewer',
    name: '地下通道',
    description: '地下通道里藏着一辆战车！',
    type: 'dungeon',
    connections: [{ locationId: 'sol_wilderness', direction: '返回' }],
    parentTownId: 'sol',
    enemyChance: 0.6,
    treasureChance: 0.3,
    eventChance: 0.2,
    enemyIds: ['enemy_10']
  },

  // ============ 伊甸镇区域 ============
  // 伊甸镇 → 伊甸镇周边 → 了望塔
  {
    id: 'eden_town',
    name: '伊甸镇',
    description: '沙漠深处的高科技城镇！',
    type: 'town',
    connections: [
      { locationId: 'sol_wilderness', direction: '返回' },
      { locationId: 'eden_wilderness', direction: '镇外探索' }
    ],
    parentTownId: 'eden',
    enemyChance: 0,
    treasureChance: 0,
    eventChance: 0.1,
    buildings: [
      { id: 'eden_bar', name: '酒吧', type: 'bar', description: '可以在这里打探情报', icon: '🍺' },
      { id: 'eden_inn', name: '旅馆', type: 'inn', description: '花金币休息恢复HP', icon: '🏨' },
      { id: 'eden_shop_human', name: '人类装备店', type: 'shop_human', description: '购买武器和防具', icon: '⚔️', itemIds: ['i1', 'i2', 'i3', 'i4', 'i5', 'i6', 'i7', 'i8', 'i9', 'i10', 'i11', 'wp1', 'wp2', 'wp3', 'wp4', 'wp5', 'h1', 'h2', 'h3', 'ha1', 'ha2', 'ha3', 'b1', 'b2', 'b3', 'f1', 'f2', 'f3'] },
      { id: 'eden_shop_tank', name: '战车装备店', type: 'shop_tank', description: '购买战车道具和装甲', icon: '🛞', itemIds: ['i12', 'i13', 'i14', 'i15', 'i16', 'i17', 'w1', 'w2', 'w3', 'w4', 'w5', 'w6', 'w7', 'w8', 'w9', 'w10', 'w11', 's1', 's2', 's3', 's4', 'e1', 'e2', 'e3', 'e4', 'c1', 'c2', 'c3', 'c4'] },
      { id: 'eden_hospital', name: '诊所', type: 'hospital', description: '复活死去的同伴', icon: '🏥' },
      { id: 'eden_office', name: '赏金大厅', type: 'office', description: '查看通缉犯名单，领取赏金', icon: '🎯' },
      { id: 'eden_warehouse', name: '保管处', type: 'warehouse', description: '存放多余的物品', icon: '📦' },
      { id: 'eden_house1', name: '居民房', type: 'house', description: '可以和居民交谈', icon: '🏠' }
    ]
  },
  {
    id: 'eden_wilderness',
    name: '伊甸镇周边',
    description: '伊甸镇周边的沙漠地区。',
    type: 'wilderness',
    connections: [
      { locationId: 'eden_town', direction: '返回镇内' },
      { locationId: 'tower', direction: '了望塔' },
      { locationId: 'santa_town', direction: '云端镇' }
    ],
    parentTownId: 'eden',
    enemyChance: 0.5,
    treasureChance: 0.2,
    eventChance: 0.1,
    enemyIds: ['enemy_9', 'enemy_10']
  },
  {
    id: 'tower',
    name: '了望塔',
    description: '巨虫的巢穴！',
    type: 'dungeon',
    connections: [{ locationId: 'eden_wilderness', direction: '返回' }],
    parentTownId: 'eden',
    enemyChance: 0.7,
    treasureChance: 0.2,
    eventChance: 0.1,
    enemyIds: ['enemy_10'],
    bossId: 'boss8'
  },

  // ============ 云端镇区域 ============
  // 云端镇 → 云端镇周边 → 大瀑布
  {
    id: 'santa_town',
    name: '云端镇',
    description: '建在高塔上的城镇，风景壮观！',
    type: 'town',
    connections: [
      { locationId: 'eden_wilderness', direction: '返回' },
      { locationId: 'santa_wilderness', direction: '镇外探索' }
    ],
    parentTownId: 'santa',
    enemyChance: 0,
    treasureChance: 0,
    eventChance: 0.1,
    buildings: [
      { id: 'santa_bar', name: '酒吧', type: 'bar', description: '可以在这里打探情报', icon: '🍺' },
      { id: 'santa_inn', name: '旅馆', type: 'inn', description: '花金币休息恢复HP', icon: '🏨' },
      { id: 'santa_shop_human', name: '人类装备店', type: 'shop_human', description: '购买武器和防具', icon: '⚔️', itemIds: ['i1', 'i2', 'i3', 'i4', 'i5', 'i6', 'i7', 'i8', 'i9', 'i10', 'i11', 'wp1', 'wp2', 'wp3', 'wp4', 'wp5', 'h1', 'h2', 'h3', 'ha1', 'ha2', 'ha3', 'b1', 'b2', 'b3', 'f1', 'f2', 'f3'] },
      { id: 'santa_shop_tank', name: '战车装备店', type: 'shop_tank', description: '购买战车道具和装甲', icon: '🛞', itemIds: ['i12', 'i13', 'i14', 'i15', 'i16', 'i17', 'w1', 'w2', 'w3', 'w4', 'w5', 'w6', 'w7', 'w8', 'w9', 'w10', 'w11', 's1', 's2', 's3', 's4', 'e1', 'e2', 'e3', 'e4', 'c1', 'c2', 'c3', 'c4'] },
      { id: 'santa_hospital', name: '诊所', type: 'hospital', description: '复活死去的同伴', icon: '🏥' },
      { id: 'santa_office', name: '赏金大厅', type: 'office', description: '查看通缉犯名单，领取赏金', icon: '🎯' },
      { id: 'santa_warehouse', name: '保管处', type: 'warehouse', description: '存放多余的物品', icon: '📦' },
      { id: 'santa_house1', name: '居民房', type: 'house', description: '可以和居民交谈', icon: '🏠' }
    ]
  },
  {
    id: 'santa_wilderness',
    name: '云端镇周边',
    description: '云端镇周边的荒野地区。',
    type: 'wilderness',
    connections: [
      { locationId: 'santa_town', direction: '返回镇内' },
      { locationId: 'waterfall', direction: '大瀑布' },
      { locationId: 'kanal_town', direction: '焦痕镇' }
    ],
    parentTownId: 'santa',
    enemyChance: 0.5,
    treasureChance: 0.2,
    eventChance: 0.1,
    enemyIds: ['enemy_10']
  },
  {
    id: 'waterfall',
    name: '大瀑布',
    description: '一个隐秘据点，传奇战车赤焰号在这里！',
    type: 'dungeon',
    connections: [{ locationId: 'santa_wilderness', direction: '返回' }],
    parentTownId: 'santa',
    enemyChance: 0.8,
    treasureChance: 0.2,
    eventChance: 0.1,
    enemyIds: ['enemy_10'],
    bossId: 'boss9'
  },

  // ============ 焦痕镇区域 ============
  // 焦痕镇 → 焦痕镇周边 → 兵工厂 / 焦痕大楼
  {
    id: 'kanal_town',
    name: '焦痕镇',
    description: '被大火烧毁的城镇，兵工厂有第六辆战车！',
    type: 'town',
    connections: [
      { locationId: 'santa_wilderness', direction: '返回' },
      { locationId: 'kanal_wilderness', direction: '镇外探索' }
    ],
    parentTownId: 'kanal',
    enemyChance: 0,
    treasureChance: 0,
    eventChance: 0.1,
    buildings: [
      { id: 'kanal_bar', name: '酒吧', type: 'bar', description: '可以在这里打探情报', icon: '🍺' },
      { id: 'kanal_inn', name: '旅馆', type: 'inn', description: '花金币休息恢复HP', icon: '🏨' },
      { id: 'kanal_shop_human', name: '人类装备店', type: 'shop_human', description: '购买武器和防具', icon: '⚔️', itemIds: ['i1', 'i2', 'i3', 'i4', 'i5', 'i6', 'i7', 'i8', 'i9', 'i10', 'i11', 'wp1', 'wp2', 'wp3', 'wp4', 'wp5', 'h1', 'h2', 'h3', 'ha1', 'ha2', 'ha3', 'b1', 'b2', 'b3', 'f1', 'f2', 'f3'] },
      { id: 'kanal_shop_tank', name: '战车装备店', type: 'shop_tank', description: '购买战车道具和装甲', icon: '🛞', itemIds: ['i12', 'i13', 'i14', 'i15', 'i16', 'i17', 'w1', 'w2', 'w3', 'w4', 'w5', 'w6', 'w7', 'w8', 'w9', 'w10', 'w11', 's1', 's2', 's3', 's4', 'e1', 'e2', 'e3', 'e4', 'c1', 'c2', 'c3', 'c4'] },
      { id: 'kanal_hospital', name: '诊所', type: 'hospital', description: '复活死去的同伴', icon: '🏥' },
      { id: 'kanal_office', name: '赏金大厅', type: 'office', description: '查看通缉犯名单，领取赏金', icon: '🎯' },
      { id: 'kanal_warehouse', name: '保管处', type: 'warehouse', description: '存放多余的物品', icon: '📦' },
      { id: 'kanal_house1', name: '居民房', type: 'house', description: '可以和居民交谈', icon: '🏠' }
    ]
  },
  {
    id: 'kanal_wilderness',
    name: '焦痕镇周边',
    description: '焦痕镇周边的荒野地区。',
    type: 'wilderness',
    connections: [
      { locationId: 'kanal_town', direction: '返回镇内' },
      { locationId: 'arsenal', direction: '兵工厂' },
      { locationId: 'kanal_building', direction: '焦痕大楼' },
      { locationId: 'hell_gate_west', direction: '荒野驿站' }
    ],
    parentTownId: 'kanal',
    enemyChance: 0.5,
    treasureChance: 0.2,
    eventChance: 0.1,
    enemyIds: ['enemy_10']
  },
  {
    id: 'arsenal',
    name: '兵工厂',
    description: '制造战车的工厂，猎手号战车在这里！',
    type: 'dungeon',
    connections: [{ locationId: 'kanal_wilderness', direction: '返回' }],
    parentTownId: 'kanal',
    enemyChance: 0.6,
    treasureChance: 0.3,
    eventChance: 0.2,
    enemyIds: ['enemy_10'],
    bossId: 'boss4'
  },
  {
    id: 'kanal_building',
    name: '焦痕大楼',
    description: '暗影首领藏身的大楼！',
    type: 'dungeon',
    connections: [{ locationId: 'kanal_wilderness', direction: '返回' }],
    parentTownId: 'kanal',
    enemyChance: 0.7,
    treasureChance: 0.2,
    eventChance: 0.1,
    enemyIds: ['enemy_10'],
    bossId: 'boss10'
  },

  // ============ 末日关隘区域 ============
  // 荒野驿站 → 末日关隘 → 末日基地
  {
    id: 'hell_gate_west',
    name: '荒野驿站',
    description: '末日关隘前的补给站。',
    type: 'town',
    connections: [
      { locationId: 'kanal_wilderness', direction: '返回' },
      { locationId: 'hell_gate', direction: '末日关隘' }
    ],
    parentTownId: 'hell_gate_west',
    enemyChance: 0,
    treasureChance: 0,
    eventChance: 0.1,
    buildings: [
      { id: 'hell_gate_west_bar', name: '酒吧', type: 'bar', description: '可以在这里打探情报', icon: '🍺' },
      { id: 'hell_gate_west_inn', name: '旅馆', type: 'inn', description: '花金币休息恢复HP', icon: '🏨' },
      { id: 'hell_gate_west_shop_human', name: '人类装备店', type: 'shop_human', description: '购买武器和防具', icon: '⚔️', itemIds: ['i1', 'i2', 'i3', 'i4', 'i5', 'i6', 'i7', 'i8', 'i9', 'i10', 'i11', 'wp1', 'wp2', 'wp3', 'wp4', 'wp5', 'h1', 'h2', 'h3', 'ha1', 'ha2', 'ha3', 'b1', 'b2', 'b3', 'f1', 'f2', 'f3'] },
      { id: 'hell_gate_west_shop_tank', name: '战车装备店', type: 'shop_tank', description: '购买战车道具和装甲', icon: '🛞', itemIds: ['i12', 'i13', 'i14', 'i15', 'i16', 'i17', 'w1', 'w2', 'w3', 'w4', 'w5', 'w6', 'w7', 'w8', 'w9', 'w10', 'w11', 's1', 's2', 's3', 's4', 'e1', 'e2', 'e3', 'e4', 'c1', 'c2', 'c3', 'c4'] },
      { id: 'hell_gate_west_hospital', name: '诊所', type: 'hospital', description: '复活死去的同伴', icon: '🏥' },
      { id: 'hell_gate_west_office', name: '赏金大厅', type: 'office', description: '查看通缉犯名单', icon: '🎯' },
      { id: 'hell_gate_west_warehouse', name: '保管处', type: 'warehouse', description: '存放多余的物品', icon: '📦' },
      { id: 'hell_gate_west_house1', name: '居民房', type: 'house', description: '可以和居民交谈', icon: '🏠' }
    ]
  },
  {
    id: 'hell_gate',
    name: '末日关隘',
    description: '通往末日基地的必经之路！',
    type: 'dungeon',
    connections: [
      { locationId: 'hell_gate_west', direction: '返回' },
      { locationId: 'noah_base', direction: '末日基地' }
    ],
    parentTownId: 'hell_gate',
    enemyChance: 0.8,
    treasureChance: 0.2,
    eventChance: 0.1,
    enemyIds: ['enemy_10']
  },

  // ============ 末日基地 ============
  {
    id: 'noah_base',
    name: '末日基地',
    description: '最终BOSS审判者AI的所在地，世界的命运将在此决定！',
    type: 'boss',
    connections: [{ locationId: 'hell_gate', direction: '返回' }],
    parentTownId: 'noah',
    enemyChance: 1,
    treasureChance: 0,
    eventChance: 0,
    bossId: 'boss11'
  }
];

export const characters = [
  { id: 'char1', name: '猎人', role: '猎人' as const, description: '被父亲赶出家门，立志成为超级勇士的少年！', baseHp: 40, baseAttack: 5, baseDefense: 3, portraitId: 'hunter' },
  { id: 'char2', name: '小武', role: '机械师' as const, description: '绿洲镇的少年，喜欢摆弄机器，可以修理战车', baseHp: 35, baseAttack: 4, baseDefense: 3, portraitId: 'mechanic' },
  { id: 'char3', name: '阿雅', role: '格斗家' as const, description: '石山镇的战士，高攻击力', baseHp: 45, baseAttack: 8, baseDefense: 4, portraitId: 'female_warrior' }
];

export const tankModels = [
  { id: 'tank1', name: '先锋号', description: '在废弃矿洞获得的第一辆战车', baseArmor: 80, baseAttack: 20, baseDefense: 10 },
  { id: 'tank2', name: '铁壁号', description: '在绿洲镇废弃工厂获得', baseArmor: 100, baseAttack: 25, baseDefense: 12 },
  { id: 'tank3', name: '救援号', description: '在铁锚港购买，特殊能力：自动回复HP', baseArmor: 90, baseAttack: 22, baseDefense: 15 },
  { id: 'tank4', name: '堡垒号', description: '打败铁血将军后获得', baseArmor: 150, baseAttack: 35, baseDefense: 20 },
  { id: 'tank5', name: '疾风号', description: '在日耀镇获得', baseArmor: 70, baseAttack: 18, baseDefense: 8 },
  { id: 'tank6', name: '猎手号', description: '在焦痕镇兵工厂获得', baseArmor: 180, baseAttack: 40, baseDefense: 25 },
  { id: 'tank7', name: '赤焰号', description: '打败黑风后获得，传说中的高性能战车', baseArmor: 200, baseAttack: 50, baseDefense: 30 },
  { id: 'tank8', name: '霸王号', description: '隐藏战车，需要特殊条件获得', baseArmor: 220, baseAttack: 45, baseDefense: 35 }
];