/**
 * Live: een wedstrijd starten en bijhouden aan de biljarttafel.
 *
 * Dit scherm heeft drie "standen":
 * 1. Er loopt geen wedstrijd  -> spelers aanvinken en starten.
 * 2. Er loopt een wedstrijd   -> op "Af" tikken als iemand afvalt.
 * 3. Wedstrijd net afgelopen  -> uitslag zien en de bekerfoto maken.
 *
 * Alle regels (punten, wie wint) blijven in Laravel. De app stuurt alleen
 * "deze speler is af" en laat zien wat de server terugstuurt.
 */
import * as ImagePicker from 'expo-image-picker';
import { useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { GameResult } from '@/components/game-result';
import { Avatar, Body, Button, Card, ErrorView, Loading, Muted, Row, Title } from '@/components/ui';
import { Spacing, useTheme } from '@/constants/theme';
import type { Game, LiveGame } from '@/lib/types';
import {
  useCurrentGame,
  useEliminatePlayer,
  useStandings,
  useStartGame,
  useUploadCupPhoto,
} from '@/lib/queries';

export default function LiveScreen() {
  const theme = useTheme();
  const { data: current, isLoading, error, refetch } = useCurrentGame();
  // Bewaart de uitslag van de wedstrijd die net in deze app is afgelopen (voor de bekerfoto).
  const [finished, setFinished] = useState<Game | null>(null);

  let content;
  if (isLoading) {
    content = <Loading />;
  } else if (error) {
    content = <ErrorView error={error} onRetry={refetch} />;
  } else if (finished) {
    content = <FinishedGame game={finished} onClose={() => setFinished(null)} />;
  } else if (current) {
    content = <RunningGame game={current} onFinished={setFinished} />;
  } else {
    content = <StartGame />;
  }

  return (
    <SafeAreaView edges={['top']} style={[styles.screen, { backgroundColor: theme.background }]}>
      {content}
    </SafeAreaView>
  );
}

function StartGame() {
  const theme = useTheme();
  const { data: players, isLoading } = useStandings('points');
  const startGame = useStartGame();
  // Set = een lijstje zonder dubbelen; handig voor aangevinkte spelers.
  const [selected, setSelected] = useState<Set<number>>(new Set());

  if (isLoading || !players) return <Loading />;

  const allSelected = selected.size === players.length;

  function toggle(id: number) {
    const next = new Set(selected);
    if (next.has(id)) {
      next.delete(id);
    } else {
      next.add(id);
    }
    setSelected(next);
  }

  return (
    <ScrollView contentContainerStyle={styles.content}>
      <Title>Nieuwe wedstrijd</Title>
      <Muted>Vink aan wie er meespeelt.</Muted>

      <Button
        title={allSelected ? 'Niemand' : 'Iedereen'}
        variant="secondary"
        onPress={() => setSelected(allSelected ? new Set() : new Set(players.map((p) => p.id)))}
      />

      <Card>
        {players.map((player) => {
          const isOn = selected.has(player.id);
          return (
            <Pressable key={player.id} onPress={() => toggle(player.id)}>
              <Row style={styles.playerRow}>
                <Avatar uri={player.avatar_url} size={32} />
                <Body style={{ flex: 1 }}>{player.username}</Body>
                <View
                  style={[
                    styles.checkbox,
                    { borderColor: theme.primary, backgroundColor: isOn ? theme.primary : 'transparent' },
                  ]}
                />
              </Row>
            </Pressable>
          );
        })}
      </Card>

      {startGame.error && <Body style={{ color: theme.danger }}>{startGame.error.message}</Body>}

      <Button
        title={`Start met ${selected.size} spelers`}
        disabled={selected.size < 2}
        loading={startGame.isPending}
        onPress={() => startGame.mutate([...selected])}
      />
    </ScrollView>
  );
}

function RunningGame({ game, onFinished }: { game: LiveGame; onFinished: (game: Game) => void }) {
  const theme = useTheme();
  const eliminate = useEliminatePlayer(game.id);

  function confirmEliminate(userId: number, username: string) {
    // Een bevestiging, zodat je niet per ongeluk de verkeerde speler laat afvallen.
    Alert.alert('Speler af?', `${username} is af.`, [
      { text: 'Annuleren', style: 'cancel' },
      {
        text: 'Ja, af',
        style: 'destructive',
        onPress: () =>
          eliminate.mutate(userId, {
            onSuccess: (result) => {
              if (result.completed) {
                onFinished(result.data as Game);
              }
            },
          }),
      },
    ]);
  }

  return (
    <ScrollView contentContainerStyle={styles.content}>
      <Title>Wedstrijd bezig</Title>
      <Muted>Tik op Af als een speler eruit ligt. De laatste die overblijft wint.</Muted>

      <Card>
        {game.remaining.map((gp) => (
          <Row key={gp.player.id} style={styles.playerRow}>
            <Avatar uri={gp.player.avatar_url} size={40} />
            <Body style={{ flex: 1, fontWeight: '600' }}>{gp.player.username}</Body>
            <Button
              title="Af"
              variant="danger"
              style={styles.outButton}
              disabled={eliminate.isPending}
              onPress={() => confirmEliminate(gp.player.id, gp.player.username)}
            />
          </Row>
        ))}
      </Card>

      {eliminate.error && <Body style={{ color: theme.danger }}>{eliminate.error.message}</Body>}

      {game.eliminated.length > 0 && (
        <>
          <Body style={{ fontWeight: '600' }}>Al af</Body>
          <Card>
            {game.eliminated.map((gp) => (
              <Row key={gp.player.id} style={styles.playerRow}>
                <Muted style={{ width: 24 }}>{gp.position}.</Muted>
                <Muted style={{ flex: 1 }}>
                  {gp.player.username}
                  {gp.has_cup ? ' 🏆' : ''}
                </Muted>
                <Muted>{gp.points} pt</Muted>
              </Row>
            ))}
          </Card>
        </>
      )}
    </ScrollView>
  );
}

function FinishedGame({ game, onClose }: { game: Game; onClose: () => void }) {
  const theme = useTheme();
  const upload = useUploadCupPhoto(game.id);
  const cup = game.players.find((gp) => gp.has_cup);
  const [uploaded, setUploaded] = useState(false);

  async function takePhoto() {
    // Eerst toestemming vragen voor de camera. De telefoon toont dan zelf een pop-up.
    const permission = await ImagePicker.requestCameraPermissionsAsync();
    if (!permission.granted) {
      Alert.alert('Geen toegang', 'Geef de app toegang tot de camera in je instellingen.');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({ mediaTypes: ['images'], quality: 0.7 });
    if (result.canceled) return;

    upload.mutate(result.assets[0], { onSuccess: () => setUploaded(true) });
  }

  return (
    <ScrollView contentContainerStyle={styles.content}>
      <Title>Afgelopen! 🎉</Title>
      <Card>
        <GameResult players={game.players} />
      </Card>

      {cup && !uploaded && (
        <Button
          title={`Bekerfoto van ${cup.player.username} maken`}
          loading={upload.isPending}
          onPress={takePhoto}
        />
      )}
      {uploaded && <Body style={{ color: theme.primary }}>Bekerfoto staat op de site ✔</Body>}
      {upload.error && <Body style={{ color: theme.danger }}>{upload.error.message}</Body>}

      <Button title="Nieuwe wedstrijd" variant="secondary" onPress={onClose} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  content: { padding: Spacing.md, gap: Spacing.md, paddingBottom: Spacing.xl },
  playerRow: { paddingVertical: 6 },
  checkbox: { width: 24, height: 24, borderRadius: 6, borderWidth: 2 },
  outButton: { paddingVertical: 8, paddingHorizontal: 18 },
});
