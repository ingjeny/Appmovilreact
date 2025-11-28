import { useCallback, useEffect, useMemo, useState } from 'react';
import { BudgetSettings, Movement } from '../types';
import { budgetService } from '../services/budget';

const DEFAULT_SETTINGS: BudgetSettings = {
  monthlyLimit: 1500000,
  alertThreshold: 0.8,
  reminders: {
    remindDaily: true,
    remindWeeklyReview: true,
    customMessages: ['Registra tus gastos de hoy', 'Revisa tu presupuesto semanal'],
  },
};

export function useBudget(movements: Movement[]) {
  const [settings, setSettings] = useState<BudgetSettings>(DEFAULT_SETTINGS);
  const [loading, setLoading] = useState(true);

  const loadSettings = useCallback(async () => {
    setLoading(true);
    const data = await budgetService.getSettings();
    setSettings(data ?? DEFAULT_SETTINGS);
    setLoading(false);
  }, []);

  useEffect(() => {
    loadSettings();
  }, [loadSettings]);

  const updateSettings = useCallback(
    async (partial: Partial<BudgetSettings>) => {
      const newSettings = { ...settings, ...partial };
      setSettings(newSettings);
      await budgetService.saveSettings(newSettings);
    },
    [settings]
  );

  const updateReminders = useCallback(
    async (partial: Partial<BudgetSettings['reminders']>) => {
      const newSettings = {
        ...settings,
        reminders: { ...settings.reminders, ...partial },
      };
      setSettings(newSettings);
      await budgetService.saveSettings(newSettings);
    },
    [settings]
  );

  const monthlyExpenses = useMemo(() => {
    const now = new Date();
    return movements
      .filter(m => {
        if (m.type !== 'expense') return false;
        const date = new Date(m.date);
        return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
      })
      .reduce((sum, m) => sum + m.amount, 0);
  }, [movements]);

  const stats = useMemo(() => {
    const limit = Math.max(settings.monthlyLimit || DEFAULT_SETTINGS.monthlyLimit, 0);
    const usedPercent = limit === 0 ? 0 : monthlyExpenses / limit;
    const remaining = Math.max(limit - monthlyExpenses, 0);
    const today = new Date();
    const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0);
    const daysLeft = Math.max(lastDay.getDate() - today.getDate(), 0);
    const perDay = daysLeft > 0 ? remaining / daysLeft : remaining;

    return {
      limit,
      remaining,
      usedPercent: Math.min(usedPercent, 1),
      isNearLimit: usedPercent >= settings.alertThreshold,
      daysLeft,
      recommendedPerDay: perDay,
    };
  }, [monthlyExpenses, settings]);

  return {
    settings,
    stats,
    monthlyExpenses,
    loading,
    refresh: loadSettings,
    updateSettings,
    updateReminders,
  };
}
