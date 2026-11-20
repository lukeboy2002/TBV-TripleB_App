/** De uitslag van één wedstrijd: winnaar bovenaan, beker (eerst afgevallen) onderaan. */
import { StyleSheet, View } from 'react-native';

import { Avatar, Body, Muted, Row } from '@/components/ui';
import { useTheme } from '@/constants/theme';
import type { GamePlayer } from '@/lib/types';

export function GameResult({ players }: { players: GamePlayer[] }) {
  const theme = useTheme();

  return (
    <View>
      {players.map((gp) => (
        <Row key={gp.player.id} style={[styles.row, { borderBottomColor: theme.border }]}>
          <Avatar uri={gp.player.avatar_url} size={32} />
          <Body style={{ flex: 1, fontWeight: gp.is_winner ? '700' : '400' }}>
            {gp.is_winner ? '🥇 ' : ''}
            {gp.player.username}
            {gp.has_cup ? ' 🏆' : ''}
          </Body>
          <Muted>{gp.points} pt</Muted>
        </Row>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { paddingVertical: 8, borderBottomWidth: StyleSheet.hairlineWidth },
});
