import type { Buff } from './buff';
import type { CardEffect } from './card';

export type IntentType = 'attack' | 'defend' | 'buff' | 'debuff' | 'attack_defend' | 'unknown';

export interface EnemyMove {
  /** 行动 ID。 */
  id: string;
  /** 行动名称。 */
  name: string;
  /** 展示给玩家的意图。 */
  intent: IntentType;
  /** 行动效果。 */
  effects: CardEffect[];
  /** weighted_random AI 使用的权重。 */
  weight?: number;
}

export interface EnemyAI {
  /** AI 决策类型。 */
  type: 'pattern' | 'weighted_random' | 'conditional';
}

export interface Enemy {
  /** 敌人定义 ID。 */
  id: string;
  /** 展示名称。 */
  name: string;
  /** 生命值范围。 */
  hp: [number, number];
  /** 敌人类型。 */
  type: 'normal' | 'elite' | 'boss';
  /** 可用行动列表。 */
  moves: EnemyMove[];
  /** AI 配置。 */
  ai: EnemyAI;
}

export interface EnemyInstance {
  /** 战斗实例 ID。 */
  instanceId: string;
  /** 敌人定义 ID。 */
  id: string;
  /** 展示名称。 */
  name: string;
  /** 最大生命值。 */
  maxHp: number;
  /** 当前生命值。 */
  hp: number;
  /** 护盾。 */
  block: number;
  /** 敌人类型。 */
  type: 'normal' | 'elite' | 'boss';
  /** 状态列表。 */
  buffs: Buff[];
  /** 可用行动列表。 */
  moves: EnemyMove[];
  /** AI 配置。 */
  ai: EnemyAI;
  /** 当前行动索引。 */
  moveIndex: number;
  /** 当前意图。 */
  intent: EnemyMove;
  /** 最近连续使用同一行动次数。 */
  repeatCount: number;
  /** 是否死亡。 */
  defeated: boolean;
}
