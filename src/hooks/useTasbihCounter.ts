import { useState, useCallback } from 'react';

import tasbihData from '@/src/data/tasbih.json';

export interface TasbihItem {
  id: number;
  judul: string;
  arab: string;
  latin: string;
  arti: string;
  kategori: string;
}

interface TasbihState {
  count: number;
  target: number;
  activeItem: TasbihItem;
  isComplete: boolean;
}

interface UseTasbihCounterReturn extends TasbihState {
  increment: () => void;
  reset: () => void;
  setTarget: (n: number) => void;
  setActiveItem: (item: TasbihItem) => void;
}

const DEFAULT_TARGET = 33;
const DEFAULT_ITEM = tasbihData[0] as TasbihItem;

/**
 * useTasbihCounter — manages tasbih tap counter state.
 * Marks complete when count reaches target.
 * Tap history is intentionally NOT stored (per feature spec).
 */
export function useTasbihCounter(): UseTasbihCounterReturn {
  const [count, setCount] = useState(0);
  const [target, setTargetState] = useState(DEFAULT_TARGET);
  const [activeItem, setActiveItemState] = useState<TasbihItem>(DEFAULT_ITEM);
  const [isComplete, setIsComplete] = useState(false);

  const increment = useCallback(() => {
    setCount((prev) => {
      const next = prev + 1;
      if (next >= target) {
        setIsComplete(true);
      }
      return next;
    });
  }, [target]);

  const reset = useCallback(() => {
    setCount(0);
    setIsComplete(false);
  }, []);

  const setTarget = useCallback((n: number) => {
    setTargetState(n);
    setCount(0);
    setIsComplete(false);
  }, []);

  const setActiveItem = useCallback((item: TasbihItem) => {
    setActiveItemState(item);
    setCount(0);
    setIsComplete(false);
  }, []);

  return {
    count,
    target,
    activeItem,
    isComplete,
    increment,
    reset,
    setTarget,
    setActiveItem,
  };
}
