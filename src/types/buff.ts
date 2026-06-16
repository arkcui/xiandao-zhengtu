export type BuffType =
  | 'strength'
  | 'dexterity'
  | 'sword_intent'
  | 'weak'
  | 'vulnerable'
  | 'poison'
  | 'regen'
  | 'artifact'
  | 'sigil'
  | 'demon_form';

export interface Buff {
  /** 状态唯一 ID。 */
  id: BuffType;
  /** 展示名称。 */
  name: string;
  /** 层数或数值。 */
  stacks: number;
  /** 剩余持续回合；null 表示永久。 */
  duration: number | null;
  /** 状态类型。 */
  type: 'buff' | 'debuff' | 'special';
}
