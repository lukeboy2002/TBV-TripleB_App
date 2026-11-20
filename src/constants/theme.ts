/**
 * Kleuren en maten van de app op één plek, zoals je in Tailwind een thema hebt.
 * Er is een licht en een donker thema; useTheme() kiest automatisch op basis van de telefoon.
 */
import { useColorScheme } from 'react-native';

export const Colors = {
  light: {
    text: '#0a0a0a',
    textMuted: '#5f6368',
    background: '#ffffff',
    card: '#f2f3f5',
    border: '#e1e3e6',
    primary: '#0f7b3f', // groen van het biljartlaken
    primaryText: '#ffffff',
    danger: '#c62828',
    gold: '#b8860b',
  },
  dark: {
    text: '#ffffff',
    textMuted: '#a7abb1',
    background: '#000000',
    card: '#17181a',
    border: '#2a2c30',
    primary: '#22a35a',
    primaryText: '#ffffff',
    danger: '#ef5350',
    gold: '#e0b030',
  },
} as const;

export type Theme = (typeof Colors)['light'] | (typeof Colors)['dark'];

export function useTheme(): Theme {
  return useColorScheme() === 'dark' ? Colors.dark : Colors.light;
}

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
} as const;
