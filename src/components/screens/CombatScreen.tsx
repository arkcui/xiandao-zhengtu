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
        <div className="combat-title">
          <span>第 {combat.turn} 回合</span>
          <strong>{run.character.name}</strong>
        </div>
        <div className="combat-stat health-stat">
          <span>生命</span>
          <strong>{combat.player.hp}/{combat.player.maxHp}</strong>
        </div>
        <div className="combat-stat block-stat">
          <span>护盾</span>
          <strong>{combat.player.block}</strong>
        </div>
        <div className="energy-orb" aria-label={`灵力 ${combat.energy}/${combat.maxEnergy}`}>
          <strong>{combat.energy}</strong>
          <span>/{combat.maxEnergy}</span>
        </div>
        <button type="button" className="end-turn-button" onClick={endTurn}>结束回合</button>
      </header>
      <section className="enemy-row" aria-label="敌人区域">
        {combat.enemies.map((enemy, index) => (
          <EnemyDisplay key={enemy.instanceId} enemy={enemy} selected={target === index} onSelect={() => setTarget(index)} />
        ))}
      </section>
      <section className="player-stage">
        <div className="player-orb">
          <span>云</span>
          <strong>{combat.player.hp}</strong>
        </div>
        <p className="target-hint">选择敌人后点击手牌出招</p>
        <div className="buff-row">
          {combat.player.buffs.map((buff) => <span key={buff.id}>{buff.name} {buff.stacks}</span>)}
        </div>
      </section>
      <section className="hand-area" aria-label="手牌">
        {combat.hand.map((card, index) => (
          <CardComponent key={`${card.id}-${index}`} card={card} disabled={combat.energy < card.cost} onPlay={() => playCard(index, target)} />
        ))}
      </section>
    </main>
  );
}
