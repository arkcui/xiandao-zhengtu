import { describe, expect, it } from 'vitest';
import type { Card, EnemyInstance } from '@/types';
import { SeededRNG } from './rng';
import { applyBlock, calculateDamage, checkCombatEnd, drawCards, initCombat, playCard } from './combat';

const strike: Card = {
  id: 'strike',
  name: '试剑',
  type: 'attack',
  rarity: 'starter',
  cost: 1,
  description: '造成伤害。',
  upgraded: false,
  character: 'neutral',
  effects: [{ type: 'damage', value: 6 }],
};

const guard: Card = {
  id: 'guard',
  name: '护体',
  type: 'skill',
  rarity: 'starter',
  cost: 1,
  description: '获得护盾。',
  upgraded: false,
  character: 'neutral',
  effects: [{ type: 'block', value: 5 }],
};

function enemy(): EnemyInstance {
  return {
    instanceId: 'e1',
    id: 'e',
    name: '测试敌',
    maxHp: 20,
    hp: 20,
    block: 0,
    type: 'normal',
    buffs: [],
    moves: [{ id: 'hit', name: '击', intent: 'attack', effects: [{ type: 'damage', value: 3 }] }],
    ai: { type: 'pattern' },
    moveIndex: 0,
    intent: { id: 'hit', name: '击', intent: 'attack', effects: [{ type: 'damage', value: 3 }] },
    repeatCount: 1,
    defeated: false,
  };
}

describe('combat engine', () => {
  it('计算力量、虚弱、易伤组合伤害', () => {
    const attacker = { buffs: [{ id: 'strength' as const, name: '力量', stacks: 2, duration: null, type: 'buff' as const }] };
    const defender = { buffs: [{ id: 'vulnerable' as const, name: '易伤', stacks: 1, duration: 1, type: 'debuff' as const }] };
    expect(calculateDamage(6, attacker, defender)).toBe(12);
  });

  it('护盾吸收伤害', () => {
    const state = initCombat({ maxHp: 40, hp: 40, deck: [strike, guard] }, [enemy()], new SeededRNG(1));
    const blocked = applyBlock(state, 'player', 0, 5);
    expect(blocked.player.block).toBe(5);
  });

  it('抽牌堆不足时洗入弃牌堆', () => {
    const state = initCombat({ maxHp: 40, hp: 40, deck: [strike] }, [enemy()], new SeededRNG(1));
    const drawn = drawCards({ ...state, hand: [], drawPile: [], discardPile: [guard] }, 1);
    expect(drawn.hand).toHaveLength(1);
    expect(drawn.discardPile).toHaveLength(0);
  });

  it('正常出牌会消耗灵力并移动到弃牌堆', () => {
    const state = initCombat({ maxHp: 40, hp: 40, deck: [strike, guard, guard, guard, guard] }, [enemy()], new SeededRNG(1));
    const next = playCard({ ...state, hand: [strike] }, 0, 0);
    expect(next.energy).toBe(2);
    expect(next.discardPile.some((card) => card.name === '试剑')).toBe(true);
    expect(next.enemies[0].hp).toBe(14);
  });

  it('检测胜负', () => {
    const state = initCombat({ maxHp: 40, hp: 40, deck: [strike] }, [enemy()], new SeededRNG(1));
    expect(checkCombatEnd({ ...state, enemies: [{ ...state.enemies[0], hp: 0, defeated: true }] })).toBe('win');
    expect(checkCombatEnd({ ...state, player: { ...state.player, hp: 0 } })).toBe('lose');
  });
});
