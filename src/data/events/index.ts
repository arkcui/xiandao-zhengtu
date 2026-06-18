import type { GameEvent } from '@/types';
import type { SeededRNG } from '@/engine/rng';
import { act1Events } from './act1-events';

const eventsByAct: Record<number, GameEvent[]> = {
  1: act1Events,
};

export function getRandomEvent(act: number, rng: SeededRNG): GameEvent {
  return rng.pick(eventsByAct[act] ?? act1Events);
}
