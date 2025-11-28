import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useThemeColor } from '../hooks/use-theme-color';
import { useMovements } from '../hooks/useMovements';
import { EXPENSE_CATEGORIES, INCOME_CATEGORIES } from '../constants/Categories';
import { MovementType } from '../types';

export default function AddMovementScreen() {
  const router = useRouter();
  const colors = useThemeColor();
  const { addMovement } = useMovements();

  const [type, setType] = useState<MovementType>('expense');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  const categories = type === 'expense' ? EXPENSE_CATEGORIES : INCOME_CATEGORIES;

  const handleSave = async () => {
    // Validaciones
    if (!amount || parseFloat(amount) <= 0) {
      Alert.alert('Error', 'Ingresa un monto válido');
      return;
    }

    if (!description.trim()) {
      Alert.alert('Error', 'Ingresa una descripción');
      return;
    }

    if (!selectedCategory) {
      Alert.alert('Error', 'Selecciona una categoría');
      return;
    }

    const movement = {
      id: Date.now().toString(),
      amount: parseFloat(amount),
      description: description.trim(),
      category: selectedCategory,
      type,
      date: new Date().toISOString(),
    };

    await addMovement(movement);
    router.back();
  };

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: colors.background }]}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView 
        style={styles.content}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Selector de Tipo */}
        <View style={styles.section}>
          <Text style={[styles.label, { color: colors.text }]}>Tipo</Text>
          <View style={styles.typeSelector}>
            <TouchableOpacity
              style={[
                styles.typeButton,
                type === 'expense' && { backgroundColor: colors.expense },
                type !== 'expense' && { backgroundColor: colors.card },
              ]}
              onPress={() => {
                setType('expense');
                setSelectedCategory('');
              }}
            >
              <Text
                style={[
                  styles.typeText,
                  { color: type === 'expense' ? '#FFFFFF' : colors.text },
                ]}
              >
                💸 Gasto
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.typeButton,
                type === 'income' && { backgroundColor: colors.income },
                type !== 'income' && { backgroundColor: colors.card },
              ]}
              onPress={() => {
                setType('income');
                setSelectedCategory('');
              }}
            >
              <Text
                style={[
                  styles.typeText,
                  { color: type === 'income' ? '#FFFFFF' : colors.text },
                ]}
              >
                💰 Ingreso
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Monto */}
        <View style={styles.section}>
          <Text style={[styles.label, { color: colors.text }]}>Monto</Text>
          <View style={[styles.inputContainer, { backgroundColor: colors.card }]}>
            <Text style={[styles.currency, { color: colors.textSecondary }]}>$</Text>
            <TextInput
              style={[styles.input, { color: colors.text }]}
              placeholder="0"
              placeholderTextColor={colors.textSecondary}
              keyboardType="numeric"
              value={amount}
              onChangeText={setAmount}
            />
          </View>
        </View>

        {/* Descripción */}
        <View style={styles.section}>
          <Text style={[styles.label, { color: colors.text }]}>Descripción</Text>
          <TextInput
            style={[
              styles.inputContainer,
              styles.textInput,
              { backgroundColor: colors.card, color: colors.text },
            ]}
            placeholder="Descripcion de tu gasto o ingreso"
            placeholderTextColor={colors.textSecondary}
            value={description}
            onChangeText={setDescription}
            maxLength={50}
          />
        </View>

        {/* Categorías */}
        <View style={styles.section}>
          <Text style={[styles.label, { color: colors.text }]}>Categoría</Text>
          <View style={styles.categoriesGrid}>
            {categories.map(category => (
              <TouchableOpacity
                key={category.id}
                style={[
                  styles.categoryCard,
                  { 
                    backgroundColor: selectedCategory === category.id 
                      ? category.color 
                      : colors.card 
                  },
                ]}
                onPress={() => setSelectedCategory(category.id)}
              >
                <Text style={styles.categoryIcon}>{category.icon}</Text>
                <Text
                  style={[
                    styles.categoryName,
                    { 
                      color: selectedCategory === category.id 
                        ? '#FFFFFF' 
                        : colors.text 
                    },
                  ]}
                >
                  {category.name}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>

      {/* Botón Guardar */}
      <View style={[styles.footer, { backgroundColor: colors.background, borderTopColor: colors.border }]}>
        <TouchableOpacity
          style={[styles.saveButton, { backgroundColor: colors.primary }]}
          onPress={handleSave}
        >
          <Text style={styles.saveButtonText}>Guardar Movimiento</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 100,
  },
  section: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  typeSelector: {
    flexDirection: 'row',
    gap: 12,
  },
  typeButton: {
    flex: 1,
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 12,
    alignItems: 'center',
  },
  typeText: {
    fontSize: 16,
    fontWeight: '600',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderRadius: 12,
  },
  currency: {
    fontSize: 24,
    fontWeight: '600',
    marginRight: 8,
  },
  input: {
    flex: 1,
    fontSize: 24,
    fontWeight: '600',
  },
  textInput: {
    fontSize: 16,
  },
  categoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  categoryCard: {
    width: '30%',
    aspectRatio: 1,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
  },
  categoryIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  categoryName: {
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
    borderTopWidth: 1,
  },
  saveButton: {
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});