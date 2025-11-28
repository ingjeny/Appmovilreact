const DEFAULT_USERNAME = 'demo@gastosapp.dev';
const DEFAULT_PASSWORD = 'finanzas123';

export const AUTH_STORAGE_KEY = '@gastosapp:auth';
export const LOGIN_USERNAME = process.env.EXPO_PUBLIC_LOGIN_USERNAME || DEFAULT_USERNAME;
export const LOGIN_PASSWORD = process.env.EXPO_PUBLIC_LOGIN_PASSWORD || DEFAULT_PASSWORD;
export const LOGIN_HINT =
  process.env.EXPO_PUBLIC_LOGIN_HINT || 'Usa las credenciales predeterminadas para entrar.';
