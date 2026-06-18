import type { Potion } from '@/types';

export const potions: Potion[] = [
  {
    id: 'minor-heal-pill',
    name: '回春丹',
    description: '回复 14 点生命。',
    effect: { type: 'heal', value: 14, target: 'self' },
  },
  {
    id: 'spirit-pill',
    name: '聚灵丹',
    description: '下次战斗中可作为奖励使用，当前版本用于收藏。',
    effect: { type: 'energy', value: 2, target: 'self' },
  },
  {
    id: 'iron-skin-pill',
    name: '金肌丹',
    description: '获得 12 点护盾。',
    effect: { type: 'block', value: 12, target: 'self' },
  },
];
