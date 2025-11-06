import AsyncStorage from '@react-native-async-storage/async-storage';
import { Movement } from '../types';

const MOVEMENTS_KEY = '@GastosApp:movements';

export const storageService = {
  async getMovements(): Promise<Movement[]> {
    try {
      const data = await AsyncStorage.getItem(MOVEMENTS_KEY);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error loading movements:', error);
      return [];
    }
  },

  async saveMovements(movements: Movement[]): Promise<void> {
    try {
      await AsyncStorage.setItem(MOVEMENTS_KEY, JSON.stringify(movements));
    } catch (error) {
      console.error('Error saving movements:', error);
    }
  },

  async addMovement(movement: Movement): Promise<void> {
    const movements = await this.getMovements();
    movements.unshift(movement);
    await this.saveMovements(movements);
  },

  async deleteMovement(id: string): Promise<void> {
    const movements = await this.getMovements();
    const filtered = movements.filter(m => m.id !== id);
    await this.saveMovements(filtered);
  },

  async clearAllData(): Promise<void> {
    try {
      await AsyncStorage.removeItem(MOVEMENTS_KEY);
    } catch (error) {
      console.error('Error clearing data:', error);
    }
  },
};