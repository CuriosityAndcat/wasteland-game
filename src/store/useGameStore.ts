import { create } from 'zustand';
import { GameState, Player, Tank, Item, Enemy, InventoryItem, Building, Dialog, StoryFlags } from '../types';
import { enemies, items, locations, characters, tankModels, blueprints } from '../data/gameData';
import { quests } from '../data/quests';
import { dialogs, getDialogById, getDialogsByLocation } from '../data/dialogs';
import {
  calculateDamage,
  calculateExpForLevel,
  checkLevelUp,
  performLevelUp,
  createStatusEffect,
  isUnableToAct,
  applyTurnStartEffects,
  addStatusEffect,
  clearNegativeEffects,
  getEffectiveSpeed,
  sortBattleOrder,
  createBattleResult
} from '../utils/battle';
import { getQuestById } from '../data/quests';

function handleEnemyDefeated(get: any, set: any, enemy: Enemy, player: Player, useTank?: boolean) {
  const expReward = enemy.expReward;
  const goldReward = enemy.goldReward;
  let newPlayer = {
    ...player,
    gold: player.gold + goldReward,
    exp: player.exp + expReward
  };

  if (useTank) {
    const drivingExpGain = Math.floor(expReward * 0.5) + 1;
    newPlayer.drivingExp = (newPlayer.drivingExp || 0) + drivingExpGain;
    const drivingExpNeeded = (newPlayer.drivingLevel || 1) * 30;
    if (newPlayer.drivingExp >= drivingExpNeeded) {
      newPlayer.drivingLevel = (newPlayer.drivingLevel || 1) + 1;
      newPlayer.drivingExp -= drivingExpNeeded;
      get().addBattleMessage(`🚗 驾驶等级提升！Lv.${newPlayer.drivingLevel}`);
    }
  }

  if (enemy.isBoss && enemy.bounty) {
    newPlayer.gold += enemy.bounty;
    get().addBattleMessage(`🏆 获得悬赏金 ${enemy.bounty} 金币！`);
  }

  // 使用新的升级检查系统
  while (checkLevelUp(newPlayer)) {
    newPlayer = performLevelUp(newPlayer);
    get().addBattleMessage(`🎉 升级了！现在是${newPlayer.level}级！`);
  }

  get().addBattleMessage(`🎉 战胜了${enemy.name}！获得 ${expReward} 经验和 ${goldReward} 金币！${useTank ? ` 🚗 驾驶经验+${Math.floor(expReward * 0.5) + 1}` : ''}`);

  if (enemy.id === 'boss0') {
    const state = get();
    const mainGun = items.find(i => i.id === 'w1');
    const newTank: Tank = {
      id: `tank_${Date.now()}`,
      name: '先锋号',
      type: 'tank_placeholder',
      attack: 15,
      defense: 10,
      armor: 80,
      maxArmor: 80,
      weapon: mainGun ? { ...mainGun } : undefined,
      mainCannonAmmo: 16
    };
    
    get().addMessage('🏆 获得了第一辆战车：先锋号！');
    set({
      player: newPlayer,
      members: state.members.map(m => m.id === player.id ? newPlayer : m),
      gamePhase: 'explore',
      battle: undefined,
      battleLog: [],
      tanks: [newTank],
      isOnTank: true,
      tankLocation: null,
      defeatedBosses: [...state.defeatedBosses, 'boss0'],
      storyFlags: { ...state.storyFlags, metMysticHunter: true }
    });
    return;
  }

  set((state: GameState) => ({
    player: newPlayer,
    members: state.members.map(m => m.id === player.id ? newPlayer : m),
    gamePhase: 'explore',
    battle: undefined,
    battleLog: [],
    defeatedBosses: enemy.isBoss ? [...state.defeatedBosses, enemy.id] : state.defeatedBosses
  }));
}

function scheduleEnemyAttack(get: any, set: any, isDefending?: boolean) {
  const state = get();
  if (!state.battle) return;
  set({ battle: { ...state.battle, isProcessing: true } });
  setTimeout(() => processEnemyCounterAttack(get, set, isDefending), 1500);
}

function processEnemyCounterAttack(get: any, set: any, isDefending?: boolean) {
  const currentState = get();
  if (!currentState.battle) return;
  
  let { enemy } = currentState.battle;
  
  // 防御状态提升50%防御力
  let defenseBonus = 0;
  if (isDefending) {
    if (currentState.battle.useTank) {
      const tank = currentState.tanks[currentState.currentTankIndex];
      defenseBonus = Math.floor((tank.defense + (tank.engine?.value || 0) + (tank.cDevice?.value || 0) + (currentState.player.drivingLevel || 1) * 1) * 0.5);
    } else {
      defenseBonus = Math.floor(((currentState.playerEquip.head?.value || 0) +
        (currentState.playerEquip.body?.value || 0) +
        (currentState.playerEquip.hand?.value || 0) +
        (currentState.playerEquip.foot?.value || 0)) * 0.5);
    }
  }
  
  // 计算角色的有效防御力（包含装备加成和状态效果）
  let effectivePlayer = {
    ...currentState.player,
    defense: currentState.player.defense + 
      (currentState.playerEquip.head?.value || 0) + 
      (currentState.playerEquip.body?.value || 0) + 
      (currentState.playerEquip.hand?.value || 0) + 
      (currentState.playerEquip.foot?.value || 0) +
      defenseBonus,
    statusEffects: currentState.player.statusEffects || []
  };
  
  // 检查角色是否无法行动（被眩晕/麻痹/冰冻）
  if (isUnableToAct(effectivePlayer)) {
    get().addBattleMessage(`⚠️ ${effectivePlayer.name}无法行动！`);
    const effectMessage = effectivePlayer.statusEffects.find(e => 
      e.type === 'paralyze' || e.type === 'freeze' || e.type === 'stun'
    );
    if (effectMessage) {
      get().addBattleMessage(`${effectivePlayer.name} 被 ${effectMessage.name} 了！`);
    }
    
    // 仍然切换回玩家回合
    set({
      battle: { ...currentState.battle, turn: 'player', isProcessing: false }
    });
    return;
  }
  
  // 应用回合开始时的状态效果
  const { entity: updatedPlayer, hpChange, messages: effectMessages } = applyTurnStartEffects(effectivePlayer);
  effectivePlayer = updatedPlayer as Player;
  let finalDamage = 0;
  
  effectMessages.forEach(msg => {
    get().addBattleMessage(msg);
  });
  
  // 处理敌人身上的回合开始效果（中毒/燃烧/流血等DOT伤害）
  if (enemy.statusEffects && enemy.statusEffects.length > 0) {
    const enemyDOTEntity = { ...enemy, statusEffects: [...enemy.statusEffects] };
    const { hpChange: enemyHpChange, messages: enemyEffectMessages } = applyTurnStartEffects(enemyDOTEntity);
    
    enemyEffectMessages.forEach(msg => {
      get().addBattleMessage(msg);
    });
    
    if (enemyHpChange !== 0) {
      const newEnemyHp = Math.max(0, enemy.hp + enemyHpChange);
      
      if (newEnemyHp <= 0) {
        handleEnemyDefeated(get, set, { ...enemyDOTEntity, hp: newEnemyHp } as Enemy, currentState.player, currentState.battle.useTank);
        return;
      }
      
      enemy = { ...enemyDOTEntity, hp: Math.min(enemy.maxHp, newEnemyHp) };
    } else {
      enemy = { ...enemyDOTEntity };
    }
  }
  
  // 检查是否有立即生效的伤害
  if (hpChange < 0) {
    const newHp = Math.max(0, effectivePlayer.hp + hpChange);
    effectivePlayer = { ...effectivePlayer, hp: newHp };
    
    if (newHp <= 0) {
      set({
        player: { ...effectivePlayer, hp: 0 },
        battle: undefined,
        gamePhase: 'explore',
        battleLog: []
      });
      get().addMessage(`💀 ${effectivePlayer.name}被击败了...`);
      get().addMessage('你被送到了最近的医院...');
      setTimeout(() => {
        set((state: GameState) => ({
          player: { 
            ...state.player, 
            hp: Math.floor(state.player.maxHp / 2),
            statusEffects: [],
            gold: Math.floor(state.player.gold * 0.9)
          }
        }));
      }, 100);
      return;
    }
  }
  
  // 敌人有一定概率使用特殊技能
  let appliedEffects: any[] = [];
  let damageResult;
  
  if (enemy.specialAbilities && enemy.specialAbilities.length > 0 && Math.random() < 0.3) {
    // 30%概率使用特殊技能
    const ability = enemy.specialAbilities[Math.floor(Math.random() * enemy.specialAbilities.length)];
    damageResult = calculateDamage(enemy, effectivePlayer);
    
    get().addBattleMessage(`🔥 ${enemy.name} 使用了 ${ability.name}！`);
    
    if (ability.effectType && ability.effectChance && Math.random() < ability.effectChance) {
      const effect = createStatusEffect(ability.effectType, 3);
      if (!currentState.battle.useTank) {
        const { entity: updatedEntity, message } = addStatusEffect(effectivePlayer, effect);
        effectivePlayer = updatedEntity as Player;
        appliedEffects.push(effect);
        get().addBattleMessage(message);
      }
    }
  } else {
    // 普通攻击
    damageResult = calculateDamage(enemy, effectivePlayer);
  }
  
  finalDamage = damageResult.finalDamage || 0;
  
  if (currentState.battle.useTank) {
    const updatedTanks = [...currentState.tanks];
    const currentTank = updatedTanks[currentState.currentTankIndex];
    const newArmor = Math.max(0, currentTank.armor - finalDamage);
    updatedTanks[currentState.currentTankIndex] = { 
      ...currentTank, 
      armor: newArmor 
    };
    
    if (!damageResult.isHit) {
      get().addBattleMessage(`💨 战车闪避了攻击！`);
      get().triggerEffect('miss', 'enemy');
    } else if (damageResult.isDodged) {
      get().addBattleMessage(`💨 战车闪避了攻击！`);
      get().triggerEffect('miss', 'enemy');
    } else if (damageResult.isCrit) {
      get().addBattleMessage(`💥 暴击！${enemy.name}对战车造成了 ${finalDamage} 点伤害！`);
      get().triggerEffect('explosion', 'player');
    } else {
      get().addBattleMessage(`💥 ${enemy.name}对战车造成了 ${finalDamage} 点伤害！`);
      get().triggerEffect('hit', 'player');
    }
    
    if (newArmor <= 0) {
      get().addBattleMessage('⚠️ 战车装甲被击毁了！');
      set({
        tanks: updatedTanks,
        battle: { ...currentState.battle, enemy, useTank: false, turn: 'player', isProcessing: false }
      });
    } else {
      set({
        tanks: updatedTanks,
        battle: { ...currentState.battle, enemy, turn: 'player', isProcessing: false }
      });
    }
  } else {
    // 更新角色HP
    let newPlayerHp = Math.max(0, effectivePlayer.hp - finalDamage);
    
    // 应用战斗消息
    if (!damageResult.isHit) {
      get().addBattleMessage(`💨 你闪避了攻击！`);
      get().triggerEffect('miss', 'enemy');
    } else if (damageResult.isDodged) {
      get().addBattleMessage(`💨 你闪避了攻击！`);
      get().triggerEffect('miss', 'enemy');
    } else if (damageResult.isCrit) {
      get().addBattleMessage(`💥 暴击！${enemy.name}对你造成了 ${finalDamage} 点伤害！`);
      get().triggerEffect('explosion', 'player');
    } else if (finalDamage > 0) {
      get().addBattleMessage(`💥 ${enemy.name}对你造成了 ${finalDamage} 点伤害！`);
      get().triggerEffect('hit', 'player');
    }
    
    if (newPlayerHp <= 0) {
      set({
        player: { ...effectivePlayer, hp: 0 },
        battle: undefined,
        gamePhase: 'explore',
        battleLog: []
      });
      get().addMessage(`💀 ${effectivePlayer.name}被击败了...`);
      get().addMessage('你被送到了最近的医院...');
      setTimeout(() => {
        set((state: GameState) => ({
          player: { 
            ...state.player, 
            hp: Math.floor(state.player.maxHp / 2),
            statusEffects: [],
            gold: Math.floor(state.player.gold * 0.9)
          }
        }));
      }, 100);
    } else {
      // 更新玩家状态（包括状态效果）
      set({
        player: { 
          ...effectivePlayer, 
          hp: newPlayerHp,
          statusEffects: effectivePlayer.statusEffects 
        },
        battle: { ...currentState.battle, enemy, turn: 'player', isProcessing: false }
      });
    }
  }
}

const initialPlayer: Player = {
  id: 'hunter',
  name: '猎人',
  level: 1,
  hp: 40,
  maxHp: 40,
  attack: 5,
  defense: 3,
  speed: 10, // 新增
  gold: 50,
  exp: 0,
  role: '猎人',
  portraitId: 'hunter',
  drivingLevel: 1,
  drivingExp: 0,
  statusEffects: [], // 新增
  critRate: 0.1, // 新增
  critDamage: 1.5, // 新增
  dodgeRate: 0.05, // 新增
  hitRate: 0.95 // 新增
};

const initialInventory: InventoryItem[] = [
  { item: items.find(i => i.id === 'i1')!, quantity: 4 },
  { item: items.find(i => i.id === 'i2')!, quantity: 2 }
];

type GameStoreActions = {
  startGame: (playerName?: string) => void;
  selectCharacter: (characterId: string) => void;
  moveToLocation: (locationId: string) => void;
  startBattle: (enemy?: Enemy) => void;
  attack: () => void;
  mainCannonAttack: () => void;
  subCannonAttack: () => void;
  seAttack: () => void;
  defend: () => void;
  useItem: (item: Item) => void;
  flee: () => void;
  openShop: (type?: 'human' | 'tank') => void;
  closeShop: () => void;
  buyItem: (item: Item) => void;
  openInventory: () => void;
  closeInventory: () => void;
  equipItem: (item: Item) => void;
  rest: () => void;
  healPlayer: () => void;
  repairAllTanks: () => void;
  addMessage: (message: string) => void;
  addBattleMessage: (message: string) => void;
  resetGame: () => void;
  recruitMember: (characterId: string) => void;
  addTank: (tankId: string) => void;
  switchTank: (index: number) => void;
  switchMember: (index: number) => void;
  getFirstTank: () => void;
  openMenu: () => void;
  closeMenu: () => void;
  toggleRideTank: () => void;
  renamePlayer: (name: string) => void;
  renameTank: (tankIndex: number, name: string) => void;
  saveGame: () => void;
  loadGame: () => boolean;
  completeIntro: () => void;
  hasSaveData: () => boolean;
  enterBuilding: (building: Building) => void;
  leaveBuilding: () => void;
  sellItem: (item: Item) => void;
  reviveMember: (memberId: string) => void;
  collectBounty: (bossId: string) => void;
  depositItem: (item: Item) => void;
  withdrawItem: (item: Item) => void;
  unequipItem: (slot: string) => void;
  learnBlueprint: (blueprintId: string) => void;
  openCrafting: () => void;
  closeCrafting: () => void;
  craftItem: (blueprintId: string) => void;
  setInventory: (inventory: InventoryItem[]) => void;
  setStoryFlags: (flags: StoryFlags) => void;
  addQuest: (questId: string) => void;
  updateQuestObjective: (questId: string, objectiveId: string, progress: number) => void;
  completeQuest: (questId: string) => void;
  triggerEffect: (type: string, position: 'enemy' | 'player') => void;
  startDialogChain: (dialogId: string) => void;
  nextDialog: () => void;
  checkDialogCondition: (condition: string) => boolean;
  processDialogAction: (action: string) => void;
};

let messageCounter = 0;

export const useGameStore = create<GameState & GameStoreActions>((set, get) => ({
  player: initialPlayer,
  members: [initialPlayer],
  currentMemberIndex: 0,
  inventory: initialInventory,
  storage: [],
  warehouseItems: [],
  gold: 50,
  tanks: [],
  currentTankIndex: 0,
  isOnTank: false,
  gamePhase: 'title',
  currentLocationId: 'radom_town',
  tankLocation: null,
  defeatedBosses: [],
  storyFlags: {},
  playerEquip: { head: undefined, body: undefined, hand: undefined, foot: undefined, weapon: undefined },
  messages: [],
  battle: undefined,
  battleLog: [],
  blueprints: [],
  locations: locations,
  shopItems: [],
  currentDialogId: undefined,
  dialogQueue: [],
  activeDialog: null,
  quests: {
    available: [],
    inProgress: [],
    completed: []
  },

  startGame: (playerName?: string) => {
    const newPlayer: Player = {
      id: 'hunter',
      name: playerName || '猎人',
      role: '猎人',
      maxHp: 40,
      hp: 40,
      attack: 5,
      defense: 3,
      speed: 10, // 新增：初始速度
      portraitId: 'hunter',
      drivingLevel: 1,
      drivingExp: 0,
      level: 1,
      exp: 0,
      gold: 50,
      statusEffects: [], // 新增：空状态效果列表
      critRate: 0.1, // 新增：10%暴击率
      critDamage: 1.5, // 新增：1.5倍暴击伤害
      dodgeRate: 0.05, // 新增：5%闪避率
      hitRate: 0.95 // 新增：95%命中率
    };
    
    const mainQuest1 = quests.find(q => q.id === 'main_1');
    
    set({
      player: newPlayer,
      members: [newPlayer],
      currentMemberIndex: 0,
      tanks: [],
      currentTankIndex: 0,
      isOnTank: false,
      gamePhase: 'intro',
      currentLocationId: 'radom_town',
      tankLocation: null,
      defeatedBosses: [],
      storyFlags: {},
      inventory: initialInventory,
      storage: [],
      warehouseItems: [],
      playerEquip: { head: undefined, body: undefined, hand: undefined, foot: undefined, weapon: undefined },
      messages: [],
      battle: undefined,
      battleLog: [],
      blueprints: [],
      locations: locations,
      shopItems: [],
      currentDialogId: undefined,
      quests: {
        available: [],
        inProgress: mainQuest1 ? [{
          ...mainQuest1,
          objectives: mainQuest1.objectives.map(obj => ({
            ...obj,
            currentCount: 0,
            completed: false
          }))
        }] : [],
        completed: []
      },
      currentQuestId: 'main_1'
    });
  },

  completeIntro: () => {
    set({ gamePhase: 'explore' });
    get().addMessage('欢迎来到废土世界！探索这个充满危险的世界吧！');
    get().addMessage('提示：点击地图上的地点进行探索，遭遇敌人时进行战斗！');
  },

  selectCharacter: (characterId: string) => {
    const character = characters.find(c => c.id === characterId);
    if (!character) return;
    const newPlayer: Player = {
      id: character.id,
      name: character.name,
      role: character.role,
      maxHp: character.baseHp,
      hp: character.baseHp,
      attack: character.baseAttack,
      defense: character.baseDefense,
      speed: 10, // 新增：初始速度
      gold: 50,
      exp: 0,
      level: 1,
      portraitId: character.portraitId,
      drivingLevel: 1,
      drivingExp: 0,
      statusEffects: [], // 新增
      critRate: 0.1, // 新增
      critDamage: 1.5, // 新增
      dodgeRate: 0.05, // 新增
      hitRate: 0.95 // 新增
    };
    set({
      player: newPlayer,
      members: [newPlayer],
      gamePhase: 'intro'
    });
  },

  addMessage: (message: string) => {
    messageCounter++;
    set(state => ({
      messages: [...state.messages.slice(-49), { id: `${Date.now()}_${messageCounter}`, text: message }]
    }));
  },

  addBattleMessage: (message: string) => {
    set(state => ({
      battleLog: [...state.battleLog.slice(-19), message]
    }));
  },

  moveToLocation: (locationId: string) => {
    const location = locations.find(l => l.id === locationId);
    if (!location) return;

    set({ currentLocationId: locationId });
    get().addMessage(`到达了${location.name}`);

    if (location.type === 'wilderness' && location.enemyChance) {
      if (Math.random() < location.enemyChance) {
        const availableEnemies = enemies.filter(e => location.enemyIds?.includes(e.id) || (!e.isBoss && !location.bossId));
        if (availableEnemies.length > 0) {
          const randomEnemy = availableEnemies[Math.floor(Math.random() * availableEnemies.length)];
          const enemyWithId = { ...randomEnemy, id: `${randomEnemy.id}_${Date.now()}` };
          get().addMessage(`⚠️ 遭遇了野生的${enemyWithId.name}！`);
          get().startBattle(enemyWithId);
          return;
        }
      }
    }

    if (location.bossId) {
      const boss = enemies.find(e => e.id === location.bossId);
      if (boss && !get().defeatedBosses.includes(boss.id)) {
        if (location.id === 'radom_cave_2f' && get().tanks.length === 0) {
          get().addMessage(`你看到了一辆废弃的战车停在深处...`);
        } else {
          get().addMessage(`⚠️ BOSS出现！${boss.name}！${boss.bounty ? '悬赏金: ' + boss.bounty + 'G' : ''}`);
          get().startBattle(boss);
          return;
        }
      } else if (boss && get().defeatedBosses.includes(boss.id)) {
        get().addMessage(`这里已经安全了，${boss.name}已经被击败。`);
      }
    }

    const locationDialogs = dialogs.filter(d => {
      if (!d.locationId) return false;
      return locationId.startsWith(d.locationId) || d.locationId === locationId;
    });

    if (locationDialogs.length > 0) {
      const eligibleDialogs = locationDialogs.filter(d => {
        if (d.triggerCondition) {
          return get().checkDialogCondition(d.triggerCondition);
        }
        return true;
      });

      if (eligibleDialogs.length > 0) {
        const firstDialog = eligibleDialogs[0];
        get().startDialogChain(firstDialog.id);
        return;
      }
    }
  },

  startBattle: (enemy?: Enemy) => {
    const battleEnemy = enemy ? { ...enemy } : { ...enemies[Math.floor(Math.random() * enemies.length)] };
    
    let message = `遭遇了${battleEnemy.name}！${battleEnemy.isBoss ? '⚠️ BOSS战！' : ''}`;
    
    if (battleEnemy.id === 'boss0' && !get().storyFlags.metMysticHunter) {
      message = '💥 狂犬首领出现了！\n';
      message += '狂犬首领：汪汪汪！这是我的地盘！\n\n';
      message += '你必须亲自击败它才能获得这辆战车！';
    }
    
    set({
      gamePhase: 'battle',
      battleLog: [],
      battle: {
        enemy: battleEnemy,
        turn: 'player',
        useTank: get().isOnTank && get().tanks.length > 0
      }
    });
    get().addMessage(message);
    get().addBattleMessage(`⚔️ 战斗开始！遭遇了${battleEnemy.name}！`);
    
    if (battleEnemy.id === 'boss0' && !get().storyFlags.metMysticHunter) {
      get().addBattleMessage('💥 狂犬首领咆哮着向你扑来！你必须独自击败它！');
    }
  },

  attack: () => {
    const state = get();
    if (!state.battle) return;
    if (state.battle.isProcessing) return;

    const { enemy } = state.battle;
    if (state.battle.useTank) return;
    
    // 计算角色的有效攻击力（装备加成）
    const effectivePlayer = {
      ...state.player,
      attack: state.player.attack + (state.playerEquip.weapon?.value || 0),
      defense: state.player.defense + 
        (state.playerEquip.head?.value || 0) + 
        (state.playerEquip.body?.value || 0) + 
        (state.playerEquip.hand?.value || 0) + 
        (state.playerEquip.foot?.value || 0)
    };
    
    // 使用新的伤害计算系统
    const damageResult = calculateDamage(effectivePlayer, enemy);
    
    let newEnemy = { ...enemy, hp: Math.max(0, enemy.hp - (damageResult.finalDamage || 0)) };
    
    // 应用战斗结果消息
    if (damageResult.isDodged || !damageResult.isHit) {
      get().addBattleMessage(`💨 ${enemy.name} 闪避了攻击！`);
      // 触发闪避特效
      get().triggerEffect('miss', 'player');
    } else if (damageResult.isCrit) {
      get().addBattleMessage(`💥 暴击！对${enemy.name}造成了 ${damageResult.finalDamage} 点伤害！`);
      // 触发爆炸特效
      get().triggerEffect('explosion', 'enemy');
    } else {
      get().addBattleMessage(`⚔️ 你对${enemy.name}造成了 ${damageResult.finalDamage} 点伤害！`);
      // 触发命中特效
      get().triggerEffect('hit', 'enemy');
    }
    
    if (newEnemy.hp <= 0) {
      handleEnemyDefeated(get, set, enemy, state.player);
    } else {
      set({ battle: { ...state.battle, enemy: newEnemy, turn: 'enemy' } });
      scheduleEnemyAttack(get, set);
    }
  },

  mainCannonAttack: () => {
    const state = get();
    if (!state.battle || state.battle.isProcessing || !state.battle.useTank) return;

    const { enemy } = state.battle;
    const tank = state.tanks[state.currentTankIndex];
    if (!tank.weapon) {
      get().addBattleMessage('⚠️ 没有装备主炮！');
      return;
    }

    const mainCannonDamage = tank.attack + tank.weapon.value;
    const damageResult = calculateDamage({ ...state.player, attack: mainCannonDamage }, enemy);

    let newEnemy = { ...enemy, hp: Math.max(0, enemy.hp - (damageResult.finalDamage || 0)) };

    if (damageResult.isDodged || !damageResult.isHit) {
      get().addBattleMessage(`💨 ${enemy.name} 闪避了主炮攻击！`);
    } else if (damageResult.isCrit) {
      get().addBattleMessage(`💥 暴击！主炮对${enemy.name}造成了 ${damageResult.finalDamage} 点伤害！`);
    } else {
      get().addBattleMessage(`💣 主炮攻击！对${enemy.name}造成了 ${damageResult.finalDamage} 点伤害！`);
    }

    if (newEnemy.hp <= 0) {
      handleEnemyDefeated(get, set, enemy, state.player, true);
    } else {
      set({ battle: { ...state.battle, enemy: newEnemy, turn: 'enemy' } });
      scheduleEnemyAttack(get, set);
    }
  },

  subCannonAttack: () => {
    const state = get();
    if (!state.battle || state.battle.isProcessing || !state.battle.useTank) return;

    const { enemy } = state.battle;
    const tank = state.tanks[state.currentTankIndex];
    if (!tank.subWeapon) {
      get().addBattleMessage('⚠️ 没有装备副炮！');
      return;
    }

    const subCannonDamage = tank.attack + tank.subWeapon.value;
    const damageResult = calculateDamage({ ...state.player, attack: subCannonDamage }, enemy);

    let newEnemy = { ...enemy, hp: Math.max(0, enemy.hp - (damageResult.finalDamage || 0)) };

    if (damageResult.isDodged || !damageResult.isHit) {
      get().addBattleMessage(`💨 ${enemy.name} 闪避了副炮攻击！`);
    } else if (damageResult.isCrit) {
      get().addBattleMessage(`💥 暴击！副炮对${enemy.name}造成了 ${damageResult.finalDamage} 点伤害！`);
    } else {
      get().addBattleMessage(`💣 副炮攻击！对${enemy.name}造成了 ${damageResult.finalDamage} 点伤害！`);
    }

    if (newEnemy.hp <= 0) {
      handleEnemyDefeated(get, set, enemy, state.player, true);
    } else {
      set({ battle: { ...state.battle, enemy: newEnemy, turn: 'enemy' } });
      scheduleEnemyAttack(get, set);
    }
  },

  seAttack: () => {
    const state = get();
    if (!state.battle || state.battle.isProcessing || !state.battle.useTank) return;

    const { enemy } = state.battle;
    const tank = state.tanks[state.currentTankIndex];
    if (!tank.se) {
      get().addBattleMessage('⚠️ 没有装备SE！');
      return;
    }

    const seDamage = tank.attack + tank.se.value * 2;
    const damageResult = calculateDamage({ ...state.player, attack: seDamage }, enemy);

    let newEnemy = { ...enemy, hp: Math.max(0, enemy.hp - (damageResult.finalDamage || 0)) };

    if (damageResult.isDodged || !damageResult.isHit) {
      get().addBattleMessage(`💨 ${enemy.name} 闪避了SE攻击！`);
    } else if (damageResult.isCrit) {
      get().addBattleMessage(`💥 暴击！SE对${enemy.name}造成了 ${damageResult.finalDamage} 点伤害！`);
    } else {
      get().addBattleMessage(`💣 SE攻击！对${enemy.name}造成了 ${damageResult.finalDamage} 点伤害！`);
    }

    if (newEnemy.hp <= 0) {
      handleEnemyDefeated(get, set, enemy, state.player, true);
    } else {
      set({ battle: { ...state.battle, enemy: newEnemy, turn: 'enemy' } });
      scheduleEnemyAttack(get, set);
    }
  },

  defend: () => {
    const state = get();
    if (!state.battle || state.battle.isProcessing) return;

    const { enemy } = state.battle;
    const useTank = state.battle.useTank;
    
    // 计算防御力
    let defensePower = 0;
    if (useTank) {
      const tank = state.tanks[state.currentTankIndex];
      defensePower = tank.defense + (tank.engine?.value || 0) + (tank.cDevice?.value || 0) + (state.player.drivingLevel || 1) * 1;
    } else {
      defensePower = state.player.defense +
        (state.playerEquip.head?.value || 0) +
        (state.playerEquip.body?.value || 0) +
        (state.playerEquip.hand?.value || 0) +
        (state.playerEquip.foot?.value || 0);
    }
    
    // 防御时提升50%防御力
    const effectiveDefense = Math.floor(defensePower * 1.5);
    
    get().addBattleMessage(`🛡️ ${state.player.name}进入防御姿态！防御力提升！`);

    if (enemy.hp > 0) {
      scheduleEnemyAttack(get, set, true);
    }
  },

  useItem: (item: Item) => {
    const state = get();
    
    if (state.gamePhase === 'battle' && state.battle?.isProcessing) return;
    
    const inventoryItem = state.inventory.find(i => i.item.id === item.id);
    if (!inventoryItem || inventoryItem.quantity <= 0) {
      get().addMessage('物品不足！');
      return;
    }
    
    const isInBattle = state.gamePhase === 'battle' && state.battle;
    
    if (item.type === 'consumable') {
      if (item.id === 'i1') {
        // 恢复HP
        const newHp = Math.min(state.player.maxHp, state.player.hp + item.value);
        
        set({
          player: { ...state.player, hp: newHp },
          inventory: state.inventory.map(i => 
            i.item.id === item.id ? { ...i, quantity: i.quantity - 1 } : i
          ).filter(i => i.quantity > 0)
        });
        
        if (isInBattle) {
          get().addBattleMessage(`💊 使用了${item.name}，恢复了 ${item.value} HP！`);
          // 战斗中使用后轮到敌人
          set({ battle: { ...state.battle!, turn: 'enemy' } });
          scheduleEnemyAttack(get, set);
        } else {
          get().addMessage(`💊 使用了${item.name}，恢复了 ${item.value} HP！`);
        }
      } else if (item.id === 'i2' || item.id === 'i3' || item.id === 'i4') {
        // 投掷物
        if (isInBattle && state.battle) {
          const currentEnemy = state.battle.enemy;
          
          // 使用新的伤害计算系统
          const thrower = state.player;
          const damageResult = calculateDamage(
            { ...thrower, attack: item.value }, // 投掷物伤害作为攻击力
            currentEnemy
          );
          const damage = damageResult.finalDamage || 0;
          const newEnemyHp = Math.max(0, currentEnemy.hp - damage);
          
          // 一次性更新所有状态
          set({
            battle: { ...state.battle, enemy: { ...currentEnemy, hp: newEnemyHp }, turn: 'enemy' },
            inventory: state.inventory.map(i => 
              i.item.id === item.id ? { ...i, quantity: i.quantity - 1 } : i
            ).filter(i => i.quantity > 0)
          });
          
          if (damageResult.isCrit) {
            get().addBattleMessage(`💥 暴击！使用了${item.name}，对${currentEnemy.name}造成了 ${damage} 点伤害！`);
          } else {
            get().addBattleMessage(`💣 使用了${item.name}，对${currentEnemy.name}造成了 ${damage} 点伤害！`);
          }
          
          if (newEnemyHp <= 0) {
            handleEnemyDefeated(get, set, currentEnemy, state.player, state.battle.useTank);
            return;
          }
          
          scheduleEnemyAttack(get, set);
        } else {
          set({
            inventory: state.inventory.map(i => 
              i.item.id === item.id ? { ...i, quantity: i.quantity - 1 } : i
            ).filter(i => i.quantity > 0)
          });
          get().addMessage(`使用了${item.name}！`);
        }
      } else if (item.id === 'i10') {
        // 药液 - 造成腐蚀伤害 + 中毒效果
        if (isInBattle && state.battle) {
          const currentEnemy = state.battle.enemy;
          const damage = Math.floor(item.value * 0.8); // 腐蚀伤害较低
          const newEnemyHp = Math.max(0, currentEnemy.hp - damage);
          
          // 添加中毒效果
          const poisonEffect = createStatusEffect('poison', 3, 5);
          const updatedEnemy = {
            ...currentEnemy,
            hp: newEnemyHp,
            statusEffects: [...(currentEnemy.statusEffects || []), poisonEffect]
          };
          
          set({
            battle: { ...state.battle, enemy: updatedEnemy, turn: 'enemy' },
            inventory: state.inventory.map(i => 
              i.item.id === item.id ? { ...i, quantity: i.quantity - 1 } : i
            ).filter(i => i.quantity > 0)
          });
          
          get().addBattleMessage(`☠️ 使用了${item.name}，对${currentEnemy.name}造成了 ${damage} 点腐蚀伤害并附加中毒效果！`);
          
          if (newEnemyHp <= 0) {
            handleEnemyDefeated(get, set, currentEnemy, state.player, state.battle.useTank);
            return;
          }
          
          scheduleEnemyAttack(get, set);
        } else {
          set({
            inventory: state.inventory.map(i => 
              i.item.id === item.id ? { ...i, quantity: i.quantity - 1 } : i
            ).filter(i => i.quantity > 0)
          });
          get().addMessage(`使用了${item.name}！`);
        }
      } else if (item.id === 'i12' || item.id === 'i13' || item.id === 'i14') {
        // 恢复装甲
        if (state.tanks.length === 0) return;
        const updatedTanks = [...state.tanks];
        updatedTanks[state.currentTankIndex] = { 
          ...updatedTanks[state.currentTankIndex], 
          armor: Math.min(updatedTanks[state.currentTankIndex].maxArmor, 
                         updatedTanks[state.currentTankIndex].armor + item.value) 
        };
        
        set({
          tanks: updatedTanks,
          inventory: state.inventory.map(i => 
            i.item.id === item.id ? { ...i, quantity: i.quantity - 1 } : i
          ).filter(i => i.quantity > 0)
        });
        
        if (isInBattle) {
          get().addBattleMessage(`🔧 使用了${item.name}，恢复了 ${item.value} 装甲！`);
          // 战斗中使用后轮到敌人
          set({ battle: { ...state.battle!, turn: 'enemy' } });
          scheduleEnemyAttack(get, set);
        } else {
          get().addMessage(`🔧 使用了${item.name}，恢复了 ${item.value} 装甲！`);
        }
      } else if (item.id === 'i5') {
        // 解药 - 清除中毒状态
        if (state.player.statusEffects && state.player.statusEffects.length > 0) {
          const { entity: clearedPlayer, clearedEffects } = clearNegativeEffects(state.player);
          if (clearedEffects.length > 0) {
            set({
              player: clearedPlayer,
              inventory: state.inventory.map(i => 
                i.item.id === item.id ? { ...i, quantity: i.quantity - 1 } : i
              ).filter(i => i.quantity > 0)
            });
            get().addBattleMessage(`💊 使用了${item.name}，清除了 ${clearedEffects.join('、')} 效果！`);
          } else {
            get().addBattleMessage(`⚠️ 当前没有负面状态效果！`);
          }
        } else {
          get().addBattleMessage(`⚠️ 当前没有负面状态效果！`);
        }
        
        if (isInBattle) {
          set({ battle: { ...state.battle!, turn: 'enemy' } });
          scheduleEnemyAttack(get, set);
        }
      } else if (item.id === 'i6') {
        // 烟幕 - 降低敌人命中率
        if (isInBattle && state.battle) {
          get().addBattleMessage(`🌫️ 使用了${item.name}，降低了敌人的命中率！`);
          // 简化处理：直接扣除道具
          set({
            inventory: state.inventory.map(i => 
              i.item.id === item.id ? { ...i, quantity: i.quantity - 1 } : i
            ).filter(i => i.quantity > 0)
          });
          set({ battle: { ...state.battle!, turn: 'enemy' } });
          scheduleEnemyAttack(get, set);
        } else {
          set({
            inventory: state.inventory.map(i => 
              i.item.id === item.id ? { ...i, quantity: i.quantity - 1 } : i
            ).filter(i => i.quantity > 0)
          });
          get().addMessage(`使用了${item.name}！`);
        }
      } else if (item.id === 'i7') {
        // 军号 - 攻击力提升
        if (isInBattle) {
          const attackUpEffect = createStatusEffect('attackUp', 3, 0.5);
          const { entity: buffedPlayer } = addStatusEffect(state.player, attackUpEffect);
          set({
            player: buffedPlayer,
            inventory: state.inventory.map(i => 
              i.item.id === item.id ? { ...i, quantity: i.quantity - 1 } : i
            ).filter(i => i.quantity > 0)
          });
          get().addBattleMessage(`📯 使用了${item.name}！攻击力提升50%，持续3回合！`);
          set({ battle: { ...state.battle!, turn: 'enemy' } });
          scheduleEnemyAttack(get, set);
        } else {
          set({
            inventory: state.inventory.map(i => 
              i.item.id === item.id ? { ...i, quantity: i.quantity - 1 } : i
            ).filter(i => i.quantity > 0)
          });
          get().addMessage(`使用了${item.name}！攻击力提升50%！`);
        }
      } else if (item.id === 'i8') {
        // 雷达 - 攻击力和命中提升
        if (isInBattle) {
          const attackUpEffect = createStatusEffect('attackUp', 3, 0.5);
          const defenseUpEffect = createStatusEffect('defenseUp', 3, 0.3);
          const { entity: buffedPlayer } = addStatusEffect(state.player, attackUpEffect);
          const { entity: buffedPlayer2 } = addStatusEffect(buffedPlayer, defenseUpEffect);
          set({
            player: buffedPlayer2,
            inventory: state.inventory.map(i => 
              i.item.id === item.id ? { ...i, quantity: i.quantity - 1 } : i
            ).filter(i => i.quantity > 0)
          });
          get().addBattleMessage(`📡 使用了${item.name}！攻击力提升50%，防御力提升30%，持续3回合！`);
          set({ battle: { ...state.battle!, turn: 'enemy' } });
          scheduleEnemyAttack(get, set);
        } else {
          set({
            inventory: state.inventory.map(i => 
              i.item.id === item.id ? { ...i, quantity: i.quantity - 1 } : i
            ).filter(i => i.quantity > 0)
          });
          get().addMessage(`使用了${item.name}！攻击力提升50%，防御力提升30%！`);
        }
      } else if (item.id === 'i9') {
        // 地图 - 提升命中率
        if (isInBattle) {
          get().addBattleMessage(`🗺️ 使用了${item.name}，本场战斗命中率提升！`);
          set({
            inventory: state.inventory.map(i => 
              i.item.id === item.id ? { ...i, quantity: i.quantity - 1 } : i
            ).filter(i => i.quantity > 0)
          });
          set({ battle: { ...state.battle!, turn: 'enemy' } });
          scheduleEnemyAttack(get, set);
        } else {
          set({
            inventory: state.inventory.map(i => 
              i.item.id === item.id ? { ...i, quantity: i.quantity - 1 } : i
            ).filter(i => i.quantity > 0)
          });
          get().addMessage(`使用了${item.name}！`);
        }
      } else if (item.id === 'i16') {
        // 石蜡 - 酸中和
        if (isInBattle && state.battle) {
          get().addBattleMessage(`🕯️ 使用了${item.name}，酸液被中和了！`);
          set({
            inventory: state.inventory.map(i => 
              i.item.id === item.id ? { ...i, quantity: i.quantity - 1 } : i
            ).filter(i => i.quantity > 0)
          });
          set({ battle: { ...state.battle!, turn: 'enemy' } });
          scheduleEnemyAttack(get, set);
        } else {
          set({
            inventory: state.inventory.map(i => 
              i.item.id === item.id ? { ...i, quantity: i.quantity - 1 } : i
            ).filter(i => i.quantity > 0)
          });
          get().addMessage(`使用了${item.name}！`);
        }
      } else if (item.id === 'i17') {
        // 迷彩条 - 降低遇敌率
        set({
          inventory: state.inventory.map(i => 
            i.item.id === item.id ? { ...i, quantity: i.quantity - 1 } : i
          ).filter(i => i.quantity > 0)
        });
        get().addMessage(`使用了${item.name}！接下来的遇敌率降低！`);
      } else if (item.id === 'i11') {
        // 再生丸 - 复活并添加再生效果
        const regenEffect = createStatusEffect('regen', 5, 10);
        const { entity: regenedPlayer } = addStatusEffect(state.player, regenEffect);
        set({
          player: {
            ...regenedPlayer,
            hp: Math.floor(state.player.maxHp * 0.5)
          },
          inventory: state.inventory.map(i => 
            i.item.id === item.id ? { ...i, quantity: i.quantity - 1 } : i
          ).filter(i => i.quantity > 0)
        });
        if (isInBattle) {
          get().addBattleMessage(`💚 使用了${item.name}！HP恢复至50%，并附加再生效果，每回合恢复10HP，持续5回合！`);
          set({ battle: { ...state.battle!, turn: 'enemy' } });
          scheduleEnemyAttack(get, set);
        } else {
          get().addMessage(`💚 使用了${item.name}！HP恢复至50%，并附加再生效果！`);
        }
      } else if (item.id === 'i15') {
        // 传真 - 瞬间传送
        set({
          inventory: state.inventory.map(i => 
            i.item.id === item.id ? { ...i, quantity: i.quantity - 1 } : i
          ).filter(i => i.quantity > 0)
        });
        get().addMessage(`🌀 使用了${item.name}！传送回最近的城镇！`);
      } else {
        // 其他消耗品
        set({
          inventory: state.inventory.map(i => 
            i.item.id === item.id ? { ...i, quantity: i.quantity - 1 } : i
          ).filter(i => i.quantity > 0)
        });
        if (isInBattle) {
          get().addBattleMessage(`使用了${item.name}！`);
          // 战斗中使用后轮到敌人
          set({ battle: { ...state.battle!, turn: 'enemy' } });
          scheduleEnemyAttack(get, set);
        } else {
          get().addMessage(`使用了${item.name}！`);
        }
      }
    }
  },

  flee: () => {
    const state = get();
    if (!state.battle || state.battle.isProcessing) return;

    if (state.battle.enemy.isBoss) {
      get().addBattleMessage('⚠️ BOSS战无法撤退！');
      return;
    }

    if (Math.random() < 0.5) {
      get().addBattleMessage('🏃 成功逃脱了！');
      set({ gamePhase: 'explore', battle: undefined, battleLog: [] });
    } else {
      get().addBattleMessage('🏃 逃跑失败！');
      set({ battle: { ...state.battle, turn: 'enemy' } });
      scheduleEnemyAttack(get, set);
    }
  },

  openShop: (type?: 'human' | 'tank') => {
    set({ gamePhase: 'shop', shopType: type });
  },

  closeShop: () => {
    set({ gamePhase: 'explore' });
  },

  buyItem: (item: Item) => {
    const state = get();
    if (state.player.gold < item.price) {
      get().addMessage('金币不足！');
      return;
    }

    if (item.type === 'blueprint') {
      if (state.blueprints.includes(item.id)) {
        get().addMessage('已经学会了这个图纸！');
        return;
      }
      set({
        player: { ...state.player, gold: state.player.gold - item.price },
        blueprints: [...state.blueprints, item.id]
      });
      get().addMessage(`学会了制作${item.name}！`);
      return;
    }

    const existingItem = state.inventory.find(i => i.item.id === item.id);
    if (existingItem) {
      set({
        player: { ...state.player, gold: state.player.gold - item.price },
        inventory: state.inventory.map(i => 
          i.item.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
        )
      });
    } else {
      set({
        player: { ...state.player, gold: state.player.gold - item.price },
        inventory: [...state.inventory, { item, quantity: 1 }]
      });
    }
    get().addMessage(`购买了${item.name}！`);
  },

  sellItem: (item: Item) => {
    const state = get();
    const existingItem = state.inventory.find(i => i.item.id === item.id);
    if (!existingItem) return;

    if (existingItem.quantity > 1) {
      set({
        player: { ...state.player, gold: state.player.gold + Math.floor(item.price / 2) },
        inventory: state.inventory.map(i => 
          i.item.id === item.id ? { ...i, quantity: i.quantity - 1 } : i
        )
      });
    } else {
      set({
        player: { ...state.player, gold: state.player.gold + Math.floor(item.price / 2) },
        inventory: state.inventory.filter(i => i.item.id !== item.id)
      });
    }
    get().addMessage(`卖出了${item.name}，获得${Math.floor(item.price / 2)}金币`);
  },

  openInventory: () => {
    set({ gamePhase: 'inventory' });
  },

  closeInventory: () => {
    set({ gamePhase: 'explore' });
  },

  equipItem: (item: Item) => {
    const state = get();
    
    let slot: 'head' | 'body' | 'hand' | 'foot' | 'weapon' = 'weapon';
    if (item.type === 'head') slot = 'head';
    else if (item.type === 'body') slot = 'body';
    else if (item.type === 'hand') slot = 'hand';
    else if (item.type === 'foot') slot = 'foot';
    
    const currentEquip = state.playerEquip[slot];
    
    const newEquip = { ...state.playerEquip, [slot]: item };
    set({ playerEquip: newEquip });
    
    if (currentEquip) {
      get().addMessage(`卸下了${currentEquip.name}，装备了${item.name}`);
    } else {
      get().addMessage(`装备了${item.name}！`);
    }
    
    set({ gamePhase: 'explore' });
  },

  unequipItem: (slot: string) => {
    const state = get();
    const item = state.playerEquip[slot as keyof typeof state.playerEquip];
    if (!item) return;

    const existingItem = state.inventory.find(i => i.item.id === item.id);
    if (existingItem) {
      set({
        playerEquip: { ...state.playerEquip, [slot]: undefined },
        inventory: state.inventory.map(i => 
          i.item.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
        )
      });
    } else {
      set({
        playerEquip: { ...state.playerEquip, [slot]: undefined },
        inventory: [...state.inventory, { item, quantity: 1 }]
      });
    }
    get().addMessage(`卸下了${item.name}`);
  },

  rest: () => {
    const state = get();
    set({ 
      player: { ...state.player, hp: state.player.maxHp },
      members: state.members.map(m => ({ ...m, hp: m.maxHp }))
    });
    get().addMessage('休息了一会儿，HP全部恢复了！');
  },

  healPlayer: () => {
    const state = get();
    if (state.player.gold < 50) {
      get().addMessage('治疗费用50金币，你没有足够的金币！');
      return;
    }
    set({
      player: { ...state.player, gold: state.player.gold - 50, hp: state.player.maxHp }
    });
    get().addMessage('付了50金币，HP全部恢复了！');
  },

  repairAllTanks: () => {
    const state = get();
    const repairCost = state.tanks.reduce((sum, tank) => sum + (tank.maxArmor - tank.armor), 0);
    
    if (state.player.gold < repairCost) {
      get().addMessage(`修理全部战车需要${repairCost}金币，你的金币不足！`);
      return;
    }
    
    set({
      player: { ...state.player, gold: state.player.gold - repairCost },
      tanks: state.tanks.map(tank => ({ ...tank, armor: tank.maxArmor }))
    });
    get().addMessage(`付了${repairCost}金币，所有战车装甲已修复！`);
  },

  recruitMember: (characterId: string) => {
    const character = characters.find(c => c.id === characterId);
    if (!character) return;

    const newMember: Player = {
      id: character.id,
      name: character.name,
      level: 1,
      hp: character.baseHp,
      maxHp: character.baseHp,
      attack: character.baseAttack,
      defense: character.baseDefense,
      speed: 10,
      gold: 0,
      exp: 0,
      role: character.role,
      portraitId: character.portraitId,
      drivingLevel: 1,
      drivingExp: 0,
      statusEffects: [],
      critRate: 0.1,
      critDamage: 1.5,
      dodgeRate: 0.05,
      hitRate: 0.95
    };

    set(state => ({
      members: [...state.members, newMember]
    }));
    get().addMessage(`${character.name}加入了队伍！`);
  },

  addTank: (tankId: string) => {
    const tankModel = tankModels.find(t => t.id === tankId);
    if (!tankModel) return;

    const state = get();
    const mainGun = items.find(i => i.id === 'w1');
    
    const newTank: Tank = {
      id: `tank_${Date.now()}`,
      name: tankModel.name,
      type: tankModel.id,
      attack: tankModel.baseAttack,
      defense: tankModel.baseDefense,
      armor: tankModel.baseArmor,
      maxArmor: tankModel.baseArmor,
      weapon: mainGun ? { ...mainGun } : undefined,
      mainCannonAmmo: 16
    };
    
    set(state => ({
      tanks: [...state.tanks, newTank]
    }));
    get().addMessage(`获得了${tankModel.name}！`);
  },

  switchTank: (index: number) => {
    const state = get();
    if (index < 0 || index >= state.tanks.length) return;
    set({ currentTankIndex: index });
    get().addMessage(`切换到了${state.tanks[index].name}！`);
  },

  switchMember: (index: number) => {
    const state = get();
    if (index < 0 || index >= state.members.length) return;
    set({ currentMemberIndex: index });
  },

  getFirstTank: () => {
    const state = get();
    if (state.tanks.length > 0) return;

    const mainGun = items.find(i => i.id === 'w1');
    
    const newTank: Tank = {
      id: `tank_${Date.now()}`,
      name: '先锋号',
      type: 'tank_placeholder',
      attack: 15,
      defense: 10,
      armor: 80,
      maxArmor: 80,
      weapon: mainGun ? { ...mainGun } : undefined,
      mainCannonAmmo: 16
    };
    
    get().addMessage('🏆 获得了第一辆战车：先锋号！');
    set(state => ({ 
      tanks: [newTank],
      isOnTank: true,
      tankLocation: null,
      defeatedBosses: [...state.defeatedBosses, 'boss0'],
      storyFlags: { ...state.storyFlags, metMysticHunter: true }
    }));
  },

  openMenu: () => {
    set({ gamePhase: 'menu' });
  },

  closeMenu: () => {
    set({ gamePhase: 'explore' });
  },

  toggleRideTank: () => {
    const state = get();
    if (state.tanks.length === 0) {
      get().addMessage('你没有战车！');
      return;
    }
    set({ isOnTank: !state.isOnTank });
    get().addMessage(state.isOnTank ? '下了战车' : '上了战车');
  },

  renamePlayer: (name: string) => {
    set(state => ({
      player: { ...state.player, name },
      members: state.members.map(m => m.id === state.player.id ? { ...m, name } : m)
    }));
  },

  renameTank: (tankIndex: number, name: string) => {
    set(state => ({
      tanks: state.tanks.map((t, i) => i === tankIndex ? { ...t, name } : t)
    }));
  },

  saveGame: () => {
    const state = get();
    const saveData = {
      player: state.player,
      members: state.members,
      inventory: state.inventory,
      tanks: state.tanks,
      currentTankIndex: state.currentTankIndex,
      isOnTank: state.isOnTank,
      currentLocationId: state.currentLocationId,
      defeatedBosses: state.defeatedBosses,
      storyFlags: state.storyFlags,
      playerEquip: state.playerEquip,
      blueprints: state.blueprints,
      warehouseItems: state.warehouseItems,
      timestamp: Date.now()
    };
    localStorage.setItem('wasteland_save', JSON.stringify(saveData));
    get().addMessage('游戏已保存！');
  },

  loadGame: () => {
    const saved = localStorage.getItem('wasteland_save');
    if (!saved) return false;

    try {
      const data = JSON.parse(saved);
      set({
        player: data.player,
        members: data.members,
        inventory: data.inventory,
        tanks: data.tanks,
        currentTankIndex: data.currentTankIndex,
        isOnTank: data.isOnTank,
        currentLocationId: data.currentLocationId,
        defeatedBosses: data.defeatedBosses,
        storyFlags: data.storyFlags,
        playerEquip: data.playerEquip,
        gamePhase: 'explore',
        blueprints: data.blueprints || [],
        warehouseItems: data.warehouseItems || []
      });
      get().addMessage('游戏已加载！');
      return true;
    } catch (e) {
      get().addMessage('存档读取失败！');
      return false;
    }
  },

  hasSaveData: () => {
    return !!localStorage.getItem('wasteland_save');
  },

  resetGame: () => {
    localStorage.removeItem('wasteland_save');
    set({
      player: initialPlayer,
      members: [initialPlayer],
      inventory: initialInventory,
      tanks: [],
      currentTankIndex: 0,
      isOnTank: false,
      gamePhase: 'title',
      currentLocationId: 'radom_town',
      defeatedBosses: [],
      storyFlags: {},
      playerEquip: { head: undefined, body: undefined, hand: undefined, foot: undefined, weapon: undefined },
      messages: [],
      battle: undefined,
      battleLog: [],
      blueprints: [],
      warehouseItems: [],
      dialogQueue: [],
      activeDialog: null,
      quests: {
        available: [],
        inProgress: [],
        completed: []
      },
      currentQuestId: undefined
    });
  },

  enterBuilding: (building: Building) => {
    if (building.type === 'shop_human') {
      const humanShopItems = items.filter(item => 
        building.itemIds ? building.itemIds.includes(item.id) : ['consumable', 'humanWeapon', 'head', 'body', 'hand', 'foot'].includes(item.type)
      );
      set({ currentBuildingId: building.id, currentBuilding: building, gamePhase: 'shop', shopType: 'human', shopItems: humanShopItems });
    } else if (building.type === 'shop_tank') {
      const tankShopItems = items.filter(item => 
        building.itemIds ? building.itemIds.includes(item.id) : ['weapon', 'engine', 'cDevice', 'se'].includes(item.type)
      );
      set({ currentBuildingId: building.id, currentBuilding: building, gamePhase: 'shop', shopType: 'tank', shopItems: tankShopItems });
    } else if (building.type === 'workshop') {
      set({ currentBuildingId: building.id, currentBuilding: building, gamePhase: 'crafting' });
      get().addMessage(`进入了${building.name}`);
    } else {
      set({ currentBuildingId: building.id, currentBuilding: building, gamePhase: 'building' });
      get().addMessage(`进入了${building.name}`);
    }

    const state = get();
    const locationDialogs = getDialogsByLocation(building.id);

    const eligibleDialogs = locationDialogs.filter(d => {
      if (d.triggerCondition) {
        return get().checkDialogCondition(d.triggerCondition);
      }
      return true;
    });

    if (eligibleDialogs.length > 0) {
      const firstDialog = eligibleDialogs[0];
      get().startDialogChain(firstDialog.id);
    }
  },

  leaveBuilding: () => {
    set({ currentBuildingId: null, currentBuilding: undefined, gamePhase: 'explore' });
    get().addMessage('离开了建筑');
  },

  reviveMember: (memberId: string) => {
    const state = get();
    const member = state.members.find(m => m.id === memberId);
    if (!member) return;

    const cost = Math.floor(member.maxHp * 2);
    if (state.player.gold < cost) {
      get().addMessage(`复活${member.name}需要${cost}金币，你没有足够的金币！`);
      return;
    }

    set({
      player: { ...state.player, gold: state.player.gold - cost },
      members: state.members.map(m => 
        m.id === memberId ? { ...m, hp: Math.floor(m.maxHp / 2) } : m
      )
    });
    get().addMessage(`💚 ${member.name}被明奇博士复活了！HP恢复了一半。`);
  },

  collectBounty: (bossId: string) => {
    const state = get();
    if (!state.defeatedBosses.includes(bossId)) {
      get().addMessage('❌ 这个通缉犯还没有被击败！');
      return;
    }
    const bountyMap: Record<string, number> = {
      boss0: 100, boss1: 1000, boss2: 3000, boss3: 5000,
      boss4: 8000, boss5: 1000, boss6: 10000, boss7: 10000,
      boss8: 32000, boss9: 50000, boss10: 99800
    };
    const bounty = bountyMap[bossId];
    if (!bounty) {
      get().addMessage('❌ 没有这个通缉犯的赏金信息。');
      return;
    }
    const bountyKey = `bounty_collected_${bossId}`;
    if (state.storyFlags[bountyKey]) {
      get().addMessage('❌ 已经领取过这个赏金了！');
      return;
    }

    set({
      player: { ...state.player, gold: state.player.gold + bounty },
      storyFlags: { ...state.storyFlags, [bountyKey]: true }
    });
    get().addMessage(`🏆 领取了${bounty}金币的赏金！`);
  },

  depositItem: (item: Item) => {
    const state = get();
    const existingItem = state.inventory.find(i => i.item.id === item.id);
    if (!existingItem) return;

    if (existingItem.quantity > 1) {
      set({
        inventory: state.inventory.map(i => 
          i.item.id === item.id ? { ...i, quantity: i.quantity - 1 } : i
        ),
        warehouseItems: [...state.warehouseItems, { item, quantity: 1 }]
      });
    } else {
      set({
        inventory: state.inventory.filter(i => i.item.id !== item.id),
        warehouseItems: [...state.warehouseItems, { item, quantity: 1 }]
      });
    }
    get().addMessage(`存入了${item.name}`);
  },

  withdrawItem: (item: Item) => {
    const state = get();
    const existingItem = state.warehouseItems.find(i => i.item.id === item.id);
    if (!existingItem) return;

    if (existingItem.quantity > 1) {
      set({
        warehouseItems: state.warehouseItems.map(i => 
          i.item.id === item.id ? { ...i, quantity: i.quantity - 1 } : i
        ),
        inventory: [...state.inventory, { item, quantity: 1 }]
      });
    } else {
      set({
        warehouseItems: state.warehouseItems.filter(i => i.item.id !== item.id),
        inventory: [...state.inventory, { item, quantity: 1 }]
      });
    }
    get().addMessage(`取出了${item.name}`);
  },

  learnBlueprint: (blueprintId: string) => {
    const state = get();
    if (state.blueprints.includes(blueprintId)) return;
    set({ blueprints: [...state.blueprints, blueprintId] });
  },

  openCrafting: () => {
    set({ gamePhase: 'crafting' });
  },

  closeCrafting: () => {
    set({ gamePhase: 'explore' });
  },

  craftItem: (blueprintId: string) => {
    const state = get();
    const blueprint = blueprints.find(b => b.id === blueprintId);
    if (!blueprint) return;

    const hasMaterials = blueprint.materials.every(mat => {
      const invItem = state.inventory.find(i => i.item.id === mat.itemId);
      return invItem && invItem.quantity >= mat.quantity;
    });

    if (!hasMaterials) {
      get().addMessage('材料不足，无法制造！');
      return;
    }

    const newInventory = state.inventory.map(invItem => {
      const material = blueprint.materials.find(m => m.itemId === invItem.item.id);
      if (material) {
        return { ...invItem, quantity: invItem.quantity - material.quantity };
      }
      return invItem;
    }).filter(invItem => invItem.quantity > 0);

    const resultItem = items.find(i => i.id === blueprint.craftResult.itemId);
    if (resultItem) {
      const existingResult = newInventory.find(i => i.item.id === resultItem.id);
      if (existingResult) {
        newInventory.forEach((invItem, idx) => {
          if (invItem.item.id === resultItem.id) {
            newInventory[idx] = { ...invItem, quantity: invItem.quantity + blueprint.craftResult.quantity };
          }
        });
      } else {
        newInventory.push({ item: resultItem, quantity: blueprint.craftResult.quantity });
      }
    }

    set({ inventory: newInventory });
    get().addMessage(`成功制造了${blueprint.name}的产物！`);
  },

  setInventory: (inventory: InventoryItem[]) => {
    set({ inventory });
  },

  setStoryFlags: (flags: StoryFlags) => {
    set({ storyFlags: flags });
  },

  addQuest: (questId: string) => {
    const state = get();
    const quest = quests.find(q => q.id === questId);
    if (!quest) return;
    
    // 检查任务是否已存在
    const existsInProgress = state.quests.inProgress.some(q => q.id === questId);
    const existsCompleted = state.quests.completed.some(q => q.id === questId);
    if (existsInProgress || existsCompleted) return;
    
    // 检查前置任务
    if (quest.prerequisiteQuestId) {
      const prereqCompleted = state.quests.completed.some(q => q.id === quest.prerequisiteQuestId);
      if (!prereqCompleted) return;
    }
    
    const questWithProgress = {
      ...quest,
      objectives: quest.objectives.map(obj => ({
        ...obj,
        currentCount: 0,
        completed: false
      }))
    };
    
    set({
      quests: {
        ...state.quests,
        inProgress: [...state.quests.inProgress, questWithProgress]
      },
      currentQuestId: questId
    });
    
    get().addMessage(`📜 接受新任务：${quest.name}`);
  },

  updateQuestObjective: (questId: string, objectiveId: string, progress: number) => {
    const state = get();
    const questIndex = state.quests.inProgress.findIndex(q => q.id === questId);
    if (questIndex === -1) return;
    
    const quest = state.quests.inProgress[questIndex];
    const objectiveIndex = quest.objectives.findIndex(o => o.id === objectiveId);
    if (objectiveIndex === -1) return;
    
    const updatedObjectives = [...quest.objectives];
    const objective = updatedObjectives[objectiveIndex];
    const newCount = (objective.currentCount || 0) + progress;
    const isCompleted = objective.targetCount ? newCount >= objective.targetCount : true;
    
    updatedObjectives[objectiveIndex] = {
      ...objective,
      currentCount: newCount,
      completed: isCompleted
    };
    
    const updatedQuest = { ...quest, objectives: updatedObjectives };
    const updatedInProgress = [...state.quests.inProgress];
    updatedInProgress[questIndex] = updatedQuest;
    
    const allObjectivesCompleted = updatedObjectives.every(o => o.completed || 
      (o.targetCount && o.currentCount !== undefined && o.currentCount >= o.targetCount));
    
    if (allObjectivesCompleted) {
      get().completeQuest(questId);
    } else {
      set({
        quests: {
          ...state.quests,
          inProgress: updatedInProgress
        }
      });
    }
  },

  completeQuest: (questId: string) => {
    const state = get();
    const questIndex = state.quests.inProgress.findIndex(q => q.id === questId);
    if (questIndex === -1) return;
    
    const quest = state.quests.inProgress[questIndex];
    
    // 发放奖励
    let newPlayer = { ...state.player };
    
    if (quest.rewards) {
      if (quest.rewards.gold) {
        newPlayer.gold += quest.rewards.gold;
      }
      if (quest.rewards.exp) {
        newPlayer.exp += quest.rewards.exp;
        while (checkLevelUp(newPlayer)) {
          newPlayer = performLevelUp(newPlayer);
        }
      }
    }
    
    // 移除已完成的任务，任务由玩家主动接取
    const newInProgress = state.quests.inProgress.filter(q => q.id !== questId);
    
    set({
      player: newPlayer,
      quests: {
        ...state.quests,
        inProgress: newInProgress,
        completed: [...state.quests.completed, quest]
      }
    });
    
    let rewardMsg = `🎉 完成任务：${quest.name}！`;
    if (quest.rewards) {
      const rewards = [];
      if (quest.rewards.gold) rewards.push(`${quest.rewards.gold}G`);
      if (quest.rewards.exp) rewards.push(`${quest.rewards.exp}EXP`);
      if (rewards.length > 0) {
        rewardMsg += ` 获得奖励：${rewards.join('、')}`;
      }
    }
    get().addMessage(rewardMsg);
  },

  triggerEffect: (type: string, position: 'enemy' | 'player') => {
  },

  startDialogChain: (dialogId: string) => {
    const dialog = getDialogById(dialogId);
    if (!dialog) return;

    const queue: Dialog[] = [];
    let currentId = dialog.nextDialogId;
    while (currentId) {
      const next = getDialogById(currentId);
      if (!next) break;
      queue.push(next);
      currentId = next.nextDialogId;
    }

    set({
      activeDialog: dialog,
      dialogQueue: queue
    });
  },

  nextDialog: () => {
    const state = get();
    if (state.dialogQueue.length === 0) {
      set({ activeDialog: null, dialogQueue: [] });
      return;
    }

    const [next, ...remainingQueue] = state.dialogQueue;

    const condition = next.triggerCondition;
    if (condition) {
      const conditionMet = get().checkDialogCondition(condition);
      if (!conditionMet) {
        set({ dialogQueue: remainingQueue });
        get().nextDialog();
        return;
      }
    }

    set({ activeDialog: next, dialogQueue: remainingQueue });

    if (next.action) {
      get().processDialogAction(next.action);
    }
  },

  checkDialogCondition: (condition: string): boolean => {
    const state = get();
    switch (condition) {
      case 'hasLeftHome':
        return state.storyFlags.hasLeftHome === true;
      case 'metRedWolf':
        return state.storyFlags.metRedWolf === true;
      case 'defeatedBattleDog':
        return state.defeatedBosses.includes('boss0');
      case 'hasTank':
        return state.tanks.length > 0;
      case 'defeatedWaterMonster':
        return state.defeatedBosses.includes('boss1');
      case 'visitedFactory':
        return state.storyFlags.visitedFactory === true;
      case 'recruitedWarrior':
        return state.members.some(m => m.id === 'warrior' || m.role === '格斗家');
      case 'defeatedMarshall':
        return state.defeatedBosses.includes('boss6');
      case 'defeatedGomez':
        return state.defeatedBosses.includes('boss7');
      case 'defeatedPorter':
        return state.defeatedBosses.includes('boss10');
      case 'defeatedNoah':
        return state.defeatedBosses.includes('boss11');
      default:
        return false;
    }
  },

  processDialogAction: (action: string) => {
    const state = get();
    switch (action) {
      case 'restoreHP': {
        set({
          player: { ...state.player, hp: state.player.maxHp },
          members: state.members.map(m => ({ ...m, hp: m.maxHp }))
        });
        get().addMessage('姐姐让你好好休息，HP完全恢复了！');
        break;
      }
      case 'startBattle_battleDog': {
        const boss = enemies.find(e => e.id === 'boss0');
        if (boss) {
          set({ activeDialog: null, dialogQueue: [] });
          get().startBattle(boss);
        }
        break;
      }
      case 'startBattle_waterMonster': {
        const boss = enemies.find(e => e.id === 'boss1');
        if (boss) {
          set({ activeDialog: null, dialogQueue: [] });
          get().startBattle(boss);
        }
        break;
      }
      case 'getFirstTank': {
        if (state.tanks.length > 0) break;
        const mainGun = items.find(i => i.id === 'w1');
        const newTank: Tank = {
          id: `tank_${Date.now()}`,
          name: '先锋号',
          type: 'tank_placeholder',
          attack: 15,
          defense: 10,
          armor: 80,
          maxArmor: 80,
          weapon: mainGun ? { ...mainGun } : undefined,
          mainCannonAmmo: 16
        };
        set({
          tanks: [newTank],
          isOnTank: true,
          tankLocation: null,
          defeatedBosses: [...state.defeatedBosses, 'boss0'],
          storyFlags: { ...state.storyFlags, metMysticHunter: true }
        });
        get().addMessage('🏆 获得了第一辆战车：先锋号！');
        break;
      }
      case 'recruitMechanic': {
        const mechanicChar = characters.find(c => c.id === 'char2');
        if (mechanicChar && !state.members.some(m => m.role === '机械师')) {
          const newMember: Player = {
            id: 'mechanic',
            name: mechanicChar.name,
            level: 1,
            hp: mechanicChar.baseHp,
            maxHp: mechanicChar.baseHp,
            attack: mechanicChar.baseAttack,
            defense: mechanicChar.baseDefense,
            speed: 10,
            gold: 0,
            exp: 0,
            role: '机械师',
            portraitId: mechanicChar.portraitId,
            drivingLevel: 1,
            drivingExp: 0,
            statusEffects: [],
            critRate: 0.1,
            critDamage: 1.5,
            dodgeRate: 0.05,
            hitRate: 0.95
          };
          set({ members: [...state.members, newMember] });
          get().addMessage('小武加入队伍！');
        }
        break;
      }
      case 'getSecondTank': {
        const mainGun = items.find(i => i.id === 'w1');
        const newTank: Tank = {
          id: `tank_${Date.now()}`,
          name: '铁壁号',
          type: 'tank_placeholder',
          attack: 25,
          defense: 12,
          armor: 100,
          maxArmor: 100,
          weapon: mainGun ? { ...mainGun } : undefined,
          mainCannonAmmo: 16
        };
        set({ tanks: [...state.tanks, newTank] });
        get().addMessage('🏆 获得了【铁壁号】！');
        break;
      }
      case 'addExpAndGold_150_200': {
        let newPlayer = {
          ...state.player,
          exp: state.player.exp + 150,
          gold: state.player.gold + 200
        };
        while (checkLevelUp(newPlayer)) {
          newPlayer = performLevelUp(newPlayer);
        }
        set({
          player: newPlayer,
          members: state.members.map(m => m.id === state.player.id ? newPlayer : m)
        });
        get().addMessage('获得经验值 150！\n获得金币 200！');
        break;
      }
      case 'checkHPRequirement': {
        const maxHp = Math.max(state.player.maxHp, ...state.members.map(m => m.maxHp));
        if (maxHp > 255) {
          const successDialog = dialogs.find(d => d.id === 'ordo_warrior_success');
          if (successDialog) {
            set({
              activeDialog: successDialog,
              dialogQueue: [...state.dialogQueue]
            });
          }
        } else {
          const failDialog = dialogs.find(d => d.id === 'ordo_warrior_fail');
          if (failDialog) {
            set({
              activeDialog: failDialog,
              dialogQueue: [...state.dialogQueue]
            });
          }
        }
        break;
      }
      case 'recruitWarrior': {
        const warriorChar = characters.find(c => c.id === 'char3');
        if (warriorChar && !state.members.some(m => m.role === '格斗家')) {
          const newMember: Player = {
            id: 'warrior',
            name: warriorChar.name,
            level: 1,
            hp: warriorChar.baseHp,
            maxHp: warriorChar.baseHp,
            attack: warriorChar.baseAttack,
            defense: warriorChar.baseDefense,
            speed: 10,
            gold: 0,
            exp: 0,
            role: '格斗家',
            portraitId: warriorChar.portraitId,
            drivingLevel: 1,
            drivingExp: 0,
            statusEffects: [],
            critRate: 0.1,
            critDamage: 1.5,
            dodgeRate: 0.05,
            hitRate: 0.95
          };
          set({ members: [...state.members, newMember] });
          get().addMessage('阿雅加入队伍！');
        }
        break;
      }
      case 'rewardMarshall': {
        const mainGun = items.find(i => i.id === 'w1');
        const newTank: Tank = {
          id: `tank_${Date.now()}`,
          name: '堡垒号',
          type: 'tank_placeholder',
          attack: 35,
          defense: 20,
          armor: 150,
          maxArmor: 150,
          weapon: mainGun ? { ...mainGun } : undefined,
          mainCannonAmmo: 16
        };
        let newPlayer = {
          ...state.player,
          exp: state.player.exp + 1000,
          gold: state.player.gold + 1500
        };
        while (checkLevelUp(newPlayer)) {
          newPlayer = performLevelUp(newPlayer);
        }
        set({
          player: newPlayer,
          members: state.members.map(m => m.id === state.player.id ? newPlayer : m),
          tanks: [...state.tanks, newTank]
        });
        get().addMessage('获得经验值 1000！\n获得金币 1500！\n获得【堡垒号】！');
        break;
      }
      case 'rewardGomez': {
        const mainGun = items.find(i => i.id === 'w1');
        const newTank: Tank = {
          id: `tank_${Date.now()}`,
          name: '赤焰号',
          type: 'tank_placeholder',
          attack: 50,
          defense: 30,
          armor: 200,
          maxArmor: 200,
          weapon: mainGun ? { ...mainGun } : undefined,
          mainCannonAmmo: 16
        };
        let newPlayer = {
          ...state.player,
          exp: state.player.exp + 2000,
          gold: state.player.gold + 3000
        };
        while (checkLevelUp(newPlayer)) {
          newPlayer = performLevelUp(newPlayer);
        }
        set({
          player: newPlayer,
          members: state.members.map(m => m.id === state.player.id ? newPlayer : m),
          tanks: [...state.tanks, newTank]
        });
        get().addMessage('获得经验值 2000！\n获得金币 3000！\n获得【赤焰号】！');
        break;
      }
      case 'rewardPorter': {
        let newPlayer = {
          ...state.player,
          exp: state.player.exp + 2500,
          gold: state.player.gold + 4000
        };
        while (checkLevelUp(newPlayer)) {
          newPlayer = performLevelUp(newPlayer);
        }
        set({
          player: newPlayer,
          members: state.members.map(m => m.id === state.player.id ? newPlayer : m)
        });
        get().addMessage('获得经验值 2500！\n获得金币 4000！');
        break;
      }
      case 'startBattle_noah': {
        const boss = enemies.find(e => e.id === 'boss11');
        if (boss) {
          set({ activeDialog: null, dialogQueue: [] });
          get().startBattle(boss);
        }
        break;
      }
      case 'ending':
      case 'showEnding': {
        set({ activeDialog: null, dialogQueue: [], gamePhase: 'title' });
        get().addMessage('🎉 恭喜通关废土战歌！感谢游玩！');
        break;
      }
      case 'redWolfAppears': {
        get().addMessage('💥 神秘猎人驾驶战车出现！');
        set({
          storyFlags: { ...state.storyFlags, metRedWolf: true }
        });
        break;
      }
      case 'nameTank': {
        get().addMessage('给战车起个名字吧！');
        break;
      }
      default:
        break;
    }
  }
}));
