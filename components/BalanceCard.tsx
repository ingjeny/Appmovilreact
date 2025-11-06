import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useThemeColor } from '../hooks/use-theme-color';

interface BalanceCardProps {
  balance: number;
  income: number;
  expenses: number;
}

export function BalanceCard({ balance, income, expenses }: BalanceCardProps) {
  const colors = useThemeColor();

  return (
    <View style={[styles.container, { backgroundColor: colors.card }]}>
      <Text style={[styles.label, { color: colors.textSecondary }]}>
        Balance Total
      </Text>
      <Text style={[styles.balance, { color: balance >= 0 ? colors.success : colors.danger }]}>
        ${balance.toLocaleString('es-CO', { minimumFractionDigits: 0 })}
      </Text>
      
      <View style={styles.row}>
        <View style={styles.item}>
          <Text style={[styles.itemLabel, { color: colors.textSecondary }]}>
            Ingresos
          </Text>
          <Text style={[styles.itemValue, { color: colors.income }]}>
            +${income.toLocaleString('es-CO', { minimumFractionDigits: 0 })}
          </Text>
        </View>
        
        <View style={[styles.divider, { backgroundColor: colors.border }]} />
        
        <View style={styles.item}>
          <Text style={[styles.itemLabel, { color: colors.textSecondary }]}>
            Gastos
          </Text>
          <Text style={[styles.itemValue, { color: colors.expense }]}>
            -${expenses.toLocaleString('es-CO', { minimumFractionDigits: 0 })}
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
    borderRadius: 16,
    marginHorizontal: 16,
    marginTop: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 8,
  },
  balance: {
    fontSize: 36,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  item: {
    flex: 1,
  },
  itemLabel: {
    fontSize: 12,
    marginBottom: 4,
  },
  itemValue: {
    fontSize: 18,
    fontWeight: '600',
  },
  divider: {
    width: 1,
    height: 40,
    marginHorizontal: 16,
  },
});