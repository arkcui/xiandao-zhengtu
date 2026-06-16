import type { CharacterDef } from '@/types';
import { swordCultivator } from './sword-cultivator';

export const characters: CharacterDef[] = [
  swordCultivator,
  {
    id: 'sigil-master',
    name: '沈青符',
    archetype: '符篆师',
    startingDeck: [],
    startingRelic: 'vermilion-brush',
    maxHp: 68,
    passive: '擅长符印与延迟爆发。即将开放。',
    story: '一笔落朱砂，山河皆成阵。',
  },
  {
    id: 'artificer',
    name: '墨问机',
    archetype: '炼器师',
    startingDeck: [],
    startingRelic: 'bronze-core',
    maxHp: 72,
    passive: '可召唤傀儡协助战斗。即将开放。',
    story: '以机关代手，以炉火炼心。',
  },
  {
    id: 'demon-cultivator',
    name: '白栖寒',
    archetype: '妖修',
    startingDeck: [],
    startingRelic: 'moon-bone',
    maxHp: 80,
    passive: '在妖化与理智之间取得力量。即将开放。',
    story: '半身人间烟火，半身山海旧梦。',
  },
];

export function getCharacter(characterId: string): CharacterDef {
  const character = characters.find((item) => item.id === characterId);
  if (!character) throw new Error(`Unknown character: ${characterId}`);
  return character;
}
