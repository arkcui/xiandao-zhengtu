import { useGameStore } from '@/store/game-store';

export function RestScreen() {
  const run = useGameStore((state) => state.run);
  const restHeal = useGameStore((state) => state.restHeal);
  const upgradeDeckCard = useGameStore((state) => state.upgradeDeckCard);
  if (!run) return null;
  const healAmount = Math.ceil(run.maxHp * 0.25);
  const upgradable = run.deck.filter((card) => !card.upgraded).slice(0, 8);
  return (
    <main className="screen-shell node-screen">
      <section className="node-panel rest-panel">
        <p className="eyebrow">休息处</p>
        <h2>松下调息</h2>
        <p className="event-copy">灵脉在此处缓缓回环。你可以休息疗伤，或选一张牌进行修炼强化。</p>
        <div className="rest-actions">
          <button type="button" onClick={restHeal}>
            <strong>休息</strong>
            <span>回复 {healAmount} 生命</span>
          </button>
          <div className="upgrade-list">
            <strong>修炼一张牌</strong>
            {upgradable.map((card) => (
              <button type="button" className="deck-row" key={card.id} onClick={() => upgradeDeckCard(card.id)}>
                <span>{card.name}</span>
                <small>{card.description}</small>
              </button>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
