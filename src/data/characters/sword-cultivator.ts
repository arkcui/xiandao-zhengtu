import type { CharacterDef, Relic } from '@/types';

export const swordCultivator: CharacterDef = {
  id: 'sword-cultivator',
  name: '云无涯',
  archetype: '剑修',
  startingDeck: [
    'strike-sword',
    'strike-sword',
    'strike-sword',
    'strike-sword',
    'guard-cloud',
    'guard-cloud',
    'guard-cloud',
    'guard-cloud',
    'sword-breath',
    'sword-breath',
  ],
  startingRelic: 'plain-sword-core',
  maxHp: 75,
  passive: '剑意会同时提高攻击牌伤害。',
  story: '出身云麓剑庐，携一枚未开锋的本命剑丸入世问道。',
};

export const starterRelic: Relic = {
  id: 'plain-sword-core',
  name: '素心剑丸',
  rarity: 'starter',
  description: '战斗开始时获得 1 层剑意。',
  trigger: 'on_combat_start',
  effect: { type: 'sword_intent', value: 1, target: 'self' },
};
