import { useGameStore } from '@/store/game-store';
import { CardComponent } from '@/components/combat/CardComponent';

export function ShopScreen() {
  const run = useGameStore((state) => state.run);
  const shop = useGameStore((state) => state.shop);
  const buyShopCard = useGameStore((state) => state.buyShopCard);
  const buyShopPotion = useGameStore((state) => state.buyShopPotion);
  const removeShopCard = useGameStore((state) => state.removeShopCard);
  const setScreen = useGameStore((state) => state.setScreen);
  if (!run || !shop) return null;
  return (
    <main className="screen-shell shop-screen">
      <header className="top-bar">
        <div>
          <p className="eyebrow">坊市未央</p>
          <h2>游商货架</h2>
        </div>
        <div className="stat-strip">
          <span>灵石 {run.gold}</span>
          <span>丹药 {run.potions.filter(Boolean).length}/3</span>
        </div>
      </header>
      <section className="shop-section">
        <h3>卡牌</h3>
        <div className="shop-cards">
          {shop.cards.map((item, index) => (
            <div className={`shop-item ${item.sold ? 'sold' : ''}`} key={`${item.card.id}-${index}`}>
              <CardComponent card={item.card} disabled={item.sold || run.gold < item.price} onPlay={() => buyShopCard(index)} />
              <span className="price-tag">{item.sold ? '已售' : `${item.price} 灵石`}</span>
            </div>
          ))}
        </div>
      </section>
      <section className="shop-section">
        <h3>丹药与服务</h3>
        <div className="potion-grid">
          {shop.potions.map((item, index) => (
            <button type="button" className="potion-card" key={item.potion.id} disabled={item.sold || run.gold < item.price || run.potions.every(Boolean)} onClick={() => buyShopPotion(index)}>
              <strong>{item.potion.name}</strong>
              <span>{item.potion.description}</span>
              <b>{item.sold ? '已售' : `${item.price} 灵石`}</b>
            </button>
          ))}
          <button type="button" className="potion-card service" disabled={shop.removedCard || run.gold < shop.removePrice || run.deck.length <= 1} onClick={removeShopCard}>
            <strong>洗去杂念</strong>
            <span>移除一张非核心卡牌。</span>
            <b>{shop.removedCard ? '已完成' : `${shop.removePrice} 灵石`}</b>
          </button>
        </div>
      </section>
      <button type="button" className="secondary" onClick={() => setScreen('map')}>离开坊市</button>
    </main>
  );
}
