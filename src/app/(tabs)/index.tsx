/**
 * De stand: alle spelers met hun statistieken, net als de tabel op de site.
 *
 * FlatList is de manier om lijsten te tonen in React Native. Hij tekent alleen
 * de rijen die op het scherm passen, dus ook met honderden rijen blijft het snel.
 * Naar beneden trekken (refreshing/onRefresh) laadt de stand opnieuw.
 */
import { useState } from 'react';
import { FlatList, Pressable, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { CupWinnerCard } from '@/components/cup-winner-card';
import { Avatar, Body, ErrorView, Loading, Muted, Row, Title } from '@/components/ui';
import { Spacing, useTheme } from '@/constants/theme';
import { useStandings, type StandingsSort } from '@/lib/queries';

const SORTS: { key: StandingsSort; label: string }[] = [
  { key: 'points', label: 'Punten' },
  { key: 'avg', label: 'Gem.' },
  { key: 'won', label: 'Gewonnen' },
  { key: 'cup', label: 'Bekers' },
  { key: 'played', label: 'Gespeeld' },
];

export default function StandingsScreen() {
  const theme = useTheme();
  const [sort, setSort] = useState<StandingsSort>('points');
  const { data, isLoading, error, refetch, isRefetching } = useStandings(sort);

  return (
    <SafeAreaView edges={['top']} style={[styles.screen, { backgroundColor: theme.background }]}>
      <Title style={styles.header}>Stand</Title>

      <Row style={styles.sorts}>
        {SORTS.map((option) => (
          <Pressable
            key={option.key}
            onPress={() => setSort(option.key)}
            style={[
              styles.chip,
              { backgroundColor: sort === option.key ? theme.primary : theme.card },
            ]}>
            <Muted style={{ color: sort === option.key ? theme.primaryText : theme.text }}>{option.label}</Muted>
          </Pressable>
        ))}
      </Row>

      {isLoading ? (
        <Loading />
      ) : error ? (
        <ErrorView error={error} onRetry={refetch} />
      ) : (
        <FlatList
          data={data}
          keyExtractor={(player) => String(player.id)}
          contentContainerStyle={styles.list}
          refreshing={isRefetching}
          onRefresh={refetch}
          ListHeaderComponent={<CupWinnerCard />}
          renderItem={({ item, index }) => (
            <Row style={[styles.row, { borderBottomColor: theme.border }]}>
              <Body style={styles.rank}>{index + 1}</Body>
              <Avatar uri={item.avatar_url} />
              <View style={{ flex: 1 }}>
                <Body style={{ fontWeight: '600' }}>{item.username}</Body>
                <Muted>
                  {item.stats?.played} gespeeld · {item.stats?.won} gewonnen · {item.stats?.cups} 🏆
                </Muted>
              </View>
              <View style={{ alignItems: 'flex-end' }}>
                <Body style={{ fontWeight: '700' }}>{item.stats?.points}</Body>
                <Muted>gem. {item.stats?.average.toFixed(1)}</Muted>
              </View>
            </Row>
          )}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  header: { paddingHorizontal: Spacing.md, paddingTop: Spacing.md },
  sorts: { paddingHorizontal: Spacing.md, paddingVertical: Spacing.sm, flexWrap: 'wrap' },
  chip: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 999 },
  list: { paddingHorizontal: Spacing.md, paddingBottom: Spacing.xl },
  row: { paddingVertical: 12, borderBottomWidth: StyleSheet.hairlineWidth },
  rank: { width: 24, textAlign: 'center', fontWeight: '700' },
});
