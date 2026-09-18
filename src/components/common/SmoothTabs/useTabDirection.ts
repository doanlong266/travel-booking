import { useState } from 'react';

/**
 * Hook to calculate tab navigation direction for fluid sliding transitions:
 * +1 when moving right (forward), -1 when moving left (backward), 0 on initial render.
 * Uses React's standard "adjusting state during render" pattern to avoid ref-during-render issues.
 */
export function useTabDirection(activeKey: string, keys: string[]) {
  const [prevKey, setPrevKey] = useState(activeKey);
  const [direction, setDirection] = useState<number>(0);

  const currentIndex = keys.indexOf(activeKey);

  if (activeKey !== prevKey) {
    const prevIndex = keys.indexOf(prevKey);
    setPrevKey(activeKey);
    if (prevIndex !== -1 && currentIndex !== -1) {
      setDirection(currentIndex > prevIndex ? 1 : -1);
    }
  }

  return {
    direction,
    currentIndex,
  };
}
