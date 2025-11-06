import AsyncStorage from '@react-native-async-storage/async-storage';
import { SavingsGoal } from '../types';

const GOALS_KEY = '@GastosApp:goals';

export const goalsService = {
  async getGoals(): Promise<SavingsGoal[]> {
    try {
      const data = await AsyncStorage.getItem(GOALS_KEY);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error loading goals:', error);
      return [];
    }
  },

  async saveGoals(goals: SavingsGoal[]): Promise<void> {
    try {
      await AsyncStorage.setItem(GOALS_KEY, JSON.stringify(goals));
    } catch (error) {
      console.error('Error saving goals:', error);
    }
  },

  async addGoal(goal: SavingsGoal): Promise<void> {
    const goals = await this.getGoals();
    goals.push(goal);
    await this.saveGoals(goals);
  },

  async updateGoal(id: string, updates: Partial<SavingsGoal>): Promise<void> {
    const goals = await this.getGoals();
    const index = goals.findIndex(g => g.id === id);
    if (index !== -1) {
      goals[index] = { ...goals[index], ...updates };
      await this.saveGoals(goals);
    }
  },

  async deleteGoal(id: string): Promise<void> {
    const goals = await this.getGoals();
    const filtered = goals.filter(g => g.id !== id);
    await this.saveGoals(filtered);
  },

  async addToGoal(goalId: string, amount: number): Promise<void> {
    const goals = await this.getGoals();
    const goal = goals.find(g => g.id === goalId);
    if (goal) {
      goal.currentAmount += amount;
      if (goal.currentAmount >= goal.targetAmount) {
        goal.completed = true;
      }
      await this.saveGoals(goals);
    }
  },
};