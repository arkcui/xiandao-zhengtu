import seedrandom from 'seedrandom';

export class SeededRNG {
  private readonly rng: seedrandom.PRNG;

  public constructor(seed: number | string) {
    this.rng = seedrandom(String(seed));
  }

  /** 返回 [0, 1) 的随机数。 */
  public next(): number {
    return this.rng();
  }

  /** 返回 [min, max] 的整数。 */
  public nextInt(min: number, max: number): number {
    return Math.floor(this.next() * (max - min + 1)) + min;
  }

  /** Fisher-Yates 洗牌，返回新数组。 */
  public shuffle<T>(array: T[]): T[] {
    const result = [...array];
    for (let i = result.length - 1; i > 0; i -= 1) {
      const j = this.nextInt(0, i);
      [result[i], result[j]] = [result[j], result[i]];
    }
    return result;
  }

  /** 从数组中随机选择一个元素。 */
  public pick<T>(array: T[]): T {
    if (array.length === 0) throw new Error('Cannot pick from an empty array');
    return array[this.nextInt(0, array.length - 1)];
  }

  /** 按权重随机选择一个元素。 */
  public weightedPick<T>(items: T[], weights: number[]): T {
    if (items.length !== weights.length || items.length === 0) {
      throw new Error('Items and weights must be non-empty and have the same length');
    }
    const total = weights.reduce((sum, weight) => sum + Math.max(0, weight), 0);
    if (total <= 0) return items[0];
    let roll = this.next() * total;
    for (let i = 0; i < items.length; i += 1) {
      roll -= Math.max(0, weights[i]);
      if (roll <= 0) return items[i];
    }
    return items[items.length - 1];
  }

  /** 创建独立子随机序列。 */
  public fork(): SeededRNG {
    return new SeededRNG(`${this.next()}-${this.next()}`);
  }
}
