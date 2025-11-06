import { Stack } from 'expo-router';
import { useColorScheme } from 'react-native';
import { Colors } from '../../constants/Colors';

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: colors.background,
        },
        headerTintColor: colors.text,
        headerShadowVisible: false,
        contentStyle: {
          backgroundColor: colors.background,
        },
      }}
    >
      <Stack.Screen 
        name="index" 
        options={{ headerShown: false }} 
      />
      <Stack.Screen 
        name="movements" 
        options={{ title: 'Movimientos' }} 
      />
      <Stack.Screen 
        name="analytics" 
        options={{ title: 'Análisis' }} 
      />
      <Stack.Screen 
        name="settings" 
        options={{ title: 'Configuración' }} 
      />
      <Stack.Screen 
        name="add-movement" 
        options={{ 
          title: 'Nuevo Movimiento',
          presentation: 'modal',
        }} 
      />
    </Stack>
  );
}