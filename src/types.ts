export interface Player {
  id: string;
  name: string;
  level: number;
  hp: number;
  maxHp: number;
  attack: number;
  defense: number;
  gold: number;
  exp: number;
  role: '猎人' | '机械师' | '格斗家';
  portraitId?: string;
  drivingLevel: number;
  drivingExp: number;
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
  expReward: number;
  goldReward: number;
  isBoss?: boolean;
  bounty?: number;
  portraitId?: string;
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
}
