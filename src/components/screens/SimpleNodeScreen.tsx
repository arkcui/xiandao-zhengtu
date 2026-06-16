import type { Screen } from '@/store/game-store';
import { useGameStore } from '@/store/game-store';

export function SimpleNodeScreen({ screen }: { screen: Screen }) {
  const setScreen = useGameStore((state) => state.setScreen);
  const copy = screen === 'rest' ? ['静坐调息', '回复一段心神后继续上路。'] : screen === 'shop' ? ['坊市未央', '商店系统已预留，当前可直接返回地图。'] : ['山中奇遇', '事件系统已预留，当前可直接返回地图。'];
  return (
    <main className="screen-shell simple-screen">
      <p className="eyebrow">{copy[0]}</p>
      <h2>{copy[1]}</h2>
      <button type="button" onClick={() => setScreen('map')}>继续前行</button>
    </main>
  );
}
