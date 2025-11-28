import React from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { Redirect } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { AUTH_STORAGE_KEY } from '../constants/auth';
import { useThemeColor } from '../hooks/use-theme-color';

type ScreenState = 'checking' | 'login' | 'app';

export default function Index() {
  const colors = useThemeColor();
  const [state, setState] = React.useState<ScreenState>('checking');

  React.useEffect(() => {
    const checkSession = async () => {
      const token = await AsyncStorage.getItem(AUTH_STORAGE_KEY);
      setState(token ? 'app' : 'login');
    };

    void checkSession();
  }, []);

  if (state === 'checking') {
    return (
      <View style={[styles.loading, { backgroundColor: colors.background }]}>
        <ActivityIndicator color={colors.primary} />
      </View>
    );
  }

  if (state === 'app') {
    return <Redirect href="/(tabs)" />;
  }

  return <Redirect href="/login" />;
}

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
