import type { Enemy, EnemyInstance } from '@/types';
import type { SeededRNG } from '@/engine/rng';
import { act1Enemies } from './act1-enemies';

const enemiesByAct: Record<number, Enemy[]> = {
  1: act1Enemies,
};

export function getEnemyEncounter(act: number, type: 'normal' | 'elite' | 'boss', rng: SeededRNG): EnemyInstance[] {
  const pool = (enemiesByAct[act] ?? act1Enemies).filter((enemy) => enemy.type === type);
  if (type === 'normal') {
    const count = rng.nextInt(1, 2);
    return Array.from({ length: count }, (_, index) => createEnemyInstance(rng.pick(pool), rng, index));
  }
  return [createEnemyInstance(rng.pick(pool), rng, 0)];
}

export function createEnemyInstance(enemy: Enemy, rng: SeededRNG, index = 0): EnemyInstance {
  const maxHp = rng.nextInt(enemy.hp[0], enemy.hp[1]);
  return {
    instanceId: `${enemy.id}-${index}-${rng.nextInt(1000, 9999)}`,
    id: enemy.id,
    name: enemy.name,
    maxHp,
    hp: maxHp,
    block: 0,
    type: enemy.type,
    buffs: [],
    moves: enemy.moves,
    ai: enemy.ai,
    moveIndex: 0,
    intent: enemy.moves[0],
    repeatCount: 1,
    defeated: false,
  };
}
