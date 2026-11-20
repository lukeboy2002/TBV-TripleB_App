/** Je eigen profiel: je statistieken uit de stand, en uitloggen. */
import { ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Avatar, Body, Button, Card, Muted, Row, Title } from '@/components/ui';
import { Spacing, useTheme } from '@/constants/theme';
import { API_URL } from '@/lib/config';
import { useAuth } from '@/lib/auth';
import { useStandings } from '@/lib/queries';

export default function ProfileScreen() {
  const theme = useTheme();
  const { user, signOut } = useAuth();
  const { data: players } = useStandings('points');

  const rank = players ? players.findIndex((p) => p.id === user?.id) + 1 : 0;
  const stats = players?.find((p) => p.id === user?.id)?.stats;

  return (
    <SafeAreaView edges={['top']} style={[styles.screen, { backgroundColor: theme.background }]}>
      <ScrollView contentContainerStyle={styles.content}>
        <Row style={{ gap: Spacing.md }}>
          <Avatar uri={user?.avatar_url} size={72} />
          <View style={{ flex: 1 }}>
            <Title>{user?.username}</Title>
            <Muted>{user?.name}</Muted>
          </View>
        </Row>

        {stats && (
          <Card>
            <Body style={{ fontWeight: '600' }}>Mijn cijfers</Body>
            <Stat label="Plaats in de stand" value={rank > 0 ? `${rank}e` : '-'} />
            <Stat label="Punten" value={stats.points} />
            <Stat label="Gemiddeld" value={stats.average.toFixed(1)} />
            <Stat label="Gespeeld" value={stats.played} />
            <Stat label="Gewonnen" value={stats.won} />
            <Stat label="Bekers" value={stats.cups} />
          </Card>
        )}

        <Button title="Uitloggen" variant="secondary" onPress={signOut} />
        <Muted style={{ textAlign: 'center' }}>Verbonden met {API_URL}</Muted>
      </ScrollView>
    </SafeAreaView>
  );
}

function Stat({ label, value }: { label: string; value: string | number }) {
  return (
    <Row style={{ justifyContent: 'space-between' }}>
      <Muted>{label}</Muted>
      <Body style={{ fontWeight: '600' }}>{value}</Body>
    </Row>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  content: { padding: Spacing.md, gap: Spacing.md },
});
