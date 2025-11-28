import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { useThemeColor } from '../hooks/use-theme-color';

interface BudgetProgressCardProps {
  limit: number;
  spent: number;
  usedPercent: number;
  remaining: number;
  daysLeft: number;
  recommendedPerDay: number;
  nearLimit: boolean;
}

export function BudgetProgressCard({
  limit,
  spent,
  usedPercent,
  remaining,
  daysLeft,
  recommendedPerDay,
  nearLimit,
}: BudgetProgressCardProps) {
  const colors = useThemeColor();
  const progressWidth = `${Math.min(usedPercent * 100, 100)}%`;

  return (
    <View style={[styles.card, { backgroundColor: colors.card }]}>
      <Text style={[styles.label, { color: colors.textSecondary }]}>Presupuesto mensual</Text>
      <Text style={[styles.amount, { color: colors.text }]}>
        ${limit.toLocaleString('es-CO', { maximumFractionDigits: 0 })}
      </Text>
      <Text style={[styles.spent, { color: colors.textSecondary }]}>
        Gastado: ${spent.toLocaleString('es-CO', { maximumFractionDigits: 0 })}
      </Text>

      <View style={[styles.progressTrack, { backgroundColor: colors.border }]}>
        <View
          style={[
            styles.progressFill,
            {
              width: progressWidth,
              backgroundColor: nearLimit ? colors.danger : colors.primary,
            },
          ]}
        />
      </View>

      <View style={styles.row}>
        <Text style={[styles.helper, { color: colors.textSecondary }]}>
          {Math.round(usedPercent * 100)}% usado
        </Text>
        <Text style={[styles.helper, { color: colors.textSecondary }]}>
          Restante: ${remaining.toLocaleString('es-CO', { maximumFractionDigits: 0 })}
        </Text>
      </View>

      <View style={styles.statsRow}>
        <View style={[styles.statBox, { borderColor: colors.border }]}>
          <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Dias restantes</Text>
          <Text style={[styles.statValue, { color: colors.text }]}>{daysLeft}</Text>
        </View>
        <View style={[styles.statBox, { borderColor: colors.border }]}>
          <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Puedes gastar</Text>
          <Text style={[styles.statValue, { color: colors.success }]}>
            $
            {Math.max(0, Math.round(recommendedPerDay)).toLocaleString('es-CO', {
              maximumFractionDigits: 0,
            })}
          </Text>
          <Text style={[styles.statHelper, { color: colors.textSecondary }]}>por dia</Text>
        </View>
      </View>

      {nearLimit && (
        <View style={[styles.alertBox, { backgroundColor: colors.danger + '20' }]}>
          <Text style={[styles.alertText, { color: colors.danger }]}>
            Atencion! Estas cerca de tu limite mensual.
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    marginHorizontal: 16,
    padding: 20,
    borderRadius: 16,
    marginTop: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 4,
  },
  amount: {
    fontSize: 28,
    fontWeight: '700',
  },
  spent: {
    marginTop: 4,
    fontSize: 14,
    marginBottom: 12,
  },
  progressTrack: {
    height: 10,
    borderRadius: 8,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 8,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  helper: {
    fontSize: 12,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
    gap: 12,
  },
  statBox: {
    flex: 1,
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 12,
  },
  statValue: {
    fontSize: 20,
    fontWeight: '700',
    marginTop: 4,
  },
  statHelper: {
    fontSize: 12,
    marginTop: 2,
  },
  alertBox: {
    marginTop: 16,
    padding: 12,
    borderRadius: 12,
  },
  alertText: {
    fontSize: 13,
    fontWeight: '600',
    textAlign: 'center',
  },
});
