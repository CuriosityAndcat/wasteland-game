import React, { useState } from 'react';
import { useGameStore } from '../store/useGameStore';
import { Building } from '../types';
import { quests as allQuests } from '../data/quests';
import { items } from '../data/gameData';
import Portrait from './Portrait';

const barNpcs: Record<string, { name: string; dialogs: string[] }[]> = {
  radom_bar: [
    { name: '酒吧老板', dialogs: [
      '欢迎光临！新面孔啊，是被父亲赶出来的那个小子吧？',
      '听说北边的山洞里有辆废弃的战车，不过有条恶狗守着。',
      '如果你想去，最好先弄点装备再出发。',
      '拉多镇虽小，但勇士中心发布了不少通缉令呢。'
    ]},
    { name: '醉醺醺的猎人', dialogs: [
      '嗝～ 我跟你说，南边的荒野上有巨蚁出没，不好对付啊...',
      '不过打巨蚁能赚钱，攒够了钱去装备店买把好武器！',
      '听说波布镇那边有更厉害的装备，可惜要有战车才能过关卡。'
    ]},
    { name: '旅人', dialogs: [
      '我刚刚从北边过来，那条路上有只巨大的深渊巨兽！',
      '深渊巨兽的悬赏金有1000G呢，不过没有战车还是别去送死了。',
      '先在南边打打怪升级吧，少年。'
    ]}
  ],
  negi_bar: [
    { name: '酒吧老板', dialogs: [
      '欢迎！麦基镇虽小，但时光机很出名哦。',
      '从这里往北走就是波布镇，那里比我们这里繁华多了。',
      '不过要小心路上的怪物。'
    ]},
    { name: '时光机管理员', dialogs: [
      '时光机可以让你瞬间回到以前去过的地方。',
      '不过需要消耗传真道具才能使用。',
      '这东西关键时候能救命！'
    ]}
  ],
  bob_bar: [
    { name: '酒吧老板', dialogs: [
      '欢迎来到波布镇！这里可是这一带最繁华的城镇。',
      '镇外有个废弃的工厂，听说里面有战车！',
      '不过那里有怪物出没，要小心。'
    ]},
    { name: '机械师学徒', dialogs: [
      '我师父是这一带最好的技师！',
      '他特别喜欢研究战车，你要是搞到战车可以找他看看。',
      '听说他最近又捡了一堆破铜烂铁回来。'
    ]},
    { name: '商人', dialogs: [
      '波布镇的装备店东西不错，价格也公道。',
      '从这里过桥就是钢铁巨兽阵地，但水鬼守在那里。',
      '水鬼可不是好惹的，没准备好别去送死。'
    ]}
  ],
  ordo_bar: [
    { name: '酒吧老板', dialogs: [
      '奥多镇是这一带最美丽的城镇！',
      '听说镇上有位格斗家，战斗力极强。',
      '如果你能说服她加入队伍，那可真是如虎添翼。'
    ]},
    { name: '旅行商人', dialogs: [
      '从奥多镇往西走是帕特港，那里有异形出没。',
      '往北走是罗克镇，被一个叫铁血将军的家伙占领了。',
      '那家伙悬赏金有10000G，是个狠角色。'
    ]}
  ],
  porto_bar: [
    { name: '酒吧老板', dialogs: [
      '帕特港是个港口城市，可以买到第三辆战车。',
      '不过港口大楼里有异形，千万别靠近！',
      '已经有好多勇士进去后再也没出来...'
    ]},
    { name: '水手', dialogs: [
      '我在海上见过奇怪的东西，海面上漂浮着巨大的影子。',
      '还好我开得快，不然就交代在那里了。',
      '这年头，连海上都不安全了。'
    ]}
  ],
  rock_bar: [
    { name: '酒吧老板', dialogs: [
      '罗克镇现在被铁血将军那家伙搞得鸡犬不宁。',
      '他占领了镇外的医院作为基地。',
      '听说医院里藏着第四辆战车！'
    ]},
    { name: '反抗军', dialogs: [
      '嘘...小声点。我们正在组织反抗铁血将军的力量。',
      '如果你能打败他，全镇的人都会感谢你的！',
      '他的悬赏金是10000G，打完后别忘了去领赏。'
    ]}
  ],
  free_bar: [
    { name: '酒吧老板', dialogs: [
      '弗里镇很冷，但这里的人们很热情。',
      '镇外的大楼里有一头大象，破坏力惊人。',
      '听说它的悬赏金有10000G呢。'
    ]},
    { name: '老猎人', dialogs: [
      '我在这一带狩猎了几十年，从没见过那么大的大象。',
      '它的象牙值不少钱，但要小心它的长鼻子！',
      '最好用战车去打，肉身是打不过的。'
    ]}
  ],
  irl_bar: [
    { name: '酒吧老板', dialogs: [
      '伊尔镇的铁洞非常有名，改造技术一流！',
      '不过价格也不便宜，你得准备好足够的金币。',
      '从这里往北走就是无歌村了。'
    ]},
    { name: '改造师', dialogs: [
      '铁洞的改造技术可以让你的战车性能大幅提升。',
      '不过改装配件需要自己去寻找。',
      '等你有了好战车，记得来找我。'
    ]}
  ],
  yuge_bar: [
    { name: '酒吧老板', dialogs: [
      '无歌村最近不太平，晚上总有怪声...',
      '听说附近有山贼出没，晚上别出门。',
      '去索鲁镇的路也不安全，要小心。'
    ]}
  ],
  sol_bar: [
    { name: '酒吧老板', dialogs: [
      '索鲁镇的下水道里好像藏着什么东西。',
      '听说是一辆吉普车，不过下水道里有很多怪物。',
      '如果你想下去，最好准备充分。'
    ]},
    { name: '工程师', dialogs: [
      '下水道的结构很复杂，容易迷路。',
      '不过如果你能找到控制室，就能拿到那辆吉普车。',
      '那辆车虽然旧，但性能不错。'
    ]}
  ],
  eden_bar: [
    { name: '酒吧老板', dialogs: [
      '伊甸镇是高科技城镇，但了望塔那边有危险。',
      '了望塔里住着一只巨大的蜈蚣王。',
      '它的悬赏金有32000G，不过非常难对付。'
    ]},
    { name: '研究员', dialogs: [
      '了望塔原本是观测站，后来被怪物占领了。',
      '塔里有很多有用的资料，可惜现在进不去。',
      '如果你能清掉那些怪物，说不定能发现些什么。'
    ]}
  ],
  santa_bar: [
    { name: '酒吧老板', dialogs: [
      '塔镇建在高塔之上，风景壮观！',
      '大瀑布那边有个叫黑风的通缉犯，赏金50000G！',
      '那家伙是神秘猎人的仇人，非常危险。'
    ]},
    { name: '老猎人', dialogs: [
      '黑风...那家伙不是人，是恶魔。',
      '据说连神秘猎人都在找他算账。',
      '你要是遇到他，千万别硬拼。'
    ]}
  ],
  kanal_bar: [
    { name: '酒吧老板', dialogs: [
      '卡拉镇被大火烧毁后，已经不复当年了。',
      '兵工厂里藏着第六辆战车豹式坦克。',
      '不过那里的怪物很多，要小心。'
    ]},
    { name: '幸存者', dialogs: [
      '那场大火烧掉了整个镇子...太可怕了。',
      '暗影首领那家伙就藏在大楼里，是他放的火。',
      '他的悬赏金有99800G，是最高级别的通缉犯！'
    ]}
  ],
  hell_gate_west_bar: [
    { name: '酒吧老板', dialogs: [
      '这里就是末日关隘前最后的补给站了。',
      '穿过末日关隘就是诺亚基地，那是最终决战之地。',
      '在去之前，确保你的战车和装备都是最好的！'
    ]},
    { name: '老兵', dialogs: [
      '我去过末日关隘一次...那里简直就是地狱。',
      '里面的怪物强大得可怕。',
      '如果你要去，一定要做好准备。'
    ]}
  ]
};

const houseNpcs: Record<string, { name: string; dialogs: string[] }[]> = {
  radom_house1: [
    { name: '老奶奶', dialogs: [
      '哎呀，你就是老王家那个被赶出来的孩子吧？',
      '别怪你父亲，他也是为你好。',
      '外面的世界很危险，你要多加小心啊。'
    ]}
  ],
  radom_house2: [
    { name: '姐姐', dialogs: [
      '弟弟！你终于回来了！快进来休息一下吧。',
      '无论什么时候，这里都是你的家。',
      '要好好照顾自己啊，姐姐会一直在这里的。'
    ]}
  ],
  negi_house1: [
    { name: '居民', dialogs: [
      '麦基镇的生活很平静，除了偶尔有怪物骚扰。',
      '时光机很方便，记得买传真来用。',
      '去波布镇的路上要小心。'
    ]}
  ],
  bob_house1: [
    { name: '居民', dialogs: [
      '波布镇很繁华，但最近怪物也越来越多了。',
      '镇外的工厂以前很热闹，现在只剩下废墟了。',
      '听说那里还有战车，也不知道是真是假。'
    ]}
  ],
  ordo_house1: [
    { name: '居民', dialogs: [
      '奥多镇的格斗家很强，但她很挑剔。',
      '听说只有够强的人才能让她加入。',
      '你先去提升一下实力吧。'
    ]}
  ],
  porto_house1: [
    { name: '居民', dialogs: [
      '帕特港大楼很危险，千万不要进去。',
      '不过听说里面有宝藏...但命更重要。',
      '异形会模仿人类的声音，千万别被骗了。'
    ]}
  ],
  rock_house1: [
    { name: '居民', dialogs: [
      '铁血将军那家伙太可恶了！',
      '他霸占了医院，还把战车藏在那里。',
      '求求你打败他，让罗克镇恢复和平吧！'
    ]}
  ],
  free_house1: [
    { name: '居民', dialogs: [
      '弗里镇虽然冷，但我们已经习惯了。',
      '镇外的大楼里有头大象，经常跑出来破坏庄稼。',
      '勇士中心已经发布悬赏了，谁能解决它就好了。'
    ]}
  ],
  irl_house1: [
    { name: '居民', dialogs: [
      '伊尔镇的铁洞很有名，很多勇士都来这里改造战车。',
      '不过价格确实不便宜。',
      '无歌村那边听说不太平，少去为妙。'
    ]}
  ],
  yuge_house1: [
    { name: '居民', dialogs: [
      '无歌村最近总有怪事发生...',
      '晚上千万别出门，有山贼出没。',
      '我们都不敢晚上出去了。'
    ]}
  ],
  sol_house1: [
    { name: '居民', dialogs: [
      '索鲁镇的下水道越来越危险了。',
      '里面好像有个大家伙，经常发出可怕的声音。',
      '不过也有人说里面有宝藏...'
    ]}
  ],
  eden_house1: [
    { name: '居民', dialogs: [
      '伊甸镇是高科技城镇，生活很便利。',
      '但了望塔那边经常有怪物出没。',
      '希望勇士们能解决这个问题。'
    ]}
  ],
  santa_house1: [
    { name: '居民', dialogs: [
      '塔镇的风景很美，但大瀑布那边很危险。',
      '黑风是个可怕的通缉犯，连神秘猎人都在找他。',
      '你要去的话千万要小心。'
    ]}
  ],
  kanal_house1: [
    { name: '居民', dialogs: [
      '那场大火之后，卡拉镇就再也不是以前的卡拉镇了。',
      '暗影首领那个混蛋，我一定要看他受到惩罚！',
      '兵工厂里还有战车，但已经被怪物占领了。'
    ]}
  ],
  hell_gate_west_house1: [
    { name: '居民', dialogs: [
      '这里是末日关隘前最后的城镇了。',
      '很多人进去了就再也没出来。',
      '如果你要进入末日关隘，一定要做好万全准备！'
    ]}
  ]
};

const BuildingScreen: React.FC = () => {
  const {
    currentBuilding,
    leaveBuilding,
    openShop,
    rest,
    addMessage,
    player,
    tanks,
    repairAllTanks,
    defeatedBosses,
    healPlayer,
    locations,
    currentLocationId: currentLocation,
    members,
    sellItem,
    reviveMember,
    collectBounty,
    depositItem,
    withdrawItem,
    storage,
    storyFlags,
    inventory,
    setInventory,
    setStoryFlags,
    openCrafting,
    addQuest,
    quests,
    activeDialog,
    nextDialog
  } = useGameStore();

  const [selectedNpc, setSelectedNpc] = useState<number | null>(null);
  const [npcDialog, setNpcDialog] = useState(0);
  const [showContent, setShowContent] = useState<'main' | 'dialog'>('main');
  const [hasRested, setHasRested] = useState(false);
  const [showSell, setShowSell] = useState(false);
  const [warehouseTab, setWarehouseTab] = useState<'deposit' | 'withdraw'>('deposit');
  const [houseAction, setHouseAction] = useState<'none' | 'rested' | 'talked'>('none');
  const [hospitalDialog, setHospitalDialog] = useState(0);
  const [officeView, setOfficeView] = useState<'main' | 'list' | 'dialog'>('main');

  if (!currentBuilding) return null;

  const building = currentBuilding;
  const currentLoc = locations.find(l => l.id === currentLocation);

  const handleBack = () => {
    setSelectedNpc(null);
    setNpcDialog(0);
    setShowContent('main');
    setHasRested(false);
    setShowSell(false);
    setHouseAction('none');
    setHospitalDialog(0);
    setOfficeView('main');
    leaveBuilding();
  };

  const getBuildingInteriorStyle = (): string => {
    switch (building.type) {
      case 'bar': return 'bg-gradient-to-b from-amber-900 to-amber-950 border-amber-600';
      case 'inn': return 'bg-gradient-to-b from-emerald-900 to-emerald-950 border-emerald-600';
      case 'shop_human': return 'bg-gradient-to-b from-purple-900 to-purple-950 border-purple-600';
      case 'shop_tank': return 'bg-gradient-to-b from-blue-900 to-blue-950 border-blue-600';
      case 'hospital': return 'bg-gradient-to-b from-red-900 to-red-950 border-red-600';
      case 'office': return 'bg-gradient-to-b from-yellow-900 to-yellow-950 border-yellow-600';
      case 'warehouse': return 'bg-gradient-to-b from-gray-800 to-gray-900 border-gray-600';
      case 'house': return 'bg-gradient-to-b from-teal-900 to-teal-950 border-teal-600';
      case 'home': return 'bg-gradient-to-b from-amber-900 to-amber-950 border-amber-600';
      case 'workshop': return 'bg-gradient-to-b from-orange-900 to-orange-950 border-orange-600';
      default: return 'bg-gradient-to-b from-gray-800 to-gray-900 border-gray-600';
    }
  };

  const getBuildingIcon = (): string => {
    switch (building.type) {
      case 'bar': return '🍺';
      case 'inn': return '🏨';
      case 'shop_human': return '⚔️';
      case 'shop_tank': return '🛞';
      case 'hospital': return '🏥';
      case 'office': return '🎯';
      case 'warehouse': return '📦';
      case 'house': return '🏠';
      case 'home': return '🏠';
      case 'workshop': return '🔧';
      default: return '🏠';
    }
  };

  const handleNpcClick = (index: number) => {
    setSelectedNpc(index);
    setNpcDialog(0);
    setShowContent('dialog');
  };

  const [showQuestAccept, setShowQuestAccept] = useState<string | null>(null);

  const handleNextDialog = () => {
    const npcs = barNpcs[building.id] || houseNpcs[building.id] || [];
    if (selectedNpc === null) return;
    const npc = npcs[selectedNpc];
    
    // 检查对话是否到最后，然后显示任务接取选项
    if (npcDialog === npc.dialogs.length - 1) {
      // 酒吧老板：主线任务 - 寻找战车
      if ((building.type === 'bar' || building.id === 'radom_bar') && npc.name === '酒吧老板') {
        // 检查是否满足前置条件（完成 main_1_1 或者没有在进行中的寻找战车任务）
        const main1 = quests.inProgress.find(q => q.id === 'main_1');
        const hasMain1_1Completed = main1?.objectives.some(o => o.id === 'main_1_1' && o.completed);
        const hasMain2 = quests.inProgress.some(q => q.id === 'main_2');
        const hasCompletedMain2 = quests.completed.some(q => q.id === 'main_2');
        
        if ((!main1 || hasMain1_1Completed) && !hasMain2 && !hasCompletedMain2) {
          setShowQuestAccept('main_2');
          return;
        }
      }
      
      // 勇士中心：主线任务 - 消灭水怪
      if (building.type === 'office' || building.id === 'radom_office') {
        const hasMain1 = quests.completed.some(q => q.id === 'main_1');
        const hasMain3 = quests.inProgress.some(q => q.id === 'main_3');
        const hasCompletedMain3 = quests.completed.some(q => q.id === 'main_3');
        
        if (hasMain1 && !hasMain3 && !hasCompletedMain3) {
          setShowQuestAccept('main_3');
          return;
        }
        
        // 主线任务 - 成为无畏勇士
        const hasMain4 = quests.completed.some(q => q.id === 'main_4');
        const hasMain5 = quests.inProgress.some(q => q.id === 'main_5');
        const hasCompletedMain5 = quests.completed.some(q => q.id === 'main_5');
        
        if (hasMain4 && !hasMain5 && !hasCompletedMain5) {
          setShowQuestAccept('main_5');
          return;
        }
      }
      
      setShowContent('main');
      setSelectedNpc(null);
      return;
    }
    
    if (npcDialog < npc.dialogs.length - 1) {
      setNpcDialog(npcDialog + 1);
    }
  };

  const handleAcceptQuest = (questId: string) => {
    addQuest(questId);
    const quest = allQuests.find(q => q.id === questId);
    if (quest) {
      addMessage(`📜 接取任务：${quest.name}！`);
    }
    setShowQuestAccept(null);
    setShowContent('main');
    setSelectedNpc(null);
  };

  const handleRejectQuest = () => {
    addMessage('你决定暂时不接这个任务。');
    setShowQuestAccept(null);
    setShowContent('main');
    setSelectedNpc(null);
  };

  const handlePrevDialog = () => {
    if (npcDialog > 0) {
      setNpcDialog(npcDialog - 1);
    }
  };

  const handleAction = () => {
    switch (building.type) {
      case 'shop_human':
        openShop('human');
        break;
      case 'shop_tank':
        if (tanks.length > 0) {
          setShowContent('main');
          setSelectedNpc(null);
          openShop('tank');
        } else {
          addMessage('🔒 你还没有战车！');
        }
        break;
      case 'inn':
        if (player.gold >= 50) {
          rest();
          setHasRested(true);
        } else {
          addMessage('💰 金币不足！需要50金币。');
        }
        break;
      case 'hospital':
        if (building.id === 'radom_hospital') {
          addMessage('🏥 明奇博士："欢迎来到我的小屋！我是明奇博士，可以让死人复活..."');
        } else {
          addMessage('🏥 "这里不是明奇小屋，但也可以治疗..."');
        }
        break;
      case 'office': {
        const allBosses = [
          { id: 'boss0', name: '狂犬首领', bounty: 100 },
          { id: 'boss1', name: '深渊巨兽', bounty: 1000 },
          { id: 'boss2', name: '水鬼', bounty: 3000 },
          { id: 'boss3', name: '钢铁巨兽', bounty: 5000 },
          { id: 'boss4', name: '瓦鲁', bounty: 8000 },
          { id: 'boss5', name: '异形', bounty: 1000 },
          { id: 'boss6', name: '铁血将军', bounty: 10000 },
          { id: 'boss7', name: '大象', bounty: 10000 },
          { id: 'boss8', name: '蜈蚣王', bounty: 32000 },
          { id: 'boss9', name: '黑风', bounty: 50000 },
          { id: 'boss10', name: '暗影首领', bounty: 99800 },
        ];
        addMessage('🎯 勇士中心通缉令：');
        allBosses.forEach(b => {
          const captured = defeatedBosses.includes(b.id);
          addMessage(`${captured ? '✅' : '❌'} ${b.name} - ${b.bounty}G${captured ? ' ✅已捕获' : ''}`);
        });
        break;
      }
      case 'house':
        if (building.id === 'radom_house2') {
          rest();
          addMessage('🏠 姐姐："弟弟回来啦！快休息一下吧。"（HP已恢复！）');
        }
        break;
      case 'home':
        rest();
        addMessage('🏠 回到家中，你安心地休息了一会儿。（HP已恢复！）');
        break;
      case 'warehouse':
        addMessage('📦 保管处管理员："这里可以存放你的物品，不过现在暂时用不上..."');
        break;
      case 'workshop':
        openCrafting();
        break;
      default:
        break;
    }
  };

  const npcs = barNpcs[building.id] || houseNpcs[building.id] || [];
  const hasNpcs = npcs.length > 0;

  const renderBarContent = () => (
    <div className="space-y-3">
      <div className="text-center mb-4">
        <p className="text-amber-300 text-sm font-bold">🏮 酒吧内部 🏮</p>
        <p className="text-amber-400/70 text-xs mt-1">昏暗的灯光下，三三两两的客人围坐在一起</p>
      </div>
      <div className="space-y-2">
        {npcs.map((npc, index) => (
          <button
            key={index}
            onClick={() => handleNpcClick(index)}
            className="w-full bg-amber-800/50 hover:bg-amber-700/60 text-left p-3 rounded-lg border border-amber-700/30 transition-all"
          >
            <span className="text-amber-300 font-bold text-sm">👤 {npc.name}</span>
            <p className="text-amber-200/70 text-xs mt-1 truncate">{npc.dialogs[0]}</p>
          </button>
        ))}
      </div>
    </div>
  );

  const renderInnContent = () => (
    <div className="space-y-4">
      <div className="text-center mb-4">
        <p className="text-emerald-300 text-sm font-bold">🛌 旅馆 🛌</p>
        <p className="text-emerald-400/70 text-xs mt-1">温暖的壁炉，舒适的床铺...</p>
      </div>
      {hasRested ? (
        <div className="bg-emerald-800/40 rounded-lg p-6 text-center">
          <p className="text-emerald-300 text-2xl mb-2">✅</p>
          <p className="text-emerald-300 text-lg font-bold mb-2">HP已完全恢复！</p>
          <p className="text-emerald-200/70 text-xs mb-4">你美美地睡了一觉，感觉精神焕发！</p>
          <p className="text-gray-500 text-xs">当前金币：{player.gold}G</p>
        </div>
      ) : (
        <div className="bg-emerald-800/40 rounded-lg p-4 text-center">
          <p className="text-emerald-300 text-sm mb-1">旅馆老板</p>
          <p className="text-emerald-200/70 text-xs mb-3">"欢迎光临！要住宿吗？50G一晚。"</p>
          <div className="flex justify-center gap-2">
            <button
              onClick={handleAction}
              disabled={player.gold < 50}
              className={`px-6 py-2 rounded-lg font-bold text-sm transition-all ${
                player.gold >= 50
                  ? 'bg-emerald-600 hover:bg-emerald-500 text-white'
                  : 'bg-gray-700 text-gray-500 cursor-not-allowed'
              }`}
            >
              💤 住宿（50G）
            </button>
          </div>
          <p className="text-gray-500 text-xs mt-2">当前金币：{player.gold}G</p>
        </div>
      )}
    </div>
  );

  const renderShopContent = () => {
    const isHuman = building.type === 'shop_human';
    const shopkeeper = isHuman
      ? { name: '装备店老板', greeting: '"欢迎光临！看看有什么需要的武器和防具吧！"' }
      : { name: '战车装备店老板', greeting: '"欢迎！这里有战车装备和修理服务。"' };

    if (showSell) {
      const sellableItems = inventory.filter(invItem => invItem.quantity > 0);
      return (
        <div className="space-y-4">
          <div className="text-center mb-4">
            <p className={`text-sm font-bold ${isHuman ? 'text-purple-300' : 'text-blue-300'}`}>
              {isHuman ? '⚔️ 出售物品 ⚔️' : '🛞 出售物品 🛞'}
            </p>
          </div>
          <div className="bg-gray-800/60 rounded-lg p-4">
            <p className="text-gray-200 text-sm mb-3 text-center">选择要出售的物品</p>
            {sellableItems.length === 0 ? (
              <p className="text-gray-500 text-xs text-center">背包里没有物品可以出售。</p>
            ) : (
              <div className="space-y-1.5 max-h-48 overflow-y-auto">
                {sellableItems.map((invItem, index) => {
                  const sellPrice = Math.floor(invItem.item.price * 0.5);
                  return (
                    <div key={index} className="flex justify-between items-center bg-gray-700/40 rounded px-3 py-1.5">
                      <div className="flex-1">
                        <span className="text-gray-200 text-xs">{invItem.item.name}</span>
                        <span className="text-gray-500 text-xs ml-2">x{invItem.quantity}</span>
                      </div>
                      <span className="text-yellow-400 text-xs mr-2">出售价：{sellPrice}G</span>
                      <button
                        onClick={() => sellItem(invItem.item)}
                        className="px-3 py-1 bg-red-600 hover:bg-red-500 text-white rounded text-xs font-bold transition-all"
                      >
                        出售
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
            <div className="text-center mt-3">
              <button
                onClick={() => setShowSell(false)}
                className="px-4 py-1.5 bg-gray-600 hover:bg-gray-500 text-white rounded-lg text-xs transition-all"
              >
                返回
              </button>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="space-y-4">
        <div className="text-center mb-4">
          <p className={`text-sm font-bold ${isHuman ? 'text-purple-300' : 'text-blue-300'}`}>
            {isHuman ? '⚔️ 装备店 ⚔️' : '🛞 战车装备店 🛞'}
          </p>
          <p className={`${isHuman ? 'text-purple-400/70' : 'text-blue-400/70'} text-xs mt-1`}>
            {isHuman ? '武器和防具整齐地陈列在货架上' : '战车零件和装甲板堆满了货架'}
          </p>
        </div>
        <div className="bg-gray-800/60 rounded-lg p-4 text-center">
          <p className="text-gray-200 text-sm mb-1">{shopkeeper.name}</p>
          <p className="text-gray-400 text-xs mb-3">{shopkeeper.greeting}</p>
          <div className="flex justify-center gap-2">
            <button
              onClick={handleAction}
              className="px-6 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-lg font-bold text-sm transition-all"
            >
              🛒 浏览商品
            </button>
            <button
              onClick={() => setShowSell(true)}
              className="px-6 py-2 bg-orange-600 hover:bg-orange-500 text-white rounded-lg font-bold text-sm transition-all"
            >
              💰 出售物品
            </button>
          </div>
          {!isHuman && tanks.length > 0 && (
            <div className="mt-2">
              <button
                onClick={() => {
                  repairAllTanks();
                  addMessage('🔧 所有战车装甲已修复！');
                }}
                className="px-6 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-bold text-sm transition-all"
              >
                🔧 修复装甲
              </button>
            </div>
          )}
        </div>
      </div>
    );
  };

  const hospitalDialogs = [
    '"嗯...又来了一个活蹦乱跳的。我是明奇博士，可以让死人复活，不过需要100G。"',
    '"你要是同伴战死了，尽管带到我这里来。我可是这一带唯一能起死回生的人。"',
    '"不过话说在前头，复活后的身体会很虚弱，只能恢复一半的体力。"',
    '"好了，没事的话就出去吧，我还要做实验呢。"'
  ];

  const renderHospitalContent = () => {
    const deadMembers = members.filter(m => m.hp <= 0);

    if (hospitalDialog > 0) {
      return (
        <div className="space-y-4">
          <div className="bg-red-800/80 rounded-lg p-4 min-h-[100px]">
            <p className="text-red-300 font-bold text-sm mb-2">👨‍🔬 明奇博士</p>
            <p className="text-red-200 text-sm leading-relaxed">
              {hospitalDialogs[hospitalDialog - 1]}
            </p>
          </div>
          <div className="flex justify-center gap-2">
            {hospitalDialog < hospitalDialogs.length ? (
              <button
                onClick={() => setHospitalDialog(hospitalDialog + 1)}
                className="px-6 py-2 bg-red-600 hover:bg-red-500 text-white rounded-lg text-sm font-bold transition-all"
              >
                继续听
              </button>
            ) : (
              <button
                onClick={() => setHospitalDialog(0)}
                className="px-6 py-2 bg-gray-600 hover:bg-gray-500 text-white rounded-lg text-sm transition-all"
              >
                返回
              </button>
            )}
          </div>
        </div>
      );
    }

    return (
      <div className="space-y-4">
        <div className="text-center mb-4">
          <p className="text-red-300 text-sm font-bold">🏥 明奇小屋 🏥</p>
          <p className="text-red-400/70 text-xs mt-1">散发着药水味的房间，各种仪器闪烁着微光</p>
        </div>
        <div className="bg-red-800/40 rounded-lg p-4 text-center">
          <p className="text-red-300 text-sm mb-1">明奇博士</p>
          <p className="text-red-200/70 text-xs mb-3">{hospitalDialogs[0]}</p>
          <div className="flex justify-center gap-2">
            <button
              onClick={() => setHospitalDialog(1)}
              className="px-6 py-2 bg-red-600 hover:bg-red-500 text-white rounded-lg font-bold text-sm transition-all"
            >
              💬 和明奇博士对话
            </button>
          </div>
        </div>
        {deadMembers.length > 0 && (
          <div className="bg-red-800/40 rounded-lg p-4">
            <p className="text-red-300 text-sm mb-3 text-center font-bold">💀 需要复活的同伴</p>
            <div className="space-y-2">
              {deadMembers.map((member) => (
                <div key={member.id} className="flex justify-between items-center bg-red-900/40 rounded px-3 py-2">
                  <div>
                    <span className="text-red-300 text-xs font-bold">{member.name}</span>
                    <span className="text-red-400/70 text-xs ml-2">（{member.role}）</span>
                  </div>
                  <button
                    onClick={() => reviveMember(member.id)}
                    disabled={player.gold < 100}
                    className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                      player.gold >= 100
                        ? 'bg-red-600 hover:bg-red-500 text-white'
                        : 'bg-gray-700 text-gray-500 cursor-not-allowed'
                    }`}
                  >
                    💚 复活同伴（100G）
                  </button>
                </div>
              ))}
            </div>
            {player.gold < 100 && (
              <p className="text-gray-500 text-xs text-center mt-2">金币不足！复活需要100G。</p>
            )}
          </div>
        )}
      </div>
    );
  };

  const renderOfficeContent = () => {
    const allBosses = [
      { id: 'boss0', name: '狂犬首领', bounty: 100 },
      { id: 'boss1', name: '深渊巨兽', bounty: 1000 },
      { id: 'boss2', name: '水鬼', bounty: 3000 },
      { id: 'boss3', name: '钢铁巨兽', bounty: 5000 },
      { id: 'boss4', name: '瓦鲁', bounty: 8000 },
      { id: 'boss5', name: '异形', bounty: 1000 },
      { id: 'boss6', name: '铁血将军', bounty: 10000 },
      { id: 'boss7', name: '大象', bounty: 10000 },
      { id: 'boss8', name: '蜈蚣王', bounty: 32000 },
      { id: 'boss9', name: '黑风', bounty: 50000 },
      { id: 'boss10', name: '暗影首领', bounty: 99800 },
    ];

    const collectableBosses = allBosses.filter(b =>
      defeatedBosses.includes(b.id) && !(storyFlags as any)[`bounty_collected_${b.id}`]
    );

    if (officeView === 'dialog') {
      const officeDialogs = [
        '"欢迎来到勇士中心！我是赏金管理员。墙上的通缉令你都看到了吧？"',
        '"击败通缉犯后记得回来找我领赏金，每个通缉犯只能领一次。"',
        '"通缉犯的悬赏金额从100G到99800G不等，越危险的家伙赏金越高。"',
        '"去吧，少年！成为一名真正的赏金猎人！"'
      ];
      return (
        <div className="space-y-4">
          <div className="bg-yellow-800/80 rounded-lg p-4 min-h-[100px]">
            <p className="text-yellow-300 font-bold text-sm mb-2">👤 赏金管理员</p>
            {officeDialogs.map((d, i) => (
              <p key={i} className="text-yellow-200 text-sm leading-relaxed mb-1">{d}</p>
            ))}
          </div>
          <button
            onClick={() => setOfficeView('main')}
            className="w-full py-2 bg-yellow-700 hover:bg-yellow-600 text-white rounded-lg text-sm font-bold transition-all"
          >
            返回
          </button>
        </div>
      );
    }

    if (officeView === 'list') {
      return (
        <div className="space-y-4">
          <div className="text-center mb-2">
            <p className="text-yellow-300 text-sm font-bold">📋 通缉犯名单</p>
          </div>
          <div className="space-y-1.5 max-h-48 overflow-y-auto">
            {allBosses.map(b => {
              const captured = defeatedBosses.includes(b.id);
              return (
                <div key={b.id} className={`flex justify-between items-center px-3 py-1.5 rounded ${
                  captured ? 'bg-green-900/40' : 'bg-gray-800/40'
                }`}>
                  <span className={`text-xs ${captured ? 'text-green-400 line-through' : 'text-gray-200'}`}>
                    {b.name}
                  </span>
                  <span className={`text-xs font-bold ${captured ? 'text-green-400' : 'text-yellow-400'}`}>
                    {b.bounty}G {captured ? '✅' : '❌'}
                  </span>
                </div>
              );
            })}
          </div>
          {collectableBosses.length > 0 && (
            <div className="bg-yellow-800/40 rounded-lg p-3">
              <p className="text-yellow-300 text-xs mb-2 text-center font-bold">💰 可领取的赏金</p>
              <div className="space-y-1.5">
                {collectableBosses.map(b => (
                  <div key={b.id} className="flex justify-between items-center bg-yellow-900/40 rounded px-3 py-1.5">
                    <span className="text-yellow-200 text-xs font-bold">{b.name}</span>
                    <span className="text-yellow-400 text-xs mr-2">{b.bounty}G</span>
                    <button
                      onClick={() => collectBounty(b.id)}
                      className="px-3 py-1 bg-yellow-600 hover:bg-yellow-500 text-white rounded text-xs font-bold transition-all"
                    >
                      领取
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
          <button
            onClick={() => setOfficeView('main')}
            className="w-full py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg text-sm transition-all"
          >
            返回
          </button>
        </div>
      );
    }

    return (
      <div className="space-y-4">
        <div className="text-center mb-4">
          <p className="text-yellow-300 text-sm font-bold">🎯 勇士中心 🎯</p>
          <p className="text-yellow-400/70 text-xs mt-1">墙上贴满了通缉令，柜台后面坐着一个管理员</p>
        </div>
        <div className="bg-yellow-800/40 rounded-lg p-4 text-center">
          <p className="text-yellow-300 text-sm mb-1">👤 赏金管理员</p>
          <p className="text-yellow-200/70 text-xs mb-3">"欢迎！这里是勇士中心，有什么需要帮助的吗？"</p>
          <div className="flex justify-center gap-2">
            <button
              onClick={() => setOfficeView('list')}
              className="px-4 py-2 bg-yellow-600 hover:bg-yellow-500 text-white rounded-lg text-sm font-bold transition-all"
            >
              📋 查看通缉令
            </button>
            <button
              onClick={() => setOfficeView('dialog')}
              className="px-4 py-2 bg-yellow-700/60 hover:bg-yellow-600/60 text-white rounded-lg text-sm transition-all"
            >
              💬 打听消息
            </button>
          </div>
        </div>
      </div>
    );
  };

  const renderWarehouseContent = () => {
    const depositItems = inventory.filter(invItem => invItem.quantity > 0);
    const withdrawItems = storage.filter(invItem => invItem.quantity > 0);

    return (
      <div className="space-y-4">
        <div className="text-center mb-4">
          <p className="text-gray-300 text-sm font-bold">📦 保管处 📦</p>
          <p className="text-gray-400/70 text-xs mt-1">堆满了各种箱子和包裹</p>
        </div>
        <div className="flex gap-2 mb-3">
          <button
            onClick={() => setWarehouseTab('deposit')}
            className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all ${
              warehouseTab === 'deposit'
                ? 'bg-gray-600 text-white'
                : 'bg-gray-700/50 text-gray-400 hover:bg-gray-600/50'
            }`}
          >
            存入
          </button>
          <button
            onClick={() => setWarehouseTab('withdraw')}
            className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all ${
              warehouseTab === 'withdraw'
                ? 'bg-gray-600 text-white'
                : 'bg-gray-700/50 text-gray-400 hover:bg-gray-600/50'
            }`}
          >
            取出
          </button>
        </div>
        <div className="bg-gray-700/40 rounded-lg p-4">
          {warehouseTab === 'deposit' ? (
            <div>
              <p className="text-gray-300 text-xs mb-3 text-center font-bold">📥 存入物品</p>
              {depositItems.length === 0 ? (
                <p className="text-gray-500 text-xs text-center">背包里没有物品可以存放。</p>
              ) : (
                <div className="space-y-1.5 max-h-48 overflow-y-auto">
                  {depositItems.map((invItem, index) => (
                    <div key={index} className="flex justify-between items-center bg-gray-800/60 rounded px-3 py-1.5">
                      <div className="flex-1">
                        <span className="text-gray-200 text-xs">{invItem.item.name}</span>
                        <span className="text-gray-500 text-xs ml-2">x{invItem.quantity}</span>
                      </div>
                      <button
                        onClick={() => depositItem(invItem.item)}
                        className="px-3 py-1 bg-blue-600 hover:bg-blue-500 text-white rounded text-xs font-bold transition-all"
                      >
                        存入
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div>
              <p className="text-gray-300 text-xs mb-3 text-center font-bold">📤 取出物品</p>
              {withdrawItems.length === 0 ? (
                <p className="text-gray-500 text-xs text-center">保管处里没有存放任何物品。</p>
              ) : (
                <div className="space-y-1.5 max-h-48 overflow-y-auto">
                  {withdrawItems.map((invItem, index) => (
                    <div key={index} className="flex justify-between items-center bg-gray-800/60 rounded px-3 py-1.5">
                      <div className="flex-1">
                        <span className="text-gray-200 text-xs">{invItem.item.name}</span>
                        <span className="text-gray-500 text-xs ml-2">x{invItem.quantity}</span>
                      </div>
                      <button
                        onClick={() => withdrawItem(invItem.item)}
                        className="px-3 py-1 bg-green-600 hover:bg-green-500 text-white rounded text-xs font-bold transition-all"
                      >
                        取出
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
        <div className="bg-gray-700/30 rounded-lg p-3 text-center">
          <p className="text-gray-400 text-xs">保管处管理员："需要存取什么东西吗？这里很安全，放心使用吧。"</p>
        </div>
      </div>
    );
  };

  const [showFatherDialog, setShowFatherDialog] = useState(false);
  const [fatherDialogStep, setFatherDialogStep] = useState(0);

  const fatherDialogs = [
    '"哼...你还知道回来？"',
    '"我听说你在外面闯出了一点名堂，不过别以为这样就了不起了。"',
    '"这个世界比你想象的还要残酷，你还差得远呢。"',
    '"...不过，既然你选择了这条路，就好好走下去吧。"',
    '"家里永远是你的后盾。需要钱的话...桌上有一些，拿去用吧。"',
    '"但是记住，别给我丢脸！"'
  ];

  const handleFatherDialog = () => {
    if (fatherDialogStep < fatherDialogs.length - 1) {
      setFatherDialogStep(fatherDialogStep + 1);
    } else {
      setShowFatherDialog(false);
      setFatherDialogStep(0);
      // 给玩家一些金币
      if (player.gold < 100) {
        addMessage('👤 父亲："拿去，这是给你的零花钱。"');
        // 增加金币逻辑可以在这里添加
      }
    }
  };

  const renderHomeContent = () => {
    if (showFatherDialog) {
      return (
        <div className="space-y-3">
          <div className="text-center mb-4">
            <p className="text-amber-300 text-sm font-bold">🏠 {building.name}</p>
          </div>
          <div className="bg-amber-800/60 rounded-lg p-4">
            <div className="flex items-center gap-3 mb-3">
              <Portrait id="father" size="sm" />
              <p className="text-amber-300 text-sm font-bold">👤 父亲</p>
            </div>
            <p className="text-amber-200/90 text-sm leading-relaxed mb-4">
              {fatherDialogs[fatherDialogStep]}
            </p>
            <button
              onClick={handleFatherDialog}
              className="w-full py-2 bg-amber-700 hover:bg-amber-600 text-white rounded-lg text-sm font-bold transition-all"
            >
              {fatherDialogStep < fatherDialogs.length - 1 ? '继续' : '离开'}
            </button>
          </div>
        </div>
      );
    }

    return (
      <div className="space-y-3">
        <div className="text-center mb-4">
          <p className="text-amber-300 text-sm font-bold">🏠 {building.name}</p>
          <p className="text-amber-400/70 text-xs mt-1">熟悉的房间，充满了温馨的回忆</p>
        </div>
        <div className="bg-amber-800/40 rounded-lg p-4">
          <div className="flex items-center gap-3 mb-3">
            <Portrait id="father" size="sm" />
            <div className="flex-1">
              <p className="text-amber-300 text-sm font-bold">👤 父亲</p>
              <p className="text-amber-200/70 text-xs">"又是你...有什么事？"</p>
            </div>
          </div>
          <button
            onClick={() => setShowFatherDialog(true)}
            className="w-full py-2 bg-amber-700/60 hover:bg-amber-600/60 text-white rounded-lg text-sm font-medium transition-all"
          >
            💬 和父亲交谈
          </button>
        </div>
        <div className="bg-amber-800/40 rounded-lg p-4 text-center">
          <p className="text-amber-300 text-sm mb-1">家</p>
          <p className="text-amber-200/70 text-xs mb-3">"这里是你的家，随时欢迎回来。"</p>
          <div className="flex justify-center gap-2">
            <button
              onClick={() => {
                rest();
                addMessage('🏠 在家中休息了一会儿，HP恢复了！');
              }}
              className="px-6 py-2 bg-amber-600 hover:bg-amber-500 text-white rounded-lg font-bold text-sm transition-all"
            >
              💤 休息（免费）
            </button>
          </div>
        </div>
        <div className="bg-amber-800/20 rounded-lg p-3">
          <p className="text-amber-200/70 text-xs">
            这是你从小长大的地方，虽然简陋，但充满了温暖的回忆。墙上挂着父亲年轻时的照片...
          </p>
        </div>
      </div>
    );
  };

  const renderHouseContent = () => {
    const isSisterHouse = building.id === 'radom_house2';
    
    if (houseAction === 'rested' && isSisterHouse) {
      return (
        <div className="space-y-3">
          <div className="text-center mb-4">
            <p className="text-teal-300 text-sm font-bold">🏠 {building.name}</p>
          </div>
          <div className="bg-teal-800/40 rounded-lg p-6 text-center">
            <p className="text-teal-300 text-2xl mb-2">🛌</p>
            <p className="text-teal-300 text-sm font-bold mb-2">姐姐帮你铺好了床</p>
            <p className="text-teal-200/70 text-xs mb-3">"好好休息吧，明天又是新的一天。"</p>
            <p className="text-teal-300 font-bold text-sm">全体HP完全恢复了！</p>
          </div>
          <div className="bg-teal-800/20 rounded-lg p-3">
            <p className="text-teal-300 text-xs font-bold mb-1">👤 姐姐</p>
            <p className="text-teal-200/70 text-xs">"弟弟，无论外面多危险，这里永远是你的家。累了就回来休息。"</p>
          </div>
          <button
            onClick={() => setHouseAction('none')}
            className="w-full py-2 bg-teal-700 hover:bg-teal-600 text-white rounded-lg text-xs font-bold transition-all"
          >
            继续和姐姐聊天
          </button>
        </div>
      );
    }

    return (
      <div className="space-y-3">
        <div className="text-center mb-4">
          <p className="text-teal-300 text-sm font-bold">🏠 {building.name}</p>
          <p className="text-teal-400/70 text-xs mt-1">温馨的房间里充满了生活气息</p>
        </div>
        {isSisterHouse && (
          <div className="bg-teal-800/40 rounded-lg p-4 text-center mb-2">
            <p className="text-teal-300 text-sm mb-1">姐姐</p>
            <p className="text-teal-200/70 text-xs mb-3">"弟弟！你终于回来了！快让姐姐看看你...累坏了吧？"</p>
            <div className="flex justify-center gap-2">
              <button
                onClick={() => {
                  rest();
                  setHouseAction('rested');
                  addMessage('🏠 在姐姐家休息了一晚，全体HP完全恢复了！');
                }}
                className="px-6 py-2 bg-teal-600 hover:bg-teal-500 text-white rounded-lg font-bold text-sm transition-all"
              >
                💤 休息（免费）
              </button>
              <button
                onClick={() => {
                  addMessage('👤 姐姐："外面的世界很危险，你一定要多加小心..."');
                  addMessage('👤 姐姐："这些是姐姐为你准备的补给，带上吧。"');
                  // 如果姐姐还没有给过东西，给一些物品
                  if (!storyFlags['sister_gave_items']) {
                    // 给一些参丸和其他补给
                    const existingPills = inventory.find(i => i.item.id === 'i1');
                    if (existingPills) {
                      const newInventory = inventory.map(i => 
                        i.item.id === 'i1' ? { ...i, quantity: i.quantity + 2 } : i
                      );
                      setInventory(newInventory);
                    } else {
                      const pill = items.find(i => i.id === 'i1');
                      if (pill) {
                        setInventory([...inventory, { item: pill, quantity: 2 }]);
                      }
                    }
                    setStoryFlags({ ...storyFlags, 'sister_gave_items': true });
                    addMessage('✨ 姐姐给了你 2 个参丸！');
                  }
                }}
                className="px-4 py-2 bg-teal-700/60 hover:bg-teal-600/60 text-white rounded-lg text-sm transition-all"
              >
                💬 聊一聊
              </button>
            </div>
          </div>
        )}
        {hasNpcs && !isSisterHouse && (
          <div className="space-y-2">
            {npcs.map((npc, index) => (
              <button
                key={index}
                onClick={() => handleNpcClick(index)}
                className="w-full bg-teal-800/30 hover:bg-teal-700/40 text-left p-3 rounded-lg border border-teal-700/30 transition-all"
              >
                <span className="text-teal-300 font-bold text-sm">👤 {npc.name}</span>
                <p className="text-teal-200/70 text-xs mt-1 truncate">{npc.dialogs[0]}</p>
              </button>
            ))}
          </div>
        )}
      </div>
    );
  };

  const renderWorkshopContent = () => (
    <div className="space-y-4">
      <div className="text-center mb-4">
        <p className="text-orange-300 text-sm font-bold">🔧 制造工坊 🔧</p>
        <p className="text-orange-400/70 text-xs mt-1">叮叮当当的敲打声，充满了工业的气息</p>
      </div>
      <div className="bg-orange-800/40 rounded-lg p-4 text-center">
        <p className="text-orange-300 text-sm mb-1">🔧 工匠</p>
        <p className="text-orange-200/70 text-xs mb-3">"欢迎来到制造工坊！在这里你可以购买蓝图，然后使用材料来制造装备。"</p>
        <div className="flex justify-center gap-2">
          <button
            onClick={handleAction}
            className="px-6 py-2 bg-orange-600 hover:bg-orange-500 text-white rounded-lg font-bold text-sm transition-all"
          >
            🔧 进入制造
          </button>
        </div>
      </div>
      <div className="bg-orange-800/20 rounded-lg p-3">
        <p className="text-orange-200/70 text-xs leading-relaxed">
          💡 小提示：你需要先购买蓝图学习制造方法，然后收集足够的材料，就能制造出强大的装备了！
        </p>
      </div>
    </div>
  );

  const renderMainContent = () => {
    switch (building.type) {
      case 'bar': return renderBarContent();
      case 'inn': return renderInnContent();
      case 'shop_human':
      case 'shop_tank': return renderShopContent();
      case 'hospital': return renderHospitalContent();
      case 'office': return renderOfficeContent();
      case 'warehouse': return renderWarehouseContent();
      case 'house': return renderHouseContent();
      case 'home': return renderHomeContent();
      case 'workshop': return renderWorkshopContent();
      default: return <p className="text-gray-400 text-sm text-center">这里什么都没有...</p>;
    }
  };

  const renderDialogContent = () => {
    if (selectedNpc === null) return null;
    const npc = npcs[selectedNpc];
    if (!npc) return null;

    // 显示任务接取界面
    if (showQuestAccept) {
      const quest = allQuests.find(q => q.id === showQuestAccept);
      if (!quest) return null;
      
      return (
        <div className="space-y-4">
          <div className="bg-gray-800/80 rounded-lg p-4 min-h-[120px]">
            <p className="text-yellow-400 font-bold text-sm mb-2">👤 {npc.name}</p>
            <p className="text-gray-200 text-sm leading-relaxed">
              {npc.dialogs[npcDialog]}
            </p>
          </div>
          <div className="bg-amber-900/60 rounded-lg p-4 border border-amber-600">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xl">📜</span>
              <h3 className="text-amber-300 font-bold text-base">{quest.name}</h3>
              {quest.type === 'main' && (
                <span className="bg-red-600 text-white text-xs px-2 py-0.5 rounded font-bold">
                  主线
                </span>
              )}
            </div>
            <p className="text-amber-200/80 text-sm mb-3">{quest.description}</p>
            {quest.dialogueStart && (
              <p className="text-amber-300/70 text-xs italic mb-3">
                "{quest.dialogueStart}"
              </p>
            )}
            <div className="bg-gray-800/60 rounded p-3 mb-3">
              <p className="text-gray-400 text-xs font-semibold mb-2">🎯 任务目标：</p>
              {quest.objectives.map((obj, idx) => (
                <p key={idx} className="text-gray-300 text-xs mb-1">
                  {idx + 1}. {obj.description}
                </p>
              ))}
            </div>
            {quest.rewards && (
              <div className="bg-gray-800/60 rounded p-3">
                <p className="text-gray-400 text-xs font-semibold mb-2">🎁 奖励：</p>
                <div className="flex flex-wrap gap-2">
                  {quest.rewards.gold && (
                    <span className="text-yellow-400 text-xs">💰 {quest.rewards.gold}G</span>
                  )}
                  {quest.rewards.exp && (
                    <span className="text-blue-400 text-xs">✨ {quest.rewards.exp}EXP</span>
                  )}
                </div>
              </div>
            )}
          </div>
          <div className="flex justify-center gap-3">
            <button
              onClick={() => handleAcceptQuest(showQuestAccept)}
              className="px-6 py-2 bg-green-600 hover:bg-green-500 text-white rounded-lg font-bold text-sm transition-all"
            >
              📜 接取任务
            </button>
            <button
              onClick={handleRejectQuest}
              className="px-6 py-2 bg-gray-600 hover:bg-gray-500 text-white rounded-lg font-bold text-sm transition-all"
            >
              暂时不接
            </button>
          </div>
        </div>
      );
    }

    return (
      <div className="space-y-4">
        <div className="bg-gray-800/80 rounded-lg p-4 min-h-[120px]">
          <p className="text-yellow-400 font-bold text-sm mb-2">👤 {npc.name}</p>
          <p className="text-gray-200 text-sm leading-relaxed">
            {npc.dialogs[npcDialog]}
          </p>
        </div>
        <div className="flex justify-between items-center">
          <div className="flex gap-1">
            {npc.dialogs.map((_, i) => (
              <span key={i} className={`w-1.5 h-1.5 rounded-full ${
                i === npcDialog ? 'bg-yellow-400' : 'bg-gray-600'
              }`} />
            ))}
          </div>
          <div className="flex gap-2">
            {npcDialog > 0 && (
              <button
                onClick={handlePrevDialog}
                className="px-3 py-1.5 bg-gray-600 hover:bg-gray-500 text-white rounded-lg text-xs transition-all"
              >
                ◀ 上一条
              </button>
            )}
            {npcDialog < npc.dialogs.length - 1 ? (
              <button
                onClick={handleNextDialog}
                className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs transition-all"
              >
                下一条 ▶
              </button>
            ) : (
              <button
                onClick={handleNextDialog}
                className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs transition-all"
              >
                继续
              </button>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      {activeDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
          <div className="bg-gray-900 border-2 border-yellow-500 rounded-xl shadow-2xl w-full max-w-lg mx-4">
            <div className="bg-gray-800 px-4 py-3 border-b border-yellow-500/50 flex items-center gap-3">
              <Portrait id={activeDialog.speaker === '系统' ? 'npc' : activeDialog.speaker} size="sm" />
              <span className="text-yellow-400 font-bold text-sm">{activeDialog.speaker}</span>
            </div>
            <div className="p-6 min-h-[120px] flex items-center justify-center">
              <p className="text-gray-100 text-base leading-relaxed text-center whitespace-pre-line">
                {activeDialog.content}
              </p>
            </div>
            <div className="bg-gray-800 px-4 py-3 border-t border-yellow-500/50 flex justify-center">
              <button
                onClick={nextDialog}
                className="px-8 py-2 bg-yellow-600 hover:bg-yellow-500 text-white rounded-lg font-bold text-sm transition-all"
              >
                继续
              </button>
            </div>
          </div>
        </div>
      )}
      <div className={`min-h-[400px] rounded-xl border-2 ${getBuildingInteriorStyle()} p-4`}>
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-white/10">
          <div className="flex items-center gap-2">
            <span className="text-2xl">{getBuildingIcon()}</span>
            <div>
              <h2 className="text-white font-bold text-base">{building.name}</h2>
              <p className="text-white/50 text-xs">{currentLoc?.name}</p>
            </div>
          </div>
          <button
            onClick={handleBack}
            className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-1.5 rounded-lg text-xs font-medium transition-all"
          >
            🚪 离开
          </button>
        </div>

        <div className="min-h-[200px]">
          {showContent === 'main' ? renderMainContent() : renderDialogContent()}
        </div>
      </div>
    </>
  );
};

export default BuildingScreen;