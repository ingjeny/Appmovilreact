import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { Movement } from '../types';
import { getCategoryById } from '../constants/Categories';
import { useThemeColor } from '../hooks/use-theme-color';

interface MovementItemProps {
  movement: Movement;
  onDelete: (id: string) => void;
}

export function MovementItem({ movement, onDelete }: MovementItemProps) {
  const colors = useThemeColor();
  const category = getCategoryById(movement.category);

  const handleLongPress = () => {
    Alert.alert(
      'Eliminar Movimiento',
      '¿Estás seguro de que quieres eliminar este movimiento?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Eliminar', 
          style: 'destructive',
          onPress: () => onDelete(movement.id)
        },
      ]
    );
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('es-CO', { 
      day: 'numeric', 
      month: 'short' 
    });
  };

  return (
    <TouchableOpacity
      style={[styles.container, { backgroundColor: colors.card }]}
      onLongPress={handleLongPress}
      activeOpacity={0.7}
    >
      <View style={[styles.iconContainer, { backgroundColor: category?.color + '20' }]}>
        <Text style={styles.icon}>{category?.icon || '📦'}</Text>
      </View>
      
      <View style={styles.content}>
        <Text style={[styles.description, { color: colors.text }]}>
          {movement.description}
        </Text>
        <Text style={[styles.category, { color: colors.textSecondary }]}>
          {category?.name || 'Sin categoría'} • {formatDate(movement.date)}
        </Text>
      </View>
      
      <Text
        style={[
          styles.amount,
          { color: movement.type === 'income' ? colors.income : colors.expense }
        ]}
      >
        {movement.type === 'income' ? '+' : '-'}$
        {movement.amount.toLocaleString('es-CO', { minimumFractionDigits: 0 })}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    marginHorizontal: 16,
    marginVertical: 4,
    borderRadius: 12,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  icon: {
    fontSize: 24,
  },
  content: {
    flex: 1,
  },
  description: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  category: {
    fontSize: 13,
  },
  amount: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});