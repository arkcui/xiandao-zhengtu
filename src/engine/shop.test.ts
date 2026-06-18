import { describe, expect, it } from 'vitest';
import { generateShop } from './shop';
import { SeededRNG } from './rng';

describe('shop engine', () => {
  it('生成稳定的商店库存', () => {
    const a = generateShop(1, 'sword-cultivator', new SeededRNG(11));
    const b = generateShop(1, 'sword-cultivator', new SeededRNG(11));
    expect(a).toEqual(b);
    expect(a.cards).toHaveLength(5);
    expect(a.potions).toHaveLength(3);
    expect(a.removePrice).toBeGreaterThan(0);
  });

  it('商品都有价格且初始未售出', () => {
    const shop = generateShop(1, 'sword-cultivator', new SeededRNG(12));
    expect(shop.cards.every((item) => item.price > 0 && !item.sold)).toBe(true);
    expect(shop.potions.every((item) => item.price > 0 && !item.sold)).toBe(true);
  });
});
