export interface EventChoice {
  /** 选项 ID。 */
  id: string;
  /** 展示文本。 */
  label: string;
  /** 后果预览。 */
  preview: string;
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
