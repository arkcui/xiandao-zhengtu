import type { Card, Potion } from '@/types';
import type { SeededRNG } from './rng';
import { getCardPool } from '@/data/cards';
import { potions } from '@/data/potions';

export interface ShopCardItem {
  card: Card;
  price: number;
  sold: boolean;
}

export interface ShopPotionItem {
  potion: Potion;
  price: number;
  sold: boolean;
}

export interface ShopInventory {
  cards: ShopCardItem[];
  potions: ShopPotionItem[];
  removePrice: number;
  removedCard: boolean;
}

export function generateShop(act: number, characterId: string, rng: SeededRNG): ShopInventory {
  const rarities = ['common', 'common', 'uncommon', 'uncommon', rng.next() > 0.72 ? 'rare' : 'common'] as const;
  const cards = rarities.map((rarity) => {
    const pool = getCardPool(characterId, rarity);
    return {
      card: rng.pick(pool),
      price: rarity === 'rare' ? rng.nextInt(90, 125) : rarity === 'uncommon' ? rng.nextInt(60, 85) : rng.nextInt(35, 55),
      sold: false,
    };
  });
  return {
    cards,
    potions: rng.shuffle(potions).slice(0, 3).map((potion) => ({
      potion,
      price: rng.nextInt(28 + act * 3, 45 + act * 5),
      sold: false,
    })),
    removePrice: 75 + act * 10,
    removedCard: false,
  };
}
