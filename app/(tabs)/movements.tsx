import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useMovements } from '../../hooks/useMovements';
import { useThemeColor } from '../../hooks/use-theme-color';
import { MovementItem } from '../../components/MovementItem';
import { Movement } from '../../types';

export default function MovementsScreen() {
  const router = useRouter();
  const colors = useThemeColor();
  const { movements, deleteMovement } = useMovements();
  const [filter, setFilter] = useState<'all' | 'income' | 'expense'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredMovements = movements.filter(movement => {
    const matchesFilter = filter === 'all' || movement.type === filter;
    const matchesSearch = movement.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         movement.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const getFilterCount = (type: 'all' | 'income' | 'expense') => {
    if (type === 'all') return movements.length;
    return movements.filter(m => m.type === type).length;
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Barra de búsqueda */}
      <View style={[styles.searchContainer, { backgroundColor: colors.card }]}>
        <Ionicons name="search-outline" size={20} color={colors.textSecondary} />
        <TextInput
          style={[styles.searchInput, { color: colors.text }]}
          placeholder="Buscar movimientos..."
          placeholderTextColor={colors.textSecondary}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={() => setSearchQuery('')}>
            <Ionicons name="close-circle" size={20} color={colors.textSecondary} />
          </TouchableOpacity>
        )}
      </View>

      {/* Filtros */}
      <View style={styles.filterContainer}>
        <TouchableOpacity
          style={[
            styles.filterButton,
            { backgroundColor: filter === 'all' ? colors.primary : colors.card }
          ]}
          onPress={() => setFilter('all')}
        >
          <Text
            style={[
              styles.filterText,
              { color: filter === 'all' ? '#FFFFFF' : colors.text }
            ]}
          >
            Todos ({getFilterCount('all')})
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.filterButton,
            { backgroundColor: filter === 'income' ? colors.income : colors.card }
          ]}
          onPress={() => setFilter('income')}
        >
          <Text
            style={[
              styles.filterText,
              { color: filter === 'income' ? '#FFFFFF' : colors.text }
            ]}
          >
            Ingresos ({getFilterCount('income')})
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.filterButton,
            { backgroundColor: filter === 'expense' ? colors.expense : colors.card }
          ]}
          onPress={() => setFilter('expense')}
        >
          <Text
            style={[
              styles.filterText,
              { color: filter === 'expense' ? '#FFFFFF' : colors.text }
            ]}
          >
            Gastos ({getFilterCount('expense')})
          </Text>
        </TouchableOpacity>
      </View>

      {/* Lista de movimientos */}
      <ScrollView 
        style={styles.list}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      >
        {filteredMovements.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons 
              name={searchQuery ? "search-outline" : "wallet-outline"} 
              size={64} 
              color={colors.textSecondary} 
            />
            <Text style={[styles.emptyTitle, { color: colors.text }]}>
              {searchQuery ? 'Sin resultados' : 'No hay movimientos'}
            </Text>
            <Text style={[styles.emptySubtitle, { color: colors.textSecondary }]}>
              {searchQuery 
                ? 'Intenta con otra búsqueda'
                : 'Agrega tu primer movimiento'}
            </Text>
          </View>
        ) : (
          <>
            {/* Agrupar por mes */}
            {Object.entries(groupByMonth(filteredMovements)).map(([month, items]) => (
              <View key={month}>
                <Text style={[styles.monthHeader, { color: colors.textSecondary }]}>
                  {month}
                </Text>
                {items.map(movement => (
                  <MovementItem
                    key={movement.id}
                    movement={movement}
                    onDelete={deleteMovement}
                  />
                ))}
              </View>
            ))}
          </>
        )}
      </ScrollView>

      {/* FAB */}
      <TouchableOpacity
        style={[styles.fab, { backgroundColor: colors.primary }]}
        onPress={() => router.push('/add-movement')}
      >
        <Ionicons name="add" size={32} color="#FFFFFF" />
      </TouchableOpacity>
    </View>
  );
}

// Función auxiliar para agrupar por mes
function groupByMonth(movements: Movement[]) {
  const grouped: { [key: string]: Movement[] } = {};
  
  movements.forEach(movement => {
    const date = new Date(movement.date);
    const monthKey = date.toLocaleDateString('es-CO', { 
      year: 'numeric', 
      month: 'long' 
    });
    
    if (!grouped[monthKey]) {
      grouped[monthKey] = [];
    }
    grouped[monthKey].push(movement);
  });
  
  return grouped;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    margin: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    gap: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
  },
  filterContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    gap: 8,
    marginBottom: 16,
  },
  filterButton: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  filterText: {
    fontSize: 13,
    fontWeight: '600',
  },
  list: {
    flex: 1,
  },
  listContent: {
    paddingBottom: 100,
  },
  monthHeader: {
    fontSize: 14,
    fontWeight: '600',
    textTransform: 'capitalize',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
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