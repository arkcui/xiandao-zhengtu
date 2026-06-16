import { useGameStore } from '@/store/game-store';
import { TitleScreen } from '@/components/screens/TitleScreen';
import { CharacterSelectScreen } from '@/components/screens/CharacterSelectScreen';
import { MapScreen } from '@/components/screens/MapScreen';
import { CombatScreen } from '@/components/screens/CombatScreen';
import { RewardScreen } from '@/components/screens/RewardScreen';
import { GameOverScreen } from '@/components/screens/GameOverScreen';
import { SimpleNodeScreen } from '@/components/screens/SimpleNodeScreen';

export function App() {
  const screen = useGameStore((state) => state.screen);
  if (screen === 'title') return <TitleScreen />;
  if (screen === 'character_select') return <CharacterSelectScreen />;
  if (screen === 'map') return <MapScreen />;
  if (screen === 'combat') return <CombatScreen />;
  if (screen === 'reward') return <RewardScreen />;
  if (screen === 'game_over') return <GameOverScreen />;
  return <SimpleNodeScreen screen={screen} />;
}
