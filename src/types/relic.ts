import type { CardEffect } from './card';

export type RelicRarity = 'starter' | 'common' | 'uncommon' | 'rare' | 'boss';
export type RelicTrigger = 'on_combat_start' | 'on_turn_start' | 'on_turn_end' | 'on_card_play' | 'on_take_damage' | 'on_victory';

export interface Relic {
  /** 法宝 ID。 */
  id: string;
  /** 展示名称。 */
  name: string;
  /** 稀有度。 */
  rarity: RelicRarity;
  /** 描述。 */
  description: string;
  /** 触发时机。 */
  trigger: RelicTrigger;
  /** 触发效果。 */
  effect: CardEffect;
}
