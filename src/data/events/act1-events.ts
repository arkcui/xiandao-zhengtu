import type { GameEvent } from '@/types';

export const act1Events: GameEvent[] = [
  {
    id: 'moonwell',
    title: '月井照心',
    description: '山腰有一眼古井，井中月影不随波动。你俯身望去，似乎看见另一条修行路。',
    choices: [
      { id: 'drink', label: '饮一口井水', preview: '回复 12 点生命。', effect: { hp: 12 } },
      { id: 'meditate', label: '映照本心', preview: '失去 5 点生命，获得 1 张小还丹。', effect: { hp: -5, addCardId: 'golden-elixir' } },
      { id: 'leave', label: '不扰清辉', preview: '离开。', effect: {} },
    ],
  },
  {
    id: 'sword-tomb',
    title: '荒冢断剑',
    description: '野草间插着半截断剑，剑身仍有微弱灵光。取走它也许能补全你的剑意。',
    choices: [
      { id: 'claim', label: '拔出断剑', preview: '获得 35 灵石，失去 7 点生命。', effect: { gold: 35, hp: -7 } },
      { id: 'listen', label: '听剑鸣', preview: '获得 1 张御剑横空。', effect: { addCardId: 'flying-sword' } },
      { id: 'bury', label: '重新掩埋', preview: '最大生命 +4。', effect: { maxHp: 4, hp: 4 } },
    ],
  },
  {
    id: 'wandering-alchemist',
    title: '游方丹师',
    description: '一名白眉丹师坐在松下，炉火青蓝。他愿用一味丹方换走你身上一点杂念。',
    choices: [
      { id: 'trade', label: '请他洗练杂念', preview: '移除一张随机牌，失去 20 灵石。', effect: { gold: -20, removeRandomCard: true } },
      { id: 'buy', label: '买一炉药香', preview: '失去 12 灵石，回复 18 生命。', effect: { gold: -12, hp: 18 } },
      { id: 'pass', label: '拱手告辞', preview: '离开。', effect: {} },
    ],
  },
];
