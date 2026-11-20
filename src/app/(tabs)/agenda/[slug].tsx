/**
 * Eén event met wie er komt.
 *
 * Let op: de beschrijving op de site is HTML (uit de TipTap-editor). Voor nu halen we de
 * HTML-tags weg en tonen we platte tekst. Later kunnen we een HTML-weergave toevoegen.
 */
import { Image } from 'expo-image';
import { useLocalSearchParams } from 'expo-router';
import { ScrollView, StyleSheet } from 'react-native';

import { AttendanceButtons } from '@/components/attendance-buttons';
import { Avatar, Body, Card, ErrorView, Loading, Muted, Row, Title } from '@/components/ui';
import { Spacing, useTheme } from '@/constants/theme';
import { formatDate, formatTime } from '@/lib/format';
import { useEvent } from '@/lib/queries';

const STATUS_LABEL = { attending: '✅', maybe: '🤔', not_attending: '❌' } as const;

function stripHtml(html: string): string {
  return html
    .replace(/<\/(p|div|h\d|li)>/gi, '\n')
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<[^>]+>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

export default function EventDetailScreen() {
  const theme = useTheme();
  const { slug } = useLocalSearchParams<{ slug: string }>();
  const { data: event, isLoading, error, refetch } = useEvent(slug);

  if (isLoading) return <Loading />;
  if (error || !event) return <ErrorView error={error ?? new Error('Niet gevonden')} onRetry={refetch} />;

  return (
    <ScrollView
      style={{ backgroundColor: theme.background }}
      contentInsetAdjustmentBehavior="automatic"
      contentContainerStyle={styles.content}>
      {event.image_url && <Image source={{ uri: event.image_url }} style={styles.image} contentFit="cover" />}
      <Title>{event.title}</Title>
      <Muted>
        {formatDate(event.date)} · {formatTime(event.date)}
        {event.end_date ? ` t/m ${formatDate(event.end_date)}` : ''}
      </Muted>

      <AttendanceButtons slug={event.slug} current={event.my_status} />

      {event.body && <Body>{stripHtml(event.body)}</Body>}

      {event.attendees && event.attendees.length > 0 && (
        <Card>
          <Body style={{ fontWeight: '600' }}>Aanmeldingen</Body>
          {event.attendees.map((attendee) => (
            <Row key={attendee.player.id}>
              <Avatar uri={attendee.player.avatar_url} size={28} />
              <Body style={{ flex: 1 }}>{attendee.player.username}</Body>
              <Body>{STATUS_LABEL[attendee.status]}</Body>
            </Row>
          ))}
        </Card>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: { padding: Spacing.md, gap: Spacing.md },
  image: { width: '100%', aspectRatio: 16 / 9, borderRadius: 12 },
});
