import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import type { WritableDraft } from 'immer';
import type { Card, EventChoice, GameEvent, MapNodeType, Potion, RunState } from '@/types';
import type { CombatState } from '@/engine/combat';
import type { Reward } from '@/engine/reward';
import { getCharacter } from '@/data/characters';
import { createStartingDeck, getCardById } from '@/data/cards';
import { getEnemyEncounter } from '@/data/enemies';
import { getRandomEvent } from '@/data/events';
import { generateMap } from '@/engine/map-generator';
import { SeededRNG } from '@/engine/rng';
import { initCombat, playCard as enginePlayCard, endPlayerTurn, checkCombatEnd } from '@/engine/combat';
import { generateCombatReward } from '@/engine/reward';
import { generateShop, type ShopInventory } from '@/engine/shop';

export type Screen = 'title' | 'character_select' | 'map' | 'combat' | 'reward' | 'event' | 'shop' | 'rest' | 'game_over';

interface GameStore {
  screen: Screen;
  run: RunState | null;
  combat: CombatState | null;
  reward: Reward | null;
  activeEvent: GameEvent | null;
  shop: ShopInventory | null;
  outcome: 'win' | 'lose' | null;
  hasSave: boolean;
  setScreen: (screen: Screen) => void;
  startNewRun: (characterId: string) => void;
  loadGame: () => void;
  saveGame: () => void;
  navigateToNode: (nodeId: string) => void;
  playCard: (cardIndex: number, targetIndex?: number) => void;
  endTurn: () => void;
  chooseRewardCard: (card: Card | null) => void;
  chooseEvent: (choice: EventChoice) => void;
  restHeal: () => void;
  upgradeDeckCard: (cardId: string) => void;
  buyShopCard: (index: number) => void;
  buyShopPotion: (index: number) => void;
  removeShopCard: () => void;
  returnToTitle: () => void;
}

const SAVE_KEY = 'xiandao-zhengtu-save-v1';

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
    activeEvent: null,
    shop: null,
    outcome: null,
    hasSave: hasSavedRun(),
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
        activeEvent: null,
        shop: null,
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
      setTimeout(() => get().saveGame(), 0);
    },
    loadGame: () => {
      const run = loadSavedRun();
      if (!run) return;
      set({ run, screen: 'map', combat: null, reward: null, activeEvent: null, shop: null, outcome: null, hasSave: true });
    },
    saveGame: () => {
      const run = get().run;
      if (!run) return;
      localStorage.setItem(SAVE_KEY, JSON.stringify(run));
      set({ hasSave: true });
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
          state.activeEvent = null;
          state.shop = null;
          state.screen = 'combat';
        });
        setTimeout(() => get().saveGame(), 0);
        return;
      }
      const event = node.type === 'event' ? getRandomEvent(run.currentAct, rng.fork()) : null;
      const shop = node.type === 'shop' ? generateShop(run.currentAct, run.character.id, rng.fork()) : null;
      const treasure = node.type === 'treasure' ? generateCombatReward('normal', run.character.id, rng.fork()) : null;
      set((state) => {
        if (!state.run) return;
        state.run.currentNodeId = nodeId;
        state.run.currentFloor += 1;
        state.run.visitedNodes.push(nodeId);
        state.activeEvent = event;
        state.shop = shop;
        state.reward = treasure;
        if (treasure) state.run.gold += treasure.gold;
        state.screen = nextNodeScreen(node.type);
      });
      setTimeout(() => get().saveGame(), 0);
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
      setTimeout(() => get().saveGame(), 0);
    },
    chooseEvent: (choice) => {
      set((state) => {
        if (!state.run) return;
        applyEventChoice(state.run, choice);
        state.activeEvent = null;
        state.screen = 'map';
      });
      setTimeout(() => get().saveGame(), 0);
    },
    restHeal: () => {
      set((state) => {
        if (!state.run) return;
        state.run.hp = Math.min(state.run.maxHp, state.run.hp + Math.ceil(state.run.maxHp * 0.25));
        state.screen = 'map';
      });
      setTimeout(() => get().saveGame(), 0);
    },
    upgradeDeckCard: (cardId) => {
      set((state) => {
        if (!state.run) return;
        state.run.deck = state.run.deck.map((card) => (card.id === cardId ? upgradeCard(card) : card));
        state.screen = 'map';
      });
      setTimeout(() => get().saveGame(), 0);
    },
    buyShopCard: (index) => {
      set((state) => {
        const item = state.shop?.cards[index];
        if (!state.run || !item || item.sold || state.run.gold < item.price) return;
        state.run.gold -= item.price;
        state.run.deck.push({ ...item.card, id: `${item.card.id}-shop-${state.run.deck.length}` });
        item.sold = true;
      });
      setTimeout(() => get().saveGame(), 0);
    },
    buyShopPotion: (index) => {
      set((state) => {
        const item = state.shop?.potions[index];
        const slot = state.run?.potions.findIndex((potion) => potion === null) ?? -1;
        if (!state.run || !item || item.sold || slot < 0 || state.run.gold < item.price) return;
        state.run.gold -= item.price;
        state.run.potions[slot] = item.potion as Potion;
        item.sold = true;
      });
      setTimeout(() => get().saveGame(), 0);
    },
    removeShopCard: () => {
      set((state) => {
        if (!state.run || !state.shop || state.shop.removedCard || state.run.gold < state.shop.removePrice || state.run.deck.length <= 1) return;
        const index = state.run.deck.findIndex((card) => card.rarity !== 'starter') ?? 0;
        state.run.deck.splice(index >= 0 ? index : 0, 1);
        state.run.gold -= state.shop.removePrice;
        state.shop.removedCard = true;
      });
      setTimeout(() => get().saveGame(), 0);
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

function hasSavedRun(): boolean {
  return typeof localStorage !== 'undefined' && localStorage.getItem(SAVE_KEY) !== null;
}

function loadSavedRun(): RunState | null {
  if (typeof localStorage === 'undefined') return null;
  const raw = localStorage.getItem(SAVE_KEY);
  if (!raw) return null;
  return JSON.parse(raw) as RunState;
}

function applyEventChoice(run: WritableDraft<RunState>, choice: EventChoice): void {
  const effect = choice.effect;
  const goldAfter = run.gold + (effect.gold ?? 0);
  if (goldAfter < 0) return;
  run.gold = goldAfter;
  if (effect.maxHp) run.maxHp = Math.max(1, run.maxHp + effect.maxHp);
  if (effect.hp) run.hp = Math.max(1, Math.min(run.maxHp, run.hp + effect.hp));
  if (effect.addCardId) run.deck.push({ ...getCardById(effect.addCardId), id: `${effect.addCardId}-event-${run.deck.length}` });
  if (effect.removeRandomCard && run.deck.length > 1) {
    const index = run.deck.findIndex((card) => card.rarity !== 'starter');
    run.deck.splice(index >= 0 ? index : 0, 1);
  }
}

function upgradeCard(card: Card): Card {
  if (card.upgraded) return card;
  return {
    ...card,
    name: `${card.name}+`,
    upgraded: true,
    cost: Math.max(0, card.cost - (card.cost > 1 ? 1 : 0)),
    description: `${card.description} 已修炼强化。`,
    effects: card.effects.map((effect) => ({
      ...effect,
      value: typeof effect.value === 'number' ? effect.value + (effect.type === 'draw' || effect.type === 'energy' ? 1 : 3) : effect.value,
    })),
  };
}
