import { describe, expect, it } from 'vitest';
import { generateMap } from './map-generator';
import { SeededRNG } from './rng';

describe('map generator', () => {
  it('同一种子生成相同地图', () => {
    expect(generateMap(1, new SeededRNG(99))).toEqual(generateMap(1, new SeededRNG(99)));
  });

  it('包含 boss、休息点、精英和商店', () => {
    const map = generateMap(1, new SeededRNG(12));
    expect(map.nodes.find((node) => node.id === map.bossNode)?.type).toBe('boss');
    expect(map.nodes.filter((node) => node.type === 'elite').length).toBeGreaterThanOrEqual(2);
    expect(map.nodes.some((node) => node.type === 'shop')).toBe(true);
  });
});
