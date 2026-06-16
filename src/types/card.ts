import type { BuffType } from './buff';

export type CardType = 'attack' | 'skill' | 'power' | 'curse' | 'status';
export type CardRarity = 'starter' | 'common' | 'uncommon' | 'rare';

export interface CardEffect {
  /** 效果类型，由 card-effects 注册表处理。 */
  type: string;
  /** 基础数值，例如伤害、护盾、抽牌数。 */
  value?: number;
  /** 状态效果 ID。 */
  buffId?: BuffType;
  /** 状态名称。 */
  buffName?: string;
  /** 持续回合。 */
  duration?: number | null;
  /** 效果目标。 */
  target?: 'self' | 'enemy' | 'all_enemies';
}

export interface Card {
  /** 卡牌唯一 ID。 */
  id: string;
  /** 卡牌名称。 */
  name: string;
  /** 卡牌类别。 */
  type: CardType;
  /** 稀有度。 */
  rarity: CardRarity;
  /** 灵力费用。 */
  cost: number;
  /** 规则描述。 */
  description: string;
  /** 是否升级。 */
  upgraded: boolean;
  /** 角色归属。 */
  character: string | 'neutral';
  /** 是否打出后消耗。 */
  exhaust?: boolean;
  /** 回合结束是否消耗。 */
  ethereal?: boolean;
  /** 是否保留。 */
  retain?: boolean;
  /** 是否固有。 */
  innate?: boolean;
  /** 顺序执行的效果列表。 */
  effects: CardEffect[];
}
