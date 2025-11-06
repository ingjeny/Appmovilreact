import React from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions } from 'react-native';
import { PieChart } from 'react-native-chart-kit';
import { useMovements } from '../../hooks/useMovements';
import { useAnalytics } from '../../hooks/useAnalytics';
import { useThemeColor } from '../../hooks/use-theme-color';
import { getCategoryById } from '../../constants/Categories';
import { Ionicons } from '@expo/vector-icons';

const screenWidth = Dimensions.get('window').width;

export default function AnalyticsScreen() {
  const colors = useThemeColor();
  const { movements } = useMovements();
  const analytics = useAnalytics(movements);

  // Preparar datos para el gráfico de gastos
  const expenseChartData = Object.entries(analytics.expensesByCategory)
    .map(([categoryId, amount]) => {
      const category = getCategoryById(categoryId);
      return {
        name: category?.name || categoryId,
        amount,
        color: category?.color || '#BDC3C7',
        legendFontColor: colors.text,
        legendFontSize: 14,
      };
    })
    .sort((a, b) => b.amount - a.amount)
    .slice(0, 6); // Top 6 categorías

  // Preparar datos para el gráfico de ingresos
  const incomeChartData = Object.entries(analytics.incomeByCategory)
    .map(([categoryId, amount]) => {
      const category = getCategoryById(categoryId);
      return {
        name: category?.name || categoryId,
        amount,
        color: category?.color || '#2ECC71',
        legendFontColor: colors.text,
        legendFontSize: 14,
      };
    })
    .sort((a, b) => b.amount - a.amount);

  const chartConfig = {
    backgroundColor: colors.card,
    backgroundGradientFrom: colors.card,
    backgroundGradientTo: colors.card,
    color: (opacity = 1) => colors.primary,
  };

  return (
    <ScrollView 
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={styles.content}
    >
      {/* Resumen General */}
      <View style={[styles.card, { backgroundColor: colors.card }]}>
        <Text style={[styles.cardTitle, { color: colors.text }]}>
          📊 Resumen General
        </Text>
        
        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
              Balance Total
            </Text>
            <Text style={[
              styles.statValue, 
              { color: analytics.balance >= 0 ? colors.success : colors.danger }
            ]}>
              ${analytics.balance.toLocaleString('es-CO')}
            </Text>
          </View>
        </View>

        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
              Total Ingresos
            </Text>
            <Text style={[styles.statValue, { color: colors.income }]}>
              ${analytics.totalIncome.toLocaleString('es-CO')}
            </Text>
          </View>

          <View style={styles.statItem}>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
              Total Gastos
            </Text>
            <Text style={[styles.statValue, { color: colors.expense }]}>
              ${analytics.totalExpenses.toLocaleString('es-CO')}
            </Text>
          </View>
        </View>

        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
              Movimientos
            </Text>
            <Text style={[styles.statValue, { color: colors.text }]}>
              {movements.length}
            </Text>
          </View>

          <View style={styles.statItem}>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
              Promedio Gasto
            </Text>
            <Text style={[styles.statValue, { color: colors.text }]}>
              ${Math.round(
                movements.filter(m => m.type === 'expense').length > 0
                  ? analytics.totalExpenses / movements.filter(m => m.type === 'expense').length
                  : 0
              ).toLocaleString('es-CO')}
            </Text>
          </View>
        </View>
      </View>

      {/* Gráfico de Gastos por Categoría */}
      {expenseChartData.length > 0 && (
        <View style={[styles.card, { backgroundColor: colors.card }]}>
          <Text style={[styles.cardTitle, { color: colors.text }]}>
            💸 Gastos por Categoría
          </Text>
          <PieChart
            data={expenseChartData}
            width={screenWidth - 64}
            height={220}
            chartConfig={chartConfig}
            accessor="amount"
            backgroundColor="transparent"
            paddingLeft="15"
            absolute
          />
        </View>
      )}

      {/* Top Gastos */}
      {expenseChartData.length > 0 && (
        <View style={[styles.card, { backgroundColor: colors.card }]}>
          <Text style={[styles.cardTitle, { color: colors.text }]}>
            🏆 Top Categorías de Gastos
          </Text>
          {expenseChartData.map((item, index) => {
            const percentage = (item.amount / analytics.totalExpenses) * 100;
            return (
              <View key={item.name} style={styles.categoryItem}>
                <View style={styles.categoryHeader}>
                  <View style={styles.categoryInfo}>
                    <View 
                      style={[styles.categoryDot, { backgroundColor: item.color }]} 
                    />
                    <Text style={[styles.categoryName, { color: colors.text }]}>
                      {item.name}
                    </Text>
                  </View>
                  <Text style={[styles.categoryAmount, { color: colors.text }]}>
                    ${item.amount.toLocaleString('es-CO')}
                  </Text>
                </View>
                <View style={[styles.progressBar, { backgroundColor: colors.border }]}>
                  <View 
                    style={[
                      styles.progressFill, 
                      { backgroundColor: item.color, width: `${percentage}%` }
                    ]} 
                  />
                </View>
                <Text style={[styles.percentage, { color: colors.textSecondary }]}>
                  {percentage.toFixed(1)}% del total
                </Text>
              </View>
            );
          })}
        </View>
      )}

      {/* Gráfico de Ingresos */}
      {incomeChartData.length > 0 && (
        <View style={[styles.card, { backgroundColor: colors.card }]}>
          <Text style={[styles.cardTitle, { color: colors.text }]}>
            💰 Ingresos por Categoría
          </Text>
          <PieChart
            data={incomeChartData}
            width={screenWidth - 64}
            height={220}
            chartConfig={chartConfig}
            accessor="amount"
            backgroundColor="transparent"
            paddingLeft="15"
            absolute
          />
        </View>
      )}

      {/* Estado vacío */}
      {movements.length === 0 && (
        <View style={styles.emptyState}>
          <Ionicons name="stats-chart-outline" size={64} color={colors.textSecondary} />
          <Text style={[styles.emptyTitle, { color: colors.text }]}>
            Sin datos para analizar
          </Text>
          <Text style={[styles.emptySubtitle, { color: colors.textSecondary }]}>
            Agrega movimientos para ver tus estadísticas
          </Text>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 16,
    paddingBottom: 32,
  },
  card: {
    padding: 20,
    borderRadius: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  statItem: {
    flex: 1,
  },
  statLabel: {
    fontSize: 13,
    marginBottom: 6,
  },
  statValue: {
    fontSize: 22,
    fontWeight: 'bold',
  },
  categoryItem: {
    marginBottom: 20,
  },
  categoryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  categoryInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  categoryDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  categoryName: {
    fontSize: 15,
    fontWeight: '600',
  },
  categoryAmount: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  progressBar: {
    height: 8,
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 6,
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  percentage: {
    fontSize: 12,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 80,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
  },
});