import { Player, Enemy, StatusEffect, StatusEffectType, BattleResult } from '../types';

/**
 * 战斗系统工具函数
 */

// ==========================================
// 数值体系：伤害计算公式
// ==========================================

/**
 * 计算基础伤害
 * 公式：伤害 = (攻击力 - 防御力 * 0.5) * (0.9~1.1随机浮动)
 */
export function calculateDamage(
  attacker: Player | Enemy,
  defender: Player | Enemy,
  isDefending: boolean = false
): {
  baseDamage: number;
  finalDamage: number;
  isCrit: boolean;
  isDodged: boolean;
  isHit: boolean;
} {
  // 计算防御减伤比例
  let defenseMultiplier = isDefending ? 0.5 : 1;
  
  // 检查状态效果影响
  let attackBonus = 1;
  let defenseBonus = 1;
  
  // 攻击者状态效果
  if ('statusEffects' in attacker && attacker.statusEffects) {
    attacker.statusEffects.forEach(effect => {
      if (effect.type === 'attackUp') attackBonus = 1.5;
      if (effect.type === 'attackDown') attackBonus = 0.7;
    });
  }
  
  // 防御者状态效果
  if ('statusEffects' in defender && defender.statusEffects) {
    defender.statusEffects.forEach(effect => {
      if (effect.type === 'defenseUp') defenseBonus = 1.5;
      if (effect.type === 'defenseDown') defenseBonus = 0.7;
      if (effect.type === 'freeze') defenseBonus = 0.5; // 冰冻时受到双倍伤害
    });
  }
  
  const effectiveAttack = attacker.attack * attackBonus;
  const effectiveDefense = defender.defense * defenseBonus * defenseMultiplier;
  
  // 计算基础伤害
  let baseDamage = Math.max(1, effectiveAttack - effectiveDefense * 0.5);
  
  // 0.9 ~ 1.1 随机浮动
  const randomMultiplier = 0.9 + Math.random() * 0.2;
  baseDamage = Math.floor(baseDamage * randomMultiplier);
  
  // 命中判定
  const hitRate = (attacker as any).hitRate ?? 0.95; // 默认95%命中率
  const dodgeRate = (defender as any).dodgeRate ?? 0.05; // 默认5%闪避率
  const isHit = Math.random() < hitRate;
  const isDodged = Math.random() < dodgeRate;
  
  if (!isHit || isDodged) {
    return {
      baseDamage: 0,
      finalDamage: 0,
      isCrit: false,
      isDodged: isDodged || !isHit,
      isHit: false
    };
  }
  
  // 暴击判定
  const critRate = (attacker as any).critRate ?? 0.1; // 默认10%暴击率
  const critDamage = (attacker as any).critDamage ?? 1.5; // 默认1.5倍暴击伤害
  const isCrit = Math.random() < critRate;
  
  let finalDamage = baseDamage;
  if (isCrit) {
    finalDamage = Math.floor(finalDamage * critDamage);
  }
  
  return {
    baseDamage,
    finalDamage,
    isCrit,
    isDodged: false,
    isHit: true
  };
}

/**
 * 计算角色升级所需经验值
 * 公式：所需经验 = base * level^1.5
 * base = 50
 */
export function calculateExpForLevel(level: number): number {
  const baseExp = 50;
  return Math.floor(baseExp * Math.pow(level, 1.5));
}

/**
 * 检查角色是否可以升级
 */
export function checkLevelUp(player: Player): boolean {
  return player.exp >= calculateExpForLevel(player.level);
}

/**
 * 执行升级
 */
export function performLevelUp(player: Player): Player {
  const newLevel = player.level + 1;
  const expNeeded = calculateExpForLevel(newLevel);
  const remainingExp = player.exp - calculateExpForLevel(player.level);
  
  // 属性成长（基础成长 + 职业修正）
  let hpGrowth = 8;
  let attackGrowth = 1;
  let defenseGrowth = 1;
  let speedGrowth = 1;
  
  // 职业修正
  switch (player.role) {
    case '猎人':
      hpGrowth += 2;
      speedGrowth += 1;
      break;
    case '机械师':
      defenseGrowth += 2;
      break;
    case '格斗家':
      attackGrowth += 3;
      hpGrowth += 1;
      break;
  }
  
  return {
    ...player,
    level: newLevel,
    exp: remainingExp,
    maxHp: player.maxHp + hpGrowth,
    hp: player.maxHp + hpGrowth, // 升级时恢复全部HP
    attack: player.attack + attackGrowth,
    defense: player.defense + defenseGrowth,
    speed: player.speed + speedGrowth,
    critRate: Math.min(0.5, (player.critRate ?? 0.1) + 0.01), // 每级提升1%暴击率，上限50%
    dodgeRate: Math.min(0.4, (player.dodgeRate ?? 0.05) + 0.005) // 每级提升0.5%闪避率，上限40%
  };
}

// ==========================================
// 状态效果系统
// ==========================================

/**
 * 创建状态效果
 */
export function createStatusEffect(
  type: StatusEffectType,
  duration: number,
  value?: number,
  source?: string
): StatusEffect {
  const effectNames: Record<StatusEffectType, string> = {
    poison: '中毒',
    burn: '燃烧',
    paralyze: '麻痹',
    freeze: '冰冻',
    stun: '眩晕',
    slow: '减速',
    defenseUp: '防御提升',
    defenseDown: '防御降低',
    attackUp: '攻击提升',
    attackDown: '攻击降低',
    bleed: '流血',
    regen: '再生'
  };
  
  return {
    id: `${type}_${Date.now()}`,
    type,
    name: effectNames[type],
    duration,
    remainingTurns: duration,
    value: value ?? getDefaultEffectValue(type),
    source
  };
}

/**
 * 获取状态效果的默认值
 */
function getDefaultEffectValue(type: StatusEffectType): number {
  switch (type) {
    case 'poison': return 5;
    case 'burn': return 8;
    case 'bleed': return 6;
    case 'regen': return 5;
    case 'slow': return 0.5;
    case 'defenseUp': return 0.5;
    case 'defenseDown': return 0.3;
    case 'attackUp': return 0.5;
    case 'attackDown': return 0.3;
    default: return 0;
  }
}

/**
 * 检查是否无法行动
 */
export function isUnableToAct(entity: Player | Enemy): boolean {
  if (!('statusEffects' in entity) || !entity.statusEffects) {
    return false;
  }
  
  const disablingEffects: StatusEffectType[] = ['paralyze', 'freeze', 'stun'];
  return entity.statusEffects.some(effect => 
    disablingEffects.includes(effect.type) && effect.remainingTurns > 0
  );
}

/**
 * 应用回合开始时的状态效果
 */
export function applyTurnStartEffects(entity: Player | Enemy): {
  hpChange: number;
  messages: string[];
} {
  let totalHpChange = 0;
  const messages: string[] = [];
  
  if (!('statusEffects' in entity) || !entity.statusEffects) {
    return { hpChange: 0, messages: [] };
  }
  
  const newEffects: StatusEffect[] = [];
  
  entity.statusEffects.forEach(effect => {
    if (effect.remainingTurns <= 0) return;
    
    let hpChange = 0;
    
    switch (effect.type) {
      case 'poison':
        hpChange = -(effect.value ?? 5);
        messages.push(`${entity.name} 受到了 ${Math.abs(hpChange)} 点中毒伤害！`);
        break;
      case 'burn':
        hpChange = -(effect.value ?? 8);
        messages.push(`${entity.name} 受到了 ${Math.abs(hpChange)} 点燃烧伤害！`);
        break;
      case 'bleed':
        hpChange = -(effect.value ?? 6);
        messages.push(`${entity.name} 受到了 ${Math.abs(hpChange)} 点流血伤害！`);
        break;
      case 'regen':
        hpChange = effect.value ?? 5;
        messages.push(`${entity.name} 恢复了 ${hpChange} 点HP！`);
        break;
    }
    
    totalHpChange += hpChange;
    
    // 减少持续回合
    const newRemaining = effect.remainingTurns - 1;
    if (newRemaining > 0) {
      newEffects.push({ ...effect, remainingTurns: newRemaining });
    } else {
      messages.push(`${entity.name} 的 ${effect.name} 效果消失了！`);
    }
  });
  
  // 更新实体的状态效果
  (entity as any).statusEffects = newEffects;
  
  return { hpChange: totalHpChange, messages };
}

/**
 * 添加状态效果
 */
export function addStatusEffect(
  entity: Player | Enemy,
  effect: StatusEffect
): {
  added: boolean;
  message: string;
} {
  if (!('statusEffects' in entity)) {
    (entity as any).statusEffects = [];
  }
  
  const effects = entity.statusEffects || [];
  
  // 检查是否已有同类效果
  const existingIndex = effects.findIndex(e => e.type === effect.type);
  if (existingIndex !== -1) {
    // 刷新持续时间
    effects[existingIndex] = {
      ...effect,
      remainingTurns: Math.max(effects[existingIndex].remainingTurns, effect.remainingTurns)
    };
    return {
      added: true,
      message: `${entity.name} 的 ${effect.name} 效果被刷新了！`
    };
  }
  
  effects.push(effect);
  (entity as any).statusEffects = effects;
  
  return {
    added: true,
    message: `${entity.name} 陷入了 ${effect.name} 状态！`
  };
}

/**
 * 清除所有负面状态
 */
export function clearNegativeEffects(entity: Player | Enemy): string[] {
  if (!('statusEffects' in entity) || !entity.statusEffects) {
    return [];
  }
  
  const negativeTypes: StatusEffectType[] = [
    'poison', 'burn', 'paralyze', 'freeze', 'stun', 
    'slow', 'defenseDown', 'attackDown', 'bleed'
  ];
  
  const clearedEffects: string[] = [];
  const remainingEffects: StatusEffect[] = [];
  
  entity.statusEffects.forEach(effect => {
    if (negativeTypes.includes(effect.type)) {
      clearedEffects.push(effect.name);
    } else {
      remainingEffects.push(effect);
    }
  });
  
  (entity as any).statusEffects = remainingEffects;
  
  return clearedEffects;
}

// ==========================================
// 行动顺序系统
// ==========================================

/**
 * 获取实体的有效速度（考虑状态效果）
 */
export function getEffectiveSpeed(entity: Player | Enemy): number {
  let speed = entity.speed;
  
  if ('statusEffects' in entity && entity.statusEffects) {
    entity.statusEffects.forEach(effect => {
      if (effect.type === 'slow') {
        speed = Math.floor(speed * (1 - (effect.value ?? 0.5)));
      }
    });
  }
  
  return speed;
}

/**
 * 排序战斗参与方的行动顺序（按速度从高到低）
 */
export function sortBattleOrder(
  participants: Array<{ entity: Player | Enemy; id: string; name: string }>
): Array<{ entity: Player | Enemy; id: string; name: string }> {
  return [...participants].sort((a, b) => {
    const speedA = getEffectiveSpeed(a.entity);
    const speedB = getEffectiveSpeed(b.entity);
    return speedB - speedA; // 从高到低排序
  });
}

// ==========================================
// 战斗结果处理
// ==========================================

/**
 * 创建战斗结果对象
 */
export function createBattleResult(
  attacker: Player | Enemy,
  defender: Player | Enemy,
  action: 'attack' | 'skill' | 'tankMainCannon' | 'tankSubCannon' | 'tankSE',
  damageResult: ReturnType<typeof calculateDamage>,
  appliedEffects?: StatusEffect[]
): BattleResult {
  let message = '';
  
  if (!damageResult.isHit || damageResult.isDodged) {
    message = `${defender.name} 闪避了攻击！`;
  } else if (damageResult.isCrit) {
    message = `暴击！${attacker.name} 对 ${defender.name} 造成了 ${damageResult.finalDamage} 点伤害！`;
  } else {
    message = `${attacker.name} 对 ${defender.name} 造成了 ${damageResult.finalDamage} 点伤害！`;
  }
  
  if (appliedEffects && appliedEffects.length > 0) {
    message += ` 附加了 ${appliedEffects.map(e => e.name).join('、')} 效果！`;
  }
  
  return {
    attacker: attacker.name,
    defender: defender.name,
    action,
    damage: damageResult.finalDamage,
    isCrit: damageResult.isCrit,
    isDodged: damageResult.isDodged,
    isHit: damageResult.isHit,
    appliedEffects,
    message
  };
}
