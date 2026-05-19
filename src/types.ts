export interface Player {
  id: string;
  name: string;
  level: number;
  hp: number;
  maxHp: number;
  attack: number;
  defense: number;
  speed: number; // 新增：速度，影响行动顺序
  gold: number;
  exp: number;
  role: '猎人' | '机械师' | '格斗家';
  portraitId?: string;
  drivingLevel: number;
  drivingExp: number;
  statusEffects?: StatusEffect[]; // 新增：状态效果列表
  critRate?: number; // 新增：暴击率 (0-1)
  critDamage?: number; // 新增：暴击伤害倍率 (默认1.5)
  dodgeRate?: number; // 新增：闪避率 (0-1)
  hitRate?: number; // 新增：命中率 (0-1)
}

// 新增：状态效果类型定义
export type StatusEffectType =
  | 'poison'       // 中毒：每回合受到伤害
  | 'burn'         // 燃烧：每回合受到火焰伤害
  | 'paralyze'     // 麻痹：无法行动
  | 'freeze'       // 冰冻：无法行动，受到伤害加倍
  | 'stun'         // 眩晕：无法行动
  | 'slow'         // 减速：行动顺序延后
  | 'defenseUp'    // 防御提升
  | 'defenseDown'  // 防御降低
  | 'attackUp'     // 攻击提升
  | 'attackDown'   // 攻击降低
  | 'bleed'        // 流血：每回合受到伤害
  | 'regen';       // 再生：每回合恢复HP

export interface StatusEffect {
  id: string;           // 唯一标识
  type: StatusEffectType; // 效果类型
  name: string;         // 效果名称
  duration: number;     // 持续回合数
  remainingTurns: number; // 剩余回合数
  value?: number;       // 效果数值（伤害/治疗量/属性变化量）
  source?: string;      // 效果来源
}

// 新增：战斗结果类型
export type BattleActionType = 
  | 'attack'
  | 'defend'
  | 'useItem'
  | 'flee'
  | 'skill'
  | 'counter'
  | 'tankMainCannon'
  | 'tankSubCannon'
  | 'tankSE';

export interface BattleResult {
  attacker: string;       // 攻击者名称
  defender: string;       // 防御者名称
  action: BattleActionType;
  damage?: number;        // 造成伤害
  isCrit?: boolean;       // 是否暴击
  isDodged?: boolean;     // 是否闪避
  isHit?: boolean;        // 是否命中
  appliedEffects?: StatusEffect[]; // 施加的状态效果
  message: string;        // 战斗日志消息
}

export interface Tank {
  id: string;
  name: string;
  type?: string;
  armor: number;
  maxArmor: number;
  attack: number;
  defense: number;
  speed?: number;
  weapon?: Item;
  subWeapon?: Item;
  engine?: Item;
  cDevice?: Item;
  se?: Item;
  mainCannonAmmo?: number;
  seAmmo?: number;
  isRented?: boolean;
}

export interface Item {
  id: string;
  name: string;
  type: 'weapon' | 'subWeapon' | 'engine' | 'cDevice' | 'se' | 'consumable' | 'armor' | 'head' | 'hand' | 'foot' | 'body' | 'humanWeapon' | 'blueprint';
  value: number;
  description: string;
  price: number;
  weight?: number;
  ammo?: number;
}

export type QuestType = 'main' | 'side' | 'daily';
export type QuestStatus = 'available' | 'in_progress' | 'completed' | 'failed';

export interface QuestObjective {
  id: string;
  description: string;
  target?: string;
  targetCount?: number;
  currentCount?: number;
  location?: string;
  completed?: boolean;
}

export interface QuestReward {
  gold?: number;
  exp?: number;
  items?: Item[];
  reputation?: number;
}

export interface Quest {
  id: string;
  name: string;
  description: string;
  type: QuestType;
  objectives: QuestObjective[];
  rewards: QuestReward;
  prerequisiteQuestId?: string;
  location?: string;
  npcGiver?: string;
  dialogueStart?: string;
  dialogueComplete?: string;
  availableAfter?: string[];
}

export interface Blueprint {
  id: string;
  name: string;
  description: string;
  price: number;
  craftResult: {
    itemId: string;
    quantity: number;
  };
  materials: {
    itemId: string;
    quantity: number;
  }[];
}

export interface Enemy {
  id: string;
  name: string;
  hp: number;
  maxHp: number;
  attack: number;
  defense: number;
  speed: number; // 新增：速度
  expReward: number;
  goldReward: number;
  isBoss?: boolean;
  bounty?: number;
  portraitId?: string;
  statusEffects?: StatusEffect[]; // 新增：状态效果列表
  critRate?: number; // 新增：暴击率
  critDamage?: number; // 新增：暴击伤害
  dodgeRate?: number; // 新增：闪避率
  // 新增：特殊技能列表
  specialAbilities?: {
    name: string;
    description: string;
    effectType?: StatusEffectType;
    effectChance?: number;
    damageMultiplier?: number;
  }[];
}

export interface InventoryItem {
  item: Item;
  quantity: number;
}

export interface LocationConnection {
  locationId: string;
  direction: string;
  requirement?: string;
}

export interface Building {
  id: string;
  name: string;
  type: 'bar' | 'inn' | 'shop_human' | 'shop_tank' | 'garage' | 'hospital' | 'office' | 'house' | 'warehouse' | 'timeMachine' | 'factory' | 'lab' | 'workshop' | 'home';
  description: string;
  icon: string;
  // 商店专属商品列表，只在商店类型的建筑中使用
  itemIds?: string[];
}

export interface Location {
  id: string;
  name: string;
  description: string;
  type: 'town' | 'wilderness' | 'dungeon' | 'boss';
  connections: LocationConnection[];
  parentTownId?: string;
  enemyChance: number;
  treasureChance: number;
  eventChance: number;
  buildings?: Building[];
  bossId?: string;
  isBossDefeated?: boolean;
  enemyIds?: string[];
}

export interface DialogOption {
  text: string;
  nextDialogId?: string;
  action?: string;
  condition?: string;
}

export interface Dialog {
  id: string;
  speaker: string;
  content: string;
  options?: DialogOption[];
  nextDialogId?: string;
  locationId?: string;
  triggerCondition?: string;
  action?: string;
  condition?: string;
}

export interface StoryFlags {
  [key: string]: boolean | undefined;
  hasLeftHome?: boolean;
  metMysticHunter?: boolean;
  hasTank?: boolean;
  defeatedWaterMonster?: boolean;
  recruitedAlly1?: boolean;
  recruitedAlly2?: boolean;
  visitedFactory?: boolean;
  defeatedGeneral?: boolean;
  defeatedBandit?: boolean;
  defeatedShadow?: boolean;
  defeatedAI?: boolean;
}

export interface GameState {
  player: Player;
  members: Player[];
  tanks: Tank[];
  currentTankIndex: number;
  currentMemberIndex: number;
  inventory: InventoryItem[];
  storage: InventoryItem[];
  warehouseItems: InventoryItem[];
  blueprints: string[];
  gold: number;
  currentLocationId: string;
  currentBuildingId?: string | null;
  gamePhase: 'title' | 'intro' | 'dialog' | 'town' | 'explore' | 'battle' | 'shop' | 'inventory' | 'tankSelect' | 'menu' | 'building' | 'crafting';
  currentBuilding?: Building;
  shopType?: 'human' | 'tank';
  isOnTank: boolean;
  tankLocation: string | null;
  battle?: {
    enemy: Enemy;
    turn: 'player' | 'enemy';
    useTank: boolean;
  };
  messages: { id: number; text: string }[];
  battleLog: string[];
  locations: Location[];
  shopItems: Item[];
  defeatedBosses: string[];
  playerEquip: {
    head?: Item;
    body?: Item;
    hand?: Item;
    foot?: Item;
    weapon?: Item;
  };
  storyFlags: StoryFlags;
  currentDialogId?: string;
  quests: {
    available: Quest[];
    inProgress: Quest[];
    completed: Quest[];
  };
  currentQuestId?: string;
}
