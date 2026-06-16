import { describe, expect, it } from 'vitest';
import { SeededRNG } from './rng';

describe('SeededRNG', () => {
  it('同一种子产生相同序列', () => {
    const a = new SeededRNG(42);
    const b = new SeededRNG(42);
    expect([a.next(), a.next(), a.next()]).toEqual([b.next(), b.next(), b.next()]);
  });

  it('不同种子产生不同序列', () => {
    const a = new SeededRNG(1);
    const b = new SeededRNG(2);
    expect([a.next(), a.next()]).not.toEqual([b.next(), b.next()]);
  });

  it('shuffle 不修改原数组', () => {
    const source = [1, 2, 3, 4, 5];
    const shuffled = new SeededRNG(9).shuffle(source);
    expect(source).toEqual([1, 2, 3, 4, 5]);
    expect(shuffled.sort()).toEqual(source);
  });

  it('nextInt 保持闭区间', () => {
    const rng = new SeededRNG(7);
    for (let i = 0; i < 100; i += 1) {
      const value = rng.nextInt(2, 4);
      expect(value).toBeGreaterThanOrEqual(2);
      expect(value).toBeLessThanOrEqual(4);
    }
  });
});
