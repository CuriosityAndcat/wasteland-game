import React, { useState } from 'react';
import { useGameStore } from '../store/useGameStore';
import { Item } from '../types';

const InventoryScreen: React.FC = () => {
  const { inventory, closeInventory, equipItem, useItem, tanks, currentTankIndex } = useGameStore();
  const [activeCategory, setActiveCategory] = useState<string>('all');
  
  const hasTank = tanks.length > 0;
  const tankItemTypes = ['weapon', 'engine', 'cDevice', 'se'];
  
  const categories = [
    { id: 'all', name: '全部' },
    { id: 'consumable', name: '消耗品' },
    { id: 'humanWeapon', name: '武器' },
    ...(hasTank ? [
      { id: 'weapon', name: '战车武器' },
      { id: 'engine', name: '引擎' },
      { id: 'cDevice', name: 'C装置' },
      { id: 'se', name: '特殊装备' }
    ] : []),
    { id: 'head', name: '头部装备' },
    { id: 'body', name: '身体装备' },
    { id: 'hand', name: '手部装备' },
    { id: 'foot', name: '脚部装备' }
  ];
  
  const filteredItems = activeCategory === 'all' 
    ? hasTank 
      ? inventory 
      : inventory.filter(item => !tankItemTypes.includes(item.item.type))
    : inventory.filter(item => item.item.type === activeCategory);

  const getItemTypeColor = (item: Item): string => {
    switch(item.type) {
      case 'consumable': return 'bg-green-700 hover:bg-green-600';
      case 'humanWeapon': return 'bg-indigo-700 hover:bg-indigo-600';
      case 'weapon': return 'bg-red-700 hover:bg-red-600';
      case 'engine': return 'bg-blue-700 hover:bg-blue-600';
      case 'cDevice': return 'bg-purple-700 hover:bg-purple-600';
      case 'se': return 'bg-orange-700 hover:bg-orange-600';
      case 'head': return 'bg-cyan-700 hover:bg-cyan-600';
      case 'body': return 'bg-teal-700 hover:bg-teal-600';
      case 'hand': return 'bg-yellow-700 hover:bg-yellow-600';
      case 'foot': return 'bg-pink-700 hover:bg-pink-600';
      default: return 'bg-gray-700 hover:bg-gray-600';
    }
  };

  const handleItemClick = (item: Item) => {
    if (item.type === 'consumable') {
      useItem(item);
    } else {
      equipItem(item);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80">
      <div className="bg-gray-900 border-2 border-orange-500 rounded-xl shadow-2xl w-full max-w-lg mx-4 max-h-[85vh] flex flex-col overflow-hidden">
        <div className="bg-gray-800 px-4 py-2.5 border-b border-orange-500/50 flex items-center justify-between flex-shrink-0">
          <h2 className="text-orange-400 font-bold text-sm">🎒 背包</h2>
          <button
            onClick={closeInventory}
            className="text-gray-400 hover:text-white text-lg leading-none px-1"
          >
            ✕
          </button>
        </div>
        
        {tanks.length > 0 && (
          <div className="px-4 py-2 bg-blue-900/30 border-b border-blue-800/50 flex-shrink-0">
            <p className="text-blue-300 text-xs">当前战车: {tanks[currentTankIndex]?.name}</p>
          </div>
        )}
        
        <div className="px-4 py-2 flex-shrink-0">
          <div className="flex flex-wrap gap-1.5">
            {categories.map(category => (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`px-2.5 py-1 rounded-full text-xs font-medium transition-all ${
                  activeCategory === category.id 
                    ? 'bg-orange-600 text-white' 
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4 pt-0">
          {filteredItems.length === 0 ? (
            <div className="text-center py-8 text-gray-400 text-sm">
              背包中没有这个类别的物品
            </div>
          ) : (
            <div className="space-y-1.5">
              {filteredItems.map((invItem, index) => (
                <div 
                  key={`${invItem.item.id}-${index}`}
                  className="bg-gray-800 rounded-lg p-3 border border-gray-700 flex items-center justify-between"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white text-sm">{invItem.item.name}</span>
                      <span className="text-yellow-400 text-xs font-medium">x{invItem.quantity}</span>
                    </div>
                    <p className="text-xs text-gray-400 truncate">{invItem.item.description}</p>
                  </div>
                  <button
                    onClick={() => handleItemClick(invItem.item)}
                    className={`flex-shrink-0 ml-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all text-white ${getItemTypeColor(invItem.item)}`}
                  >
                    {invItem.item.type === 'consumable' ? '使用' : '装备'}
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default React.memo(InventoryScreen);
