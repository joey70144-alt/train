import { Scenario } from '../types/game';

export const SCENARIOS: Scenario[] = [
  {
    id: 'scenario-1',
    code: 'SCN-01',
    title: '經典岔道',
    subtitle: '結果主義與主動作為的重壓',
    theme: '結果與責任',
    description: '一列失控的無人工程重軌列車正朝著前方軌道高速駛來。主線上正有五名維修人員在工作，而支線上有一名鐵路巡檢員。你站在控制道岔的手動連桿旁。',
    briefing:
      '中央控制系統失去對編號 T-104 列車的制動回應。你在 7 號道岔哨所，手中的機械道岔扳柄是最後能變更行駛路徑的實體裝置。若不採取行動，列車將沿主線衝過；若扳動拉桿，列車將改道進入支線。',
    knownFacts: [
      '主線上共有 5 名正在檢修鋼軌的工人，因隔音耳罩與強風，目前未能察覺列車逼近。',
      '支線上只有 1 名落單的鐵路巡視人員，正背向哨所進行線路測量。',
      '列車煞車完全失靈，依目前動能無法在分岔點前停下。',
      '道岔扳柄機械結構正常，切換耗時不到 1 秒。'
    ],
    unknownFacts: [
      {
        id: 'u1-1',
        description: '支線末端的避難緩衝擋板已年久失修，但該名工人可能在最後一刻聽見輪軌尖嘯。',
        revealedByDefault: false
      },
      {
        id: 'u1-2',
        description: '主線上的五人小組原本不應在未通知調度的情況下上線施工，屬重大安全違規。',
        revealedByDefault: true
      }
    ],
    duration: 25,
    defaultChoiceId: 'maintain',
    options: [
      {
        id: 'switch',
        label: '切換道岔 (導入支線)',
        description: '改道支線，保全主線 5 人',
        outcomeId: 'outcome-switched'
      },
      {
        id: 'maintain',
        label: '維持現狀 (不干預)',
        description: '維持直行，不轉移危險',
        outcomeId: 'outcome-maintained'
      }
    ],
    outcomes: {
      'outcome-switched': {
        id: 'outcome-switched',
        title: '轉轍入側：主動介入的代價',
        summary: '列車隨著金屬撞擊聲猛烈轉入右側支線。',
        description:
          '你用力推下道岔扳柄，鋼軌簧片啪地緊密咬合。高速列車帶著尖銳的鐵輪摩擦聲衝入側線，主線上的五名工人在震耳欲聾的呼嘯中驚魂未定地抬頭，倖免於難；然而側線上的一名巡檢人員避無可避。你的一念之間，主動改變了一名無辜者的命運，換取了另外五個人的生還。',
        consequences: {
          casualties: 1,
          saved: 5,
          delayOrDamageNote: '支線設施受損，主線施工人員生還但受心理重創。'
        },
        trainBehavior: 'SWITCH_TO_BRANCH',
        reflectionNotes: [
          '功利主義（Utilitarianism）視角：以 1 人的代價換取 5 人的生存，總體福祉獲得了最大化。',
          '義務論（Deontology）視角：你主動將原本處於安全情境的第 6 人轉化為救人的工具，承擔了直接致死的因果責任。',
          '在法學與倫理學中，作為（Action）與不作為（Omission）的界線始終是最激烈的論爭焦點。'
        ]
      },
      'outcome-maintained': {
        id: 'outcome-maintained',
        title: '任其自流：不作為的沉重觀望',
        summary: '列車沿著既定主線呼嘯而過，你未曾轉動扳柄。',
        description:
          '你佇立在道岔控制台前，雙手沒有拉下連桿。列車毫無阻礙地沿著主線疾馳，五名來不及避讓的維修人員被捲入衝擊中。支線上的巡檢員在遠處茫然回頭，看著遠方騰起的煙塵。你沒有親手將危機轉移給任何無辜的人，但五條生命在你的注視下殞落。',
        consequences: {
          casualties: 5,
          saved: 1,
          delayOrDamageNote: '主線發生重大伤亡事故，全線停運調查。'
        },
        trainBehavior: 'STAY_MAIN',
        reflectionNotes: [
          '義務論原則主張「不可殺人」，因此拒絕親手將列車轉向本不該承受危險的第三方。',
          '但當你擁有干預的權力與能力時，「袖手旁觀」是否在道德上也構成了一種選擇？',
          '不承擔「行凶者」的罪名，是否意味著放任「悲劇」發生是可被接受的？'
        ]
      }
    },
    reflectionQuestions: [
      {
        question: '如果這名唯一的支線工人是你熟識的朋友，你的選擇會改變嗎？這是否代表我們的道德判斷具有親疏偏見？',
        philosophicalContext: '關於公正性（Impartiality）與特殊義務（Special Obligations）的衝突。'
      },
      {
        question: '你認為「主動按下開關致一人死」與「袖手旁觀導致五人死」，哪一種在心理上更難以承受？為什麼？',
        philosophicalContext: '作為與不作為效應（Omission Bias）以及雙重效應原則（Doctrine of Double Effect）。'
      }
    ],
    sceneConfig: {
      weather: 'foggy_dawn',
      fogDensity: 0.015,
      lightColor: '#e0ecf8',
      ambientColor: '#2a3b4c',
      playerSpawn: [3.5, 1.7, 4],
      playerLookAt: [0, 1.2, -10],
      trainSpeed: 14,
      mainTrackVictims: 5,
      branchTrackVictims: 1,
      interactiveLever: true,
      interactiveBrake: false,
      interactiveRadio: false
    }
  },
  {
    id: 'scenario-2',
    code: 'SCN-02',
    title: '緊急制動',
    subtitle: '霧靄中的感測器與不可逆代價',
    theme: '不確定性與風險',
    description: '行經長隧道的貨客混編列車傳來前方軌道落石警報。感測器顯示落石機率 45%，若啟動緊急死寂制動，列車內 120 名站立旅客將受劇烈拋擲重傷且貨廂可能翻覆。',
    briefing:
      '你是指揮室行車調度員。前方 3 號鐵路長隧道內回傳異常震動信號。儀表指示前方可能發生了小規模塌方落石。你手中有強制緊急制動開關。若現在煞車，列車可以在洞口前以極高減速度停下，但將造成大批車內人員因慣性衝撞重傷；若確認狀態需調用深層遙測花費 8 秒；若維持運轉，列車將以原速入洞。',
    knownFacts: [
      '列車目前時速 95 km/h，載有 120 名返家旅客與高壓瓦斯液罐車。',
      '現行感測器老化，歷史上有 55% 的誤報率（強陣風或落葉曾觸發震動）。',
      '即刻緊急制動將導致至少 30 名旅客因劇烈撞擊骨折或重傷，液罐車有 15% 脫軌破裂風險。',
      '距離隧道入口僅剩 18 秒反應時間。'
    ],
    unknownFacts: [
      {
        id: 'u2-telemetry',
        description: '遙測結果：前方確有一塊約 1.5 噸巨石卡於左側鋼軌上，足以導致列車翻覆！',
        revealedByDefault: false
      },
      {
        id: 'u2-speed',
        description: '司機員因隧道口反光，完全看不清洞內情況。',
        revealedByDefault: true
      }
    ],
    duration: 20,
    defaultChoiceId: 'maintain_cruise',
    options: [
      {
        id: 'emergency_brake',
        label: '立刻啟動強制緊急制動',
        description: '立即急停，消除正面出軌風險',
        outcomeId: 'outcome-ebrake'
      },
      {
        id: 'verify_status',
        label: '連線遙測確認 (耗費 8 秒)',
        description: '消耗時間查明洞內真相',
        timeCost: 8,
        revealsUnknownId: 'u2-telemetry',
        outcomeId: 'outcome-verified-wait'
      },
      {
        id: 'maintain_cruise',
        label: '相信誤報率，維持原速巡航',
        description: '視為日常誤報，避免乘客受傷',
        outcomeId: 'outcome-cruise'
      }
    ],
    outcomes: {
      'outcome-ebrake': {
        id: 'outcome-ebrake',
        title: '火花四濺的急停：防患未然的代價',
        summary: '鋼輪抱死，列車在漫天金屬火花與刺耳尖叫聲中於洞口前 10 公尺剎停。',
        description:
          '你猛烈扳下紅色緊急制動閥。氣壓管路瞬間釋放，整列列車劇烈頓挫，車廂內行李橫飛，數十名旅客在慣性中重摔受傷；液罐車劇烈晃動，所幸未破裂。雖然造成了多人傷勢與大批賠償，但你徹底排除了毀滅性正面出軌的可能。',
        consequences: {
          casualties: 0,
          saved: 120,
          delayOrDamageNote: '34 名乘客因衝撞受傷送醫，鐵路中斷檢修數小時。'
        },
        trainBehavior: 'EMERGENCY_STOP',
        reflectionNotes: [
          '風險管理中的「預防原則」（Precautionary Principle）：當潛在威脅是不可逆的災難時，即使機率未定，也應採取預防措施。',
          '事後若發現軌道其實安全，決策者往往會被公眾譴責為「過度反應」；而真正的災難被阻止時，人們往往忽略了原本的危險。'
        ]
      },
      'outcome-cruise': {
        id: 'outcome-cruise',
        title: '盲目的豪賭：巨石撞擊',
        summary: '列車衝入黑暗隧道，隨即迎面撞上卡在鋼軌上的巨石。',
        description:
          '你選擇相信這是一次常態性感測器誤報，列車未作減速直衝隧道。一秒鐘後，巨石將機車頭剷出鋼軌，車廂劇烈摺疊扭曲，引發嚴重大火與結構塌陷。期望的僥倖最終化為無法承受的災難。',
        consequences: {
          casualties: 42,
          saved: 78,
          delayOrDamageNote: '重大脫軌爆炸事故，隧道嚴重損毀。'
        },
        trainBehavior: 'DERAIL_CONTROLLED',
        reflectionNotes: [
          '賭徒謬誤與正常化偏誤（Normalcy Bias）：過去許多次誤報，讓人們傾向於假設「這次也不會有事」。',
          '當代價是非對稱的（一方是受傷，一方是全滅），數學期望值計算是否依然適用？'
        ]
      },
      'outcome-verified-wait': {
        id: 'outcome-verified-wait',
        title: '查明真相但時機緊迫：臨界制動',
        summary: '光纖影像在第 8 秒傳回——巨石赫然在目！列車在僅存距離全力煞車。',
        description:
          '你冷靜啟動深度遙測。屏幕跳出雜訊後清晰顯現：一塊巨石正阻於鐵軌中央！你立刻抓起制動手柄拉到底。因為晚了 8 秒，制動距離逼近極限，機車頭撞碎了巨石邊緣才終於停下，劇烈的衝擊仍造成車內旅客受傷，但成功避免了翻覆爆炸。',
        consequences: {
          casualties: 2,
          saved: 118,
          delayOrDamageNote: '機車頭輕度損毀，部分乘客擦挫傷。'
        },
        trainBehavior: 'EMERGENCY_STOP',
        reflectionNotes: [
          '「資訊的價值」永遠伴隨著「時間的消耗」。在危機處理中，追求 100% 確定性的代價往往是失去行動窗口。',
          '在不完全資訊下決策，往往是現代工程與治理中最痛苦的本質。'
        ]
      }
    },
    reflectionQuestions: [
      {
        question: '如果感測器回報的塌方機率只有 5%，你還會選擇主動讓 30 人因急停骨折受傷嗎？那個道德門檻在哪裡？',
        philosophicalContext: '風險倫理學（Ethics of Risk）與最小期望傷害原則。'
      },
      {
        question: '如果事後證實軌道完全沒有落石，你會為自己啟動急停傷害乘客而感到內疚嗎？為什麼事後諸葛（Hindsight Bias）總會干擾我們的道德評價？',
        philosophicalContext: '道德運氣（Moral Luck）與事後認知偏差。'
      }
    ],
    sceneConfig: {
      weather: 'dusk_storm',
      fogDensity: 0.022,
      lightColor: '#ffb38a',
      ambientColor: '#201e2c',
      playerSpawn: [2, 1.8, 5],
      playerLookAt: [0, 1.5, -20],
      trainSpeed: 18,
      mainTrackVictims: 0,
      branchTrackVictims: 0,
      interactiveLever: false,
      interactiveBrake: true,
      interactiveRadio: true
    }
  },
  {
    id: 'scenario-3',
    code: 'SCN-03',
    title: '誰的責任',
    subtitle: '權威命令與現場良知的拉鋸',
    theme: '服從命令與個人責任',
    description: '區域行車總監透過無線電嚴厲下達「忽略假警報，立刻放行特快特權列車」指令。但你眼前道岔上的機械閉鎖燈正顯示致命紅光。',
    briefing:
      '第 45 號道岔號誌台。這是一列載有外賓與重要物資的直達特快車。總行車室調度長官下達強制指令要求解除封鎖，宣稱閉鎖燈為地線短路所致，並警告你若延誤列車將以瀆職論處並追究法律責任。但你肉眼可見道岔尖軌間似卡有異物。',
    knownFacts: [
      '調度主管具備最高法定調度權，其指令受鐵路安全管理法背書，由系統全程錄音存查。',
      '若你遵從指示放行，法律責任在形式上歸屬於簽署命令的調度長官。',
      '號誌燈為閃爍紅燈，現場閉鎖感測器檢測到岔心未正確鎖定。',
      '若你手動將列車引導至減速側線，將使特快車延誤 40 分鐘，可能面臨嚴厲的懲戒處分。'
    ],
    unknownFacts: [
      {
        id: 'u3-debris',
        description: '道岔尖軌確實被一根脫落的鋼構件卡死，若列車以 80km/h 碾過將 100% 發生致命擠岔出軌。',
        revealedByDefault: false
      },
      {
        id: 'u3-boss',
        description: '調度長官面臨今日績效考評壓力，在未曾親臨現場的情況下做出了推斷。',
        revealedByDefault: true
      }
    ],
    duration: 25,
    defaultChoiceId: 'follow_orders',
    options: [
      {
        id: 'follow_orders',
        label: '依照上級書面命令放行',
        description: '服從指揮，全速通過',
        outcomeId: 'outcome-followed'
      },
      {
        id: 'halt_and_verify',
        label: '抗命拒絕放行，原地阻斷',
        description: '以現場紅燈為準，強制迫停',
        outcomeId: 'outcome-halted'
      },
      {
        id: 'divert_to_relief',
        label: '手動改引至安全緩衝側線',
        description: '避開危險道岔，保全安全',
        outcomeId: 'outcome-diverted'
      }
    ],
    outcomes: {
      'outcome-followed': {
        id: 'outcome-followed',
        title: '權威的盲從：擠岔出軌',
        summary: '列車遵照調度指令以全速掠過，在卡死的道岔處劇烈跳軌。',
        description:
          '你選擇了服從指揮官的權威命令。列車以 80 公里時速衝過道岔，卡在尖軌間的金屬構件瞬間撕裂了輪緣，整列特快車衝出路基翻覆。事後調查雖然證實是長官的決策失誤，但在冰冷的事故現場前，「我只是奉命行事」的辯解無法平息你內心深處的自責。',
        consequences: {
          casualties: 18,
          saved: 40,
          delayOrDamageNote: '重大傷亡事故，指揮官與操作員皆面臨刑事訴訟。'
        },
        trainBehavior: 'DERAIL_CONTROLLED',
        reflectionNotes: [
          '紐倫堡審判原則與米爾格倫實驗（Milgram experiment）：服從體系階層的權威，是否能免除個人的道德實質責任？',
          '在龐大官僚或制度機器中，每個人都自詡為小齒輪，正是現代性倫理危機的一大根源。'
        ]
      },
      'outcome-halted': {
        id: 'outcome-halted',
        title: '良知的抵抗：怒火中的拯救',
        summary: '特快車在紅燈前憤怒地急煞停下，避免了致命擠岔。',
        description:
          '你頂住無線電那頭主管的咆哮與恐嚇，堅決拉下紅色絕對停止號誌。列車司機員緊迫煞停在道岔前 50 公尺。維修人員趕到現場，赫然從岔尖內取出一根卡死的厚重鋼梁。調度室的怒吼戛然而止，你的勇氣挽救了全車人的性命。',
        consequences: {
          casualties: 0,
          saved: 58,
          delayOrDamageNote: '班次延誤 50 分鐘，長官遭內部調職調查，你受到基層敬重。'
        },
        trainBehavior: 'EMERGENCY_STOP',
        reflectionNotes: [
          '康德倫理學的自律（Autonomy）：真正的道德主體是依據普遍理性而非外界權威行事。',
          '然而，在真實情境中，抗命者如果事後發現只是虛驚一場，往往得不到掌聲，只有行政處分。'
        ]
      },
      'outcome-diverted': {
        id: 'outcome-diverted',
        title: '務實的折衷：低速避難側線',
        summary: '列車被安全引導至減速側線，平穩滑行停靠。',
        description:
          '你沒有直接對抗，也沒有盲目服從，而是冷靜切換至側向安全線。特快車雖然慢了下來，旅客因為延誤而頗有抱怨，但列車全員毫髮無傷地避開了損壞的道岔。你找到了制度指令與人身安全之間的高超平衡。',
        consequences: {
          casualties: 0,
          saved: 58,
          delayOrDamageNote: '列車延誤 40 分鐘，需撰寫異常處置報告。'
        },
        trainBehavior: 'SWITCH_TO_BRANCH',
        reflectionNotes: [
          '亞里斯多德的中庸與實踐智慧（Phronesis）：倫理不只是黑與白的二元對抗，而是尋找當下環境中的最佳可行善（The Golden Mean）。',
          '有時道德的真正考驗不是「當英雄」或「當幫兇」，而是運用專業智慧化解死局。'
        ]
      }
    },
    reflectionQuestions: [
      {
        question: '如果事後拆解道岔，發現那道紅光「真的只是電路誤報」，你被公司以重大疏失開除，你還會堅持抗命是正確的嗎？',
        philosophicalContext: '信念認識責任（Epistemic Responsibility）與後果論評價的脫節。'
      },
      {
        question: '在組織架構中，「專家現場判斷」與「中央全局指揮」發生衝突時，決策優先權應該如何制度化？',
        philosophicalContext: '制度倫理與分散式決策權限設計。'
      }
    ],
    sceneConfig: {
      weather: 'overcast_noon',
      fogDensity: 0.012,
      lightColor: '#f0f4f8',
      ambientColor: '#303842',
      playerSpawn: [3.2, 1.8, 3.5],
      playerLookAt: [0, 1.3, -12],
      trainSpeed: 15,
      mainTrackVictims: 0,
      branchTrackVictims: 0,
      interactiveLever: true,
      interactiveBrake: true,
      interactiveRadio: true
    }
  },
  {
    id: 'scenario-4',
    code: 'SCN-04',
    title: '無法兼顧',
    subtitle: '極限資源下的分流與價值衡量',
    theme: '資源分配與倫理原則',
    description: '嚴冬暴雪夜，兩條幹線同時告急：北線斷電導致三名年老巡道工受困面臨失溫死亡，南線貨列氣壓外洩若不及時派巡軌車導航恐滑向人口稠密市鎮。你手頭僅有一組應急資源。',
    briefing:
      '極端氣候突襲山區鐵路調度樞紐。通訊塔頻頻中斷。北線（高山區）有 3 名年邁道工因軌道供電中斷困在零下 18 度的除雪棚，預計 15 分鐘後將失溫危及生命；南線（下坡道）一列重載鋼材貨車因煞車管漏氣正緩慢滑行，如果沒有調度引導車在前方開道清空道岔，有 30% 機率在市郊道口撞擊夜市車潮。你只能將唯一運作中的應急內燃機車與救護班派往其中一個方向，或嘗試強行分拆資源。',
    knownFacts: [
      '應急資源：1 輛重型全天候內燃救援車、4 名專業救援隊員。',
      '北線工人：生命危險為 100%（若不及時送達保暖與供電設備，3 人必死無疑）。受影響人數：3 人。',
      '南線下坡車：災難機率為 30%（有機會因自然阻力在坡底自行停下，但一旦失控將威脅市郊數十人生命）。',
      '暴風雪導致兩線相距 20 公里，無法同時先救一處再去另一處。'
    ],
    unknownFacts: [
      {
        id: 'u4-weather',
        description: '高山除雪棚的備用柴油發電機尚有 10% 殘存電力，但在通報中被誤判為完全耗盡。',
        revealedByDefault: false
      },
      {
        id: 'u4-grade',
        description: '南線下坡道口的自動警告鈴目前正常通電運作中。',
        revealedByDefault: true
      }
    ],
    duration: 30,
    defaultChoiceId: 'prioritize_guaranteed',
    options: [
      {
        id: 'prioritize_guaranteed',
        label: '全力救援北線工人',
        description: '確保 3 名受困工人平安生還',
        outcomeId: 'outcome-north'
      },
      {
        id: 'prioritize_high_impact',
        label: '全力馳援南線貨車',
        description: '防範市郊重大傷亡風險',
        outcomeId: 'outcome-south'
      },
      {
        id: 'split_resources',
        label: '冒險折衷分流資源',
        description: '兩線兼顧，承擔折衷風險',
        outcomeId: 'outcome-split'
      }
    ],
    outcomes: {
      'outcome-north': {
        id: 'outcome-north',
        title: '守護眼前的同袍：確定的救贖與遠處的慶幸',
        summary: '救援隊在最後關頭趕抵北線工棚，三名工人獲救。',
        description:
          '你選擇了拯救確定即將殞落的生命。全天候救援車突破厚重積雪抵達北線除雪棚，醫護人員將失溫昏迷的三名老工人救出送醫，全員脫離險境。而南線失控的貨列在滑行 4 公里後，幸運地在平緩坡段因重力平衡停下，並未衝入城鎮。你以仁慈拯救了確定的人，並在幸運中度過了這場漫長寒夜。',
        consequences: {
          casualties: 0,
          saved: 3,
          delayOrDamageNote: '北線工人全數康復，南線通宵警戒清理。'
        },
        trainBehavior: 'SLOW_PASS',
        reflectionNotes: [
          '確認效應（Identifiable Victim Effect）：人們對「具體已知的受害者」往往抱有遠高於「統計學上的潛在受害者」的同理心。',
          '在道德直覺中，放任眼前垂死的人不救，往往會受到良心最強烈的鞭笞。'
        ]
      },
      'outcome-south': {
        id: 'outcome-south',
        title: '公共安全的第一防線：大局與無聲的犧牲',
        summary: '救援車成功將失控鋼材貨列引導逼停，但北線傳來了噩耗。',
        description:
          '你將資源投入防範城鎮遭受重大傷亡的風險。救援車在南線關鍵道岔前成功接應貨車，利用機車重載煞車平穩迫停，保衛了市郊數百戶居民的安寧。然而黎明破曉時，通訊恢復的北線傳來令人心碎的消息：三名老工人終究沒能熬過寒夜。你在大局的功勳章背後，背負著三條戰友生命的沉重陰影。',
        consequences: {
          casualties: 3,
          saved: 50,
          delayOrDamageNote: '保護了市郊社區的安全，但失去了三名老員工。'
        },
        trainBehavior: 'EMERGENCY_STOP',
        reflectionNotes: [
          '功利主義期望值計算：30% 機率死 50 人 = 期望死亡 15 人；救援南線在數學上是「最理性」的決定。',
          '然而，當我們為了抽象的統計數字而犧牲真實有名有姓的人時，人是否被當成了冰冷的統計數據？'
        ]
      },
      'outcome-split': {
        id: 'outcome-split',
        title: '分拆的豪賭：極限邊緣的考驗',
        summary: '兩邊均在資源匱乏中掙扎，代價與奇蹟並存。',
        description:
          '你選擇了折衷方案。輕裝前進的北線救援人員因缺乏重型除雪設備在半途受阻，僅救出其中兩人，另一人不幸身故；而南線因缺乏隨車救護員，救援機車司機在強行掛接時受重傷，但成功迫停了貨車。這種「兼顧兩者」的努力並未帶來完美的結局，但向極限爭取到了每一分可能。',
        consequences: {
          casualties: 1,
          saved: 52,
          delayOrDamageNote: '北線 1 人不幸失溫，南線成功阻截，1 名救援人員受傷。'
        },
        trainBehavior: 'SLOW_PASS',
        reflectionNotes: [
          '在現實管理與悲劇性困境中，「兩全其美」往往是不切實際的幻想，分散資源有時反而提高整體失敗率。',
          '面對有限性是倫理學最嚴肅的課題：人類必須學會在有限的條件下承擔不完美的後果。'
        ]
      }
    },
    reflectionQuestions: [
      {
        question: '救助「確定即將死亡的少數人」與「有一定機率遭受重大死傷的多數人」，哪一個在倫理上更具急迫性？',
        philosophicalContext: '義務論的救助急迫性 vs 功利主義的風險期望值。'
      },
      {
        question: '在醫療檢傷分類（Triage）中，重症分配往往殘酷而理性；你認為公共交通與災難應變是否也應套用相同的冷靜算法？',
        philosophicalContext: '分配正義（Distributive Justice）與災難檢傷倫理。'
      }
    ],
    sceneConfig: {
      weather: 'midnight_snow',
      fogDensity: 0.02,
      lightColor: '#c8dcff',
      ambientColor: '#141824',
      playerSpawn: [3.8, 1.8, 4.5],
      playerLookAt: [0, 1.2, -15],
      trainSpeed: 12,
      mainTrackVictims: 0,
      branchTrackVictims: 0,
      interactiveLever: true,
      interactiveBrake: true,
      interactiveRadio: true
    }
  }
];
