import { describe, expect, it } from 'vitest';
import { act1Events } from './act1-events';

describe('act1 events', () => {
  it('每个事件都有标题、描述和至少两个选项', () => {
    expect(act1Events.length).toBeGreaterThan(0);
    act1Events.forEach((event) => {
      expect(event.title.length).toBeGreaterThan(0);
      expect(event.description.length).toBeGreaterThan(0);
      expect(event.choices.length).toBeGreaterThanOrEqual(2);
    });
  });

  it('每个选项都有预览和效果对象', () => {
    act1Events.forEach((event) => {
      event.choices.forEach((choice) => {
        expect(choice.preview.length).toBeGreaterThan(0);
        expect(choice.effect).toBeTruthy();
      });
    });
  });
});
