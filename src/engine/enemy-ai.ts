import type { CombatState } from './combat';
import type { EnemyInstance, EnemyMove } from '@/types';
import type { SeededRNG } from './rng';

export function determineIntent(enemy: EnemyInstance, state: CombatState, rng: SeededRNG): EnemyMove {
  if (enemy.ai.type === 'pattern') return enemy.moves[enemy.moveIndex % enemy.moves.length];
  if (enemy.ai.type === 'conditional' && enemy.hp / enemy.maxHp < 0.45) {
    return enemy.moves.find((move) => move.intent === 'buff' || move.intent === 'attack_defend') ?? enemy.moves[0];
  }
  const candidates = enemy.moves.filter((move) => !(move.id === enemy.intent.id && enemy.repeatCount >= 2));
  return rng.weightedPick(candidates, candidates.map((move) => move.weight ?? 1));
}

export function chooseNextEnemyIntent(enemy: EnemyInstance, state: CombatState, rng: SeededRNG): EnemyInstance {
  const intent = determineIntent(enemy, state, rng);
  return {
    ...enemy,
    intent,
    moveIndex: enemy.moves.findIndex((move) => move.id === intent.id),
    repeatCount: intent.id === enemy.intent.id ? enemy.repeatCount + 1 : 1,
  };
}
