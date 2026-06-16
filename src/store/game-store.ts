import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import type { WritableDraft } from 'immer';
import type { Card, MapNodeType, RunState } from '@/types';
import type { CombatState } from '@/engine/combat';
import type { Reward } from '@/engine/reward';
import { getCharacter } from '@/data/characters';
import { createStartingDeck } from '@/data/cards';
import { getEnemyEncounter } from '@/data/enemies';
import { generateMap } from '@/engine/map-generator';
import { SeededRNG } from '@/engine/rng';
import { initCombat, playCard as enginePlayCard, endPlayerTurn, checkCombatEnd } from '@/engine/combat';
import { generateCombatReward } from '@/engine/reward';

export type Screen = 'title' | 'character_select' | 'map' | 'combat' | 'reward' | 'event' | 'shop' | 'rest' | 'game_over';

interface GameStore {
  screen: Screen;
  run: RunState | null;
  combat: CombatState | null;
  reward: Reward | null;
  outcome: 'win' | 'lose' | null;
  setScreen: (screen: Screen) => void;
  startNewRun: (characterId: string) => void;
  navigateToNode: (nodeId: string) => void;
  playCard: (cardIndex: number, targetIndex?: number) => void;
  endTurn: () => void;
  chooseRewardCard: (card: Card | null) => void;
  returnToTitle: () => void;
}

function nextNodeScreen(type: MapNodeType): Screen {
  if (type === 'combat' || type === 'elite' || type === 'boss') return 'combat';
  if (type === 'rest') return 'rest';
  if (type === 'shop') return 'shop';
  if (type === 'event') return 'event';
  return 'reward';
}

export const useGameStore = create<GameStore>()(
  immer((set, get) => ({
    screen: 'title',
    run: null,
    combat: null,
    reward: null,
    outcome: null,
    setScreen: (screen) => set({ screen }),
    startNewRun: (characterId) => {
      const character = getCharacter(characterId);
      const seed = Date.now();
      const rng = new SeededRNG(seed);
      const deck = createStartingDeck(character.startingDeck);
      const map = generateMap(1, rng.fork());
      set({
        screen: 'map',
        outcome: null,
        reward: null,
        combat: null,
        run: {
          seed,
          character,
          currentAct: 1,
          currentFloor: 0,
          hp: character.maxHp,
          maxHp: character.maxHp,
          gold: 0,
          deck,
          relics: [],
          potions: [null, null, null],
          map,
          visitedNodes: [],
          currentNodeId: null,
        },
      });
    },
    navigateToNode: (nodeId) => {
      const run = get().run;
      if (!run) return;
      const node = run.map.nodes.find((item) => item.id === nodeId);
      if (!node) return;
      const rng = new SeededRNG(`${run.seed}-${nodeId}`);
      if (node.type === 'combat' || node.type === 'elite' || node.type === 'boss') {
        const encounterType = node.type === 'boss' ? 'boss' : node.type === 'elite' ? 'elite' : 'normal';
        const enemies = getEnemyEncounter(run.currentAct, encounterType, rng);
        const combat = initCombat({ maxHp: run.maxHp, hp: run.hp, deck: run.deck }, enemies, rng.fork());
        set((state) => {
          if (!state.run) return;
          state.run.currentNodeId = nodeId;
          state.run.currentFloor += 1;
          state.run.visitedNodes.push(nodeId);
          state.combat = combat;
          state.reward = null;
          state.screen = 'combat';
        });
        return;
      }
      set((state) => {
        if (!state.run) return;
        state.run.currentNodeId = nodeId;
        state.run.currentFloor += 1;
        state.run.visitedNodes.push(nodeId);
        state.screen = nextNodeScreen(node.type);
      });
    },
    playCard: (cardIndex, targetIndex = 0) => {
      const combat = get().combat;
      if (!combat) return;
      const next = enginePlayCard(combat, cardIndex, targetIndex);
      resolveCombatState(next, set, get);
    },
    endTurn: () => {
      const combat = get().combat;
      if (!combat) return;
      resolveCombatState(endPlayerTurn(combat), set, get);
    },
    chooseRewardCard: (card) => {
      set((state) => {
        if (!state.run) return;
        if (card) state.run.deck.push({ ...card, id: `${card.id}-reward-${state.run.deck.length}` });
        state.reward = null;
        state.screen = 'map';
      });
    },
    returnToTitle: () => set({ screen: 'title', combat: null, reward: null, outcome: null }),
  })),
);

function resolveCombatState(
  combat: CombatState,
  set: (fn: (state: WritableDraft<GameStore>) => void) => void,
  get: () => GameStore,
): void {
  const result = checkCombatEnd(combat);
  if (result === 'ongoing') {
    set((state) => {
      state.combat = combat;
    });
    return;
  }
  set((state) => {
    if (!state.run) return;
    state.run.hp = combat.player.hp;
    state.combat = combat;
    state.outcome = result;
    if (result === 'win') {
      const node = state.run.map.nodes.find((item) => item.id === state.run?.currentNodeId);
      const rewardType = node?.type === 'boss' ? 'boss' : node?.type === 'elite' ? 'elite' : 'normal';
      state.reward = generateCombatReward(rewardType, state.run.character.id, new SeededRNG(`${state.run.seed}-reward-${state.run.currentFloor}`));
      state.run.gold += state.reward.gold;
      state.screen = node?.type === 'boss' ? 'game_over' : 'reward';
    } else {
      state.screen = 'game_over';
    }
  });
  void get;
}
