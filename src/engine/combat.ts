import type { Buff, Card, CardEffect, EnemyInstance, EnemyMove, PlayerCombatState } from '@/types';
import { SeededRNG } from './rng';

export interface CombatState {
  player: PlayerCombatState;
  enemies: EnemyInstance[];
  hand: Card[];
  drawPile: Card[];
  discardPile: Card[];
  exhaustPile: Card[];
  energy: number;
  maxEnergy: number;
  turn: number;
  turnPhase: 'player' | 'enemy';
  rng: SeededRNG;
  log: string[];
}

export interface CombatInitPlayer {
  maxHp: number;
  hp: number;
  deck: Card[];
}

function cloneBuff(buff: Buff): Buff {
  return { ...buff };
}

export function getBuffStacks(buffs: Buff[], id: Buff['id']): number {
  return buffs.find((buff) => buff.id === id)?.stacks ?? 0;
}

function tickBuffs(buffs: Buff[]): Buff[] {
  return buffs
    .map((buff) => (buff.duration === null ? cloneBuff(buff) : { ...buff, duration: buff.duration - 1 }))
    .filter((buff) => buff.duration === null || buff.duration > 0);
}

export function initCombat(player: CombatInitPlayer, enemies: EnemyInstance[], rng: SeededRNG): CombatState {
  const shuffled = rng.shuffle(player.deck);
  const state: CombatState = {
    player: { maxHp: player.maxHp, hp: player.hp, block: 0, buffs: [] },
    enemies,
    hand: [],
    drawPile: shuffled,
    discardPile: [],
    exhaustPile: [],
    energy: 3,
    maxEnergy: 3,
    turn: 0,
    turnPhase: 'player',
    rng,
    log: ['踏入战局。'],
  };
  return startPlayerTurn(state);
}

export function startPlayerTurn(state: CombatState): CombatState {
  const next: CombatState = {
    ...state,
    player: { ...state.player, block: 0, buffs: tickBuffs(state.player.buffs) },
    energy: state.maxEnergy,
    turn: state.turn + 1,
    turnPhase: 'player',
    log: [...state.log, `第 ${state.turn + 1} 回合开始。`],
  };
  return drawCards(next, 5);
}

export function playCard(state: CombatState, cardIndex: number, targetIndex = 0): CombatState {
  const card = state.hand[cardIndex];
  if (!card) return state;
  if (state.turnPhase !== 'player' || state.energy < card.cost) {
    return { ...state, log: [...state.log, '灵力不足，无法出牌。'] };
  }
  const hand = state.hand.filter((_, index) => index !== cardIndex);
  let next: CombatState = { ...state, hand, energy: state.energy - card.cost };
  next = executeCardEffects(next, card, targetIndex);
  if (card.exhaust || card.type === 'power') {
    next = { ...next, exhaustPile: [...next.exhaustPile, card] };
  } else {
    next = { ...next, discardPile: [...next.discardPile, card] };
  }
  return { ...next, log: [...next.log, `打出 ${card.name}。`] };
}

export function endPlayerTurn(state: CombatState): CombatState {
  const retained = state.hand.filter((card) => card.retain);
  const exhausted = state.hand.filter((card) => card.ethereal);
  const discarded = state.hand.filter((card) => !card.retain && !card.ethereal);
  const enemiesAfterPoison = state.enemies.map((enemy) => {
    const poison = getBuffStacks(enemy.buffs, 'poison');
    if (poison <= 0 || enemy.defeated) return enemy;
    const hp = Math.max(0, enemy.hp - poison);
    return { ...enemy, hp, defeated: hp <= 0, buffs: tickBuffs(enemy.buffs) };
  });
  return executeEnemyTurn({
    ...state,
    enemies: enemiesAfterPoison,
    hand: retained,
    discardPile: [...state.discardPile, ...discarded],
    exhaustPile: [...state.exhaustPile, ...exhausted],
    turnPhase: 'enemy',
  });
}

export function executeEnemyTurn(state: CombatState): CombatState {
  let next = state;
  next.enemies.forEach((enemy, index) => {
    if (!enemy.defeated) {
      next = executeEnemyMoveEffects(next, enemy.intent, index);
    }
  });
  const enemies = next.enemies.map((enemy) => ({
    ...enemy,
    block: 0,
    buffs: tickBuffs(enemy.buffs),
    moveIndex: (enemy.moveIndex + 1) % enemy.moves.length,
    intent: enemy.moves[(enemy.moveIndex + 1) % enemy.moves.length],
  }));
  return startPlayerTurn({ ...next, enemies });
}

export function calculateDamage(baseDamage: number, attacker: { buffs: Buff[] }, defender: { buffs: Buff[] }): number {
  let damage = baseDamage + getBuffStacks(attacker.buffs, 'strength') + getBuffStacks(attacker.buffs, 'sword_intent');
  if (getBuffStacks(attacker.buffs, 'weak') > 0) damage *= 0.75;
  if (getBuffStacks(defender.buffs, 'vulnerable') > 0) damage *= 1.5;
  return Math.max(0, Math.floor(damage));
}

export function applyDamage(state: CombatState, targetType: 'player' | 'enemy', targetIndex: number, damage: number): CombatState {
  if (targetType === 'player') {
    const absorbed = Math.min(state.player.block, damage);
    const hp = Math.max(0, state.player.hp - (damage - absorbed));
    return { ...state, player: { ...state.player, hp, block: state.player.block - absorbed } };
  }
  const enemies = state.enemies.map((enemy, index) => {
    if (index !== targetIndex || enemy.defeated) return enemy;
    const absorbed = Math.min(enemy.block, damage);
    const hp = Math.max(0, enemy.hp - (damage - absorbed));
    return { ...enemy, hp, block: enemy.block - absorbed, defeated: hp <= 0 };
  });
  return { ...state, enemies };
}

export function applyBlock(state: CombatState, targetType: 'player' | 'enemy', targetIndex: number, amount: number): CombatState {
  if (targetType === 'player') {
    return { ...state, player: { ...state.player, block: state.player.block + amount } };
  }
  return {
    ...state,
    enemies: state.enemies.map((enemy, index) => (index === targetIndex ? { ...enemy, block: enemy.block + amount } : enemy)),
  };
}

export function applyBuff(state: CombatState, targetType: 'player' | 'enemy', targetIndex: number, buff: Buff): CombatState {
  const add = (buffs: Buff[]): Buff[] => {
    const existing = buffs.find((item) => item.id === buff.id);
    if (!existing) return [...buffs, buff];
    return buffs.map((item) => (item.id === buff.id ? { ...item, stacks: item.stacks + buff.stacks, duration: buff.duration ?? item.duration } : item));
  };
  if (targetType === 'player') return { ...state, player: { ...state.player, buffs: add(state.player.buffs) } };
  return { ...state, enemies: state.enemies.map((enemy, index) => (index === targetIndex ? { ...enemy, buffs: add(enemy.buffs) } : enemy)) };
}

export function drawCards(state: CombatState, count: number): CombatState {
  let drawPile = [...state.drawPile];
  let discardPile = [...state.discardPile];
  const hand = [...state.hand];
  for (let i = 0; i < count; i += 1) {
    if (drawPile.length === 0) {
      if (discardPile.length === 0) break;
      drawPile = state.rng.shuffle(discardPile);
      discardPile = [];
    }
    const card = drawPile.shift();
    if (card) hand.push(card);
  }
  return { ...state, hand, drawPile, discardPile };
}

export function checkCombatEnd(state: CombatState): 'ongoing' | 'win' | 'lose' {
  if (state.player.hp <= 0) return 'lose';
  if (state.enemies.every((enemy) => enemy.defeated || enemy.hp <= 0)) return 'win';
  return 'ongoing';
}

export function executeCardEffects(state: CombatState, card: Card, targetIndex = 0): CombatState {
  return card.effects.reduce((next, effect) => executeEffect(next, effect, targetIndex), state);
}

function makeBuff(effect: CardEffect): Buff {
  const id = effect.buffId ?? 'strength';
  return {
    id,
    name: effect.buffName ?? id,
    stacks: effect.value ?? 1,
    duration: effect.duration ?? null,
    type: ['weak', 'vulnerable', 'poison'].includes(id) ? 'debuff' : 'buff',
  };
}

function executeEffect(state: CombatState, effect: CardEffect, targetIndex: number): CombatState {
  switch (effect.type) {
    case 'damage': {
      const enemy = state.enemies[targetIndex];
      if (!enemy) return state;
      const damage = calculateDamage(effect.value ?? 0, state.player, enemy);
      return applyDamage(state, 'enemy', targetIndex, damage);
    }
    case 'damage_all':
      return state.enemies.reduce((next, enemy, index) => {
        const damage = calculateDamage(effect.value ?? 0, state.player, enemy);
        return applyDamage(next, 'enemy', index, damage);
      }, state);
    case 'block':
      return applyBlock(state, 'player', 0, effect.value ?? 0);
    case 'draw':
      return drawCards(state, effect.value ?? 1);
    case 'energy':
      return { ...state, energy: state.energy + (effect.value ?? 1) };
    case 'buff':
    case 'sword_intent':
      return applyBuff(state, 'player', 0, makeBuff(effect.type === 'sword_intent' ? { ...effect, buffId: 'sword_intent', buffName: '剑意' } : effect));
    case 'debuff':
      return applyBuff(state, 'enemy', targetIndex, makeBuff(effect));
    case 'heal':
      return { ...state, player: { ...state.player, hp: Math.min(state.player.maxHp, state.player.hp + (effect.value ?? 0)) } };
    case 'consume_sword_intent': {
      const stacks = getBuffStacks(state.player.buffs, 'sword_intent');
      const withoutIntent = state.player.buffs.filter((buff) => buff.id !== 'sword_intent');
      return applyDamage({ ...state, player: { ...state.player, buffs: withoutIntent } }, 'enemy', targetIndex, stacks * (effect.value ?? 1));
    }
    default:
      return state;
  }
}

function executeEnemyMoveEffects(state: CombatState, move: EnemyMove, enemyIndex: number): CombatState {
  const enemy = state.enemies[enemyIndex];
  return move.effects.reduce((next, effect) => {
    if (effect.type === 'damage') {
      const damage = calculateDamage(effect.value ?? 0, enemy, next.player);
      return applyDamage(next, 'player', 0, damage);
    }
    if (effect.type === 'block') return applyBlock(next, 'enemy', enemyIndex, effect.value ?? 0);
    if (effect.type === 'buff') return applyBuff(next, 'enemy', enemyIndex, makeBuff(effect));
    if (effect.type === 'debuff') return applyBuff(next, 'player', 0, makeBuff(effect));
    return next;
  }, state);
}
