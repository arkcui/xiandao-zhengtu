import type { EnemyInstance } from '@/types';

interface Props {
  enemy: EnemyInstance;
  selected: boolean;
  onSelect: () => void;
}

export function EnemyDisplay({ enemy, selected, onSelect }: Props) {
  const hpPercent = Math.max(0, (enemy.hp / enemy.maxHp) * 100);
  return (
    <button type="button" className={`enemy-display ${selected ? 'selected' : ''} ${enemy.defeated ? 'defeated' : ''}`} onClick={onSelect}>
      <span className={`intent ${enemy.intent.intent}`}>{enemy.intent.name}</span>
      <div className="enemy-avatar">{enemy.name.slice(0, 1)}</div>
      <strong>{enemy.name}</strong>
      <div className="hp-bar"><span style={{ width: `${hpPercent}%` }} /></div>
      <small>{enemy.hp}/{enemy.maxHp} · 护盾 {enemy.block}</small>
      <div className="buff-row">
        {enemy.buffs.map((buff) => <span key={buff.id}>{buff.name} {buff.stacks}</span>)}
      </div>
    </button>
  );
}
