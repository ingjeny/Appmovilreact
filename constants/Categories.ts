import { Category } from '../types';

export const EXPENSE_CATEGORIES: Category[] = [
  { id: 'food', name: 'Comida', icon: '🍔', color: '#FF6B6B', type: 'expense' },
  { id: 'transport', name: 'Transporte', icon: '🚗', color: '#4ECDC4', type: 'expense' },
  { id: 'entertainment', name: 'Entretenimiento', icon: '🎮', color: '#95E1D3', type: 'expense' },
  { id: 'shopping', name: 'Compras', icon: '🛍️', color: '#F38181', type: 'expense' },
  { id: 'health', name: 'Salud', icon: '💊', color: '#AA96DA', type: 'expense' },
  { id: 'bills', name: 'Facturas', icon: '📄', color: '#FCBAD3', type: 'expense' },
  { id: 'education', name: 'Educación', icon: '📚', color: '#A8D8EA', type: 'expense' },
  { id: 'other', name: 'Otros', icon: '📦', color: '#BDC3C7', type: 'expense' },
];

export const INCOME_CATEGORIES: Category[] = [
  { id: 'salary', name: 'Salario', icon: '💰', color: '#2ECC71', type: 'income' },
  { id: 'freelance', name: 'Freelance', icon: '💼', color: '#3498DB', type: 'income' },
  { id: 'investment', name: 'Inversiones', icon: '📈', color: '#9B59B6', type: 'income' },
  { id: 'gift', name: 'Regalo', icon: '🎁', color: '#E74C3C', type: 'income' },
  { id: 'other-income', name: 'Otros', icon: '💵', color: '#1ABC9C', type: 'income' },
];

export const getAllCategories = (): Category[] => [
  ...EXPENSE_CATEGORIES,
  ...INCOME_CATEGORIES,
];

export const getCategoryById = (id: string): Category | undefined => {
  return getAllCategories().find(cat => cat.id === id);
};