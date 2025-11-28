import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, RefreshControl } from 'react-native';
import { Link, useRouter, useFocusEffect } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useMovements } from '../../hooks/useMovements';
import { useAnalytics } from '../../hooks/useAnalytics';
import { useThemeColor } from '../../hooks/use-theme-color';
import { BalanceCard } from '../../components/BalanceCard';
import { MovementItem } from '../../components/MovementItem';
import { ChartSection } from '../../components/ChartSection';
import { useBudget } from '../../hooks/useBudget';
import { BudgetProgressCard } from '../../components/BudgetProgressCard';
import { ReminderList } from '../../components/ReminderList';

export default function Dashboard() {
  const router = useRouter();
  const colors = useThemeColor();
  const { movements, deleteMovement, loading, refresh } = useMovements();
  const analytics = useAnalytics(movements);
  const budget = useBudget(movements);
  const [refreshing, setRefreshing] = React.useState(false);
  const { stats, settings, monthlyExpenses, updateReminders } = budget;

  const handleToggleDaily = React.useCallback(
    (value: boolean) => updateReminders({ remindDaily: value }),
    [updateReminders]
  );

  const handleToggleWeekly = React.useCallback(
    (value: boolean) => updateReminders({ remindWeeklyReview: value }),
    [updateReminders]
  );

  // Recargar datos cada vez que la pantalla gana foco
  useFocusEffect(
    React.useCallback(() => {
      refresh();
    }, [refresh])
  );

  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    await refresh();
    setRefreshing(false);
  }, [refresh]);

  const recentMovements = movements.slice(0, 5);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <View>
          <Text style={[styles.greeting, { color: colors.textSecondary }]}>
            Hola 👋
          </Text>
          <Text style={[styles.title, { color: colors.text }]}>
            Tu Balance
          </Text>
        </View>
        <Link href="/settings" asChild>
          <TouchableOpacity style={styles.settingsButton}>
            <Ionicons name="settings-outline" size={24} color={colors.text} />
          </TouchableOpacity>
        </Link>
      </View>

      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={colors.primary}
            colors={[colors.primary]}
          />
        }
      >
        <BalanceCard
          balance={analytics.balance}
          income={analytics.totalIncome}
          expenses={analytics.totalExpenses}
        />

        <BudgetProgressCard
          limit={stats.limit}
          spent={monthlyExpenses}
          usedPercent={stats.usedPercent}
          remaining={stats.remaining}
          daysLeft={stats.daysLeft}
          recommendedPerDay={stats.recommendedPerDay}
          nearLimit={stats.isNearLimit}
        />

        {analytics.dailyExpenses.length > 0 && (
          <ChartSection data={analytics.dailyExpenses} />
        )}

        <ReminderList
          remindDaily={settings.reminders.remindDaily}
          remindWeeklyReview={settings.reminders.remindWeeklyReview}
          customMessages={settings.reminders.customMessages}
          onToggleDaily={handleToggleDaily}
          onToggleWeekly={handleToggleWeekly}
        />

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              Movimientos Recientes
            </Text>
            <Link href="/movements" asChild>
              <TouchableOpacity>
                <Text style={[styles.seeAll, { color: colors.primary }]}>
                  Ver todos
                </Text>
              </TouchableOpacity>
            </Link>
          </View>

          {recentMovements.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
                No hay movimientos aún
              </Text>
              <Text style={[styles.emptySubtext, { color: colors.textSecondary }]}>
                Agrega tu primer movimiento
              </Text>
            </View>
          ) : (
            recentMovements.map(movement => (
              <MovementItem
                key={movement.id}
                movement={movement}
                onDelete={deleteMovement}
              />
            ))
          )}
        </View>

        <View style={styles.quickActions}>
          <Link href="/movements" asChild>
            <TouchableOpacity style={[styles.actionButton, { backgroundColor: colors.card }]}>
              <Ionicons name="list-outline" size={24} color={colors.primary} />
              <Text style={[styles.actionText, { color: colors.text }]}>
                Movimientos
              </Text>
            </TouchableOpacity>
          </Link>

          <Link href="/analytics" asChild>
            <TouchableOpacity style={[styles.actionButton, { backgroundColor: colors.card }]}>
              <Ionicons name="stats-chart-outline" size={24} color={colors.primary} />
              <Text style={[styles.actionText, { color: colors.text }]}>
                Análisis
              </Text>
            </TouchableOpacity>
          </Link>
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>

      <TouchableOpacity
        style={[styles.fab, { backgroundColor: colors.primary }]}
        onPress={() => router.push('/add-movement')}
      >
        <Ionicons name="add" size={32} color="#FFFFFF" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 60,
    paddingBottom: 8,
  },
  greeting: {
    fontSize: 14,
    marginBottom: 4,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  settingsButton: {
    padding: 8,
  },
  scrollContent: {
    paddingBottom: 32,
  },
  section: {
    marginTop: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  seeAll: {
    fontSize: 14,
    fontWeight: '600',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  emptySubtext: {
    fontSize: 14,
  },
  quickActions: {
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: 16,
    marginTop: 24,
  },
  actionButton: {
    flex: 1,
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
    gap: 8,
  },
  actionText: {
    fontSize: 14,
    fontWeight: '600',
  },
  fab: {
    position: 'absolute',
    right: 16,
    bottom: 32,
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
});
