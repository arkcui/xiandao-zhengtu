import { useState } from 'react';
import { useGameStore } from '@/store/game-store';
import { CardComponent } from '@/components/combat/CardComponent';
import { EnemyDisplay } from '@/components/combat/EnemyDisplay';

export function CombatScreen() {
  const combat = useGameStore((state) => state.combat);
  const run = useGameStore((state) => state.run);
  const playCard = useGameStore((state) => state.playCard);
  const endTurn = useGameStore((state) => state.endTurn);
  const [target, setTarget] = useState(0);
  if (!combat || !run) return null;
  return (
    <main className="combat-screen">
      <header className="combat-top">
        <strong>{run.character.name}</strong>
        <span>生命 {combat.player.hp}/{combat.player.maxHp}</span>
        <span>护盾 {combat.player.block}</span>
        <span>灵力 {combat.energy}/{combat.maxEnergy}</span>
        <button type="button" onClick={endTurn}>结束回合</button>
      </header>
      <section className="enemy-row">
        {combat.enemies.map((enemy, index) => (
          <EnemyDisplay key={enemy.instanceId} enemy={enemy} selected={target === index} onSelect={() => setTarget(index)} />
        ))}
      </section>
      <section className="player-stage">
        <div className="player-orb">
          <span>云</span>
          <strong>{combat.player.hp}</strong>
        </div>
        <div className="buff-row">
          {combat.player.buffs.map((buff) => <span key={buff.id}>{buff.name} {buff.stacks}</span>)}
        </div>
      </section>
      <section className="hand-area">
        {combat.hand.map((card, index) => (
          <CardComponent key={`${card.id}-${index}`} card={card} disabled={combat.energy < card.cost} onPlay={() => playCard(index, target)} />
        ))}
      </section>
    </main>
  );
}
