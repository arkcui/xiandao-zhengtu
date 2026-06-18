export interface EventChoice {
  /** 选项 ID。 */
  id: string;
  /** 展示文本。 */
  label: string;
  /** 后果预览。 */
  preview: string;
  /** 选项效果。 */
  effect: EventChoiceEffect;
}

export interface GameEvent {
  /** 事件 ID。 */
  id: string;
  /** 标题。 */
  title: string;
  /** 描述。 */
  description: string;
  /** 可选选项。 */
  choices: EventChoice[];
}

export interface EventChoiceEffect {
  /** 生命变化，正数回复，负数扣血。 */
  hp?: number;
  /** 最大生命变化。 */
  maxHp?: number;
  /** 灵石变化。 */
  gold?: number;
  /** 获得卡牌 ID。 */
  addCardId?: string;
  /** 移除一张随机卡。 */
  removeRandomCard?: boolean;
}
