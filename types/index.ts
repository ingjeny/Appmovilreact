export type MovementType = 'income' | 'expense';

export interface Movement {
  id: string;
  amount: number;
  category: string;
  description: string;
  date: string;
  type: MovementType;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  color: string;
  type: MovementType;
}

export interface AnalyticsData {
  totalIncome: number;
  totalExpenses: number;
  balance: number;
  expensesByCategory: { [key: string]: number };
  incomeByCategory: { [key: string]: number };
  dailyExpenses: { date: string; amount: number }[];
}

export interface SavingsGoal {
  id: string;
  title: string;
  targetAmount: number;
  currentAmount: number;
  deadline: string;
  icon: string;
  color: string;
  createdAt: string;
  completed: boolean;
}

export interface ReminderSettings {
  remindDaily: boolean;
  remindWeeklyReview: boolean;
  customMessages: string[];
}

export interface BudgetSettings {
  monthlyLimit: number;
  alertThreshold: number;
  reminders: ReminderSettings;
}
