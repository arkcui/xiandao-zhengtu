import { useGameStore } from '@/store/game-store';
import { CardComponent } from '@/components/combat/CardComponent';

export function RewardScreen() {
  const reward = useGameStore((state) => state.reward);
  const chooseRewardCard = useGameStore((state) => state.chooseRewardCard);
  if (!reward) return null;
  return (
    <main className="screen-shell reward-screen">
      <header className="screen-header">
        <p className="eyebrow">战利品</p>
        <h2>获得 {reward.gold} 灵石</h2>
      </header>
      <section className="reward-cards">
        {reward.cards.map((card) => (
          <CardComponent key={card.id} card={card} disabled={false} onPlay={() => chooseRewardCard(card)} />
        ))}
      </section>
      <button type="button" className="secondary" onClick={() => chooseRewardCard(null)}>跳过卡牌</button>
    </main>
  );
}
