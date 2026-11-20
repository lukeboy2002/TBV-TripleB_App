/**
 * Kleine bouwstenen die op elk scherm terugkomen, net als Blade-componenten
 * (<x-button>, <x-card>). In React Native gebruik je <View> in plaats van <div>
 * en <Text> in plaats van <p> of <span>. Alle tekst MOET in een <Text> staan.
 */
import { Image } from 'expo-image';
import type { PropsWithChildren, ReactNode } from 'react';
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  View,
  type StyleProp,
  type TextStyle,
  type ViewStyle,
} from 'react-native';

import { Spacing, useTheme } from '@/constants/theme';

type TextProps = PropsWithChildren<{ style?: StyleProp<TextStyle>; numberOfLines?: number }>;

export function Title({ children, style }: TextProps) {
  const theme = useTheme();
  return <Text style={[styles.title, { color: theme.text }, style]}>{children}</Text>;
}

export function Body({ children, style, numberOfLines }: TextProps) {
  const theme = useTheme();
  return (
    <Text numberOfLines={numberOfLines} style={[styles.body, { color: theme.text }, style]}>
      {children}
    </Text>
  );
}

export function Muted({ children, style, numberOfLines }: TextProps) {
  const theme = useTheme();
  return (
    <Text numberOfLines={numberOfLines} style={[styles.muted, { color: theme.textMuted }, style]}>
      {children}
    </Text>
  );
}

export function Card({ children, style }: PropsWithChildren<{ style?: StyleProp<ViewStyle> }>) {
  const theme = useTheme();
  return <View style={[styles.card, { backgroundColor: theme.card }, style]}>{children}</View>;
}

type ButtonProps = {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'danger';
  disabled?: boolean;
  loading?: boolean;
  style?: StyleProp<ViewStyle>;
};

export function Button({ title, onPress, variant = 'primary', disabled, loading, style }: ButtonProps) {
  const theme = useTheme();
  const backgroundColor =
    variant === 'primary' ? theme.primary : variant === 'danger' ? theme.danger : theme.card;
  const color = variant === 'secondary' ? theme.text : theme.primaryText;

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || loading}
      // "pressed" is true zolang je vinger op de knop staat: dan maken we hem iets doorzichtig.
      style={({ pressed }) => [
        styles.button,
        { backgroundColor, opacity: disabled ? 0.4 : pressed ? 0.7 : 1 },
        style,
      ]}>
      {loading ? <ActivityIndicator color={color} /> : <Text style={[styles.buttonText, { color }]}>{title}</Text>}
    </Pressable>
  );
}

export function Avatar({ uri, size = 40 }: { uri?: string | null; size?: number }) {
  const theme = useTheme();
  return (
    <Image
      source={uri ? { uri } : undefined}
      style={{ width: size, height: size, borderRadius: size / 2, backgroundColor: theme.border }}
      contentFit="cover"
    />
  );
}

export function Loading() {
  const theme = useTheme();
  return (
    <View style={styles.center}>
      <ActivityIndicator color={theme.primary} size="large" />
    </View>
  );
}

export function ErrorView({ error, onRetry }: { error: Error; onRetry?: () => void }) {
  return (
    <View style={[styles.center, { gap: Spacing.md }]}>
      <Body style={{ textAlign: 'center' }}>{error.message}</Body>
      {onRetry && <Button title="Opnieuw proberen" onPress={onRetry} variant="secondary" />}
    </View>
  );
}

export function Row({ children, style }: { children: ReactNode; style?: StyleProp<ViewStyle> }) {
  return <View style={[styles.row, style]}>{children}</View>;
}

const styles = StyleSheet.create({
  title: { fontSize: 22, fontWeight: '700' },
  body: { fontSize: 16 },
  muted: { fontSize: 14 },
  card: { borderRadius: 14, padding: Spacing.md, gap: Spacing.sm },
  button: {
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: Spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: { fontSize: 16, fontWeight: '600' },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: Spacing.lg },
  row: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm },
});
