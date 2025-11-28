import React from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';

import { useThemeColor } from '../hooks/use-theme-color';
import { AUTH_STORAGE_KEY, LOGIN_HINT, LOGIN_PASSWORD, LOGIN_USERNAME } from '../constants/auth';

export default function LoginScreen() {
  const colors = useThemeColor();
  const router = useRouter();
  const [username, setUsername] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [error, setError] = React.useState('');
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const handleLogin = async () => {
    setError('');
    setIsSubmitting(true);
    try {
      const isValidUser = username.trim() === LOGIN_USERNAME;
      const isValidPassword = password === LOGIN_PASSWORD;

      if (!isValidUser || !isValidPassword) {
        setError('Las credenciales son incorrectas. Intenta nuevamente.');
        return;
      }

      await AsyncStorage.setItem(AUTH_STORAGE_KEY, 'true');
      router.replace('/(tabs)');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: colors.background }]}
      behavior={Platform.select({ ios: 'padding', android: undefined })}
    >
      <View style={styles.card}>
        <View style={[styles.hero, { backgroundColor: colors.card }]}>
          <Ionicons name="wallet-outline" size={52} color={colors.primary} />
          <Text style={[styles.title, { color: colors.text }]}>Bienvenido a GastosApp</Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
            Ingresa para revisar tus movimientos y presupuestos diarios.
          </Text>
        </View>

        <View style={styles.form}>
          <Text style={[styles.label, { color: colors.text }]}>Correo</Text>
          <TextInput
            value={username}
            onChangeText={setUsername}
            placeholder="correo@ejemplo.com"
            placeholderTextColor={colors.textSecondary}
            autoCapitalize="none"
            keyboardType="email-address"
            style={[
              styles.input,
              { borderColor: colors.border, color: colors.text, backgroundColor: colors.card },
            ]}
            editable={!isSubmitting}
          />

          <Text style={[styles.label, { color: colors.text }]}>Contrasena</Text>
          <TextInput
            value={password}
            onChangeText={setPassword}
            placeholder="********"
            placeholderTextColor={colors.textSecondary}
            secureTextEntry
            style={[
              styles.input,
              { borderColor: colors.border, color: colors.text, backgroundColor: colors.card },
            ]}
            editable={!isSubmitting}
          />

          {LOGIN_HINT ? (
            <Text style={[styles.hint, { color: colors.textSecondary }]}>Pista: {LOGIN_HINT}</Text>
          ) : null}

          {error ? <Text style={[styles.error, { color: colors.danger }]}>{error}</Text> : null}

          <TouchableOpacity
            style={[styles.button, { backgroundColor: colors.primary }]}
            onPress={handleLogin}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <ActivityIndicator color="#fff" />
            ) : (
            <Text style={styles.buttonText}>Iniciar sesion</Text>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 24,
  },
  card: {
    width: '100%',
    maxWidth: 480,
    alignSelf: 'center',
    gap: 24,
  },
  hero: {
    borderRadius: 24,
    padding: 24,
    alignItems: 'center',
    gap: 12,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    textAlign: 'center',
  },
  subtitle: {
    textAlign: 'center',
    fontSize: 14,
    lineHeight: 20,
  },
  form: {
    gap: 12,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
  },
  input: {
    borderWidth: 1,
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 16,
  },
  hint: {
    fontSize: 13,
  },
  error: {
    fontSize: 13,
  },
  button: {
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

