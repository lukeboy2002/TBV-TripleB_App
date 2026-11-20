/**
 * De tabbladen onderin. NativeTabs gebruikt de echte tabbalk van iOS en Android,
 * dus hij ziet er op elke telefoon "normaal" uit.
 *
 * Elke <NativeTabs.Trigger name="..."> hoort bij een bestand of map in deze map (tabs):
 * name="index" = index.tsx, name="games" = de map games/, enzovoort.
 * De haakjes in "(tabs)" betekenen: een groep, die NIET in de URL komt.
 *
 * Iconen: sf = Apple SF Symbols (iPhone), md = Material Symbols (Android).
 */
import { NativeTabs } from 'expo-router/native-tabs';

import { useTheme } from '@/constants/theme';

export default function TabLayout() {
  const theme = useTheme();

  return (
    <NativeTabs tintColor={theme.primary}>
      <NativeTabs.Trigger name="index">
        <NativeTabs.Trigger.Label>Stand</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon sf="trophy.fill" md="leaderboard" />
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="games">
        <NativeTabs.Trigger.Label>Uitslagen</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon sf="list.number" md="history" />
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="live">
        <NativeTabs.Trigger.Label>Live</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon sf="play.circle.fill" md="sports_score" />
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="agenda">
        <NativeTabs.Trigger.Label>Agenda</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon sf="calendar" md="event" />
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="profile">
        <NativeTabs.Trigger.Label>Profiel</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon sf="person.crop.circle" md="person" />
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}
