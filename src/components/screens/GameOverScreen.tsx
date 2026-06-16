import { useGameStore } from '@/store/game-store';

export function GameOverScreen() {
  const outcome = useGameStore((state) => state.outcome);
  const run = useGameStore((state) => state.run);
  const returnToTitle = useGameStore((state) => state.returnToTitle);
  return (
    <main className="screen-shell game-over">
      <p className="eyebrow">{outcome === 'win' ? '道途未尽' : '尘缘暂止'}</p>
      <h2>{outcome === 'win' ? '渡过此劫' : '修行失败'}</h2>
      <p>抵达第 {run?.currentFloor ?? 0} 层，收集 {run?.deck.length ?? 0} 张卡牌，持有 {run?.gold ?? 0} 灵石。</p>
      <button type="button" onClick={returnToTitle}>返回主页</button>
    </main>
  );
}
