import { motion } from 'framer-motion';
import type { Card } from '@/types';

interface Props {
  card: Card;
  disabled: boolean;
  onPlay: () => void;
}

export function CardComponent({ card, disabled, onPlay }: Props) {
  const typeLabel = {
    attack: '术法',
    skill: '身法',
    power: '心法',
    curse: '诅咒',
    status: '状态',
  }[card.type];
  const rarityLabel = {
    starter: '入门',
    common: '凡品',
    uncommon: '珍品',
    rare: '绝品',
  }[card.rarity];

  return (
    <motion.button
      type="button"
      className={`battle-card ${card.type}`}
      disabled={disabled}
      whileHover={disabled ? undefined : { y: -14, scale: 1.05 }}
      whileTap={disabled ? undefined : { scale: 0.96 }}
      onClick={onPlay}
    >
      <span className="card-cost">{card.cost}</span>
      <span className="card-rarity">{rarityLabel}</span>
      <strong>{card.name}</strong>
      <small>{typeLabel}</small>
      <p>{card.description}</p>
    </motion.button>
  );
}
