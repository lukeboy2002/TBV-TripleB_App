/** Komende events, met direct de knoppen om je aan te melden. */
import { Link } from 'expo-router';
import { FlatList, Pressable, StyleSheet } from 'react-native';

import { AttendanceButtons } from '@/components/attendance-buttons';
import { Body, Card, ErrorView, Loading, Muted } from '@/components/ui';
import { Spacing, useTheme } from '@/constants/theme';
import { formatDate, formatTime } from '@/lib/format';
import { useEvents } from '@/lib/queries';

export default function AgendaScreen() {
  const theme = useTheme();
  const { data, isLoading, error, refetch, isRefetching } = useEvents();

  if (isLoading) return <Loading />;
  if (error) return <ErrorView error={error} onRetry={refetch} />;

  return (
    <FlatList
      style={{ backgroundColor: theme.background }}
      contentInsetAdjustmentBehavior="automatic"
      contentContainerStyle={styles.list}
      data={data}
      keyExtractor={(event) => String(event.id)}
      refreshing={isRefetching}
      onRefresh={refetch}
      ListEmptyComponent={<Muted>Er staat niets in de agenda.</Muted>}
      renderItem={({ item }) => (
        <Card>
          <Link href={`/agenda/${item.slug}`} asChild>
            <Pressable>
              <Muted>
                {formatDate(item.date)} · {formatTime(item.date)}
              </Muted>
              <Body style={{ fontWeight: '700' }}>{item.title}</Body>
              {item.description && <Muted numberOfLines={2}>{item.description}</Muted>}
              <Muted>
                ✅ {item.counts?.attending ?? 0} · 🤔 {item.counts?.maybe ?? 0} · ❌ {item.counts?.not_attending ?? 0}
              </Muted>
            </Pressable>
          </Link>
          <AttendanceButtons slug={item.slug} current={item.my_status} />
        </Card>
      )}
    />
  );
}

const styles = StyleSheet.create({
  list: { padding: Spacing.md, gap: Spacing.sm },
});
