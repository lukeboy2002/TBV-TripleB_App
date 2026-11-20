import { Stack } from 'expo-router';

export default function AgendaLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ title: 'Agenda', headerLargeTitle: true }} />
      <Stack.Screen name="[slug]" options={{ title: '' }} />
    </Stack>
  );
}
