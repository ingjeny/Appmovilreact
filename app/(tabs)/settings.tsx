import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  TextInput,
  Modal,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { useThemeColor } from '../../hooks/use-theme-color';
import { useMovements } from '../../hooks/useMovements';
import { useBudget } from '../../hooks/useBudget';
import { ReminderList } from '../../components/ReminderList';
import { AUTH_STORAGE_KEY } from '../../constants/auth';

const FEATURE_LIST = [
  { icon: '📊', text: 'Análisis detallado de gastos e ingresos' },
  { icon: '⚡', text: 'Interfaz moderna y amigable' },
  { icon: '🌙', text: 'Modo oscuro automático' },
  { icon: '🔔', text: 'Recordatorios personalizables' },
];

export default function SettingsScreen() {
  const colors = useThemeColor();
  const router = useRouter();
  const { clearAll, movements } = useMovements();
  const { settings: budgetSettings, updateSettings, updateReminders } = useBudget(movements);
  const [limitInput, setLimitInput] = React.useState(String(budgetSettings.monthlyLimit || 0));
  const [thresholdInput, setThresholdInput] = React.useState(
    String(Math.round((budgetSettings.alertThreshold || 0.8) * 100))
  );
  const [showMessageModal, setShowMessageModal] = React.useState(false);
  const [newMessage, setNewMessage] = React.useState('');

  React.useEffect(() => {
    setLimitInput(String(budgetSettings.monthlyLimit || 0));
    setThresholdInput(String(Math.round((budgetSettings.alertThreshold || 0.8) * 100)));
  }, [budgetSettings]);

  const handleClearData = () => {
    Alert.alert('Eliminar todos los datos', 'Esta acción no se puede deshacer.', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Eliminar',
        style: 'destructive',
        onPress: async () => {
          await clearAll();
          Alert.alert('Listo', 'Todos los datos han sido eliminados');
        },
      },
    ]);
  };

  const persistLimit = () => {
    const numericValue = parseInt(limitInput.replace(/[^0-9]/g, ''), 10);
    if (!Number.isNaN(numericValue)) {
      updateSettings({ monthlyLimit: numericValue });
      setLimitInput(String(numericValue));
    }
  };

  const persistThreshold = () => {
    const parsed = Number(thresholdInput);
    if (!Number.isNaN(parsed)) {
      const clamped = Math.min(Math.max(parsed, 50), 100);
      updateSettings({ alertThreshold: clamped / 100 });
      setThresholdInput(String(clamped));
    }
  };

  const handleToggleDaily = (value: boolean) => updateReminders({ remindDaily: value });
  const handleToggleWeekly = (value: boolean) => updateReminders({ remindWeeklyReview: value });

  const handleAddCustomMessage = () => {
    const trimmed = newMessage.trim();
    if (!trimmed) return;
    const updated = [...budgetSettings.reminders.customMessages, trimmed];
    updateReminders({ customMessages: updated });
    setNewMessage('');
    setShowMessageModal(false);
  };

  const handleRemoveMessage = (index: number) => {
    const updated = budgetSettings.reminders.customMessages.filter((_, i) => i !== index);
    updateReminders({ customMessages: updated });
  };

  const handleLogout = async () => {
    await AsyncStorage.removeItem(AUTH_STORAGE_KEY);
    router.replace('/login');
  };

  const SettingItem = ({
    icon,
    title,
    subtitle,
    onPress,
    color,
  }: {
    icon: string;
    title: string;
    subtitle?: string;
    onPress?: () => void;
    color?: string;
  }) => (
    <TouchableOpacity
      style={[styles.settingItem, { backgroundColor: colors.card }]}
      onPress={onPress}
      disabled={!onPress}
    >
      <View style={styles.settingLeft}>
        <View style={[styles.iconContainer, { backgroundColor: (color || colors.primary) + '20' }]}>
          <Ionicons name={icon as any} size={24} color={color || colors.primary} />
        </View>
        <View style={styles.settingText}>
          <Text style={[styles.settingTitle, { color: colors.text }]}>{title}</Text>
          {subtitle && (
            <Text style={[styles.settingSubtitle, { color: colors.textSecondary }]}>{subtitle}</Text>
          )}
        </View>
      </View>
      {onPress && <Ionicons name="chevron-forward" size={20} color={colors.textSecondary} />}
    </TouchableOpacity>
  );

  return (
    <>
      <ScrollView
        style={[styles.container, { backgroundColor: colors.background }]}
        contentContainerStyle={styles.content}
      >
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>Información</Text>
          <SettingItem icon="wallet-outline" title="GastosApp" subtitle="Versión 1.0.0" />
          <SettingItem
            icon="bar-chart-outline"
            title="Total de movimientos"
            subtitle={`${movements.length} registros`}
          />
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>
            Presupuesto Mensual
          </Text>
          <View style={[styles.card, { backgroundColor: colors.card }]}>
            <Text style={[styles.inputLabel, { color: colors.text }]}>Límite de gastos</Text>
            <TextInput
              value={limitInput}
              onChangeText={setLimitInput}
              keyboardType="numeric"
              onBlur={persistLimit}
              style={[styles.input, { color: colors.text, borderColor: colors.border }]}
              placeholder="Ingresa tu presupuesto"
              placeholderTextColor={colors.textSecondary}
            />
            <Text style={[styles.helper, { color: colors.textSecondary }]}>
              El total de gastos del mes se comparará con este valor.
            </Text>

            <Text style={[styles.inputLabel, { color: colors.text, marginTop: 16 }]}>
              Alerta a partir de (%)
            </Text>
            <TextInput
              value={thresholdInput}
              onChangeText={setThresholdInput}
              keyboardType="numeric"
              onBlur={persistThreshold}
              style={[styles.input, { color: colors.text, borderColor: colors.border }]}
              placeholder="80"
              placeholderTextColor={colors.textSecondary}
            />
            <Text style={[styles.helper, { color: colors.textSecondary }]}>
              Recibirás una alerta visual cuando alcances este porcentaje del límite.
            </Text>
          </View>

          <ReminderList
            remindDaily={budgetSettings.reminders.remindDaily}
            remindWeeklyReview={budgetSettings.reminders.remindWeeklyReview}
            customMessages={budgetSettings.reminders.customMessages}
            onToggleDaily={handleToggleDaily}
            onToggleWeekly={handleToggleWeekly}
            onAddMessage={() => setShowMessageModal(true)}
            onRemoveMessage={handleRemoveMessage}
          />
          <Text style={[styles.helper, { color: colors.textSecondary, marginTop: 8 }]}>
            Personaliza el tono y la frecuencia de los recordatorios para mantenerte al día.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>Datos</Text>
          <SettingItem
            icon="trash-outline"
            title="Eliminar todos los datos"
            subtitle="Borra todos tus movimientos"
            onPress={handleClearData}
            color={colors.danger}
          />
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>Seguridad</Text>
          <SettingItem
            icon="log-out-outline"
            title="Cerrar sesion"
            subtitle="Vuelve a la pantalla de acceso"
            onPress={handleLogout}
            color={colors.danger}
          />
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>Acerca de</Text>
          <SettingItem
            icon="information-circle-outline"
            title="Acerca de GastosApp"
            subtitle="App de gastos personales"
          />
          <SettingItem
            icon="code-outline"
            title="Desarrollado con"
            subtitle="React Native + Expo"
          />
        </View>

        <View style={[styles.featuresCard, { backgroundColor: colors.card }]}>
          <Text style={[styles.featuresTitle, { color: colors.text }]}>Características</Text>
          <View style={styles.featuresList}>
            {FEATURE_LIST.map(item => (
              <FeatureItem key={item.text} icon={item.icon} text={item.text} colors={colors} />
            ))}
          </View>
        </View>

        <View style={styles.footer}>
          <Text style={[styles.footerText, { color: colors.textSecondary }]}>
            Hecho con cariño para gestionar tus finanzas
          </Text>
          <Text style={[styles.footerText, { color: colors.textSecondary }]}>© 2025 GastosApp</Text>
        </View>
      </ScrollView>

      <Modal visible={showMessageModal} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={[styles.modalCard, { backgroundColor: colors.card }]}>
            <Text style={[styles.modalTitle, { color: colors.text }]}>Nuevo recordatorio</Text>
            <TextInput
              value={newMessage}
              onChangeText={setNewMessage}
              placeholder="Escribe el mensaje"
              placeholderTextColor={colors.textSecondary}
              style={[styles.input, { color: colors.text, borderColor: colors.border, width: '100%' }]}
            />
            <View style={styles.modalActions}>
              <TouchableOpacity onPress={() => setShowMessageModal(false)}>
                <Text style={{ color: colors.textSecondary }}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleAddCustomMessage}>
                <Text style={{ color: colors.primary, fontWeight: '600' }}>Guardar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
}

const FeatureItem = ({
  icon,
  text,
  colors,
}: {
  icon: string;
  text: string;
  colors: any;
}) => (
  <View style={styles.featureItem}>
    <Text style={styles.featureIcon}>{icon}</Text>
    <Text style={[styles.featureText, { color: colors.text }]}>{text}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 16,
    paddingBottom: 48,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 12,
    marginLeft: 4,
    textTransform: 'uppercase',
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    marginBottom: 8,
    borderRadius: 12,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  settingText: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  settingSubtitle: {
    fontSize: 13,
  },
  card: {
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
    gap: 8,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
  },
  input: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
  },
  helper: {
    fontSize: 12,
  },
  featuresCard: {
    padding: 20,
    borderRadius: 16,
    marginBottom: 24,
  },
  featuresTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 16,
  },
  featuresList: {
    gap: 10,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  featureIcon: {
    fontSize: 20,
  },
  featureText: {
    fontSize: 15,
    flex: 1,
  },
  footer: {
    alignItems: 'center',
    paddingVertical: 24,
    gap: 4,
  },
  footerText: {
    fontSize: 13,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: '#00000080',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  modalCard: {
    width: '100%',
    borderRadius: 16,
    padding: 20,
    gap: 12,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});
