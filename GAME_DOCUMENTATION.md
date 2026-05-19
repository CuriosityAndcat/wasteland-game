# 废土战歌 - 游戏完整技术文档

## 📖 目录

1. [游戏概述](#游戏概述)
2. [技术栈](#技术栈)
3. [文件结构](#文件结构)
4. [核心数据类型](#核心数据类型)
5. [游戏系统](#游戏系统)
6. [UI组件](#ui组件)
7. [状态管理](#状态管理)
8. [游戏流程](#游戏流程)
9. [开发指南](#开发指南)

---

## 🎮 游戏概述

**废土战歌**是一款基于经典游戏"重装机兵"(Metal Max)风格开发的Web文字冒险游戏。玩家将在一个被破坏的后末日世界中扮演一名猎人，开始探索世界、收集战车、击败怪物、成为超级勇士的冒险之旅。

### 游戏特色

- ✅ 完整的角色成长系统（等级、技能、装备）
- ✅ 战车收集与改装系统
- ✅ 回合制战斗系统
- ✅ 城镇探索与建筑互动
- ✅ 主线与支线任务系统
- ✅ 战斗特效动画系统
- ✅ 存档/读档功能
- ✅ 多同伴系统

---

## 💻 技术栈

- **前端框架**: React 18.2.0
- **构建工具**: Vite 5.0.0
- **语言**: TypeScript 5.2.2
- **状态管理**: Zustand 4.4.7
- **样式**: Tailwind CSS 3.4.0
- **包管理**: npm

---

## 📁 文件结构

```
/workspace/
├── src/
│   ├── components/          # React 组件
│   │   ├── AvatarSelector.tsx    # 头像选择器
│   │   ├── BattleEffect.tsx      # 战斗特效组件
│   │   ├── BattleScreen.tsx      # 战斗界面
│   │   ├── BuildingScreen.tsx    # 建筑内部界面
│   │   ├── CraftingScreen.tsx    # 制造工坊界面
│   │   ├── ExploreScreen.tsx     # 探索界面
│   │   ├── IntroScene.tsx        # 开场动画
│   │   ├── InventoryScreen.tsx   # 背包界面
│   │   ├── MenuScreen.tsx        # 菜单界面
│   │   ├── MessageLog.tsx        # 消息日志
│   │   ├── NameInput.tsx         # 名称输入
│   │   ├── Portrait.tsx          # 头像组件
│   │   ├── QuestPanel.tsx        # 任务面板
│   │   ├── ShopScreen.tsx        # 商店界面
│   │   ├── StatusPanel.tsx       # 状态面板
│   │   └── TitleScreen.tsx       # 标题画面
│   │
│   ├── data/               # 游戏数据
│   │   ├── dialogs.ts      # 对话数据
│   │   ├── gameData.ts      # 游戏数据（敌人、物品、地点等）
│   │   ├── portraitConfig.ts # 头像配置
│   │   └── quests.ts        # 任务数据
│   │
│   ├── hooks/              # 自定义Hooks
│   │   └── useTheme.ts     # 主题Hook
│   │
│   ├── lib/                # 工具函数
│   │   └── utils.ts        # 通用工具函数
│   │
│   ├── pages/              # 页面组件
│   │   └── Home.tsx        # 主页面
│   │
│   ├── store/              # 状态管理
│   │   └── useGameStore.ts # Zustand 游戏状态管理
│   │
│   ├── App.tsx             # 根组件
│   ├── index.css           # 全局样式
│   ├── main.tsx            # 入口文件
│   └── types.ts            # TypeScript 类型定义
│
├── public/                 # 静态资源
├── package.json           # 项目配置
├── tsconfig.json          # TypeScript 配置
├── tailwind.config.js     # Tailwind CSS 配置
└── vite.config.ts         # Vite 配置
```

---

## 📊 核心数据类型

### 1. 玩家 (Player)

```typescript
interface Player {
  id: string;              // 唯一标识
  name: string;           // 名称
  level: number;          // 等级
  hp: number;             // 当前HP
  maxHp: number;          // 最大HP
  attack: number;         // 攻击力
  defense: number;        // 防御力
  gold: number;           // 金币
  exp: number;            // 经验值
  role: '猎人' | '机械师' | '格斗家';  // 职业
  portraitId?: string;    // 头像ID
  drivingLevel: number;   // 驾驶等级
  drivingExp: number;      // 驾驶经验
}
```

### 2. 战车 (Tank)

```typescript
interface Tank {
  id: string;              // 唯一标识
  name: string;            // 名称
  armor: number;          // 当前装甲
  maxArmor: number;       // 最大装甲
  attack: number;         // 基础攻击力
  defense: number;        // 基础防御力
  weapon?: Item;           // 主炮
  subWeapon?: Item;        // 副炮
  engine?: Item;          // 引擎
  cDevice?: Item;         // C装置
  se?: Item;              // SE特殊装备
  mainCannonAmmo?: number; // 主炮弹药
  seAmmo?: number;         // SE弹药
  isRented?: boolean;     // 是否租用
}
```

### 3. 物品 (Item)

```typescript
interface Item {
  id: string;              // 唯一标识
  name: string;           // 名称
  type: 'weapon' | 'subWeapon' | 'engine' | 'cDevice' | 'se' |
         'consumable' | 'armor' | 'head' | 'hand' | 'foot' |
         'body' | 'humanWeapon' | 'blueprint';
  value: number;          // 数值（攻击力或防御力）
  description: string;    // 描述
  price: number;          // 价格
  weight?: number;        // 重量
  ammo?: number;           // 弹药数
}
```

### 4. 任务 (Quest)

```typescript
interface Quest {
  id: string;              // 唯一标识
  name: string;            // 任务名称
  description: string;     // 任务描述
  type: 'main' | 'side';   // 任务类型
  objectives: QuestObjective[];  // 目标列表
  rewards: QuestReward;    // 奖励
  prerequisiteQuestId?: string; // 前置任务ID
  location?: string;       // 任务地点
  npcGiver?: string;       // 发布NPC
}

interface QuestObjective {
  id: string;
  description: string;     // 目标描述
  target?: string;         // 目标对象
  targetCount?: number;    // 目标数量
  currentCount?: number;   // 当前进度
  location?: string;       // 地点
  completed?: boolean;     // 是否完成
}

interface QuestReward {
  gold?: number;           // 金币奖励
  exp?: number;            // 经验奖励
  items?: Item[];          // 物品奖励
  reputation?: number;     // 声望奖励
}
```

### 5. 敌人 (Enemy)

```typescript
interface Enemy {
  id: string;              // 唯一标识
  name: string;            // 名称
  hp: number;              // HP
  maxHp: number;           // 最大HP
  attack: number;          // 攻击力
  defense: number;         // 防御力
  exp: number;             // 经验值
  gold: number;            // 金币
  type: 'normal' | 'boss' | 'elite';
  specialAbilities?: string[];  // 特殊能力
}
```

### 6. 地点 (Location)

```typescript
interface Location {
  id: string;              // 唯一标识
  name: string;            // 名称
  description: string;     // 描述
  type: 'town' | 'explore' | 'cave' | 'dungeon';
  connections: {
    locationId: string;    // 目标地点ID
    direction: string;     // 方向描述
    requirement?: string;  // 进入条件
  }[];
  parentTownId?: string;   // 所属城镇
  enemyChance: number;      // 遇敌概率
  treasureChance: number;  // 宝箱概率
  eventChance: number;     // 事件概率
  buildings?: Building[];  // 建筑列表
}

interface Building {
  id: string;
  name: string;
  type: 'bar' | 'inn' | 'shop_human' | 'shop_tank' |
        'hospital' | 'office' | 'warehouse' | 'house' |
        'home' | 'workshop';
  description: string;
  icon: string;
  itemIds?: string[];      // 可购买物品ID
}
```

---

## 🎯 游戏系统

### 1. 角色系统

#### 1.1 角色属性
- **HP (生命值)**: 角色生命，降至0时昏迷
- **MP (内力)**: 使用特殊技能
- **攻击**: 造成伤害的基础值
- **防御**: 减少受到的伤害
- **等级**: 通过战斗和任务提升
- **经验值**: 升级所需，通过战斗获得

#### 1.2 角色职业
- **猎人**: 平衡型角色
- **机械师**: 战车相关技能加成
- **格斗家**: 近战战斗加成

#### 1.3 装备系统
- **武器**: 增加攻击力
- **头部防具**: 增加防御力
- **身体防具**: 增加防御力
- **手部防具**: 增加防御力
- **脚部防具**: 增加防御力

#### 1.4 驾驶技能
- **驾驶等级**: 影响战车性能加成
- **驾驶经验**: 升级所需，通过战斗获得

---

### 2. 战车系统

#### 2.1 战车组成
- **主炮**: 主要攻击武器，有弹药限制
- **副炮**: 辅助攻击武器
- **引擎**: 增加防御力
- **C装置**: 增加防御力和命中
- **SE**: 特殊装备，消耗弹药

#### 2.2 战车属性
- **装甲值**: 战车生命值，消耗后需修复
- **攻击力**: 战车输出伤害
- **防御力**: 战车减伤能力
- **速度**: 影响行动顺序

#### 2.3 战车操作
- **乘車**: 进入战车，战斗中使用战车
- **降車**: 离开战车，徒步战斗

---

### 3. 战斗系统

#### 3.1 战斗类型
- **徒步战斗**: 角色直接攻击
- **战车战斗**: 使用战车攻击

#### 3.2 战斗指令
- **攻击**: 普通攻击
- **防御**: 减少50%伤害
- **道具**: 使用背包物品
- **撤退**: 尝试逃离战斗

#### 3.3 战车特殊指令
- **主炮攻击**: 高伤害，消耗弹药
- **副炮攻击**: 中等伤害
- **SE攻击**: 特殊效果攻击

#### 3.4 战斗流程
1. 战斗开始
2. 计算行动顺序
3. 玩家选择指令
4. 执行动作并显示特效
5. 敌人行动
6. 检查战斗结果
7. 循环或结束战斗

#### 3.5 战斗特效
支持6种战斗特效动画：
- **斩击 (slash)**: 近战武器攻击
- **射击 (shoot)**: 远程武器攻击
- **火焰 (fire)**: 火系攻击
- **爆炸 (explosion)**: 大威力攻击
- **命中 (hit)**: 击中效果
- **闪避 (miss)**: 躲避效果

---

### 4. 任务系统

#### 4.1 任务类型
- **主线任务**: 推进游戏剧情
- **支线任务**: 额外挑战和奖励

#### 4.2 任务目标
- **击杀目标**: 击败指定敌人
- **地点探索**: 到达指定地点
- **物品收集**: 收集指定物品
- **对话任务**: 与NPC对话

#### 4.3 任务奖励
- **经验值**: 提升角色等级
- **金币**: 游戏货币
- **物品**: 道具和装备
- **声望**: 特殊奖励

---

### 5. 城镇系统

#### 5.1 建筑类型
- **酒吧**: 与NPC对话，获取情报
- **旅馆**: 付费休息，恢复HP
- **人类装备店**: 购买武器和防具
- **战车装备店**: 购买战车零件和修复
- **诊所**: 复活死亡的同伴
- **赏金大厅**: 查看和领取悬赏
- **保管处**: 存储物品
- **居民房**: 与居民对话
- **制造工坊**: 制造装备

#### 5.2 城镇探索
- 查看城镇建筑列表
- 进入各类建筑
- 与NPC互动
- 接受任务

---

### 6. 背包系统

#### 6.1 物品分类
- **消耗品**: 使用后消耗
- **武器**: 增加攻击力
- **防具**: 增加防御力
- **蓝图**: 制造配方

#### 6.2 背包操作
- **使用**: 消耗品直接使用
- **装备**: 武器和防具装备
- **出售**: 卖给商店获得金币
- **整理**: 分类查看物品

---

## 🧩 UI组件

### 1. 标题画面 (TitleScreen)
- 游戏标题显示
- 新游戏/继续游戏/选项按钮
- 背景动画效果

### 2. 开场动画 (IntroScene)
- 剧情对话展示
- 自动播放和手动切换
- 人物头像显示

### 3. 主界面 (Home)
- 游戏主视图容器
- 根据游戏阶段切换不同界面
- 响应式布局

### 4. 探索界面 (ExploreScreen)
- 当前地点信息
- 建筑列表显示
- 探索按钮
- 随机事件触发

### 5. 战斗界面 (BattleScreen)
- 敌人信息显示
- 战斗指令按钮
- 战斗特效显示
- 战斗日志

### 6. 商店界面 (ShopScreen)
- 商品分类展示
- 购买/出售切换
- 商品详情显示
- 金币余额

### 7. 建筑界面 (BuildingScreen)
- 建筑内部场景
- NPC对话系统
- 建筑特定功能
- 离开按钮

### 8. 菜单界面 (MenuScreen)
- 角色状态显示
- 背包管理
- 战车管理
- 装备管理
- 存档功能

### 9. 任务面板 (QuestPanel)
- 任务列表展示
- 任务进度追踪
- 任务分类筛选
- 奖励预览

### 10. 状态面板 (StatusPanel)
- 角色基础属性
- 装备状态
- 战斗状态指示

### 11. 消息日志 (MessageLog)
- 游戏消息显示
- 最多显示20条
- 自动滚动

### 12. 战斗特效 (BattleEffect)
- SVG动画特效
- 6种特效类型
- 位置控制
- 自动清除

---

## 🔧 状态管理

使用 Zustand 进行状态管理，主要状态结构：

```typescript
interface GameState {
  // 游戏进度
  player: Player;
  members: Player[];              // 同伴列表
  tanks: Tank[];                 // 战车列表
  gold: number;                  // 金币
  inventory: InventoryItem[];    // 背包
  storage: InventoryItem[];      // 仓库
  playerEquip: PlayerEquipment;   // 角色装备
  
  // 游戏阶段
  gamePhase: 'title' | 'intro' | 'explore' | 'battle' | 
             'menu' | 'shop' | 'building' | 'crafting';
  
  // 位置
  currentLocationId: string;
  currentBuilding?: Building;
  isOnTank: boolean;
  tankLocation?: string;
  
  // 战斗
  battle?: BattleState;
  
  // 任务
  quests: {
    available: Quest[];
    inProgress: Quest[];
    completed: Quest[];
  };
  currentQuestId?: string;
  
  // 进度
  defeatedBosses: string[];
  storyFlags: StoryFlags;
  messages: string[];
  blueprints: string[];
}
```

### 核心方法

#### 玩家操作
- `startGame()`: 开始新游戏
- `resetGame()`: 重置游戏
- `saveGame()`: 保存游戏
- `loadGame()`: 加载游戏

#### 战斗操作
- `startBattle()`: 开始战斗
- `attack()`: 普通攻击
- `defend()`: 防御
- `useItem()`: 使用道具
- `flee()`: 撤退
- `triggerEffect()`: 触发战斗特效

#### 任务操作
- `addQuest()`: 接受任务
- `updateQuestObjective()`: 更新任务进度
- `completeQuest()`: 完成任务

#### 物品操作
- `buyItem()`: 购买物品
- `sellItem()`: 出售物品
- `equipItem()`: 装备物品
- `unequipItem()`: 卸下装备
- `useItem()`: 使用物品

#### 战车操作
- `addTank()`: 获得战车
- `repairTank()`: 修复战车
- `toggleRideTank()`: 乘降战车
- `switchTank()`: 切换战车

---

## 🎮 游戏流程

### 1. 标题画面
```
启动游戏 → 标题画面 → [新游戏/继续游戏]
```

### 2. 新游戏流程
```
开场动画 → 介绍剧情 → 进入游戏
```

### 3. 探索流程
```
城镇/野外 → 查看建筑 → 进入建筑 → 互动 → 离开
         ↓
      随机遇敌 → 战斗
         ↓
      战斗胜利 → 获得奖励 → 返回探索
         ↓
      战斗失败 → 结束游戏
```

### 4. 战斗流程
```
进入战斗 → 显示敌人 → 玩家选择指令 → 执行并显示特效
        ↓
      敌人行动 → 检查结果
        ↓
      继续战斗 ← → 战斗结束
```

### 5. 任务流程
```
接取任务 → 查看目标 → 执行任务 → 完成任务 → 领取奖励
```

---

## 🛠️ 开发指南

### 运行游戏

```bash
# 安装依赖
npm install

# 开发模式运行
npm run dev

# 生产构建
npm run build
```

### 添加新敌人

在 `src/data/gameData.ts` 中添加：

```typescript
export const enemies: Enemy[] = [
  // 现有敌人...
  {
    id: 'new_enemy',
    name: '新敌人',
    hp: 100,
    maxHp: 100,
    attack: 20,
    defense: 10,
    exp: 50,
    gold: 30,
    type: 'normal'
  }
];
```

### 添加新物品

在 `src/data/gameData.ts` 中添加：

```typescript
export const items: Item[] = [
  // 现有物品...
  {
    id: 'new_item',
    name: '新物品',
    type: 'consumable',
    value: 30,
    description: '恢复30点HP',
    price: 20
  }
];
```

### 添加新任务

在 `src/data/quests.ts` 中添加：

```typescript
export const quests: Quest[] = [
  // 现有任务...
  {
    id: 'new_quest',
    name: '新任务',
    description: '任务描述',
    type: 'main',
    objectives: [
      {
        id: 'obj_1',
        description: '目标描述',
        location: 'location_id'
      }
    ],
    rewards: {
      exp: 100,
      gold: 50
    }
  }
];
```

### 添加新地点

在 `src/data/gameData.ts` 中添加：

```typescript
export const locations: Location[] = [
  // 现有地点...
  {
    id: 'new_location',
    name: '新地点',
    description: '地点描述',
    type: 'explore',
    connections: [
      { locationId: 'existing_location', direction: '返回' }
    ],
    enemyChance: 0.2,
    treasureChance: 0.1,
    eventChance: 0.05
  }
];
```

---

## 🎨 Tailwind CSS 类名约定

### 颜色系统
- **背景**: `bg-gray-900`, `bg-gray-800`
- **文字**: `text-white`, `text-gray-400`, `text-yellow-400`
- **强调**: `text-yellow-400`, `text-red-400`, `text-green-400`
- **边框**: `border-gray-600`, `border-yellow-500`

### 布局
- **容器**: `max-w-2xl mx-auto p-4`
- **卡片**: `bg-gray-800 rounded-lg p-4`
- **间距**: `space-y-3`, `gap-2`, `mt-2`, `mb-4`

### 交互
- **按钮**: `px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded`
- **禁用**: `opacity-50 cursor-not-allowed`
- **焦点**: `focus:outline-none focus:ring-2`

---

## 📝 注意事项

### 1. 状态管理
- 使用 Zustand 进行状态管理
- 避免直接修改 state
- 使用 set() 方法更新状态

### 2. 性能优化
- 使用 `React.memo()` 包装组件
- 避免不必要的重渲染
- 合理使用 useCallback 和 useMemo

### 3. 类型安全
- 所有组件使用 TypeScript
- 定义清晰的接口
- 避免使用 any 类型

### 4. 响应式设计
- 使用 Tailwind CSS 响应式类
- 移动优先设计
- 适配不同屏幕尺寸

---

## 🔗 相关资源

- [React 官方文档](https://react.dev)
- [Zustand 文档](https://zustand.docs.pmnd.rs)
- [Tailwind CSS 文档](https://tailwindcss.com)
- [TypeScript 文档](https://www.typescriptlang.org)
- [Vite 文档](https://vitejs.dev)

---

## 📄 许可证

本项目仅供学习和参考使用。

---

## 👥 联系方式

如有问题或建议，请通过游戏内反馈系统提交。

---

**最后更新**: 2026年5月19日
**版本**: 1.0.0
