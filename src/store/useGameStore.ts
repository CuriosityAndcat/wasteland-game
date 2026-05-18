import { create } from 'zustand';
import { GameState, Player, Tank, Item, Enemy, InventoryItem, Building } from '../types';
import { enemies, items, locations, characters, tankModels, blueprints } from '../data/gameData';

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

  const expNeeded = newPlayer.level * 50;
  if (newPlayer.exp >= expNeeded) {
    newPlayer = {
      ...newPlayer,
      level: newPlayer.level + 1,
      exp: newPlayer.exp - expNeeded,
      maxHp: newPlayer.maxHp + 8,
      hp: newPlayer.maxHp + 8,
      attack: newPlayer.attack + 1,
      defense: newPlayer.defense + 1
    };
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

function processEnemyCounterAttack(get: any, set: any) {
  const currentState = get();
  if (!currentState.battle) return;
  
  let defenseValue = 0;
  if (currentState.battle.useTank) {
    const tank = currentState.tanks[currentState.currentTankIndex];
    defenseValue = tank.defense + (tank.engine?.value || 0) + (tank.cDevice?.value || 0) + (currentState.player.drivingLevel || 1) * 1;
  } else {
    defenseValue = currentState.player.defense + 
      (currentState.playerEquip.head?.value || 0) + 
      (currentState.playerEquip.body?.value || 0) + 
      (currentState.playerEquip.hand?.value || 0) + 
      (currentState.playerEquip.foot?.value || 0);
  }
  
  const enemyDamage = Math.max(1, currentState.battle.enemy.attack - defenseValue + Math.floor(Math.random() * 3));
  
  if (currentState.battle.useTank) {
    const updatedTanks = [...currentState.tanks];
    updatedTanks[currentState.currentTankIndex] = { 
      ...updatedTanks[currentState.currentTankIndex], 
      armor: Math.max(0, updatedTanks[currentState.currentTankIndex].armor - enemyDamage) 
    };
    
    get().addBattleMessage(`💥 ${currentState.battle.enemy.name}对战车造成了 ${enemyDamage} 点伤害！`);
    
    if (updatedTanks[currentState.currentTankIndex].armor <= 0) {
      set({
        tanks: updatedTanks,
        battle: { ...currentState.battle, useTank: false, turn: 'player' }
      });
      get().addBattleMessage('⚠️ 战车装甲被击毁了！');
    } else {
      set({
        tanks: updatedTanks,
        battle: { ...currentState.battle, turn: 'player' }
      });
    }
  } else {
    const newPlayerHp = Math.max(0, currentState.player.hp - enemyDamage);
    get().addBattleMessage(`💥 ${currentState.battle.enemy.name}对${currentState.player.name}造成了 ${enemyDamage} 点伤害！`);
    
    if (newPlayerHp <= 0) {
      set({
        player: { ...currentState.player, hp: 0 },
        battle: undefined,
        gamePhase: 'explore',
        battleLog: []
      });
      get().addMessage(`💀 ${currentState.player.name}被击败了...`);
      get().addMessage('你被送到了最近的医院...');
      setTimeout(() => {
        set((state: GameState) => ({
          player: { ...state.player, hp: Math.floor(state.player.maxHp / 2) },
          gold: Math.floor(state.player.gold * 0.9)
        }));
      }, 100);
    } else {
      set({
        player: { ...currentState.player, hp: newPlayerHp },
        battle: { ...currentState.battle, turn: 'player' }
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
  gold: 50,
  exp: 0,
  role: '猎人',
  portraitId: 'hunter',
  drivingLevel: 1,
  drivingExp: 0
};

const initialInventory: InventoryItem[] = [
  { item: items.find(i => i.id === 'i1')!, quantity: 4 },
  { item: items.find(i => i.id === 'i2')!, quantity: 2 }
];

export const useGameStore = create<GameState & {
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
}>((set, get) => ({
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

  startGame: (playerName?: string) => {
    const newPlayer: Player = {
      id: 'hunter',
      name: playerName || '猎人',
      role: '猎人',
      maxHp: 40,
      hp: 40,
      attack: 5,
      defense: 3,
      portraitId: 'hunter',
      drivingLevel: 1,
      drivingExp: 0,
      level: 1,
      exp: 0,
      gold: 50
    };
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
      gold: 50,
      playerEquip: { head: undefined, body: undefined, hand: undefined, foot: undefined, weapon: undefined },
      messages: [],
      battle: undefined,
      battleLog: [],
      blueprints: [],
      locations: locations,
      shopItems: [],
      currentDialogId: undefined
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
      gold: 50,
      exp: 0,
      level: 1,
      portraitId: character.portraitId,
      drivingLevel: 1,
      drivingExp: 0
    };
    set({
      player: newPlayer,
      members: [newPlayer],
      gamePhase: 'intro'
    });
  },

  addMessage: (message: string) => {
    set(state => ({
      messages: [...state.messages.slice(-49), { id: Date.now(), text: message }]
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

    const { enemy } = state.battle;
    if (state.battle.useTank) return;
    
    const attackPower = state.player.attack + (state.playerEquip.weapon?.value || 0);
    const damage = Math.max(1, attackPower - enemy.defense + Math.floor(Math.random() * 3));
    const newEnemy = { ...enemy, hp: Math.max(0, enemy.hp - damage) };
    
    get().addBattleMessage(`⚔️ 你对${enemy.name}造成了 ${damage} 点伤害！`);
    
    if (newEnemy.hp <= 0) {
      handleEnemyDefeated(get, set, enemy, state.player);
    } else {
      set({ battle: { ...state.battle, enemy: newEnemy, turn: 'enemy' } });
      setTimeout(() => processEnemyCounterAttack(get, set), 1500);
    }
  },

  mainCannonAttack: () => {
    const state = get();
    if (!state.battle || !state.battle.useTank) return;

    const { enemy } = state.battle;
    const tank = state.tanks[state.currentTankIndex];
    if (!tank.weapon) {
      get().addBattleMessage('⚠️ 没有装备主炮！');
      return;
    }
    if (!tank.mainCannonAmmo || tank.mainCannonAmmo <= 0) {
      get().addBattleMessage('⚠️ 主炮弹药不足！');
      return;
    }

    const attackPower = tank.attack + tank.weapon.value + (state.player.drivingLevel || 1) * 2;
    const damage = Math.max(1, attackPower - enemy.defense + Math.floor(Math.random() * 6));
    const newEnemy = { ...enemy, hp: Math.max(0, enemy.hp - damage) };

    const updatedTanks = [...state.tanks];
    updatedTanks[state.currentTankIndex] = {
      ...tank,
      mainCannonAmmo: tank.mainCannonAmmo - 1
    };

    get().addBattleMessage(`💥 主炮「${tank.weapon.name}」对${enemy.name}造成了 ${damage} 点伤害！`);
    get().addBattleMessage(`📦 主炮弹药剩余: ${tank.mainCannonAmmo - 1}发`);

    if (newEnemy.hp <= 0) {
      handleEnemyDefeated(get, set, enemy, state.player, true);
    } else {
      set({ tanks: updatedTanks, battle: { ...state.battle, enemy: newEnemy, turn: 'enemy' } });
      setTimeout(() => processEnemyCounterAttack(get, set), 1500);
    }
  },

  subCannonAttack: () => {
    const state = get();
    if (!state.battle || !state.battle.useTank) return;

    const { enemy } = state.battle;
    const tank = state.tanks[state.currentTankIndex];
    if (!tank.subWeapon) {
      get().addBattleMessage('⚠️ 没有装备副炮！');
      return;
    }

    const hits = Math.random() < 0.6 ? 2 : 1;
    let totalDamage = 0;
    for (let i = 0; i < hits; i++) {
      const hitDmg = Math.max(1, tank.attack + tank.subWeapon.value + (state.player.drivingLevel || 1) * 2 - enemy.defense + Math.floor(Math.random() * 4));
      totalDamage += hitDmg;
    }

    const newEnemy = { ...enemy, hp: Math.max(0, enemy.hp - totalDamage) };

    get().addBattleMessage(`🔫 副炮「${tank.subWeapon.name}」连续射击 ${hits} 次，共造成 ${totalDamage} 点伤害！`);

    if (newEnemy.hp <= 0) {
      handleEnemyDefeated(get, set, enemy, state.player, true);
    } else {
      set({ battle: { ...state.battle, enemy: newEnemy, turn: 'enemy' } });
      setTimeout(() => processEnemyCounterAttack(get, set), 1500);
    }
  },

  seAttack: () => {
    const state = get();
    if (!state.battle || !state.battle.useTank) return;

    const { enemy } = state.battle;
    const tank = state.tanks[state.currentTankIndex];
    if (!tank.se) {
      get().addBattleMessage('⚠️ 没有装备SE！');
      return;
    }
    if (!tank.seAmmo || tank.seAmmo <= 0) {
      get().addBattleMessage('⚠️ SE弹药不足！');
      return;
    }

    const attackPower = tank.attack + tank.se.value * 2 + (state.player.drivingLevel || 1) * 2;
    const damage = Math.max(1, attackPower - enemy.defense + Math.floor(Math.random() * 10));
    const newEnemy = { ...enemy, hp: Math.max(0, enemy.hp - damage) };

    const updatedTanks = [...state.tanks];
    updatedTanks[state.currentTankIndex] = {
      ...tank,
      seAmmo: tank.seAmmo - 1
    };

    get().addBattleMessage(`💣 SE「${tank.se.name}」对${enemy.name}造成了 ${damage} 点伤害！`);
    get().addBattleMessage(`📦 SE弹药剩余: ${tank.seAmmo - 1}发`);

    if (newEnemy.hp <= 0) {
      handleEnemyDefeated(get, set, enemy, state.player, true);
    } else {
      set({ tanks: updatedTanks, battle: { ...state.battle, enemy: newEnemy, turn: 'enemy' } });
      setTimeout(() => processEnemyCounterAttack(get, set), 1500);
    }
  },

  defend: () => {
    const state = get();
    if (!state.battle) return;

    const { enemy } = state.battle;
    get().addBattleMessage(`🛡️ ${state.player.name}进入防御姿态！`);

    const useTank = state.battle.useTank;
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
    defensePower = Math.floor(defensePower * 1.5);

    if (enemy.hp > 0) {
      const enemyDamage = Math.max(1, enemy.attack - defensePower);
      get().addBattleMessage(`💥 ${enemy.name}的攻击造成了 ${enemyDamage} 点伤害！（防御减半）`);
      
      if (useTank) {
        const tank = { ...state.tanks[state.currentTankIndex] };
        tank.armor = Math.max(0, tank.armor - enemyDamage);
        const newTanks = [...state.tanks];
        newTanks[state.currentTankIndex] = tank;
        
        let newBattleState = { ...state.battle, turn: 'enemy' };
        
        if (tank.armor <= 0) {
          get().addBattleMessage('⚠️ 战车装甲被击毁了！');
          newBattleState = { ...newBattleState, useTank: false };
        }
        
        set({ tanks: newTanks, battle: newBattleState });
      } else {
        const newHp = Math.max(0, state.player.hp - enemyDamage);
        
        if (newHp <= 0) {
          get().addBattleMessage(`💀 ${state.player.name}被击败了...`);
          set({ 
            player: { ...state.player, hp: 0 },
            gamePhase: 'explore', 
            battle: undefined, 
            battleLog: [] 
          });
          return;
        }
        
        set({
          player: { ...state.player, hp: newHp },
          battle: { ...state.battle, turn: 'enemy' }
        });
      }
      
      setTimeout(() => processEnemyCounterAttack(get, set), 1500);
    }
  },

  useItem: (item: Item) => {
    const state = get();
    
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
          setTimeout(() => processEnemyCounterAttack(get, set), 1500);
        } else {
          get().addMessage(`💊 使用了${item.name}，恢复了 ${item.value} HP！`);
        }
      } else if (item.id === 'i2' || item.id === 'i3' || item.id === 'i4') {
        // 投掷物
        if (isInBattle && state.battle) {
          const currentEnemy = state.battle.enemy;
          const damage = Math.max(1, item.value - currentEnemy.defense);
          const newEnemyHp = Math.max(0, currentEnemy.hp - damage);
          
          // 一次性更新所有状态
          set({
            battle: { ...state.battle, enemy: { ...currentEnemy, hp: newEnemyHp }, turn: 'enemy' },
            inventory: state.inventory.map(i => 
              i.item.id === item.id ? { ...i, quantity: i.quantity - 1 } : i
            ).filter(i => i.quantity > 0)
          });
          
          get().addBattleMessage(`💣 使用了${item.name}，对${currentEnemy.name}造成了 ${damage} 点伤害！`);
          
          if (newEnemyHp <= 0) {
            handleEnemyDefeated(get, set, currentEnemy, state.player, state.battle.useTank);
            return;
          }
          
          setTimeout(() => processEnemyCounterAttack(get, set), 1500);
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
          setTimeout(() => processEnemyCounterAttack(get, set), 1500);
        } else {
          get().addMessage(`🔧 使用了${item.name}，恢复了 ${item.value} 装甲！`);
        }
      } else if (item.id === 'i7') {
        // 军号 - 攻击力提升
        if (isInBattle) {
          get().addBattleMessage(`📯 使用了${item.name}，攻击力提升！`);
          // 战斗中使用后轮到敌人
          set({ battle: { ...state.battle!, turn: 'enemy' } });
          setTimeout(() => processEnemyCounterAttack(get, set), 1500);
        }
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
          setTimeout(() => processEnemyCounterAttack(get, set), 1500);
        } else {
          get().addMessage(`使用了${item.name}！`);
        }
      }
    }
  },

  flee: () => {
    const state = get();
    if (!state.battle) return;

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
      setTimeout(() => processEnemyCounterAttack(get, set), 1500);
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
    if (state.gold < 50) {
      get().addMessage('治疗费用50金币，你没有足够的金币！');
      return;
    }
    set({
      gold: state.gold - 50,
      player: { ...state.player, hp: state.player.maxHp }
    });
    get().addMessage('付了50金币，HP全部恢复了！');
  },

  repairAllTanks: () => {
    const state = get();
    const repairCost = state.tanks.reduce((sum, tank) => sum + (tank.maxArmor - tank.armor), 0);
    
    if (state.gold < repairCost) {
      get().addMessage(`修理全部战车需要${repairCost}金币，你的金币不足！`);
      return;
    }
    
    set({
      gold: state.gold - repairCost,
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
      gold: 0,
      exp: 0,
      role: character.role,
      portraitId: character.portraitId,
      drivingLevel: 1,
      drivingExp: 0
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
      gold: state.gold,
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
        gold: data.gold,
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
      gold: 50,
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
      warehouseItems: []
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
    if (state.gold < cost) {
      get().addMessage(`复活${member.name}需要${cost}金币，你没有足够的金币！`);
      return;
    }

    set({
      gold: state.gold - cost,
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
      gold: state.gold + bounty,
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
  }
}));
