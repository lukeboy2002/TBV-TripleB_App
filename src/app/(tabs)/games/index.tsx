/**
 * Lijst van gespeelde wedstrijden. Een <Link> werkt als een <a href> op de site:
 * href="/games/12" opent het bestand games/[id].tsx met id = 12.
 */
import { Link } from 'expo-router';
import { FlatList, Pressable, StyleSheet } from 'react-native';

import { Body, Card, ErrorView, Loading, Muted } from '@/components/ui';
import { Spacing, useTheme } from '@/constants/theme';
import { formatDate, formatTime } from '@/lib/format';
import { useGames } from '@/lib/queries';

export default function GamesScreen() {
  const theme = useTheme();
  const { data, isLoading, error, refetch, isRefetching } = useGames();

  if (isLoading) return <Loading />;
  if (error) return <ErrorView error={error} onRetry={refetch} />;

  return (
    <FlatList
      style={{ backgroundColor: theme.background }}
      contentInsetAdjustmentBehavior="automatic"
      contentContainerStyle={styles.list}
      data={data}
      keyExtractor={(game) => String(game.id)}
      refreshing={isRefetching}
      onRefresh={refetch}
      ListEmptyComponent={<Muted>Nog geen wedstrijden gespeeld.</Muted>}
      renderItem={({ item }) => {
        const winner = item.players.find((gp) => gp.is_winner);
        const cup = item.players.find((gp) => gp.has_cup);
        return (
          <Link href={`/games/${item.id}`} asChild>
            <Pressable>
              <Card>
                <Muted>
                  {formatDate(item.date)} · {formatTime(item.date)}
                </Muted>
                <Body style={{ fontWeight: '700' }}>🥇 {winner?.player.username ?? '-'}</Body>
                <Muted>
                  🏆 {cup?.player.username ?? '-'} · {item.players.length} spelers
                </Muted>
              </Card>
            </Pressable>
          </Link>
        );
      }}
    />
  );
}

const styles = StyleSheet.create({
  list: { padding: Spacing.md, gap: Spacing.sm },
});
