import type { GameMap, MapNode, MapNodeType } from '@/types';
import type { SeededRNG } from './rng';

const WIDTH = 7;
const TYPE_WEIGHTS: Array<[MapNodeType, number]> = [
  ['combat', 45],
  ['event', 20],
  ['rest', 12],
  ['elite', 10],
  ['shop', 8],
  ['treasure', 5],
];

export function generateMap(act: number, rng: SeededRNG): GameMap {
  const layers = rng.nextInt(15, 17);
  const rows: MapNode[][] = [];
  for (let y = 0; y < layers; y += 1) {
    const count = y === layers - 1 ? 1 : rng.nextInt(y === 0 ? 2 : 2, y === 0 ? 4 : 5);
    const cols = rng.shuffle(Array.from({ length: WIDTH }, (_, index) => index)).slice(0, count).sort((a, b) => a - b);
    rows[y] = cols.map((x, index) => ({
      id: `a${act}-r${y}-n${index}`,
      type: pickNodeType(y, layers, rng),
      position: { x, y },
      connections: [],
    }));
  }
  rows[layers - 1][0].position.x = 3;
  for (let y = 0; y < layers - 1; y += 1) {
    rows[y].forEach((node) => {
      const candidates = rows[y + 1].filter((upper) => Math.abs(upper.position.x - node.position.x) <= 2);
      const target = candidates.length > 0 ? rng.pick(candidates) : rng.pick(rows[y + 1]);
      node.connections = Array.from(new Set([target.id]));
    });
    rows[y + 1].forEach((upper) => {
      const hasIncoming = rows[y].some((node) => node.connections.includes(upper.id));
      if (!hasIncoming) {
        const lower = rng.pick(rows[y]);
        lower.connections = Array.from(new Set([...lower.connections, upper.id]));
      }
    });
  }
  rows[0].forEach((node) => {
    node.type = 'combat';
  });
  rows[layers - 2].forEach((node) => {
    node.type = 'rest';
  });
  rows[layers - 1][0].type = 'boss';
  ensureMinimumTypes(rows, rng);
  return {
    nodes: rows.flat(),
    startNodes: rows[0].map((node) => node.id),
    bossNode: rows[layers - 1][0].id,
  };
}

function pickNodeType(y: number, layers: number, rng: SeededRNG): MapNodeType {
  if (y === 0) return 'combat';
  if (y === layers - 1) return 'boss';
  if (y === layers - 2) return 'rest';
  const pool = y < 3 ? TYPE_WEIGHTS.filter(([type]) => type !== 'elite') : TYPE_WEIGHTS;
  return rng.weightedPick(pool.map(([type]) => type), pool.map(([, weight]) => weight));
}

function ensureMinimumTypes(rows: MapNode[][], rng: SeededRNG): void {
  const mutable = rows.slice(3, -2).flat();
  const elites = mutable.filter((node) => node.type === 'elite');
  while (elites.length < 2 && mutable.length > 0) {
    const node = rng.pick(mutable.filter((item) => item.type !== 'elite'));
    node.type = 'elite';
    elites.push(node);
  }
  if (!mutable.some((node) => node.type === 'shop')) {
    rng.pick(mutable.filter((node) => node.type !== 'elite')).type = 'shop';
  }
}
