import { useColorScheme } from 'react-native';
import { Colors } from '../constants/Colors';

export function useThemeColor() {
  const colorScheme = useColorScheme();
  return Colors[colorScheme ?? 'light'];
}