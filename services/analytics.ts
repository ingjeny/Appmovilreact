import { Movement, AnalyticsData } from '../types';

export const analyticsService = {
  calculateAnalytics(movements: Movement[]): AnalyticsData {
    const totalIncome = movements
      .filter(m => m.type === 'income')
      .reduce((sum, m) => sum + m.amount, 0);

    const totalExpenses = movements
      .filter(m => m.type === 'expense')
      .reduce((sum, m) => sum + m.amount, 0);

    const expensesByCategory: { [key: string]: number } = {};
    const incomeByCategory: { [key: string]: number } = {};

    movements.forEach(movement => {
      if (movement.type === 'expense') {
        expensesByCategory[movement.category] = 
          (expensesByCategory[movement.category] || 0) + movement.amount;
      } else {
        incomeByCategory[movement.category] = 
          (incomeByCategory[movement.category] || 0) + movement.amount;
      }
    });

    // Calcular gastos diarios de los últimos 7 días
    const dailyExpenses = this.getDailyExpenses(movements, 7);

    return {
      totalIncome,
      totalExpenses,
      balance: totalIncome - totalExpenses,
      expensesByCategory,
      incomeByCategory,
      dailyExpenses,
    };
  },

  getDailyExpenses(movements: Movement[], days: number): { date: string; amount: number }[] {
    const today = new Date();
    const result: { date: string; amount: number }[] = [];

    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];

      const dayExpenses = movements
        .filter(m => m.type === 'expense' && m.date.startsWith(dateStr))
        .reduce((sum, m) => sum + m.amount, 0);

      result.push({
        date: this.formatDateShort(date),
        amount: dayExpenses,
      });
    }

    return result;
  },

  formatDateShort(date: Date): string {
    const days = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
    return days[date.getDay()];
  },
};