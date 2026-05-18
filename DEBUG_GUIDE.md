# 游戏调试指南

## 游戏流程
1. **TitleScreen** (title 阶段) -> 点击"开始游戏" -> 显示 NameInput
2. **NameInput** -> 确认 -> 调用 `startGame(name)`
3. **startGame** -> 初始化状态，设置 gamePhase = 'intro'
4. **IntroScene** -> 逐页对话 -> 最后一页调用 `completeIntro()`
5. **completeIntro** -> 设置 gamePhase = 'explore'
6. **ExploreScreen** -> 探索、战斗、商店等

## 已发现的问题

### 问题1：状态访问方式低效
几乎所有组件都直接解构整个 useGameStore：
```tsx
// ❌ 低效：任何状态变化都会触发重渲染
const { ...很多字段... } = useGameStore();
```

应该使用选择器函数：
```tsx
// ✅ 高效：只在所选状态变化时重渲染
const gamePhase = useGameStore(s => s.gamePhase);
```

### 问题2：可能的无限循环或阻塞

让我逐个修复这些问题！
