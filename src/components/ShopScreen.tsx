import React, { useState } from 'react';
import { useGameStore } from '../store/useGameStore';
import { Item } from '../types';

const ShopScreen: React.FC = () => {
  const { shopItems, player, buyItem, sellItem, closeShop, tanks, shopType, inventory } = useGameStore();
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [mode, setMode] = useState<'buy' | 'sell'>('buy');

  const isHumanShop = shopType === 'human' || !shopType;

  const humanItemTypes = ['consumable', 'humanWeapon', 'head', 'body', 'hand', 'foot'];
  const tankItemTypes = ['weapon', 'engine', 'cDevice', 'se'];

  const categories = isHumanShop ? [
    { id: 'all', name: '全部' },
    { id: 'consumable', name: '消耗品' },
    { id: 'humanWeapon', name: '武器' },
    { id: 'head', name: '头部' },
    { id: 'body', name: '身体' },
    { id: 'hand', name: '手部' },
    { id: 'foot', name: '脚部' }
  ] : [
    { id: 'all', name: '全部' },
    { id: 'weapon', name: '战车武器' },
    { id: 'engine', name: '引擎' },
    { id: 'cDevice', name: 'C装置' },
    { id: 'se', name: '特殊装备' }
  ];

  const currentItemTypes = isHumanShop ? humanItemTypes : tankItemTypes;

  const filteredItems = mode === 'buy'
    ? (activeCategory === 'all'
        ? shopItems.filter(item => currentItemTypes.includes(item.type))
        : shopItems.filter(item => item.type === activeCategory))
    : (activeCategory === 'all'
        ? inventory
        : inventory.filter(inv => inv.item.type === activeCategory));

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

  return (
    <div className="bg-gray-800 border border-purple-600 rounded-lg overflow-hidden">
      <div className="bg-gray-750 px-3 py-2 border-b border-gray-700 flex justify-between items-center">
        <h2 className={`font-bold text-sm ${isHumanShop ? 'text-purple-400' : 'text-blue-400'}`}>
          {isHumanShop ? '⚔️ 人类装备店' : '🛞 战车装备店'}
        </h2>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setMode(mode === 'buy' ? 'sell' : 'buy')}
            className={`px-2.5 py-1 rounded text-xs font-medium transition-all ${
              mode === 'sell'
                ? 'bg-orange-600 text-white'
                : 'bg-gray-600 hover:bg-gray-500 text-white'
            }`}
          >
            {mode === 'buy' ? '💰 出售' : '🛒 购买'}
          </button>
          <button
            onClick={closeShop}
            className="bg-gray-600 hover:bg-gray-500 text-white px-3 py-1 rounded text-xs font-medium"
          >
            返回
          </button>
        </div>
      </div>

      <div className="p-3 space-y-3">
        <div className="flex flex-wrap gap-1.5">
          {categories.map(category => (
            <button
              key={category.id}
              onClick={() => setActiveCategory(category.id)}
              className={`px-2.5 py-1 rounded text-xs font-medium transition-all ${
                activeCategory === category.id
                  ? 'bg-purple-600 text-white'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              {category.name}
            </button>
          ))}
        </div>

        <div className="flex justify-between text-xs text-gray-300 bg-gray-700/50 rounded px-2 py-1.5">
          <span>💰 你的金币</span>
          <span className="text-yellow-400 font-bold">{player.gold} G</span>
        </div>

        <div className="space-y-1.5 max-h-80 overflow-y-auto">
          {mode === 'buy' ? (
            filteredItems.length === 0 ? (
              <p className="text-gray-500 text-xs text-center py-4">该分类暂无商品</p>
            ) : (
              (filteredItems as Item[]).map(item => (
                <div
                  key={item.id}
                  className="bg-gray-700 rounded p-2.5 flex justify-between items-center"
                >
                  <div className="flex-1 min-w-0 mr-2">
                    <h4 className="font-bold text-white text-xs">{item.name}</h4>
                    <p className="text-xs text-gray-400 truncate">{item.description}</p>
                    <p className="text-xs text-yellow-400 mt-0.5">💰 {item.price} G</p>
                  </div>
                  <button
                    onClick={() => buyItem(item)}
                    disabled={player.gold < item.price}
                    className={`flex-shrink-0 px-3 py-1.5 rounded text-xs font-medium transition-all ${
                      player.gold < item.price
                        ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                        : getItemTypeColor(item) + ' text-white'
                    }`}
                  >
                    购买
                  </button>
                </div>
              ))
            )
          ) : (
            filteredItems.length === 0 ? (
              <p className="text-gray-500 text-xs text-center py-4">背包里没有可出售的物品</p>
            ) : (
              (filteredItems as { item: Item; quantity: number }[]).map(inv => {
                const sellPrice = Math.floor(inv.item.price * 0.5);
                return (
                  <div
                    key={inv.item.id}
                    className="bg-gray-700 rounded p-2.5 flex justify-between items-center"
                  >
                    <div className="flex-1 min-w-0 mr-2">
                      <h4 className="font-bold text-white text-xs">{inv.item.name}</h4>
                      <p className="text-xs text-gray-400 truncate">{inv.item.description}</p>
                      <p className="text-xs text-gray-500 mt-0.5">
                        数量: <span className="text-white">{inv.quantity}</span> | 售价: <span className="text-orange-400">{sellPrice}G</span>
                      </p>
                    </div>
                    <button
                      onClick={() => sellItem(inv.item)}
                      className="flex-shrink-0 px-3 py-1.5 rounded text-xs font-medium bg-orange-700 hover:bg-orange-600 text-white transition-all"
                    >
                      出售
                    </button>
                  </div>
                );
              })
            )
          )}
        </div>
      </div>
    </div>
  );
};

export default ShopScreen;