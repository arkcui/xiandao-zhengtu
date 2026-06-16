import type { Card, CardRarity } from '@/types';
import { neutralCards } from './neutral-cards';
import { swordCultivatorCards } from './sword-cultivator-cards';

export const allCards: Card[] = [...swordCultivatorCards, ...neutralCards];

export function getCardById(id: string): Card {
  const card = allCards.find((item) => item.id === id);
  if (!card) throw new Error(`Unknown card: ${id}`);
  return { ...card, effects: card.effects.map((effect) => ({ ...effect })) };
}

export function getCardsByCharacter(characterId: string): Card[] {
  return allCards.filter((card) => card.character === characterId).map((card) => ({ ...card }));
}

export function getCardsByRarity(rarity: CardRarity): Card[] {
  return allCards.filter((card) => card.rarity === rarity).map((card) => ({ ...card }));
}

export function getCardPool(characterId: string, rarity: CardRarity): Card[] {
  return allCards.filter((card) => (card.character === characterId || card.character === 'neutral') && card.rarity === rarity).map((card) => ({ ...card }));
}

export function createStartingDeck(ids: string[]): Card[] {
  return ids.map((id, index) => ({ ...getCardById(id), id: `${id}-${index}` }));
}
