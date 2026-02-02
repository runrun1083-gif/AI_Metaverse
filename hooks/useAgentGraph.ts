
import { useEffect, useCallback } from 'react';
import { useGlobalStore } from '../stores/globalStore';
import { MAP_CONFIG } from '../constants/masterData';

export const useAgentGraph = () => {
  const { agents, updateAgent } = useGlobalStore();

  const moveAgents = useCallback(() => {
    agents.forEach(agent => {
      const dx = agent.targetPosition.x - agent.position.x;
      const dy = agent.targetPosition.y - agent.position.y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < 5) {
        // 目標到達、次のターゲットへ
        const nextX = Math.random() * (MAP_CONFIG.FLOOR_WIDTH - 400) + 200;
        const nextY = Math.random() * (MAP_CONFIG.FLOOR_HEIGHT - 400) + 200;
        updateAgent(agent.id, { targetPosition: { x: nextX, y: nextY } });
      } else {
        // 徐々に近づく
        updateAgent(agent.id, {
          position: {
            x: agent.position.x + dx * 0.02,
            y: agent.position.y + dy * 0.02
          }
        });
      }
    });
  }, [agents, updateAgent]);

  useEffect(() => {
    const interval = setInterval(moveAgents, 16);
    return () => clearInterval(interval);
  }, [moveAgents]);
};
