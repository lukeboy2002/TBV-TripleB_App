/**
 * Detail van één wedstrijd. useLocalSearchParams leest het stukje [id] uit de URL,
 * net als een route-parameter {game} in Laravel.
 */
import { Image } from 'expo-image';
import { useLocalSearchParams } from 'expo-router';
import { ScrollView, StyleSheet } from 'react-native';

import { GameResult } from '@/components/game-result';
import { Card, ErrorView, Loading, Muted, Title } from '@/components/ui';
import { Spacing, useTheme } from '@/constants/theme';
import { formatDate, formatTime } from '@/lib/format';
import { useGame } from '@/lib/queries';

export default function GameDetailScreen() {
  const theme = useTheme();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data: game, isLoading, error, refetch } = useGame(Number(id));

  if (isLoading) return <Loading />;
  if (error || !game) return <ErrorView error={error ?? new Error('Niet gevonden')} onRetry={refetch} />;

  const cupPhoto = game.players.find((gp) => gp.cup_photo_url)?.cup_photo_url;

  return (
    <ScrollView
      style={{ backgroundColor: theme.background }}
      contentInsetAdjustmentBehavior="automatic"
      contentContainerStyle={styles.content}>
      <Title>{formatDate(game.date)}</Title>
      <Muted>Gestart om {formatTime(game.date)}</Muted>
      {cupPhoto && <Image source={{ uri: cupPhoto }} style={styles.photo} contentFit="cover" />}
      <Card>
        <GameResult players={game.players} />
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: { padding: Spacing.md, gap: Spacing.md },
  photo: { width: '100%', aspectRatio: 4 / 3, borderRadius: 12 },
});
