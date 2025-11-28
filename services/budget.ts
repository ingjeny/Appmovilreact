import AsyncStorage from '@react-native-async-storage/async-storage';
import { BudgetSettings, ReminderSettings } from '../types';

const SETTINGS_KEY = '@GastosApp:budgetSettings';

const DEFAULT_REMINDERS: ReminderSettings = {
  remindDaily: true,
  remindWeeklyReview: true,
  customMessages: ['Registra tus gastos de hoy', 'Revisa tu presupuesto semanal'],
};

const DEFAULT_SETTINGS: BudgetSettings = {
  monthlyLimit: 1500000,
  alertThreshold: 0.8,
  reminders: DEFAULT_REMINDERS,
};

export const budgetService = {
  async getSettings(): Promise<BudgetSettings> {
    try {
      const raw = await AsyncStorage.getItem(SETTINGS_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        return {
          monthlyLimit: parsed.monthlyLimit ?? DEFAULT_SETTINGS.monthlyLimit,
          alertThreshold: parsed.alertThreshold ?? DEFAULT_SETTINGS.alertThreshold,
          reminders: {
            remindDaily: parsed.reminders?.remindDaily ?? DEFAULT_REMINDERS.remindDaily,
            remindWeeklyReview:
              parsed.reminders?.remindWeeklyReview ?? DEFAULT_REMINDERS.remindWeeklyReview,
            customMessages: parsed.reminders?.customMessages ?? DEFAULT_REMINDERS.customMessages,
          },
        };
      }
    } catch (error) {
      console.error('Error loading budget settings:', error);
    }
    return DEFAULT_SETTINGS;
  },

  async saveSettings(settings: BudgetSettings): Promise<void> {
    try {
      await AsyncStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
    } catch (error) {
      console.error('Error saving budget settings:', error);
    }
  },
};
