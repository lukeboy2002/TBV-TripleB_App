/**
 * Binnen het tabblad "Uitslagen" gebruiken we een Stack: een stapel schermen.
 * Tik je op een wedstrijd, dan schuift het detailscherm erbovenop,
 * met automatisch een terug-knop.
 */
import { Stack } from 'expo-router';

export default function GamesLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ title: 'Uitslagen', headerLargeTitle: true }} />
      <Stack.Screen name="[id]" options={{ title: 'Wedstrijd' }} />
    </Stack>
  );
}
