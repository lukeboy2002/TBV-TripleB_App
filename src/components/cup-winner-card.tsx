/** De laatste bekerwinnaar met foto, bovenaan de stand (zoals op de homepage van de site). */
import { Image } from 'expo-image';
import { StyleSheet } from 'react-native';

import { Body, Card, Muted } from '@/components/ui';
import { Spacing } from '@/constants/theme';
import { formatDate } from '@/lib/format';
import { useCupWinner } from '@/lib/queries';

export function CupWinnerCard() {
  const { data } = useCupWinner();

  if (!data?.cup_photo_url) {
    return null;
  }

  return (
    <Card style={styles.card}>
      <Image source={{ uri: data.cup_photo_url }} style={styles.photo} contentFit="cover" />
      <Body style={{ fontWeight: '700' }}>🏆 Beker voor {data.player.username}</Body>
      <Muted>{formatDate(data.game_date)}</Muted>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: { marginVertical: Spacing.sm },
  photo: { width: '100%', aspectRatio: 4 / 3, borderRadius: 10 },
});
