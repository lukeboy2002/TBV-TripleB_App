/**
 * Inlogscherm. Spelers loggen in met hetzelfde e-mailadres en wachtwoord als op de site.
 *
 * useState bewaart wat je typt. Elke keer dat je een letter typt, verandert de state
 * en tekent React het scherm opnieuw. Vergelijk met wire:model in Livewire.
 */
import { Image } from 'expo-image';
import { useState } from 'react';
import { KeyboardAvoidingView, Platform, StyleSheet, TextInput, useColorScheme, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Body, Button, Muted } from '@/components/ui';
import { Spacing, useTheme } from '@/constants/theme';
import { useAuth } from '@/lib/auth';

export default function LoginScreen() {
  const theme = useTheme();
  const scheme = useColorScheme();
  const { signIn } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function handleLogin() {
    setError(null);
    setBusy(true);
    try {
      await signIn(email.trim(), password);
      // Gelukt: de Stack.Protected in _layout.tsx stuurt ons vanzelf naar de tabbladen.
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Inloggen mislukt.');
    } finally {
      setBusy(false);
    }
  }

  const inputStyle = [styles.input, { backgroundColor: theme.card, color: theme.text, borderColor: theme.border }];

  return (
    <SafeAreaView style={[styles.screen, { backgroundColor: theme.background }]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.content}>
        <Image
          source={
            scheme === 'dark'
              ? require('@/assets/images/logo-white.png')
              : require('@/assets/images/logo-black.png')
          }
          style={styles.logo}
          contentFit="contain"
        />

        <View style={{ gap: Spacing.sm }}>
          <TextInput
            style={inputStyle}
            placeholder="E-mailadres"
            placeholderTextColor={theme.textMuted}
            autoCapitalize="none"
            autoComplete="email"
            keyboardType="email-address"
            value={email}
            onChangeText={setEmail}
          />
          <TextInput
            style={inputStyle}
            placeholder="Wachtwoord"
            placeholderTextColor={theme.textMuted}
            secureTextEntry
            autoComplete="password"
            value={password}
            onChangeText={setPassword}
            onSubmitEditing={handleLogin}
          />
        </View>

        {error && <Body style={{ color: theme.danger }}>{error}</Body>}

        <Button title="Inloggen" onPress={handleLogin} loading={busy} disabled={!email || !password} />
        <Muted style={{ textAlign: 'center' }}>Alleen voor spelers van TBV TripleB</Muted>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  content: { flex: 1, justifyContent: 'center', padding: Spacing.lg, gap: Spacing.md },
  logo: { width: '100%', height: 180, marginBottom: Spacing.lg },
  input: { borderWidth: 1, borderRadius: 12, padding: 14, fontSize: 16 },
});
