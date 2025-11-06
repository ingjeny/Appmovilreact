import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { useThemeColor } from '../hooks/use-theme-color';

interface ChartSectionProps {
  data: { date: string; amount: number }[];
}

const screenWidth = Dimensions.get('window').width;

export function ChartSection({ data }: ChartSectionProps) {
  const colors = useThemeColor();

  const chartData = {
    labels: data.map(d => d.date),
    datasets: [{
      data: data.map(d => d.amount),
    }],
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.card }]}>
      <Text style={[styles.title, { color: colors.text }]}>
        Gastos de los últimos 7 días
      </Text>
      <LineChart
        data={chartData}
        width={screenWidth - 48}
        height={220}
        chartConfig={{
          backgroundColor: colors.card,
          backgroundGradientFrom: colors.card,
          backgroundGradientTo: colors.card,
          decimalPlaces: 0,
          color: (opacity = 1) => `rgba(255, 59, 48, ${opacity})`,
          labelColor: (opacity = 1) => colors.textSecondary,
          style: {
            borderRadius: 16,
          },
          propsForDots: {
            r: '6',
            strokeWidth: '2',
            stroke: colors.expense,
          },
        }}
        bezier
        style={styles.chart}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    borderRadius: 16,
    marginHorizontal: 16,
    marginTop: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
  },
});