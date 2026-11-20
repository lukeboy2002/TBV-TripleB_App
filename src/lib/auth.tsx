/**
 * Inloggen en uitloggen, en onthouden wie er is ingelogd.
 *
 * Dit is een React "Context": een manier om gegevens (hier: het token en de speler)
 * aan alle schermen te geven zonder ze overal door te geven. Vergelijk het met
 * auth()->user() in Laravel, dat je ook overal kunt opvragen.
 *
 * Het token bewaren we in SecureStore: de versleutelde kluis van de telefoon
 * (Keychain op iPhone, Keystore op Android). Zo blijf je ingelogd als je de app sluit.
 */
import * as Device from 'expo-device';
import * as SecureStore from 'expo-secure-store';
import { createContext, use, useEffect, useState, type PropsWithChildren } from 'react';

import { api, ApiError } from './api';
import type { Me } from './types';

const TOKEN_KEY = 'tripleb-token';

type AuthState = {
  token: string | null;
  user: Me | null;
  /** true zolang we bij het opstarten nog in de kluis kijken */
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthState | null>(null);

export function AuthProvider({ children }: PropsWithChildren) {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<Me | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Eén keer bij het opstarten: staat er nog een token in de kluis? Dan vragen we /me op.
  useEffect(() => {
    (async () => {
      try {
        const saved = await SecureStore.getItemAsync(TOKEN_KEY);
        if (saved) {
          const me = await api<{ data: Me }>('/me', { token: saved });
          setToken(saved);
          setUser(me.data);
        }
      } catch (error) {
        // Token verlopen of ingetrokken (bijv. speler geblokkeerd): opnieuw inloggen.
        if (error instanceof ApiError && (error.status === 401 || error.status === 403)) {
          await SecureStore.deleteItemAsync(TOKEN_KEY);
        }
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  async function signIn(email: string, password: string) {
    const result = await api<{ token: string; user: Me }>('/login', {
      method: 'POST',
      body: { email, password, device_name: Device.deviceName ?? 'TripleB-app' },
    });
    await SecureStore.setItemAsync(TOKEN_KEY, result.token);
    setToken(result.token);
    setUser(result.user);
  }

  async function signOut() {
    try {
      await api('/logout', { method: 'POST', token });
    } catch {
      // Ook als de server niet bereikbaar is, loggen we lokaal uit.
    }
    await SecureStore.deleteItemAsync(TOKEN_KEY);
    setToken(null);
    setUser(null);
  }

  return <AuthContext value={{ token, user, isLoading, signIn, signOut }}>{children}</AuthContext>;
}

export function useAuth(): AuthState {
  const context = use(AuthContext);
  if (!context) {
    throw new Error('useAuth moet binnen <AuthProvider> gebruikt worden');
  }
  return context;
}
