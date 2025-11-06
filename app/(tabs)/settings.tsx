import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useThemeColor } from '../../hooks/use-theme-color';
import { useMovements } from '../../hooks/useMovements';

export default function SettingsScreen() {
  const colors = useThemeColor();
  const { clearAll, movements } = useMovements();

  const handleClearData = () => {
    Alert.alert(
      'Eliminar todos los datos',
      '¿Estás seguro? Esta acción no se puede deshacer.',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: async () => {
            await clearAll();
            Alert.alert('Éxito', 'Todos los datos han sido eliminados');
          },
        },
      ]
    );
  };

  const SettingItem = ({ 
    icon, 
    title, 
    subtitle, 
    onPress, 
    color 
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
            <Text style={[styles.settingSubtitle, { color: colors.textSecondary }]}>
              {subtitle}
            </Text>
          )}
        </View>
      </View>
      {onPress && <Ionicons name="chevron-forward" size={20} color={colors.textSecondary} />}
    </TouchableOpacity>
  );

  return (
    <ScrollView 
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={styles.content}
    >
      {/* Información de la App */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>
          INFORMACIÓN
        </Text>
        <SettingItem
          icon="wallet-outline"
          title="GastosApp"
          subtitle="Versión 1.0.0"
        />
        <SettingItem
          icon="bar-chart-outline"
          title="Total de Movimientos"
          subtitle={`${movements.length} registros`}
        />
      </View>

      {/* Datos */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>
          DATOS
        </Text>
        <SettingItem
          icon="trash-outline"
          title="Eliminar todos los datos"
          subtitle="Borra todos tus movimientos"
          onPress={handleClearData}
          color={colors.danger}
        />
      </View>

      {/* Acerca de */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>
          ACERCA DE
        </Text>
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

      {/* Características */}
      <View style={[styles.featuresCard, { backgroundColor: colors.card }]}>
        <Text style={[styles.featuresTitle, { color: colors.text }]}>
          ✨ Características
        </Text>
        <View style={styles.featuresList}>
          <FeatureItem 
            icon="📊" 
            text="Análisis detallado de gastos e ingresos" 
            colors={colors}
          />
          <FeatureItem 
            icon="📈" 
            text="Gráficos interactivos por categoría" 
            colors={colors}
          />
          <FeatureItem 
            icon="💰" 
            text="Control de balance en tiempo real" 
            colors={colors}
          />
          <FeatureItem 
            icon="🎨" 
            text="Interfaz moderna y amigable" 
            colors={colors}
          />
          <FeatureItem 
            icon="🌙" 
            text="Soporte para modo oscuro" 
            colors={colors}
          />
          <FeatureItem 
            icon="📱" 
            text="Diseño responsive y optimizado" 
            colors={colors}
          />
        </View>
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={[styles.footerText, { color: colors.textSecondary }]}>
          Hecho con ❤️ para gestionar tus finanzas
        </Text>
        <Text style={[styles.footerText, { color: colors.textSecondary }]}>
          © 2024 GastosApp
        </Text>
      </View>
    </ScrollView>
  );
}

const FeatureItem = ({ 
  icon, 
  text, 
  colors 
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
    paddingBottom: 32,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 8,
    marginLeft: 16,
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
  featuresCard: {
    padding: 20,
    borderRadius: 16,
    marginBottom: 24,
  },
  featuresTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  featuresList: {
    gap: 12,
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
    gap: 8,
  },
  footerText: {
    fontSize: 13,
  },
});