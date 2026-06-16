import { motion } from 'framer-motion';
import type { Card } from '@/types';

interface Props {
  card: Card;
  disabled: boolean;
  onPlay: () => void;
}

export function CardComponent({ card, disabled, onPlay }: Props) {
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
      <strong>{card.name}</strong>
      <small>{card.type}</small>
      <p>{card.description}</p>
    </motion.button>
  );
}
