import type { Card } from '@/types';
import type { SeededRNG } from './rng';
import { getCardPool } from '@/data/cards';

export interface Reward {
  gold: number;
  cards: Card[];
}

export function generateCombatReward(type: 'normal' | 'elite' | 'boss', characterId: string, rng: SeededRNG): Reward {
  const rarity = type === 'boss' || rng.next() > 0.86 ? 'rare' : rng.next() > 0.55 ? 'uncommon' : 'common';
  return {
    gold: type === 'elite' ? rng.nextInt(35, 55) : rng.nextInt(12, 25),
    cards: rng.shuffle(getCardPool(characterId, rarity)).slice(0, 3),
  };
}
