import type { Buff } from './buff';
import type { Card } from './card';
import type { Relic } from './relic';
import type { Potion } from './potion';

export interface PlayerCombatState {
  /** 生命上限。 */
  maxHp: number;
  /** 当前生命。 */
  hp: number;
  /** 当前护盾。 */
  block: number;
  /** 状态效果。 */
  buffs: Buff[];
}

export interface PlayerState extends PlayerCombatState {
  /** 当前灵力。 */
  energy: number;
  /** 灵力上限。 */
  maxEnergy: number;
  /** 灵石数量。 */
  gold: number;
  /** 当前卡组。 */
  deck: Card[];
  /** 已持有法宝。 */
  relics: Relic[];
  /** 丹药槽。 */
  potions: Array<Potion | null>;
}

export interface CharacterDef {
  /** 角色 ID。 */
  id: string;
  /** 角色名称。 */
  name: string;
  /** 角色流派。 */
  archetype: string;
  /** 初始卡组 ID 列表。 */
  startingDeck: string[];
  /** 初始法宝 ID。 */
  startingRelic: string;
  /** 生命上限。 */
  maxHp: number;
  /** 被动说明。 */
  passive: string;
  /** 背景故事。 */
  story: string;
}
