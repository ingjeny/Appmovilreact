import React from 'react';
import { View, Text, StyleSheet, Switch, TouchableOpacity } from 'react-native';
import { useThemeColor } from '../hooks/use-theme-color';

interface ReminderListProps {
  remindDaily: boolean;
  remindWeeklyReview: boolean;
  customMessages: string[];
  onToggleDaily: (value: boolean) => void;
  onToggleWeekly: (value: boolean) => void;
  onAddMessage?: () => void;
  onRemoveMessage?: (index: number) => void;
}

export function ReminderList({
  remindDaily,
  remindWeeklyReview,
  customMessages,
  onToggleDaily,
  onToggleWeekly,
  onAddMessage,
  onRemoveMessage,
}: ReminderListProps) {
  const colors = useThemeColor();

  return (
    <View style={[styles.card, { backgroundColor: colors.card }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>Recordatorios</Text>
        {onAddMessage && (
          <TouchableOpacity onPress={onAddMessage}>
            <Text style={{ color: colors.primary, fontWeight: '600' }}>Editar mensajes</Text>
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.row}>
        <View>
          <Text style={[styles.rowTitle, { color: colors.text }]}>Registra tus gastos de hoy</Text>
          <Text style={[styles.rowSubtitle, { color: colors.textSecondary }]}>
            Recibe un recordatorio diario para no olvidar
          </Text>
        </View>
        <Switch
          value={remindDaily}
          onValueChange={onToggleDaily}
          thumbColor={colors.primary}
          trackColor={{ true: colors.primary + '40', false: colors.border }}
        />
      </View>

      <View style={styles.row}>
        <View>
          <Text style={[styles.rowTitle, { color: colors.text }]}>
            Revisa tu presupuesto semanal
          </Text>
          <Text style={[styles.rowSubtitle, { color: colors.textSecondary }]}>
            Resumen cada domingo para ajustar
          </Text>
        </View>
        <Switch
          value={remindWeeklyReview}
          onValueChange={onToggleWeekly}
          thumbColor={colors.primary}
          trackColor={{ true: colors.primary + '40', false: colors.border }}
        />
      </View>

      {customMessages.length > 0 && (
        <View style={styles.messageList}>
          <Text style={[styles.messageTitle, { color: colors.textSecondary }]}>
            Mensajes personalizados
          </Text>
          {customMessages.map((message, index) => (
            <View key={`${message}-${index}`} style={styles.messageRow}>
              <Text style={[styles.messageItem, { color: colors.text }]}>- {message}</Text>
              {onRemoveMessage && (
                <TouchableOpacity onPress={() => onRemoveMessage(index)}>
                  <Text style={[styles.removeText, { color: colors.danger }]}>Eliminar</Text>
                </TouchableOpacity>
              )}
            </View>
          ))}
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
    gap: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 16,
  },
  rowTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  rowSubtitle: {
    fontSize: 13,
    marginTop: 2,
  },
  messageList: {
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#00000020',
    paddingTop: 12,
    gap: 6,
  },
  messageRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  messageTitle: {
    fontSize: 13,
    fontWeight: '600',
  },
  messageItem: {
    fontSize: 13,
  },
  removeText: {
    fontSize: 12,
    fontWeight: '600',
  },
});
