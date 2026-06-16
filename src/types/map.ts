export type MapNodeType = 'combat' | 'elite' | 'boss' | 'rest' | 'event' | 'shop' | 'treasure';

export interface MapPosition {
  /** 横向列。 */
  x: number;
  /** 层数。 */
  y: number;
}

export interface MapNode {
  /** 节点 ID。 */
  id: string;
  /** 节点类型。 */
  type: MapNodeType;
  /** 地图位置。 */
  position: MapPosition;
  /** 可前往的上层节点。 */
  connections: string[];
}

export interface GameMap {
  /** 所有节点。 */
  nodes: MapNode[];
  /** 起始节点 ID。 */
  startNodes: string[];
  /** Boss 节点 ID。 */
  bossNode: string;
}
