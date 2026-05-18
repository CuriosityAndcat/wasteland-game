## 1. Architecture Design
纯前端应用，使用React + TypeScript + Vite构建，状态管理使用Zustand。

```mermaid
flowchart LR
    subgraph Frontend
        A[React Components] --> B[Zustand Store]
        B --> C[Game Logic]
        C --> D[UI Rendering]
    end
```

## 2. Technology Description
- Frontend: React@18 + TypeScript + Vite + Tailwind CSS
- State Management: Zustand
- Initialization Tool: vite-init
- Backend: None (纯前端应用)
- Database: LocalStorage (用于存档)

## 3. Route Definitions
| Route | Purpose |
|-------|---------|
| / | 游戏主界面 |

## 4. Data Model

### 4.1 Data Model Definition
```mermaid
erDiagram
    PLAYER {
        string id
        string name
        int level
        int hp
        int maxHp
        int attack
        int defense
        int gold
        int exp
    }
    
    TANK {
        string id
        string name
        int armor
        int maxArmor
        int attack
        int defense
        string weaponId
        string engineId
    }
    
    ITEM {
        string id
        string name
        string type
        int value
        string description
        int price
    }
    
    ENEMY {
        string id
        string name
        int hp
        int attack
        int defense
        int expReward
        int goldReward
    }
    
    INVENTORY {
        string id
        string itemId
        int quantity
    }
    
    PLAYER ||--o{ INVENTORY : has
    TANK ||--o{ ITEM : equipped
```

### 4.2 Type Definitions
```typescript
interface Player {
  id: string;
  name: string;
  level: number;
  hp: number;
  maxHp: number;
  attack: number;
  defense: number;
  gold: number;
  exp: number;
}

interface Tank {
  id: string;
  name: string;
  armor: number;
  maxArmor: number;
  attack: number;
  defense: number;
  weapon?: Item;
  engine?: Item;
}

interface Item {
  id: string;
  name: string;
  type: 'weapon' | 'engine' | 'consumable' | 'armor';
  value: number;
  description: string;
  price: number;
}

interface Enemy {
  id: string;
  name: string;
  hp: number;
  maxHp: number;
  attack: number;
  defense: number;
  expReward: number;
  goldReward: number;
}

interface InventoryItem {
  item: Item;
  quantity: number;
}

interface GameState {
  player: Player;
  tank: Tank;
  inventory: InventoryItem[];
  currentLocation: string;
  gamePhase: 'explore' | 'battle' | 'shop' | 'inventory';
  battle?: {
    enemy: Enemy;
    turn: 'player' | 'enemy';
  };
  messageLog: string[];
}
```
