import { useGameStore } from '../store/useGameStore';
import { items, blueprints } from '../data/gameData';
import { Item } from '../types';

export default function CraftingScreen() {
  const {
    player,
    inventory,
    blueprints: ownedBlueprints,
    gamePhase,
    closeShop,
    buyItem,
    addMessage,
    currentBuilding,
    craftItem
  } = useGameStore();

  // 获取当前建筑可购买的物品ID列表
  const availableItemIds = currentBuilding?.itemIds || [];
  
  // 筛选出当前建筑可购买的物品
  const materialItems = items.filter(item => availableItemIds.includes(item.id) && item.id.startsWith('mat'));
  const shopBlueprints = blueprints.filter(bp => availableItemIds.includes(bp.id));

  const hasBlueprint = (bpId: string) => ownedBlueprints.includes(bpId);

  const getMaterialCount = (itemId: string) => {
    const invItem = inventory.find(i => i.item.id === itemId);
    return invItem?.quantity || 0;
  };

  const canCraft = (bpId: string) => {
    const blueprint = blueprints.find(b => b.id === bpId);
    if (!blueprint) return false;
    return blueprint.materials.every(m => getMaterialCount(m.itemId) >= m.quantity);
  };

  const handleCraft = (bpId: string) => {
    craftItem(bpId);
  };

  const handleBuyBlueprint = (bpId: string) => {
    const blueprint = blueprints.find(b => b.id === bpId);
    if (!blueprint) return;
    
    const bpItem = items.find(i => i.id === bpId);
    if (bpItem) {
      buyItem(bpItem);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-gray-800 rounded-lg p-4 mb-4">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-xl font-bold text-yellow-400 mb-2">{currentBuilding?.icon} {currentBuilding?.name}</h2>
              <p className="text-sm text-gray-400">{currentBuilding?.description}</p>
            </div>
            <button
              onClick={closeShop}
              className="px-4 py-2 bg-gray-600 hover:bg-gray-500 rounded-lg font-semibold text-sm"
            >
              返回
            </button>
          </div>
          <p className="text-sm text-yellow-300 mt-2">💰 金币: {player.gold}</p>
        </div>

        <div className="bg-gray-800 rounded-lg p-4 mb-4">
          <h3 className="text-lg font-semibold text-blue-400 mb-3">📜 已学习的蓝图</h3>
          {ownedBlueprints.length === 0 ? (
            <p className="text-gray-500 text-center py-4">还没有学习任何蓝图，请先购买蓝图！</p>
          ) : (
            <div className="space-y-2">
              {ownedBlueprints.map(bpId => {
                const bp = blueprints.find(b => b.id === bpId);
                const resultItem = bp ? items.find(i => i.id === bp.craftResult.itemId) : null;
                const craftable = canCraft(bpId);
                
                return (
                  <div key={bpId} className={`p-3 rounded-lg ${craftable ? 'bg-green-900' : 'bg-gray-700'}`}>
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-semibold text-white">{bp?.name}</p>
                        <p className="text-sm text-gray-400">制造: {resultItem?.name} x{bp?.craftResult.quantity}</p>
                      </div>
                      <button
                        onClick={() => handleCraft(bpId)}
                        disabled={!craftable}
                        className={`px-4 py-2 rounded font-semibold ${
                          craftable 
                            ? 'bg-green-600 hover:bg-green-500 text-white' 
                            : 'bg-gray-600 text-gray-400 cursor-not-allowed'
                        }`}
                      >
                        {craftable ? '制造' : '材料不足'}
                      </button>
                    </div>
                    {bp && (
                      <div className="mt-2 text-sm text-gray-400">
                        <p className="font-semibold">所需材料:</p>
                        <div className="flex flex-wrap gap-2 mt-1">
                          {bp.materials.map((mat, idx) => {
                            const matItem = items.find(i => i.id === mat.itemId);
                            const have = getMaterialCount(mat.itemId);
                            const enough = have >= mat.quantity;
                            return (
                              <span key={idx} className={`px-2 py-1 rounded ${enough ? 'bg-green-800' : 'bg-red-800'}`}>
                                {matItem?.name}: {have}/{mat.quantity}
                              </span>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div className="bg-gray-800 rounded-lg p-4 mb-4">
          <h3 className="text-lg font-semibold text-green-400 mb-3">🧪 材料商店</h3>
          <div className="grid grid-cols-2 gap-2">
            {materialItems.map(item => {
              const have = getMaterialCount(item.id);
              return (
                <div key={item.id} className="p-3 bg-gray-700 rounded flex justify-between items-center">
                  <div>
                    <p className="font-semibold text-white">{item.name}</p>
                    <p className="text-sm text-yellow-400">持有: {have}</p>
                  </div>
                  <button
                    onClick={() => buyItem(item)}
                    className="px-3 py-1 bg-yellow-600 hover:bg-yellow-500 rounded text-sm font-semibold"
                  >
                    {item.price}G
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        <div className="bg-gray-800 rounded-lg p-4 mb-4">
          <h3 className="text-lg font-semibold text-purple-400 mb-3">📜 蓝图商店</h3>
          {shopBlueprints.length === 0 ? (
            <p className="text-gray-500 text-center py-4">这里没有可购买的蓝图</p>
          ) : (
            <div className="space-y-2">
              {shopBlueprints.map(bp => {
                const owned = hasBlueprint(bp.id);
                return (
                  <div key={bp.id} className={`p-3 rounded-lg ${owned ? 'bg-green-900 border border-green-600' : 'bg-gray-700'}`}>
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-semibold text-white">{bp.name}</p>
                        <p className="text-sm text-gray-400">{bp.description}</p>
                      </div>
                      {owned ? (
                        <span className="px-3 py-1 bg-green-600 rounded text-sm font-semibold">已拥有</span>
                      ) : (
                        <button
                          onClick={() => handleBuyBlueprint(bp.id)}
                          className="px-3 py-1 bg-purple-600 hover:bg-purple-500 rounded text-sm font-semibold"
                        >
                          {bp.price}G
                        </button>
                      )}
                    </div>
                    {!owned && (
                      <div className="mt-2 text-sm text-gray-400">
                        <p className="font-semibold">所需材料:</p>
                        <div className="flex flex-wrap gap-2 mt-1">
                          {bp.materials.map((mat, idx) => {
                            const matItem = items.find(i => i.id === mat.itemId);
                            return (
                              <span key={idx} className="px-2 py-1 bg-gray-600 rounded">
                                {matItem?.name} x{mat.quantity}
                              </span>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
