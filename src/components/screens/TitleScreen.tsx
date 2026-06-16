import { motion } from 'framer-motion';
import { useGameStore } from '@/store/game-store';

export function TitleScreen() {
  const setScreen = useGameStore((state) => state.setScreen);
  return (
    <main className="title-screen ink-bg">
      <motion.section className="title-copy" initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}>
        <p className="eyebrow">回合制修仙肉鸽卡牌</p>
        <h1>仙道征途</h1>
        <p>执剑入山海，在随机岔路、妖邪战局与奇遇抉择中，一步步叩问长生。</p>
        <div className="button-row">
          <button type="button" onClick={() => setScreen('character_select')}>开始新的修炼</button>
          <button type="button" className="secondary" disabled>继续修炼</button>
        </div>
      </motion.section>
    </main>
  );
}
