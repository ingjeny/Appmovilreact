import { useState, useEffect, useCallback } from 'react';
import { SavingsGoal } from '../types';
import { goalsService } from '../services/goals';

export function useGoals() {
  const [goals, setGoals] = useState<SavingsGoal[]>([]);
  const [loading, setLoading] = useState(true);

  const loadGoals = useCallback(async () => {
    setLoading(true);
    const data = await goalsService.getGoals();
    setGoals(data);
    setLoading(false);
  }, []);

  useEffect(() => {
    loadGoals();
  }, [loadGoals]);

  const addGoal = async (goal: SavingsGoal) => {
    await goalsService.addGoal(goal);
    await loadGoals();
  };

  const updateGoal = async (id: string, updates: Partial<SavingsGoal>) => {
    await goalsService.updateGoal(id, updates);
    await loadGoals();
  };

  const deleteGoal = async (id: string) => {
    await goalsService.deleteGoal(id);
    await loadGoals();
  };

  const addToGoal = async (goalId: string, amount: number) => {
    await goalsService.addToGoal(goalId, amount);
    await loadGoals();
  };

  return {
    goals,
    loading,
    addGoal,
    updateGoal,
    deleteGoal,
    addToGoal,
    refresh: loadGoals,
  };
}