import { useMemo } from 'react';
import { useGameStore } from '@/store/game-store';
import type { MapNode, MapNodeType } from '@/types';

const labels: Record<MapNodeType, { mark: string; name: string }> = {
  combat: { mark: '战', name: '普通战斗' },
  elite: { mark: '煞', name: '精英' },
  boss: { mark: '劫', name: '首领' },
  rest: { mark: '息', name: '休息' },
  event: { mark: '缘', name: '奇遇' },
  shop: { mark: '市', name: '坊市' },
  treasure: { mark: '宝', name: '宝箱' },
};

export function MapScreen() {
  const run = useGameStore((state) => state.run);
  const navigateToNode = useGameStore((state) => state.navigateToNode);
  const available = useMemo(() => getAvailableNodes(run?.map.nodes ?? [], run?.visitedNodes ?? [], run?.currentNodeId), [run]);
  if (!run) return null;
  const width = 760;
  const height = 1120;
  return (
    <main className="screen-shell map-shell">
      <header className="top-bar">
        <div>
          <p className="eyebrow">第 {run.currentAct} 幕</p>
          <h2>山海灵脉图</h2>
        </div>
        <div className="stat-strip">
          <span>生命 {run.hp}/{run.maxHp}</span>
          <span>灵石 {run.gold}</span>
          <span>层数 {run.currentFloor}</span>
        </div>
      </header>
      <nav className="map-legend" aria-label="地图图例">
        {Object.entries(labels).map(([type, label]) => (
          <span key={type} className={`legend-item ${type}`}>
            <b>{label.mark}</b>{label.name}
          </span>
        ))}
      </nav>
      <svg className="map-svg" viewBox={`0 0 ${width} ${height}`} role="img" aria-label="爬塔地图">
        {run.map.nodes.flatMap((node) =>
          node.connections.map((targetId) => {
            const target = run.map.nodes.find((item) => item.id === targetId);
            if (!target) return null;
            const a = toPoint(node, width, height);
            const b = toPoint(target, width, height);
            return <path key={`${node.id}-${target.id}`} className="map-line" d={`M ${a.x} ${a.y} C ${a.x} ${(a.y + b.y) / 2}, ${b.x} ${(a.y + b.y) / 2}, ${b.x} ${b.y}`} />;
          }),
        )}
        {run.map.nodes.map((node) => {
          const p = toPoint(node, width, height);
          const isVisited = run.visitedNodes.includes(node.id);
          const isAvailable = available.includes(node.id);
          return (
            <g key={node.id} className={`map-node ${node.type} ${isVisited ? 'visited' : ''} ${isAvailable ? 'available' : ''}`} onClick={() => isAvailable && navigateToNode(node.id)}>
              <circle cx={p.x} cy={p.y} r="27" />
              <text x={p.x} y={p.y + 8} textAnchor="middle">{labels[node.type].mark}</text>
              <title>{labels[node.type].name}</title>
            </g>
          );
        })}
      </svg>
    </main>
  );
}

function toPoint(node: MapNode, width: number, height: number) {
  return {
    x: 70 + node.position.x * ((width - 140) / 6),
    y: height - 70 - node.position.y * 66,
  };
}

function getAvailableNodes(nodes: MapNode[], visited: string[], current: string | null | undefined): string[] {
  if (!current) return nodes.filter((node) => node.position.y === 0).map((node) => node.id);
  const currentNode = nodes.find((node) => node.id === current);
  return currentNode?.connections.filter((id) => !visited.includes(id)) ?? [];
}
