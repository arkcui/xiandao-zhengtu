import type { Enemy } from '@/types';

export const act1Enemies: Enemy[] = [
  {
    id: 'wild-spirit',
    name: '游荡灵魄',
    hp: [18, 24],
    type: 'normal',
    ai: { type: 'pattern' },
    moves: [
      { id: 'scratch', name: '阴爪', intent: 'attack', effects: [{ type: 'damage', value: 6 }] },
      { id: 'drift', name: '聚阴', intent: 'defend', effects: [{ type: 'block', value: 5 }] },
    ],
  },
  {
    id: 'bandit-cultivator',
    name: '散修劫匪',
    hp: [26, 32],
    type: 'normal',
    ai: { type: 'weighted_random' },
    moves: [
      { id: 'slash', name: '劫火刀', intent: 'attack', weight: 4, effects: [{ type: 'damage', value: 8 }] },
      { id: 'taunt', name: '破胆喝', intent: 'debuff', weight: 2, effects: [{ type: 'debuff', buffId: 'weak', buffName: '虚弱', value: 1, duration: 2 }] },
    ],
  },
  {
    id: 'stone-guardian',
    name: '山门石傀',
    hp: [58, 66],
    type: 'elite',
    ai: { type: 'pattern' },
    moves: [
      { id: 'smash', name: '镇山击', intent: 'attack', effects: [{ type: 'damage', value: 13 }] },
      { id: 'harden', name: '岩甲', intent: 'defend', effects: [{ type: 'block', value: 12 }] },
      { id: 'rumble', name: '碎岩震', intent: 'attack_defend', effects: [{ type: 'damage', value: 8 }, { type: 'block', value: 6 }] },
    ],
  },
  {
    id: 'fox-demon',
    name: '赤尾狐妖',
    hp: [95, 105],
    type: 'boss',
    ai: { type: 'conditional' },
    moves: [
      { id: 'flame-tail', name: '狐火尾', intent: 'attack', weight: 3, effects: [{ type: 'damage', value: 14 }] },
      { id: 'bewilder', name: '魅惑雾', intent: 'debuff', weight: 2, effects: [{ type: 'debuff', buffId: 'vulnerable', buffName: '易伤', value: 1, duration: 2 }] },
      { id: 'rage', name: '赤尾怒相', intent: 'buff', weight: 1, effects: [{ type: 'buff', buffId: 'strength', buffName: '力量', value: 3 }] },
    ],
  },
];
