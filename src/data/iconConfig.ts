// 图标配置 - 统一管理游戏内所有图标
// 所有图片统一存放在 /public/icons/ 目录，与新角色头像风格一致

const iconPath = '/icons';

export const iconMap: Record<string, string> = {
  // 建筑图标
  bar: `${iconPath}/bar.jpg`,
  inn: `${iconPath}/inn.jpg`,
  shop_human: `${iconPath}/shop.jpg`,
  shop_tank: `${iconPath}/shop.jpg`,
  hospital: `${iconPath}/hospital.jpg`,
  office: `${iconPath}/office.jpg`,
  warehouse: `${iconPath}/warehouse.jpg`,
  house: `${iconPath}/inn.jpg`,
  home: `${iconPath}/inn.jpg`,
  workshop: `${iconPath}/workshop.jpg`,
  garage: `${iconPath}/garage.jpg`,
  factory: `${iconPath}/factory.jpg`,
  timeMachine: `${iconPath}/menu.jpg`,
  lab: `${iconPath}/workshop.jpg`,
  crafting: `${iconPath}/workshop.jpg`,

  // 菜单图标
  menu: `${iconPath}/menu.jpg`,
  status: `${iconPath}/status.jpg`,
  inventory: `${iconPath}/inventory.jpg`,
  items: `${iconPath}/inventory.jpg`,
  tank: `${iconPath}/tank.jpg`,
  equip: `${iconPath}/equip.jpg`,
  save: `${iconPath}/save.jpg`,
  quest: `${iconPath}/quest.jpg`,
  ride: `${iconPath}/tank.jpg`,

  // 阶段图标
  battle: `${iconPath}/equip.jpg`,
  explore: `${iconPath}/menu.jpg`,
  shop: `${iconPath}/shop.jpg`,
  building: `${iconPath}/bar.jpg`,

  // 战斗动作
  attack: `${iconPath}/equip.jpg`,
  defend: `${iconPath}/status.jpg`,
  flee: `${iconPath}/menu.jpg`,
};

export function getIconUrl(iconId: string): string {
  return iconMap[iconId] || '';
}

// 建筑类型 → 图标ID映射
export const buildingTypeIconMap: Record<string, string> = {
  bar: 'bar',
  inn: 'inn',
  shop_human: 'shop_human',
  shop_tank: 'shop_tank',
  hospital: 'hospital',
  office: 'office',
  warehouse: 'warehouse',
  house: 'house',
  home: 'home',
  workshop: 'workshop',
  garage: 'garage',
  factory: 'factory',
  timeMachine: 'timeMachine',
  lab: 'workshop',
  crafting: 'crafting',
};
