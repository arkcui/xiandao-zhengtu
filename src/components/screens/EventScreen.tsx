import { useGameStore } from '@/store/game-store';

export function EventScreen() {
  const event = useGameStore((state) => state.activeEvent);
  const run = useGameStore((state) => state.run);
  const chooseEvent = useGameStore((state) => state.chooseEvent);
  if (!event || !run) return null;
  return (
    <main className="screen-shell node-screen">
      <section className="node-panel">
        <p className="eyebrow">山中奇遇</p>
        <h2>{event.title}</h2>
        <p className="event-copy">{event.description}</p>
        <div className="event-stats">
          <span>生命 {run.hp}/{run.maxHp}</span>
          <span>灵石 {run.gold}</span>
        </div>
        <div className="choice-list">
          {event.choices.map((choice) => {
            const disabled = run.gold + (choice.effect.gold ?? 0) < 0;
            return (
              <button type="button" className="choice-button" key={choice.id} disabled={disabled} onClick={() => chooseEvent(choice)}>
                <strong>{choice.label}</strong>
                <span>{choice.preview}</span>
              </button>
            );
          })}
        </div>
      </section>
    </main>
  );
}
