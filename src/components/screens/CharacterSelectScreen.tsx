import { characters } from '@/data/characters';
import { useGameStore } from '@/store/game-store';

export function CharacterSelectScreen() {
  const startNewRun = useGameStore((state) => state.startNewRun);
  return (
    <main className="screen-shell">
      <header className="screen-header">
        <div>
          <p className="eyebrow">择一道而行</p>
          <h2>选择修士</h2>
        </div>
        <p className="screen-note">当前开放剑修云无涯，其余流派会作为后续内容扩展。</p>
      </header>
      <section className="character-grid">
        {characters.map((character) => {
          const locked = character.startingDeck.length === 0;
          return (
            <article className={`character-card ${locked ? 'is-locked' : ''}`} key={character.id}>
              <span className="class-pill">{character.archetype}</span>
              <h3>{character.name}</h3>
              <p>{character.passive}</p>
              <small>{character.story}</small>
              <button type="button" disabled={locked} onClick={() => startNewRun(character.id)}>
                {locked ? '尚未解锁' : '踏上征途'}
              </button>
            </article>
          );
        })}
      </section>
    </main>
  );
}
