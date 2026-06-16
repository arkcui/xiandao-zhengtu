import type { Card } from './card';
import type { CharacterDef } from './player';
import type { GameMap } from './map';
import type { Potion } from './potion';
import type { Relic } from './relic';

export interface RunState {
  /** 本轮种子。 */
  seed: number;
  /** 当前角色。 */
  character: CharacterDef;
  /** 当前章节。 */
  currentAct: number;
  /** 当前层数。 */
  currentFloor: number;
  /** 当前生命。 */
  hp: number;
  /** 生命上限。 */
  maxHp: number;
  /** 灵石。 */
  gold: number;
  /** 卡组。 */
  deck: Card[];
  /** 法宝。 */
  relics: Relic[];
  /** 丹药。 */
  potions: Array<Potion | null>;
  /** 地图。 */
  map: GameMap;
  /** 已访问节点。 */
  visitedNodes: string[];
  /** 当前节点。 */
  currentNodeId: string | null;
}

export interface MetaProgress {
  /** 总运行次数。 */
  runs: number;
  /** 最高层数。 */
  bestFloor: number;
}
