import type { CardEffect } from './card';

export interface Potion {
  /** 丹药 ID。 */
  id: string;
  /** 展示名称。 */
  name: string;
  /** 描述。 */
  description: string;
  /** 使用效果。 */
  effect: CardEffect;
}
